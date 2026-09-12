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

  let items: any[] = [];

  // 1) CryptoPanic if token set
  if (token) {
    items = await fromCryptoPanic(token);
  }

  // 2) Free public crypto news fallback
  if (!items.length) {
    items = await fromFreeNews();
  }

  // 3) Static educational fallback
  if (!items.length) {
    items = [
      {
        title: 'How to spot fake investment apps targeting Nigerians',
        url: '/?tab=scams',
        source: 'LaneCash',
        published: new Date().toISOString(),
      },
      {
        title: 'USDT from zero: fees, P2P risks, and safe storage',
        url: '/?tab=crypto',
        source: 'LaneCash',
        published: new Date().toISOString(),
      },
    ];
  }

  cache = { at: Date.now(), items: items.slice(0, 12) };
  return json({ items: cache.items, cached: false });
};

async function fromCryptoPanic(token: string) {
  try {
    const url = `https://cryptopanic.com/api/developer/v2/posts/?auth_token=${encodeURIComponent(token)}&public=true&currencies=BTC,ETH,USDT&filter=important`;
    const r = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!r.ok) return [];
    const j = await r.json();
    const results = j.results || j.posts || [];
    return results.slice(0, 12).map((p: any) => ({
      title: p.title || p.slug || 'Crypto update',
      url: p.url || p.original_url || 'https://cryptopanic.com',
      source: p.source?.title || 'CryptoPanic',
      published: p.published_at || p.created_at || null,
      kind: 'cryptopanic',
    }));
  } catch {
    return [];
  }
}

async function fromFreeNews() {
  try {
    // Public free crypto news aggregator (no key)
    const r = await fetch('https://cryptocurrency.cv/api/news?limit=12', {
      headers: { Accept: 'application/json', 'User-Agent': 'LaneCash/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return [];
    const j = await r.json();
    const list = Array.isArray(j) ? j : j.data || j.articles || j.news || j.items || [];
    return list.slice(0, 12).map((p: any) => ({
      title: p.title || p.headline || 'Crypto news',
      url: p.url || p.link || p.source_url || '#',
      source: p.source || p.publisher || 'Crypto News',
      published: p.published_at || p.date || p.published || null,
      kind: 'public',
    }));
  } catch {
    return [];
  }
}

function json(data: any) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=60',
    },
  });
}
