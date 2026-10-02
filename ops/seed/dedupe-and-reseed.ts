/** Delete duplicate article titles (normalize quotes/spaces), keep newest published_at. */
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
    console.error('D1 fail', res.status, JSON.stringify(j.errors || j).slice(0, 500));
    return null;
  }
  return j;
}

function rows(j: any): any[] {
  return j?.result?.[0]?.results || j?.results || [];
}

function normTitle(t: string) {
  return String(t || '')
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\u2018\u2019\u201a\u201b\u2032]/g, "'")
    .replace(/[\u201c\u201d\u201e\u201f\u2033]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function rid() {
  return 'a_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function slugify(t: string) {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72);
}

async function dedupeAll() {
  const list = await d1(
    `SELECT id, title, published_at FROM articles WHERE status = 'published' ORDER BY published_at DESC, id DESC`
  );
  const all = rows(list);
  console.log('scan rows', all.length);
  const seen = new Map<string, string>();
  let removed = 0;
  for (const r of all) {
    const key = normTitle(r.title);
    if (!key) continue;
    if (seen.has(key)) {
      const del = await d1(`DELETE FROM articles WHERE id = ?`, [r.id]);
      if (del) {
        removed++;
        console.log('dedupe del', r.id, key.slice(0, 55));
      }
    } else {
      seen.set(key, r.id);
    }
  }
  console.log('dedupe removed', removed, 'unique kept', seen.size);
}

const ARTICLES = [
  {
    title: 'Fake FIRS NRS and NFIU recruitment messages: how to spot the circular scam',
    summary:
      'Unsolicited shortlist emails and social posts about government hiring — official pages only, no application fees. Educational only.',
    category: 'scams',
    image_url: '/covers/scams.svg',
    minutes: 10,
    content: `<h2>Start here</h2><p>Fake recruitment notices claim FIRS/NRS/NFIU hiring via email or random sites. Real openings are free on official career pages only.</p><h2>Red flags</h2><ul><li>Unsolicited shortlist messages</li><li>Fees for forms or medicals</li><li>Domains that are not nrs.gov.ng or firs.gov.ng</li></ul><h2>Disclaimer</h2><p>Educational only — not legal advice.</p>`,
  },
  {
    title: 'Market-run and personal shopping as a side income: fees, lists, and trust',
    summary:
      'How market-run services work — booking cutoffs, fees, receipts, warm clients. Educational only.',
    category: 'opportunities',
    image_url: '/covers/hustle.svg',
    minutes: 9,
    content: `<h2>Start here</h2><p>Market-run means buying from a list and delivering for a clear fee. Needs trust, not a course payment.</p><h2>Disclaimer</h2><p>Educational only — not financial advice.</p>`,
  },
  {
    title: 'Paid answer questions and earn dollars courses: access fees vs real microtasks',
    summary:
      'Why many viral question-earning funnels sell a course first. Educational only.',
    category: 'scams',
    image_url: '/covers/scams.svg',
    minutes: 9,
    content: `<h2>Start here</h2><p>Many feeds sell access fees before any real microtask income. Test official platforms yourself first.</p><h2>Disclaimer</h2><p>Educational only — not financial advice.</p>`,
  },
  {
    title: 'Paid website and app testing from Nigeria: a calm beginner experiment',
    summary:
      'What bug-testing marketplaces involve and how to log a one-week experiment. Educational only.',
    category: 'opportunities',
    image_url: '/covers/hustle.svg',
    minutes: 9,
    content: `<h2>Start here</h2><p>Paid testing means following scripts and writing bug reports. Results vary; avoid middleman invite fees.</p><h2>Disclaimer</h2><p>Educational only — not financial advice.</p>`,
  },
];

async function ensureArticles() {
  let n = 0;
  for (const a of ARTICLES) {
    const list = await d1(`SELECT id, title FROM articles WHERE status = 'published'`);
    const hit = rows(list).find((r) => normTitle(r.title) === normTitle(a.title));
    if (hit) {
      console.log('keep', a.title.slice(0, 48));
      continue;
    }
    const id = rid();
    const slug = `${slugify(a.title)}-${id.slice(-5)}`;
    const r = await d1(
      `INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, status, author_team, source_name, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', 'LaneCash Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now'))`,
      [id, slug, a.title, a.summary, a.content, a.category, a.image_url, a.minutes]
    );
    if (r) {
      n++;
      console.log('reseed', slug);
    }
  }
  console.log('reseeded', n);
}

async function main() {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error('Missing CF credentials');
    process.exit(1);
  }
  await dedupeAll();
  await ensureArticles();
  console.log('dedupe-and-reseed done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
