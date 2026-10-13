-- LaneCash human-voice batch 2 — 13 Oct 2026 (unique ids)

INSERT INTO articles (
  id, slug, title, summary, content, category, image_url, reading_minutes,
  views, is_featured, status, author_team, source_name,
  published_at, created_at, updated_at
) VALUES (
  'art_b2_airtime_loan_2026',
  'airtime-loans-that-eat-your-next-allowance',
  'Airtime loans that eat your next allowance',
  'Why borrowing airtime for “just this call” becomes a weekly tax — and a cleaner habit that still keeps you reachable.',
  '<p>Airtime loan buttons are easy. The payback is not.</p>

<p>You borrow ₦200 for a call. By Friday the wallet wants ₦240 or more. You borrow again because the previous loan already took the top-up your parent sent. That is how small debts stack inside the same app.</p>

<p>Before you tap loan again: check how much you already owe in that app. Write it in Notes. If the number is climbing every week, stop borrowing for chat and status. Use Wi‑Fi where you can. Save one contact for true emergencies only.</p>

<p>If family sends data money, treat it as data money — not a loan repayment pool. Tell the app “no” until the balance is clear.</p>

<p><em>Educational only. Not financial advice.</em></p>',
  'money',
  NULL,
  3,
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
  is_featured = 1,
  status = 'published',
  updated_at = datetime('now');

INSERT INTO articles (
  id, slug, title, summary, content, category, image_url, reading_minutes,
  views, is_featured, status, author_team, source_name,
  published_at, created_at, updated_at
) VALUES (
  'art_b2_campus_print_2026',
  'campus-printing-without-owing-the-business-centre',
  'Campus printing without owing the business centre',
  'A simple price list, cash-first rule, and when to say no so a small print hustle does not become free labour.',
  '<p>Printing for classmates can pay. It can also turn into free work if you never state the price.</p>

<p>Write three lines in Notes before you open for the day: price per page (black), price for colour if you offer it, and when you collect cash. Say it once when they send the file. “₦X per page. Pay before I release the pack.”</p>

<p>Do not print large jobs on credit for people who already delayed last week. You are not a bank. If the centre you use raises prices, update your Notes the same day so you are not selling at a loss.</p>

<p>Keep one folder for paid jobs only. Unpaid “I will pay after lecture” jobs wait until the money is in your hand.</p>

<p><em>Educational only. Sales are not guaranteed.</em></p>',
  'guides',
  NULL,
  3,
  0,
  0,
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
  status = 'published',
  updated_at = datetime('now');

INSERT INTO articles (
  id, slug, title, summary, content, category, image_url, reading_minutes,
  views, is_featured, status, author_team, source_name,
  published_at, created_at, updated_at
) VALUES (
  'art_b2_fake_scholarship_2026',
  'scholarship-forms-that-charge-a-processing-fee',
  'Scholarship forms that charge a processing fee',
  'Real programmes rarely ask students to pay a stranger to “process” a form. How to spot the fee trap.',
  '<p>A message says you have been “selected” for a scholarship. The next line asks for a processing fee, activation fee, or courier fee into a personal account.</p>

<p>Pause. Real public scholarships publish on known organisation sites. They do not need you to pay a random number on WhatsApp to release a form.</p>

<p>Check three things: the website domain (type it yourself), whether the fee goes to a personal name, and whether they rush you with a 24-hour threat. Any two of those is enough reason to close the chat.</p>

<p>If you already paid, stop further transfers. Keep the receipt. Tell your bank. Do not give remote access to a “recovery agent.”</p>

<p><em>Educational only. Not legal advice.</em></p>',
  'scams',
  NULL,
  4,
  0,
  1,
  'published',
  'LaneCash Scam Desk',
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
  'art_b2_pos_agent_2026',
  'before-you-become-a-pos-agent-on-campus',
  'Before you become a POS agent on campus',
  'Questions to ask about float, charges, and who holds the terminal — so you are not carrying risk you do not understand.',
  '<p>Someone offers you a POS machine and a “daily target.” Ask who owns the terminal and who replaces lost float.</p>

<p>Write down: the company or person you report to, how charges are shared, and what happens when a transfer reverses. If answers are only voice notes and no written terms, treat it as high risk.</p>

<p>Do not hand over your BVN or full bank login to “activate” a machine. Use official agent onboarding if you go that route. Keep personal spending money in a different wallet from float.</p>

<p>Campus POS can work for some people. It is still a business with loss risk — not free money.</p>

<p><em>Educational only. Not business or investment advice.</em></p>',
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
  is_featured = 1,
  status = 'published',
  updated_at = datetime('now');
