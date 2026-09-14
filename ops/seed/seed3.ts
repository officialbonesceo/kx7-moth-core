/** Seed 3 long educational articles (500+ words each) */
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const CF_D1_DATABASE_ID = process.env.CF_D1_DATABASE_ID || '';

const DISCLAIMER =
  '<h2>Disclaimer</h2><p>This guide is educational only. It is not financial, investment, or legal advice. Nothing here promises income or returns. Verify tools yourself and never risk money you cannot afford to lose.</p>';

type Art = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  content: string;
  reading_minutes: number;
};

const ARTICLES: Art[] = [
  {
    slug: 'x-airdrop-reply-spam-filter-2026',
    title: 'X is flooded with “drop your wallet” airdrops — a practical filter for 2026',
    summary:
      'Reply chains promising free tokens dominate the feed. Here is how to read them without losing money or time — educational only, not financial advice.',
    category: 'scams',
    reading_minutes: 9,
    content: `
<h2>What is showing up on X right now</h2>
<p>Scroll any crypto-adjacent corner of X and you will see the same shape again and again: follow, like, repost, comment your address, “every wallet gets.” The numbers change — BNB, SOL, random tickers — but the script does not. Engagement farming rewards long reply threads. Fear of missing out rewards speed. Fake screenshots are cheap. That combination is why this pattern keeps winning the algorithm even when most of it is empty or hostile.</p>
<p>This is not a claim that every airdrop discussion is fake. Legitimate projects do run distributions. The problem is that the loudest version on your timeline is optimized for clicks, not for your safety. Beginners treat the loud version as the real process and skip verification.</p>

<h2>Why the pattern works on people</h2>
<p>Three pressures stack. First, social proof: hundreds of replies look like a crowd of winners. Second, scarcity: timers and “last 500 wallets” language. Third, sunk cost: once you have followed five accounts and typed an address, stopping feels like wasting effort. Scam design relies on that emotional sequence more than on clever code.</p>
<p>There is also a quieter cost that is not always theft. Even “harmless” engagement farms train you to waste hours farming replies that never pay, while the real skill work you meant to do — editing, writing, freelancing outreach — never starts.</p>

<h2>A filter you can run in under a minute</h2>
<ol>
<li><strong>Seed phrase or “sync wallet” page?</strong> Stop. No honest claim flow needs your recovery phrase in a reply thread or a random site from a comment.</li>
<li><strong>Pay a fee to unlock withdrawal of a dashboard balance?</strong> Stop. That pattern is extraction, not distribution.</li>
<li><strong>Only “proof” is screenshots inside the same hype thread?</strong> Pause. Look for a project that exists outside the thread: typed domain, older non-hyped discussion, clear product description.</li>
<li><strong>Insults or panic if you hesitate?</strong> That is pressure, not due diligence.</li>
<li><strong>Can you explain what the product does in one calm sentence?</strong> If not, you are not ready to connect anything.</li>
</ol>

<h2>Verify outside the thread</h2>
<p>Type the project name yourself into a browser. Prefer domains you typed, not shorteners from replies. Check whether the same name has a consistent presence over time or only appeared with this campaign. Official claims usually live on official surfaces — not only in a reply guy’s media carousel.</p>
<p>If you experiment at all, keep experiments off the wallet that holds money you cannot afford to lose. Connecting a wallet is not a casual login; you may be approving permissions you do not understand.</p>

<h2>What to do with the time you free up</h2>
<p>Every hour not spent farming fake reply chains can go into one proof skill: a CapCut sample, a clear freelance offer sentence, a one-page checklist for a real problem. Those assets compound. Random address comments do not.</p>
<p>Mute keywords if your feed is unusable. Protect attention the same way you protect a seed phrase: it is an asset.</p>

<h2>Bottom line</h2>
<p>Treat “comment your address for free bags” as untrusted advertising until proven otherwise. Delay is your advantage. Speed is theirs.</p>
${DISCLAIMER}
`.trim(),
  },
  {
    slug: 'faceless-youtube-hype-vs-practice-2026',
    title: 'Faceless YouTube money posts are everywhere — what beginners should actually practice',
    summary:
      'X is full of “phone + AI tools = mansion” claims. Strip the hype and keep a realistic practice path for short video and faceless content.',
    category: 'guides',
    reading_minutes: 10,
    content: `
<h2>The claim you keep seeing</h2>
<p>On X, faceless YouTube and “three AI tools on your phone” stories circulate hard. Some posts show big first-month numbers. Some invite you to a class tonight. The emotional pitch is simple: you do not need a face, a studio, or a large budget — only tools and a secret method.</p>
<p>Parts of that are directionally true. Faceless and screen-led content is real. Mobile editing is real. AI-assisted scripting is real. What is not trustworthy is the package that implies fast, reliable income with low skill and low risk. Those numbers are rarely audited. Selection bias is extreme: losers do not post mansion timelines.</p>

<h2>What actually has to be true for faceless content to work</h2>
<p>You still need a niche narrow enough to own, a repeatable packaging style, and a cadence you can keep when motivation dies. Platforms reward clear hooks, retention, and return visits — not the fact that you used a particular AI logo in a thread.</p>
<p>A useful beginner frame is skill first, monetization second. Monetization thresholds, ad policies, and brand deals all assume you can publish consistently. If you cannot finish three solid videos, tool stacks will not save you.</p>

<h2>A practice stack that matches the hype without the fantasy</h2>
<ol>
<li><strong>One topic for thirty days.</strong> Example: CapCut caption fixes, scam red-flag explainers, or “how I use one free tool.” Do not rotate niches weekly.</li>
<li><strong>One editor workflow.</strong> Mobile editors such as CapCut are enough to learn cuts, captions, and vertical export. Master basics before buying more apps.</li>
<li><strong>Batch, do not spiral.</strong> Plan five hooks, capture in one block, finish two edits. Daily “what do I post?” panic is how people quit.</li>
<li><strong>Match titles to content.</strong> If the video teaches captions, the title should say captions. Bait that the video never delivers trains distrust — including platform distrust over time.</li>
<li><strong>Review without obsession.</strong> Once a week ask: where did people leave, which line got a rewatch, which comment showed confusion. Change one variable next week.</li>
</ol>

<h2>Where X hype diverges from practice</h2>
<p>Hype sells speed and certainty. Practice produces slow samples and uncertainty. The people who last usually look boring from the outside: same niche, steady cadence, improving hooks, honest claims. That is less shareable than a screenshot, which is why your feed under-represents it.</p>

<h2>Ethics and expectations</h2>
<p>Do not invent income figures. Do not promise viewers the outcome you saw in a stranger’s thread. Educational content about process ages better than income theater and keeps you out of trouble with platforms and audiences.</p>

<h2>Bottom line</h2>
<p>Use the faceless trend as a reminder that camera-optional content is viable. Do not use it as a promise of quick money. Build one proof series you can point to — then decide on monetization paths with clear eyes.</p>
${DISCLAIMER}
`.trim(),
  },
  {
    slug: 'phone-skills-vs-meme-trading-hype-2026',
    title: '“How do I make money with my phone?” — skills versus meme and trading hype on X',
    summary:
      'Timelines mix freelancing advice with meme wins and airdrop noise. A clear split between skill paths and high-risk speculation for beginners.',
    category: 'money',
    reading_minutes: 10,
    content: `
<h2>Two different questions get mixed together</h2>
<p>On X you will see the same plea: “I have a phone and data — how do I make money?” Underneath it, replies split into two worlds that should not be confused.</p>
<p>World one is skill and service: writing, short video editing, simple design, local services, careful freelancing. World two is speculation: memes, perps, prediction markets, engagement airdrops. Both appear in the same replies. Only one is a beginner learning path that does not require risking cash you cannot afford to lose.</p>

<h2>What skill paths look like when they are honest</h2>
<p>They are slower and less cinematic. You pick one lane for thirty days. You finish samples. You write a one-sentence offer. You send a small number of thoughtful messages. You track sessions completed, not stranger screenshots. Tools stay simple: CapCut, Canva, a notes app, a calendar block.</p>
<p>Income, if it arrives, tends to look like small paid tasks, a first client, or a tiny digital product — not a overnight bag. That is not a failure of the method. That is what early skill markets usually look like.</p>

<h2>What speculation paths look like on the timeline</h2>
<p>They highlight outliers: someone risked a few hundred and made thousands on memes; someone is “easy to a million”; someone wants addresses for a token drop. Those posts are optimized for engagement. They under-report wipeouts. They also invite a second layer of risk: fake groups, paid signals, and recovery scammers after a loss.</p>
<p>If you do not already have a risk framework, capital you can lose, and emotional control, treating speculation as your “phone hustle” is how accounts and morale get wrecked.</p>

<h2>A simple decision rule</h2>
<ul>
<li>If the method requires sending money, seed phrases, or “unlock fees” to strangers → treat as danger until proven otherwise.</li>
<li>If the method requires only practice time and a sample you control → it can be a learning path.</li>
<li>If the method’s only proof is someone else’s screenshot → it is marketing, not a curriculum.</li>
</ul>

<h2>A one-week phone plan that stays on the skill side</h2>
<ol>
<li>Choose one lane: captions/editing, writing, or educational explainers.</li>
<li>Block three sessions of about forty-five minutes.</li>
<li>Finish one proof asset by day seven.</li>
<li>Write one sentence: who you help, what result, with what method.</li>
<li>Mute airdrop and “drop your address” noise so your feed stops recruiting you into world two.</li>
</ol>

<h2>Discipline is not anti-ambition</h2>
<p>Some of the more useful posts on X say people need better financial discipline more than another hustle. That is compatible with ambition. A weekly twenty-minute review of cash after fees, bills, and one practice goal keeps experiments from becoming leaks.</p>

<h2>Bottom line</h2>
<p>Answer the phone-money question with a skill sample, not a timeline gamble. Speculation will keep trending because it is dramatic. Skills stay quieter and remain the safer foundation for beginners.</p>
${DISCLAIMER}
`.trim(),
  },
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
  const text = await res.text();
  let parsed: any = JSON.parse(text);
  if (!res.ok || parsed.success === false) throw new Error(JSON.stringify(parsed.errors || parsed).slice(0, 400));
  return parsed;
}

function cover(cat: string) {
  if (cat === 'scams') return '/covers/scams.svg';
  if (cat === 'money') return '/covers/money.svg';
  return '/covers/hustle.svg';
}

function wc(html: string) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
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
    const words = wc(a.content);
    console.log(a.slug, 'words~', words);
    if (words < 500) console.warn('UNDER 500', a.slug);
    const id = 'a3_' + a.slug.slice(0, 20);
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
