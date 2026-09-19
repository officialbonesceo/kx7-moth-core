/**
 * AI rewrite: text chat models only.
 * Order: Groq → Gemini → Cloudflare chat → OpenRouter :free
 * FAIL CLOSED: never return a draft that fails quality gates.
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

const SYSTEM = `You write finished educational articles for LaneCash (Nigeria-friendly money safety and skills).
HARD RULES:
- Output ONLY the article. Never write chain-of-thought, planning, "Okay I need to", "First I'll", or meta commentary.
- Never repeat the same section twice.
- Educational only. NOT financial advice. No guaranteed income.
- Stay strictly on the given topic.
- Use clean HTML only: h2, h3, p, ul, ol, li, a. Never Markdown (# ** -).
- Target 900–1600 words of real guidance. Short paragraphs.
- Prefer practical steps useful in Nigeria / Africa when relevant (banks, mobile money, local job scams) without inventing laws.
- TITLE must be specific (at least 8 words). Never single-word titles like "Google" or "Remote work".
- End once with: <h2>Disclaimer</h2><p>Educational only — not financial advice.</p>`;

const CF_CHAT_MODELS = [
  '@cf/meta/llama-3.1-8b-instruct',
  '@cf/meta/llama-3.2-3b-instruct',
  '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  '@cf/qwen/qwen2.5-7b-instruct',
];

const GROQ_MODELS = ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile', 'gemma2-9b-it'];
const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-lite'];

/** Titles that mean the model failed to invent a real headline */
const BANNED_TITLES = new Set(
  [
    'google',
    'remote work',
    'affiliate',
    'crypto',
    'scam',
    'guide',
    'article',
    'untitled',
    'post',
    'youtube',
    'tiktok',
    'facebook',
    'instagram',
    'telegram',
    'whatsapp',
  ].map((s) => s.toLowerCase())
);

function isChatModelName(id: string) {
  const n = id.toLowerCase();
  if (/flux|whisper|embed|bge|resnet|detect|segment|speech|tts|asr|diffusion|stable-diffusion|llama-guard|smart-turn|rerank|lora$/.test(n))
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

async function cfRun(model: string, prompt: string, maxTokens = 2200): Promise<string | null> {
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
        signal: AbortSignal.timeout(90000),
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

async function openRouterRun(model: string, prompt: string, maxTokens = 2200): Promise<string | null> {
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

async function groqRun(model: string, prompt: string, maxTokens = 2200): Promise<string | null> {
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
      signal: AbortSignal.timeout(90000),
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
        generationConfig: { maxOutputTokens: 2200 },
      }),
      signal: AbortSignal.timeout(90000),
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
    return `Continue the HTML article only. No planning text. HTML tags h2 h3 p ul ol li a only.\n\nPartial:\n${partial.slice(0, 5000)}\n\nContext:\n${context.slice(0, 3000)}`;
  }
  return `Write one finished beginner educational guide.\n\nFirst lines exactly:\nTITLE: clear specific title (minimum 8 words, never a single brand name)\nSUMMARY: one or two sentences that state the real topic\nCATEGORY: money OR opportunities OR scams OR guides\n\nThen HTML body only (no Markdown, no thinking out loud):\n- <h2>Start here</h2>\n- <h2>Step-by-step</h2> with <ol><li>…\n- <h2>Tips</h2>\n- <h2>Watch outs</h2> if relevant\n- <h2>Disclaimer</h2><p>Educational only — not financial advice.</p>\n\nAim for substantial detail (about 1000+ words of real content). Do not paste the same section twice.\n\nContext:\n${context.slice(0, 4500)}`;
}

export function looksLikeLeak(text: string): boolean {
  return /okay,?\s+i need to|first,?\s+i('ll| will)|chain-of-thought|as an ai|here is my plan|let me outline|the user has specified|i'll start by outlining|data clean room/i.test(
    text
  );
}

function hasDuplicatedBlock(html: string): boolean {
  const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
  if (plain.length < 800) return false;
  const half = Math.floor(plain.length / 2);
  const a = plain.slice(0, half);
  const b = plain.slice(half);
  // crude: large overlap of first 200 chars of each half appearing twice
  const sample = a.slice(40, 240);
  if (sample.length < 80) return false;
  const first = plain.indexOf(sample);
  const second = plain.indexOf(sample, first + sample.length);
  return second > 0;
}

export function isWeakTitle(title: string): boolean {
  const t = title.replace(/\s+/g, ' ').trim();
  if (t.length < 28) return true;
  if (t.split(/\s+/).length < 6) return true;
  if (BANNED_TITLES.has(t.toLowerCase())) return true;
  if (/^(google|remote work|affiliate marketing|crypto|scam|guide)$/i.test(t)) return true;
  if (/practical beginner guide from lanecash/i.test(t)) return true;
  return false;
}

export function isWeakSummary(summary: string): boolean {
  const s = summary.replace(/\s+/g, ' ').trim();
  if (s.length < 40) return true;
  if (/^a practical beginner guide from lanecash/i.test(s)) return true;
  return false;
}

function parseAiOutput(raw: string, fallbackTitle: string): AiDraft | null {
  if (looksLikeLeak(raw)) {
    console.warn('[ai] rejected leak/planning text');
    return null;
  }
  const meta = stripMetaLines(raw);
  let html = markdownToHtml(meta.body);
  if (looksLikeLeak(html)) {
    console.warn('[ai] rejected leak in html');
    return null;
  }
  if (hasDuplicatedBlock(html)) {
    console.warn('[ai] rejected duplicated body');
    return null;
  }
  const textLen = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;
  if (textLen < 1800) {
    console.warn('[ai] rejected short draft', textLen);
    return null;
  }
  if (!/not financial advice/i.test(html)) {
    html +=
      '<h2>Disclaimer</h2><p>This guide is educational only. It is not financial, investment, or legal advice.</p>';
  }

  let title = (meta.title || '').replace(/^#+\s*/, '').replace(/\*\*/g, '').trim().slice(0, 140);
  if (!title || isWeakTitle(title)) {
    // Never fall back to a weak seed like "Google"
    if (fallbackTitle && !isWeakTitle(fallbackTitle)) title = fallbackTitle.slice(0, 140);
    else {
      console.warn('[ai] rejected weak/missing title', title || '(empty)');
      return null;
    }
  }

  let summary = (meta.summary || '').replace(/\*\*/g, '').trim().slice(0, 280);
  if (isWeakSummary(summary)) {
    console.warn('[ai] rejected weak summary');
    return null;
  }

  const cat = (meta.category || 'guides').toLowerCase() as AiDraft['category'];
  return {
    title,
    summary,
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

  for (const model of GROQ_MODELS) {
    if (!GROQ_API_KEY) break;
    console.log('[ai] trying Groq', model);
    const out = await groqRun(model, partial ? buildPrompt(context, partial) : promptFresh);
    if (!out) continue;
    partial = partial ? `${partial}\n${out}` : out;
    usedModel = `groq:${model}`;
    if (/TITLE:/i.test(partial) && partial.length > 1500 && !looksLikeLeak(partial)) break;
  }

  if (partial.length < 1000 || !/TITLE:/i.test(partial) || looksLikeLeak(partial)) {
    for (const model of GEMINI_MODELS) {
      if (!GEMINI_API_KEY) break;
      console.log('[ai] trying Gemini', model);
      const out = await geminiRun(model, partial ? buildPrompt(context, partial) : promptFresh);
      if (!out) continue;
      partial = partial ? `${partial}\n${out}` : out;
      usedModel = `gemini:${model}`;
      if (/TITLE:/i.test(partial) && partial.length > 1500 && !looksLikeLeak(partial)) break;
    }
  }

  if (partial.length < 1000 || !/TITLE:/i.test(partial) || looksLikeLeak(partial)) {
    const cfModels = await listCloudflareChatModels();
    for (const model of cfModels) {
      console.log('[ai] trying CF', model);
      const out = await cfRun(model, partial ? buildPrompt(context, partial) : promptFresh);
      if (!out) continue;
      partial = partial ? `${partial}\n${out}` : out;
      usedModel = model;
      if (/TITLE:/i.test(partial) && partial.length > 1500 && !looksLikeLeak(partial)) break;
    }
  }

  if (partial.length < 1000 || !/TITLE:/i.test(partial) || looksLikeLeak(partial)) {
    const orModels = await listOpenRouterFreeChat();
    for (const model of orModels.slice(0, 5)) {
      console.log('[ai] trying OR', model);
      const out = await openRouterRun(model, partial ? buildPrompt(context, partial) : promptFresh);
      if (!out) continue;
      partial = partial ? `${partial}\n${out}` : out;
      usedModel = model;
      if (/TITLE:/i.test(partial) && partial.length > 1500 && !looksLikeLeak(partial)) break;
    }
  }

  if (!partial || partial.trim().length < 800) {
    console.error('[ai] all models failed — fail closed (no publish)');
    return null;
  }

  const draft = parseAiOutput(partial, seedTitle);
  if (!draft) {
    console.error('[ai] draft failed quality gates — fail closed');
    return null;
  }
  draft.model = usedModel;
  console.log('[ai] draft ok', draft.title.slice(0, 60), 'via', usedModel);
  return draft;
}
