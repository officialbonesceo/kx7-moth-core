/** Emergency publish: long educational posts when pulse AI is quota-blocked. */
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
    console.error('D1 fail', JSON.stringify(j).slice(0, 400));
    return null;
  }
  return j;
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
function norm(t: string) {
  return String(t || '')
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

const ARTICLES = [
  {
    title: 'How to verify a remote job offer before you share your BVN or pay any fee',
    summary:
      'A practical checklist for WhatsApp and Telegram job offers: company footprint, no pay-to-work rules, document safety, and what to do if you already paid. Educational only.',
    category: 'scams',
    image_url: '/covers/scams.svg',
    minutes: 12,
    content: `<h2>Start here</h2>
<p>Remote job offers that arrive as a cold message on WhatsApp, Telegram, Instagram, or SMS are a common way people lose money and identity details in Nigeria and across Africa. The pitch is usually simple work, fast pay, and an urgent start date. This guide is educational only. It is not legal or career advice.</p>
<p>Real remote work exists. The difference is process: real employers rarely demand activation fees, wallet top-ups, or your full banking secrets before you have a clear contract and a verifiable company.</p>

<h2>What the scam pattern usually looks like</h2>
<ul>
<li>A stranger messages you first. You did not apply on a known careers page.</li>
<li>Pay looks high for very light tasks (liking posts, data entry, chatting).</li>
<li>After a short “trial,” they ask for a registration fee, equipment deposit, tax, or crypto top-up to unlock withdrawal.</li>
<li>They push you into a private chat and show staged screenshots of other people “earning.”</li>
<li>They ask for BVN, OTP, card PIN, or remote-control apps that can take over your phone.</li>
</ul>

<h2>Step-by-step verification before you commit</h2>
<ol>
<li><strong>Slow down.</strong> Real employers can wait a day while you check basics. Pressure is a tool scammers use.</li>
<li><strong>Find an independent company footprint.</strong> Search the exact company name plus “scam” and “review.” Look for a real website, registration details where public, and staff who appear outside the chat app.</li>
<li><strong>Match the job to a public posting.</strong> Prefer roles you can open on a careers page you typed yourself, not a link pasted in chat.</li>
<li><strong>Never pay to receive wages.</strong> Registration fees, training kits, or wallet top-ups to unlock salary are classic extraction patterns.</li>
<li><strong>Protect banking and OTPs.</strong> Do not share BVN, OTP, card PINs, or remote-access tools that let someone control your device.</li>
<li><strong>Use a separate email and avoid sending government ID packs</strong> until you are sure who is hiring and why the ID is required.</li>
<li><strong>Agree scope in writing.</strong> Role, pay currency, payment schedule, and who covers tools should be clear before you invest time.</li>
</ol>

<h2>Red flags checklist</h2>
<ul>
<li>Pay first, earn later.</li>
<li>Only communicates on consumer chat apps; refuses official email or a real video call with a named company account.</li>
<li>Grammar and brand logos look copied or inconsistent.</li>
<li>Asks you to recruit friends quickly for bonuses.</li>
<li>Threatens that your “account will be banned” unless you pay today.</li>
<li>Dashboard balance rises fast but withdrawal always needs one more fee.</li>
</ul>

<h2>If you already paid or shared documents</h2>
<ol>
<li>Stop sending more money. Additional “unlock” fees almost never recover the first loss.</li>
<li>Save chats, wallet addresses, bank references, and usernames.</li>
<li>Contact your bank or fintech support about fraud options on transfers you control.</li>
<li>Ignore “recovery agents” who message you next offering to reverse the loss for another fee — that is often a second scam.</li>
<li>If identity documents were shared, watch accounts for unusual activity and follow your bank’s guidance on monitoring.</li>
</ol>

<h2>Safer paths to real remote skills</h2>
<p>Build a clear skill offer (writing, support, design, tutoring, testing) and apply through channels you can verify. Track hours and pay for a month before calling anything a full-time job. Pair job search with scam literacy so a polished chat does not replace basic checks.</p>

<h2>Disclaimer</h2>
<p>Educational only — not financial, legal, or career advice. Scam tactics change. Verify employers through independent sources and never risk money or data you cannot afford to lose.</p>`,
  },
  {
    title: 'Building a simple weekly budget in naira when prices keep changing',
    summary:
      'A calm weekly budget method for unstable prices: fixed costs, flexible food and transport lines, a small buffer, and a Sunday review habit. Educational only, not financial advice.',
    category: 'money',
    image_url: '/covers/money.svg',
    minutes: 11,
    content: `<h2>Start here</h2>
<p>When food, transport, and data prices move often, a monthly plan that never changes can feel useless. A <strong>weekly budget in naira</strong> is easier to adjust: you plan seven days, review once, and carry lessons forward. This is educational only. It is not financial, investment, or tax advice.</p>

<h2>Why weekly can work better than “perfect monthly”</h2>
<ul>
<li>You see overspending before the month is already gone.</li>
<li>Market prices can be updated every Sunday without rewriting a 30-day spreadsheet.</li>
<li>A small win each week builds the habit more than a large failed plan.</li>
</ul>

<h2>Step-by-step setup</h2>
<ol>
<li><strong>List money that will actually arrive this week</strong> (salary slice, side income you already earned, not hopes).</li>
<li><strong>Write fixed costs that must be paid</strong> in that week: rent portion, debt installment, school levy, subscriptions you will not cancel yet.</li>
<li><strong>Set flexible caps</strong> for food, transport, data, and small personal spend. Use today’s market prices, not last year’s memory.</li>
<li><strong>Create a buffer line</strong> even if it is small — unexpected okada, medicine, or a price jump.</li>
<li><strong>Put the plan where you will see it</strong> (notes app, paper on the wall, shared family note).</li>
<li><strong>Track only what matters</strong> for seven days: do not need 40 categories on day one.</li>
<li><strong>Sunday review:</strong> what blew the cap, what was cheaper than expected, what to change next week.</li>
</ol>

<h2>Tips that keep the plan honest</h2>
<ul>
<li>Separate “needs this week” from “wants that can wait.”</li>
<li>If income is irregular, budget from money already in hand, not from invoices still unpaid.</li>
<li>Agree household rules out loud if you share costs — silent assumptions cause conflict.</li>
<li>Avoid borrowing for lifestyle items that the weekly plan already marked as wait.</li>
</ul>

<h2>Watch-outs</h2>
<ul>
<li>Apps and influencers that promise a rich lifestyle from “mindset only.”</li>
<li>High-interest loans to “balance” a week of overspending.</li>
<li>Hiding small daily spends until they add up to a crisis.</li>
</ul>

<h2>A simple one-week experiment</h2>
<ol>
<li>Write this week’s income and fixed costs tonight.</li>
<li>Set three flexible caps: food, transport, data.</li>
<li>Check the note every evening for two minutes.</li>
<li>On Sunday, adjust one number based on reality.</li>
<li>Repeat once more before judging whether the method fits you.</li>
</ol>

<h2>Disclaimer</h2>
<p>Educational only — not financial advice. Your numbers, debts, and obligations are personal. This guide does not replace a qualified adviser for complex debt or investment decisions.</p>`,
  },
  {
    title: 'Canva on your phone: three service offers beginners can price without a studio',
    summary:
      'How to turn CapCut-adjacent design skills into small paid Canva jobs — flyers, status packs, and simple brand kits — with scope, pricing, and scam filters. Educational only.',
    category: 'opportunities',
    image_url: '/covers/hustle.svg',
    minutes: 11,
    content: `<h2>Start here</h2>
<p><a href="https://www.canva.com/" target="_blank" rel="noopener noreferrer">Canva</a> on a phone is enough for many small business visuals: event flyers, WhatsApp status packs, and simple logo-plus-colour kits. This path is skill work, not passive income. Educational only — not financial advice.</p>

<h2>Three offers that are easy to explain</h2>
<ol>
<li><strong>Single flyer or poster</strong> for a church programme, shop promo, or campus event.</li>
<li><strong>Status or story pack</strong> (5–10 matching frames) for a week of promotions.</li>
<li><strong>Mini brand kit</strong>: colour set, two font choices, and a clean logo layout the client can reuse.</li>
</ol>
<p>Say the deliverable in one sentence. Vague “I do graphics” attracts endless free revisions.</p>

<h2>Step-by-step first paid job</h2>
<ol>
<li>Pick one offer and make three sample designs (fictional client is fine).</li>
<li>Save them as a small portfolio album on your phone.</li>
<li>Write a price and revision limit (example: two revision rounds).</li>
<li>Message warm contacts who already post weak designs — not random spam groups.</li>
<li>Collect text, date, and logo from the client before you design.</li>
<li>Deliver in the format they can post (PNG/JPG) and keep your source file until payment clears if that is your policy.</li>
<li>Ask for a short testimonial after a successful delivery.</li>
</ol>

<h2>Pricing and boundaries</h2>
<ul>
<li>Start with a fixed fee per flyer or pack, not “pay me whatever.”</li>
<li>Extra pages or rushed same-day delivery can cost more — say so upfront.</li>
<li>Do not start large unpaid “tests” that look like full commercial work.</li>
</ul>

<h2>Watch-outs</h2>
<ul>
<li>Clients who only pay after “exposure.”</li>
<li>Training schemes that charge you before any real client work.</li>
<li>Using copyrighted characters or logos you do not have rights to.</li>
</ul>

<h2>7-day practice plan</h2>
<ol>
<li>Finish three samples in one niche.</li>
<li>Write your one-sentence offer and fee.</li>
<li>Send five polite messages to warm contacts.</li>
<li>Complete one paid or strongly scoped trial.</li>
<li>Note time spent so your next price is informed.</li>
</ol>

<h2>Disclaimer</h2>
<p>Educational only — not financial advice. Income depends on skill, demand, and consistency. This is not a partnership with Canva or any marketplace.</p>`,
  },
];

async function main() {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error('Missing CF secrets');
    process.exit(1);
  }
  // light dedupe of exact/near titles for answer-questions clones
  const list = await d1(`SELECT id, title FROM articles WHERE status = 'published' ORDER BY published_at DESC`);
  const rows = list?.result?.[0]?.results || list?.results || [];
  const seen = new Set<string>();
  let removed = 0;
  for (const r of rows || []) {
    const k = norm(r.title);
    if (seen.has(k)) {
      await d1(`DELETE FROM articles WHERE id = ?`, [r.id]);
      removed++;
      console.log('dedupe', r.id, k.slice(0, 50));
    } else seen.add(k);
  }
  console.log('dedupe removed', removed);

  let n = 0;
  for (const a of ARTICLES) {
    const exists = (rows || []).some((r: any) => norm(r.title) === norm(a.title));
    if (exists) {
      console.log('skip', a.title.slice(0, 50));
      continue;
    }
    const id = rid();
    const slug = `${slugify(a.title)}-${id.slice(-5)}`;
    const ok = await d1(
      `INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, status, author_team, source_name, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', 'LaneCash Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now'))`,
      [id, slug, a.title, a.summary, a.content, a.category, a.image_url, a.minutes]
    );
    if (ok) {
      n++;
      console.log('published', slug);
    }
  }
  console.log('seed-publish-oct6 done', n);
  if (!n && removed === 0) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
