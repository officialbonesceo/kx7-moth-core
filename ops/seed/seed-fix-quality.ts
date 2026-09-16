/**
 * Delete leaky/thin posts, rewrite Remote work scams guide, add 2 solid articles.
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
    console.error('D1 fail', res.status, JSON.stringify(j.errors || j).slice(0, 400));
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
    .slice(0, 70);
}

async function upsert(article: {
  title: string;
  summary: string;
  content: string;
  category: string;
  image_url: string;
  minutes: number;
}) {
  await d1(`DELETE FROM articles WHERE title = ?`, [article.title]);
  await d1(`DELETE FROM articles WHERE slug LIKE ?`, [slugify(article.title) + '%']);
  const aid = id();
  const slug = `${slugify(article.title)}-${aid.slice(-5)}`;
  const r = await d1(
    `INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, status, author_team, source_name, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', 'LaneCash Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now'))`,
    [
      aid,
      slug,
      article.title,
      article.summary,
      article.content,
      article.category,
      article.image_url,
      article.minutes,
    ]
  );
  console.log(r ? 'OK ' + article.title : 'FAIL ' + article.title, slug);
}

const REMOTE = `<h2>Start here</h2>
<p>Remote and “work from phone” offers are common in Nigeria and across Africa. Some are real freelance gigs. Many are scams that ask you to pay fees, share OTPs, or “activate” an account before any salary arrives.</p>
<p>This guide is about <strong>verifying who is hiring you</strong> before you send money or sensitive data. It is educational only — not legal or career advice.</p>

<h2>How fake remote jobs usually work</h2>
<ul>
<li>A stranger messages you on WhatsApp, Telegram, Instagram, or email with a “job” and urgent start date.</li>
<li>The pay looks high for simple tasks (data entry, liking posts, chatting with clients).</li>
<li>After a few small “tests,” they ask for a registration fee, equipment fee, tax, or crypto deposit to unlock withdrawal.</li>
<li>Sometimes they pose as support for a known brand and push you into a private chat.</li>
</ul>

<h2>Step-by-step: verify before you commit</h2>
<ol>
<li><strong>Slow down.</strong> Real employers can wait a day while you check basics. Pressure is a tool scammers use.</li>
<li><strong>Find an independent company footprint.</strong> Search the exact company name + “scam” / “review”. Look for a real website with clear contact details, not only a chat handle.</li>
<li><strong>Match the person to the company.</strong> Call or email a published company number/address from the official site — not the number in the chat. Ask HR whether the offer is real.</li>
<li><strong>Never pay to receive wages.</strong> Registration fees, “training kits,” or “wallet top-ups” to unlock salary are classic extraction patterns.</li>
<li><strong>Protect banking and OTPs.</strong> Do not share BVN, OTP, card PINs, or remote-access apps that let someone control your phone.</li>
<li><strong>Test the offer logic.</strong> Extreme pay for trivial phone tasks with no skills interview is a red flag, not a blessing.</li>
<li><strong>Use known platforms when you can.</strong> Established job boards and freelance marketplaces still need care, but random DM “HR managers” need extra proof.</li>
</ol>

<h2>Red flags checklist</h2>
<ul>
<li>Pay first, earn later.</li>
<li>Only communicates on consumer chat apps; refuses official email or video call.</li>
<li>Grammar and brand logos look copied or inconsistent.</li>
<li>Asks you to recruit friends quickly for bonuses.</li>
<li>Threatens that your “account will be banned” unless you pay today.</li>
<li>Wants remote desktop control of your device.</li>
</ul>

<h2>If you already paid</h2>
<p>Stop sending more money. Save screenshots, wallet addresses, bank details, and chat logs. Report through your bank or fintech in-app fraud channel when relevant. Ignore “recovery agents” who DM you promising to reverse the loss for another fee — that is often a second scam.</p>

<h2>What real remote work tends to look like</h2>
<p>Clear scope, slower hiring, written agreements or platform contracts, and no requirement to pay the employer to access your own pay. Skills (writing, design, support, development) usually matter more than “just have a phone.”</p>

<h2>Disclaimer</h2>
<p>This guide is <strong>educational only</strong>. It is not financial, legal, or employment advice. Verify opportunities yourself and never risk money you cannot afford to lose.</p>`;

const AFFILIATE = `<h2>Start here</h2>
<p>Affiliate marketing means you recommend a product or service and earn a commission if someone buys through your tracking link. It is a real model used by many creators — and also a topic full of “quit your job in 30 days” hype.</p>
<p>This guide is for beginners who want an honest map: how it works, what to learn first, and which promises to ignore. Educational only — not financial advice.</p>

<h2>How a simple affiliate flow works</h2>
<ol>
<li>A company runs an affiliate or referral program.</li>
<li>You join and receive a unique link or code.</li>
<li>You publish useful content (review, tutorial, comparison) that includes the link where it genuinely fits.</li>
<li>If a reader buys within the program rules, you may earn a commission after returns and fraud checks.</li>
</ol>
<p>You do not hold inventory. You do hold responsibility for not lying about products.</p>

<h2>Step-by-step starter path</h2>
<ol>
<li><strong>Pick a narrow topic you can explain.</strong> Phone photography, budget tools, study apps, or a skill you already practice beats “everything online.”</li>
<li><strong>Learn one product deeply.</strong> Use it if you can. Take notes on setup, limits, and who it is not for.</li>
<li><strong>Join official programs only.</strong> Prefer known networks or the brand’s own affiliate page. Avoid random people selling “affiliate slots” for a fee.</li>
<li><strong>Write for humans first.</strong> Search intent matters: “how to…”, “vs…”, “is it worth it…”. Stuffing links with no help ranks poorly and burns trust.</li>
<li><strong>Disclose relationships.</strong> Say when a link is affiliate. Clear disclosure builds long-term credibility.</li>
<li><strong>Track what little traffic you have.</strong> Which posts get clicks? Which offers convert? Kill weak angles early.</li>
<li><strong>Stay inside program rules.</strong> Brand bidding, spam, or fake urgency can get accounts banned.</li>
</ol>

<h2>Tips that actually help beginners</h2>
<ul>
<li>One useful article beats ten thin listicles.</li>
<li>Screenshots and honest limits outperform hype thumbnails alone.</li>
<li>Email or community follow-up only if people opt in — do not buy shady “buyer lists.”</li>
<li>Combine affiliate with a real skill (editing, support, tutoring) so income is not only commission luck.</li>
</ul>

<h2>Watch outs and scam patterns</h2>
<ul>
<li>Courses that guarantee affiliate income.</li>
<li>Paying upfront for “secret high-ticket programs” with no verifiable product.</li>
<li>Fake dashboards showing commissions you cannot withdraw without fees.</li>
<li>Pressure to recruit a downline more than to help customers.</li>
</ul>

<h2>Disclaimer</h2>
<p>Educational only — not financial advice. Commissions are not guaranteed. Programs change rules. Do your own checks before promoting any product.</p>`;

const P2P = `<h2>Start here</h2>
<p>Peer-to-peer (P2P) crypto trading matches you with another person: you pay naira (or receive naira) while crypto moves on an escrow-style platform — or, in risky cases, through pure chat deals with no protection.</p>
<p>This guide explains common safety habits and red flags. It is <strong>not</strong> trading advice and not an instruction to break any law. Know your local rules before you touch crypto.</p>

<h2>Why P2P feels convenient — and risky</h2>
<p>Bank transfers are familiar. Crypto can move fast. Scammers exploit that gap with fake payment screenshots, chargeback-style reversals, impersonation of support, and off-platform deals that remove escrow protection.</p>

<h2>Step-by-step safer habits</h2>
<ol>
<li><strong>Prefer reputable platforms with on-platform chat and escrow</strong> over sending money to a stranger’s account from a random Telegram contact.</li>
<li><strong>Keep the whole deal inside official chat</strong> until release conditions are met. Moving to WhatsApp “for speed” is a frequent trap.</li>
<li><strong>Verify payment in your real banking app</strong>, not only a picture someone sent. Screenshots are easy to fake.</li>
<li><strong>Use exact name matching where the platform requires it.</strong> Third-party payments are a common dispute source.</li>
<li><strong>Start with small amounts</strong> while you learn the flow. Do not “prove trust” with a large first trade.</li>
<li><strong>Enable strong account security</strong>: unique password, 2FA that is not SMS-only if better options exist, and care with device access.</li>
<li><strong>Never share codes or seed phrases.</strong> Support will not need your recovery phrase to “unlock” an order.</li>
<li><strong>Stop if urgency spikes.</strong> Fake time limits and threats are social pressure tools.</li>
</ol>

<h2>Red flags</h2>
<ul>
<li>Trader insists you release crypto before you have independently confirmed funds.</li>
<li>Requests to pay a “release fee,” “miner fee,” or “tax” to a personal wallet mid-trade.</li>
<li>Accounts with thin history pushing huge limits immediately.</li>
<li>Anyone asking for remote control of your phone or bank app.</li>
<li>Impersonators claiming to be platform support in side chats.</li>
</ul>

<h2>If something goes wrong</h2>
<p>Use the platform’s dispute process with evidence. Contact your bank or fintech fraud team if a transfer is involved. Do not pay recovery strangers who message you afterward.</p>

<h2>Disclaimer</h2>
<p>Educational only — not financial, investment, or legal advice. Crypto and P2P involve a real risk of loss. Follow applicable laws and platform rules. Nothing here promises profit or safety.</p>`;

async function main() {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error('Missing CF credentials');
    process.exit(1);
  }

  // Purge known bad rows
  await d1(`DELETE FROM articles WHERE content LIKE ?`, ['%Okay, I need to%']);
  await d1(`DELETE FROM articles WHERE content LIKE ?`, ['%Data Clean Room%']);
  await d1(`DELETE FROM articles WHERE title = ?`, ['Remote work']);
  await d1(`DELETE FROM articles WHERE title = ?`, ['Digital Product Ideas for Beginners']);
  console.log('purged leaky/thin titles');

  await upsert({
    title: 'Remote job offers on WhatsApp and Telegram: how to verify before you pay',
    summary:
      'A practical guide to spotting fake remote jobs, avoiding activation fees, and checking employers — educational only, not financial advice.',
    content: REMOTE,
    category: 'scams',
    image_url: '/covers/scams.svg',
    minutes: 11,
  });

  await upsert({
    title: 'Affiliate marketing for beginners: honest steps without the 30-day fantasy',
    summary:
      'How affiliate links work, a realistic starter path, disclosures, and scam courses to avoid. Educational only — not financial advice.',
    content: AFFILIATE,
    category: 'opportunities',
    image_url: '/covers/hustle.svg',
    minutes: 12,
  });

  await upsert({
    title: 'P2P crypto safety basics: escrow, screenshots, and pressure plays',
    summary:
      'Beginner safety habits for peer-to-peer crypto trades — red flags, off-platform chat risks, and what to do after a loss. Not trading advice.',
    content: P2P,
    category: 'scams',
    image_url: '/covers/crypto.svg',
    minutes: 11,
  });

  console.log('seed-fix-quality done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
