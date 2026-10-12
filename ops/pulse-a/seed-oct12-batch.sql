-- LaneCash articles batch — 12 Oct 2026
-- 4 human-quality guides for Nigerian readers

INSERT INTO articles (
  id, slug, title, summary, content, category, image_url, reading_minutes,
  views, is_featured, status, author_team, source_name,
  published_at, created_at, updated_at
) VALUES (
  'art_weekly_budget_phone_2026',
  'weekly-naira-budget-on-your-phone-without-fancy-apps',
  'Weekly naira budget on your phone — without fancy apps',
  'A simple weekly money plan you can run from Notes or WhatsApp saved messages: income, must-pay, and a small hustle line — no spreadsheet required.',
  '<p>Most budget advice assumes a laptop and calm months. Many readers have irregular income, shared family costs, and a phone that is already full of apps. This guide is a weekly loop you can run in the Notes app.</p>

<h2>What this really is</h2>
<p>A budget is not a moral score. It is a short list of where naira will go before the week ends. If money arrives mid-week from a small job, you update the same note — you do not start a new personality.</p>

<h2>Why it matters in Nigeria</h2>
<p>Data, transport, food, and sudden family asks compete every week. Without a written split, the loudest expense wins. Fancy finance apps are optional. Clarity is not.</p>

<h2>How it works in practice</h2>
<p>Every Sunday night or Monday morning, open one note titled with the week date. Write four lines only:</p>
<ol>
<li><strong>Expected in</strong> — salary, side job, or "unknown / low"</li>
<li><strong>Must pay</strong> — data, transport to work/school, shared food contribution</li>
<li><strong>Hustle cost</strong> — small amount for samples, prints, or delivery if you sell something</li>
<li><strong>Buffer</strong> — what remains; if zero, say so honestly</li>
</ol>
<p>When money lands, tick or edit the same note. Do not open a second "dream budget" file.</p>

<h2>Costs and realistic range</h2>
<p>This system costs nothing. The gain is fewer mid-week surprises. It will not create income by itself. Pair it with one concrete offer if you need more inflow.</p>

<h2>Risks and traps</h2>
<ul>
<li>Budget apps that demand card details you do not understand</li>
<li>"Money coaching" Telegram groups that sell courses before teaching a single free habit</li>
<li>Borrowing airtime/data on autopilot until top-ups only repay loans</li>
</ul>

<h2>Exact steps this week</h2>
<ol>
<li>Create one note with the four lines above.</li>
<li>Put real numbers, even if expected income is low.</li>
<li>Mute one spending trigger (late-night food delivery, impulse data loans) for seven days.</li>
<li>On Sunday, write one sentence: what worked, what broke.</li>
</ol>

<h2>What good looks like in 7 and 30 days</h2>
<p><strong>7 days:</strong> one complete weekly note you can still read.</p>
<p><strong>30 days:</strong> four notes in a row and fewer "where did it go" arguments with yourself.</p>

<p><em>Educational only — not financial advice.</em></p>',
  'guides',
  NULL,
  6,
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
  'First paying client: message scripts for phone freelancers',
  'Short outreach scripts for designers, editors, and tutors on WhatsApp — specific offer, clear price, easy no — without spam energy.',
  '<p>Getting a first paying client is mostly distribution. Skill matters, but silent skill earns zero. These scripts assume you already have one sample you can send.</p>

<h2>What this really is</h2>
<p>Outreach is a short, respectful ask to someone who might need a defined outcome. It is not a morning blast to 200 contacts with "Hi dear, I design logos."</p>

<h2>Why it matters</h2>
<p>Many capable beginners never send a clear offer. They post stories and wait. Clients who already know you are the cheapest path to proof and referrals.</p>

<h2>Script patterns that work better</h2>
<p><strong>Warm contact (someone you know):</strong></p>
<p>"Hi [Name] — I now do [specific deliverable] for small businesses. Example: [one line]. Fixed price ₦[N] for [scope]. If you need that this month, I can send a sample. If not, no stress."</p>
<p><strong>Semi-warm (mutual group / campus):</strong></p>
<p>"I help [type of person] get [result] in [time]. I have a sample ready. Price ₦[N]. Happy to share the sample if useful — either way, take care."</p>

<h2>Rules</h2>
<ul>
<li>One follow-up after 3–4 days, then stop</li>
<li>Same price you would post publicly</li>
<li>Never accept "pay after I get paid by my client" for your first jobs unless you accept the risk in writing</li>
<li>Refuse any request to receive money for a third party</li>
</ul>

<h2>Exact steps this week</h2>
<ol>
<li>Write your one-sentence offer with a number.</li>
<li>Pick 15 people who already have the problem.</li>
<li>Send personalised messages (name + why them).</li>
<li>Log replies in a note: yes / later / no.</li>
<li>Deliver one paid mini package if anyone says yes.</li>
</ol>

<h2>What good looks like</h2>
<p><strong>7 days:</strong> 15 messages sent, sample ready, log started.</p>
<p><strong>30 days:</strong> at least one paid delivery or a clear reason why the offer must change.</p>

<p><em>Educational only — not a promise of clients or income.</em></p>',
  'guides',
  NULL,
  6,
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
  'USDT first test send: checklist before you move size',
  'A calm checklist for a tiny USDT test transfer — network, fee, backup, and scam stops — so beginners do not learn with rent money.',
  '<p>USDT is useful as a dollar-linked unit for some transfers and learning. It is not a daily salary machine. Before you move any amount you care about, run a tiny test like a pilot flight.</p>

<h2>What this really is</h2>
<p>A test send proves you can select the correct network, pay the fee, and receive funds in a wallet you control. Until that works, you are not ready for size.</p>

<h2>Why it matters in Nigeria</h2>
<p>Wrong network, phishing sites, and "support" DMs drain beginners. Small capital does not make those mistakes cheaper emotionally when it was food money.</p>

<h2>Checklist before any test</h2>
<ol>
<li>Wallet created from an official source only</li>
<li>Seed phrase written offline — never shared, never photographed into a random chat</li>
<li>You know which network you will use (e.g. TRC20 vs ERC20) and the fee range</li>
<li>Receive address copied carefully; first and last characters double-checked</li>
<li>Test amount is money you can lose while learning</li>
</ol>

<h2>Scam stops</h2>
<ul>
<li>No guaranteed daily USDT returns</li>
<li>No paying a fee to "unlock" a withdrawal</li>
<li>No seed phrase to anyone claiming to be support</li>
<li>No screen-sharing with strangers to "help you set up"</li>
</ul>

<h2>Exact steps this week</h2>
<ol>
<li>Write definitions: USDT, network, fee, seed phrase.</li>
<li>Send the smallest test you can afford.</li>
<li>Record fee and time in a note.</li>
<li>If anything asks for extra deposits to complete the test, stop.</li>
</ol>

<h2>What good looks like</h2>
<p><strong>7 days:</strong> one successful tiny round trip documented.</p>
<p><strong>30 days:</strong> repeatable path, zero seed-phrase exposure, no yield-app deposits.</p>

<p><em>Educational only — not investment advice. Crypto involves loss risk.</em></p>',
  'opportunities',
  NULL,
  6,
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
  status = 'published',
  updated_at = datetime('now');

INSERT INTO articles (
  id, slug, title, summary, content, category, image_url, reading_minutes,
  views, is_featured, status, author_team, source_name,
  published_at, created_at, updated_at
) VALUES (
  'art_campus_side_cash_2026',
  'campus-side-cash-ideas-that-do-not-need-a-shop',
  'Campus side cash: ideas that do not need a shop',
  'Practical on-campus service ideas with low setup — printing runs, micro tutoring, media help — plus the boundaries that keep you off scam lists.',
  '<p>Campus economies run on urgency: assignments, passport photos, group prints, last-minute edits. You do not need a shopfront to sell into that demand. You need reliability and a clear price.</p>

<h2>What this really is</h2>
<p>Service hustles use skill and time. Inventory hustles need capital and storage. Start with service if capital is under a few thousand naira.</p>

<h2>Idea lanes that fit campus</h2>
<ul>
<li><strong>Print and document runs</strong> — batch classmates'' prints for a small fee if you already go to the business centre</li>
<li><strong>Micro tutoring</strong> — one subject you already passed, fixed session price</li>
<li><strong>Short media help</strong> — CapCut cleanup for department events, simple Canva posters</li>
<li><strong>Form and portal help</strong> — only where allowed; never hold other students'' passwords</li>
</ul>

<h2>Pricing without drama</h2>
<p>Post a fixed price for a defined unit ("₦X per session", "₦Y per poster"). Avoid endless free "help" that trains people not to pay.</p>

<h2>Hard no list</h2>
<ul>
<li>Receiving money for strangers (mule risk)</li>
<li>Selling exam content or impersonating staff</li>
<li>Paying an "agent" for campus market access</li>
<li>Any app that guarantees daily profit for students</li>
</ul>

<h2>Exact steps this week</h2>
<ol>
<li>Pick one lane and one price.</li>
<li>Tell 10 people in your department with a one-line offer.</li>
<li>Deliver once, on time, with the agreed scope.</li>
<li>Ask for one referral.</li>
</ol>

<h2>What good looks like</h2>
<p><strong>7 days:</strong> offer live, at least conversations started.</p>
<p><strong>30 days:</strong> repeated small paid tasks or a clear decision to change the offer.</p>

<p><em>Educational only — not a guarantee of campus income. Follow school rules.</em></p>',
  'money',
  NULL,
  6,
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
  is_featured = 1,
  status = 'published',
  updated_at = datetime('now');
