-- LaneCash 15 high-intent SEO articles (finance + habits + campus money)
-- category: money | guides | scams
-- status: scheduled until daily-release workflow publishes one/day

INSERT OR IGNORE INTO categories (id, slug, name, description) VALUES
  ('cat_money', 'money', 'Money & Hustle', 'Side hustles and practical finance'),
  ('cat_guides', 'guides', 'Guides', 'How-to guides'),
  ('cat_scams', 'scams', 'Scam Alerts', 'Warnings');

-- 1
INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, views, is_featured, status, author_team, source_name, published_at, created_at, updated_at)
VALUES (
  'art_fin15_01_save',
  'how-to-save-money-as-a-nigerian-student-on-small-allowance',
  'How to save money as a Nigerian student on a small allowance',
  'A simple weekly envelope method when your money is already tight — no fancy apps required.',
  '<p>If your allowance finishes before mid-week, “save 20%” advice feels insulting. Start smaller.</p>
<p><strong>Rule one:</strong> the day money lands, move a fixed amount you will not touch — even ₦500 — into a separate wallet or note-labelled “not for food.” If you cannot do ₦500, do ₦200. Consistency beats size.</p>
<p><strong>Rule two:</strong> list only three spending buckets for the week: feeding, data/transport, and one optional. Everything else waits.</p>
<p><strong>Rule three:</strong> do not “borrow from savings” for parties. If you must break the jar, write why in your notes. Shame is a better teacher than a speech.</p>
<p>This is educational only — not personalised financial advice. Your situation may differ.</p>',
  'money', '/covers/money.svg', 5, 0, 1, 'scheduled', 'LaneCash Fin Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, summary=excluded.summary, content=excluded.content, status='scheduled', updated_at=datetime('now');

-- 2
INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, views, is_featured, status, author_team, source_name, published_at, created_at, updated_at)
VALUES (
  'art_fin15_02_budget',
  'simple-weekly-budget-for-students-in-nigeria',
  'Simple weekly budget for students in Nigeria',
  'Track seven days only. Monthly budgets fail when your cash arrives weekly.',
  '<p>Use a week, not a month. Write opening balance on Monday. Subtract feeding, transport, data. What remains is optional — not “free to finish.”</p>
<p>Keep the plan on your phone Notes app. Update once at night. If you overspend one day, cut the next day — do not restart the whole week in guilt.</p>
<p>Educational only. Not financial advice.</p>',
  'money', '/covers/money.svg', 4, 0, 0, 'scheduled', 'LaneCash Fin Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, summary=excluded.summary, content=excluded.content, status='scheduled', updated_at=datetime('now');

-- 3
INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, views, is_featured, status, author_team, source_name, published_at, created_at, updated_at)
VALUES (
  'art_fin15_03_emergency',
  'emergency-fund-for-students-start-with-one-week-of-feeding',
  'Emergency fund for students: start with one week of feeding',
  'Forget six months of expenses. Aim for one calm week if school fees shock hits.',
  '<p>Classic advice says 3–6 months of expenses. On campus, aim first for <strong>one week of feeding + data</strong> locked away.</p>
<p>Park it where you will not open it for “just this weekend.” When you use it, rebuild before any luxury spend.</p>
<p>Educational only. Not financial advice.</p>',
  'money', '/covers/money.svg', 4, 0, 0, 'scheduled', 'LaneCash Fin Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, summary=excluded.summary, content=excluded.content, status='scheduled', updated_at=datetime('now');

-- 4
INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, views, is_featured, status, author_team, source_name, published_at, created_at, updated_at)
VALUES (
  'art_fin15_04_pos',
  'pos-agent-charges-what-students-should-check-before-paying',
  'POS agent charges: what students should check before paying',
  'Ask the fee out loud. Small “service” amounts add up across a semester.',
  '<p>Before you hand over your card or confirm transfer, ask: “How much is the charge?” If the number is vague, walk to another agent.</p>
<p>Prefer bank apps for larger sums when network works. Keep SMS alerts on. Educational only — not a bank recommendation.</p>',
  'guides', '/covers/hustle.svg', 3, 0, 0, 'scheduled', 'LaneCash Hustle Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, summary=excluded.summary, content=excluded.content, status='scheduled', updated_at=datetime('now');

-- 5
INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, views, is_featured, status, author_team, source_name, published_at, created_at, updated_at)
VALUES (
  'art_fin15_05_transfer',
  'bank-transfer-mistakes-nigerian-students-make',
  'Bank transfer mistakes Nigerian students make',
  'Wrong account, rushed name match, and “I will reverse it” myths.',
  '<p>Always match the name that appears after you enter the account number. If it is wrong, stop. Do not trust “send first, we reverse.”</p>
<p>For school fees, use official portals where possible and keep receipts. Educational only.</p>',
  'guides', '/covers/money.svg', 4, 0, 0, 'scheduled', 'LaneCash Fin Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, summary=excluded.summary, content=excluded.content, status='scheduled', updated_at=datetime('now');

-- 6
INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, views, is_featured, status, author_team, source_name, published_at, created_at, updated_at)
VALUES (
  'art_fin15_06_loan',
  'campus-loans-and-soft-loans-red-flags-for-students',
  'Campus loans and soft loans: red flags for students',
  'If interest is unclear or collection is through shame on the group chat, pause.',
  '<p>Borrowing for a night out is different from borrowing for registration. Write the amount, due date, and interest in one message both parties can screenshot.</p>
<p>Avoid lenders who threaten to post your name in class groups. That is pressure, not a contract. Educational only — not legal advice.</p>',
  'scams', '/covers/scams.svg', 4, 0, 1, 'scheduled', 'LaneCash Scam Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, summary=excluded.summary, content=excluded.content, status='scheduled', updated_at=datetime('now');

-- 7
INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, views, is_featured, status, author_team, source_name, published_at, created_at, updated_at)
VALUES (
  'art_fin15_07_side',
  'side-hustles-for-nigerian-students-that-fit-class-timetable',
  'Side hustles for Nigerian students that fit a class timetable',
  'Same-day skills beat “passive income” promises on Telegram.',
  '<p>Pick work you can finish between lectures: typing, printing runs, basic design, tutorials for one course you already passed.</p>
<p>Price before you start. Collect before final delivery when the customer is new. Educational only — income not guaranteed.</p>',
  'money', '/covers/hustle.svg', 5, 0, 1, 'scheduled', 'LaneCash Hustle Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, summary=excluded.summary, content=excluded.content, status='scheduled', updated_at=datetime('now');

-- 8
INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, views, is_featured, status, author_team, source_name, published_at, created_at, updated_at)
VALUES (
  'art_fin15_08_data',
  'how-to-stop-wasting-data-and-airtime-on-campus',
  'How to stop wasting data and airtime on campus',
  'Separate “portal data” from social scrolling or your week collapses.',
  '<p>Buy a small plan only for school portals and assignments. Use campus Wi‑Fi for video when safe. Turn off autoplay.</p>
<p>Hotspot rules: paid work and family first. Educational only.</p>',
  'guides', '/covers/hustle.svg', 3, 0, 0, 'scheduled', 'LaneCash Hustle Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, summary=excluded.summary, content=excluded.content, status='scheduled', updated_at=datetime('now');

-- 9
INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, views, is_featured, status, author_team, source_name, published_at, created_at, updated_at)
VALUES (
  'art_fin15_09_fees',
  'school-fees-payment-safety-checklist-for-parents-and-students',
  'School fees payment safety checklist for parents and students',
  'Official portal, official account name, receipt saved — then celebrate.',
  '<p>Pay only through channels published by the school. Confirm the account name. Screenshot every step.</p>
<p>Anyone offering a “discount portal” in chat is a risk. Educational only — not the school’s official notice.</p>',
  'guides', '/covers/money.svg', 4, 0, 1, 'scheduled', 'LaneCash Fin Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, summary=excluded.summary, content=excluded.content, status='scheduled', updated_at=datetime('now');

-- 10
INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, views, is_featured, status, author_team, source_name, published_at, created_at, updated_at)
VALUES (
  'art_fin15_10_fx',
  'usd-to-naira-for-students-what-rate-screenshots-do-not-tell-you',
  'USD to naira for students: what rate screenshots do not tell you',
  'Parallel rates move. Fees and timing matter more than one viral screenshot.',
  '<p>A rate card on social media is not a contract. Ask total naira you will receive after charges before you send anything.</p>
<p>Use trusted platforms you can reverse-check. Educational only — not FX advice.</p>',
  'money', '/covers/money.svg', 4, 0, 0, 'scheduled', 'LaneCash Fin Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, summary=excluded.summary, content=excluded.content, status='scheduled', updated_at=datetime('now');

-- 11
INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, views, is_featured, status, author_team, source_name, published_at, created_at, updated_at)
VALUES (
  'art_fin15_11_crypto',
  'crypto-and-usdt-basics-for-beginners-in-nigeria-risks-first',
  'Crypto and USDT basics for beginners in Nigeria — risks first',
  'If someone guarantees daily profit, treat it as marketing, not maths.',
  '<p>USDT and other tokens can move in price and can be lost to phishing. Never share seed phrases. Never pay “activation tax” to unlock a wallet.</p>
<p>Educational only — not investment advice. You can lose money.</p>',
  'scams', '/covers/crypto.svg', 5, 0, 0, 'scheduled', 'LaneCash Scam Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, summary=excluded.summary, content=excluded.content, status='scheduled', updated_at=datetime('now');

-- 12
INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, views, is_featured, status, author_team, source_name, published_at, created_at, updated_at)
VALUES (
  'art_fin15_12_jobscam',
  'online-job-scams-targeting-nigerian-students-2026',
  'Online job scams targeting Nigerian students',
  'Pay-to-work, fake HR, and “task” apps that only extract deposits.',
  '<p>Real employers do not ask for a placement fee into a personal account before an interview. If the chat is only pressure and payment links, exit.</p>
<p>Educational only — not legal advice.</p>',
  'scams', '/covers/scams.svg', 4, 0, 1, 'scheduled', 'LaneCash Scam Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, summary=excluded.summary, content=excluded.content, status='scheduled', updated_at=datetime('now');

-- 13
INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, views, is_featured, status, author_team, source_name, published_at, created_at, updated_at)
VALUES (
  'art_fin15_13_habits',
  'personal-finance-habits-that-actually-work-on-campus',
  'Personal finance habits that actually work on campus',
  'Five small habits: separate wallets, weekly review, no silent debt, receipt folder, one skill.',
  '<p>1) Separate “rent/fees” money from daily spend.<br/>2) Ten-minute weekly review.<br/>3) No debt you cannot explain in one sentence.<br/>4) Folder of fee receipts.<br/>5) One skill that can earn same-day cash.</p>
<p>Educational only — not financial advice.</p>',
  'money', '/covers/money.svg', 5, 0, 1, 'scheduled', 'LaneCash Fin Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, summary=excluded.summary, content=excluded.content, status='scheduled', updated_at=datetime('now');

-- 14
INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, views, is_featured, status, author_team, source_name, published_at, created_at, updated_at)
VALUES (
  'art_fin15_14_family',
  'how-to-talk-to-family-about-money-without-fighting',
  'How to talk to family about money without fighting',
  'Use numbers and dates, not blame. Ask for a plan, not a lecture.',
  '<p>Write what you need, by when, and what you already covered. Send it as text so emotions cool. Offer one cut you will make.</p>
<p>Educational only — family dynamics differ.</p>',
  'guides', '/covers/hustle.svg', 4, 0, 0, 'scheduled', 'LaneCash Fin Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, summary=excluded.summary, content=excluded.content, status='scheduled', updated_at=datetime('now');

-- 15
INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, views, is_featured, status, author_team, source_name, published_at, created_at, updated_at)
VALUES (
  'art_fin15_15_checklist',
  'end-of-month-money-checklist-for-nigerian-students',
  'End-of-month money checklist for Nigerian students',
  'Balance, debts, upcoming fees, data plan, and one cut for next month.',
  '<p>Before the month flips: note account balances, list who you owe, list fees due, renew data only after fees are planned, pick one expense to cut.</p>
<p>Educational only — not financial advice. Contact: officialbonesceo@gmail.com for site issues (not personal money coaching).</p>',
  'money', '/covers/money.svg', 4, 0, 0, 'scheduled', 'LaneCash Fin Desk', 'LaneCash', datetime('now'), datetime('now'), datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET title=excluded.title, summary=excluded.summary, content=excluded.content, status='scheduled', updated_at=datetime('now');
