/** Delete all seeded series posts (id seed_* or slug series-*) */
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
    throw new Error(text.slice(0, 400));
  }
  if (!res.ok || parsed.success === false) {
    throw new Error(JSON.stringify(parsed.errors || parsed).slice(0, 500));
  }
  return parsed;
}

async function main() {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error('Missing Cloudflare credentials');
    process.exit(1);
  }

  // Count before
  const before = await d1(`SELECT COUNT(*) as c FROM articles`);
  const beforeCount =
    before?.result?.[0]?.results?.[0]?.c ?? before?.results?.[0]?.c ?? '?';
  console.log('[wipe] articles before', beforeCount);

  // Seeded series by slug prefix
  await d1(`DELETE FROM articles WHERE slug LIKE ?`, ['series-%']);
  console.log('[wipe] deleted slug series-%');

  // Seeded by id prefix
  await d1(`DELETE FROM articles WHERE id LIKE ?`, ['seed_%']);
  console.log('[wipe] deleted id seed_%');

  // Any leftover with LaneCash Desk + series title pattern
  await d1(`DELETE FROM articles WHERE title LIKE ?`, ['%Series % · Part %']);
  console.log('[wipe] deleted Series · Part titles');

  const after = await d1(`SELECT COUNT(*) as c FROM articles`);
  const afterCount = after?.result?.[0]?.results?.[0]?.c ?? after?.results?.[0]?.c ?? '?';
  console.log('[wipe] articles after', afterCount);
  console.log('[wipe] done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
