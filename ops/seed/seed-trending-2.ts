/** Seed 2 SEO articles from 2026 niche trends: crypto task jobs + fake airdrop/giveaway traps */
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

async function publish(a: {
  title: string;
  summary: string;
  content: string;
  category: string;
  image_url: string;
  minutes: number;
}) {
  await d1(`DELETE FROM articles WHERE title = ?`, [a.title]);
  const id = rid();
  const slug = `${slugify(a.title)}-${id.slice(-5)}`;
  const r = await d1(
    `INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, status, author_team, source_name, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', 'LaneCash Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now'))`,
    [id, slug, a.title, a.summary, a.content, a.category, a.image_url, a.minutes]
  );
  console.log(r ? 'OK' : 'FAIL', a.title, slug);
}

const TASK = `<h2>Start here</h2>
<p>In 2025–2026, one of the loudest online money traps is the <strong>crypto task job</strong> (also called a task scam or side-gig fraud). It usually starts on Telegram, WhatsApp, SMS, or Instagram: “easy remote work,” “rate apps,” “optimize products,” or “part-time for a big brand.” Small payments arrive first. Later you are told to deposit USDT or naira to “unlock” higher tasks or withdraw a growing balance.</p>
<p>Law-enforcement and consumer reports in multiple countries treat this pattern as a major job-scam category. This guide explains the script in plain language so you can exit early. Educational only — not legal or financial advice.</p>

<h2>Why this topic is trending</h2>
<p>People search for phone jobs and side hustles. Scammers answer that demand with polished dashboards, mentor chats, and fake group screenshots. Crypto is used because transfers are fast and hard to reverse. The first small payout is not generosity — it is bait.</p>

<h2>How the script usually runs</h2>
<ol>
<li><strong>Cold contact.</strong> A stranger messages you. Sometimes they pretend to recruit for a real company name.</li>
<li><strong>Simple tasks.</strong> Like posts, leave reviews, click “boost,” or complete items on a website that looks like a workplace.</li>
<li><strong>Small real payment.</strong> A little money hits your bank, fintech, or wallet so you relax.</li>
<li><strong>Escalation.</strong> To reach the next “level” or clear a negative order, you must deposit your own funds.</li>
<li><strong>Freeze and pressure.</strong> Withdrawal is blocked until another fee, tax, or margin payment. Mentors push urgency.</li>
<li><strong>Exit or loss.</strong> People who stop early lose less. People who chase the dashboard balance lose far more.</li>
</ol>

<h2>Step-by-step: protect yourself</h2>
<ol>
<li><strong>Treat unsolicited high-pay phone jobs as suspect</strong> until proven through a real company channel you found yourself.</li>
<li><strong>Rule: a job does not require you to pay to receive wages.</strong> Deposits, recharges, “merchant codes,” and “unlock fees” are the product being sold to you.</li>
<li><strong>Keep work offers on official email or known platforms</strong> when possible. Pure Telegram “HR” with no verifiable employer is a weak signal.</li>
<li><strong>Do not join pressure groups</strong> that only exist to show staged withdrawal screenshots.</li>
<li><strong>Never share OTP, seed phrases, or remote-control access</strong> to “help you set up the job wallet.”</li>
<li><strong>If you already deposited, stop sending more.</strong> Save chats, wallet addresses, and bank references. Use your bank/fintech fraud channel. Ignore “recovery agents” who DM you next.</li>
</ol>

<h2>Red flags checklist</h2>
<ul>
<li>Offer arrived as a random DM or text, not from an application you submitted.</li>
<li>Pay is high for trivial tasks with almost no interview.</li>
<li>You must move to private chat immediately.</li>
<li>Balance rises quickly on a website you cannot independently verify.</li>
<li>Withdrawal requires a larger personal deposit.</li>
<li>Threats that your account will be banned unless you pay today.</li>
</ul>

<h2>What to search and read instead</h2>
<p>If you want real skills on a phone, practice clear offers (editing, support, writing) and use platforms with public reputations — still carefully. Pair that path with LaneCash scam lists on task apps and fake admins so hype does not overwrite caution.</p>

<h2>Disclaimer</h2>
<p>This article is <strong>educational only</strong>. It is not financial, investment, or legal advice. Scam tactics change. Verify information with official sources and never risk money you cannot afford to lose.</p>`;

const AIRDROP = `<h2>Start here</h2>
<p>Another feed pattern that spikes whenever a real crypto project makes news is the <strong>fake airdrop or giveaway</strong>. Someone posts “comment your wallet,” “verify to claim,” or “send a small amount to receive more.” Brand names, minted tokens, or celebrity giveaways get cloned within hours.</p>
<p>In September 2026, for example, public posts warned that some new network tokens were <em>minted for technical reasons</em> but <strong>not</strong> open for public claim — while scam replies still begged for addresses. The lesson is general: official status and reply-guy status are not the same.</p>

<h2>Why fake airdrops spread so fast</h2>
<ul>
<li>Real projects announce milestones; scammers ride the same keywords.</li>
<li>People want free tokens; urgency short-circuits checking.</li>
<li>On-chain transfers are hard to undo once sent.</li>
<li>Phishing sites ask for seed phrases or unlimited token approvals.</li>
</ul>

<h2>Step-by-step filter before you touch anything</h2>
<ol>
<li><strong>Find the official account and site yourself</strong> from a bookmark or a source you already trust — not from a reply under a viral post.</li>
<li><strong>Read the actual announcement.</strong> “Token minted” or “testnet” is not the same as “claim now with your seed phrase.”</li>
<li><strong>Never type a recovery phrase into a website</strong> to “validate” an airdrop.</li>
<li><strong>Be careful with wallet connect and signatures.</strong> If you do not understand the permission, do not approve.</li>
<li><strong>Sending crypto to receive more is not how legitimate airdrops work</strong> in the common public cases people describe — treat “send 0.1 to get 1” as a loss trap.</li>
<li><strong>Mute reply spam</strong> that only harvests addresses or drives traffic to clone domains.</li>
</ol>

<h2>Celebrity and brand giveaway clones</h2>
<p>Fake pages using famous creator names often ask for a small “verification deposit” before a prize. Real brands do not need you to pay to receive a giveaway. If a page feels urgent and off-brand, leave.</p>

<h2>Tips that keep you safer</h2>
<ul>
<li>Use a separate browser profile or wallet for experiments if you explore crypto at all.</li>
<li>Check domain spelling character by character.</li>
<li>Prefer hardware or well-known wallet software guidance from primary docs — not from a Telegram admin who messaged first.</li>
<li>If you lost funds, document everything; beware second-wave “recovery” scams.</li>
</ul>

<h2>Disclaimer</h2>
<p>Educational only — not financial or investment advice. Crypto involves risk of total loss. This is not a recommendation to buy, sell, or claim any token. Always verify with official project channels.</p>`;

async function main() {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error('Missing CF credentials');
    process.exit(1);
  }
  await publish({
    title: 'Telegram and WhatsApp crypto task jobs: how the “easy work” script drains deposits',
    summary:
      '2026 task-scam playbook: small payouts, rising balances, then USDT or naira deposits to unlock withdrawals. Red flags and exit steps — educational only.',
    content: TASK,
    category: 'scams',
    image_url: '/covers/scams.svg',
    minutes: 12,
  });
  await publish({
    title: 'Fake crypto airdrops and “comment your wallet” traps: a practical filter',
    summary:
      'How fake airdrops and giveaway clones ride real project news — seed phrases, send-to-receive tricks, and safer habits. Not financial advice.',
    content: AIRDROP,
    category: 'scams',
    image_url: '/covers/crypto.svg',
    minutes: 11,
  });
  console.log('seed-trending-2 done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
