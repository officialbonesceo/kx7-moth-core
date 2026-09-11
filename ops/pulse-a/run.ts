/**
 * pulse-a — LaneCash deep content engine
 * Uses topic-specific bodies (not generic templates)
 */

import { topicFromLink, allTopicBodies } from './topics';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const CF_D1_DATABASE_ID = process.env.CF_D1_DATABASE_ID || '';

const CATEGORIES = ['money', 'opportunities', 'scams', 'guides', 'news'] as const;
type Category = (typeof CATEGORIES)[number];

interface FeedItem {
  title: string;
  link: string;
  summary: string;
  source: string;
  score: number;
  kind?: 'seed' | 'news';
}

interface ArticleDraft {
  title: string;
  summary: string;
  content: string;
  category: Category;
  reading_minutes: number;
  source_name?: string;
  source_url?: string;
  image_url?: string;
  author_team?: string;
}

const FEEDS = [
  { name: 'Nairametrics', url: 'https://nairametrics.com/feed/', weight: 3 },
  { name: 'BusinessDay', url: 'https://businessday.ng/feed/', weight: 3 },
];

const TOPIC_SEEDS: FeedItem[] = [
  { title: 'How to earn ₦3,000–₦10,000/week with under ₦5,000 capital in Nigeria', link: 'https://lanecash.local/seed/earn-little-weekly', summary: 'Realistic low-capital weekly income paths.', source: 'LaneCash Desk', score: 40, kind: 'seed' },
  { title: 'USDT from zero in Nigeria: buy, store, send, fees, and scams', link: 'https://lanecash.local/seed/usdt-from-zero', summary: 'Beginner USDT path with risk controls.', source: 'LaneCash Desk', score: 40, kind: 'seed' },
  { title: 'POS / agent banking in Nigeria: real costs, daily volume, and hidden charges', link: 'https://lanecash.local/seed/pos-real', summary: 'Honest POS economics.', source: 'LaneCash Desk', score: 38, kind: 'seed' },
  { title: 'Phone-only freelancing: offer, pricing, client scripts, and first ₦ payment', link: 'https://lanecash.local/seed/phone-freelance', summary: 'Sell a service from your phone.', source: 'LaneCash Desk', score: 38, kind: 'seed' },
  { title: 'Fake investment apps targeting Nigerians: how the trap works and how to walk away', link: 'https://lanecash.local/seed/fake-invest-apps', summary: 'Scam app patterns and exit rules.', source: 'LaneCash Desk', score: 39, kind: 'seed' },
  { title: 'Opay vs Moniepoint vs Kuda for small business payouts: practical comparison', link: 'https://lanecash.local/seed/wallet-compare', summary: 'Operator comparison for payouts.', source: 'LaneCash Desk', score: 37, kind: 'seed' },
  { title: 'Small-capital crypto in Nigeria: what is possible vs fantasy', link: 'https://lanecash.local/seed/crypto-reality', summary: 'Learning vs speculation vs scams.', source: 'LaneCash Desk', score: 39, kind: 'seed' },
];

const STRONG = ['naira','cbn','fintech','bank','loan','inflation','investment','funding','paystack','flutterwave','opay','moniepoint','kuda','pos','payment','hustle','freelance','scam','ponzi','crypto','bitcoin','usdt','stablecoin','trading','salary','budget','tax','wallet'];
const BLOCK = ['iphone','galaxy','foldable','specs','release date','football','super eagles','nollywood','celebrity','album','table of contents'];

const PRODUCT_LINKS: Record<string, string> = {
  capcut: 'https://www.capcut.com/', canva: 'https://www.canva.com/', paystack: 'https://paystack.com/', flutterwave: 'https://flutterwave.com/',
  opay: 'https://www.opayweb.com/', moniepoint: 'https://moniepoint.com/', kuda: 'https://www.kuda.com/', binance: 'https://www.binance.com/',
  fiverr: 'https://www.fiverr.com/', upwork: 'https://www.upwork.com/',
};

const SYSTEM = `You are a senior practical finance editor for LaneCash (Nigeria-focused).
Write IN-DEPTH articles specific to the given title. Never use generic filler like "is not a magic income switch" for unrelated topics.
Must cover: what it really is, why it matters in Nigeria, how it works, costs/realistic ranges, risks/scams, exact steps this week, 7 and 30 day outcomes, final checklist.
No get-rich-quick. Realistic naira ranges. Tools as HTML links.
Return ONLY JSON: title, summary, content, category, reading_minutes
category: money|opportunities|scams|guides|news
content tags: h2,p,ul,li,ol,a only`;

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80);
}
function stripTags(h: string) { return h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function decodeBasic(t: string) {
  return t.replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '').replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"').replace(/&#39;/g, "'");
}
function scoreItem(title: string, summary: string, w: number) {
  const text = `${title} ${summary}`.toLowerCase();
  if (BLOCK.some((k) => text.includes(k))) return -100;
  let s = w, strong = 0;
  for (const k of STRONG) if (text.includes(k)) { s += 3; strong++; }
  return strong ? s : -1;
}
function injectLinks(content: string) {
  let out = content;
  for (const [name, url] of Object.entries(PRODUCT_LINKS)) {
    if (out.toLowerCase().includes(url.toLowerCase())) continue;
    out = out.replace(new RegExp(`\\b(${name})\\b`, 'ig'), (m) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${m}</a>`);
  }
  return out;
}
function ensureSource(content: string, name: string, url: string) {
  if (!url || url.includes('lanecash.local') || content.includes(url)) return content;
  return `${content}\n\n<h2>Source</h2>\n<p>Context adapted from reporting by <a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>.</p>`;
}
function imageFor(title: string, category: string) {
  const t = `${title} ${category}`.toLowerCase();
  let scene = 'dark fintech abstract green neon charts money symbols, no people, no faces';
  if (/scam|fraud|ponzi|fake/.test(t)) scene = 'dark cybersecurity red warning triangle lock shield abstract, no people';
  else if (/usdt|tether|stablecoin/.test(t)) scene = 'dark USDT tether stablecoin green glow abstract crypto chart, no people';
  else if (/bitcoin|crypto|token|blockchain|defi/.test(t)) scene = 'dark bitcoin crypto coin stack green neon chart abstract, no people';
  else if (/pos|moniepoint|opay|kuda|wallet|payment/.test(t)) scene = 'dark mobile payment fintech wallet naira abstract green UI, no people';
  else if (/hustle|freelance|earn|side|capital|daily/.test(t)) scene = 'dark desk laptop notebook growth chart green accent, no face';
  const seed = Math.abs([...title].reduce((a, c) => a + c.charCodeAt(0), 0) % 99999);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(scene)}?width=1200&height=675&nologo=true&seed=${seed}`;
}
function hasRequiredDepth(content: string) {
  const c = content.toLowerCase();
  if (content.length < 1800) return false;
  if (c.includes('is not a magic income switch') && c.includes('most real paths have four parts')) return false;
  const needed = ['what this really is', 'why it matters', 'how it works', 'cost', 'risk', 'this week', 'checklist'];
  return needed.filter((k) => c.includes(k)).length >= 5;
}
function parseDraft(raw: string) {
  try {
    let c = String(raw || '').replace(/```json/gi, '').replace(/```/g, '').trim();
    const a = c.indexOf('{'), b = c.lastIndexOf('}');
    if (a !== -1 && b !== -1) c = c.slice(a, b + 1);
    c = c.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
    const obj = JSON.parse(c);
    if (!obj.title || !obj.content) return null;
    if (!hasRequiredDepth(String(obj.content))) return null;
    const category = CATEGORIES.includes(obj.category) ? obj.category : 'guides';
    return {
      title: String(obj.title).trim(),
      summary: String(obj.summary || '').trim(),
      content: String(obj.content).trim(),
      category: category as Category,
      reading_minutes: Math.max(8, Number(obj.reading_minutes) || 10),
    };
  } catch { return null; }
}

function deepLocal(item: FeedItem): ArticleDraft {
  const specific = topicFromLink(item.link);
  if (specific) {
    return {
      title: specific.title,
      summary: specific.summary,
      content: injectLinks(specific.content),
      category: specific.category,
      reading_minutes: 12,
      author_team: specific.author_team,
      source_name: 'LaneCash Desk',
      source_url: undefined,
      image_url: imageFor(specific.title, specific.category),
    };
  }
  // news fallback — still topic-tied, not the old universal filler
  const t = `${item.title} ${item.summary}`;
  let category: Category = 'news';
  if (/scam|fraud|ponzi/i.test(t)) category = 'scams';
  else if (/crypto|usdt|bitcoin/i.test(t)) category = 'opportunities';
  else if (/hustle|freelance|earn/i.test(t)) category = 'guides';
  else if (/bank|naira|loan|pos|payment/i.test(t)) category = 'money';

  const content = injectLinks(`
<h2>What this really is</h2>
<p>${item.title}. ${item.summary || ''}</p>
<p>This update is treated as a money decision input — not entertainment news. The goal is to understand what changed and what a careful person should do next.</p>
<h2>Why it matters in Nigeria</h2>
<p>Local cashflow, fees, trust, and access conditions decide whether a headline becomes useful action or noise.</p>
<h2>How it works in practice</h2>
<p>Read the underlying mechanism: who pays, who gets paid, what fee appears, and what breaks if settlement is delayed.</p>
<h2>Costs and realistic earnings</h2>
<p>Do not invent profits from a headline. List actual costs you would face if you acted on it today (fees, data, time, capital lock-up).</p>
<h2>Risks and common scams</h2>
<p>Headline moments attract fake support agents, clone apps, and "limited slot" offers. Verify official channels only.</p>
<h2>Exact steps for this week</h2>
<ol>
<li>Write the claim in one sentence.</li>
<li>List what must be true for the claim to affect your money.</li>
<li>Check one primary source.</li>
<li>If acting, start with a tiny reversible step.</li>
<li>Record fee and outcome.</li>
</ol>
<h2>What good looks like in 7 and 30 days</h2>
<p><strong>7 days:</strong> clarity notes and no impulsive deposits.</p>
<p><strong>30 days:</strong> any action taken is still explainable with numbers.</p>
<h2>Final checklist</h2>
<ul>
<li>Source verified?</li>
<li>Downside written?</li>
<li>No guaranteed-return side offers attached?</li>
</ul>
${item.link.includes('lanecash.local') ? '' : `<h2>Source</h2><p><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.source}</a></p>`}
`.trim());

  return {
    title: item.title,
    summary: item.summary || item.title,
    content,
    category,
    reading_minutes: 9,
    author_team: category === 'scams' ? 'LaneCash Scam Team' : category === 'opportunities' ? 'LaneCash Crypto Desk' : 'LaneCash Fin Team',
    source_name: item.source,
    source_url: item.link.includes('lanecash.local') ? undefined : item.link,
    image_url: imageFor(item.title, category),
  };
}

async function d1(sql: string, params: any[] = []) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${CF_API_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql, params }),
  });
  const text = await res.text();
  if (!res.ok) { console.error('[pulse-a] D1', res.status, text); return null; }
  try { return JSON.parse(text); } catch { return { ok: true }; }
}

async function purgeGenericFiller() {
  // remove old universal template posts
  await d1(`DELETE FROM articles WHERE content LIKE ?`, ['%is not a magic income switch%']);
  console.log('[pulse-a] purged generic filler articles');
}

async function exists(link: string, title: string) {
  const data = await d1(`SELECT id FROM articles WHERE source_url = ? OR title = ? LIMIT 1`, [link, title]);
  const rows = data?.result?.[0]?.results || data?.results || [];
  return Array.isArray(rows) && rows.length > 0;
}

async function publish(draft: ArticleDraft) {
  const id = 'a_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const slug = `${slugify(draft.title) || 'article'}-${id.slice(-5)}`;
  // try with author_team, fallback without
  let data = await d1(
    `INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, status, author_team, source_name, source_url, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, datetime('now'), datetime('now'), datetime('now'))`,
    [id, slug, draft.title, draft.summary, draft.content, draft.category, draft.image_url || null, draft.reading_minutes, draft.author_team || 'LaneCash Fin Team', draft.source_name || null, draft.source_url || null]
  );
  if (!data) {
    data = await d1(
      `INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, status, source_name, source_url, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, datetime('now'), datetime('now'), datetime('now'))`,
      [id, slug, draft.title, draft.summary, draft.content, draft.category, draft.image_url || null, draft.reading_minutes, draft.source_name || null, draft.source_url || null]
    );
  }
  if (!data) { console.error('[pulse-a] publish failed'); process.exit(1); }
  console.log(`[pulse-a] published: ${draft.title} → /article/${slug}`);
}

async function republishAllTopics() {
  console.log('[pulse-a] republishing topic library');
  for (const body of allTopicBodies()) {
    if (await exists('https://lanecash.local/seed/' + body.title, body.title)) {
      // force refresh by deleting same title then insert
      await d1(`DELETE FROM articles WHERE title = ?`, [body.title]);
    }
    await publish({
      title: body.title,
      summary: body.summary,
      content: injectLinks(body.content),
      category: body.category,
      reading_minutes: 12,
      author_team: body.author_team,
      source_name: 'LaneCash Desk',
      image_url: imageFor(body.title, body.category),
    });
  }
}

async function fetchFeeds(): Promise<FeedItem[]> {
  const all: FeedItem[] = [];
  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 LaneCashBot/2.2', Accept: 'application/rss+xml, application/xml, text/xml, */*' },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) continue;
      const xml = await res.text();
      for (const part of xml.split(/<item[\s>]/i).slice(1, 8)) {
        const title = stripTags(decodeBasic((part.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').trim()));
        const link = stripTags(decodeBasic((part.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] || '').trim()));
        const description = stripTags(decodeBasic((part.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] || '').trim()));
        if (!title || !link) continue;
        const score = scoreItem(title, description, feed.weight);
        if (score < 5) continue;
        all.push({ title, link, summary: description.slice(0, 260), source: feed.name, score, kind: 'news' });
      }
    } catch (e: any) {
      console.warn(`[pulse-a] ${feed.name}:`, e.message);
    }
  }
  all.push(...TOPIC_SEEDS);
  all.sort((a, b) => b.score - a.score);
  return all;
}

async function generateCF(item: FeedItem) {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) return null;
  // Prefer curated topic body over AI for seed links
  if (item.kind === 'seed' && topicFromLink(item.link)) return deepLocal(item);
  for (const model of ['@cf/meta/llama-3.1-8b-instruct', '@cf/meta/llama-3.2-3b-instruct']) {
    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${model}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${CF_API_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM },
            { role: 'user', content: `TITLE:${item.title}\nSUMMARY:${item.summary}\nSOURCE:${item.source}\nURL:${item.link}\nWrite a SPECIFIC in-depth article about this exact topic only.` },
          ],
          max_tokens: 2200,
          temperature: 0.2,
        }),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as any;
      const parsed = parseDraft(data?.result?.response || '');
      if (!parsed) continue;
      return {
        ...parsed,
        content: injectLinks(ensureSource(parsed.content, item.source, item.link)),
        source_name: item.source,
        source_url: item.link.includes('lanecash.local') ? undefined : item.link,
        image_url: imageFor(parsed.title, parsed.category),
        author_team: parsed.category === 'scams' ? 'LaneCash Scam Team' : parsed.category === 'opportunities' ? 'LaneCash Crypto Desk' : 'LaneCash Fin Team',
      } as ArticleDraft;
    } catch (e: any) {
      console.warn(`[pulse-a] CF ${model}:`, e.message);
    }
  }
  return null;
}

async function main() {
  console.log('[pulse-a] start');
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error('[pulse-a] missing Cloudflare credentials');
    process.exit(1);
  }

  await purgeGenericFiller();

  // Always ensure curated library is present/refreshed once per run batch
  if (process.env.REPUBLISH_TOPICS === '1') {
    await republishAllTopics();
    console.log('[pulse-a] done republish');
    return;
  }

  // Default: refresh missing curated topics, then maybe one news item
  for (const body of allTopicBodies()) {
    const existsAlready = await exists('', body.title);
    if (!existsAlready) {
      await publish({
        title: body.title,
        summary: body.summary,
        content: injectLinks(body.content),
        category: body.category,
        reading_minutes: 12,
        author_team: body.author_team,
        source_name: 'LaneCash Desk',
        image_url: imageFor(body.title, body.category),
      });
    }
  }

  const items = await fetchFeeds();
  for (const item of items.slice(0, 15)) {
    if (item.kind === 'seed') continue; // already handled via topic library
    if (await exists(item.link, item.title)) continue;
    console.log('[pulse-a] news', item.title.slice(0, 70));
    const draft = (await generateCF(item)) || deepLocal(item);
    await publish(draft);
    break;
  }
  console.log('[pulse-a] done');
}

main().catch((e) => { console.error(e); process.exit(1); });
