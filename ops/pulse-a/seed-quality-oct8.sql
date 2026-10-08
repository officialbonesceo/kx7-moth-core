-- Three human-quality guides, clean slugs (no random tails)

INSERT INTO articles (
  id, slug, title, summary, content, category, image_url, reading_minutes,
  views, is_featured, status, author_team, source_name,
  published_at, created_at, updated_at
) VALUES (
  'art_airtime_loan_trap_2026',
  'airtime-and-data-loan-traps-what-students-miss',
  'Airtime and data loan traps: what students usually miss',
  'How airtime and data “loans” work on Nigerian networks, why the real cost is higher than the pop-up, and how to decide before you tap accept.',
  '<p>If your phone is on 2% and a message offers “borrow data now,” it feels like help. It is a short-term product with a clear cost. The problem is not that loans exist. The problem is accepting them on autopilot when a cheaper option is five minutes away.</p>

<h2>What the product actually is</h2>
<p>Network airtime and data loans are credit against your number. You get service today. You repay from the next top-up, often with a service fee. That fee is not “bank interest” in the formal sense, but it still reduces what your next ₦500 or ₦1,000 can buy.</p>
<p>Before you accept, open the full terms in the USSD or app flow. Note the amount you receive, the fee, and when repayment is taken. If the screen only shows the loan amount and hides the fee until later, treat that as a red flag for your own decision-making, not as “fine print you can ignore.”</p>

<h2>When it can still make sense</h2>
<p>Emergency calls, a timed exam upload, or a one-off need when you will top up the same day can justify a small loan. Write the fee down. If the fee is more than you would pay for a short walk to buy a card or a friend’s share of data, skip it.</p>

<h2>What to avoid</h2>
<ul>
<li>Stacking loans because yesterday’s loan ate today’s top-up</li>
<li>Any third-party “loan app” that asks for SMS permission and contacts before showing a clear offer</li>
<li>Messages that claim a bank or network “refund” if you dial a strange code</li>
</ul>

<h2>A simple habit</h2>
<p>Once a week, check your airtime/data auto-loan settings in the official network app or USSD menu. Turn off auto-borrow if you keep accepting by mistake. Educational only — not financial advice.</p>',
  'money',
  NULL,
  5,
  0,
  0,
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
  status = 'published',
  updated_at = datetime('now');

INSERT INTO articles (
  id, slug, title, summary, content, category, image_url, reading_minutes,
  views, is_featured, status, author_team, source_name,
  published_at, created_at, updated_at
) VALUES (
  'art_whatsapp_status_sales_2026',
  'selling-with-whatsapp-status-without-looking-desperate',
  'Selling with WhatsApp status without looking desperate',
  'A calm way for students and small sellers to use status updates: proof, clear prices, and no spam — without promising overnight sales.',
  '<p>WhatsApp status is free attention from people who already saved your number. That does not mean every viewer is a buyer. Treat status like a shop window on a quiet street: tidy, honest, and open at hours you can actually reply.</p>

<h2>What works better than “DM for price”</h2>
<p>Post one clear offer: product or service, price range, location or delivery note, and how to order. Example: “A4 colour print — ₦X per page, campus pickup after 4pm. Reply with page count.” Vague hype (“luxury deals only serious buyers”) wastes the 24-hour window.</p>

<h2>Proof without theatrics</h2>
<p>One photo of finished work beats five filtered lifestyle shots. If you design flyers, show the flyer. If you tutor, show a short note of topics you cover — not a fake “testimonial” from an account with no face and three followers.</p>

<h2>Reply rules</h2>
<ul>
<li>Answer price questions with the same numbers you posted</li>
<li>Do not move payment to a stranger’s account “because my bank is down”</li>
<li>Stop status blasts every hour; two thoughtful posts a day beat twenty identical ones</li>
</ul>

<h2>Scam side</h2>
<p>Anyone who demands “activation” money before they buy from you is not a customer. Anyone who asks you to receive money for a third party is using you as a mule. Educational only — not financial advice.</p>',
  'guides',
  NULL,
  5,
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
  'art_pos_agent_questions_2026',
  'pos-agent-questions-to-ask-before-you-pay-for-a-slot',
  'POS agent: questions to ask before you pay for a “slot”',
  'Before you hand anyone money for a POS machine or “guaranteed location,” walk through these questions so the offer stays a business decision, not a hope purchase.',
  '<p>POS can be a real small business. It can also be a sales pitch dressed as a franchise. The difference shows up in paperwork, fees, and who controls the account.</p>

<h2>Questions that deserve clear answers</h2>
<ul>
<li>Who is the licensed operator or bank partner on the device?</li>
<li>What exact fees come out of every transaction — and who sets them?</li>
<li>Is the machine tied to an account in your name, or someone else’s?</li>
<li>What happens if the machine fails in week two — repair, swap, or “no refund”?</li>
<li>Are you paying for equipment, training, a location, or all three?</li>
</ul>

<h2>Red flags</h2>
<p>Pressure to pay the same day. Promises of a fixed daily income. Refusal to put fees in writing. Requests to use your BVN for a device you will not control. “Agents” who only operate on Telegram and never show a physical office or registered business trail.</p>

<h2>A safer sequence</h2>
<p>Talk to two people already running POS in your area — not the person selling you the slot. Compare their fee stories. Visit a real shop if one is claimed. Only then decide. Educational only — not financial advice. POS income is not guaranteed.</p>',
  'scams',
  NULL,
  5,
  0,
  0,
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
  status = 'published',
  updated_at = datetime('now');
