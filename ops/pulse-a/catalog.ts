/** Vast rotating topic catalog — global money skills, not Nigeria-only */

export type Cat = 'money' | 'opportunities' | 'scams' | 'guides';

export type CatalogItem = {
  key: string;
  title: string;
  summary: string;
  category: Cat;
  team: string;
  beats: string[]; // section bullets expanded into HTML
};

export const CATALOG: CatalogItem[] = [
  // Content creation / algorithms
  { key: 'yt-algo', title: 'YouTube algorithm basics in 2026: hooks, retention, and posting cadence', summary: 'Practical YouTube setup: packaging, first 3 seconds, retention loops, and a sustainable posting rhythm.', category: 'guides', team: 'LaneCash Creator Desk', beats: ['What the algorithm optimizes for (clicks + watch time + satisfaction)', 'Hook formulas that still work without clickbait lies', 'Titles/thumbnails as one system', 'Posting cadence vs burnout', 'Series design so viewers autoplay next', 'Metrics that matter in week 1 vs month 3', 'Common mistakes new channels make'] },
  { key: 'tt-algo', title: 'TikTok algorithm playbook: watch time, saves, and series that compound', summary: 'How TikTok distribution works in practice and how to design posts that earn replays without spam tactics.', category: 'guides', team: 'LaneCash Creator Desk', beats: ['Signals TikTok rewards', 'Hook in 1 second patterns', 'On-screen text and pacing', 'Sounds vs original audio tradeoffs', 'Series and pinned content', 'When to post and how to batch', 'What to ignore in guru screenshots'] },
  { key: 'ig-reels', title: 'Instagram Reels growth without buying followers: packaging and consistency', summary: 'A clean Reels workflow: topics, hooks, captions, and a weekly batch plan.', category: 'guides', team: 'LaneCash Creator Desk', beats: ['Reels vs feed posts today', 'Topic lanes that attract buyers not only viewers', 'Caption structure', 'Collaborations that are actually useful', 'Analytics to review weekly', 'Burnout-proof batching'] },
  { key: 'content-batch', title: 'Content batching system: 7 days of posts in one afternoon', summary: 'A repeatable batching system for Shorts/Reels/TikTok so you stop daily panic posting.', category: 'guides', team: 'LaneCash Creator Desk', beats: ['Theme days', 'Script templates', 'Filming blocks', 'Editing assembly line', 'Caption bank', 'Scheduling options', 'Quality bar checklist'] },
  { key: 'faceless', title: 'Faceless channels that can earn: formats that still work and those that died', summary: 'Which faceless formats still have a path, what tools you need, and where beginners waste months.', category: 'opportunities', team: 'LaneCash Creator Desk', beats: ['Formats with residual demand', 'Dead formats to avoid', 'Tool stack on a budget', 'Voice and stock policy risks', 'Monetization paths', '30-day experiment design'] },

  // Digital marketing / affiliate
  { key: 'aff-start', title: 'Affiliate marketing from zero: honest path, offers, and traffic that converts', summary: 'How affiliate marketing actually pays, which offers fit beginners, and how to avoid junk networks.', category: 'opportunities', team: 'LaneCash Growth Desk', beats: ['Affiliate vs dropshipping vs client work', 'Choosing an offer you can explain', 'Traffic sources ranked by control', 'Disclosure rules', 'Tracking basics', 'Why most beginners quit month 1', 'A 14-day test plan'] },
  { key: 'aff-content', title: 'Affiliate content that ranks: reviews, comparisons, and honest demos', summary: 'Create affiliate pages and videos people trust — comparisons, demos, and clear CTAs without fake hype.', category: 'guides', team: 'LaneCash Growth Desk', beats: ['Review structure', 'Comparison tables', 'Screenshot/demo ethics', 'CTA placement', 'Updating posts when offers change', 'Spam patterns that kill trust'] },
  { key: 'email-list', title: 'Build a tiny email list that pays: lead magnet to first broadcast', summary: 'Start a small owned audience so platforms cannot fully control your reach.', category: 'guides', team: 'LaneCash Growth Desk', beats: ['Why owned audience matters', 'One lead magnet idea', 'Landing page minimum', 'Welcome sequence', 'Weekly broadcast formula', 'Compliance basics'] },
  { key: 'dm-sales', title: 'Selling in DMs without being annoying: scripts that respect people', summary: 'A DM sales framework for services and digital products that does not rely on pressure spam.', category: 'guides', team: 'LaneCash Growth Desk', beats: ['Qualification questions', 'Value-first openers', 'Objection handling', 'When to stop messaging', 'Payment and delivery clarity', 'Boundaries'] },

  // Dropshipping
  { key: 'drop-real', title: 'Dropshipping realities in 2026: margins, suppliers, and customer expectations', summary: 'What still works in dropshipping, where margins die, and how to test without blowing savings.', category: 'opportunities', team: 'LaneCash Commerce Desk', beats: ['Model definition', 'Winning vs saturated products', 'Supplier checks', 'Shipping time honesty', 'Ad cost reality', 'Returns and chargebacks', 'Small test budget plan'] },
  { key: 'drop-validate', title: 'Validate a dropshipping product in 7 days before buying ads heavy', summary: 'A one-week validation checklist: demand signals, margin math, and creative tests.', category: 'guides', team: 'LaneCash Commerce Desk', beats: ['Demand signals', 'Landed cost math', 'Creative angles', 'Tiny traffic tests', 'Kill criteria', 'When to scale vs quit'] },
  { key: 'shop-trust', title: 'Store trust basics: policies, proof, and support that reduce refunds', summary: 'Trust elements that lower refunds and disputes for new online stores.', category: 'guides', team: 'LaneCash Commerce Desk', beats: ['Policy pages that matter', 'Proof without fake reviews', 'Support response times', 'Clear shipping promises', 'Payment clarity'] },

  // Crypto / airdrops (verified posture)
  { key: 'airdrop-safe', title: 'Crypto airdrops: how to participate safely and spot fee-trap fakes', summary: 'A safety-first airdrop framework — official sources only, wallet hygiene, and red flags.', category: 'opportunities', team: 'LaneCash Crypto Desk', beats: ['What a real airdrop is', 'Official announcement channels only', 'Wallet separation', 'Never pay to claim', 'Phishing sites', 'Tax/record notes', 'Verification checklist'] },
  { key: 'airdrop-verify', title: 'How to verify an airdrop claim before connecting your wallet', summary: 'Step-by-step verification before any wallet connect or signature.', category: 'scams', team: 'LaneCash Scam Team', beats: ['Domain checks', 'Contract newness risks', 'Signature phishing', 'Social clone accounts', 'Community red flags', 'When to walk away'] },
  { key: 'tg-earn', title: 'Telegram “paying” channels and bots: what is real work vs extraction', summary: 'How to evaluate Telegram earning claims, task bots, and signal groups without funding scammers.', category: 'scams', team: 'LaneCash Scam Team', beats: ['Common Telegram money pitches', 'Task bots that pay tiny vs drain time', 'Signal groups and loss transfer', 'Admin fee traps', 'Verification steps', 'Safer alternatives'] },
  { key: 'tg-verify', title: 'How to verify a Telegram job or payout group before joining', summary: 'A practical verification list for Telegram gigs, crypto jobs, and payout screenshots.', category: 'scams', team: 'LaneCash Scam Team', beats: ['Screenshot forensics basics', 'Payment proof standards', 'Contract and scope', 'Upfront fee rule', 'Escalation patterns', 'Exit rules'] },
  { key: 'usdt-p2p', title: 'USDT P2P safety: release rules, chat scams, and escrow discipline', summary: 'Stay safe on P2P USDT trades with strict release rules and chat hygiene.', category: 'scams', team: 'LaneCash Crypto Desk', beats: ['Why P2P goes wrong', 'Release only after confirmed payment', 'Impersonation scams', 'Offline meeting risks', 'Platform escrow use', 'Personal rules sheet'] },

  // Everyday money / skills global
  { key: 'budget-simple', title: 'A simple weekly money system you can run from your phone', summary: 'A lightweight weekly money system: income, bills, buffer, and one progress goal.', category: 'money', team: 'LaneCash Fin Team', beats: ['Weekly vs monthly budgets', 'Four buckets', 'Buffer first', 'Tracking without complex apps', 'Debt minimums', 'Review ritual'] },
  { key: 'side-skill', title: 'Pick a side skill that can bill in 14 days', summary: 'Choose a billable skill with short time-to-first-invoice instead of endless courses.', category: 'guides', team: 'LaneCash Hustle Desk', beats: ['Skill criteria', 'Offer packaging', 'Proof sample', 'Where to find first clients', 'Pricing ladder', 'Delivery checklist'] },
  { key: 'freelance-global', title: 'Freelance platforms that still pay: positioning and first proposals', summary: 'Positioning and proposal structure for global freelance platforms without racing to the bottom.', category: 'opportunities', team: 'LaneCash Hustle Desk', beats: ['Profile basics', 'Niche positioning', 'Proposal formula', 'Portfolio minimum', 'Client red flags', 'Payment protection'] },
  { key: 'digital-product', title: 'Sell a small digital product: one problem, one file, one checkout', summary: 'Ship a tiny digital product without building a huge course empire first.', category: 'opportunities', team: 'LaneCash Growth Desk', beats: ['Pick one painful problem', 'Minimum product formats', 'Pricing experiments', 'Checkout options', 'Delivery automation basics', 'Promotion without spam'] },
  { key: 'newsletter', title: 'Start a niche newsletter people open: topic, cadence, monetization later', summary: 'Launch a focused newsletter with a clear promise and sustainable cadence.', category: 'guides', team: 'LaneCash Creator Desk', beats: ['Niche promise', 'Issue template', 'Growth loops', 'Sponsorship timing', 'Burnout prevention'] },
  { key: 'community', title: 'Paid community pitfalls: when it works and when it becomes a refund machine', summary: 'Honest take on paid Discords/Telegram communities and what members actually buy.', category: 'opportunities', team: 'LaneCash Growth Desk', beats: ['What people pay for', 'Content ops load', 'Refund drivers', 'Pricing and access tiers', 'When not to launch'] },
  { key: 'automation', title: 'No-code automation for solo operators: save hours without new software chaos', summary: 'Practical automations for solo creators and freelancers using simple tools.', category: 'guides', team: 'LaneCash Creator Desk', beats: ['What to automate first', 'Zap/Make style flows', 'CRM lite', 'Invoice reminders', 'Content pipelines', 'Over-automation traps'] },
  { key: 'personal-brand', title: 'Personal brand on a budget: one lane, one proof, weekly visibility', summary: 'Build a credible personal brand without a studio or big ad spend.', category: 'guides', team: 'LaneCash Creator Desk', beats: ['Lane selection', 'Proof assets', 'Weekly visibility block', 'Comment strategy', 'Offer attachment', 'Consistency metrics'] },
  { key: 'client-retain', title: 'Keep freelance clients longer: delivery systems and boundary scripts', summary: 'Retention systems that make good clients stay without scope chaos.', category: 'guides', team: 'LaneCash Hustle Desk', beats: ['Onboarding checklist', 'Weekly updates', 'Scope boundaries', 'Upsell timing', 'Ending bad clients cleanly'] },
  { key: 'pricing-raise', title: 'Raise your prices without losing all clients: proof and packaging', summary: 'A calm framework to increase rates using proof, packaging, and grandfathering.', category: 'money', team: 'LaneCash Hustle Desk', beats: ['When you are underpriced', 'Packaging value', 'Announcement script', 'Grandfather rules', 'Handling pushback'] },
  { key: 'scam-job', title: 'Remote job scams in 2026: fake recruiters, task scams, and cheque fraud', summary: 'Identify modern remote job scams before you send documents or money.', category: 'scams', team: 'LaneCash Scam Team', beats: ['Fake recruiter patterns', 'Task scam loop', 'Equipment purchase scams', 'Cheque overpayment', 'Document phishing', 'Verification steps'] },
  { key: 'pig-butchering', title: 'Romance and investment chat scams: the long game and the exit', summary: 'How long-game investment/romance scams build trust and how to exit early.', category: 'scams', team: 'LaneCash Scam Team', beats: ['Trust building stages', 'Platforms used', 'Why victims send more', 'Recovery scammer second hit', 'Exit and report steps'] },
];

export function expandItem(item: CatalogItem): { title: string; summary: string; category: Cat; author_team: string; content: string } {
  const sections = item.beats
    .map((b, i) => {
      if (i === 0) return `<h2>What this really is</h2>\n<p>${b}. This guide stays practical: mechanisms, costs, risks, and actions — not hype screenshots.</p>`;
      if (i === 1) return `<h2>Why it matters</h2>\n<p>${b}</p>`;
      if (i === 2) return `<h2>How it works in practice</h2>\n<p>${b}</p>`;
      return `<p>• ${b}</p>`;
    })
    .join('\n');

  const content = `
${sections}
<h2>Costs and realistic outcomes</h2>
<p>Treat every naira or dollar figure you see online as marketing until you measure your own funnel. Budget time and a loss-tolerant test size. If a method only works with fake engagement or guaranteed returns, skip it.</p>
<ul>
<li>Write your test budget before you start.</li>
<li>Track hours and cash separately.</li>
<li>Kill ideas that need constant new deposits to "unlock" payouts.</li>
</ul>
<h2>Risks and common scams</h2>
<p>Related scam patterns to reject while you learn this topic: upfront fees for jobs, guaranteed daily profit apps, wallet-connect airdrop phishing, Telegram admins asking for verification payments, and recovery agents after a loss.</p>
<h2>Exact steps for this week</h2>
<ol>
<li>Write a one-sentence goal for this topic.</li>
<li>List tools you already have (phone, Canva, CapCut, wallet, laptop).</li>
<li>Do one smallest proof action in 48 hours.</li>
<li>Log result and fee/time cost.</li>
<li>Decide: continue, revise, or stop.</li>
</ol>
<h2>What good looks like in 7 and 30 days</h2>
<p><strong>7 days:</strong> proof of one real action and notes you can reuse.</p>
<p><strong>30 days:</strong> a repeatable workflow or a clear decision to abandon based on data — not vibes.</p>
<h2>Final checklist</h2>
<ul>
<li>Is the offer or method explainable in plain language?</li>
<li>Did I avoid upfront-fee and guaranteed-return traps?</li>
<li>Do I have a kill switch if metrics stay flat?</li>
<li>Can I show one proof asset?</li>
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

/** Pick up to `n` unpublished titles using day rotation for variety */
export function pickBatch(n: number, existingTitles: Set<string>): CatalogItem[] {
  const day = Math.floor(Date.now() / 86400000);
  const rotated = [...CATALOG].sort((a, b) => {
    const ha = Math.abs(hash(a.key + day));
    const hb = Math.abs(hash(b.key + day));
    return ha - hb;
  });
  const out: CatalogItem[] = [];
  for (const item of rotated) {
    if (existingTitles.has(item.title)) continue;
    out.push(item);
    if (out.length >= n) break;
  }
  // if catalog exhausted, allow variants by suffixing week strategy titles from remaining
  if (out.length < n) {
    for (const item of CATALOG) {
      if (out.length >= n) break;
      const variant = { ...item, title: `${item.title} (field notes)` };
      if (existingTitles.has(variant.title) || out.some((x) => x.title === variant.title)) continue;
      out.push(variant);
    }
  }
  return out;
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
