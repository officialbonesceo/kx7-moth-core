/**
 * pulse-a — research → rewrite → publish 1 post (quality gated, fail-closed).
 */
import { pickQueries, researchTopic, packToContext } from './research';
import { rewriteWithAi, looksLikeLeak, isWeakTitle, isWeakSummary } from './ai';
import { markdownToHtml } from './format';

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
  '<h2>Disclaimer</h2><p>This guide is <strong>educational only</strong>. It is <strong>not financial, investment, tax, or legal advice</strong>. Nothing here promises income or returns.</p>';

function slugify(t: string) {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function polishContent(content: string) {
  let out = markdownToHtml(content);
  const links: Record<string, string> = {
    CapCut: 'https://www.capcut.com/',
    Canva: 'https://www.canva.com/',
    Fiverr: 'https://www.fiverr.com/',
    Upwork: 'https://www.upwork.com/',
  };
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

function plainLen(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;
}

function coverForTitle(title: string, category: string) {
  const t = `${title} ${category}`.toLowerCase();
  if (category === 'scams' || /scam|fraud|phish|telegram/.test(t)) return '/covers/scams.svg';
  if (/crypto|usdt|bitcoin|airdrop|wallet|p2p|token/.test(t)) return '/covers/crypto.svg';
  if (/hustle|freelance|content|youtube|tiktok|affiliate|drop|creator|skill|algorithm|shorts|reels|digital product|remote/.test(t))
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

async function purgeBadFormatting() {
  await d1(`DELETE FROM articles WHERE content LIKE ?`, ['%**Step %']);
  await d1(`DELETE FROM articles WHERE content LIKE ?`, ['%## %']);
  await d1(`DELETE FROM articles WHERE content LIKE ?`, ['%Unlock your Creativity%']);
  await d1(`DELETE FROM articles WHERE content LIKE ?`, ['%Okay, I need to%']);
  await d1(`DELETE FROM articles WHERE content LIKE ?`, ['%Okay I need to%']);
  await d1(`DELETE FROM articles WHERE content LIKE ?`, ['%First, I\'ll%']);
  await d1(`DELETE FROM articles WHERE content LIKE ?`, ['%as an AI%']);
  await d1(`DELETE FROM articles WHERE content LIKE ?`, ['%Data Clean Room%']);
  await d1(`DELETE FROM articles WHERE source_name LIKE ?`, ['%AI%']);
  await d1(`DELETE FROM articles WHERE source_name LIKE ?`, ['%research%']);
  await d1(`DELETE FROM articles WHERE title = ?`, ['Google']);
  await d1(`DELETE FROM articles WHERE title = ?`, ['Remote work']);
  await d1(`DELETE FROM articles WHERE title LIKE ?`, ['Google%']);
  await d1(`DELETE FROM articles WHERE length(title) < 20`);
  await d1(`DELETE FROM articles WHERE summary LIKE ?`, ['A practical beginner guide from LaneCash%']);
  console.log('[pulse-a] cleared poorly formatted / weak-title posts');
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
  if (isWeakTitle(draft.title) || isWeakSummary(draft.summary) || plainLen(draft.content) < 1800) {
    console.error('[pulse-a] refuse publish — failed final quality gate');
    return false;
  }

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
        'LaneCash',
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

async function publishOne(titles: Set<string>): Promise<boolean> {
  const queries = pickQueries(5);
  for (const q of queries) {
    try {
      console.log('[pulse-a] topic', q);
      const pack = await researchTopic(q);
      const ctx = packToContext(pack);
      const seedTitle = pack.hits[0]?.title || q;
      const ai = await rewriteWithAi(ctx, seedTitle);
      if (!ai) {
        console.warn('[pulse-a] AI returned null — skip (fail closed)');
        continue;
      }

      let content = polishContent(ai.contentHtml);
      if (looksLikeLeak(content) || plainLen(content) < 1800) {
        console.warn('[pulse-a] skip low quality body');
        continue;
      }
      if (isWeakTitle(ai.title) || isWeakSummary(ai.summary)) {
        console.warn('[pulse-a] skip weak title/summary');
        continue;
      }

      let title = ai.title.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
      if ((await exists(title)) || titles.has(title)) {
        title = `${title} (${new Date().toISOString().slice(0, 10)})`;
        if (await exists(title) || isWeakTitle(title)) continue;
      }

      const ok = await publish({
        title,
        summary: ai.summary.replace(/\*\*/g, '').trim(),
        content,
        category: ai.category,
        reading_minutes: Math.max(8, Math.min(22, Math.round(plainLen(content) / 900))),
        author_team: 'LaneCash Desk',
        source_name: 'LaneCash',
        source_url: pack.hits[0]?.url || null,
        image_url: coverForTitle(title, ai.category),
      });
      if (ok) {
        titles.add(title);
        return true;
      }
    } catch (e) {
      console.error('[pulse-a] item error', e);
    }
  }
  return false;
}

async function main() {
  console.log('[pulse-a] 1 post/run · fail-closed quality gates · source=LaneCash');
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error('[pulse-a] FATAL missing Cloudflare credentials');
    process.exit(1);
  }
  await ensureSchema();
  await purgeBadFormatting();

  const titles = await loadTitles();
  console.log('[pulse-a] existing titles', titles.size);

  const ok = await publishOne(titles);
  console.log('[pulse-a] done published', ok ? 1 : 0);
  if (!ok) {
    console.error('[pulse-a] ZERO published (AI failed quality — correct behavior)');
    process.exit(2);
  }
}

main().catch((e) => {
  console.error('[pulse-a] FATAL', e);
  process.exit(1);
});
