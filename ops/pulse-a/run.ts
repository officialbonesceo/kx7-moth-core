/**
 * pulse-a — LaneCash
 * STRICT finance-only RSS → AI rewrite → product links + source → D1
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
}

// Prefer pure money publishers first
const FEEDS = [
  { name: "Nairametrics", url: "https://nairametrics.com/feed/", weight: 3 },
  { name: "BusinessDay", url: "https://businessday.ng/feed/", weight: 3 },
  { name: "Punch Business", url: "https://punchng.com/topics/business/feed/", weight: 2 },
  { name: "TechCabal", url: "https://techcabal.com/feed/", weight: 1 },
];

const STRONG_FINANCE = [
  "naira", "exchange rate", "cbn", "central bank", "fintech", "bank", "banking",
  "loan", "credit", "interest rate", "inflation", "investment", "investors",
  "stocks", "shares", "capital", "funding", "grant", "sme", "msme",
  "paystack", "flutterwave", "opay", "moniepoint", "kuda", "palmpay",
  "pos", "payment", "wallet", "remittance", "diaspora",
  "tax", "budget", "oil price", "crude", "subsidy", "petrol price",
  "salary", "minimum wage", "pension", "savings", "hustle", "side hustle",
  "freelance", "scam", "ponzi", "fraud", "crypto", "bitcoin", "usdt",
  "revenue", "profit", "valuation", "startup funding", "series a", "seed round",
];

const WEAK_FINANCE = [
  "business", "market", "trade", "economy", "economic", "money", "cash",
  "income", "sell", "commerce", "ecommerce", "pricing", "price hike",
];

const BLOCK = [
  "iphone", "galaxy", "pixel", "smartphone", "foldable", "specs",
  "release date", "camera", "android", "ios update", "macbook",
  "playstation", "xbox", "nintendo", "football", "super eagles",
  "afcon", "premier league", "nollywood", "album", "music video",
  "celebrity", "wedding", "table of contents", "key specs",
];

const PRODUCT_LINKS: Record<string, string> = {
  capcut: "https://www.capcut.com/",
  canva: "https://www.canva.com/",
  quickbooks: "https://quickbooks.intuit.com/",
  wave: "https://www.waveapps.com/",
  paystack: "https://paystack.com/",
  flutterwave: "https://flutterwave.com/",
  opay: "https://www.opayweb.com/",
  palmpay: "https://www.palmpay.com/",
  moniepoint: "https://moniepoint.com/",
  kuda: "https://www.kuda.com/",
  fiverr: "https://www.fiverr.com/",
  upwork: "https://www.upwork.com/",
  jumia: "https://www.jumia.com.ng/",
  jiji: "https://jiji.ng/",
};

const SYSTEM = `You are a practical Nigerian MONEY editor for LaneCash.
STRICT: only money, banking, fintech, hustles, investments, scams, payments, business finance.
Never write gadget reviews or phone launches.
If a tool/app is mentioned (CapCut, Canva, Paystack...), make it a real HTML link.
Return ONLY JSON: title, summary, content, category, reading_minutes.
category: money | opportunities | scams | guides | news
content HTML tags allowed: h2, p, ul, li, a
Include SOURCE_URL as clickable source near the end.`;

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 70);
}
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function decodeBasic(text: string): string {
  return text.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, '"').replace(/&#39;/g, "'");
}

function scoreFinance(title: string, summary: string, sourceWeight: number): number {
  const text = `${title} ${summary}`.toLowerCase();
  if (BLOCK.some((k) => text.includes(k))) return -100;
  let score = 0;
  for (const k of STRONG_FINANCE) if (text.includes(k)) score += 3;
  for (const k of WEAK_FINANCE) if (text.includes(k)) score += 1;
  score += sourceWeight;
  // require real money signal, not just weak words like "price"
  const strongHits = STRONG_FINANCE.filter((k) => text.includes(k)).length;
  if (strongHits === 0) return -1;
  return score;
}

function injectProductLinks(content: string): string {
  let out = content;
  for (const [name, url] of Object.entries(PRODUCT_LINKS)) {
    if (out.toLowerCase().includes(url.toLowerCase())) continue;
    const re = new RegExp(`\\b(${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "ig");
    out = out.replace(re, (m) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${m}</a>`);
  }
  return out;
}

function ensureSourceLink(content: string, sourceName: string, sourceUrl: string): string {
  if (content.includes(sourceUrl)) return content;
  return `${content}\n\n<h2>Source</h2>\n<p>Based on reporting from <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${sourceName}</a>.</p>`;
}

function cleanSummary(text: string): string {
  return text
    .replace(/table of contents.*/i, "")
    .replace(/key specs.*/i, "")
    .replace(/frequently asked questions.*/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

function parseRss(xml: string, source: string, weight: number): FeedItem[] {
  const items: FeedItem[] = [];
  const parts = xml.split(/<item[\s>]/i).slice(1);
  for (const part of parts.slice(0, 12)) {
    const title = stripTags(decodeBasic((part.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim()));
    const link = stripTags(decodeBasic((part.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] || "").trim()));
    const description = stripTags(decodeBasic((part.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] || part.match(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i)?.[1] || "").trim()));
    if (!title || !link) continue;
    const score = scoreFinance(title, description, weight);
    if (score < 4) continue; // strict gate
    items.push({ title, link, summary: cleanSummary(description), source, score });
  }
  return items;
}

async function fetchFeeds(): Promise<FeedItem[]> {
  const all: FeedItem[] = [];
  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; LaneCashBot/1.1)",
          Accept: "application/rss+xml, application/xml, text/xml, */*",
        },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        console.warn(`[pulse-a] feed fail ${feed.name}: HTTP ${res.status}`);
        continue;
      }
      const xml = await res.text();
      const items = parseRss(xml, feed.name, feed.weight);
      console.log(`[pulse-a] feed ${feed.name}: ${items.length} strict-finance items`);
      all.push(...items);
    } catch (err: any) {
      console.warn(`[pulse-a] feed ${feed.name}:`, err.message);
    }
  }
  all.sort((a, b) => b.score - a.score);
  return all;
}

function parseDraft(raw: string): Omit<ArticleDraft, "source_name" | "source_url"> | null {
  try {
    let cleaned = String(raw || "").replace(/```json/gi, "").replace(/```/g, "").trim();
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first !== -1 && last !== -1) cleaned = cleaned.slice(first, last + 1);
    cleaned = cleaned.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
    const obj = JSON.parse(cleaned);
    if (!obj.title || !obj.content) return null;
    // reject non-finance AI outputs
    const blob = `${obj.title} ${obj.summary || ""}`.toLowerCase();
    if (BLOCK.some((k) => blob.includes(k))) return null;
    const category = CATEGORIES.includes(obj.category) ? obj.category : "money";
    return {
      title: String(obj.title).trim(),
      summary: String(obj.summary || "").trim(),
      content: String(obj.content).trim(),
      category,
      reading_minutes: Number(obj.reading_minutes) || 4,
    };
  } catch {
    return null;
  }
}

function localFromFeed(item: FeedItem): ArticleDraft {
  const content = injectProductLinks(`
<h2>What happened</h2>
<p>${item.summary || item.title}</p>
<h2>Why it matters for your money</h2>
<p>This update is relevant if you follow Nigerian finance, business cashflow, payments, or investment risk.</p>
<ul>
<li>Watch how it affects prices, access to capital, or payment tools.</li>
<li>Avoid decisions based on hype — verify details before spending.</li>
</ul>
<h2>Source</h2>
<p>Read the original report on <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.source}</a>.</p>
`.trim());
  return {
    title: item.title,
    summary: item.summary || item.title,
    content,
    category: "money",
    reading_minutes: 3,
    source_name: item.source,
    source_url: item.link,
  };
}

function finalizeDraft(parsed: Omit<ArticleDraft, "source_name" | "source_url">, item: FeedItem): ArticleDraft {
  let content = ensureSourceLink(parsed.content, item.source, item.link);
  content = injectProductLinks(content);
  return { ...parsed, content, source_name: item.source, source_url: item.link };
}

async function generateWithCloudflare(item: FeedItem): Promise<ArticleDraft | null> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) return null;
  const models = ["@cf/meta/llama-3.1-8b-instruct", "@cf/meta/llama-3.2-3b-instruct", "@cf/mistral/mistral-7b-instruct-v0.2"];
  const user = `SOURCE_NAME: ${item.source}\nSOURCE_URL: ${item.link}\nTITLE: ${item.title}\nSUMMARY: ${item.summary}\nWrite STRICT finance article only. Link tools if mentioned.`;
  for (const model of models) {
    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${model}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${CF_API_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "system", content: SYSTEM }, { role: "user", content: user }], max_tokens: 900, temperature: 0.2 }),
      });
      if (!res.ok) continue;
      const data = await res.json() as any;
      const parsed = parseDraft(data?.result?.response || "");
      if (!parsed) continue;
      console.log(`[pulse-a] used Cloudflare AI: ${model}`);
      return finalizeDraft(parsed, item);
    } catch (err: any) {
      console.warn(`[pulse-a] CF AI ${model}:`, err.message);
    }
  }
  return null;
}

async function generateWithOpenRouterFree(item: FeedItem): Promise<ArticleDraft | null> {
  if (!OPENROUTER_API_KEY) return null;
  const models = [
    "meta-llama/llama-3.1-8b-instruct:free",
    "google/gemma-2-9b-it:free",
    "mistralai/mistral-7b-instruct:free",
    "meta-llama/llama-3.1-8b-instruct",
  ];
  const user = `SOURCE_NAME: ${item.source}\nSOURCE_URL: ${item.link}\nTITLE: ${item.title}\nSUMMARY: ${item.summary}\nStrict finance only.`;
  for (const model of models) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/officialbonesceo/kx7-moth-core",
          "X-Title": "kx7-moth-core pulse-a",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "system", content: SYSTEM }, { role: "user", content: user }],
          temperature: 0.2,
          max_tokens: 500,
        }),
      });
      if (!res.ok) continue;
      const data = await res.json() as any;
      const parsed = parseDraft(data?.choices?.[0]?.message?.content || "");
      if (!parsed) continue;
      console.log(`[pulse-a] used OpenRouter: ${model}`);
      return finalizeDraft(parsed, item);
    } catch (err: any) {
      console.warn(`[pulse-a] OpenRouter ${model}:`, err.message);
    }
  }
  return null;
}

async function d1Query(sql: string, params: any[] = []): Promise<any> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${CF_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ sql, params }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error("[pulse-a] D1 error", res.status, text);
    return null;
  }
  try { return JSON.parse(text); } catch { return { ok: true }; }
}

async function alreadyExists(link: string, title: string): Promise<boolean> {
  const data = await d1Query(`SELECT id FROM articles WHERE source_url = ? OR title = ? LIMIT 1`, [link, title]);
  const rows = data?.result?.[0]?.results || data?.results || [];
  return Array.isArray(rows) && rows.length > 0;
}

async function publishArticle(draft: ArticleDraft): Promise<void> {
  const id = "a_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const slug = `${slugify(draft.title) || "article"}-${id.slice(-5)}`;
  const sql = `INSERT INTO articles (
    id, slug, title, summary, content, category, reading_minutes, status,
    source_name, source_url, published_at, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, datetime('now'), datetime('now'), datetime('now'))`;
  const data = await d1Query(sql, [id, slug, draft.title, draft.summary, draft.content, draft.category, draft.reading_minutes, draft.source_name || null, draft.source_url || null]);
  if (!data) {
    console.error("[pulse-a] publish failed");
    process.exit(1);
  }
  console.log(`[pulse-a] published: ${draft.title} → /article/${slug}`);
}

async function main() {
  console.log("[pulse-a] start (strict finance gate)");
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error("[pulse-a] missing Cloudflare credentials");
    process.exit(1);
  }

  const items = await fetchFeeds();
  if (!items.length) {
    console.error("[pulse-a] no strict-finance items found");
    process.exit(1);
  }

  console.log(`[pulse-a] top candidate: ${items[0].title} (score ${items[0].score})`);

  let published = false;
  for (const item of items.slice(0, 15)) {
    if (await alreadyExists(item.link, item.title)) {
      console.log(`[pulse-a] skip duplicate: ${item.title.slice(0, 60)}`);
      continue;
    }
    console.log(`[pulse-a] processing: ${item.title.slice(0, 70)}`);
    const draft =
      (await generateWithCloudflare(item)) ||
      (await generateWithOpenRouterFree(item)) ||
      localFromFeed(item);
    await publishArticle(draft);
    published = true;
    break;
  }

  if (!published) console.log("[pulse-a] nothing new to publish");
  console.log("[pulse-a] done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
