/**
 * pulse-a — LaneCash
 * Finance + crypto + daily earn topics
 * Real feeds + topic seeds → AI → images → D1
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || "";
const CF_D1_DATABASE_ID = process.env.CF_D1_DATABASE_ID || "";

const CATEGORIES = ["money", "opportunities", "scams", "guides", "news"] as const;
type Category = (typeof CATEGORIES)[number];

interface FeedItem {
  title: string;
  link: string;
  summary: string;
  source: string;
  score: number;
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
}

const FEEDS = [
  { name: "Nairametrics", url: "https://nairametrics.com/feed/", weight: 3 },
  { name: "BusinessDay", url: "https://businessday.ng/feed/", weight: 3 },
  { name: "Punch Business", url: "https://punchng.com/topics/business/feed/", weight: 2 },
];

// Always available practical topics (crypto + small capital earning)
const TOPIC_SEEDS: FeedItem[] = [
  {
    title: "How to earn with little money daily in Nigeria",
    link: "https://lanecash.local/seed/earn-little-daily",
    summary: "Practical low-capital daily income ideas, realistic expectations, and safety tips.",
    source: "LaneCash Desk",
    score: 20,
  },
  {
    title: "Beginner crypto earning methods that don’t need big capital",
    link: "https://lanecash.local/seed/crypto-small-capital",
    summary: "Simple crypto approaches for beginners: learning, staking basics, caution on risk, and scam avoidance.",
    source: "LaneCash Desk",
    score: 20,
  },
  {
    title: "USDT and stablecoins: what beginners in Nigeria should know",
    link: "https://lanecash.local/seed/usdt-basics",
    summary: "What stablecoins are, why people use them, fees, and common mistakes.",
    source: "LaneCash Desk",
    score: 18,
  },
  {
    title: "Small capital side hustles you can start this week",
    link: "https://lanecash.local/seed/small-capital-hustles",
    summary: "Low-budget hustles, tools, and how to test demand before spending much.",
    source: "LaneCash Desk",
    score: 18,
  },
  {
    title: "How to avoid crypto and investment scams targeting Nigerians",
    link: "https://lanecash.local/seed/crypto-scam-alerts",
    summary: "Red flags, fake platforms, recovery lies, and how to protect your money.",
    source: "LaneCash Desk",
    score: 19,
  },
];

const STRONG_FINANCE = [
  "naira", "exchange rate", "cbn", "fintech", "bank", "loan", "credit", "inflation",
  "investment", "stocks", "funding", "grant", "sme", "paystack", "flutterwave",
  "opay", "moniepoint", "kuda", "pos", "payment", "wallet", "tax", "budget",
  "oil", "salary", "hustle", "side hustle", "freelance", "scam", "ponzi", "fraud",
  "crypto", "bitcoin", "usdt", "ethereum", "blockchain", "trading", "stablecoin",
  "airdrop", "defi", "token", "coin", "binance", "wallet app",
];

const BLOCK = [
  "iphone", "galaxy", "pixel", "smartphone", "foldable", "specs", "release date",
  "camera", "macbook", "playstation", "football", "super eagles", "afcon",
  "nollywood", "album", "celebrity", "wedding", "table of contents",
];

const PRODUCT_LINKS: Record<string, string> = {
  capcut: "https://www.capcut.com/",
  canva: "https://www.canva.com/",
  paystack: "https://paystack.com/",
  flutterwave: "https://flutterwave.com/",
  opay: "https://www.opayweb.com/",
  moniepoint: "https://moniepoint.com/",
  kuda: "https://www.kuda.com/",
  binance: "https://www.binance.com/",
  fiverr: "https://www.fiverr.com/",
  upwork: "https://www.upwork.com/",
};

const SYSTEM = `You are a practical Nigerian money editor for LaneCash.
Topics allowed: money, fintech, crypto, side hustles, small-capital earning, scams, banking, payments.
Be honest about risk. No get-rich-quick promises.
If tools/apps are mentioned, use real HTML links.
Return ONLY JSON keys: title, summary, content, category, reading_minutes.
category: money|opportunities|scams|guides|news
content: HTML with h2,p,ul,li,a only. Include source link at end if SOURCE_URL is real.`;

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 70);
}
function stripTags(html: string) { return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }
function decodeBasic(text: string) {
  return text.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function scoreFinance(title: string, summary: string, weight: number) {
  const text = `${title} ${summary}`.toLowerCase();
  if (BLOCK.some((k) => text.includes(k))) return -100;
  let score = weight;
  let strong = 0;
  for (const k of STRONG_FINANCE) if (text.includes(k)) { score += 3; strong++; }
  if (strong === 0) return -1;
  return score;
}

function injectProductLinks(content: string) {
  let out = content;
  for (const [name, url] of Object.entries(PRODUCT_LINKS)) {
    if (out.toLowerCase().includes(url.toLowerCase())) continue;
    const re = new RegExp(`\\b(${name})\\b`, "ig");
    out = out.replace(re, (m) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${m}</a>`);
  }
  return out;
}

function ensureSourceLink(content: string, sourceName: string, sourceUrl: string) {
  if (!sourceUrl || sourceUrl.includes("lanecash.local")) return content;
  if (content.includes(sourceUrl)) return content;
  return `${content}\n\n<h2>Source</h2>\n<p>Based on reporting from <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${sourceName}</a>.</p>`;
}

function imageFor(title: string, category: string) {
  // Free AI image endpoint (no key). Good enough for covers.
  const prompt = encodeURIComponent(`${category} finance crypto money nigeria editorial photo, no text, high quality`);
  return `https://image.pollinations.ai/prompt/${prompt}?width=1200&height=675&nologo=true&seed=${Math.floor(Math.random()*99999)}`;
}

function parseRss(xml: string, source: string, weight: number): FeedItem[] {
  const items: FeedItem[] = [];
  for (const part of xml.split(/<item[\s>]/i).slice(1, 13)) {
    const title = stripTags(decodeBasic((part.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim()));
    const link = stripTags(decodeBasic((part.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] || "").trim()));
    const description = stripTags(decodeBasic((part.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] || "").trim()));
    if (!title || !link) continue;
    const score = scoreFinance(title, description, weight);
    if (score < 4) continue;
    items.push({ title, link, summary: description.slice(0, 220), source, score });
  }
  return items;
}

async function fetchFeeds(): Promise<FeedItem[]> {
  const all: FeedItem[] = [];
  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { "User-Agent": "Mozilla/5.0 LaneCashBot/1.2", Accept: "application/rss+xml, application/xml, text/xml, */*" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) { console.warn(`[pulse-a] feed fail ${feed.name}: ${res.status}`); continue; }
      const items = parseRss(await res.text(), feed.name, feed.weight);
      console.log(`[pulse-a] feed ${feed.name}: ${items.length} items`);
      all.push(...items);
    } catch (e: any) {
      console.warn(`[pulse-a] feed ${feed.name}:`, e.message);
    }
  }
  // mix in practical crypto/earn seeds so blog stays on-niche
  all.push(...TOPIC_SEEDS);
  all.sort((a, b) => b.score - a.score);
  return all;
}

function parseDraft(raw: string) {
  try {
    let cleaned = String(raw || "").replace(/```json/gi, "").replace(/```/g, "").trim();
    const first = cleaned.indexOf("{"); const last = cleaned.lastIndexOf("}");
    if (first !== -1 && last !== -1) cleaned = cleaned.slice(first, last + 1);
    cleaned = cleaned.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
    const obj = JSON.parse(cleaned);
    if (!obj.title || !obj.content) return null;
    const blob = `${obj.title} ${obj.summary || ""}`.toLowerCase();
    if (BLOCK.some((k) => blob.includes(k))) return null;
    const category = CATEGORIES.includes(obj.category) ? obj.category : "money";
    return {
      title: String(obj.title).trim(),
      summary: String(obj.summary || "").trim(),
      content: String(obj.content).trim(),
      category: category as Category,
      reading_minutes: Number(obj.reading_minutes) || 4,
    };
  } catch { return null; }
}

function localFromFeed(item: FeedItem): ArticleDraft {
  const category: Category = /scam|fraud|ponzi/i.test(item.title + item.summary)
    ? "scams"
    : /crypto|bitcoin|usdt|token/i.test(item.title + item.summary)
      ? "money"
      : /hustle|earn|freelance|capital/i.test(item.title + item.summary)
        ? "guides"
        : "money";
  const content = injectProductLinks(`
<h2>Overview</h2>
<p>${item.summary || item.title}</p>
<h2>Practical takeaway</h2>
<ul>
<li>Start small and verify every platform before sending money.</li>
<li>Treat crypto and online hustles as high-risk unless you fully understand fees and exits.</li>
<li>Track daily income and expenses in a simple note.</li>
</ul>
${item.link.includes("lanecash.local") ? "" : `<h2>Source</h2><p><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.source}</a></p>`}
`.trim());
  return {
    title: item.title,
    summary: item.summary || item.title,
    content,
    category,
    reading_minutes: 3,
    source_name: item.source,
    source_url: item.link.includes("lanecash.local") ? undefined : item.link,
    image_url: imageFor(item.title, category),
  };
}

function finalize(parsed: any, item: FeedItem): ArticleDraft {
  let content = ensureSourceLink(parsed.content, item.source, item.link);
  content = injectProductLinks(content);
  const category = parsed.category as Category;
  return {
    ...parsed,
    content,
    source_name: item.source,
    source_url: item.link.includes("lanecash.local") ? undefined : item.link,
    image_url: imageFor(parsed.title, category),
  };
}

async function generateWithCloudflare(item: FeedItem) {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) return null;
  for (const model of ["@cf/meta/llama-3.1-8b-instruct", "@cf/meta/llama-3.2-3b-instruct"]) {
    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${model}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${CF_API_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: `SOURCE_NAME:${item.source}\nSOURCE_URL:${item.link}\nTITLE:${item.title}\nSUMMARY:${item.summary}\nWrite practical finance/crypto/hustle article.` },
          ],
          max_tokens: 900,
          temperature: 0.25,
        }),
      });
      if (!res.ok) continue;
      const data = await res.json() as any;
      const parsed = parseDraft(data?.result?.response || "");
      if (!parsed) continue;
      console.log(`[pulse-a] Cloudflare AI: ${model}`);
      return finalize(parsed, item);
    } catch (e: any) { console.warn(`[pulse-a] CF ${model}:`, e.message); }
  }
  return null;
}

async function generateWithOpenRouterFree(item: FeedItem) {
  if (!OPENROUTER_API_KEY) return null;
  for (const model of ["meta-llama/llama-3.1-8b-instruct:free", "google/gemma-2-9b-it:free", "mistralai/mistral-7b-instruct:free"]) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/officialbonesceo/kx7-moth-core",
          "X-Title": "pulse-a",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: `SOURCE_NAME:${item.source}\nSOURCE_URL:${item.link}\nTITLE:${item.title}\nSUMMARY:${item.summary}` },
          ],
          temperature: 0.25,
          max_tokens: 500,
        }),
      });
      if (!res.ok) continue;
      const data = await res.json() as any;
      const parsed = parseDraft(data?.choices?.[0]?.message?.content || "");
      if (!parsed) continue;
      console.log(`[pulse-a] OpenRouter: ${model}`);
      return finalize(parsed, item);
    } catch (e: any) { console.warn(`[pulse-a] OR ${model}:`, e.message); }
  }
  return null;
}

async function d1Query(sql: string, params: any[] = []) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${CF_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ sql, params }),
  });
  const text = await res.text();
  if (!res.ok) { console.error("[pulse-a] D1 error", res.status, text); return null; }
  try { return JSON.parse(text); } catch { return { ok: true }; }
}

async function alreadyExists(link: string, title: string) {
  const data = await d1Query(`SELECT id FROM articles WHERE source_url = ? OR title = ? LIMIT 1`, [link, title]);
  const rows = data?.result?.[0]?.results || data?.results || [];
  return Array.isArray(rows) && rows.length > 0;
}

async function publishArticle(draft: ArticleDraft) {
  const id = "a_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const slug = `${slugify(draft.title) || "article"}-${id.slice(-5)}`;
  const sql = `INSERT INTO articles (
    id, slug, title, summary, content, category, image_url, reading_minutes, status,
    source_name, source_url, published_at, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, datetime('now'), datetime('now'), datetime('now'))`;
  const data = await d1Query(sql, [
    id, slug, draft.title, draft.summary, draft.content, draft.category, draft.image_url || null,
    draft.reading_minutes, draft.source_name || null, draft.source_url || null,
  ]);
  if (!data) { console.error("[pulse-a] publish failed"); process.exit(1); }
  console.log(`[pulse-a] published: ${draft.title} → /article/${slug}`);
}

async function main() {
  console.log("[pulse-a] start (finance+crypto+daily earn)");
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error("[pulse-a] missing Cloudflare credentials");
    process.exit(1);
  }

  const items = await fetchFeeds();
  let published = false;
  for (const item of items.slice(0, 20)) {
    if (await alreadyExists(item.link, item.title)) {
      console.log(`[pulse-a] skip: ${item.title.slice(0, 60)}`);
      continue;
    }
    console.log(`[pulse-a] processing: ${item.title.slice(0, 70)}`);
    const draft = (await generateWithCloudflare(item)) || (await generateWithOpenRouterFree(item)) || localFromFeed(item);
    await publishArticle(draft);
    published = true;
    break;
  }
  if (!published) console.log("[pulse-a] nothing new");
  console.log("[pulse-a] done");
}

main().catch((e) => { console.error(e); process.exit(1); });
