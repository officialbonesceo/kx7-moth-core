/** Delete duplicate article titles (keep newest by published_at), then ensure X-trend set exists once each. */
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
  const seen = new Set<string>();
  let removed = 0;
  for (const r of all) {
    const key = String(r.title || '').trim().toLowerCase();
    if (!key) continue;
    if (seen.has(key)) {
      const del = await d1(`DELETE FROM articles WHERE id = ?`, [r.id]);
      if (del) {
        removed++;
        console.log('dedupe del', r.id, key.slice(0, 50));
      }
    } else {
      seen.add(key);
    }
  }
  console.log('dedupe removed', removed, 'unique kept', seen.size);
}

const ARTICLES = [
  {
    title: 'Fake FIRS NRS and NFIU recruitment messages: how to spot the circular scam',
    summary:
      'Unsolicited “shortlist” emails and social posts about government hiring — official pages only, no application fees, and what to do if you already shared documents. Educational only.',
    category: 'scams',
    image_url: '/covers/scams.svg',
    minutes: 10,
    content: `<h2>Start here</h2>
<p>In late September 2026, Nigerian social feeds filled with <strong>fake recruitment notices</strong> — emails and posts claiming FIRS / Nigeria Revenue Service (NRS), NFIU, or other agencies were hiring, accepting CVs at random offices, or “replacing” staff through odd websites. Official bodies publicly called several of these out as fraud.</p>
<p>This guide is educational only. It is not legal advice. Government jobs that are real are free to apply for on official career pages — not through random links that ask for fees or odd document dumps.</p>
<h2>What the scam looks like</h2>
<ul>
<li>Unsolicited email or WhatsApp: “You have been shortlisted” or “job replacement circular.”</li>
<li>Links that do not match <strong>nrs.gov.ng</strong>, <strong>firs.gov.ng</strong>, or the agency’s verified channels.</li>
<li>Requests to send ID packs, bank details, or “processing / medical / form fees.”</li>
<li>Claims that CVs are being collected at a headquarters gate “this week only.”</li>
</ul>
<h2>How to verify before you act</h2>
<ol>
<li>Open the agency site yourself by typing the official domain — do not trust the link in the message.</li>
<li>Check Careers / Vacancies only on that official site.</li>
<li>Real public-sector openings do not require you to pay to apply.</li>
<li>Ignore “HR” accounts that only exist on Telegram and cannot be matched to a staff directory.</li>
<li>If you already sent documents, monitor for identity misuse; do not send money to “unlock” the process.</li>
</ol>
<h2>Red flags checklist</h2>
<ul>
<li>Pressure and short deadlines.</li>
<li>Grammar and domain typos on “gov” pages.</li>
<li>Payment to a personal account or crypto wallet.</li>
<li>No public vacancy ID on the official portal.</li>
</ul>
<h2>Safer next steps if you want real work</h2>
<p>Build a simple skill offer (writing, tutoring, support, editing) and apply through platforms or employers you can verify. Pair job search with scam literacy so a fake circular does not cost you cash or data.</p>
<h2>Disclaimer</h2>
<p>Educational only — not financial or legal advice. Always confirm vacancies on official government websites.</p>`,
  },
  {
    title: 'Market-run and personal shopping as a side income: fees, lists, and trust',
    summary:
      'How market-run services work in practice — booking cutoffs, transport and service fees, receipts, and starting with warm clients. Educational only, not a guaranteed hustle.',
    category: 'opportunities',
    image_url: '/covers/hustle.svg',
    minutes: 9,
    content: `<h2>Start here</h2>
<p>A practical offline side income that keeps appearing in Nigerian conversations is <strong>market-run / personal shopping</strong>: busy people send a list; you buy at the market and deliver for a clear fee. It needs trust, time, and organisation — not a course fee.</p>
<p>Educational only. Income is not guaranteed.</p>
<h2>How it typically works</h2>
<ol>
<li>Client sends a shopping list and a budget range.</li>
<li>You buy on an agreed day, keep receipts, and deliver.</li>
<li>You charge a transport fee plus a service fee (fixed or a small percentage of basket size — agree in writing).</li>
<li>You set a booking deadline so you can plan one efficient market trip.</li>
</ol>
<h2>Who it fits</h2>
<ul>
<li>People who already know local markets well.</li>
<li>Those who can carry goods safely and communicate clearly on WhatsApp.</li>
<li>Not ideal if you cannot handle cash, receipts, and substitution decisions.</li>
</ul>
<h2>Getting first clients without spam</h2>
<ul>
<li>Warm network: estate groups, colleagues, family friends (with permission from admins).</li>
<li>One clear offer: day, cutoff time, fee example, what you do not buy (e.g. no high-value electronics at first).</li>
<li>After delivery, ask for a short testimonial.</li>
</ul>
<h2>Risks and boundaries</h2>
<ul>
<li>Agree substitution rules when an item is missing.</li>
<li>Prefer transfer payments with confirmation before you spend large sums of your own float.</li>
<li>Reject “agency training fees” that gatekeep a simple service you can start yourself.</li>
</ul>
<h2>7-day trial plan</h2>
<ol>
<li>Write your one-paragraph offer and fee examples.</li>
<li>Message 10 warm contacts.</li>
<li>Complete one paid run with receipts.</li>
<li>Note time spent and profit after transport.</li>
<li>Decide whether to continue weekly.</li>
</ol>
<h2>Disclaimer</h2>
<p>Educational only — not financial advice. Local rules, safety, and trust matter more than any template.</p>`,
  },
  {
    title: 'Paid “answer questions and earn dollars” courses: access fees vs real microtasks',
    summary:
      'Why many viral question-earning funnels sell a course first, what microtask platforms can and cannot pay, and how to test without buying hype. Educational only.',
    category: 'scams',
    image_url: '/covers/scams.svg',
    minutes: 9,
    content: `<h2>Start here</h2>
<p>Feeds still push “answer questions online and earn dollars” funnels that end in a <strong>one-time course or access fee</strong> (often tens of thousands of naira) and vague promises of $10–$45 tasks. Many of these posts oversell survey and microtask income.</p>
<p>This is educational only — not an endorsement of any paid group.</p>
<h2>What is usually true</h2>
<ul>
<li>Some legitimate platforms pay small amounts for surveys, tests, or microtasks.</li>
<li>Payouts are often low, uneven, and region-limited.</li>
<li>You should not need a large “community access fee” just to learn that reality.</li>
</ul>
<h2>What is usually a trap</h2>
<ul>
<li>Guaranteed daily dollar figures for answering questions.</li>
<li>Limited slots and countdown pressure.</li>
<li>Payment required before any transparent platform walkthrough you can verify yourself.</li>
<li>Mentors who only exist inside a paid Telegram after you pay.</li>
</ul>
<h2>Safer approach</h2>
<ol>
<li>Search the platform name yourself and read recent user reports.</li>
<li>Create an account on the official site if it exists — without buying a third-party “system.”</li>
<li>Track real payouts for two weeks before spending money on “training.”</li>
<li>Treat any “pay ₦X to unlock the method” as a product sale, not a job offer.</li>
</ol>
<h2>Disclaimer</h2>
<p>Educational only — not financial advice. Microtask income is often small; never risk money you cannot afford to lose on access fees.</p>`,
  },
  {
    title: 'Paid website and app testing from Nigeria: a calm beginner experiment',
    summary:
      'What bug-testing marketplaces actually involve, setup without middlemen fees, and a one-week log so you judge payouts with data. Educational only.',
    category: 'opportunities',
    image_url: '/covers/hustle.svg',
    minutes: 9,
    content: `<h2>Start here</h2>
<p>Another recurring phone/laptop idea is <strong>paid software testing</strong> (finding bugs, following test scripts). Public posts often name global testing marketplaces. Results vary by skill, device, and available tests in your country.</p>
<p>Educational only — not a promise of income.</p>
<h2>What the work is</h2>
<ul>
<li>Companies publish test runs; freelancers follow steps and report bugs.</li>
<li>You need clear writing, patience, and often a desktop browser as well as a phone.</li>
<li>Invitations are not constant; dry weeks are normal.</li>
</ul>
<h2>Realistic setup</h2>
<ol>
<li>Stable internet and a device you can use for hours.</li>
<li>Complete any free academy or practice tests the platform offers.</li>
<li>Write bug reports with steps to reproduce — quality beats speed spam.</li>
<li>Track hours vs payout for a month before calling it a “job.”</li>
</ol>
<h2>Watch-outs</h2>
<ul>
<li>Third parties selling “guaranteed test invites” for a fee.</li>
<li>Fake apps that only copy the brand of a real testing site.</li>
<li>Anyone asking for remote-control access to your bank apps.</li>
</ul>
<h2>7-day experiment</h2>
<ol>
<li>Pick one well-known testing platform and sign up yourself.</li>
<li>Finish onboarding modules.</li>
<li>Attempt every suitable test that appears for seven days.</li>
<li>Log earnings and time.</li>
<li>Decide with data, not timeline hype.</li>
</ol>
<h2>Disclaimer</h2>
<p>Educational only — not financial advice. Platform rules and availability change. This is not a partnership with any testing company.</p>`,
  },
];

async function ensureArticles() {
  let n = 0;
  for (const a of ARTICLES) {
    const exists = await d1(`SELECT id FROM articles WHERE title = ? LIMIT 1`, [a.title]);
    if (rows(exists).length) {
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
