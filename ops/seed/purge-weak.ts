/** Purge weak/duplicate titles that hurt SEO and trust */
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
  const j = await res.json();
  if (!res.ok || j.success === false) {
    console.error('D1 fail', JSON.stringify(j).slice(0, 300));
    return null;
  }
  return j;
}

function norm(t: string) {
  return String(t || '')
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error('Missing CF secrets');
    process.exit(1);
  }

  // Exact weak titles
  const weak = ['Google', 'Remote work', 'Crypto', 'Affiliate', 'Scam', 'Guide', 'Untitled'];
  for (const t of weak) {
    await d1(`DELETE FROM articles WHERE title = ?`, [t]);
    await d1(`DELETE FROM articles WHERE lower(title) = ?`, [t.toLowerCase()]);
  }

  // Pattern cleanup
  const patterns: [string, any[]][] = [
    [`DELETE FROM articles WHERE length(title) < 20`, []],
    [`DELETE FROM articles WHERE title LIKE ?`, ['Google%']],
    [`DELETE FROM articles WHERE summary LIKE ?`, ['A practical beginner guide from LaneCash%']],
    [`DELETE FROM articles WHERE content LIKE ?`, ['%Data Clean Room%']],
    [`DELETE FROM articles WHERE content LIKE ?`, ['%Okay, I need to%']],
    [`DELETE FROM articles WHERE content LIKE ?`, ['%Okay I need to%']],
    [`DELETE FROM articles WHERE content LIKE ?`, ['%nap5k.com/tag.min.js%']],
    [`DELETE FROM articles WHERE content LIKE ?`, ['%dataset.zone%']],
    [`DELETE FROM articles WHERE content LIKE ?`, ['%Better Business Bureau%']],
  ];
  for (const [sql, params] of patterns) {
    await d1(sql, params);
  }

  // Dedupe normalized titles — keep newest
  const list = await d1(
    `SELECT id, title, published_at FROM articles WHERE status = 'published' ORDER BY published_at DESC`
  );
  const rows = list?.result?.[0]?.results || list?.results || [];
  const seen = new Set<string>();
  let removed = 0;
  for (const r of rows || []) {
    const k = norm(r.title);
    if (seen.has(k)) {
      await d1(`DELETE FROM articles WHERE id = ?`, [r.id]);
      removed++;
      console.log('dedupe', k.slice(0, 60));
    } else seen.add(k);
  }
  console.log('purge-weak done, dedupe removed', removed);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
