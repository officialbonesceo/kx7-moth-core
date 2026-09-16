import type { APIRoute } from 'astro';

export const prerender = false;

const CACHE_MS = 60_000;
let cache: { at: number; data: any } | null = null;

export const GET: APIRoute = async ({ url }) => {
  const amount = Math.max(0, Number(url.searchParams.get('amount') || 1) || 1);

  if (cache && Date.now() - cache.at < CACHE_MS) {
    return json({ ...scale(cache.data, amount), cached: true });
  }

  let data = await fromExchangeRateFun();
  if (!data) data = await fromOpenErApi();
  if (!data) data = await fromFrankfurterViaEur();
  if (!data) {
    data = { usd_ngn: 1330, source: 'estimate', date: new Date().toISOString().slice(0, 10) };
    return json({ ...scale(data, amount), cached: false }, 200);
  }

  cache = { at: Date.now(), data };
  return json({ ...scale(data, amount), cached: false });
};

async function fromExchangeRateFun() {
  try {
    const r = await fetch('https://api.exchangerate.fun/latest?base=USD', {
      headers: { Accept: 'application/json', 'User-Agent': 'LaneCash/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return null;
    const j = await r.json();
    const rate = Number(j?.rates?.NGN);
    if (!rate || rate < 100) return null;
    return {
      usd_ngn: rate,
      source: 'exchangerate.fun',
      date: j.date || new Date().toISOString().slice(0, 10),
    };
  } catch {
    return null;
  }
}

async function fromOpenErApi() {
  try {
    const r = await fetch('https://open.er-api.com/v6/latest/USD', {
      headers: { Accept: 'application/json', 'User-Agent': 'LaneCash/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return null;
    const j = await r.json();
    const rate = Number(j?.rates?.NGN);
    if (!rate || rate < 100) return null;
    return {
      usd_ngn: rate,
      source: 'open.er-api.com',
      date: (j.time_last_update_utc || '').slice(0, 16) || new Date().toISOString().slice(0, 10),
    };
  } catch {
    return null;
  }
}

/** ECB basket may lack NGN; try USD via EUR cross if present */
async function fromFrankfurterViaEur() {
  try {
    const r = await fetch('https://api.frankfurter.dev/v1/latest?base=USD&symbols=NGN', {
      headers: { Accept: 'application/json', 'User-Agent': 'LaneCash/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return null;
    const j = await r.json();
    const rate = Number(j?.rates?.NGN);
    if (!rate || rate < 100) return null;
    return {
      usd_ngn: rate,
      source: 'frankfurter',
      date: j.date || new Date().toISOString().slice(0, 10),
    };
  } catch {
    return null;
  }
}

function scale(data: any, amount: number) {
  const rate = Number(data.usd_ngn);
  return {
    amount,
    usd_ngn: rate,
    ngn_total: rate * amount,
    usd_total: amount,
    inverse_ngn_usd: rate ? 1 / rate : 0,
    source: data.source,
    date: data.date,
  };
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=60',
      'access-control-allow-origin': '*',
    },
  });
}
