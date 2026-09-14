/** 30 interconnected educational series — Source: LaneCash. Not financial advice. */

export type SeedArticle = {
  slug: string;
  title: string;
  summary: string;
  category: 'money' | 'opportunities' | 'scams' | 'guides';
  series: string;
  part: number;
  content: string;
  reading_minutes: number;
};

const D =
  '<h2>Disclaimer</h2><p>This guide is educational only. It is not financial, investment, or legal advice. Nothing here promises income.</p>';

function body(sections: string) {
  return sections + D;
}

export const ARTICLES: SeedArticle[] = [
  // —— Series 1: Start on your phone (1–5)
  {
    slug: 'series-phone-01-honest-start',
    title: 'Start on your phone: an honest map (Series 1 · Part 1)',
    summary: 'What “make money with a phone” can mean in practice — skills, time, and what to ignore on X.',
    category: 'guides',
    series: 'phone',
    part: 1,
    reading_minutes: 7,
    content: body(`
<h2>Why this series exists</h2>
<p>On X, posts still ask: “I have a phone and data — how do I make money online?” That question is fair. The noisy replies (fake airdrops, “every wallet gets paid”) are not.</p>
<p>This 5-part series stays practical: skills you can practice on a phone, free or cheap tools, and red flags. Read in order if you can.</p>
<ul>
<li><strong>Part 1 (this page):</strong> map and mindset</li>
<li><strong>Part 2:</strong> pick one lane</li>
<li><strong>Part 3:</strong> weekly practice system</li>
<li><strong>Part 4:</strong> first proof asset</li>
<li><strong>Part 5:</strong> when to add a second skill</li>
</ul>
<h2>Three honest buckets</h2>
<ol>
<li><strong>Skill for hire</strong> — writing, short video edit, simple design, customer replies.</li>
<li><strong>Content practice</strong> — learn packaging and consistency (money later, if at all).</li>
<li><strong>Safety literacy</strong> — spot job and wallet traps so you do not lose cash while learning.</li>
</ol>
<h2>What to mute on your feed</h2>
<p>Trending threads that demand your seed phrase, “comment your address for free SOL,” or “pay to unlock withdrawal” are extraction patterns. Discipline beats another random hustle — a point that also trends on X for good reason.</p>
<p>Next: <a href="/article/series-phone-02-pick-lane">Part 2 — Pick one lane</a>.</p>
`) },
  {
    slug: 'series-phone-02-pick-lane',
    title: 'Pick one phone lane for 30 days (Series 1 · Part 2)',
    summary: 'Choose a single practice lane so your week is not random apps and random advice.',
    category: 'guides',
    series: 'phone',
    part: 2,
    reading_minutes: 6,
    content: body(`
<h2>One lane rule</h2>
<p>Beginners lose weeks switching between affiliate, airdrops, freelancing, and “faceless pages.” Pick <strong>one</strong> lane for 30 days.</p>
<h2>Simple lane menu</h2>
<ul>
<li><strong>Short video edit</strong> — CapCut on phone; practice hooks and captions.</li>
<li><strong>Writing help</strong> — product descriptions, captions, short emails.</li>
<li><strong>UGC-style clips</strong> — talk to camera or screen-record a simple demo.</li>
<li><strong>Scam literacy content</strong> — explain red flags (education first).</li>
</ul>
<h2>How to choose</h2>
<p>Ask: What can I finish a small sample of this week? What do I already half-know? If you like talking, try short explainers. If you hate camera, try captions and editing.</p>
<p>Previous: <a href="/article/series-phone-01-honest-start">Part 1</a> · Next: <a href="/article/series-phone-03-weekly-system">Part 3</a>.</p>
`) },
  {
    slug: 'series-phone-03-weekly-system',
    title: 'A weekly system on phone only (Series 1 · Part 3)',
    summary: 'A repeatable week: practice blocks, notes, and one review — no hustle fantasy.',
    category: 'guides',
    series: 'phone',
    part: 3,
    reading_minutes: 6,
    content: body(`
<h2>Why systems beat motivation</h2>
<p>Creator talk on X keeps returning to consistency and relationships over one viral spike. Same idea for skills: a boring weekly system wins.</p>
<h2>Sample week</h2>
<ul>
<li><strong>3 days · 45 minutes:</strong> produce (edit, write, or film).</li>
<li><strong>1 day · 30 minutes:</strong> study one example you respect.</li>
<li><strong>1 day · 20 minutes:</strong> review notes — what improved?</li>
</ul>
<h2>Track only three numbers</h2>
<ol>
<li>Sessions completed</li>
<li>Pieces finished (even drafts)</li>
<li>One lesson learned</li>
</ol>
<p>Skip income screenshots as your scoreboard while you are learning.</p>
<p>Previous: <a href="/article/series-phone-02-pick-lane">Part 2</a> · Next: <a href="/article/series-phone-04-proof-asset">Part 4</a>.</p>
`) },
  {
    slug: 'series-phone-04-proof-asset',
    title: 'Build one proof asset this week (Series 1 · Part 4)',
    summary: 'A sample others can see beats a long bio — how to make one on your phone.',
    category: 'opportunities',
    series: 'phone',
    part: 4,
    reading_minutes: 7,
    content: body(`
<h2>What a proof asset is</h2>
<p>A short before/after edit, a caption pack, a one-page checklist, or a 30-second explainer. Something finished.</p>
<h2>Phone-friendly options</h2>
<ul>
<li>CapCut: one vertical clip with captions</li>
<li>Canva: one carousel or checklist graphic</li>
<li>Notes app: a clear one-page guide exported to PDF</li>
</ul>
<h2>Quality bar</h2>
<p>Readable text, clear audio or captions, one idea only. Do not wait for perfect gear.</p>
<p>Previous: <a href="/article/series-phone-03-weekly-system">Part 3</a> · Next: <a href="/article/series-phone-05-second-skill">Part 5</a>.</p>
`) },
  {
    slug: 'series-phone-05-second-skill',
    title: 'When to add a second skill (Series 1 · Part 5)',
    summary: 'Finish the first lane’s proof before stacking more apps and more noise.',
    category: 'guides',
    series: 'phone',
    part: 5,
    reading_minutes: 5,
    content: body(`
<h2>Unlock rule</h2>
<p>Add a second skill only after you have: a finished sample, four weeks of practice notes, and a clear sentence for what you offer.</p>
<h2>Good combinations</h2>
<ul>
<li>Editing + basic captions</li>
<li>Writing + simple Canva layout</li>
<li>Explainer clips + scam-awareness posts</li>
</ul>
<p>This series connects to our <a href="/article/series-creator-01-visibility">creator series</a> and <a href="/article/series-scam-01-x-noise">scam series</a>.</p>
<p>Previous: <a href="/article/series-phone-04-proof-asset">Part 4</a>.</p>
`) },

  // —— Series 2: Creator craft (6–11)
  {
    slug: 'series-creator-01-visibility',
    title: 'Visibility is not the whole game (Series 2 · Part 1)',
    summary: 'Views help — relationships and systems keep you going when virality fades.',
    category: 'guides',
    series: 'creator',
    part: 1,
    reading_minutes: 6,
    content: body(`
<h2>What creators keep repeating on X</h2>
<p>Visibility matters, but it is not a personality upgrade. Viral moments fade; people you treat well remain.</p>
<h2>Practical takeaway</h2>
<ul>
<li>Reply to real comments in your niche</li>
<li>Collaborate smaller accounts, not only “big” ones</li>
<li>Keep a list of peers, not only metrics</li>
</ul>
<p>Next: <a href="/article/series-creator-02-one-platform">Part 2 — One platform first</a>.</p>
`) },
  {
    slug: 'series-creator-02-one-platform',
    title: 'One platform first for 60 days (Series 2 · Part 2)',
    summary: 'Split attention kills beginners. Choose TikTok, Shorts, Reels, or X — then stay.',
    category: 'guides',
    series: 'creator',
    part: 2,
    reading_minutes: 6,
    content: body(`
<h2>Why one platform</h2>
<p>Each app teaches different packaging. Master one posting rhythm before cross-posting everything.</p>
<h2>How to choose</h2>
<ul>
<li>Comfortable on camera? Try short video.</li>
<li>Strong writer? Try threads on X or carousels.</li>
<li>Prefer faceless? Screen demos and text overlays.</li>
</ul>
<p>Previous: <a href="/article/series-creator-01-visibility">Part 1</a> · Next: <a href="/article/series-creator-03-hooks">Part 3</a>.</p>
`) },
  {
    slug: 'series-creator-03-hooks',
    title: 'Hooks that respect the viewer (Series 2 · Part 3)',
    summary: 'First seconds matter — without fake income claims or clickbait traps.',
    category: 'guides',
    series: 'creator',
    part: 3,
    reading_minutes: 7,
    content: body(`
<h2>A clean hook formula</h2>
<ol>
<li>Name the problem in plain words</li>
<li>Promise a specific learning outcome</li>
<li>Start the demonstration immediately</li>
</ol>
<h2>Avoid</h2>
<p>“I made $10k in 3 days with this app” energy. Honest audits and process videos age better and match how skeptical audiences read hustle content now.</p>
<p>Previous: <a href="/article/series-creator-02-one-platform">Part 2</a> · Next: <a href="/article/series-creator-04-capcut">Part 4</a>.</p>
`) },
  {
    slug: 'series-creator-04-capcut',
    title: 'CapCut on phone: a beginner workflow (Series 2 · Part 4)',
    summary: 'A simple edit path many creators mention when they upskill with free tools.',
    category: 'guides',
    series: 'creator',
    part: 4,
    reading_minutes: 7,
    content: body(`
<h2>Minimal workflow</h2>
<ol>
<li>Film or import one clip</li>
<li>Cut silence</li>
<li>Add captions</li>
<li>Export vertical</li>
</ol>
<p><a href="https://www.capcut.com/" target="_blank" rel="noopener noreferrer">CapCut</a> is enough for practice. Learn keyboard-free editing before buying apps.</p>
<h2>One skill per week</h2>
<p>Week 1 captions, week 2 pacing, week 3 text hierarchy. Stacking every effect at once slows learning.</p>
<p>Previous: <a href="/article/series-creator-03-hooks">Part 3</a> · Next: <a href="/article/series-creator-05-batch">Part 5</a>.</p>
`) },
  {
    slug: 'series-creator-05-batch',
    title: 'Batch content without burning out (Series 2 · Part 5)',
    summary: 'Plan, film, edit in blocks — the anti-panic method.',
    category: 'guides',
    series: 'creator',
    part: 5,
    reading_minutes: 6,
    content: body(`
<h2>Three blocks</h2>
<ul>
<li><strong>Plan:</strong> 5 titles or hooks</li>
<li><strong>Capture:</strong> film or screen-record in one sitting</li>
<li><strong>Edit:</strong> finish two pieces fully</li>
</ul>
<p>Batching shows up in almost every serious creator routine discussion because daily “what do I post?” drains energy.</p>
<p>Previous: <a href="/article/series-creator-04-capcut">Part 4</a> · Next: <a href="/article/series-creator-06-ugc">Part 6</a>.</p>
`) },
  {
    slug: 'series-creator-06-ugc',
    title: 'UGC-style work: earning without a huge audience (Series 2 · Part 6)',
    summary: 'Brands sometimes pay for honest demo clips — how beginners practice the skill.',
    category: 'opportunities',
    series: 'creator',
    part: 6,
    reading_minutes: 7,
    content: body(`
<h2>What UGC-style practice means</h2>
<p>Short product demos, screen walkthroughs, or testimonial-style clips. Some paths do not require a large following — but they still require clear audio, honest claims, and reliable delivery.</p>
<h2>Practice project</h2>
<p>Pick an app you already use. Record a 20–40 second “how I use this” clip. That sample is your training weight.</p>
<p>Start of series: <a href="/article/series-creator-01-visibility">Part 1</a> · Related: <a href="/article/series-digital-01-one-problem">Digital products series</a>.</p>
`) },

  // —— Series 3: Shorts / algorithm literacy (12–16)
  {
    slug: 'series-algo-01-what-platforms-measure',
    title: 'What short-video platforms roughly optimize for (Series 3 · Part 1)',
    summary: 'A plain-language view of watch time, replays, and why packaging matters.',
    category: 'guides',
    series: 'algo',
    part: 1,
    reading_minutes: 7,
    content: body(`
<h2>Keep it simple</h2>
<p>Platforms try to keep people watching and returning. Your job as a learner is clearer packaging and stronger retention — not hacking a secret score.</p>
<ul>
<li>Hook early</li>
<li>Deliver the promise</li>
<li>Make the next second worth watching</li>
</ul>
<p>Next: <a href="/article/series-algo-02-titles">Part 2</a>.</p>
`) },
  {
    slug: 'series-algo-02-titles',
    title: 'Titles and first lines that match the video (Series 3 · Part 2)',
    summary: 'Say the real outcome — avoid bait that kills trust on replay.',
    category: 'guides',
    series: 'algo',
    part: 2,
    reading_minutes: 5,
    content: body(`
<h2>Match packaging to content</h2>
<p>If the video teaches CapCut captions, the title should say that. Mismatch raises click numbers and destroys satisfaction.</p>
<p>Previous: <a href="/article/series-algo-01-what-platforms-measure">Part 1</a> · Next: <a href="/article/series-algo-03-retention">Part 3</a>.</p>
`) },
  {
    slug: 'series-algo-03-retention',
    title: 'Retention basics for beginners (Series 3 · Part 3)',
    summary: 'Cut dead air, one idea per video, pattern interrupts without chaos.',
    category: 'guides',
    series: 'algo',
    part: 3,
    reading_minutes: 6,
    content: body(`
<h2>Three retention drills</h2>
<ol>
<li>Remove the first two seconds of fluff</li>
<li>Show the result early, then explain</li>
<li>Change framing or on-screen text every few seconds</li>
</ol>
<p>Previous: <a href="/article/series-algo-02-titles">Part 2</a> · Next: <a href="/article/series-algo-04-cadence">Part 4</a>.</p>
`) },
  {
    slug: 'series-algo-04-cadence',
    title: 'Posting cadence you can survive (Series 3 · Part 4)',
    summary: 'A schedule you keep beats a heroic week then silence.',
    category: 'guides',
    series: 'algo',
    part: 4,
    reading_minutes: 5,
    content: body(`
<h2>Starter cadence</h2>
<p>Three solid posts a week for eight weeks is stronger than daily spam for five days. Use the batching method from the creator series.</p>
<p>Previous: <a href="/article/series-algo-03-retention">Part 3</a> · Next: <a href="/article/series-algo-05-review">Part 5</a>.</p>
`) },
  {
    slug: 'series-algo-05-review',
    title: 'Review signals without obsession (Series 3 · Part 5)',
    summary: 'Look at completion and comments — ignore vanity spikes.',
    category: 'guides',
    series: 'algo',
    part: 5,
    reading_minutes: 5,
    content: body(`
<h2>Weekly review questions</h2>
<ul>
<li>Where did people leave?</li>
<li>Which hook earned a rewatch?</li>
<li>What comment showed confusion?</li>
</ul>
<p>Series start: <a href="/article/series-algo-01-what-platforms-measure">Part 1</a>.</p>
`) },

  // —— Series 4: Digital products & affiliate (17–21)
  {
    slug: 'series-digital-01-one-problem',
    title: 'Digital products: one problem, one small file (Series 4 · Part 1)',
    summary: 'Skip the 50-module course fantasy. Ship a narrow helper.',
    category: 'opportunities',
    series: 'digital',
    part: 1,
    reading_minutes: 7,
    content: body(`
<h2>Small beats huge</h2>
<p>A checklist, template pack, or short guide that solves one painful step is easier to finish and easier to explain.</p>
<h2>Examples</h2>
<ul>
<li>CapCut caption checklist</li>
<li>Client brief template</li>
<li>Scam red-flag one-pager</li>
</ul>
<p>Next: <a href="/article/series-digital-02-validate">Part 2</a>.</p>
`) },
  {
    slug: 'series-digital-02-validate',
    title: 'Validate before you polish (Series 4 · Part 2)',
    summary: 'Ask three people if the problem is real — then build.',
    category: 'opportunities',
    series: 'digital',
    part: 2,
    reading_minutes: 5,
    content: body(`
<h2>Three conversations</h2>
<p>Message three people who live the problem. If they cannot describe the pain in their own words, rethink the product.</p>
<p>Previous: <a href="/article/series-digital-01-one-problem">Part 1</a> · Next: <a href="/article/series-digital-03-deliver">Part 3</a>.</p>
`) },
  {
    slug: 'series-digital-03-deliver',
    title: 'Delivery and pricing experiments (Series 4 · Part 3)',
    summary: 'Simple checkout ideas and humble first prices for learning.',
    category: 'opportunities',
    series: 'digital',
    part: 3,
    reading_minutes: 6,
    content: body(`
<h2>Keep delivery boring</h2>
<p>PDF, Notion page, or file link. Automation can wait until someone actually buys.</p>
<p>Price the first version to learn, not to impress. Track refunds and questions.</p>
<p>Previous: <a href="/article/series-digital-02-validate">Part 2</a> · Next: <a href="/article/series-digital-04-affiliate">Part 4</a>.</p>
`) },
  {
    slug: 'series-digital-04-affiliate',
    title: 'Affiliate basics with honest disclosure (Series 4 · Part 4)',
    summary: 'Recommend tools you understand — disclose when you earn.',
    category: 'opportunities',
    series: 'digital',
    part: 4,
    reading_minutes: 6,
    content: body(`
<h2>Clean rules</h2>
<ul>
<li>One offer at a time while learning</li>
<li>Disclose affiliate relationships</li>
<li>Never fake screenshots</li>
</ul>
<p>On X, distribution tactics get loud; trust still decides who people buy through.</p>
<p>Previous: <a href="/article/series-digital-03-deliver">Part 3</a> · Next: <a href="/article/series-digital-05-stack">Part 5</a>.</p>
`) },
  {
    slug: 'series-digital-05-stack',
    title: 'Content + product + affiliate without chaos (Series 4 · Part 5)',
    summary: 'One niche spine so your posts and offers reinforce each other.',
    category: 'opportunities',
    series: 'digital',
    part: 5,
    reading_minutes: 5,
    content: body(`
<h2>Spine example</h2>
<p>Niche: short-form editing help → posts teach CapCut → product is a template pack → affiliate is a tool you genuinely use.</p>
<p>Series start: <a href="/article/series-digital-01-one-problem">Part 1</a>.</p>
`) },

  // —— Series 5: Scam & airdrop noise (22–26)
  {
    slug: 'series-scam-01-x-noise',
    title: 'X airdrop noise: how to read it safely (Series 5 · Part 1)',
    summary: 'Trending claim posts are common. Here is a calm filter before you click.',
    category: 'scams',
    series: 'scam',
    part: 1,
    reading_minutes: 7,
    content: body(`
<h2>What you will see</h2>
<p>Feeds fill with “comment address,” “every wallet gets,” and countdown pressure. Treat them as untrusted ads until proven otherwise.</p>
<h2>Fast filter</h2>
<ul>
<li>Do they demand seed phrases? Walk away.</li>
<li>Do they require payment to claim? Walk away.</li>
<li>Can you verify the project outside the thread? If not, pause.</li>
</ul>
<p>Next: <a href="/article/series-scam-02-wallet">Part 2</a>.</p>
`) },
  {
    slug: 'series-scam-02-wallet',
    title: 'Wallet hygiene for curious beginners (Series 5 · Part 2)',
    summary: 'Separate experiments from savings — never share recovery phrases.',
    category: 'scams',
    series: 'scam',
    part: 2,
    reading_minutes: 6,
    content: body(`
<h2>Non-negotiables</h2>
<ol>
<li>Never type a seed phrase into a website from a chat link</li>
<li>Use a separate small wallet for experiments if you experiment at all</li>
<li>Revoke shady approvals when you learn how — slowly and carefully</li>
</ol>
<p>Previous: <a href="/article/series-scam-01-x-noise">Part 1</a> · Next: <a href="/article/series-scam-03-jobs">Part 3</a>.</p>
`) },
  {
    slug: 'series-scam-03-jobs',
    title: 'Fake remote jobs and task traps (Series 5 · Part 3)',
    summary: 'Small “task pay” then fee demands — a pattern worth memorizing.',
    category: 'scams',
    series: 'scam',
    part: 3,
    reading_minutes: 6,
    content: body(`
<h2>Classic pattern</h2>
<p>You complete tiny tasks, see a dashboard balance, then must pay a fee to withdraw. Real employers do not charge you to receive wages.</p>
<p>Previous: <a href="/article/series-scam-02-wallet">Part 2</a> · Next: <a href="/article/series-scam-04-telegram">Part 4</a>.</p>
`) },
  {
    slug: 'series-scam-04-telegram',
    title: 'Telegram “admin” pressure plays (Series 5 · Part 4)',
    summary: 'Support accounts that rush you into payments or seed shares.',
    category: 'scams',
    series: 'scam',
    part: 4,
    reading_minutes: 5,
    content: body(`
<h2>Rules</h2>
<ul>
<li>Official support rarely DMs first demanding urgency</li>
<li>Screenshots of payouts are easy to fake</li>
<li>Slow down when money is requested</li>
</ul>
<p>Previous: <a href="/article/series-scam-03-jobs">Part 3</a> · Next: <a href="/article/series-scam-05-recovery">Part 5</a>.</p>
`) },
  {
    slug: 'series-scam-05-recovery',
    title: 'After a loss: avoid recovery scams (Series 5 · Part 5)',
    summary: 'The second hit often comes from people who promise to get funds back.',
    category: 'scams',
    series: 'scam',
    part: 5,
    reading_minutes: 5,
    content: body(`
<h2>Hard truth</h2>
<p>Most “we can recover your crypto for a fee” pitches are a second scam. Document what happened, warn your circle, and do not pay another stranger to undo the first mistake.</p>
<p>Series start: <a href="/article/series-scam-01-x-noise">Part 1</a>.</p>
`) },

  // —— Series 6: Money discipline & freelance (27–30)
  {
    slug: 'series-money-01-discipline',
    title: 'Discipline over another hustle (Series 6 · Part 1)',
    summary: 'A trending idea on X that actually helps: systems for money before more apps.',
    category: 'money',
    series: 'money',
    part: 1,
    reading_minutes: 6,
    content: body(`
<h2>Why this belongs on LaneCash</h2>
<p>Many people do not need a seventh hustle. They need a clearer weekly money review: income after fees, fixed bills, and a small buffer.</p>
<p>Next: <a href="/article/series-money-02-weekly-review">Part 2</a>.</p>
`) },
  {
    slug: 'series-money-02-weekly-review',
    title: 'A 20-minute weekly money review (Series 6 · Part 2)',
    summary: 'Same day each week — list cash in, bills, and one goal.',
    category: 'money',
    series: 'money',
    part: 2,
    reading_minutes: 5,
    content: body(`
<h2>Agenda</h2>
<ol>
<li>What came in after fees?</li>
<li>What must leave?</li>
<li>What is the one practice goal this week?</li>
</ol>
<p>Previous: <a href="/article/series-money-01-discipline">Part 1</a> · Next: <a href="/article/series-money-03-freelance-offer">Part 3</a>.</p>
`) },
  {
    slug: 'series-money-03-freelance-offer',
    title: 'Write a one-sentence freelance offer (Series 6 · Part 3)',
    summary: 'Clear offers get clearer replies — even on a phone keyboard.',
    category: 'opportunities',
    series: 'money',
    part: 3,
    reading_minutes: 6,
    content: body(`
<h2>Template</h2>
<p>“I help [person] get [result] with [method] so they can [outcome].”</p>
<p>Example: “I help small shops get clearer product videos with CapCut edits so their posts look less rushed.”</p>
<p>Previous: <a href="/article/series-money-02-weekly-review">Part 2</a> · Next: <a href="/article/series-money-04-first-outreach">Part 4</a>.</p>
`) },
  {
    slug: 'series-money-04-first-outreach',
    title: 'First outreach without spam energy (Series 6 · Part 4)',
    summary: 'Short, specific messages — and when to stop.',
    category: 'opportunities',
    series: 'money',
    part: 4,
    reading_minutes: 6,
    content: body(`
<h2>Message shape</h2>
<ul>
<li>Why them (one true detail)</li>
<li>What you offer (one sentence)</li>
<li>Proof link or sample</li>
<li>Easy no</li>
</ul>
<p>This closes the starter path: phone skills → creator craft → safety → disciplined offers. Return to <a href="/article/series-phone-01-honest-start">Series 1 Part 1</a> anytime.</p>
`) },
];
