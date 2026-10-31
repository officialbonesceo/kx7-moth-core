-- LaneCash quality articles 2026-10-31

INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, is_featured, status, author_team, published_at, created_at, updated_at)
VALUES (
  'a_pay_small_small_2026',
  'pay-small-small-loan-traps-on-campus',
  'How to spot "pay small small" loan traps on campus',
  'Campus loan chat scripts that sound friendly until the daily interest and threats start. A calm checklist before you borrow.',
  '<p>On campus, "pay small small" can mean a real instalment plan from a known store — or a chat-based loan that multiplies what you owe. The difference is paperwork, clear rates, and who holds the debt.</p><p>Watch for these traps: the lender only messages on WhatsApp; there is no written schedule you can screenshot from an official app; interest is explained as "just add small every day"; and collection uses threats, public shaming, or access to your contacts.</p><p>Before you borrow: write the full amount you will repay by the last date. If you cannot state that number, do not take the money. Prefer campus cooperatives or family support over anonymous agents.</p><p>If you already borrowed and the amount keeps jumping, stop sending extra "processing" fees. Document messages. Speak to a trusted adult or student affairs office before the situation escalates.</p><p><em>Educational only — not legal or credit advice.</em></p>',
  'scams',
  '/covers/scams.svg',
  6,
  1,
  'published',
  'LaneCash Editorial',
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

INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, is_featured, status, author_team, published_at, created_at, updated_at)
VALUES (
  'a_pos_school_fee_2026',
  'pos-agent-school-fee-scams-send-to-this-account',
  'POS agent and "send to this account" school-fee scams',
  'When someone says the school portal is down and you should pay into a personal account — stop. How to verify fee channels.',
  '<p>School fees belong on the school''s published channels: official portal, named bank accounts on the school site, or a payment partner the school lists in writing. A POS operator or "helper" who asks you to send money to a personal name is not that channel.</p><p>Common script: "Portal is down. Pay into this account and bring the receipt." Sometimes the agent stands near the gate with a machine. Sometimes a classmate forwards an account "from the class rep."</p><p>Protect yourself: open the school website by typing the address yourself. Compare account names. Prefer portal payments that show your matric or application number. If you must use a bank branch, use details printed on the school''s own page — not a chat screenshot alone.</p><p>If money already went to the wrong place, keep the transfer receipt, report to your bank quickly, and notify the school bursary in writing.</p><p><em>Educational only — always confirm fee channels on the school''s official site.</em></p>',
  'scams',
  '/covers/scams.svg',
  5,
  1,
  'published',
  'LaneCash Editorial',
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

INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, is_featured, status, author_team, published_at, created_at, updated_at)
VALUES (
  'a_5k_buffer_2026',
  'build-a-5k-emergency-buffer-without-a-fancy-bank-app',
  'Building a NGN 5k emergency buffer without a fancy bank app',
  'A realistic weekly envelope method for students on tight allowance — no investment promises, just a small cash cushion.',
  '<p>A NGN 5,000 buffer will not solve every emergency, but it can cover a short transport gap, a small repair, or one bad week without borrowing from a risky agent. The goal is a small cushion you do not touch for snacks.</p><p>Simple method: pick one day each week. Move a fixed amount (even NGN 300-500) into a separate place — a different wallet, a sealed envelope, or a savings pocket your bank app already has. Label it "buffer only."</p><p>Rules that help: do not "borrow from buffer" for impulse buys. Refill next week if you had to use it. Track the balance once a week, not every hour.</p><p>This is not an investment product and not a promise of returns. It is a habit for tight allowances. If your income is unstable, start smaller and stay consistent.</p><p><em>Educational only — not financial advice.</em></p>',
  'money',
  '/covers/money.svg',
  7,
  1,
  'published',
  'LaneCash Editorial',
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

INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, is_featured, status, author_team, published_at, created_at, updated_at)
VALUES (
  'a_wa_invest_2026',
  'whatsapp-investment-group-red-flags-for-undergraduates',
  'WhatsApp investment group red flags for undergraduates',
  'Screenshots of profits, pressure to join today, and private account payouts. Red flags for undergrads in investment groups.',
  '<p>WhatsApp "investment" groups often show profit screenshots, short videos of cash, and urgent calls to deposit today. Undergraduates are targeted because small first deposits feel affordable and FOMO is strong in class chats.</p><p>Red flags: guaranteed daily profit; pressure to recruit friends; payouts only after you bring new people; admin who refuses a public company name and CAC check; requests to pay into personal accounts; and "account managers" who move you to private chat quickly.</p><p>Safe response: do not send a test amount "just to see." Screenshot the invite, leave the group, and talk to someone offline. Real regulated products are not run as anonymous broadcast lists.</p><p>If you already sent money, stop further deposits, keep records, and report through your bank''s fraud channel. Avoid "recovery agents" who ask for more fees.</p><p><em>Educational only — not investment advice. Past screenshots are not proof.</em></p>',
  'scams',
  '/covers/scams.svg',
  6,
  1,
  'published',
  'LaneCash Editorial',
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
