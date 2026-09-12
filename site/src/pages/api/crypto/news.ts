import type { APIRoute } from 'astro';

export const prerender = false;

const CACHE_MS = 5 * 60_000;
let cache: { at: number; items: any[] } | null = null;

export const GET: APIRoute = async ({ locals }) => {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return json({ items: cache.items, cached: true });
  }

  const env = (locals as any).runtime?.env || {};
  const token = env.CRYPTOPANIC_TOKEN || '';

  const pools = await Promise.all([
    token ? fromCryptoPanic(token) : Promise.resolve([]),
    fromFreeNews(),
    fromReddit(),
    fromFearGreed(),
  ]);

  const merged: any[] = [];
  const seen = new Set<string>();
  for (const list of pools) {
    for (const it of list) {
      const key = (it.title || '').toLowerCase().slice(0, 80);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      merged.push(it);
    }
  }

  if (!merged.length) {
    merged.push(
      {
        title: 'Airdrop safety: verify before you connect a wallet',
        url: '/?tab=scams',
        source: 'LaneCash',
        published: new Date().toISOString(),
      },
      {
        title: 'USDT P2P release rules that prevent common chat scams',
        url: '/?tab=crypto',
        source: 'LaneCash',
        published: new Date().toISOString(),
      }
    );
  }

  cache = { at: Date.now(), items: merged.slice(0, 15) };
  return json({ items: cache.items, cached: false });
};

async function fromCryptoPanic(token: string) {
  try {
    const url = `https://cryptopanic.com/api/developer/v2/posts/?auth_token=${encodeURIComponent(token)}&public=true&currencies=BTC,ETH,USDT`;
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) return [];
    const j = await r.json();
    const results = j.results || [];
    return results.slice(0, 10).map((p: any) => ({
      title: p.title,
      url: p.url || p.original_url || 'https://cryptopanic.com',
      source: p.source?.title || 'CryptoPanic',
      published: p.published_at || null,
    }));
  } catch {
    return [];
  }
}

async function fromFreeNews() {
  const endpoints = [
    'https://cryptocurrency.cv/api/news?limit=12',
    'https://min-api.cryptocompare.com/data/v2/news/?lang=EN',
  ];
  for (const endpoint of endpoints) {
    try {
      const r = await fetch(endpoint, {
        headers: { Accept: 'application/json', 'User-Agent': 'LaneCash/1.0' },
        signal: AbortSignal.timeout(8000),
      });
      if (!r.ok) continue;
      const j = await r.json();
      if (Array.isArray(j?.Data)) {
        return j.Data.slice(0, 12).map((p: any) => ({
          title: p.title,
          url: p.url || p.guid || '#',
          source: p.source_info?.name || p.source || 'CryptoCompare',
          published: p.published_on ? new Date(p.published_on * 1000).toISOString() : null,
        }));
      }
      const list = Array.isArray(j) ? j : j.data || j.articles || j.news || j.items || [];
      if (list.length) {
        return list.slice(0, 12).map((p: any) => ({
          title: p.title || p.headline,
          url: p.url || p.link || '#',
          source: p.source || p.publisher || 'Crypto News',
          published: p.published_at || p.date || null,
        }));
      }
    } catch {
      /* try next */
    }
  }
  return [];
}

async function fromReddit() {
  try {
    const r = await fetch('https://www.reddit.com/r/CryptoCurrency/hot.json?limit=8',
      { headers: { Accept: 'application/json', 'User-Agent': 'LaneCash/1.0' }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return [];
    const j = await r.json();
    const children = j?.data?.children || [];
    return children
      .map((c: any) => c.data)
      .filter((d: any) => d && !d.stickied && d.title)
      .slice(0, 6)
      .map((d: any) => ({
        title: d.title,
        url: d.url?.startsWith('http') ? d.url : `https://reddit.com${d.permalink}`,
        source: 'r/CryptoCurrency',
        published: d.created_utc ? new Date(d.created_utc * 1000).toISOString() : null,
      }));
  } catch {
    return [];
  }
}

async function fromFearGreed() {
  try {
    const r = await fetch('https://api.alternative.me/fng/?limit=1', { signal: AbortSignal.timeout(5000) });
    if (!r.ok) return [];
    const j = await r.json();
    const d = j?.data?.[0];
    if (!d) return [];
    return [
      {
        title: `Crypto Fear & Greed Index: ${d.value} (${d.value_classification})`,
        url: 'https://alternative.me/crypto/fear-and-greed-index/',
        source: 'alternative.me',
        published: d.timestamp ? new Date(Number(d.timestamp) * 1000).toISOString() : null,
      },
    ];
  } catch {
    return [];
  }
}

function json(data: any) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=60' },
  });
}
