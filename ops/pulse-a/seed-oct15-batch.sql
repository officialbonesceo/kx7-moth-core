-- LaneCash human-voice batch — 15 Oct 2026

INSERT INTO articles (
  id, slug, title, summary, content, category, image_url, reading_minutes,
  views, is_featured, status, author_team, source_name,
  published_at, created_at, updated_at
) VALUES (
  'art_oct15_data_share_2026',
  'stop-sharing-data-hotspots-that-drain-your-week',
  'Stop sharing data hotspots that drain your week',
  'One “share small” request becomes five devices. How to set a hard rule without looking wicked.',
  '<p>You buy 1GB for assignments. By evening three people have connected and the meter is empty. That is not generosity — it is unpaid service.</p>

<p>Decide one rule and say it once: “I only hotspot for paid work or family.” If a classmate needs data every day, they need their own plan. You are not MTN.</p>

<p>On Android, turn off hotspot when you stand up from the table. Do not leave it on “just in case.” If someone complains, point to the empty balance screenshot. Quiet and firm beats long arguments.</p>

<p>Keep emergency data separate from social scrolling. When the week’s data is for CA or portal login, treat it like exam fees — not free Wi‑Fi for the hostel.</p>

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
  'art_oct15_group_contrib_2026',
  'class-group-contributions-that-never-show-receipts',
  'Class group contributions that never show receipts',
  'How to ask for a simple ledger before you send money for “class needs.”',
  '<p>Someone creates a group: “Send ₦2,000 for class needs.” No list. No balance. Next week another ₦1,500. That is how quiet anger starts.</p>

<p>Before you pay, ask three lines in the group: what the money is for, who holds it, and when they will post a simple note of total in and total out. If the answer is only “trust me,” send nothing until there is a written list.</p>

<p>Prefer transfers to a known class account with a screenshot thread, not cash to a random roommate. If you are the collector, post the ledger yourself the same day — it protects you too.</p>

<p>Refusing unclear collections is not “not team spirit.” It is basic money sense.</p>

<p><em>Educational only. Not legal advice.</em></p>',
  'guides',
  NULL,
  3,
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
  'art_oct15_job_fee_2026',
  'job-agents-who-charge-before-you-see-the-office',
  'Job agents who charge before you see the office',
  'If the first step is “pay placement fee” into a personal account, walk away.',
  '<p>A stranger messages: “Company is hiring. Pay ₦15,000 placement and we send you to HR tomorrow.” You have not seen an office. You have not met a staff ID. That is the whole red flag.</p>

<p>Real HR processes do not need your transfer to a personal name to “hold a slot.” Apply on known company sites or through people you can verify. If someone rushes you with “last two slots,” close the chat.</p>

<p>If you already paid, stop further transfers. Keep the receipt and bank alert. Do not give remote access to any “refund agent.”</p>

<p>Campus hustles exist. Paying strangers for imaginary jobs is not one of them.</p>

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
  'art_oct15_side_cash_2026',
  'small-campus-cash-without-owing-everybody',
  'Small campus cash without owing everybody',
  'One paid skill, clear prices, and a rule about credit so your side money does not become free labour.',
  '<p>Typing, editing, simple graphics, hair, snacks — pick one thing you can finish the same day. Write the price before the first customer. Say it out loud: “This is ₦X.”</p>

<p>Do not run five free “I will pay after test” jobs in a row. Credit is for people who already paid you twice without drama. Everyone else pays before delivery.</p>

<p>Keep side cash in a separate note or wallet from feeding money. If the hustle dies for two weeks, your feeding plan should still stand.</p>

<p>Small and clear beats big promises you cannot keep.</p>

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
