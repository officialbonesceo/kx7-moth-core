/**
 * Lightweight free research: DuckDuckGo + Wikipedia (+ tool-focused queries).
 * No paid Google API. Fresh query strings each run; caller dedupes titles in D1.
 */

export type ResearchHit = {
  title: string;
  snippet: string;
  url: string;
  source: 'duckduckgo' | 'wikipedia' | 'tools';
};

export type ResearchPack = {
  query: string;
  hits: ResearchHit[];
  tools: ResearchHit[];
};

const SEED_QUERIES = [
  'free tools to make money online with only a phone',
  'beginner side hustles online no investment',
  'how to start freelancing with a smartphone',
  'affiliate marketing for beginners free methods',
  'avoid online job scams telegram fake recruitment',
  'USDT P2P safety tips for beginners',
  'content creation CapCut Canva beginner workflow',
  'dropshipping product validation checklist',
  'build email list from zero free tools',
  'remote work scams how to verify employers',
  'digital product ideas for beginners small scope',
  'TikTok organic growth tips for new accounts',
  'YouTube Shorts beginner posting schedule',
  'budgeting system weekly for irregular income',
  'airdrop crypto safety never share seed phrase',
];

function daySalt() {
  return Math.floor(Date.now() / 86400000);
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Rotate queries so each run is not identical */
export function pickQueries(n: number): string[] {
  const salt = daySalt();
  const hour = new Date().getUTCHours();
  const ranked = [...SEED_QUERIES].sort(
    (a, b) => hash(a + salt + hour) - hash(b + salt + hour)
  );
  // slight freshness: append year + "beginner guide"
  return ranked.slice(0, n).map((q) => `${q} ${new Date().getUTCFullYear()} beginner`);
}

async function fetchText(url: string, timeoutMs = 12000): Promise<string | null> {
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'LaneCashBot/1.0 (educational; +https://github.com/officialbonesceo/kx7-moth-core)',
        Accept: 'text/html,application/json',
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!r.ok) return null;
    return await r.text();
  } catch {
    return null;
  }
}

function stripHtml(s: string) {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** DuckDuckGo HTML results (no API key) */
export async function searchDuckDuckGo(query: string, limit = 5): Promise<ResearchHit[]> {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  const html = await fetchText(url);
  if (!html) return [];
  const hits: ResearchHit[] = [];
  const re =
    /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?(?:class="result__snippet"[^>]*>([\s\S]*?)<\/a>|class="result__snippet"[^>]*>([\s\S]*?)<\/td>)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) && hits.length < limit) {
    const href = m[1];
    const title = stripHtml(m[2] || '');
    const snippet = stripHtml(m[3] || m[4] || '');
    if (!title || !href) continue;
    hits.push({ title, snippet, url: href, source: 'duckduckgo' });
  }
  // Fallback simpler parse
  if (!hits.length) {
    const simple = /class="result__a"[^>]*href="([^"]+)"[^>]*>([^<]+)/gi;
    while ((m = simple.exec(html)) && hits.length < limit) {
      hits.push({
        title: stripHtml(m[2]),
        snippet: '',
        url: m[1],
        source: 'duckduckgo',
      });
    }
  }
  return hits;
}

/** Wikipedia opensearch + summary */
export async function searchWikipedia(query: string, limit = 3): Promise<ResearchHit[]> {
  try {
    const openUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
      query
    )}&limit=${limit}&namespace=0&format=json`;
    const raw = await fetchText(openUrl);
    if (!raw) return [];
    const data = JSON.parse(raw);
    const titles: string[] = data[1] || [];
    const descs: string[] = data[2] || [];
    const urls: string[] = data[3] || [];
    const hits: ResearchHit[] = [];
    for (let i = 0; i < titles.length; i++) {
      hits.push({
        title: titles[i],
        snippet: descs[i] || '',
        url: urls[i] || '',
        source: 'wikipedia',
      });
    }
    // Enrich first with extract
    if (titles[0]) {
      const sumUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        titles[0].replace(/ /g, '_')
      )}`;
      const sumRaw = await fetchText(sumUrl);
      if (sumRaw) {
        try {
          const sum = JSON.parse(sumRaw);
          if (sum.extract && hits[0]) hits[0].snippet = String(sum.extract).slice(0, 600);
        } catch {}
      }
    }
    return hits;
  } catch {
    return [];
  }
}

export async function researchTopic(query: string): Promise<ResearchPack> {
  const toolQuery = `best free tools for ${query}`.slice(0, 120);
  const [ddg, wiki, tools] = await Promise.all([
    searchDuckDuckGo(query, 5),
    searchWikipedia(query, 2),
    searchDuckDuckGo(toolQuery, 4),
  ]);
  const hits = [...ddg, ...wiki].slice(0, 8);
  const toolHits = tools.map((t) => ({ ...t, source: 'tools' as const }));
  console.log(
    `[research] q="${query.slice(0, 60)}" hits=${hits.length} tools=${toolHits.length}`
  );
  return { query, hits, tools: toolHits };
}

export function packToContext(pack: ResearchPack): string {
  const lines: string[] = [`Research query: ${pack.query}`, '', 'Sources:'];
  for (const h of pack.hits.slice(0, 6)) {
    lines.push(`- (${h.source}) ${h.title}: ${h.snippet.slice(0, 220)} [${h.url}]`);
  }
  if (pack.tools.length) {
    lines.push('', 'Possible tools to mention (verify free tier yourself):');
    for (const t of pack.tools.slice(0, 4)) {
      lines.push(`- ${t.title}: ${t.snippet.slice(0, 160)} [${t.url}]`);
    }
  }
  return lines.join('\n');
}
