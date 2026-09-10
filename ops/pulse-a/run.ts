/**
 * pulse-a — LaneCash text engine
 * Cloudflare Workers AI first → OpenRouter fallback → D1 publish
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
Write honest, useful, non-hype articles for everyday people.
No get-rich-quick claims. Be clear and specific.
Return ONLY valid JSON with keys: title, summary, content, category, reading_minutes.
category must be one of: money, opportunities, scams, guides, news.
content must be clean HTML using <h2>, <p>, <ul><li> only.`;

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

function parseDraft(raw: string): ArticleDraft | null {
  try {
    let cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const first = cleaned.indexOf("{");
    const last = cleaned.lastIndexOf("}");
    if (first !== -1 && last !== -1) cleaned = cleaned.slice(first, last + 1);
    const obj = JSON.parse(cleaned);
    if (!obj.title || !obj.content) return null;
    const category = CATEGORIES.includes(obj.category) ? obj.category : "money";
    return {
      title: String(obj.title).trim(),
      summary: String(obj.summary || "").trim(),
      content: String(obj.content).trim(),
      category,
      reading_minutes: Number(obj.reading_minutes) || 5,
    };
  } catch {
    return null;
  }
}

async function generateWithCloudflare(topic: string): Promise<ArticleDraft | null> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) return null;

  const models = [
    "@cf/meta/llama-3.1-8b-instruct",
    "@cf/meta/llama-3.1-70b-instruct",
    "@cf/mistral/mistral-7b-instruct-v0.2",
  ];

  const user = `Write one strong article about: ${topic}
Audience: Nigerians who want practical money advice.
Length: 500-800 words equivalent in HTML.
Return ONLY JSON.`;

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
        }),
      });

      if (!res.ok) {
        console.warn(`[pulse-a] CF AI ${model} HTTP ${res.status}`);
        continue;
      }

      const data = (await res.json()) as any;
      const raw = data?.result?.response || data?.response || "";
      const draft = parseDraft(raw);
      if (draft) {
        console.log(`[pulse-a] used Cloudflare AI: ${model}`);
        return draft;
      }
    } catch (err: any) {
      console.warn(`[pulse-a] CF AI ${model}:`, err.message);
    }
  }
  return null;
}

async function generateWithOpenRouter(topic: string): Promise<ArticleDraft | null> {
  if (!OPENROUTER_API_KEY) return null;

  const models = [
    "meta-llama/llama-3.3-70b-instruct",
    "google/gemini-2.0-flash-001",
    "openai/gpt-4o-mini",
    "mistralai/mistral-7b-instruct",
  ];

  const user = `Write one strong article about: ${topic}
Audience: Nigerians who want practical money advice.
Length: 500-800 words equivalent in HTML.`;

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
          temperature: 0.5,
          max_tokens: 2200,
        }),
      });

      if (!res.ok) {
        console.warn(`[pulse-a] OpenRouter ${model} HTTP ${res.status}:`, await res.text());
        continue;
      }

      const data = (await res.json()) as any;
      const raw = data?.choices?.[0]?.message?.content || "";
      const draft = parseDraft(raw);
      if (draft) {
        console.log(`[pulse-a] used OpenRouter: ${model}`);
        return draft;
      }
    } catch (err: any) {
      console.warn(`[pulse-a] OpenRouter ${model}:`, err.message);
    }
  }
  return null;
}

async function generateArticle(topic: string): Promise<ArticleDraft | null> {
  // 1) Cloudflare Workers AI first
  const cfDraft = await generateWithCloudflare(topic);
  if (cfDraft) return cfDraft;

  // 2) OpenRouter fallback
  const orDraft = await generateWithOpenRouter(topic);
  if (orDraft) return orDraft;

  console.error("[pulse-a] all AI providers failed");
  return null;
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
  const slugBase = slugify(draft.title) || "article";
  const slug = `${slugBase}-${id.slice(-5)}`;

  const sql = `INSERT INTO articles (
    id, slug, title, summary, content, category, reading_minutes, status, published_at, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, 'published', datetime('now'), datetime('now'), datetime('now'))`;

  const ok = await d1Query(sql, [
    id,
    slug,
    draft.title,
    draft.summary,
    draft.content,
    draft.category,
    draft.reading_minutes,
  ]);

  if (ok) {
    console.log(`[pulse-a] published: ${draft.title} → /article/${slug}`);
  } else {
    console.error("[pulse-a] publish failed");
  }
}

async function main() {
  console.log("[pulse-a] start");
  const topic = pickTopic();
  console.log("[pulse-a] topic:", topic);

  const draft = await generateArticle(topic);
  if (!draft || !draft.title || !draft.content) {
    console.error("[pulse-a] no usable draft");
    process.exit(1);
  }

  await publishArticle(draft);
  console.log("[pulse-a] done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
