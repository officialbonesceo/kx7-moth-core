/** One-shot seed: insert 30 series articles into D1 */
import { ARTICLES } from './articles30';

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const CF_D1_DATABASE_ID = process.env.CF_D1_DATABASE_ID || '';

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
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(text.slice(0, 300));
  }
  if (!res.ok || parsed.success === false) {
    throw new Error(JSON.stringify(parsed.errors || parsed).slice(0, 400));
  }
  return parsed;
}

function cover(category: string, title: string) {
  const t = `${title} ${category}`.toLowerCase();
  if (category === 'scams') return '/covers/scams.svg';
  if (/crypto|wallet|airdrop|p2p/.test(t)) return '/covers/crypto.svg';
  if (category === 'money') return '/covers/money.svg';
  if (/creator|capcut|youtube|tiktok|algo|digital|phone|freelance|ugc/.test(t)) return '/covers/hustle.svg';
  return '/covers/fallback.svg';
}

async function main() {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error('Missing Cloudflare credentials');
    process.exit(1);
  }
  await d1(`ALTER TABLE articles ADD COLUMN author_team TEXT`).catch(() => {});
  await d1(`ALTER TABLE articles ADD COLUMN source_name TEXT`).catch(() => {});
  await d1(`ALTER TABLE articles ADD COLUMN source_url TEXT`).catch(() => {});

  let ok = 0;
  let skip = 0;
  for (const a of ARTICLES) {
    const exists = await d1(`SELECT id FROM articles WHERE slug = ? LIMIT 1`, [a.slug]);
    const rows = exists?.result?.[0]?.results || exists?.results || [];
    if (rows.length) {
      console.log('skip', a.slug);
      skip++;
      continue;
    }
    const id = 'seed_' + a.slug.replace(/[^a-z0-9]/g, '').slice(0, 24);
    try {
      await d1(
        `INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, status, author_team, source_name, source_url, published_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, NULL, datetime('now'), datetime('now'), datetime('now'))`,
        [
          id,
          a.slug,
          a.title,
          a.summary,
          a.content,
          a.category,
          cover(a.category, a.title),
          a.reading_minutes,
          'LaneCash Desk',
          'LaneCash',
        ]
      );
      console.log('inserted', a.slug);
      ok++;
    } catch (e) {
      console.error('fail', a.slug, e);
    }
  }
  console.log(`seed done inserted=${ok} skipped=${skip} total=${ARTICLES.length}`);
  if (ok === 0 && skip === 0) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
