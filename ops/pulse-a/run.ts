/**
 * pulse-a — AI-only: research (best effort) → AI rewrite → publish 1 post.
 * No template catalog. If AI fails → exit 2.
 */
import { pickQueries, researchTopic, packToContext } from './research';
import { rewriteWithAi } from './ai';

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const CF_D1_DATABASE_ID = process.env.CF_D1_DATABASE_ID || '';

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

const DISCLAIMER_HTML =
  '<h2>Disclaimer</h2><p>This guide is <strong>educational only</strong>. It is <strong>not financial, investment, tax, or legal advice</strong>. Nothing here promises income or returns. Verify tools yourself and never risk money you cannot afford to lose.</p>';

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
    out = out.replace(
      new RegExp(`\\b(${name})\\b`, 'g'),
      `<a href="${url}" target="_blank" rel="noopener noreferrer">$1</a>`
    );
  }
  if (!/not financial advice/i.test(out)) out += DISCLAIMER_HTML;
  return out;
}

function coverForTitle(title: string, category: string) {
  const t = `${title} ${category}`.toLowerCase();
  if (category === 'scams' || /scam|fraud|phish|telegram/.test(t)) return '/covers/scams.svg';
  if (/crypto|usdt|bitcoin|airdrop|wallet|p2p|token/.test(t)) return '/covers/crypto.svg';
  if (/hustle|freelance|content|youtube|tiktok|affiliate|drop|creator|skill|algorithm|shorts|reels/.test(t))
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
  const errMsg = JSON.stringify(parsed?.errors || parsed?.result || text).slice(0, 280);
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

/** Safe purge: only known template phrases (simple LIKE, one % pattern each) */
async function purgeTemplateArticles() {
  console.log('[pulse-a] purging old template articles…');
  const phrases = [
    '%smallest proof action in 48 hours%',
    '%kill switch if results stay flat%',
    '%Write a test budget before you start%',
    '%guaranteed-return apps, fake airdrop%',
  ];
  for (const p of phrases) {
    await d1(`DELETE FROM articles WHERE content LIKE ?`, [p]);
  }
  // Desk templates without AI marker
  await d1(`DELETE FROM articles WHERE source_name = ?`, ['LaneCash Desk']);
  console.log('[pulse-a] purge done');
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
        draft.source_name || 'Educational AI+research',
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

async function publishOneFromResearch(titles: Set<string>): Promise<boolean> {
  const queries = pickQueries(5);
  for (const q of queries) {
    try {
      console.log('[pulse-a] topic', q);
      const pack = await researchTopic(q);
      // Research optional — AI can still write from the topic alone
      const ctx = packToContext(pack);
      const seedTitle = pack.hits[0]?.title || q;
      const ai = await rewriteWithAi(ctx, seedTitle);
      if (!ai) {
        console.warn('[pulse-a] AI failed for topic');
        continue;
      }

      if (
        /smallest proof action in 48 hours/i.test(ai.contentHtml) ||
        /kill switch if results stay flat/i.test(ai.contentHtml)
      ) {
        console.warn('[pulse-a] rejected template-like output');
        continue;
      }

      if ((await exists(ai.title)) || titles.has(ai.title)) {
        ai.title = `${ai.title} (${new Date().toISOString().slice(0, 10)})`;
        if (await exists(ai.title)) continue;
      }

      const ok = await publish({
        title: ai.title,
        summary: ai.summary,
        content: injectLinks(ai.contentHtml),
        category: ai.category,
        reading_minutes: 10,
        author_team: ai.author_team,
        source_name: `Educational AI+research (${ai.model})`,
        source_url: pack.hits[0]?.url || null,
        image_url: coverForTitle(ai.title, ai.category),
      });
      if (ok) {
        titles.add(ai.title);
        return true;
      }
    } catch (e) {
      console.error('[pulse-a] item error', e);
    }
  }
  return false;
}

async function main() {
  console.log('[pulse-a] AI-only · 1 post/run');
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error('[pulse-a] FATAL missing Cloudflare credentials');
    process.exit(1);
  }
  await ensureSchema();
  await purgeTemplateArticles();

  const titles = await loadTitles();
  console.log('[pulse-a] existing titles', titles.size);

  const ok = await publishOneFromResearch(titles);
  console.log('[pulse-a] done published', ok ? 1 : 0);
  if (!ok) {
    console.error('[pulse-a] ZERO published — need working CF AI and/or OPENROUTER_API_KEY');
    process.exit(2);
  }
}

main().catch((e) => {
  console.error('[pulse-a] FATAL', e);
  process.exit(1);
});
