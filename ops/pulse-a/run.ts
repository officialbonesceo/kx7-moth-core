/**
 * pulse-a — research (DDG/Wiki) → AI rewrite (CF then OpenRouter) → D1
 * Loud logs. Template catalog is fallback only when AI fails.
 */
import { allTopicBodies } from './topics';
import { expandItem, pickBatch, CATALOG } from './catalog';
import { pickQueries, researchTopic, packToContext } from './research';
import { rewriteWithAi } from './ai';

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const CF_D1_DATABASE_ID = process.env.CF_D1_DATABASE_ID || '';
const BATCH = Math.min(5, Math.max(1, Number(process.env.PULSE_BATCH || 5)));

type Category = 'money' | 'opportunities' | 'scams' | 'guides';

interface ArticleDraft {
  title: string;
  summary: string;
  content: string;
  category: Category;
  reading_minutes: number;
  source_name?: string;
  source_url?: string;
  image_url?: string;
  author_team?: string;
}

let HAS_AUTHOR_TEAM = true;

function slugify(t: string) {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function injectLinks(content: string) {
  const links: Record<string, string> = {
    CapCut: 'https://www.capcut.com/',
    Canva: 'https://www.canva.com/',
    Fiverr: 'https://www.fiverr.com/',
    Upwork: 'https://www.upwork.com/',
  };
  let out = content;
  for (const [name, url] of Object.entries(links)) {
    if (out.includes(url)) continue;
    out = out.replace(new RegExp(`\\b(${name})\\b`, 'g'), `<a href="${url}" target="_blank" rel="noopener noreferrer">$1</a>`);
  }
  return out;
}

function coverForTitle(title: string, category: string) {
  const t = `${title} ${category}`.toLowerCase();
  if (category === 'scams' || /scam|fraud|phish|telegram/.test(t)) return '/covers/scams.svg';
  if (/crypto|usdt|bitcoin|airdrop|wallet|p2p|token/.test(t)) return '/covers/crypto.svg';
  if (/hustle|freelance|content|youtube|tiktok|affiliate|drop|creator|skill/.test(t))
    return '/covers/hustle.svg';
  if (category === 'money' || /budget|fee|naira|payment|price/.test(t)) return '/covers/money.svg';
  return '/covers/fallback.svg';
}

async function d1(sql: string, params: any[] = [], quiet = false) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${CF_API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, params }),
    }
  );
  const text = await res.text();
  let parsed: any = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = null;
  }
  const errMsg = JSON.stringify(parsed?.errors || parsed?.result || text).slice(0, 300);
  const duplicateCol = /duplicate column/i.test(errMsg);
  const ok =
    res.ok &&
    parsed &&
    parsed.success !== false &&
    !(Array.isArray(parsed.errors) && parsed.errors.length) &&
    !(Array.isArray(parsed.result) && parsed.result.some((r: any) => r && r.success === false));
  if (!ok) {
    if (!(quiet && duplicateCol)) console.error('[pulse-a] D1 FAIL', res.status, errMsg);
    return null;
  }
  return parsed;
}

async function ensureSchema() {
  await d1(`ALTER TABLE articles ADD COLUMN author_team TEXT`, [], true);
  await d1(`ALTER TABLE articles ADD COLUMN source_name TEXT`, [], true);
  await d1(`ALTER TABLE articles ADD COLUMN source_url TEXT`, [], true);
  HAS_AUTHOR_TEAM = !!(await d1(`SELECT author_team FROM articles LIMIT 1`));
  console.log('[pulse-a] HAS_AUTHOR_TEAM', HAS_AUTHOR_TEAM);
}

async function loadTitles(): Promise<Set<string>> {
  const data = await d1(`SELECT title FROM articles LIMIT 1000`);
  const rows = data?.result?.[0]?.results || data?.results || [];
  return new Set((rows || []).map((r: any) => String(r.title || '')));
}

async function exists(title: string) {
  const data = await d1(`SELECT id FROM articles WHERE title = ? LIMIT 1`, [title]);
  const rows = data?.result?.[0]?.results || data?.results || [];
  return Array.isArray(rows) && rows.length > 0;
}

async function publish(draft: ArticleDraft) {
  const id = 'a_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const slug = `${slugify(draft.title) || 'article'}-${id.slice(-5)}`;

  if (HAS_AUTHOR_TEAM) {
    const data = await d1(
      `INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, status, author_team, source_name, source_url, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, datetime('now'), datetime('now'), datetime('now'))`,
      [
        id,
        slug,
        draft.title,
        draft.summary,
        draft.content,
        draft.category,
        draft.image_url || null,
        draft.reading_minutes,
        draft.author_team || 'LaneCash Desk',
        draft.source_name || 'LaneCash Desk',
        draft.source_url || null,
      ]
    );
    if (data) {
      console.log('[pulse-a] published:', draft.title);
      return true;
    }
    HAS_AUTHOR_TEAM = false;
  }

  const data2 = await d1(
    `INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, status, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', datetime('now'), datetime('now'), datetime('now'))`,
    [id, slug, draft.title, draft.summary, draft.content, draft.category, draft.image_url || null, draft.reading_minutes]
  );
  if (!data2) {
    console.error('[pulse-a] PUBLISH FAILED:', draft.title);
    return false;
  }
  console.log('[pulse-a] published:', draft.title);
  return true;
}

async function publishFromResearch(titles: Set<string>): Promise<number> {
  const queries = pickQueries(BATCH);
  console.log('[pulse-a] research queries', queries.length);
  let published = 0;

  for (const q of queries) {
    try {
      const pack = await researchTopic(q);
      if (!pack.hits.length && !pack.tools.length) {
        console.warn('[pulse-a] no research hits for', q);
        continue;
      }
      const ctx = packToContext(pack);
      const seedTitle = pack.hits[0]?.title || q;
      const ai = await rewriteWithAi(ctx, seedTitle);
      if (!ai) {
        console.warn('[pulse-a] AI failed for query, skipping (no silent fake article)');
        continue;
      }
      if (await exists(ai.title) || titles.has(ai.title)) {
        // force uniqueness
        ai.title = `${ai.title} (${new Date().toISOString().slice(0, 10)})`;
        if (await exists(ai.title)) {
          console.log('[pulse-a] skip duplicate', ai.title);
          continue;
        }
      }
      const ok = await publish({
        title: ai.title,
        summary: ai.summary,
        content: injectLinks(ai.contentHtml),
        category: ai.category,
        reading_minutes: 10,
        author_team: ai.author_team,
        source_name: `AI+research (${ai.model})`,
        source_url: pack.hits[0]?.url || null,
        image_url: coverForTitle(ai.title, ai.category),
      });
      if (ok) {
        published++;
        titles.add(ai.title);
      }
    } catch (e) {
      console.error('[pulse-a] research/ai item error', e);
    }
  }
  return published;
}

async function publishTemplates(titles: Set<string>): Promise<number> {
  let published = 0;
  for (const body of allTopicBodies()) {
    if (titles.has(body.title) || (await exists(body.title))) continue;
    const ok = await publish({
      title: body.title,
      summary: body.summary,
      content: injectLinks(body.content),
      category: body.category as Category,
      reading_minutes: 12,
      author_team: body.author_team,
      source_name: 'LaneCash Desk',
      image_url: coverForTitle(body.title, body.category),
    });
    if (ok) {
      published++;
      titles.add(body.title);
    }
  }
  const batch = pickBatch(Math.max(0, BATCH - published), titles);
  for (const item of batch) {
    if (await exists(item.title)) continue;
    const exp = expandItem(item);
    const ok = await publish({
      title: exp.title,
      summary: exp.summary,
      content: injectLinks(exp.content),
      category: exp.category,
      reading_minutes: 10,
      author_team: exp.author_team,
      source_name: 'LaneCash Desk',
      image_url: coverForTitle(exp.title, exp.category),
    });
    if (ok) {
      published++;
      titles.add(item.title);
    }
  }
  return published;
}

async function main() {
  console.log('[pulse-a] start batch', BATCH, 'mode=research+ai');
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error('[pulse-a] FATAL missing Cloudflare credentials');
    process.exit(1);
  }
  await ensureSchema();

  const titles = await loadTitles();
  console.log('[pulse-a] existing titles', titles.size);

  let published = await publishFromResearch(titles);
  console.log('[pulse-a] from research+ai', published);

  if (published < 1) {
    console.warn('[pulse-a] AI path produced 0 — falling back to local templates');
    published += await publishTemplates(titles);
  }

  console.log('[pulse-a] done published', published);
  if (published === 0) {
    console.error('[pulse-a] ZERO published');
    process.exit(2);
  }
}

main().catch((e) => {
  console.error('[pulse-a] FATAL', e);
  process.exit(1);
});
