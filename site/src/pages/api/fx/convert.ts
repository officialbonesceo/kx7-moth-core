import type { APIRoute } from 'astro';

export const prerender = false;

const CACHE_MS = 5 * 60_000; // 5 minutes
const tableCache = new Map<string, { at: number; rates: Record<string, number>; source: string; date: string }>();

const POPULAR = [
  'USD', 'NGN', 'EUR', 'GBP', 'KWD', 'AED', 'SAR', 'QAR', 'BHD', 'OMR',
  'CAD', 'AUD', 'CHF', 'JPY', 'CNY', 'INR', 'GHS', 'KES', 'ZAR', 'TRY',
  'EGP', 'XOF', 'XAF', 'USDT',
];

export const GET: APIRoute = async ({ url }) => {
  const from = norm(url.searchParams.get('from') || 'USD');
  const to = norm(url.searchParams.get('to') || 'NGN');
  const amount = Math.max(0, Number(url.searchParams.get('amount') || 1) || 1);

  if (from === to) {
    return json({
      from,
      to,
      amount,
      rate: 1,
      result: amount,
      source: 'identity',
      date: new Date().toISOString().slice(0, 10),
      cached: false,
      popular: POPULAR,
    });
  }

  const table = await getUsdTable();
  if (!table) {
    return json({ error: 'rates_unavailable', from, to, amount }, 503);
  }

  const rate = cross(table.rates, from, to);
  if (rate == null || !Number.isFinite(rate) || rate <= 0) {
    return json({
      error: 'pair_unavailable',
      from,
      to,
      amount,
      available: Object.keys(table.rates).sort(),
      source: table.source,
    }, 400);
  }

  return json({
    from,
    to,
    amount,
    rate,
    result: amount * rate,
    inverse: rate ? 1 / rate : 0,
    source: table.source,
    date: table.date,
    cached: table.cached,
    popular: POPULAR,
  });
};

function norm(c: string) {
  return String(c || '').trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6) || 'USD';
}

/** rates map is always vs USD (1 USD = rates[CODE]) */
function cross(rates: Record<string, number>, from: string, to: string): number | null {
  const rFrom = from === 'USD' ? 1 : rates[from];
  const rTo = to === 'USD' ? 1 : rates[to];
  if (rFrom == null || rTo == null || rFrom <= 0) return null;
  // amount_from * (USD per from) * (to per USD) = amount_to
  // rates[X] = units of X per 1 USD
  // 1 FROM = (1/rFrom) USD = (rTo/rFrom) TO
  return rTo / rFrom;
}

async function getUsdTable() {
  const hit = tableCache.get('USD');
  if (hit && Date.now() - hit.at < CACHE_MS) {
    return { ...hit, cached: true as const };
  }

  let data = await fetchExchangeRateFun();
  if (!data) data = await fetchOpenErApi();
  if (!data) return null;

  // ensure USD = 1
  data.rates.USD = 1;
  // USDT ≈ USD for educational estimate
  if (data.rates.USDT == null) data.rates.USDT = 1;

  tableCache.set('USD', { at: Date.now(), rates: data.rates, source: data.source, date: data.date });
  return { rates: data.rates, source: data.source, date: data.date, cached: false as const };
}

async function fetchExchangeRateFun() {
  try {
    const r = await fetch('https://api.exchangerate.fun/latest?base=USD', {
      headers: { Accept: 'application/json', 'User-Agent': 'LaneCash/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return null;
    const j = await r.json();
    const rates = j?.rates;
    if (!rates || typeof rates !== 'object' || !rates.NGN) return null;
    const cleaned: Record<string, number> = {};
    for (const [k, v] of Object.entries(rates)) {
      const n = Number(v);
      if (n > 0) cleaned[String(k).toUpperCase()] = n;
    }
    return {
      rates: cleaned,
      source: 'exchangerate.fun',
      date: j.date || new Date().toISOString().slice(0, 10),
    };
  } catch {
    return null;
  }
}

async function fetchOpenErApi() {
  try {
    const r = await fetch('https://open.er-api.com/v6/latest/USD', {
      headers: { Accept: 'application/json', 'User-Agent': 'LaneCash/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return null;
    const j = await r.json();
    const rates = j?.rates;
    if (!rates || !rates.NGN) return null;
    const cleaned: Record<string, number> = {};
    for (const [k, v] of Object.entries(rates)) {
      const n = Number(v);
      if (n > 0) cleaned[String(k).toUpperCase()] = n;
    }
    return {
      rates: cleaned,
      source: 'open.er-api.com',
      date: (j.time_last_update_utc || '').slice(0, 16) || new Date().toISOString().slice(0, 10),
    };
  } catch {
    return null;
  }
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
