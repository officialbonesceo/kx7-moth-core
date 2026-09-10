/**
 * pulse-a — LaneCash text engine
 * Prefers free models: Cloudflare AI + OpenRouter free cascade + local fallback
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || "";
const CF_D1_DATABASE_ID = process.env.CF_D1_DATABASE_ID || "";

const CATEGORIES = ["money", "opportunities", "scams", "guides", "news"] as const;
type Category = (typeof CATEGORIES)[number];

interface ArticleDraft {
  title: string;
  summary: string;
  content: string;
  category: Category;
  reading_minutes: number;
}

const TOPIC_SEEDS = [
  "realistic side hustles that work in Nigeria right now",
  "how to avoid common online payment scams",
  "simple ways to manage naira income better",
  "beginner guide to freelancing from Nigeria",
  "what to know before taking a small business loan",
  "practical apps that help small hustles",
  "how students can earn legitimately online",
  "warning signs of fake investment platforms",
  "how to price your freelance service",
  "saving habits that actually work on low income",
  "using POS business the smart way",
  "grant and opportunity alerts people miss",
];

const SYSTEM = `You are a practical Nigerian money editor for LaneCash.
Write honest, useful, non-hype content.
Return ONLY valid JSON with keys: title, summary, content, category, reading_minutes.
category must be one of: money, opportunities, scams, guides, news.
content must be HTML using only <h2>, <p>, <ul>, <li>. Keep under 450 words.`;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
}

function pickTopic(): string {
  return TOPIC_SEEDS[Math.floor(Math.random() * TOPIC_SEEDS.length)];
}

function guessCategory(topic: string): Category {
  const t = topic.toLowerCase();
  if (t.includes("scam") || t.includes("fake") || t.includes("warning")) return "scams";
  if (t.includes("grant") || t.includes("opportunity") || t.includes("job")) return "opportunities";
  if (t.includes("guide") || t.includes("beginner") || t.includes("how to")) return "guides";
  return "money";
}

function parseDraft(raw: string): ArticleDraft | null {
  try {
    let cleaned = String(raw || "").replace(/```json/gi, "").replace(/```/g, "").trim();
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first !== -1 && last !== -1) cleaned = cleaned.slice(first, last + 1);
    // fix trailing commas sometimes returned by small models
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

function localFallback(topic: string): ArticleDraft {
  const category = guessCategory(topic);
  const title = topic.charAt(0).toUpperCase() + topic.slice(1);
  return {
    title,
    summary: `A practical, no-hype breakdown of ${topic} for everyday people in Nigeria.`,
    content: `
<h2>What this is about</h2>
<p>${title} matters because vague advice wastes time and money. This guide stays practical.</p>
<h2>Key points</h2>
<ul>
<li>Start small and test before committing serious money.</li>
<li>Avoid anyone promising guaranteed returns.</li>
<li>Track every naira in and out.</li>
<li>Use only tools and platforms you can verify.</li>
<li>Focus on skills people around you already pay for.</li>
</ul>
<h2>Next step</h2>
<p>Pick one action you can finish this week. Keep it small and measurable.</p>
<h2>Stay safe</h2>
<p>If someone rushes you or asks for unclear upfront fees, walk away. Protect BVN, OTPs, and bank details.</p>
`.trim(),
    category,
    reading_minutes: 3,
  };
}

async function generateWithCloudflare(topic: string): Promise<ArticleDraft | null> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) return null;

  const models = [
    "@cf/meta/llama-3.1-8b-instruct",
    "@cf/meta/llama-3.2-3b-instruct",
    "@cf/mistral/mistral-7b-instruct-v0.2",
  ];

  const user = `Topic: ${topic}
Write a short practical article for Nigerians.
Return ONLY a JSON object, no markdown.`;

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
          max_tokens: 800,
          temperature: 0.3,
        }),
      });

      const text = await res.text();
      if (!res.ok) {
        console.warn(`[pulse-a] CF AI ${model} HTTP ${res.status}: ${text.slice(0, 180)}`);
        continue;
      }

      const data = JSON.parse(text);
      const raw = data?.result?.response || data?.result?.generated_text || "";
      const draft = parseDraft(String(raw));
      if (draft) {
        console.log(`[pulse-a] used Cloudflare AI (free): ${model}`);
        return draft;
      }
      console.warn(`[pulse-a] CF AI ${model} unparseable: ${String(raw).slice(0, 120)}`);
    } catch (err: any) {
      console.warn(`[pulse-a] CF AI ${model}:`, err.message);
    }
  }
  return null;
}

async function generateWithOpenRouterFree(topic: string): Promise<ArticleDraft | null> {
  if (!OPENROUTER_API_KEY) return null;

  // Free / cheap open models cascade
  const models = [
    "meta-llama/llama-3.1-8b-instruct:free",
    "microsoft/phi-3-mini-128k-instruct:free",
    "google/gemma-2-9b-it:free",
    "mistralai/mistral-7b-instruct:free",
    "qwen/qwen-2-7b-instruct:free",
    "meta-llama/llama-3.1-8b-instruct",
  ];

  const user = `Topic: ${topic}. Short practical Nigeria money article. JSON only.`;

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
          temperature: 0.3,
          max_tokens: 450,
        }),
      });

      const text = await res.text();
      if (!res.ok) {
        console.warn(`[pulse-a] OpenRouter ${model} HTTP ${res.status}: ${text.slice(0, 140)}`);
        continue;
      }

      const data = JSON.parse(text);
      const raw = data?.choices?.[0]?.message?.content || "";
      const draft = parseDraft(raw);
      if (draft) {
        console.log(`[pulse-a] used OpenRouter free/cascade: ${model}`);
        return draft;
      }
    } catch (err: any) {
      console.warn(`[pulse-a] OpenRouter ${model}:`, err.message);
    }
  }
  return null;
}

async function generateArticle(topic: string): Promise<ArticleDraft> {
  const cf = await generateWithCloudflare(topic);
  if (cf) return cf;

  const or = await generateWithOpenRouterFree(topic);
  if (or) return or;

  console.warn("[pulse-a] AI unavailable — local fallback");
  return localFallback(topic);
}

async function d1Query(sql: string, params: any[] = []): Promise<boolean> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
    console.error("[pulse-a] missing Cloudflare D1 credentials");
    return false;
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CF_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
  });

  if (!res.ok) {
    console.error("[pulse-a] D1 error", res.status, await res.text());
    return false;
  }
  return true;
}

async function publishArticle(draft: ArticleDraft): Promise<void> {
  const id = "a_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const slug = `${slugify(draft.title) || "article"}-${id.slice(-5)}`;

  const sql = `INSERT INTO articles (
    id, slug, title, summary, content, category, reading_minutes, status, published_at, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, 'published', datetime('now'), datetime('now'), datetime('now'))`;

  const ok = await d1Query(sql, [
    id, slug, draft.title, draft.summary, draft.content, draft.category, draft.reading_minutes,
  ]);

  if (ok) console.log(`[pulse-a] published: ${draft.title} → /article/${slug}`);
  else {
    console.error("[pulse-a] publish failed");
    process.exit(1);
  }
}

async function main() {
  console.log("[pulse-a] start");
  const topic = pickTopic();
  console.log("[pulse-a] topic:", topic);
  const draft = await generateArticle(topic);
  console.log(`[pulse-a] draft ready: ${draft.title}`);
  await publishArticle(draft);
  console.log("[pulse-a] done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
