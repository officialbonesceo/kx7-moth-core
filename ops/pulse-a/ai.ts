/**
 * AI rewrite: Cloudflare first, OpenRouter fallback.
 * Always normalize output to clean HTML (models often return markdown).
 */

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

export type AiDraft = {
  title: string;
  summary: string;
  contentHtml: string;
  category: 'money' | 'opportunities' | 'scams' | 'guides';
  author_team: string;
  model: string;
};

const SYSTEM = `You write practical educational guides for beginners.
Rules:
- NOT financial, investment, or income-guarantee advice.
- Stay strictly on the assigned topic.
- Output TITLE, SUMMARY, CATEGORY lines first, then the body.
- Body must use HTML tags only: h2, h3, p, ul, ol, li, strong, em, a.
- Do NOT use markdown (# ## ** -). Do NOT mention AI, models, ChatGPT, Cloudflare, or how the article was written.
- Sound like a clear human editor at LaneCash.`;

const CF_MODEL_CANDIDATES = [
  '@cf/meta/llama-3.1-8b-instruct',
  '@cf/meta/llama-3-8b-instruct',
  '@cf/qwen/qwen1.5-7b-chat-awq',
  '@cf/mistral/mistral-7b-instruct-v0.2',
  '@hf/thebloke/openhermes-2.5-mistral-7b-awq',
];

const OR_PREFER = ['free', 'google/gemma', 'meta-llama', 'mistralai/mistral-7b', 'qwen', 'phi-3', 'llama-3.1-8b'];

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
    return scored.slice(0, 12).map((x: any) => x.id);
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
        .slice(0, 10);
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
      console.warn('[ai] CF fail', model, r.status, text.slice(0, 160));
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
      console.warn('[ai] OR fail', model, r.status, text.slice(0, 160));
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
    return `Continue this educational guide in HTML only (h2,p,ul,ol,li). No markdown. Stay on topic.

Partial so far:
${partial.slice(0, 6000)}

Context:
${context.slice(0, 3000)}`;
  }
  return `Write one complete beginner educational guide.

Required header lines:
TITLE: clear specific title
SUMMARY: 1-2 sentences
CATEGORY: money OR opportunities OR scams OR guides

Then body in HTML only, with sections such as:
<h2>Start here</h2>
<p>...</p>
<h2>Step-by-step</h2>
<ol><li>...</li></ol>
<h2>Common mistakes</h2>
<ul><li>...</li></ul>
<h2>Disclaimer</h2>
<p>Educational only — not financial advice.</p>

No markdown. No mention of AI or tools used to write this.

Topic context:
${context.slice(0, 5000)}`;
}

/** Convert common markdown leftovers into HTML */
export function markdownToHtml(input: string): string {
  let s = input.replace(/\r\n/g, '\n').trim();

  // Remove accidental code fences
  s = s.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '');

  // Headings
  s = s.replace(/^######\s+(.+)$/gm, '<h3>$1</h3>');
  s = s.replace(/^#####\s+(.+)$/gm, '<h3>$1</h3>');
  s = s.replace(/^####\s+(.+)$/gm, '<h2>$1</h2>');
  s = s.replace(/^###\s+(.+)$/gm, '<h2>$1</h2>');
  s = s.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  s = s.replace(/^#\s+(.+)$/gm, '<h2>$1</h2>');

  // Bold / italic
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  s = s.replace(/(?<![\w*])\*([^*]+)\*(?![\w*])/g, '<em>$1</em>');

  // Links [text](url)
  s = s.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Numbered steps on one line: **Step 1: ...** -
  s = s.replace(/\*\*Step\s+(\d+):\s*([^*]+)\*\*/gi, '<h3>Step $1: $2</h3>');

  // Lists: group consecutive - or * or 1. lines
  const lines = s.split('\n');
  const out: string[] = [];
  let listBuf: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  function flushList() {
    if (!listBuf.length || !listType) return;
    out.push(`<${listType}>${listBuf.map((li) => `<li>${li}</li>`).join('')}</${listType}>`);
    listBuf = [];
    listType = null;
  }

  for (const line of lines) {
    const ul = line.match(/^\s*[-*•]\s+(.+)$/);
    const ol = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (ul) {
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      listBuf.push(ul[1]);
      continue;
    }
    if (ol) {
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      listBuf.push(ol[1]);
      continue;
    }
    flushList();
    out.push(line);
  }
  flushList();
  s = out.join('\n');

  // Paragraphs for remaining plain blocks
  if (!/<p[\s>]/i.test(s) || (s.match(/<p[\s>]/gi) || []).length < 2) {
    const chunks = s.split(/\n\n+/);
    s = chunks
      .map((chunk) => {
        const t = chunk.trim();
        if (!t) return '';
        if (/^<(h[1-6]|ul|ol|p|blockquote|div)\b/i.test(t)) return t;
        // single line already tagged
        if (/^<[^>]+>.*<\/[^>]+>$/s.test(t) && !t.includes('\n')) return t;
        // lines that are already block tags
        if (/<h[1-6][\s>]/i.test(t) || /<(ul|ol)[\s>]/i.test(t)) return t;
        const withBreaks = t
          .split('\n')
          .map((ln) => ln.trim())
          .filter(Boolean)
          .join('<br/>');
        return `<p>${withBreaks}</p>`;
      })
      .filter(Boolean)
      .join('\n');
  }

  // Strip leftover ** and ##
  s = s.replace(/\*\*/g, '');
  s = s.replace(/^#+\s*/gm, '');

  s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
  return s.trim();
}

function parseAiOutput(raw: string, fallbackTitle: string): AiDraft {
  let text = raw.trim();

  const titleMatch =
    text.match(/TITLE:\s*(.+)/i) ||
    text.match(/^##\s+(.+)$/m) ||
    text.match(/^#\s+(.+)$/m);
  const summaryMatch = text.match(/SUMMARY:\s*(.+)/i);
  const catMatch = text.match(/CATEGORY:\s*(money|opportunities|scams|guides)/i);

  let body = text
    .replace(/TITLE:\s*.+/i, '')
    .replace(/SUMMARY:\s*.+/i, '')
    .replace(/CATEGORY:\s*.+/i, '')
    .trim();

  // Drop a duplicate H1/H2 if it matches title
  if (titleMatch?.[1]) {
    const esc = titleMatch[1].trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    body = body.replace(new RegExp(`^#+\\s*${esc}\\s*`, 'i'), '').trim();
  }

  body = markdownToHtml(body);

  if (!/not financial advice/i.test(body)) {
    body +=
      '\n<h2>Disclaimer</h2>\n<p>This guide is educational only. It is not financial, investment, or legal advice.</p>';
  }

  let title = (titleMatch?.[1] || fallbackTitle).trim();
  title = title.replace(/^#+\s*/, '').replace(/\*\*/g, '').slice(0, 140);

  let summary = (summaryMatch?.[1] || 'Practical beginner guide from LaneCash — educational only, not financial advice.')
    .trim()
    .replace(/\*\*/g, '')
    .slice(0, 280);

  return {
    title,
    summary,
    contentHtml: body,
    category: (catMatch?.[1]?.toLowerCase() || 'guides') as AiDraft['category'],
    author_team: 'LaneCash',
    model: 'internal', // logs only — never shown on site
  };
}

export async function rewriteWithAi(context: string, seedTitle: string): Promise<AiDraft | null> {
  const cfModels = await listCloudflareModels();
  const orModels = await listOpenRouterModels();
  let partial = '';
  let usedModel = '';

  for (const model of cfModels) {
    console.log('[ai] trying CF', model, partial ? '(continue)' : '(fresh)');
    const out = await cfRun(model, buildPrompt(context, partial || undefined), partial ? 900 : 1400);
    if (!out) continue;
    partial = partial ? `${partial}\n${out}` : out;
    usedModel = model;
    if (partial.length > 900) break;
  }

  if (partial.length < 500) {
    for (const model of orModels.slice(0, 6)) {
      console.log('[ai] trying OR', model, partial ? '(continue)' : '(fresh)');
      const out = await openRouterRun(
        model,
        buildPrompt(context, partial || undefined),
        partial ? 900 : 1400
      );
      if (!out) continue;
      partial = partial ? `${partial}\n${out}` : out;
      usedModel = model;
      if (partial.length > 900) break;
    }
  }

  if (!partial || partial.trim().length < 200) {
    console.error('[ai] all models failed');
    return null;
  }

  const draft = parseAiOutput(partial, seedTitle);
  draft.model = usedModel || 'mixed';
  console.log('[ai] draft ok', draft.title.slice(0, 60));
  return draft;
}
