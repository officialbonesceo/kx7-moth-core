/**
 * Seed one timely educational article: Dangote Cement (DANGCEM) vs Refinery IPO.
 * Not investment advice. Figures from public news/market reports ~ mid-Sept 2026.
 */
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

function id() {
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

const TITLE =
  'Dangote Cement shares vs Dangote Refinery IPO: what the public numbers say (and what they do not)';

const SUMMARY =
  'A plain-English map of two different stories: DANGCEM on the NGX, and the 2026 Refinery public offer at ₦525 — plus how to verify details and spot fake “IPO agents.” Educational only, not investment advice.';

const CONTENT = `<h2>Start here — two different things</h2>
<p>When people say “Dangote shares” in Nigeria right now, they often mix up <strong>two separate products</strong>:</p>
<ul>
<li><strong>Dangote Cement Plc (ticker DANGCEM)</strong> — already listed and trading on the Nigerian Exchange (NGX).</li>
<li><strong>Dangote Petroleum Refinery &amp; Petrochemicals</strong> — a <em>public offer / IPO-style subscription</em> discussed widely in September 2026, not the same line as everyday Cement share trades.</li>
</ul>
<p>Mixing them is how rumour channels sell panic or FOMO. This guide separates what reputable market and news reports have stated, and what remains uncertain. <strong>Educational only — not financial, investment, or legal advice.</strong> Prices and offer windows change; always re-check primary sources before any decision.</p>

<h2>1) Dangote Cement (DANGCEM) — the listed stock</h2>
<p>Dangote Cement has been listed on the NGX for years (market sources commonly cite listing around October 2010). It trades under the symbol <strong>DANGCEM</strong>.</p>
<p>Around mid-to-late September 2026, multiple market data snapshots and business reports put the last traded / closing area near <strong>₦1,050</strong> per share after a session gain of about <strong>1.55%</strong> versus a prior close near <strong>₦1,034</strong>. Reported session volume in those snapshots was on the order of roughly <strong>2.4–2.5 million</strong> shares (figures vary slightly by data vendor and timestamp).</p>
<p>Longer-horizon commentary in the financial press has also noted large multi-year percentage gains from much lower historical admission prices — that is <em>history</em>, not a forecast that past returns will repeat.</p>
<p><strong>What this does <em>not</em> mean:</strong> a guaranteed path to profit, a “sure tip,” or proof that any social-media target price is official.</p>

<h2>2) Dangote Refinery public offer — the ₦525 story</h2>
<p>Separate from Cement trading, September 2026 coverage described a large public offer for <strong>Dangote Petroleum Refinery &amp; Petrochemicals</strong> shares:</p>
<ul>
<li><strong>Offer price (reported):</strong> ₦525 per ordinary share</li>
<li><strong>Shares on offer (reported):</strong> about <strong>4.1 billion</strong> ordinary shares</li>
<li><strong>Illustrative full-subscription size:</strong> on the order of <strong>₦2.15 trillion</strong> if fully taken up (math: 4.1bn × ₦525)</li>
<li><strong>Minimum application (widely reported):</strong> <strong>10 shares</strong> (about <strong>₦5,250</strong>), with further applications in multiples of 10 as set out in the offer documents</li>
<li><strong>Indicative window (press):</strong> open around <strong>14 September 2026</strong>, close around <strong>13 October 2026</strong></li>
<li><strong>Intended listing venue (press):</strong> Main Board of the Nigerian Exchange after allotment processes</li>
</ul>
<p>BusinessDay, The Nation, AllAfrica/ThisDay-style wires, and broker explainer pages repeated these headline terms. The <strong>prospectus and SEC-approved offer documents</strong> remain the controlling source if anything conflicts with a blog or WhatsApp broadcast.</p>

<h2>3) The “₦10,000 someday” comment</h2>
<p>In mid-September 2026 interviews reported by Nigerian newspapers, Aliko Dangote was quoted projecting that refinery shares offered around ₦525 <em>could</em> one day trade far higher (including a <strong>₦10,000</strong> illustration in some Hausa/English report translations). That is a <strong>promoter’s forward-looking view</strong>, not a regulated price target, not a NGX official figure, and not a promise to any retail buyer.</p>
<p>Markets can go down as well as up. Listing price after an IPO is set by supply and demand, not by a speech.</p>

<h2>4) How a careful beginner verifies — step by step</h2>
<ol>
<li><strong>Name the product.</strong> Ask: “Is this DANGCEM on the NGX, or the Refinery offer?” If the sender cannot answer clearly, pause.</li>
<li><strong>Read the prospectus / offer summary</strong> from channels named in SEC or issuer notices — not a random PDF in chat.</li>
<li><strong>Use licensed intermediaries.</strong> Applications for public offers typically run through approved electronic channels or stockbrokers — not “send USDT to this wallet to reserve units.”</li>
<li><strong>Check CSCS / brokerage account requirements</strong> if you already invest on NGX; many platforms require identity and funded accounts before IPO applications.</li>
<li><strong>Assume oversubscription risk.</strong> Applying for N shares does not guarantee allotment of N shares.</li>
<li><strong>Ignore pressure timers</strong> that exist only inside a Telegram group and not on the official offer calendar.</li>
</ol>

<h2>5) Scam patterns already wrapping this news</h2>
<ul>
<li>Fake “Dangote IPO desks” on WhatsApp asking for upfront “allocation fees.”</li>
<li>Cloned websites or ads promising guaranteed ₦10,000 listing on day one.</li>
<li>People confusing Cement price charts with Refinery subscription receipts.</li>
<li>“Recovery agents” who appear after someone already paid a fraudster.</li>
</ul>
<p>If money left your account to a stranger to “secure shares,” stop sending more, keep evidence, and use your bank/fintech fraud channel. LaneCash does not process investments or recoveries.</p>

<h2>6) Practical takeaway</h2>
<p><strong>Cement (DANGCEM)</strong> is a long-listed industrial stock whose recent prints near ₦1,050 are observable on market data feeds — still not advice to buy or sell.</p>
<p><strong>Refinery offer</strong> is a time-bounded subscription story with published headline terms (₦525, 4.1bn shares, Sept–Oct 2026 window in press) that must be confirmed in official offer materials.</p>
<p>Treat viral wealth screenshots as entertainment until they match primary documents.</p>

<h2>Sources to re-check (examples of public reporting)</h2>
<ul>
<li>Nigerian business press coverage of the Refinery offer terms and Dangote interview remarks (e.g. BusinessDay, The Nation, AllAfrica/ThisDay wires, September 2026).</li>
<li>NGX-oriented market pages quoting DANGCEM around ₦1,050 in mid-September 2026 sessions.</li>
<li>Broker / platform explainers summarising SEC-approved offer mechanics — always prefer the prospectus if wording differs.</li>
</ul>

<h2>Disclaimer</h2>
<p>This article is <strong>educational only</strong>. It is not a recommendation to buy, sell, or subscribe to any security. LaneCash is not a broker, issuing house, or investment adviser. Offer windows, prices, and allotment rules can change; verify on official and licensed channels before acting. Past performance and promotional projections are not guarantees of future results.</p>`;

async function main() {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error('Missing CF credentials');
    process.exit(1);
  }

  await d1(`DELETE FROM articles WHERE title = ?`, [TITLE]);
  await d1(`DELETE FROM articles WHERE slug LIKE ?`, ['dangote-cement-shares-vs-dangote-refinery%']);

  const aid = id();
  const slug = `${slugify(TITLE)}-${aid.slice(-5)}`;
  const r = await d1(
    `INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, status, author_team, source_name, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'money', '/covers/money.svg', 14, 'published', 'LaneCash Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now'))`,
    [aid, slug, TITLE, SUMMARY, CONTENT]
  );
  console.log(r ? 'OK seeded Dangote article' : 'FAIL', slug);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
