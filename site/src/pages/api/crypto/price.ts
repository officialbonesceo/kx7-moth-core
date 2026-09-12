import type { APIRoute } from 'astro';

export const prerender = false;

const CACHE_MS = 45_000;
const cache = new Map<string, { at: number; data: any }>();

const IDS: Record<string, string> = {
  bitcoin: 'bitcoin',
  ethereum: 'ethereum',
  tether: 'tether',
  btc: 'bitcoin',
  eth: 'ethereum',
  usdt: 'tether',
};

const BINANCE_SYM: Record<string, string> = {
  bitcoin: 'BTCUSDT',
  ethereum: 'ETHUSDT',
  tether: 'USDTUSDT',
};

export const GET: APIRoute = async ({ url }) => {
  const raw = (url.searchParams.get('id') || 'tether').toLowerCase();
  const id = IDS[raw] || 'tether';
  const qty = Math.max(0, Number(url.searchParams.get('qty') || 1) || 1);

  const hit = cache.get(id);
  if (hit && Date.now() - hit.at < CACHE_MS) {
    return json({ ...scale(hit.data, qty), cached: true });
  }

  let data = await fromCoinGecko(id);
  if (!data) data = await fromBinance(id);
  if (!data) {
    data = fallback(id);
    return json({ ...scale(data, qty), source: 'estimate', cached: false }, 200);
  }

  cache.set(id, { at: Date.now(), data });
  return json({ ...scale(data, qty), cached: false });
};

async function fromCoinGecko(id: string) {
  try {
    const r = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd,ngn`,
      { headers: { Accept: 'application/json', 'User-Agent': 'LaneCash/1.0' }, signal: AbortSignal.timeout(8000) }
    );
    if (!r.ok) return null;
    const j = await r.json();
    if (!j[id]?.usd && j[id]?.usd !== 0) return null;
    return {
      id,
      usd: Number(j[id].usd),
      ngn: Number(j[id].ngn || j[id].usd * 1600),
      source: 'coingecko',
    };
  } catch {
    return null;
  }
}

async function fromBinance(id: string) {
  try {
    if (id === 'tether') {
      return { id, usd: 1, ngn: 1600, source: 'binance-peg' };
    }
    const sym = BINANCE_SYM[id];
    if (!sym) return null;
    const r = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${sym}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return null;
    const j = await r.json();
    const usd = Number(j.price);
    if (!usd) return null;
    // rough NGN via static peg when CG fails — still better than nothing
    return { id, usd, ngn: usd * 1600, source: 'binance' };
  } catch {
    return null;
  }
}

function fallback(id: string) {
  const map: Record<string, { usd: number; ngn: number }> = {
    bitcoin: { usd: 95000, ngn: 95000 * 1600 },
    ethereum: { usd: 3500, ngn: 3500 * 1600 },
    tether: { usd: 1, ngn: 1600 },
  };
  const m = map[id] || map.tether;
  return { id, usd: m.usd, ngn: m.ngn, source: 'estimate' };
}

function scale(data: any, qty: number) {
  return {
    id: data.id,
    qty,
    usd: data.usd,
    ngn: data.ngn,
    total_usd: data.usd * qty,
    total_ngn: data.ngn * qty,
    source: data.source,
  };
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=30',
    },
  });
}
