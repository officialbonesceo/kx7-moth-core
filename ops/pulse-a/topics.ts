/** Topic-specific long-form bodies for LaneCash seeds */

export type TopicBody = {
  title: string;
  summary: string;
  category: 'money' | 'opportunities' | 'scams' | 'guides' | 'news';
  author_team: string;
  content: string;
};

const bodies: Record<string, TopicBody> = {
  'wallet-compare': {
    title: 'Opay vs Moniepoint vs Kuda for small business payouts: practical comparison',
    summary: 'Operator-style comparison of Opay, Moniepoint and Kuda for receiving customer payments, settling suppliers, and controlling fees in Nigeria.',
    category: 'money',
    author_team: 'LaneCash Fin Team',
    content: `
<h2>What this really is</h2>
<p>Choosing between <a href="https://www.opayweb.com/" target="_blank" rel="noopener noreferrer">Opay</a>, <a href="https://moniepoint.com/" target="_blank" rel="noopener noreferrer">Moniepoint</a> and <a href="https://www.kuda.com/" target="_blank" rel="noopener noreferrer">Kuda</a> is not about which logo looks nicer. It is about how money lands in your account, how fast you can move it, what fees remain after a busy day, and how often support actually solves problems.</p>
<p>For small business payouts, the product is settlement reliability: customers pay you, you pay suppliers, and your books still make sense at night.</p>

<h2>Why it matters in Nigeria</h2>
<p>Cash is still common, but more customers want transfers. Delayed settlements, failed transfers, and surprise charges destroy thin margins. A tailor, POS agent, phone accessory seller, or freelancers collecting project fees all feel the same pain: one bad payout tool can waste an afternoon.</p>

<h2>How it works in practice</h2>
<p><strong>Opay</strong> is widely used for everyday transfers and agent-style activity. Many people already have it, so customer friction can be lower when you ask them to pay.</p>
<p><strong>Moniepoint</strong> is strongly associated with business/agent banking workflows. If your model involves higher transfer volume or POS-linked activity, operators often evaluate Moniepoint for throughput and business tooling.</p>
<p><strong>Kuda</strong> is often chosen as a cleaner digital bank experience for personal-to-business hybrid use — receiving transfers, segregating hustle money, and spending with clearer app controls.</p>
<p>In practice, many serious operators do not pick only one forever. They pick a <em>primary receive wallet</em> and a <em>backup</em> so one outage does not stop sales.</p>

<h2>Costs and realistic earnings</h2>
<p>Earnings here are not from the wallet itself — wallets are rails. Your money comes from the business. The wallet only protects or leaks margin through fees, failed transfers, and time wasted.</p>
<ul>
<li>Track fee per ₦100,000 moved for one full week.</li>
<li>Track failed transfers and time-to-resolve.</li>
<li>Track how often customers complain that "transfer is not reflecting".</li>
</ul>
<p>If two tools move the same volume, the better one is the one with fewer disputes and less manual reconciliation — not the one with more app animations.</p>

<h2>Risks and common scams</h2>
<ul>
<li>Fake support agents on WhatsApp/Telegram asking for OTP.</li>
<li>Phishing sites that look like Opay/Moniepoint/Kuda login pages.</li>
<li>"Agent upgrade" payments to strangers.</li>
<li>Sharing screen-control apps with anyone who claims they can reverse a transfer.</li>
</ul>
<p>Only use official app stores/sites. Never send money to "unlock" inbound transfers.</p>

<h2>Exact steps for this week</h2>
<ol>
<li>List your top 3 payment flows (customer → you, you → supplier, you → self savings).</li>
<li>Put Opay, Moniepoint, and Kuda side by side for those flows only.</li>
<li>Run 10 real small test transfers on your primary pick.</li>
<li>Record fee, speed, and any failure.</li>
<li>Choose primary + backup. Tell customers one payment instruction only.</li>
<li>Separate hustle balance from food money to avoid accidental spending.</li>
</ol>

<h2>What good looks like in 7 and 30 days</h2>
<p><strong>7 days:</strong> one clear payment instruction for customers, a backup wallet tested, and a simple note of fees.</p>
<p><strong>30 days:</strong> fewer "has it reflected?" chats, stable reconciliation, and you can explain why your primary wallet won with numbers — not vibes.</p>

<h2>Final checklist</h2>
<ul>
<li>Do I know my fee per volume?</li>
<li>Do I have a backup rail?</li>
<li>Is customer payment instruction one line only?</li>
<li>Are OTPs and app locks protected?</li>
<li>Can I reconcile yesterday’s inflow in under 15 minutes?</li>
</ul>
`.trim(),
  },

  'usdt-from-zero': {
    title: 'USDT from zero in Nigeria: buy, store, send, fees, and scams',
    summary: 'A practical beginner path for understanding USDT in Nigeria — what it is, how people use it, fees, storage basics, and the scam patterns to reject.',
    category: 'opportunities',
    author_team: 'LaneCash Crypto Desk',
    content: `
<h2>What this really is</h2>
<p>USDT (Tether) is a stablecoin designed to track the US dollar. People use it as a digital dollar-like unit for transfers, trading pairs, and holding value when they do not want naira volatility — not as a guaranteed investment product.</p>
<p>From zero means: understand the asset, the wallet, the network fees, and the exit path before you size up.</p>

<h2>Why it matters in Nigeria</h2>
<p>Naira swings and payment friction push people toward dollar-linked tools. USDT shows up in freelancing, online trade, and peer transfers. Without basics, beginners confuse USDT with "daily profit apps" and get drained.</p>

<h2>How it works in practice</h2>
<ol>
<li>You buy USDT on a platform or from a person.</li>
<li>You store it in a wallet you control (or leave it on an exchange — higher platform risk).</li>
<li>You send USDT on a specific network (TRC20, ERC20, etc.). Wrong network can mean loss.</li>
<li>Fees differ by network and route.</li>
<li>To return to naira, you sell through a platform or trusted channel and receive bank/wallet money.</li>
</ol>
<p>If you cannot explain network + fee + exit, you are not ready to move size.</p>

<h2>Costs and realistic earnings</h2>
<p>USDT itself does not "pay you daily." Any yield claim needs separate scrutiny and is often a scam wrapper.</p>
<ul>
<li>Spread cost when buying/selling.</li>
<li>Network fee when sending.</li>
<li>Platform withdrawal fees.</li>
</ul>
<p>Realistic beginner goal for week one is not profit — it is a successful tiny round trip: buy small → send small test → receive → document fees.</p>

<h2>Risks and common scams</h2>
<ul>
<li>Investment apps promising fixed daily USDT returns.</li>
<li>Fake wallet support asking for seed phrases.</li>
<li>Wrong-network transfers.</li>
<li>OTC deals with no verifiable reputation.</li>
<li>Recovery scammers after you already lost money.</li>
</ul>
<p>Never share seed phrases. Never pay to release funds. If returns are guaranteed, assume danger.</p>

<h2>Exact steps for this week</h2>
<ol>
<li>Write definitions in your note app: USDT, wallet, network, fee, seed phrase.</li>
<li>Create a wallet from an official source only.</li>
<li>Backup seed offline — no screenshots in gallery if possible.</li>
<li>Move a tiny test amount only.</li>
<li>Record every fee.</li>
<li>Ignore any stranger DM offering managed USDT profit.</li>
</ol>

<h2>What good looks like in 7 and 30 days</h2>
<p><strong>7 days:</strong> you can explain USDT without copying Telegram hype, and you completed one tiny test transfer safely.</p>
<p><strong>30 days:</strong> you have a repeatable buy/hold/send/sell path with written fees and zero seed-phrase exposure incidents.</p>

<h2>Final checklist</h2>
<ul>
<li>Do I understand network selection?</li>
<li>Can I restore my wallet from backup?</li>
<li>Have I rejected guaranteed-return offers?</li>
<li>Is my first test amount money I can lose while learning?</li>
</ul>
`.trim(),
  },

  'pos-real': {
    title: 'POS / agent banking in Nigeria: real costs, daily volume, and hidden charges',
    summary: 'An honest breakdown of POS and agent banking economics — float, charges, downtime, and what sustainable daily volume looks like.',
    category: 'money',
    author_team: 'LaneCash Fin Team',
    content: `
<h2>What this really is</h2>
<p>POS/agent banking is a cash-in/cash-out and transfer service business. You provide liquidity and service; the platform provides rails. You earn from commissions and charges, not from magic turnover screenshots.</p>

<h2>Why it matters in Nigeria</h2>
<p>Many communities still need cash access and assisted transfers. Demand is real — but competition, float pressure, and failed transactions are also real. People enter after seeing highlight-reel daily totals and exit after meeting hidden costs.</p>

<h2>How it works in practice</h2>
<ul>
<li>You maintain float (cash and/or wallet balance).</li>
<li>Customers come for withdrawals, transfers, bill payments, or deposits.</li>
<li>You charge a service fee within what the market accepts.</li>
<li>Network downtime and reverse cases eat time and sometimes money.</li>
</ul>
<p>Location, trust, and uptime matter more than branding stickers.</p>

<h2>Costs and realistic earnings</h2>
<p>Typical cost buckets:</p>
<ul>
<li>Device / account setup costs.</li>
<li>Float capital stuck in the business.</li>
<li>Data, transport, security.</li>
<li>Chargebacks/failed txn disputes.</li>
</ul>
<p>Revenue depends on traffic and fee discipline. A quiet location can mean long breaks between customers. A busy location can mean float stress. Track naira earned per hour present — not only gross daily volume.</p>

<h2>Risks and common scams</h2>
<ul>
<li>Fake aggregator agents collecting setup fees.</li>
<li>Customers running transfer-scam social engineering.</li>
<li>Robbery risk with visible cash.</li>
<li>Over-promising employers of "guaranteed POS profit slots."</li>
</ul>

<h2>Exact steps for this week</h2>
<ol>
<li>Write expected setup cost and float you can actually lock.</li>
<li>Observe a real agent location for half a day (volume pattern).</li>
<li>List fees customers tolerate in that area.</li>
<li>Model break-even: fixed costs ÷ net fee per txn.</li>
<li>If numbers only work on fantasy traffic, do not buy equipment yet.</li>
</ol>

<h2>What good looks like in 7 and 30 days</h2>
<p><strong>7 days:</strong> a written cost model and observed demand notes.</p>
<p><strong>30 days:</strong> either a controlled pilot with tracked net profit, or a clear decision to avoid the business based on evidence.</p>

<h2>Final checklist</h2>
<ul>
<li>Do I know float requirement?</li>
<li>Do I know net fee after platform charges?</li>
<li>Is security planned?</li>
<li>Am I underwriting demand with observation, not Instagram?</li>
</ul>
`.trim(),
  },

  'phone-freelance': {
    title: 'Phone-only freelancing: offer, pricing, client scripts, and first ₦ payment',
    summary: 'How to sell a simple service from your phone — narrow offer, clear price, outreach scripts, and getting the first real payment.',
    category: 'guides',
    author_team: 'LaneCash Hustle Desk',
    content: `
<h2>What this really is</h2>
<p>Phone-only freelancing means packaging a skill into a paid service and closing clients with the device you already have. It is sales + delivery, not posting motivational statuses.</p>

<h2>Why it matters in Nigeria</h2>
<p>Capital is limited for many people. A phone, data, and a specific skill (editing, design basics, tutoring, research, page setup, product listing help) can start faster than inventory businesses — if the offer is narrow.</p>

<h2>How it works in practice</h2>
<ol>
<li>Pick one outcome you can deliver in 24–72 hours.</li>
<li>Price it in a fixed package (not endless "make me something nice").</li>
<li>Show a sample.</li>
<li>Message people who already need that outcome.</li>
<li>Deliver, collect, request referral.</li>
</ol>
<p>Tools that help: <a href="https://www.canva.com/" target="_blank" rel="noopener noreferrer">Canva</a>, <a href="https://www.capcut.com/" target="_blank" rel="noopener noreferrer">CapCut</a>, WhatsApp, and a reliable receive wallet.</p>

<h2>Costs and realistic earnings</h2>
<ul>
<li>Data and possible platform fees.</li>
<li>Time per delivery.</li>
</ul>
<p>Early pricing often starts modest to collect proof, then rises. ₦3,000–₦10,000/week is possible only after repeated paid tasks — not after one post.</p>

<h2>Risks and common scams</h2>
<ul>
<li>Clients asking for free test work forever.</li>
<li>Payment-after-impossible-scope traps.</li>
<li>Fake remote job offers requesting registration fees.</li>
</ul>

<h2>Exact steps for this week</h2>
<ol>
<li>Write offer in one sentence: "I help X get Y in Z days for ₦N."</li>
<li>Make one sample with Canva/CapCut.</li>
<li>Message 15 real prospects with a short script.</li>
<li>Follow up once.</li>
<li>Close 1 paid mini package.</li>
<li>Ask for referral after delivery.</li>
</ol>

<h2>What good looks like in 7 and 30 days</h2>
<p><strong>7 days:</strong> offer + sample + outreach log + at least conversations started.</p>
<p><strong>30 days:</strong> multiple paid deliveries and a price that reflects proof.</p>

<h2>Final checklist</h2>
<ul>
<li>Is my offer specific?</li>
<li>Is price fixed?</li>
<li>Do I have a sample?</li>
<li>Am I talking to people with the problem daily?</li>
</ul>
`.trim(),
  },

  'fake-invest-apps': {
    title: 'Fake investment apps targeting Nigerians: how the trap works and how to walk away',
    summary: 'How fake investment apps manufacture trust, the deposit ladder trap, and the exact exit rules that protect your money.',
    category: 'scams',
    author_team: 'LaneCash Scam Team',
    content: `
<h2>What this really is</h2>
<p>Fake investment apps are engineered trust machines. They show rising balances, staged withdrawals, and community screenshots to push bigger deposits. The product is not investing — it is extraction.</p>

<h2>Why it matters in Nigeria</h2>
<p>High pressure for income makes guaranteed daily returns psychologically attractive. Scammers exploit that with polished apps, fake support, and referral bonuses.</p>

<h2>How it works in practice</h2>
<ol>
<li>You are invited by a friend or ad.</li>
<li>Small deposit seems to "grow".</li>
<li>Small withdrawal sometimes works (bait).</li>
<li>Larger deposit is encouraged.</li>
<li>Withdrawal then needs tax/fee/upgrade payment.</li>
<li>Support blames you; app eventually dies.</li>
</ol>

<h2>Costs and realistic earnings</h2>
<p>Realistic earnings from fake apps: negative. The only winning move is not playing. Any educational "earning" here is the money you did <em>not</em> lose.</p>

<h2>Risks and common scams</h2>
<ul>
<li>Guaranteed daily percentage returns.</li>
<li>Withdrawal fees that must be paid first.</li>
<li>VIP upgrade ladders.</li>
<li>Recovery agents who demand more money after the loss.</li>
</ul>

<h2>Exact steps for this week</h2>
<ol>
<li>Uninstall any app promising fixed daily profit.</li>
<li>Warn the person who referred you with facts, not insults.</li>
<li>Enable 2FA on real email/bank/wallets.</li>
<li>Write your personal rule: no guaranteed-return apps, ever.</li>
<li>If already trapped mid-withdrawal-fee demand, stop sending money.</li>
</ol>

<h2>What good looks like in 7 and 30 days</h2>
<p><strong>7 days:</strong> zero active scam apps, written personal rule, contacts warned.</p>
<p><strong>30 days:</strong> no new "investment" DMs accepted without verification, and savings redirected to controlled goals.</p>

<h2>Final checklist</h2>
<ul>
<li>Does it guarantee returns?</li>
<li>Does withdrawal require extra deposits?</li>
<li>Is support only in private chat groups?</li>
<li>Would a regulated institution operate like this?</li>
</ul>
`.trim(),
  },

  'crypto-reality': {
    title: 'Small-capital crypto in Nigeria: what is possible vs fantasy',
    summary: 'Separates learning, careful speculation, and scam fantasy so beginners with small capital do not confuse them.',
    category: 'opportunities',
    author_team: 'LaneCash Crypto Desk',
    content: `
<h2>What this really is</h2>
<p>Small-capital crypto is mostly an education and risk-management problem first. Buying a little bitcoin or USDT to learn is different from joining a profit telegram. Fantasy products blur that line on purpose.</p>

<h2>Why it matters in Nigeria</h2>
<p>Crypto is visible in payments, freelancing, and speculation talk. Without categories, beginners put rent money into stories.</p>

<h2>How it works in practice</h2>
<ul>
<li><strong>Learning mode:</strong> tiny size, written notes, no leverage.</li>
<li><strong>Speculation mode:</strong> money you can lose, thesis written, exit rule set.</li>
<li><strong>Scam mode:</strong> guaranteed yield, deposit ladders, locked withdrawals.</li>
</ul>

<h2>Costs and realistic earnings</h2>
<p>Possible: skill, network understanding, occasional speculative gains and losses. Not possible as a promise: stable daily income from an unknown app with small capital.</p>

<h2>Risks and common scams</h2>
<ul>
<li>Signal groups selling certainty.</li>
<li>Airdrop fee traps.</li>
<li>Impersonator support.</li>
<li>Leverage liquidations for beginners.</li>
</ul>

<h2>Exact steps for this week</h2>
<ol>
<li>Label your activity: learn or speculate — not both mixed with rent money.</li>
<li>Cap total exposure to a loss-acceptable amount.</li>
<li>Use official platforms only.</li>
<li>Disable DMs from strangers selling trades.</li>
<li>Journal every move and fee.</li>
</ol>

<h2>What good looks like in 7 and 30 days</h2>
<p><strong>7 days:</strong> clear mode label and loss cap.</p>
<p><strong>30 days:</strong> no scam deposits, notes you can re-read, and decisions slower than Telegram urgency.</p>

<h2>Final checklist</h2>
<ul>
<li>Is this learning or speculation?</li>
<li>Is the size survivable if it goes to zero?</li>
<li>Is any return "guaranteed"? If yes, exit.</li>
</ul>
`.trim(),
  },

  'earn-little-weekly': {
    title: 'How to earn ₦3,000–₦10,000/week with under ₦5,000 capital in Nigeria',
    summary: 'A realistic plan for low-capital weekly income using service offers, proof, outreach, and strict cost control — without fantasy apps.',
    category: 'guides',
    author_team: 'LaneCash Hustle Desk',
    content: `
<h2>What this really is</h2>
<p>This target is about selling a small service repeatedly. Capital under ₦5,000 usually means data, basic tools, transport, and samples — not inventory empires or investment schemes.</p>

<h2>Why it matters in Nigeria</h2>
<p>Many people need cashflow improvements without loans. The constraint is not only ideas — it is distribution and consistency.</p>

<h2>How it works in practice</h2>
<p>Pick one service: phone video edit, flyer design, tutorial help, form filling assistance, product photo cleanup, or page setup help. Make a sample with <a href="https://www.capcut.com/" target="_blank" rel="noopener noreferrer">CapCut</a> or <a href="https://www.canva.com/" target="_blank" rel="noopener noreferrer">Canva</a>. Sell to people already close to the problem.</p>

<h2>Costs and realistic earnings</h2>
<ul>
<li>Data and possible tool subscriptions later.</li>
<li>Time per job.</li>
</ul>
<p>₦3,000–₦10,000/week implies multiple completed paid tasks. Week one may be below target while proof is weak. That is normal.</p>

<h2>Risks and common scams</h2>
<ul>
<li>"Online job" registration fees.</li>
<li>Clients who never pay.</li>
<li>Apps promising the target without work.</li>
</ul>

<h2>Exact steps for this week</h2>
<ol>
<li>Choose one service outcome.</li>
<li>Set a fixed starter price.</li>
<li>Create one sample.</li>
<li>Contact 20 people with a short message.</li>
<li>Deliver fast on the first yes.</li>
<li>Ask for referral the same day.</li>
</ol>

<h2>What good looks like in 7 and 30 days</h2>
<p><strong>7 days:</strong> sample + outreach log + first paid job or near-miss learnings.</p>
<p><strong>30 days:</strong> repeat jobs and a higher price justified by proof.</p>

<h2>Final checklist</h2>
<ul>
<li>One offer only?</li>
<li>Fixed price?</li>
<li>Daily outreach done?</li>
<li>No fee-to-work scams?</li>
</ul>
`.trim(),
  },
};

export function topicFromLink(link: string): TopicBody | null {
  for (const [key, body] of Object.entries(bodies)) {
    if (link.includes(key)) return body;
  }
  return null;
}

export function allTopicBodies() {
  return Object.values(bodies);
}
