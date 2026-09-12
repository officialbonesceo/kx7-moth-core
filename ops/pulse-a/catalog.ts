/** Vast rotating topic catalog — always starts from basics + tips */

export type Cat = 'money' | 'opportunities' | 'scams' | 'guides';

export type CatalogItem = {
  key: string;
  title: string;
  summary: string;
  category: Cat;
  team: string;
  basics: string[];
  tips: string[];
  beats: string[];
};

export const CATALOG: CatalogItem[] = [
  { key: 'yt-algo', title: 'YouTube algorithm basics: hooks, retention, and posting cadence', summary: 'Start from zero: what YouTube measures, basic hooks, and a simple posting rhythm.', category: 'guides', team: 'LaneCash Creator Desk', basics: ['YouTube promotes videos people watch and return to', 'A channel needs a clear topic lane', 'One video = one promise in the title'], tips: ['Spend 30 minutes writing the first 3 seconds before filming', 'Batch 3 videos in one day once a week', 'Reply to 5 comments after each upload'], beats: ['Packaging is title + thumbnail as one idea', 'Retention matters more than raw views early', 'Series help autoplay', 'Ignore vanity follower screenshots'] },
  { key: 'tt-algo', title: 'TikTok basics for beginners: watch time, saves, and simple series', summary: 'Beginner TikTok: how distribution works and beginner tips that do not require trends spam.', category: 'guides', team: 'LaneCash Creator Desk', basics: ['TikTok tests posts with small audiences first', 'Replays and saves help', 'On-screen text helps silent viewers'], tips: ['Film vertical with the subject higher in frame', 'Use one idea per video', 'Post consistently for 14 days before judging'], beats: ['Hook in the first second', 'Series and pinned posts', 'Batch filming', 'Avoid fake engagement services'] },
  { key: 'aff-start', title: 'Affiliate marketing basics: offers, traffic, and honest disclosures', summary: 'Beginner affiliate path: pick an offer you understand, send traffic, disclose clearly.', category: 'opportunities', team: 'LaneCash Growth Desk', basics: ['Affiliate = you recommend, you earn a commission if someone buys', 'You need traffic + trust', 'Disclosure is required when you earn'], tips: ['Start with one offer only', 'Write a real comparison not hype', 'Track clicks for 14 days before switching offers'], beats: ['Offer selection', 'Traffic types', 'Content formats', 'Kill bad offers fast'] },
  { key: 'drop-real', title: 'Dropshipping basics: margins, suppliers, and honest shipping times', summary: 'Beginner dropshipping: cost math first, ads second, no fantasy margins.', category: 'opportunities', team: 'LaneCash Commerce Desk', basics: ['You sell, a supplier ships', 'Profit = price − product − shipping − ads − fees − returns', 'Slow shipping kills trust'], tips: ['Calculate landed cost before running ads', 'Order a test product to yourself', 'Write real delivery times on the store'], beats: ['Validation week', 'Supplier checks', 'Creative tests', 'Refund risk'] },
  { key: 'airdrop-safe', title: 'Airdrop basics: how claims work and how fakes steal wallets', summary: 'Beginner airdrop safety: official sources only, never pay to claim, protect seed phrases.', category: 'opportunities', team: 'LaneCash Crypto Desk', basics: ['Real airdrops come from project teams, not random DMs', 'You should not pay a fee to receive tokens', 'Wallet connect can be dangerous on fake sites'], tips: ['Bookmark official sites typed by you', 'Use a separate burner wallet for experiments', 'If rushed or threatened, exit'], beats: ['Verification steps', 'Phishing patterns', 'Record keeping'] },
  { key: 'tg-earn', title: 'Telegram earning basics: task bots, signals, and fee traps', summary: 'Beginner guide to Telegram money claims — what can be real small tasks vs extraction scams.', category: 'scams', team: 'LaneCash Scam Team', basics: ['Anyone can create a Telegram channel', 'Screenshots are easy to fake', 'Upfront fees are a major red flag'], tips: ['Never pay to unlock a withdrawal', 'Ask for a public verifiable payout trail', 'Start with zero deposit experiments only'], beats: ['Task bots', 'Signal groups', 'Admin fee scams', 'Verification list'] },
  { key: 'freelance-global', title: 'Freelance basics: offer, portfolio sample, and first proposal', summary: 'Beginner freelancing: one clear offer, one sample, and proposals that respect clients.', category: 'opportunities', team: 'LaneCash Hustle Desk', basics: ['Clients buy outcomes not hours at first', 'A sample beats a long bio', 'Clear scope prevents fights'], tips: ['Write offer in one sentence', 'Make one sample this week', 'Send 10 tailored proposals not 100 spam'], beats: ['Positioning', 'Proposal formula', 'Red flags', 'Payment protection'] },
  { key: 'budget-simple', title: 'Money basics: a weekly system you can run from your phone', summary: 'Beginner money system: income, bills, buffer, and one goal — weekly not complicated.', category: 'money', team: 'LaneCash Fin Team', basics: ['Know income after fees', 'List fixed bills', 'Keep a small buffer'], tips: ['Review money once a week on the same day', 'Separate hustle money from food money', 'Automate one savings transfer if possible'], beats: ['Four buckets', 'Tracking light', 'Debt minimums'] },
  { key: 'scam-job', title: 'Remote job scam basics: fake recruiters and task traps', summary: 'Beginner protection against fake remote jobs and task scams.', category: 'scams', team: 'LaneCash Scam Team', basics: ['Real employers do not ask you to pay for the job', 'Task scams pay small then demand fees', 'Recruiters can be impersonated'], tips: ['Verify company domain email', 'Never buy equipment for a stranger', 'Stop when asked for gift cards or crypto fees'], beats: ['Patterns', 'Document phishing', 'Exit steps'] },
  { key: 'content-batch', title: 'Content basics: batch one week of posts in one sitting', summary: 'Beginner batching so you stop daily panic posting.', category: 'guides', team: 'LaneCash Creator Desk', basics: ['Batching = plan then film then edit', 'One theme per day reduces decisions', 'Captions can be written in a bank'], tips: ['Use CapCut or Canva templates', 'Film standing clips in one hour', 'Schedule only after quality check'], beats: ['Theme days', 'Script templates', 'Assembly line'] },
  { key: 'usdt-p2p', title: 'USDT P2P basics: release rules that prevent chat scams', summary: 'Beginner P2P safety: confirm payment before release, ignore pressure.', category: 'scams', team: 'LaneCash Crypto Desk', basics: ['P2P is peer trading with platform escrow on good platforms', 'Release only after confirmed payment', 'Chat outside the app increases risk'], tips: ['Use platform chat', 'Start with small size', 'Never release early for sob stories'], beats: ['Impersonation', 'Escrow discipline', 'Personal rules'] },
  { key: 'digital-product', title: 'Digital product basics: one problem, one file, one checkout', summary: 'Beginner digital product: solve one problem with a small file and a clear checkout.', category: 'opportunities', team: 'LaneCash Growth Desk', basics: ['Start tiny not with a 50-module course', 'People buy specific outcomes', 'Delivery should be automatic or simple'], tips: ['Interview 3 people with the problem', 'Price for a first test not forever', 'Promote where the problem is discussed'], beats: ['Formats', 'Checkout', 'Promotion without spam'] },
];

export function expandItem(item: CatalogItem) {
  const basics = item.basics.map((b) => `<li>${b}</li>`).join('');
  const tips = item.tips.map((t) => `<li>${t}</li>`).join('');
  const beats = item.beats.map((b) => `<li>${b}</li>`).join('');
  const content = `
<h2>Start here (basics)</h2>
<p>If you are new, read this section first. Master these points before advanced tactics.</p>
<ul>${basics}</ul>
<h2>Beginner tips</h2>
<ul>${tips}</ul>
<h2>What this really is</h2>
<p>${item.summary} This guide stays practical: mechanisms, costs, risks, and actions — not hype.</p>
<h2>How it works in practice</h2>
<ul>${beats}</ul>
<h2>Costs and realistic outcomes</h2>
<p>Write a test budget before you start. Track time and cash separately. Skip anything that needs constant new deposits to unlock payouts or guarantees daily profit.</p>
<h2>Risks and common scams</h2>
<p>Reject upfront job fees, guaranteed-return apps, fake airdrop claim sites, Telegram admins demanding verification payments, and recovery scammers after a loss.</p>
<h2>Exact steps for this week</h2>
<ol>
<li>Write a one-sentence goal for this topic.</li>
<li>List tools you already have.</li>
<li>Do the smallest proof action in 48 hours.</li>
<li>Log result, time, and any fee.</li>
<li>Decide: continue, revise, or stop.</li>
</ol>
<h2>What good looks like in 7 and 30 days</h2>
<p><strong>7 days:</strong> one real proof action and notes you can reuse.</p>
<p><strong>30 days:</strong> a repeatable workflow or a clear stop decision based on data.</p>
<h2>Final checklist</h2>
<ul>
<li>Can I explain the basics in plain language?</li>
<li>Did I avoid fee and guarantee traps?</li>
<li>Do I have one proof asset?</li>
<li>Do I have a kill switch if results stay flat?</li>
</ul>
`.trim();
  return {
    title: item.title,
    summary: item.summary,
    category: item.category,
    author_team: item.team,
    content,
  };
}

export function pickBatch(n: number, existingTitles: Set<string>): CatalogItem[] {
  const day = Math.floor(Date.now() / 86400000);
  const rotated = [...CATALOG].sort((a, b) => hash(a.key + day) - hash(b.key + day));
  const out: CatalogItem[] = [];
  for (const item of rotated) {
    if (existingTitles.has(item.title)) continue;
    out.push(item);
    if (out.length >= n) break;
  }
  return out;
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
