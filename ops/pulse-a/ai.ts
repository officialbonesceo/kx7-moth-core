/**
 * AI rewrite: Cloudflare first, OpenRouter fallback.
 * Output cleaned to HTML. Public source label is never "AI".
 */
import { markdownToHtml, stripMetaLines } from './format';

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

export type AiDraft = {
  title: string;
  summary: string;
  contentHtml: string;
  category: 'money' | 'opportunities' | 'scams' | 'guides';
  author_team: string;
  model: string; // internal log only
};

const SYSTEM = `You are a clear writing coach for beginners learning online skills and money safety.
Rules:
- Educational only. NOT financial advice. No guaranteed income.
- Stay strictly on the given topic.
- Use clean HTML only: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <a>. Never use Markdown (# ** -).
- Short paragraphs. Real steps for this topic only.
- End with <h2>Disclaimer</h2><p>Educational only — not financial advice.</p>`;

const CF_MODEL_CANDIDATES = [
  '@cf/meta/llama-3.1-8b-instruct',
  '@cf/meta/llama-3-8b-instruct',
  '@cf/qwen/qwen1.5-7b-chat-awq',
  '@cf/mistral/mistral-7b-instruct-v0.2',
];

const OR_PREFER = ['free', 'google/gemma', 'meta-llama', 'mistralai/mistral-7b', 'qwen', 'phi-3'];

async function listOpenRouterModels(): Promise<string[]> {
  if (!OPENROUTER_API_KEY) return [];
  try {
    const r = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return [];
    const j = await r.json();
    const scored = (j.data || [])
      .map((m: any) => {
        const id = String(m.id || '');
        const prompt = Number(m.pricing?.prompt || 1);
        let score = prompt === 0 || /free/i.test(id) ? 0 : prompt;
        for (const p of OR_PREFER) if (id.toLowerCase().includes(p)) score -= 0.01;
        return { id, score };
      })
      .filter((x: any) => x.id)
      .sort((a: any, b: any) => a.score - b.score);
    return scored.slice(0, 10).map((x: any) => x.id);
  } catch {
    return [];
  }
}

async function listCloudflareModels(): Promise<string[]> {
  try {
    const r = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/models/search`,
      { headers: { Authorization: `Bearer ${CF_API_TOKEN}` }, signal: AbortSignal.timeout(8000) }
    );
    if (r.ok) {
      const j = await r.json();
      const names = (j.result || [])
        .map((m: any) => m.name || m.id)
        .filter((n: string) => n && String(n).startsWith('@cf/'))
        .slice(0, 8);
      if (names.length) return names;
    }
  } catch {}
  return CF_MODEL_CANDIDATES;
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
      console.warn('[ai] CF fail', model, r.status, text.slice(0, 140));
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
        'HTTP-Referer': 'https://github.com/officialbonesceo/kx7-moth-core',
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
      console.warn('[ai] OR fail', model, r.status, text.slice(0, 140));
      return null;
    }
    const j = JSON.parse(text);
    return j.choices?.[0]?.message?.content || null;
  } catch (e) {
    console.warn('[ai] OR error', model, String(e));
    return null;
  }
}

function buildPrompt(context: string, partial?: string) {
  if (partial && partial.trim().length > 80) {
    return `Continue this HTML guide on-topic. Use only HTML tags h2 h3 p ul ol li a. No Markdown.

Partial:
${partial.slice(0, 5000)}

Context:
${context.slice(0, 3000)}`;
  }
  return `Write one beginner educational guide for the topic below.

First lines exactly:
TITLE: clear title
SUMMARY: one or two sentences
CATEGORY: money OR opportunities OR scams OR guides

Then HTML body only (no Markdown):
- <h2>Start here</h2> with basics for THIS topic
- <h2>Step-by-step</h2> with <ol><li>…
- <h2>Tips</h2>
- <h2>Watch outs</h2> if relevant
- <h2>Disclaimer</h2><p>Educational only — not financial advice.</p>

Context:
${context.slice(0, 4500)}`;
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
  const cfModels = await listCloudflareModels();
  const orModels = await listOpenRouterModels();
  let partial = '';
  let usedModel = '';

  for (const model of cfModels) {
    console.log('[ai] trying CF', model, partial ? '(continue)' : '(fresh)');
    const out = await cfRun(model, buildPrompt(context, partial || undefined));
    if (!out) continue;
    partial = partial ? `${partial}\n${out}` : out;
    usedModel = model;
    if (/TITLE:/i.test(partial) && partial.length > 700) break;
  }

  if (partial.length < 500 || !/TITLE:/i.test(partial)) {
    for (const model of orModels.slice(0, 5)) {
      console.log('[ai] trying OR', model, partial ? '(continue)' : '(fresh)');
      const out = await openRouterRun(model, buildPrompt(context, partial || undefined));
      if (!out) continue;
      partial = partial ? `${partial}\n${out}` : out;
      usedModel = model;
      if (/TITLE:/i.test(partial) && partial.length > 700) break;
    }
  }

  if (!partial || partial.trim().length < 200) {
    console.error('[ai] all models failed');
    return null;
  }

  const draft = parseAiOutput(partial, seedTitle);
  draft.model = usedModel;
  console.log('[ai] draft ok', draft.title.slice(0, 50));
  return draft;
}
