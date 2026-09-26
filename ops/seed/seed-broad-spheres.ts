/**
 * One-shot seed: broader earning spheres (not dropship/affiliate).
 * Run: npx tsx ops/seed/seed-broad-spheres.ts
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
    console.error('D1 fail', JSON.stringify(j).slice(0, 400));
    return null;
  }
  return j;
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

const articles = [
  {
    title: 'Ghostwriting for beginners in Nigeria: how to land a first paid writing job',
    summary:
      'A practical path to paid ghostwriting — niches that work, portfolio samples, outreach scripts, pricing in naira, and scams that waste time. Educational only.',
    category: 'opportunities',
    image_url: '/covers/hustle.svg',
    content: `<h2>What ghostwriting actually is</h2>
<p>Ghostwriting means you write words that someone else publishes under their name. Clients include founders, coaches, pastors, newsletter owners, and small brands. You get paid for the draft; they get the byline.</p>
<p>It is not “write my thesis for free” and it is not a guaranteed ₦500k/month scheme. It is a skill service: clear thinking, clean English, and reliable delivery.</p>
<h2>Niches that beginners can start with</h2>
<ul>
<li>LinkedIn posts and short founder updates</li>
<li>WhatsApp broadcast scripts for small shops</li>
<li>Newsletter sections (one section, not a full magazine)</li>
<li>Product descriptions and simple landing-page copy</li>
<li>Church or community announcements (when ethics and disclosure are clear)</li>
</ul>
<p>Avoid medical, legal, and academic ghosting that creates harm or academic fraud. Stay in marketing and personal-brand content unless you are trained.</p>
<h2>Build proof without waiting for a client</h2>
<ol>
<li>Pick one niche (example: “short LinkedIn posts for small business owners”).</li>
<li>Write 5 sample posts as if for a fictional client.</li>
<li>Save them as a Google Doc or PDF portfolio.</li>
<li>Rewrite one real public post in your own words as a “before/after” sample (do not plagiarise).</li>
</ol>
<p>Clients buy confidence. Samples beat long bios.</p>
<h2>Outreach that does not feel spammy</h2>
<p>Message people who already post weakly or rarely. Script example:</p>
<p>“I help small business owners post 3 clear LinkedIn updates a week. Here are two sample posts in your style. If useful, I can do a paid trial pack of 4 posts.”</p>
<p>Send 10–15 targeted messages. Follow up once. Track replies in a note.</p>
<h2>Pricing starter ranges (illustrative only)</h2>
<ul>
<li>Single short social post: modest fixed fee</li>
<li>Pack of 4 posts: bundled price</li>
<li>1,000-word newsletter section: higher fixed fee</li>
</ul>
<p>Start lower to collect testimonials, then raise. Always agree scope in writing (WhatsApp is fine if clear).</p>
<h2>Watch-outs and scams</h2>
<ul>
<li>“Training fee before we hire ghostwriters”</li>
<li>Unlimited revisions with no deadline</li>
<li>Clients who only pay after viral results</li>
<li>Essay mills for students (ethical and platform risk)</li>
</ul>
<h2>7-day action plan</h2>
<ol>
<li>Choose one niche and one sample format.</li>
<li>Write 5 samples.</li>
<li>List 20 prospects.</li>
<li>Send 10 messages.</li>
<li>Close one small paid trial if possible.</li>
</ol>
<h2>Disclaimer</h2>
<p>Educational only — not financial advice. Income depends on skill, effort, and market demand.</p>`,
  },
  {
    title: 'Selling beats from your phone: a realistic beginner guide without playlist scams',
    summary:
      'How beginners can make and list beats using a phone, what “streams” really pay, and how to avoid pay-for-plays and fake playlist promotion. Educational only.',
    category: 'opportunities',
    image_url: '/covers/hustle.svg',
    content: `<h2>What this path really is</h2>
<p>Phone-based beat making is a creative skill path: learn a mobile DAW, finish tracks, upload to a store or send to artists, and improve from feedback. It is not a daily passive-income machine.</p>
<h2>Tools beginners actually use</h2>
<ul>
<li>Mobile DAWs and sample packs (verify licences before selling)</li>
<li>Headphones you already own for drafting (studio monitors later if needed)</li>
<li>A storefront or direct delivery via Drive/Telegram for custom work</li>
</ul>
<p>Start with short instrumentals you can finish in a week, not a 12-track album promise.</p>
<h2>Money realities</h2>
<p>Streaming payouts per play are usually tiny. Early income, if any, often comes from:</p>
<ul>
<li>Direct beat leases to local artists</li>
<li>Custom beats for content creators</li>
<li>Small packs sold to peers</li>
</ul>
<p>Treat the first months as skill building. Track hours and feedback, not only naira.</p>
<h2>How to sell without looking desperate</h2>
<ol>
<li>Post 15–30 second previews consistently.</li>
<li>Offer a clear lease type (mp3 vs tracked stems) and price.</li>
<li>Deliver fast and keep a simple contract note (who owns what).</li>
<li>Collect testimonials from even small local artists.</li>
</ol>
<h2>Scams to reject</h2>
<ul>
<li>Pay-for-plays and “guaranteed playlist” packages</li>
<li>Fake A&R accounts asking for upfront “placement fees”</li>
<li>Beat stores that lock your files after “verification payments”</li>
</ul>
<p>If someone guarantees chart placement for a fee, walk away.</p>
<h2>7-day practice plan</h2>
<ol>
<li>Finish one 60–90 second beat.</li>
<li>Export a clean preview.</li>
<li>Post it with a simple call to message for lease terms.</li>
<li>Message 5 artists or creators who need instrumentals.</li>
<li>Note what feedback you get and improve the next beat.</li>
</ol>
<h2>Disclaimer</h2>
<p>Educational only — not financial advice. Music income is uncertain and skill-dependent.</p>`,
  },
  {
    title: 'Online tutoring for WAEC and JAMB topics: start with one subject on your phone',
    summary:
      'How students and graduates can offer online tutoring for a single subject — setup, pricing, first clients, and payment safety. Educational only, not a school service.',
    category: 'guides',
    image_url: '/covers/hustle.svg',
    content: `<h2>Why one subject beats “I teach everything”</h2>
<p>Parents and students trust a clear offer: “I help SS2 students with Algebra word problems on WhatsApp/Zoom twice a week.” Broad claims sound empty.</p>
<h2>Pick a lane</h2>
<ul>
<li>One WAEC subject you scored well in</li>
<li>Or one JAMB subject area you can explain simply</li>
<li>Define level (JS3, SS1–SS3, or JAMB revision)</li>
</ul>
<p>Write a one-sentence offer and a sample 20-minute lesson outline.</p>
<h2>Setup that costs little</h2>
<ol>
<li>Quiet corner and stable data plan.</li>
<li>WhatsApp or Google Meet for sessions.</li>
<li>PDF past questions from legitimate free sources only.</li>
<li>A simple payment wallet you already use.</li>
</ol>
<h2>Finding first students</h2>
<ul>
<li>Church, mosque, estate, and school parent groups (with permission)</li>
<li>Seniors helping juniors in your old school network</li>
<li>Short demo: solve one past question on video</li>
</ul>
<p>Do not spam random groups. Ask admins. Offer a paid trial week, not endless free classes.</p>
<h2>Pricing and boundaries</h2>
<p>Charge per session or per week. State cancellation rules. Never guarantee a specific exam score. You sell teaching time and clarity, not miracles.</p>
<h2>Safety</h2>
<ul>
<li>Prefer group or parent-visible sessions for minors</li>
<li>Keep records of payments</li>
<li>Reject “pay training fee to join tutoring agency” schemes</li>
</ul>
<h2>7-day start</h2>
<ol>
<li>Write your one-subject offer.</li>
<li>Record one short demo explanation.</li>
<li>Message 10 warm contacts.</li>
<li>Book two trial sessions.</li>
<li>Ask for a testimonial after delivery.</li>
</ol>
<h2>Disclaimer</h2>
<p>Educational only — not financial advice. Tutoring results vary; this is not affiliated with WAEC, JAMB, or any school.</p>`,
  },
];

async function main() {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error('Missing CF secrets');
    process.exit(1);
  }
  let n = 0;
  for (const a of articles) {
    const exists = await d1(`SELECT id FROM articles WHERE title = ? LIMIT 1`, [a.title]);
    const rows = exists?.result?.[0]?.results || exists?.results || [];
    if (rows?.length) {
      console.log('skip exists', a.title.slice(0, 50));
      continue;
    }
    const id = 'a_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const slug = `${slugify(a.title)}-${id.slice(-5)}`;
    const words = a.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const mins = Math.max(6, Math.round(words / 200));
    const data = await d1(
      `INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, status, author_team, source_name, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', 'LaneCash Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now'))`,
      [id, slug, a.title, a.summary, a.content, a.category, a.image_url, mins]
    );
    if (data) {
      console.log('published', a.title);
      n++;
    }
  }
  console.log('done', n);
  if (!n) process.exit(2);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
