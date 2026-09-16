import type { APIRoute } from 'astro';

export const prerender = false;

/** Server cache — one upstream call serves all visitors for a few minutes */
const CACHE_MS = 5 * 60_000;
let cache: { at: number; data: RatesPayload } | null = null;

export type RatesPayload = {
  base: string;
  date: string;
  source: string;
  rates: Record<string, number>;
};

export const GET: APIRoute = async () => {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return json({ ...cache.data, cached: true });
  }

  let data = await fromOpenErApi();
  if (!data) data = await fromExchangeRateFun();
  if (!data) {
    return json(
      {
        base: 'USD',
        date: new Date().toISOString().slice(0, 10),
        source: 'unavailable',
        rates: { USD: 1, NGN: 1330 },
        cached: false,
        error: 'upstream_unavailable',
      },
      200
    );
  }

  cache = { at: Date.now(), data };
  return json({ ...data, cached: false });
};

async function fromOpenErApi(): Promise<RatesPayload | null> {
  try {
    const r = await fetch('https://open.er-api.com/v6/latest/USD', {
      headers: { Accept: 'application/json', 'User-Agent': 'LaneCash/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return null;
    const j = await r.json();
    if (j.result !== 'success' || !j.rates) return null;
    const rates = normalizeRates(j.rates);
    if (!rates.NGN) return null;
    return {
      base: 'USD',
      date: (j.time_last_update_utc || '').slice(0, 25) || new Date().toISOString(),
      source: 'open.er-api.com',
      rates,
    };
  } catch {
    return null;
  }
}

async function fromExchangeRateFun(): Promise<RatesPayload | null> {
  try {
    const r = await fetch('https://api.exchangerate.fun/latest?base=USD', {
      headers: { Accept: 'application/json', 'User-Agent': 'LaneCash/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return null;
    const j = await r.json();
    if (!j.rates) return null;
    const rates = normalizeRates(j.rates);
    if (!rates.NGN) return null;
    return {
      base: 'USD',
      date: j.date || new Date().toISOString().slice(0, 10),
      source: 'exchangerate.fun',
      rates,
    };
  } catch {
    return null;
  }
}

function normalizeRates(raw: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = { USD: 1 };
  for (const [k, v] of Object.entries(raw)) {
    const code = String(k).toUpperCase();
    const n = Number(v);
    if (code && n > 0 && Number.isFinite(n)) out[code] = n;
  }
  out.USD = 1;
  return out;
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=120',
      'access-control-allow-origin': '*',
    },
  });
}
