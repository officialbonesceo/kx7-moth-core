/**
 * pulse-a — LaneCash deep content engine
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
  kind?: "seed" | "news";
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
];

const TOPIC_SEEDS: FeedItem[] = [
  { title: "How to earn ₦3,000–₦10,000/week with under ₦5,000 capital in Nigeria", link: "https://lanecash.local/seed/earn-little-weekly", summary: "Realistic low-capital weekly income paths, costs, steps, and mistakes to avoid.", source: "LaneCash Desk", score: 40, kind: "seed" },
  { title: "USDT from zero in Nigeria: buy, store, send, fees, and scams", link: "https://lanecash.local/seed/usdt-from-zero", summary: "Complete beginner explanation of USDT with practical steps and risk controls.", source: "LaneCash Desk", score: 40, kind: "seed" },
  { title: "POS / agent banking in Nigeria: real costs, daily volume, and hidden charges", link: "https://lanecash.local/seed/pos-real", summary: "Honest operator-style breakdown of POS business economics and risk.", source: "LaneCash Desk", score: 38, kind: "seed" },
  { title: "Phone-only freelancing: offer, pricing, client scripts, and first ₦ payment", link: "https://lanecash.local/seed/phone-freelance", summary: "How to sell a simple service from your phone with clear pricing and outreach.", source: "LaneCash Desk", score: 38, kind: "seed" },
  { title: "Fake investment apps targeting Nigerians: how the trap works and how to walk away", link: "https://lanecash.local/seed/fake-invest-apps", summary: "Deep breakdown of common investment scam patterns and protection steps.", source: "LaneCash Desk", score: 39, kind: "seed" },
  { title: "Opay vs Moniepoint vs Kuda for small business payouts: practical comparison", link: "https://lanecash.local/seed/wallet-compare", summary: "Side-by-side operator view of wallets for receiving and moving business money.", source: "LaneCash Desk", score: 37, kind: "seed" },
  { title: "Small-capital crypto in Nigeria: what is possible vs fantasy", link: "https://lanecash.local/seed/crypto-reality", summary: "Clear separation of learning, speculation, and scam offers for beginners.", source: "LaneCash Desk", score: 39, kind: "seed" },
];

const STRONG = ["naira","cbn","fintech","bank","loan","inflation","investment","funding","paystack","flutterwave","opay","moniepoint","kuda","pos","payment","hustle","freelance","scam","ponzi","crypto","bitcoin","usdt","stablecoin","trading","salary","budget","tax","wallet"];
const BLOCK = ["iphone","galaxy","foldable","specs","release date","football","super eagles","nollywood","celebrity","album","table of contents"];

const PRODUCT_LINKS: Record<string, string> = {
  capcut: "https://www.capcut.com/", canva: "https://www.canva.com/", paystack: "https://paystack.com/", flutterwave: "https://flutterwave.com/",
  opay: "https://www.opayweb.com/", moniepoint: "https://moniepoint.com/", kuda: "https://www.kuda.com/", binance: "https://www.binance.com/",
  fiverr: "https://www.fiverr.com/", upwork: "https://www.upwork.com/",
};

const SYSTEM = `You are a senior practical finance editor for LaneCash (Nigeria-focused).
You write IN-DEPTH knowledge articles, never tip lists.
Every article MUST answer all 7:
1. What is this really?
2. Why should a Nigerian reader care?
3. How does it work in practice?
4. What does it cost / realistic earnings?
5. Risks and scams
6. Exact steps to start this week
7. Success after 7 and 30 days
Hard rules: one topic fully explained; no get-rich-quick; realistic naira ranges; explain WHY; no empty motivation lines; 1000-1600 words HTML; tools as real <a> links.
Required headings: What this really is; Why it matters in Nigeria; How it works in practice; Costs and realistic earnings; Risks and common scams; Exact steps for this week; What good looks like in 7 and 30 days; Final checklist.
Return ONLY JSON: title, summary, content, category, reading_minutes
category: money|opportunities|scams|guides|news
content tags: h2,p,ul,li,ol,a only`;

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}
function stripTags(h: string) { return h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }
function decodeBasic(t: string) {
  return t.replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, '"').replace(/&#39;/g, "'");
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
    out = out.replace(new RegExp(`\\b(${name})\\b`, "ig"), (m) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${m}</a>`);
  }
  return out;
}
function ensureSource(content: string, name: string, url: string) {
  if (!url || url.includes("lanecash.local") || content.includes(url)) return content;
  return `${content}\n\n<h2>Source</h2>\n<p>Context adapted from reporting by <a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>.</p>`;
}

/** Topic-synced covers — never random people on money posts */
function imageFor(title: string, category: string) {
  const t = `${title} ${category}`.toLowerCase();
  let scene = "dark fintech abstract green neon charts money symbols, no people, no faces, no portrait";
  if (/scam|fraud|ponzi|fake/.test(t)) scene = "dark cybersecurity red warning triangle lock shield abstract, no people, no faces";
  else if (/usdt|tether|stablecoin/.test(t)) scene = "dark USDT tether stablecoin green glow abstract crypto chart, no people";
  else if (/bitcoin|crypto|token|blockchain|defi|airdrop/.test(t)) scene = "dark bitcoin crypto coin stack green neon candlestick chart abstract, no people";
  else if (/pos|moniepoint|opay|kuda|wallet|payment/.test(t)) scene = "dark mobile payment fintech wallet naira abstract green UI, no people";
  else if (/hustle|freelance|earn|side income|capital|daily/.test(t)) scene = "dark desk laptop notebook growth chart green accent, no face, no portrait";
  else if (/loan|bank|naira|inflation|invest/.test(t)) scene = "dark finance naira currency abstract upward arrow green neon, no people";
  const seed = Math.abs([...title].reduce((a, c) => a + c.charCodeAt(0), 0) % 99999);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(scene)}?width=1200&height=675&nologo=true&seed=${seed}`;
}

function hasRequiredDepth(content: string): boolean {
  const c = content.toLowerCase();
  if (content.length < 2200) return false;
  const needed = ["what this really is", "why it matters", "how it works", "cost", "risk", "this week", "7", "30", "checklist"];
  let hits = 0;
  for (const k of needed) if (c.includes(k)) hits++;
  return hits >= 6;
}

function parseDraft(raw: string) {
  try {
    let c = String(raw || "").replace(/```json/gi, "").replace(/```/g, "").trim();
    const a = c.indexOf("{"), b = c.lastIndexOf("}");
    if (a !== -1 && b !== -1) c = c.slice(a, b + 1);
    c = c.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
    const obj = JSON.parse(c);
    if (!obj.title || !obj.content) return null;
    if (!hasRequiredDepth(String(obj.content))) return null;
    const blob = `${obj.title} ${obj.summary || ""}`.toLowerCase();
    if (BLOCK.some((k) => blob.includes(k))) return null;
    const category = CATEGORIES.includes(obj.category) ? obj.category : "guides";
    return {
      title: String(obj.title).trim(),
      summary: String(obj.summary || "").trim(),
      content: String(obj.content).trim(),
      category: category as Category,
      reading_minutes: Math.max(8, Number(obj.reading_minutes) || 10),
    };
  } catch { return null; }
}

function deepLocal(item: FeedItem): ArticleDraft {
  const t = `${item.title} ${item.summary}`.toLowerCase();
  let category: Category = "guides";
  if (/scam|fraud|ponzi|fake/.test(t)) category = "scams";
  else if (/crypto|usdt|bitcoin|token|stablecoin/.test(t)) category = "opportunities";
  else if (/pos|bank|wallet|opay|moniepoint|kuda|payment/.test(t)) category = "money";

  const content = injectLinks(`
<h2>What this really is</h2>
<p>${item.title} is not a magic income switch. It is a practical money skill: understanding a real process, paying only necessary costs, and repeating actions that produce proof.</p>
<p>${item.summary || "This guide focuses on the mechanism first, then the money."}</p>
<h2>Why it matters in Nigeria</h2>
<p>Cashflow pressure is normal: data, transport, family obligations, unstable prices. A method only matters if it survives small capital, irregular time, and high scam density.</p>
<h2>How it works in practice</h2>
<p>Most real paths have four parts: offer, channel, conversion, settlement. Choose one narrow offer, talk to real people, log replies, improve one weak point, repeat.</p>
<ul>
<li><strong>Offer:</strong> what exact result are you selling or learning?</li>
<li><strong>Channel:</strong> where does the audience already gather?</li>
<li><strong>Conversion:</strong> what proof or price makes someone act?</li>
<li><strong>Settlement:</strong> how does money arrive and what fees remain?</li>
</ul>
<h2>Costs and realistic earnings</h2>
<p>Under ₦5,000–₦20,000 capital, many starts are service or learning based — not "invest and withdraw daily."</p>
<ul>
<li>Starter costs: data, tools like <a href="https://www.canva.com/" target="_blank" rel="noopener noreferrer">Canva</a> / <a href="https://www.capcut.com/" target="_blank" rel="noopener noreferrer">CapCut</a>, transport, small fees.</li>
<li>Realistic early range: ₦0 while testing; ₦3,000–₦10,000/week only after repeated conversions.</li>
<li>Bad expectation: guaranteed daily profit from an app you do not control.</li>
</ul>
<h2>Risks and common scams</h2>
<p>Urgency + fake withdrawal screenshots + deposit-to-unlock patterns are classic traps.</p>
<ul>
<li>Never share OTP, seed phrases, or remote phone control.</li>
<li>Never pay to "release" money.</li>
<li>Prefer known rails: <a href="https://www.opayweb.com/" target="_blank" rel="noopener noreferrer">Opay</a>, <a href="https://moniepoint.com/" target="_blank" rel="noopener noreferrer">Moniepoint</a>, <a href="https://www.kuda.com/" target="_blank" rel="noopener noreferrer">Kuda</a>, <a href="https://paystack.com/" target="_blank" rel="noopener noreferrer">Paystack</a>.</li>
</ul>
<h2>Exact steps for this week</h2>
<ol>
<li>Day 1: write one-sentence offer.</li>
<li>Day 2: prepare one proof asset.</li>
<li>Day 3: contact 10 people or post in one channel.</li>
<li>Day 4: improve one weak part only.</li>
<li>Day 5: complete one paid/proof action.</li>
<li>Day 6–7: repeat only what worked.</li>
</ol>
<h2>What good looks like in 7 and 30 days</h2>
<p><strong>7 days:</strong> clarity, logs, improved pitch, zero scam losses.</p>
<p><strong>30 days:</strong> repeatable rhythm, measured fees, process you can explain on paper.</p>
<h2>Final checklist</h2>
<ul>
<li>Can I explain the mechanism plainly?</li>
<li>Do I know costs before starting?</li>
<li>Is my target tied to actions I control?</li>
<li>Have I banned guaranteed-profit fantasy?</li>
<li>Do I have a written scam boundary?</li>
</ul>
${item.link.includes("lanecash.local") ? "" : `<h2>Source</h2><p><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.source}</a></p>`}
`.trim());

  return {
    title: item.title,
    summary: item.summary || "Deep practical breakdown with costs, risks, weekly steps, and 7/30-day outcomes.",
    content,
    category,
    reading_minutes: 12,
    source_name: item.source,
    source_url: item.link.includes("lanecash.local") ? undefined : item.link,
    image_url: imageFor(item.title, category),
  };
}

async function fetchFeeds(): Promise<FeedItem[]> {
  const all: FeedItem[] = [];
  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { "User-Agent": "Mozilla/5.0 LaneCashBot/2.1", Accept: "application/rss+xml, application/xml, text/xml, */*" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) continue;
      const xml = await res.text();
      for (const part of xml.split(/<item[\s>]/i).slice(1, 10)) {
        const title = stripTags(decodeBasic((part.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim()));
        const link = stripTags(decodeBasic((part.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] || "").trim()));
        const description = stripTags(decodeBasic((part.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] || "").trim()));
        if (!title || !link) continue;
        const score = scoreItem(title, description, feed.weight);
        if (score < 5) continue;
        all.push({ title, link, summary: description.slice(0, 260), source: feed.name, score, kind: "news" });
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
  for (const model of ["@cf/meta/llama-3.1-8b-instruct", "@cf/meta/llama-3.2-3b-instruct"]) {
    try {
      const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${model}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${CF_API_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: `SOURCE_NAME:${item.source}\nSOURCE_URL:${item.link}\nTITLE:${item.title}\nSUMMARY:${item.summary}\nWrite full in-depth article with all required headings.` },
          ],
          max_tokens: 2200,
          temperature: 0.25,
        }),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as any;
      const parsed = parseDraft(data?.result?.response || "");
      if (!parsed) continue;
      console.log(`[pulse-a] CF depth pass: ${model}`);
      return {
        ...parsed,
        content: injectLinks(ensureSource(parsed.content, item.source, item.link)),
        source_name: item.source,
        source_url: item.link.includes("lanecash.local") ? undefined : item.link,
        image_url: imageFor(parsed.title, parsed.category),
      } as ArticleDraft;
    } catch (e: any) {
      console.warn(`[pulse-a] CF ${model}:`, e.message);
    }
  }
  return null;
}

async function generateOR(item: FeedItem) {
  if (!OPENROUTER_API_KEY) return null;
  for (const model of ["meta-llama/llama-3.1-8b-instruct:free", "google/gemma-2-9b-it:free", "mistralai/mistral-7b-instruct:free"]) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/officialbonesceo/kx7-moth-core",
          "X-Title": "pulse-a-depth",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: `SOURCE_NAME:${item.source}\nSOURCE_URL:${item.link}\nTITLE:${item.title}\nSUMMARY:${item.summary}\nFull in-depth article with required headings.` },
          ],
          temperature: 0.25,
          max_tokens: 1800,
        }),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as any;
      const parsed = parseDraft(data?.choices?.[0]?.message?.content || "");
      if (!parsed) continue;
      console.log(`[pulse-a] OR depth pass: ${model}`);
      return {
        ...parsed,
        content: injectLinks(ensureSource(parsed.content, item.source, item.link)),
        source_name: item.source,
        source_url: item.link.includes("lanecash.local") ? undefined : item.link,
        image_url: imageFor(parsed.title, parsed.category),
      } as ArticleDraft;
    } catch (e: any) {
      console.warn(`[pulse-a] OR ${model}:`, e.message);
    }
  }
  return null;
}

async function d1(sql: string, params: any[] = []) {
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${CF_API_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ sql, params }),
  });
  const text = await res.text();
  if (!res.ok) { console.error("[pulse-a] D1", res.status, text); return null; }
  try { return JSON.parse(text); } catch { return { ok: true }; }
}

async function exists(link: string, title: string) {
  const data = await d1(`SELECT id FROM articles WHERE source_url = ? OR title = ? LIMIT 1`, [link, title]);
  const rows = data?.result?.[0]?.results || data?.results || [];
  return Array.isArray(rows) && rows.length > 0;
}

async function publish(draft: ArticleDraft) {
  const id = "a_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const slug = `${slugify(draft.title) || "article"}-${id.slice(-5)}`;
  const data = await d1(
    `INSERT INTO articles (id, slug, title, summary, content, category, image_url, reading_minutes, status, source_name, source_url, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, datetime('now'), datetime('now'), datetime('now'))`,
    [id, slug, draft.title, draft.summary, draft.content, draft.category, draft.image_url || null, draft.reading_minutes, draft.source_name || null, draft.source_url || null]
  );
  if (!data) { console.error("[pulse-a] publish failed"); process.exit(1); }
  console.log(`[pulse-a] published DEEP: ${draft.title} → /article/${slug}`);
}

async function main() {
  console.log("[pulse-a] start DEEP + topic images");
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error("[pulse-a] missing Cloudflare credentials");
    process.exit(1);
  }
  const items = await fetchFeeds();
  for (const item of items.slice(0, 25)) {
    if (await exists(item.link, item.title)) {
      console.log("[pulse-a] skip", item.title.slice(0, 60));
      continue;
    }
    console.log("[pulse-a] processing", item.title.slice(0, 80));
    const draft = (await generateCF(item)) || (await generateOR(item)) || deepLocal(item);
    await publish(draft);
    break;
  }
  console.log("[pulse-a] done");
}

main().catch((e) => { console.error(e); process.exit(1); });
