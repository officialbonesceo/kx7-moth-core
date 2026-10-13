-- LaneCash — rewritten human voice (13 Oct 2026)

INSERT INTO articles (
  id, slug, title, summary, content, category, image_url, reading_minutes,
  views, is_featured, status, author_team, source_name,
  published_at, created_at, updated_at
) VALUES (
  'art_weekly_budget_phone_2026',
  'weekly-naira-budget-on-your-phone-without-fancy-apps',
  'Track this week’s money in Notes — no budget app needed',
  'One phone note for what came in, what must go out, and what is left. Built for irregular income, not spreadsheet people.',
  '<p>If money comes in bits — small jobs, transfers from home, POS commission — a “monthly budget” feels fake. What actually helps is knowing this week before the week ends.</p>

<p>Open Notes (or WhatsApp Saved Messages). Title it with the date, like <strong>Week 13 Oct</strong>. Write only four lines:</p>
<ol>
<li><strong>Coming in</strong> — what you already have or expect (be honest; “maybe” counts as low)</li>
<li><strong>Must pay</strong> — data, transport, your share of food, anything that will cause trouble if skipped</li>
<li><strong>Hustle cost</strong> — prints, sample work, delivery; leave blank if you are not selling anything</li>
<li><strong>Left</strong> — whatever remains after 1–3. If it is zero, write zero</li>
</ol>

<p>When money lands mid-week, edit the same note. Do not open a second “proper budget” file. One note is easier to keep.</p>

<p>Common leak: airtime/data loans that repay themselves from the next top-up. If that is eating your “must pay” line, turn auto-borrow off in the network app or USSD when you can.</p>

<p>This will not create income. It only stops the “where did it go” feeling. If you need more inflow, pair it with one clear offer people can pay for — not another finance app.</p>

<p><em>Educational only. Not financial advice.</em></p>',
  'guides',
  NULL,
  4,
  0,
  1,
  'published',
  'LaneCash Desk',
  'LaneCash',
  datetime('now'),
  datetime('now'),
  datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  summary = excluded.summary,
  content = excluded.content,
  category = excluded.category,
  reading_minutes = excluded.reading_minutes,
  is_featured = 1,
  status = 'published',
  updated_at = datetime('now');

INSERT INTO articles (
  id, slug, title, summary, content, category, image_url, reading_minutes,
  views, is_featured, status, author_team, source_name,
  published_at, created_at, updated_at
) VALUES (
  'art_first_client_script_2026',
  'first-paying-client-message-scripts-for-phone-freelancers',
  'How to ask for your first paid job on WhatsApp',
  'Short messages that state the job, the price, and an easy way to say no — for people who already have one sample.',
  '<p>Skill without a message stays unpaid. You do not need a website. You need one sample and a clear ask.</p>

<p>Write your offer in one line first: <em>I do X for ₦Y. Sample ready.</em> Example: “I edit short phone videos for small shops — ₦3,000 per clip under 45 seconds.”</p>

<p>Then message people who already have the problem — not random groups.</p>

<p><strong>Someone you know:</strong><br/>
“Hi Tunde — I now edit short product videos on phone. Fixed ₦3k per clip. I can send a sample if you need one this month. If not, no wahala.”</p>

<p><strong>Someone from class / church / work chat:</strong><br/>
“I help with simple Canva flyers for events. ₦2,500 for one design + one revision. Sample is ready if useful.”</p>

<p>Rules that save stress:</p>
<ul>
<li>Follow up once after a few days, then stop</li>
<li>Same price you would tell a stranger</li>
<li>Do not receive money “for my client abroad” — that is how people get used as mules</li>
<li>Free “test work” with no end date is not a client; it is free labour</li>
</ul>

<p>This week: send 10 personal messages with a name in them. Keep a note of replies. One paid delivery is enough proof to raise the price later.</p>

<p><em>Educational only. No income promised.</em></p>',
  'guides',
  NULL,
  4,
  0,
  1,
  'published',
  'LaneCash Hustle Desk',
  'LaneCash',
  datetime('now'),
  datetime('now'),
  datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  summary = excluded.summary,
  content = excluded.content,
  reading_minutes = excluded.reading_minutes,
  is_featured = 1,
  status = 'published',
  updated_at = datetime('now');

INSERT INTO articles (
  id, slug, title, summary, content, category, image_url, reading_minutes,
  views, is_featured, status, author_team, source_name,
  published_at, created_at, updated_at
) VALUES (
  'art_usdt_test_send_2026',
  'usdt-first-test-send-checklist-before-you-move-size',
  'Before you move USDT: do a tiny test first',
  'Network, fee, and address checks for a small test send — so you do not learn with money you cannot lose.',
  '<p>USDT is not a salary app. It is a digital dollar-like token people use for transfers and trading. If someone promises daily returns in USDT, walk away.</p>

<p>Before you move any amount that matters, send a <strong>tiny</strong> test. Treat it like checking the road before you drive.</p>

<p>Check these off:</p>
<ul>
<li>Wallet came from an official source — not a random APK in a chat</li>
<li>Seed phrase is offline. Nobody “support” ever needs it</li>
<li>You know the network (TRC20 and ERC20 are not the same). Wrong network can mean lost funds</li>
<li>You copied the receive address and checked the first and last characters</li>
<li>The test amount is money you can afford to lose while learning</li>
</ul>

<p>If a screen asks you to pay an extra fee to “unlock” a withdrawal, stop. That is a classic trap.</p>

<p>Write the fee and time in a note after the test. If the test fails, do not scale up “to recover.” Fix the mistake first.</p>

<p><em>Educational only. Crypto can go to zero. Not investment advice.</em></p>',
  'opportunities',
  NULL,
  4,
  0,
  0,
  'published',
  'LaneCash Crypto Desk',
  'LaneCash',
  datetime('now'),
  datetime('now'),
  datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  summary = excluded.summary,
  content = excluded.content,
  reading_minutes = excluded.reading_minutes,
  status = 'published',
  updated_at = datetime('now');

INSERT INTO articles (
  id, slug, title, summary, content, category, image_url, reading_minutes,
  views, is_featured, status, author_team, source_name,
  published_at, created_at, updated_at
) VALUES (
  'art_campus_side_cash_2026',
  'campus-side-cash-ideas-that-do-not-need-a-shop',
  'Small campus money without opening a shop',
  'Print runs, tutoring, and simple media help — with prices and hard nos that keep you out of trouble.',
  '<p>Campus spends money on urgency: prints before class, last-minute posters, someone who already passed a course. You do not need a kiosk for that. You need to show up and charge a clear price.</p>

<p>Ideas that fit low capital:</p>
<ul>
<li><strong>Print runs</strong> — if you already go to the business centre, collect classmates’ files and charge a small batch fee</li>
<li><strong>Micro tutoring</strong> — one course you passed; fixed fee per session, not “whenever”</li>
<li><strong>Quick media</strong> — CapCut clean-up for department events, simple Canva posters</li>
</ul>

<p>Say the price out loud: “₦X per session” or “₦Y per poster.” Vague “we will discuss” often becomes free work.</p>

<p>Hard nos:</p>
<ul>
<li>Holding other students’ passwords or “helping” with exam malpractice</li>
<li>Receiving money for a stranger “because their bank is down”</li>
<li>Paying anyone for a “campus market slot”</li>
<li>Apps that promise students daily profit</li>
</ul>

<p>This week: pick one lane, tell ten people in your department, deliver once on time. Ask for one referral after. Follow your school’s rules.</p>

<p><em>Educational only. Not a guarantee of campus income.</em></p>',
  'money',
  NULL,
  4,
  0,
  1,
  'published',
  'LaneCash Hustle Desk',
  'LaneCash',
  datetime('now'),
  datetime('now'),
  datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  summary = excluded.summary,
  content = excluded.content,
  reading_minutes = excluded.reading_minutes,
  is_featured = 1,
  status = 'published',
  updated_at = datetime('now');
