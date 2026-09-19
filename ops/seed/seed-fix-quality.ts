/**
 * Aggressive purge of weak AI posts + restore solid guides.
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

const YT_SHORTS = `<h2>Start here</h2>
<p>YouTube Shorts can be a practice ground for short-form video skills. It is not a guaranteed income machine. This guide is about building a realistic posting habit, measuring what works, and avoiding hype that skips the hard parts.</p>
<p>Educational only — not financial advice and not a promise of views or money.</p>

<h2>What “posting schedule” actually means</h2>
<p>A schedule is simply: how often you publish, at what times you tend to post, and how you batch filming or editing so you do not burn out in week two. Consistency matters more than copying someone else’s “post 8 times a day” screenshot.</p>

<h2>Step-by-step for beginners</h2>
<ol>
<li><strong>Pick one narrow theme.</strong> Phone money tips, scam red flags, CapCut tricks, or campus skills — one lane is easier than “everything viral.”</li>
<li><strong>Define a sustainable volume.</strong> Three solid Shorts per week beats fourteen thin clips you abandon. Write the number down.</li>
<li><strong>Batch in sessions.</strong> Film three hooks in one sitting. Edit on a second day. Schedule or upload when your connection is stable.</li>
<li><strong>Use a simple content calendar.</strong> A notes app or spreadsheet with date, idea, status (idea / filmed / posted) is enough. Paid tools are optional.</li>
<li><strong>Hook in the first second.</strong> State the problem or promise clearly. Viewers scroll fast; clarity beats fancy intros.</li>
<li><strong>Keep each Short focused.</strong> One tip, one demo, one warning. Save multi-step tutorials for a series with clear part numbers.</li>
<li><strong>Post, then engage lightly.</strong> Reply to early comments when you can. Do not obsess over every view spike.</li>
<li><strong>Review analytics weekly, not hourly.</strong> Which topics retained viewers? Which got clicks on your profile or linked sites? Double down on those angles.</li>
<li><strong>Protect your energy.</strong> If a schedule causes panic or sleep loss, lower the volume. Burnout kills channels faster than a quiet week.</li>
</ol>

<h2>Tips that help in practice</h2>
<ul>
<li>Vertical 9:16, clear audio, readable on-screen text for silent viewers.</li>
<li>Reuse one strong tip across formats (Short, carousel note, blog) instead of inventing 30 weak ideas.</li>
<li>If you promote tools or affiliate links, disclose and only recommend what you understand.</li>
<li>Trend audio is optional; useful information still wins for trust-based niches like money safety.</li>
</ul>

<h2>Watch outs</h2>
<ul>
<li>Courses that guarantee Shorts income or “algorithm secrets” for a high fee.</li>
<li>Buying fake views or engagement — it trains the wrong signals and can hurt trust.</li>
<li>Copying another creator’s exact script without adding your own checks or local context.</li>
<li>Ignoring community guidelines; repeated strikes waste months of work.</li>
</ul>

<h2>Disclaimer</h2>
<p>Educational only — not financial advice. Views, subscribers, and revenue are never guaranteed. Platform rules change; verify details in official YouTube help pages.</p>`;

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

async function main() {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error('Missing CF credentials');
    process.exit(1);
  }

  const purges: [string, any[]][] = [
    [`DELETE FROM articles WHERE title = ?`, ['Google']],
    [`DELETE FROM articles WHERE title = ?`, ['Remote work']],
    [`DELETE FROM articles WHERE title = ?`, ['Remote Work']],
    [`DELETE FROM articles WHERE lower(trim(title)) = ?`, ['google']],
    [`DELETE FROM articles WHERE lower(trim(title)) = ?`, ['remote work']],
    [`DELETE FROM articles WHERE title LIKE ?`, ['Google%']],
    [`DELETE FROM articles WHERE slug LIKE ?`, ['google-%']],
    [`DELETE FROM articles WHERE slug LIKE ?`, ['remote-work-%']],
    [`DELETE FROM articles WHERE content LIKE ?`, ['%Okay, I need to%']],
    [`DELETE FROM articles WHERE content LIKE ?`, ['%Data Clean Room%']],
    [`DELETE FROM articles WHERE summary LIKE ?`, ['A practical beginner guide from LaneCash%']],
    [`DELETE FROM articles WHERE length(trim(title)) < 20`, []],
    [`DELETE FROM articles WHERE reading_minutes > 40 AND length(trim(title)) < 30`, []],
  ];

  for (const [sql, params] of purges) {
    await d1(sql, params);
  }
  console.log('purged weak / Google / Remote work rows');

  await upsert({
    title: 'YouTube Shorts posting schedule for beginners: realistic habits without the hype',
    summary:
      'How to plan a sustainable Shorts cadence, batch content, and review analytics — without guaranteed income claims. Educational only.',
    content: YT_SHORTS,
    category: 'guides',
    image_url: '/covers/hustle.svg',
    minutes: 12,
  });

  await upsert({
    title: 'Remote job offers on WhatsApp and Telegram: how to verify before you pay',
    summary:
      'A practical guide to spotting fake remote jobs, avoiding activation fees, and checking employers — educational only, not financial advice.',
    content: REMOTE,
    category: 'scams',
    image_url: '/covers/scams.svg',
    minutes: 11,
  });

  console.log('seed-fix-quality done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
