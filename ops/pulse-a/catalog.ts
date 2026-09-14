/** Topic catalog — pickBatch creates unique weekly titles so runs do not stall at 0 */

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
  { key: 'ig-reels', title: 'Instagram Reels basics: packaging, captions, and consistency', summary: 'Beginner Reels workflow without buying followers.', category: 'guides', team: 'LaneCash Creator Desk', basics: ['Reels compete on watch time and shares', 'One clear idea per clip', 'Caption supports the CTA'], tips: ['Batch film standing clips', 'Reuse a simple cover style', 'Track saves not only views'], beats: ['Topic lanes', 'Hooks', 'Weekly cadence'] },
  { key: 'aff-start', title: 'Affiliate marketing basics: offers, traffic, and honest disclosures', summary: 'Beginner affiliate path: pick an offer you understand, send traffic, disclose clearly.', category: 'opportunities', team: 'LaneCash Growth Desk', basics: ['Affiliate = recommend and earn if someone buys', 'You need traffic and trust', 'Disclosure is required when you earn'], tips: ['Start with one offer only', 'Write a real comparison not hype', 'Track clicks for 14 days before switching offers'], beats: ['Offer selection', 'Traffic types', 'Content formats', 'Kill bad offers fast'] },
  { key: 'aff-content', title: 'Affiliate content basics: reviews, comparisons, and honest demos', summary: 'Create affiliate pages and videos people trust.', category: 'guides', team: 'LaneCash Growth Desk', basics: ['People buy after proof', 'Comparisons reduce confusion', 'Fake reviews destroy trust'], tips: ['Show real screenshots', 'State who the product is for', 'Update when pricing changes'], beats: ['Review structure', 'CTA placement', 'Spam patterns to avoid'] },
  { key: 'drop-real', title: 'Dropshipping basics: margins, suppliers, and honest shipping times', summary: 'Beginner dropshipping: cost math first, ads second, no fantasy margins.', category: 'opportunities', team: 'LaneCash Commerce Desk', basics: ['You sell, a supplier ships', 'Profit = price minus product shipping ads fees returns', 'Slow shipping kills trust'], tips: ['Calculate landed cost before ads', 'Order a test product to yourself', 'Write real delivery times'], beats: ['Validation week', 'Supplier checks', 'Creative tests', 'Refund risk'] },
  { key: 'drop-validate', title: 'Validate a dropshipping product in 7 days', summary: 'One-week validation before heavy ad spend.', category: 'guides', team: 'LaneCash Commerce Desk', basics: ['Demand signals beat opinions', 'Margin math first', 'Small tests beat big guesses'], tips: ['Set a kill budget', 'Test 3 creatives max', 'Stop if CPA stays impossible'], beats: ['Demand checks', 'Landed cost', 'Creative angles'] },
  { key: 'airdrop-safe', title: 'Airdrop basics: how claims work and how fakes steal wallets', summary: 'Beginner airdrop safety: official sources only, never pay to claim.', category: 'opportunities', team: 'LaneCash Crypto Desk', basics: ['Real airdrops come from project teams not random DMs', 'You should not pay a fee to receive tokens', 'Wallet connect can be dangerous on fake sites'], tips: ['Bookmark official sites typed by you', 'Use a separate burner wallet', 'If rushed or threatened, exit'], beats: ['Verification steps', 'Phishing patterns', 'Record keeping'] },
  { key: 'airdrop-verify', title: 'How to verify an airdrop before connecting your wallet', summary: 'Checklist before any wallet connect or signature.', category: 'scams', team: 'LaneCash Scam Team', basics: ['Domain typos are common', 'New contracts are higher risk', 'Signatures can drain wallets'], tips: ['Compare official social links carefully', 'Never share seed phrases', 'Walk away under pressure'], beats: ['Domain checks', 'Signature phishing', 'Clone accounts'] },
  { key: 'tg-earn', title: 'Telegram earning basics: task bots, signals, and fee traps', summary: 'What can be tiny real tasks vs extraction scams on Telegram.', category: 'scams', team: 'LaneCash Scam Team', basics: ['Anyone can create a Telegram channel', 'Screenshots are easy to fake', 'Upfront fees are a major red flag'], tips: ['Never pay to unlock a withdrawal', 'Ask for verifiable payout trail', 'Start with zero deposit experiments'], beats: ['Task bots', 'Signal groups', 'Admin fee scams'] },
  { key: 'tg-verify', title: 'How to verify a Telegram job or payout group', summary: 'Verification list before joining Telegram gigs.', category: 'scams', team: 'LaneCash Scam Team', basics: ['Payment proof must be verifiable', 'Scope should be written', 'Upfront fee is usually a scam'], tips: ['Reverse search screenshots', 'Use escrow when possible', 'Exit when pressure rises'], beats: ['Screenshot forensics', 'Contract clarity', 'Exit rules'] },
  { key: 'freelance-global', title: 'Freelance basics: offer, portfolio sample, and first proposal', summary: 'One clear offer, one sample, proposals that respect clients.', category: 'opportunities', team: 'LaneCash Hustle Desk', basics: ['Clients buy outcomes', 'A sample beats a long bio', 'Clear scope prevents fights'], tips: ['Write offer in one sentence', 'Make one sample this week', 'Send tailored proposals'], beats: ['Positioning', 'Proposal formula', 'Red flags'] },
  { key: 'client-retain', title: 'Keep freelance clients longer: delivery and boundaries', summary: 'Retention without scope chaos.', category: 'guides', team: 'LaneCash Hustle Desk', basics: ['Onboarding reduces confusion', 'Weekly updates build trust', 'Boundaries protect margins'], tips: ['Send a simple kickoff checklist', 'Confirm scope in writing', 'Raise prices with proof'], beats: ['Onboarding', 'Updates', 'Ending bad clients'] },
  { key: 'pricing-raise', title: 'Raise your prices without losing every client', summary: 'Calm rate increases using proof and packaging.', category: 'money', team: 'LaneCash Hustle Desk', basics: ['Underpricing burns you out', 'Packaging shows value', 'Grandfather rules reduce drama'], tips: ['Announce with lead time', 'Offer a clear package', 'Accept some churn'], beats: ['When to raise', 'Scripts', 'Pushback'] },
  { key: 'budget-simple', title: 'Money basics: a weekly system you can run from your phone', summary: 'Income, bills, buffer, one goal — weekly not complicated.', category: 'money', team: 'LaneCash Fin Team', basics: ['Know income after fees', 'List fixed bills', 'Keep a small buffer'], tips: ['Review money on the same day weekly', 'Separate hustle money from food money', 'Automate one savings transfer if possible'], beats: ['Four buckets', 'Tracking light', 'Debt minimums'] },
  { key: 'scam-job', title: 'Remote job scam basics: fake recruiters and task traps', summary: 'Spot fake remote jobs before you send money or documents.', category: 'scams', team: 'LaneCash Scam Team', basics: ['Real employers do not ask you to pay for the job', 'Task scams pay small then demand fees', 'Recruiters can be impersonated'], tips: ['Verify company domain email', 'Never buy equipment for a stranger', 'Stop for gift cards or crypto fees'], beats: ['Patterns', 'Document phishing', 'Exit steps'] },
  { key: 'pig-butchering', title: 'Romance and investment chat scams: the long game', summary: 'How long-game investment chats build trust and how to exit.', category: 'scams', team: 'LaneCash Scam Team', basics: ['Trust is built slowly on purpose', 'Platforms and DMs are common', 'Recovery scammers hit after the loss'], tips: ['Never invest via chat romance', 'Talk to a trusted person offline', 'Report and block'], beats: ['Stages', 'Red flags', 'Exit'] },
  { key: 'content-batch', title: 'Content basics: batch one week of posts in one sitting', summary: 'Batching so you stop daily panic posting.', category: 'guides', team: 'LaneCash Creator Desk', basics: ['Batching means plan then film then edit', 'One theme per day reduces decisions', 'Captions can live in a bank'], tips: ['Use CapCut or Canva templates', 'Film standing clips in one hour', 'Schedule only after quality check'], beats: ['Theme days', 'Script templates', 'Assembly line'] },
  { key: 'faceless', title: 'Faceless channel basics: formats that still work', summary: 'Which faceless formats still have a path and where beginners waste months.', category: 'opportunities', team: 'LaneCash Creator Desk', basics: ['Format choice matters more than gear', 'Voice and stock have policy risks', 'Monetization is not instant'], tips: ['Pick one format for 30 days', 'Track retention', 'Avoid copyright traps'], beats: ['Formats', 'Tool stack', 'Experiment design'] },
  { key: 'usdt-p2p', title: 'USDT P2P basics: release rules that prevent chat scams', summary: 'Confirm payment before release, ignore pressure.', category: 'scams', team: 'LaneCash Crypto Desk', basics: ['P2P uses peer trading', 'Release only after confirmed payment', 'Off-app chat increases risk'], tips: ['Use platform chat', 'Start small', 'Never release early for sob stories'], beats: ['Impersonation', 'Escrow discipline', 'Personal rules'] },
  { key: 'digital-product', title: 'Digital product basics: one problem, one file, one checkout', summary: 'Solve one problem with a small file and clear checkout.', category: 'opportunities', team: 'LaneCash Growth Desk', basics: ['Start tiny not with a huge course', 'People buy specific outcomes', 'Delivery should be simple'], tips: ['Interview 3 people with the problem', 'Price for a first test', 'Promote where the problem is discussed'], beats: ['Formats', 'Checkout', 'Promotion'] },
  { key: 'email-list', title: 'Build a tiny email list: lead magnet to first broadcast', summary: 'Owned audience so platforms do not fully control reach.', category: 'guides', team: 'LaneCash Growth Desk', basics: ['Email is owned reach', 'One lead magnet is enough to start', 'Weekly cadence beats random blasts'], tips: ['Promise one clear outcome', 'Send a welcome note', 'Track opens without obsessing'], beats: ['Lead magnet', 'Landing page minimum', 'Broadcast formula'] },
  { key: 'dm-sales', title: 'Selling in DMs without being annoying', summary: 'DM sales framework that respects people.', category: 'guides', team: 'LaneCash Growth Desk', basics: ['Qualify before pitching', 'Value first openers', 'Know when to stop'], tips: ['Ask one useful question', 'Send proof not pressure', 'Write clear payment terms'], beats: ['Scripts', 'Objections', 'Boundaries'] },
  { key: 'newsletter', title: 'Start a niche newsletter people open', summary: 'Focused promise and sustainable cadence.', category: 'guides', team: 'LaneCash Creator Desk', basics: ['Niche promise must be specific', 'Cadence you can keep', 'Monetize after trust'], tips: ['Write 4 issues before growing hard', 'One CTA per issue', 'Avoid burnout streaks'], beats: ['Issue template', 'Growth loops', 'Sponsorship timing'] },
  { key: 'automation', title: 'No-code automation for solo operators', summary: 'Save hours without tool chaos.', category: 'guides', team: 'LaneCash Creator Desk', basics: ['Automate repetitive steps first', 'Too many tools create debt', 'Invoice and content pipelines help most'], tips: ['Map one workflow on paper', 'Automate only after it works manually', 'Review monthly'], beats: ['What to automate', 'CRM lite', 'Over-automation traps'] },
  { key: 'personal-brand', title: 'Personal brand on a budget: one lane, one proof', summary: 'Credible brand without a studio.', category: 'guides', team: 'LaneCash Creator Desk', basics: ['One lane beats random posts', 'Proof assets matter', 'Weekly visibility compounds'], tips: ['Pick a problem you can teach', 'Publish one proof weekly', 'Comment where buyers already are'], beats: ['Lane selection', 'Proof', 'Offer attachment'] },
  { key: 'side-skill', title: 'Pick a side skill that can bill in 14 days', summary: 'Billable skill with short time-to-first-invoice.', category: 'guides', team: 'LaneCash Hustle Desk', basics: ['Speed to first invoice matters', 'Narrow offers sell faster', 'Proof beats certificates'], tips: ['Choose skills you can deliver now', 'Make one sample', 'Message people with the problem'], beats: ['Skill criteria', 'Offer packaging', 'Pricing ladder'] },
  { key: 'shop-trust', title: 'Online store trust basics: policies and support', summary: 'Trust elements that lower refunds.', category: 'guides', team: 'LaneCash Commerce Desk', basics: ['Clear policies reduce disputes', 'Fake reviews backfire', 'Support speed matters'], tips: ['Write shipping times honestly', 'Answer within a set window', 'Use real product photos when possible'], beats: ['Policy pages', 'Proof', 'Payment clarity'] },
];

const ANGLES = [
  'field notes',
  'beginner checklist',
  '7-day practice plan',
  'common mistakes',
  'tools and setup',
  'advanced follow-up',
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

/** Prefer unpublished base titles; else weekly angle variants so runs do not stall. */
export function pickBatch(n: number, existingTitles: Set<string>): CatalogItem[] {
  const day = Math.floor(Date.now() / 86400000);
  const week = Math.floor(day / 7);
  const rotated = [...CATALOG].sort((a, b) => hash(a.key + String(day)) - hash(b.key + String(day)));
  const out: CatalogItem[] = [];

  for (const item of rotated) {
    if (existingTitles.has(item.title)) continue;
    out.push(item);
    if (out.length >= n) return out;
  }

  // Catalog exhausted — create unique angled titles
  for (const item of rotated) {
    if (out.length >= n) break;
    const angle = ANGLES[hash(item.key + String(week)) % ANGLES.length];
    const variantTitle = `${item.title} (${angle})`;
    if (existingTitles.has(variantTitle)) continue;
    out.push({
      ...item,
      title: variantTitle,
      summary: `${item.summary} Focus: ${angle}.`,
    });
  }
  return out;
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
