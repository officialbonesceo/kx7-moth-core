-- LaneCash human-voice batch — 13 Oct 2026

INSERT INTO articles (
  id, slug, title, summary, content, category, image_url, reading_minutes,
  views, is_featured, status, author_team, source_name,
  published_at, created_at, updated_at
) VALUES (
  'art_fake_job_fee_2026',
  'job-offers-that-ask-you-to-pay-first',
  'If a “job” asks you to pay first, it is not a job',
  'How fake remote jobs and agent slots use registration fees, training packs, and “equipment deposits” — and what to do instead.',
  '<p>Real employers pay you. They do not charge you to start.</p>

<p>Watch for the pattern: nice WhatsApp chat, “work from phone,” then a fee for training, uniform, laptop, or portal access. After you pay, support goes quiet or asks for another fee to “release” the first salary.</p>

<p>Common lines:</p>
<ul>
<li>“Pay ₦X to activate your account”</li>
<li>“Buy the starter pack so HR can process you”</li>
<li>“Send money to this personal account; company account is offline”</li>
</ul>

<p>Before you send anything: ask for a company website you can open yourself, a written role without payment, and a way to verify the person is not a random number. If they rush you with a countdown, that is pressure, not professionalism.</p>

<p>If you already paid, stop further transfers. Keep receipts. Tell your bank’s fraud line. Do not hand your phone to a “recovery agent” who wants remote access.</p>

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
  category = excluded.category,
  is_featured = 1,
  status = 'published',
  updated_at = datetime('now');

INSERT INTO articles (
  id, slug, title, summary, content, category, image_url, reading_minutes,
  views, is_featured, status, author_team, source_name,
  published_at, created_at, updated_at
) VALUES (
  'art_opay_monie_split_2026',
  'split-hustle-money-from-food-money',
  'Keep hustle money away from food money',
  'A simple two-wallet habit so side-income does not disappear into airtime and late-night transfers.',
  '<p>Many people earn a little from side work, then cannot explain where it went by Friday. The fix is boring: separate wallets.</p>

<p>Pick one receive wallet for customers or clients (Opay, Moniepoint, Kuda — whatever you already use). Pick a second place for rent/food money. When a payment lands in the hustle wallet, move only what you planned to spend. Leave the rest until you have a written target (data for work, materials, or savings).</p>

<p>Write one rule in Notes: <em>No random transfers from the hustle wallet after 9pm.</em> Night spending is where small gains die.</p>

<p>This is not investment advice. It is bookkeeping on a phone. If fees for moving money between wallets are high, move less often and in larger chunks.</p>

<p><em>Educational only.</em></p>',
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
  'art_status_price_once_2026',
  'post-your-price-once-on-status',
  'Post the price once — stop “DM for price”',
  'Why clear status prices get better replies than vague hype, for students and small sellers.',
  '<p>“DM for price” sounds smart. It often means people swipe past because they already know the chat will waste time.</p>

<p>Put the offer on status in one breath: what it is, price or range, pickup or delivery, and how to order. Example: “A4 print — ₦X per page. Campus gate after 4pm. Reply with page count.”</p>

<p>One clear photo of the finished work beats five lifestyle filters. Reply with the same numbers you posted. If someone asks you to “activate” something before they buy, they are not a customer.</p>

<p>Two solid posts a day beat twenty identical ones. Save your status text in Notes so you are not inventing prices under pressure.</p>

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
  'art_agent_not_friend_2026',
  'when-a-friend-sends-you-an-investment-app',
  'When a friend sends you an investment app',
  'Referral pressure is part of many fake yield apps. How to say no without losing the friendship — or more money.',
  '<p>Scam apps love referrals. Your friend may already be inside and needs new deposits to keep their “balance” looking healthy. That does not make the app safe.</p>

<p>Ask three questions out loud:</p>
<ol>
<li>Does it promise a fixed daily percentage?</li>
<li>Do withdrawals need an extra fee or upgrade first?</li>
<li>Is support only inside a private chat?</li>
</ol>

<p>If the answers lean yes, refuse the deposit. You can still be kind: “I am not putting money in apps that guarantee returns.” You do not owe them a long debate.</p>

<p>If you are already stuck mid-withdrawal, stop sending more money. Recovery accounts that ask for another payment are usually the next layer of the same trap.</p>

<p><em>Educational only. Not investment advice.</em></p>',
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
