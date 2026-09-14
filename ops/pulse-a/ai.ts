/**
 * AI rewrite layer:
 * Cloudflare Workers AI first, OpenRouter fallback with model discovery.
 * Continues from partial text if a provider fails mid-way.
 * All output is educational only — never financial advice.
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

const SYSTEM = `You write practical educational guides about online skills, safety, and money habits.
Rules you MUST follow:
- This is NOT financial advice, investment advice, or a promise of income.
- Never guarantee earnings, ROI, daily profit, or "easy money".
- Prefer small experiments, checklists, and risk warnings.
- If research mentions tools, present them as optional examples the reader should verify themselves.
- Output only HTML fragments using h2, p, ul, ol, li, a — no scripts.
- Write clearly for beginners; build confidence through small proof steps, not hype.
- Always include a short disclaimer line in the final checklist: educational only, not financial advice.`;

const CF_MODEL_CANDIDATES = [
  '@cf/meta/llama-3.1-8b-instruct',
  '@cf/meta/llama-3-8b-instruct',
  '@cf/qwen/qwen1.5-7b-chat-awq',
  '@cf/mistral/mistral-7b-instruct-v0.2',
  '@hf/thebloke/openhermes-2.5-mistral-7b-awq',
];

const OR_PREFER = [
  'free',
  'google/gemma',
  'meta-llama',
  'mistralai/mistral-7b',
  'qwen',
  'phi-3',
  'llama-3.1-8b',
  'llama-3-8b',
];

async function listOpenRouterModels(): Promise<string[]> {
  if (!OPENROUTER_API_KEY) return [];
  try {
    const r = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return [];
    const j = await r.json();
    const data = j.data || [];
    const scored = data
      .map((m: any) => {
        const id = String(m.id || '');
        const pricing = m.pricing || {};
        const prompt = Number(pricing.prompt || 1);
        const freeish = prompt === 0 || /free/i.test(id);
        let score = freeish ? 0 : prompt;
        for (const p of OR_PREFER) {
          if (id.toLowerCase().includes(p)) score -= 0.01;
        }
        return { id, score };
      })
      .filter((x: any) => x.id)
      .sort((a: any, b: any) => a.score - b.score);
    const ids = scored.slice(0, 12).map((x: any) => x.id);
    console.log('[ai] openrouter candidates', ids.slice(0, 5).join(', '));
    return ids;
  } catch (e) {
    console.warn('[ai] openrouter model list failed', String(e));
    return [];
  }
}

async function listCloudflareModels(): Promise<string[]> {
  try {
    const r = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/models/search`,
      {
        headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (r.ok) {
      const j = await r.json();
      const names = (j.result || [])
        .map((m: any) => m.name || m.id)
        .filter((n: string) => n && String(n).startsWith('@cf/'))
        .slice(0, 10);
      if (names.length) {
        console.log('[ai] cloudflare models discovered', names.slice(0, 4).join(', '));
        return names;
      }
    }
  } catch {}
  return CF_MODEL_CANDIDATES;
}

async function cfRun(model: string, prompt: string, maxTokens = 1200): Promise<string | null> {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) return null;
  try {
    const r = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${model}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${CF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
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
      console.warn('[ai] CF fail', model, r.status, text.slice(0, 180));
      return null;
    }
    const j = JSON.parse(text);
    const out =
      j.result?.response ||
      j.result?.generated_text ||
      j.result?.output_text ||
      (typeof j.result === 'string' ? j.result : null);
    return out ? String(out) : null;
  } catch (e) {
    console.warn('[ai] CF error', model, String(e));
    return null;
  }
}

async function openRouterRun(model: string, prompt: string, maxTokens = 1200): Promise<string | null> {
  if (!OPENROUTER_API_KEY) return null;
  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://github.com/officialbonesceo/kx7-moth-core',
        'X-Title': 'LaneCash pulse',
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
      console.warn('[ai] OR fail', model, r.status, text.slice(0, 180));
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
    return `Continue this beginner educational guide from where it stopped. Keep the same structure. Do not repeat finished sections.
Remember: NOT financial advice; no income guarantees.

Partial article so far:
${partial.slice(0, 6000)}

Research context (use carefully; tools are optional examples to verify):
${context.slice(0, 3500)}

Continue with remaining sections in HTML only.`;
  }
  return `Using the research notes, write ONE complete beginner educational guide.

Hard rules:
- NOT financial advice and not a promise of income
- No guaranteed earnings, ROI, or "get rich" language
- Build confidence with small, realistic practice steps

Output format:
- Title line first: TITLE: ...
- Summary line: SUMMARY: ... (1-2 sentences, educational tone)
- Category line: CATEGORY: money|opportunities|scams|guides
- Then HTML body with:
  1) Start here (basics)
  2) Beginner tips
  3) Step-by-step for this week
  4) Free/cheap tools that may help (from research; reader must verify)
  5) Risks and scam warnings
  6) What good looks like in 7 and 30 days
  7) Final checklist including: This is educational only — not financial advice.

Research notes:
${context.slice(0, 5000)}`;
}

function parseAiOutput(raw: string, fallbackTitle: string): AiDraft {
  const titleMatch = raw.match(/TITLE:\s*(.+)/i);
  const summaryMatch = raw.match(/SUMMARY:\s*(.+)/i);
  const catMatch = raw.match(/CATEGORY:\s*(money|opportunities|scams|guides)/i);
  let body = raw
    .replace(/TITLE:\s*.+/i, '')
    .replace(/SUMMARY:\s*.+/i, '')
    .replace(/CATEGORY:\s*.+/i, '')
    .trim();
  if (!/<[a-z][\s\S]*>/i.test(body)) {
    body = body
      .split(/\n\n+/)
      .map((p) => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
      .join('\n');
  }
  body = body.replace(/<script[\s\S]*?<\/script>/gi, '');
  if (!/not financial advice/i.test(body)) {
    body +=
      '\n<h2>Disclaimer</h2>\n<p>This guide is educational only. It is not financial, investment, or legal advice. Results vary; never risk money you cannot afford to lose.</p>';
  }
  const category = (catMatch?.[1]?.toLowerCase() || 'guides') as AiDraft['category'];
  const title = (titleMatch?.[1] || fallbackTitle).trim().slice(0, 140);
  const summary = (
    summaryMatch?.[1] ||
    'Educational beginner guide with steps, optional tools, and safety notes — not financial advice.'
  )
    .trim()
    .slice(0, 280);
  return {
    title,
    summary,
    contentHtml: body,
    category,
    author_team: 'LaneCash Desk',
    model: 'unknown',
  };
}

export async function rewriteWithAi(context: string, seedTitle: string): Promise<AiDraft | null> {
  const cfModels = await listCloudflareModels();
  const orModels = await listOpenRouterModels();

  let partial = '';
  let usedModel = '';

  for (const model of cfModels) {
    const prompt = buildPrompt(context, partial || undefined);
    console.log('[ai] trying CF', model, partial ? '(continue)' : '(fresh)');
    const out = await cfRun(model, prompt, partial ? 900 : 1400);
    if (!out) continue;
    partial = partial ? `${partial}\n${out}` : out;
    usedModel = `cf:${model}`;
    if (/TITLE:/i.test(partial) && partial.length > 900) break;
  }

  if (partial.length < 600 || !/TITLE:/i.test(partial)) {
    for (const model of orModels.slice(0, 6)) {
      const prompt = buildPrompt(context, partial || undefined);
      console.log('[ai] trying OR', model, partial ? '(continue)' : '(fresh)');
      const out = await openRouterRun(model, prompt, partial ? 900 : 1400);
      if (!out) continue;
      partial = partial ? `${partial}\n${out}` : out;
      usedModel = `or:${model}`;
      if (/TITLE:/i.test(partial) && partial.length > 900) break;
    }
  }

  if (!partial || partial.trim().length < 200) {
    console.error('[ai] all models failed or returned empty');
    return null;
  }

  const draft = parseAiOutput(partial, seedTitle);
  draft.model = usedModel || 'mixed';
  console.log('[ai] draft ok', draft.title.slice(0, 60), 'model=', draft.model);
  return draft;
}
