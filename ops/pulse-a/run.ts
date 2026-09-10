/**
 * pulse-a — LaneCash
 * Real finance RSS only → AI rewrite → product links + source URL → D1
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

const FEEDS = [
  { name: "Nairametrics", url: "https://nairametrics.com/feed/" },
  { name: "BusinessDay", url: "https://businessday.ng/feed/" },
  { name: "Punch Business", url: "https://punchng.com/topics/business/feed/" },
  { name: "TechCabal", url: "https://techcabal.com/feed/" },
];

// Only keep finance / money / business opportunity stories
const FINANCE_KEYWORDS = [
  "naira", "dollar", "usd", "fx", "forex", "bank", "cbn", "interest", "loan",
  "credit", "fintech", "payment", "transfer", "wallet", "pos", "business",
  "sme", "startup", "invest", "investment", "stock", "shares", "capital",
  "revenue", "profit", "income", "salary", "wage", "hustle", "side hustle",
  "freelance", "remote work", "grant", "funding", "fund", "budget",
  "inflation", "price", "market", "trade", "export", "import", "oil",
  "tax", "vat", "pension", "savings", "save", "money", "cash",
  "scam", "fraud", "ponzi", "crypto", "bitcoin", "usdt", "blockchain",
  "ecommerce", "shop", "sell", "customer", "invoice", "accounting",
  "payroll", "app", "platform", "digital bank", "microfinance",
];

const BLOCK_KEYWORDS = [
  "football", "super eagles", "afcon", "celebrity", "nollywood",
  "music", "album", "movie", "wedding", "politics only", "election campaign",
];

// When tools are mentioned, force real links into the article
const PRODUCT_LINKS: Record<string, string> = {
  capcut: "https://www.capcut.com/",
  canva: "https://www.canva.com/",
  quickbooks: "https://quickbooks.intuit.com/",
  wave: "https://www.waveapps.com/",
  paystack: "https://paystack.com/",
  flutterwave: "https://flutterwave.com/",
  opay: "https://www.opayweb.com/",
  palmPay: "https://www.palmpay.com/",
  palmpay: "https://www.palmpay.com/",
  kooli: "https://www.konga.com/",
  jumia: "https://www.jumia.com.ng/",
  jiji: "https://jiji.ng/",
  fiverr: "https://www.fiverr.com/",
  upwork: "https://www.upwork.com/",
  "google docs": "https://docs.google.com/",
  notion: "https://www.notion.so/",
  trello: "https://trello.com/",
  moniepoint: "https://moniepoint.com/",
  koolatra: "https://www.kuda.com/",
  kuda: "https://www.kuda.com/",
};

const SYSTEM = `You are a practical Nigerian MONEY editor for LaneCash.
STRICT RULE: write only about money, business, fintech, hustles, scams, investments, banking, payments, or earning opportunities.
If the source is not financial enough, still frame it strictly around money impact.
No celebrity gossip, sports, pure politics entertainment.

When you mention a tool/app/product (CapCut, Canva, Paystack, etc.), write it as a real HTML link using the official URL if known.
Example: <a href="https://www.capcut.com/" target="_blank" rel="noopener noreferrer">CapCut</a>

Return ONLY valid JSON with keys: title, summary, content, category, reading_minutes.
category must be one of: money, opportunities, scams, guides, news.
content must be HTML using <h2>, <p>, <ul>, <li>, <a> only.
Always include the SOURCE_URL as a clickable source link near the end.`;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function decodeBasic(text: string): string {
  return text
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;/g, "'");
}

function isFinanceItem(item: FeedItem): boolean {
  const text = `${item.title} ${item.summary}`.toLowerCase();
  if (BLOCK_KEYWORDS.some((k) => text.includes(k))) return false;
  const hits = FINANCE_KEYWORDS.filter((k) => text.includes(k)).length;
  return hits >= 1;
}

function injectProductLinks(content: string): string {
  let out = content;
  for (const [name, url] of Object.entries(PRODUCT_LINKS)) {
    // skip if already linked
    const already = new RegExp(`href=[\"']${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
    if (already.test(out)) continue;

    // link plain mentions of the product name
    const re = new RegExp(`\\b(${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "ig");
    out = out.replace(re, (match) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${match}</a>`;
    });
  }
  return out;
}

function ensureSourceLink(content: string, sourceName: string, sourceUrl: string): string {
  if (content.includes(sourceUrl)) return content;
  return `${content}

<h2>Source</h2>
<p>Based on reporting from <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${sourceName}</a>.</p>`;
}

function parseRss(xml: string, source: string): FeedItem[] {
  const items: FeedItem[] = [];
  const parts = xml.split(/<item[\s>]/i).slice(1);
  for (const part of parts.slice(0, 10)) {
    const title = decodeBasic((part.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim());
    const link = decodeBasic((part.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] || "").trim());
    const description = decodeBasic(
      (part.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ||
        part.match(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i)?.[1] ||
        "").trim()
    );
    if (!title || !link) continue;
    items.push({
      title: stripTags(title),
      link: stripTags(link),
      summary: stripTags(description).slice(0, 500),
      source,
    });
  }
  return items;
}

async function fetchFeeds(): Promise<FeedItem[]> {
  const all: FeedItem[] = [];
  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: {
          "User-Agent": "LaneCashBot/1.0 (+https://moth-core.pages.dev)",
          Accept: "application/rss+xml, application/xml, text/xml, */*",
        },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) {
        console.warn(`[pulse-a] feed fail ${feed.name}: HTTP ${res.status}`);
        continue;
      }
      const xml = await res.text();
      const items = parseRss(xml, feed.name).filter(isFinanceItem);
      console.log(`[pulse-a] feed ${feed.name}: ${items.length} finance items`);
      all.push(...items);
    } catch (err: any) {
      console.warn(`[pulse-a] feed ${feed.name}:`, err.message);
    }
  }
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
<h2>Money angle</h2>
<p>This matters for people tracking income, business tools, payments, or financial risk in Nigeria.</p>
<h2>Source</h2>
<p>Read the original report on <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.source}</a>.</p>
`.trim());
  return {
    title: item.title,
    summary: item.summary.slice(0, 180) || item.title,
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
  return {
    ...parsed,
    content,
    source_name: item.source,
    source_url: item.link,
  };
}

async function generateWithCloudflare(item: FeedItem): Promise<ArticleDraft | null> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) return null;
  const models = [
    "@cf/meta/llama-3.1-8b-instruct",
    "@cf/meta/llama-3.2-3b-instruct",
    "@cf/mistral/mistral-7b-instruct-v0.2",
  ];
  const user = `SOURCE_NAME: ${item.source}
SOURCE_URL: ${item.link}
TITLE: ${item.title}
SUMMARY: ${item.summary}
Write a STRICTLY financial LaneCash article. If tools like CapCut/Canva/Paystack appear, link them.`;

  for (const model of models) {
    try {
      const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${model}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: user },
          ],
          max_tokens: 900,
          temperature: 0.25,
        }),
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
  const user = `SOURCE_NAME: ${item.source}
SOURCE_URL: ${item.link}
TITLE: ${item.title}
SUMMARY: ${item.summary}
Strict finance article only. Link tools if mentioned.`;

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
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: user },
          ],
          temperature: 0.25,
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
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
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
  const data = await d1Query(
    `SELECT id FROM articles WHERE source_url = ? OR title = ? LIMIT 1`,
    [link, title]
  );
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

  const data = await d1Query(sql, [
    id,
    slug,
    draft.title,
    draft.summary,
    draft.content,
    draft.category,
    draft.reading_minutes,
    draft.source_name || null,
    draft.source_url || null,
  ]);

  if (!data) {
    console.error("[pulse-a] publish failed");
    process.exit(1);
  }
  console.log(`[pulse-a] published: ${draft.title} → /article/${slug}`);
}

async function main() {
  console.log("[pulse-a] start (finance-only)");
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error("[pulse-a] missing Cloudflare credentials");
    process.exit(1);
  }

  const items = await fetchFeeds();
  if (!items.length) {
    console.error("[pulse-a] no finance feed items found");
    process.exit(1);
  }

  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  let published = false;
  for (const item of items.slice(0, 12)) {
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
