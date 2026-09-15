/**
 * AI rewrite: text chat models only.
 * Order: Groq → Gemini → Cloudflare chat → OpenRouter :free
 */
import { markdownToHtml, stripMetaLines } from './format';

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export type AiDraft = {
  title: string;
  summary: string;
  contentHtml: string;
  category: 'money' | 'opportunities' | 'scams' | 'guides';
  author_team: string;
  model: string;
};

const SYSTEM = `You are a clear writing coach for beginners learning online skills and money safety.
Rules:
- Educational only. NOT financial advice. No guaranteed income.
- Stay strictly on the given topic.
- Use clean HTML only: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <a>. Never use Markdown (# ** -).
- Short paragraphs. Real steps for this topic only.
- End with <h2>Disclaimer</h2><p>Educational only — not financial advice.</p>`;

/** Only text instruct/chat models — never image/audio/embed/flux */
const CF_CHAT_MODELS = [
  '@cf/meta/llama-3.1-8b-instruct',
  '@cf/meta/llama-3.2-3b-instruct',
  '@cf/meta/llama-3-8b-instruct',
  '@cf/qwen/qwen1.5-7b-chat-awq',
  '@cf/mistral/mistral-7b-instruct-v0.2',
  '@cf/google/gemma-7b-it',
  '@cf/microsoft/phi-2',
];

const GROQ_MODELS = [
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile',
  'gemma2-9b-it',
];

const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-lite'];

function isChatModelName(id: string) {
  const n = id.toLowerCase();
  if (/flux|whisper|embed|bge|resnet|detect|segment|speech|tts|asr|diffusion|stable-diffusion|llama-guard|smart-turn|rerank/.test(n))
    return false;
  return /instruct|chat|gemma|llama|mistral|qwen|phi|gpt-oss/.test(n) || n.includes('text');
}

async function listCloudflareChatModels(): Promise<string[]> {
  const found: string[] = [];
  try {
    const r = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/models/search`,
      { headers: { Authorization: `Bearer ${CF_API_TOKEN}` }, signal: AbortSignal.timeout(8000) }
    );
    if (r.ok) {
      const j = await r.json();
      for (const m of j.result || []) {
        const name = String(m.name || m.id || '');
        if (name.startsWith('@cf/') && isChatModelName(name)) found.push(name);
      }
    }
  } catch {}
  const merged = [...CF_CHAT_MODELS, ...found.filter((n) => !CF_CHAT_MODELS.includes(n))];
  return merged.slice(0, 12);
}

async function listOpenRouterFreeChat(): Promise<string[]> {
  if (!OPENROUTER_API_KEY) return [];
  try {
    const r = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return [];
    const j = await r.json();
    const free = (j.data || [])
      .map((m: any) => String(m.id || ''))
      .filter((id: string) => /:free$/i.test(id) && isChatModelName(id));
    return free.slice(0, 8);
  } catch {
    return [];
  }
}

async function cfRun(model: string, prompt: string, maxTokens = 1400): Promise<string | null> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) return null;
  try {
    const r = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${model}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${CF_API_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SYSTEM },
            { role: 'user', content: prompt },
          ],
          max_tokens: maxTokens,
        }),
        signal: AbortSignal.timeout(60000),
      }
    );
    const text = await r.text();
    if (!r.ok) {
      console.warn('[ai] CF fail', model, r.status, text.slice(0, 120));
      return null;
    }
    const j = JSON.parse(text);
    return (
      j.result?.response ||
      j.result?.generated_text ||
      j.result?.output_text ||
      (typeof j.result === 'string' ? j.result : null)
    );
  } catch (e) {
    console.warn('[ai] CF error', model, String(e));
    return null;
  }
}

async function openRouterRun(model: string, prompt: string, maxTokens = 1400): Promise<string | null> {
  if (!OPENROUTER_API_KEY) return null;
  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lanecash.name.ng',
        'X-Title': 'LaneCash',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
      }),
      signal: AbortSignal.timeout(90000),
    });
    const text = await r.text();
    if (!r.ok) {
      console.warn('[ai] OR fail', model, r.status, text.slice(0, 120));
      return null;
    }
    const j = JSON.parse(text);
    return j.choices?.[0]?.message?.content || null;
  } catch (e) {
    console.warn('[ai] OR error', model, String(e));
    return null;
  }
}

async function groqRun(model: string, prompt: string, maxTokens = 1400): Promise<string | null> {
  if (!GROQ_API_KEY) return null;
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
      }),
      signal: AbortSignal.timeout(60000),
    });
    const text = await r.text();
    if (!r.ok) {
      console.warn('[ai] Groq fail', model, r.status, text.slice(0, 120));
      return null;
    }
    const j = JSON.parse(text);
    return j.choices?.[0]?.message?.content || null;
  } catch (e) {
    console.warn('[ai] Groq error', model, String(e));
    return null;
  }
}

async function geminiRun(model: string, prompt: string): Promise<string | null> {
  if (!GEMINI_API_KEY) return null;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `${SYSTEM}\n\n${prompt}` }] }],
        generationConfig: { maxOutputTokens: 1400 },
      }),
      signal: AbortSignal.timeout(60000),
    });
    const text = await r.text();
    if (!r.ok) {
      console.warn('[ai] Gemini fail', model, r.status, text.slice(0, 120));
      return null;
    }
    const j = JSON.parse(text);
    return j.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || null;
  } catch (e) {
    console.warn('[ai] Gemini error', model, String(e));
    return null;
  }
}

function buildPrompt(context: string, partial?: string) {
  if (partial && partial.trim().length > 80) {
    return `Continue this HTML guide on-topic. Use only HTML tags h2 h3 p ul ol li a. No Markdown.\n\nPartial:\n${partial.slice(0, 5000)}\n\nContext:\n${context.slice(0, 3000)}`;
  }
  return `Write one beginner educational guide for the topic below.\n\nFirst lines exactly:\nTITLE: clear title\nSUMMARY: one or two sentences\nCATEGORY: money OR opportunities OR scams OR guides\n\nThen HTML body only (no Markdown):\n- <h2>Start here</h2> with basics for THIS topic\n- <h2>Step-by-step</h2> with <ol><li>…\n- <h2>Tips</h2>\n- <h2>Watch outs</h2> if relevant\n- <h2>Disclaimer</h2><p>Educational only — not financial advice.</p>\n\nContext:\n${context.slice(0, 4500)}`;
}

function parseAiOutput(raw: string, fallbackTitle: string): AiDraft {
  const meta = stripMetaLines(raw);
  let html = markdownToHtml(meta.body);
  if (!/not financial advice/i.test(html)) {
    html +=
      '<h2>Disclaimer</h2><p>This guide is educational only. It is not financial, investment, or legal advice.</p>';
  }
  const cat = (meta.category || 'guides').toLowerCase() as AiDraft['category'];
  return {
    title: (meta.title || fallbackTitle).replace(/^#+\s*/, '').trim().slice(0, 140),
    summary: (meta.summary || 'A practical beginner guide from LaneCash. Educational only — not financial advice.')
      .trim()
      .slice(0, 280),
    contentHtml: html,
    category: ['money', 'opportunities', 'scams', 'guides'].includes(cat) ? cat : 'guides',
    author_team: 'LaneCash Desk',
    model: 'internal',
  };
}

export async function rewriteWithAi(context: string, seedTitle: string): Promise<AiDraft | null> {
  let partial = '';
  let usedModel = '';
  const promptFresh = buildPrompt(context);

  // 1) Groq (daily free, fast)
  for (const model of GROQ_MODELS) {
    if (!GROQ_API_KEY) break;
    console.log('[ai] trying Groq', model);
    const out = await groqRun(model, partial ? buildPrompt(context, partial) : promptFresh);
    if (!out) continue;
    partial = partial ? `${partial}\n${out}` : out;
    usedModel = `groq:${model}`;
    if (/TITLE:/i.test(partial) && partial.length > 700) break;
  }

  // 2) Gemini
  if (partial.length < 500 || !/TITLE:/i.test(partial)) {
    for (const model of GEMINI_MODELS) {
      if (!GEMINI_API_KEY) break;
      console.log('[ai] trying Gemini', model);
      const out = await geminiRun(model, partial ? buildPrompt(context, partial) : promptFresh);
      if (!out) continue;
      partial = partial ? `${partial}\n${out}` : out;
      usedModel = `gemini:${model}`;
      if (/TITLE:/i.test(partial) && partial.length > 700) break;
    }
  }

  // 3) Cloudflare chat-only
  if (partial.length < 500 || !/TITLE:/i.test(partial)) {
    const cfModels = await listCloudflareChatModels();
    for (const model of cfModels) {
      console.log('[ai] trying CF', model);
      const out = await cfRun(model, partial ? buildPrompt(context, partial) : promptFresh);
      if (!out) continue;
      partial = partial ? `${partial}\n${out}` : out;
      usedModel = model;
      if (/TITLE:/i.test(partial) && partial.length > 700) break;
    }
  }

  // 4) OpenRouter free chat
  if (partial.length < 500 || !/TITLE:/i.test(partial)) {
    const orModels = await listOpenRouterFreeChat();
    for (const model of orModels.slice(0, 5)) {
      console.log('[ai] trying OR', model);
      const out = await openRouterRun(model, partial ? buildPrompt(context, partial) : promptFresh);
      if (!out) continue;
      partial = partial ? `${partial}\n${out}` : out;
      usedModel = model;
      if (/TITLE:/i.test(partial) && partial.length > 700) break;
    }
  }

  if (!partial || partial.trim().length < 200) {
    console.error('[ai] all models failed — add GROQ_API_KEY or GEMINI_API_KEY or wait for CF neurons reset');
    return null;
  }

  const draft = parseAiOutput(partial, seedTitle);
  draft.model = usedModel;
  console.log('[ai] draft ok', draft.title.slice(0, 50), 'via', usedModel);
  return draft;
}
