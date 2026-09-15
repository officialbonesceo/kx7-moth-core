/** 10 educational posts from current social trends + scam lists */
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const CF_D1_DATABASE_ID = process.env.CF_D1_DATABASE_ID || '';

const D =
  '<h2>Disclaimer</h2><p>This guide is educational only. It is not financial, investment, or legal advice. Nothing here promises income. Verify tools yourself and never risk money you cannot afford to lose.</p>';

type A = { slug: string; title: string; summary: string; category: string; content: string; reading_minutes: number };

function article(slug: string, title: string, summary: string, category: string, body: string, mins = 9): A {
  return { slug, title, summary, category, reading_minutes: mins, content: body.trim() + D };
}

const ARTICLES: A[] = [
  article(
    'scam-list-engagement-airdrops-x',
    'Scam list: engagement airdrops that ask for your wallet on X',
    'Comment-your-address campaigns are flooding timelines. A clear list of red flags and safer habits.',
    'scams',
    `<h2>What is trending</h2>
<p>X feeds keep pushing “drop your SOL/BNB wallet,” “every wallet gets,” and twelve-hour countdowns. Some posts are pure engagement farms. Some are worse. This list helps you sort noise from danger without treating every project discussion as fake.</p>
<h2>Common patterns to flag</h2>
<ul>
<li>Must comment address to “qualify”</li>
<li>Only proof is screenshots in the same thread</li>
<li>Pressure, insults, or FOMO if you pause</li>
<li>Links that ask for seed phrases or “wallet sync”</li>
<li>Pay a fee to unlock a claim or withdrawal</li>
</ul>
<h2>Safer habits</h2>
<ol>
<li>Never paste a seed phrase into a site from a reply</li>
<li>Type domains yourself</li>
<li>Use a throwaway experiment wallet if you experiment at all</li>
<li>If you cannot explain the product in one calm sentence, do not connect</li>
</ol>
<h2>Why this keeps spreading</h2>
<p>Reply chains boost reach. Greed and fear compress judgment. Your advantage is delay and verification outside the hype.</p>`
  ),
  article(
    'scam-list-task-apps-pay-to-withdraw',
    'Scam list: task apps and “job” dashboards that charge to withdraw',
    'Rising balances, easy tasks, then unlock fees — still one of the most common phone scams.',
    'scams',
    `<h2>The loop</h2>
<p>You complete tiny tasks. A dashboard shows growing “earnings.” Withdrawal needs a fee, tax, or upgrade. Sometimes a second fee appears. That is extraction, not employment.</p>
<h2>Red flags</h2>
<ul>
<li>Pay to receive wages</li>
<li>Recruiters only on consumer chat apps</li>
<li>Extreme pay for trivial work</li>
<li>Pressure to recruit friends fast</li>
<li>No verifiable company identity</li>
</ul>
<h2>What real work tends to look like</h2>
<p>Slower hiring, clearer scope, no “pay us to unlock your salary.” Boredom is often a positive signal.</p>
<h2>If you already paid</h2>
<p>Stop sending more money. Document what happened. Ignore “recovery agents” who DM promising to reverse the loss for another fee — that is often a second scam.</p>`
  ),
  article(
    'scam-list-telegram-fake-admins',
    'Scam list: Telegram “admin” and fake support pressure plays',
    'Urgency, private chats, and payment requests from accounts claiming to be support.',
    'scams',
    `<h2>Typical play</h2>
<p>An “admin” messages first. You are moved private quickly. Payment or wallet action is framed as the only fix. Screenshots of other people’s success replace a real process.</p>
<h2>Rules that help</h2>
<ul>
<li>Official support rarely demands urgency in cold DMs</li>
<li>You may insist on public instructions on a domain you typed</li>
<li>If refusal ends the chat, that is useful information</li>
</ul>
<h2>Related risks</h2>
<p>Fake giveaway channels, cloned handles, and file APKs from chat. Prefer official app stores and typed URLs.</p>`
  ),
  article(
    'scam-list-recovery-agents-after-loss',
    'Scam list: “recovery” agents who appear after you already lost money',
    'The second hit often targets embarrassed victims with paid recovery promises.',
    'scams',
    `<h2>Why this works</h2>
<p>After a loss, people want a clean ending. Predators sell hope: pay a fee, share details, “we reverse the transfer.” Many deepen the damage.</p>
<h2>Hard rules</h2>
<ul>
<li>Do not pay strangers to undo a prior scam</li>
<li>Do not share seed phrases with “investigators”</li>
<li>Write down what happened offline while details are fresh</li>
<li>Warn friends who might be targeted the same way</li>
</ul>
<h2>Better path</h2>
<p>For large losses, seek legitimate local guidance — not random chat experts. Silence from real institutions is frustrating; paid miracles in DMs are usually worse.</p>`
  ),
  article(
    'realistic-money-young-people-x-2026',
    '“Most realistic way to make money right now?” — a calm answer to the X question',
    'Timelines keep asking what actually works for young people. Separate skill paths from speculation theater.',
    'money',
    `<h2>The question on repeat</h2>
<p>Posts asking for the most realistic way to make money as a young person keep circulating. Replies mix freelancing, trading, content, and luck narratives. Mixing them without labels is how beginners get hurt.</p>
<h2>Skill side</h2>
<p>Writing, short-video editing, simple design, local services, careful outreach. Proof samples matter more than bios. Progress is slow and visible.</p>
<h2>Speculation side</h2>
<p>Memes, aggressive trading, engagement airdrops. Outliers get screenshots. Wipeouts stay quiet. This is not a beginner curriculum if you cannot afford losses.</p>
<h2>A practical split</h2>
<ul>
<li>Learning path: time + sample you control</li>
<li>Danger path: money or secrets to strangers to “unlock” progress</li>
<li>Marketing path: only proof is someone else’s screenshot</li>
</ul>
<h2>One week on the skill side</h2>
<ol>
<li>One lane for seven days</li>
<li>Three practice blocks</li>
<li>One finished sample</li>
<li>One clear offer sentence</li>
</ol>`
  ),
  article(
    'trading-content-hype-vs-skill-stack',
    'Trading and “lock in” content is loud — build skills before you risk cash',
    'Creator-traders sell lifestyle and ratios. Beginners need risk rules first, not more screenshots.',
    'guides',
    `<h2>What the feed sells</h2>
<p>Trading content promises time freedom and clean win ratios. Some educators are careful. Many posts are marketing. Without a written risk rule, beginners treat entertainment as instruction.</p>
<h2>Before any risk capital</h2>
<ul>
<li>Money you can lose without harming rent or food</li>
<li>A maximum loss per week written down</li>
<li>No borrowing to trade</li>
<li>No signal groups that demand upfront fees for “sure” entries</li>
</ul>
<h2>Parallel skill stack</h2>
<p>While you study markets slowly — or decide not to trade — build a phone skill that does not require betting: editing, writing, client outreach. That stack still works if trading is paused.</p>`
  ),
  article(
    'web3-luck-vs-grind-honest-frame',
    'Web3 grind vs luck: an honest frame for campaign culture',
    'People grind campaigns for weeks and still miss outcomes while others get lucky. What that means for your plan.',
    'guides',
    `<h2>The uncomfortable observation</h2>
<p>In Web3 spaces, hard work can put you in the room while luck opens some doors. That observation is circulating again for a reason: leaderboards and contribution campaigns are unpredictable for individuals.</p>
<h2>What you can control</h2>
<ul>
<li>Time budget per week so campaigns do not eat skill practice</li>
<li>Never paying to “boost” a claim</li>
<li>Documenting what you learned even if rewards miss</li>
<li>Keeping a non-crypto income skill alive</li>
</ul>
<h2>What you cannot control</h2>
<p>Token outcomes, leaderboard ties, and who gets early access. Plan as if rewards are uncertain. Then any upside is surplus, not a mortgage on your week.</p>`
  ),
  article(
    'capcut-phone-editing-client-path',
    'CapCut on your phone: from practice clips to a simple client offer',
    'Mobile editing stays a realistic skill path while timelines push faster fantasies.',
    'opportunities',
    `<h2>Why this skill still matters</h2>
<p>Short video is not slowing down. Small businesses and creators need cuts, captions, and clean vertical exports. CapCut-class tools on a phone are enough to practice.</p>
<h2>Workflow</h2>
<ol>
<li>Import one clip</li>
<li>Cut silence</li>
<li>Captions and spelling</li>
<li>Export vertical</li>
</ol>
<h2>Offer sentence</h2>
<p>“I help small shops get clearer product videos with CapCut edits so posts look less rushed.”</p>
<h2>Ethics</h2>
<p>Show real samples. Do not invent client results. Disclose affiliates if you recommend tools for pay.</p>`
  ),
  article(
    'signal-groups-and-paid-tips-red-flags',
    'Paid signal groups and “sure tips”: red flags before you subscribe',
    'Upfront fees for guaranteed entries are a recurring social scam adjacent to trading hype.',
    'scams',
    `<h2>Pitch pattern</h2>
<p>Private group, limited seats, screenshots of wins, pressure to pay today. Losses are blamed on you for “not following rules.”</p>
<h2>Red flags</h2>
<ul>
<li>Guaranteed returns language</li>
<li>No verifiable track record outside the sales chat</li>
<li>Pressure to deposit on a specific platform via their link only</li>
<li>Admins who insult skeptics</li>
</ul>
<h2>Safer stance</h2>
<p>If you study markets, do it with money you can lose and sources you can audit. Free public education plus strict personal risk rules beats paid certainty theater.</p>`
  ),
  article(
    'mute-list-for-cleaner-money-feed',
    'Build a mute list so your feed stops recruiting you into scams',
    'Attention is an asset. Practical mutes and filters for money and crypto timelines.',
    'guides',
    `<h2>Why muting is strategy</h2>
<p>Feeds are designed for engagement. Scam and hype posts are engineered for replies. Muting is not weakness; it is protecting practice time.</p>
<h2>Useful mute targets</h2>
<ul>
<li>“Drop your wallet” / “comment address”</li>
<li>“Every wallet gets”</li>
<li>Pay-to-unlock / recovery agent language</li>
<li>Accounts that only post giveaway chains</li>
</ul>
<h2>Replace the noise</h2>
<p>Follow a small set of educators who show process, not only payouts. Schedule skill blocks offline when possible. Review money once a week with a short written agenda.</p>
<h2>Bottom line</h2>
<p>You cannot out-reply an infinite engagement farm. You can choose a quieter input diet and a finished sample over another address comment.</p>`
  ),
];

async function d1(sql: string, params: any[] = []) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${CF_API_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql, params }),
    }
  );
  const parsed = JSON.parse(await res.text());
  if (!res.ok || parsed.success === false) throw new Error(JSON.stringify(parsed.errors || parsed).slice(0, 400));
  return parsed;
}

function cover(cat: string) {
  if (cat === 'scams') return '/covers/scams.svg';
  if (cat === 'money') return '/covers/money.svg';
  if (cat === 'opportunities') return '/covers/hustle.svg';
  return '/covers/hustle.svg';
}

async function main() {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error('missing creds');
    process.exit(1);
  }
  await d1(`ALTER TABLE articles ADD COLUMN author_team TEXT`).catch(() => {});
  await d1(`ALTER TABLE articles ADD COLUMN source_name TEXT`).catch(() => {});
  await d1(`ALTER TABLE articles ADD COLUMN source_url TEXT`).catch(() => {});

  let ok = 0;
  for (const a of ARTICLES) {
    const id = 's10_' + a.slug.replace(/[^a-z0-9]/g, '').slice(0, 22);
    await d1(`DELETE FROM articles WHERE slug = ? OR id = ?`, [a.slug, id]);
    await d1(
      `INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, status, author_team, source_name, source_url, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', 'LaneCash Desk', 'LaneCash', NULL, datetime('now'), datetime('now'), datetime('now'))`,
      [id, a.slug, a.title, a.summary, a.content, a.category, cover(a.category), a.reading_minutes]
    );
    console.log('published', a.slug);
    ok++;
  }
  console.log('done', ok);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
