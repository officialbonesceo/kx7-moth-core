/**
 * pulse-a — up to 10 posts/run, basics-first catalog, stable SVG covers
 * Ensures D1 schema (author_team) before insert.
 */
import { allTopicBodies } from './topics';
import { expandItem, pickBatch, CATALOG } from './catalog';

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const CF_D1_DATABASE_ID = process.env.CF_D1_DATABASE_ID || '';
const BATCH = Math.min(10, Math.max(1, Number(process.env.PULSE_BATCH || 10)));

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
    capcut: 'https://www.capcut.com/',
    canva: 'https://www.canva.com/',
    fiverr: 'https://www.fiverr.com/',
    upwork: 'https://www.upwork.com/',
    binance: 'https://www.binance.com/',
  };
  let out = content;
  for (const [name, url] of Object.entries(links)) {
    if (out.toLowerCase().includes(url.toLowerCase())) continue;
    out = out.replace(
      new RegExp(`\\b(${name})\\b`, 'ig'),
      (m) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${m}</a>`
    );
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

async function d1(sql: string, params: any[] = []) {
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
  // Cloudflare can return HTTP 200 with success:false inside, or HTTP 400
  const ok =
    res.ok &&
    parsed &&
    parsed.success !== false &&
    !(Array.isArray(parsed.errors) && parsed.errors.length) &&
    !(Array.isArray(parsed.result) && parsed.result.some((r: any) => r && r.success === false));
  if (!ok) {
    console.error('[pulse-a] D1', res.status, text.slice(0, 400));
    return null;
  }
  return parsed;
}

async function ensureSchema() {
  // Add optional columns if missing (safe to re-run)
  const alters = [
    `ALTER TABLE articles ADD COLUMN author_team TEXT`,
    `ALTER TABLE articles ADD COLUMN source_name TEXT`,
    `ALTER TABLE articles ADD COLUMN source_url TEXT`,
  ];
  for (const sql of alters) {
    const r = await d1(sql);
    if (r) console.log('[pulse-a] schema ok:', sql);
  }
  // Probe whether author_team exists
  const probe = await d1(`SELECT author_team FROM articles LIMIT 1`);
  HAS_AUTHOR_TEAM = !!probe;
  console.log('[pulse-a] HAS_AUTHOR_TEAM', HAS_AUTHOR_TEAM);
}

async function purgeJunk() {
  const patterns = [
    '%is not a magic income switch%',
    '%Do not invent profits from a headline%',
    '%This update is treated as a money decision input%',
  ];
  for (const p of patterns) {
    await d1(`DELETE FROM articles WHERE title LIKE ? OR content LIKE ?`, [p, p]);
  }
  await d1(`DELETE FROM articles WHERE category = 'news'`);
}

async function loadTitles(): Promise<Set<string>> {
  const data = await d1(`SELECT title FROM articles LIMIT 500`);
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
    // Column might still be missing — fall through
    HAS_AUTHOR_TEAM = false;
  }

  const data2 = await d1(
    `INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, status, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', datetime('now'), datetime('now'), datetime('now'))`,
    [
      id,
      slug,
      draft.title,
      draft.summary,
      draft.content,
      draft.category,
      draft.image_url || null,
      draft.reading_minutes,
    ]
  );
  if (!data2) {
    console.error('[pulse-a] publish failed', draft.title);
    return false;
  }
  console.log('[pulse-a] published (no author_team col):', draft.title);
  return true;
}

async function main() {
  console.log('[pulse-a] start batch', BATCH);
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error('[pulse-a] missing Cloudflare credentials');
    process.exit(1);
  }

  await ensureSchema();
  await purgeJunk();

  for (const body of allTopicBodies()) {
    if (await exists(body.title)) continue;
    await publish({
      title: body.title,
      summary: body.summary,
      content: injectLinks(body.content),
      category: body.category as Category,
      reading_minutes: 12,
      author_team: body.author_team,
      source_name: 'LaneCash Desk',
      image_url: coverForTitle(body.title, body.category),
    });
  }

  const titles = await loadTitles();
  const batch = pickBatch(BATCH, titles);
  console.log('[pulse-a] catalog', CATALOG.length, 'picked', batch.length);

  let published = 0;
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
  console.log('[pulse-a] done published', published);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
