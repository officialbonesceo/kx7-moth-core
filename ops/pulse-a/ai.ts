/**
 * AI rewrite: Cloudflare first, OpenRouter fallback, continue mid-fail.
 * Must stay ON-TOPIC for the research query. No generic checklist paste.
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

const SYSTEM = `You write practical educational guides.
Rules:
- NOT financial, investment, or income-guarantee advice.
- Stay strictly on the topic of the research query. If the topic is YouTube algorithm, write only about YouTube packaging, retention, posting — do NOT paste unrelated crypto, airdrop, or deposit-scam checklists.
- Every section must clearly connect to the topic.
- No boilerplate that could apply to any article unchanged.
- HTML only: h2, p, ul, ol, li, a.
- Build beginner confidence with specific, topic-relevant steps.`;

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

async function cfRun(model: string, prompt: string, maxTokens = 1200): Promise<string | null> {
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
    return `Continue this ON-TOPIC educational guide. Do not change subject. No generic money-scam boilerplate unless the topic is scams.

Partial so far:
${partial.slice(0, 6000)}

Research:
${context.slice(0, 3500)}

Continue in HTML only.`;
  }
  return `Write ONE complete beginner educational guide that matches the research topic exactly.

Hard rules:
- On-topic only (e.g. YouTube guide = YouTube steps, not crypto deposits)
- NOT financial advice; no guaranteed income
- Specific steps for THIS topic

Format:
TITLE: ...
SUMMARY: ...
CATEGORY: money|opportunities|scams|guides
Then HTML sections relevant to the topic, including a short Disclaimer (educational only, not financial advice).

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
      '\n<h2>Disclaimer</h2>\n<p>This guide is educational only. It is not financial, investment, or legal advice.</p>';
  }
  return {
    title: (titleMatch?.[1] || fallbackTitle).trim().slice(0, 140),
    summary: (summaryMatch?.[1] || 'Educational beginner guide — not financial advice.')
      .trim()
      .slice(0, 280),
    contentHtml: body,
    category: (catMatch?.[1]?.toLowerCase() || 'guides') as AiDraft['category'],
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
    console.log('[ai] trying CF', model, partial ? '(continue)' : '(fresh)');
    const out = await cfRun(model, buildPrompt(context, partial || undefined), partial ? 900 : 1400);
    if (!out) continue;
    partial = partial ? `${partial}\n${out}` : out;
    usedModel = `cf:${model}`;
    if (/TITLE:/i.test(partial) && partial.length > 900) break;
  }

  if (partial.length < 600 || !/TITLE:/i.test(partial)) {
    for (const model of orModels.slice(0, 6)) {
      console.log('[ai] trying OR', model, partial ? '(continue)' : '(fresh)');
      const out = await openRouterRun(
        model,
        buildPrompt(context, partial || undefined),
        partial ? 900 : 1400
      );
      if (!out) continue;
      partial = partial ? `${partial}\n${out}` : out;
      usedModel = `or:${model}`;
      if (/TITLE:/i.test(partial) && partial.length > 900) break;
    }
  }

  if (!partial || partial.trim().length < 200) {
    console.error('[ai] all models failed');
    return null;
  }
  const draft = parseAiOutput(partial, seedTitle);
  draft.model = usedModel || 'mixed';
  console.log('[ai] draft ok', draft.title.slice(0, 60), draft.model);
  return draft;
}
