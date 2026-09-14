/**
 * Research helpers that work from GitHub Actions (no brittle DDG HTML scrape).
 * Sources: DuckDuckGo Instant Answer JSON, Wikipedia, optional RSS.
 */

export type ResearchHit = {
  title: string;
  snippet: string;
  url: string;
  source: 'duckduckgo' | 'wikipedia' | 'tools' | 'rss';
};

export type ResearchPack = {
  query: string;
  hits: ResearchHit[];
  tools: ResearchHit[];
};

const SEED_QUERIES = [
  'free tools to make money online with only a phone',
  'beginner side hustles online skills no investment hype',
  'how to start freelancing with a smartphone',
  'affiliate marketing for beginners honest disclosures',
  'avoid online job scams telegram fake recruitment',
  'USDT P2P safety tips for beginners',
  'content creation CapCut Canva beginner workflow',
  'dropshipping product validation checklist',
  'build email list from zero free tools',
  'remote work scams how to verify employers',
  'digital product ideas for beginners small scope',
  'TikTok organic growth tips for new accounts',
  'YouTube Shorts beginner posting schedule',
  'YouTube algorithm basics retention hooks for beginners',
  'budgeting system weekly for irregular income',
  'airdrop crypto safety never share seed phrase',
];

const BLOCK =
  /\b(forex|fx trading|currency trading|binary options|prop firm challenge|guaranteed pips)\b/i;

function daySalt() {
  return Math.floor(Date.now() / 86400000);
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function pickQueries(n: number): string[] {
  const salt = daySalt();
  const hour = new Date().getUTCHours();
  const ranked = [...SEED_QUERIES].sort(
    (a, b) => hash(a + salt + hour) - hash(b + salt + hour)
  );
  // Keep queries short — long tails hurt search APIs
  return ranked.slice(0, n);
}

async function fetchJson(url: string, timeoutMs = 12000): Promise<any | null> {
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'LaneCashBot/1.0 (educational)',
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

async function fetchText(url: string, timeoutMs = 12000): Promise<string | null> {
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'LaneCashBot/1.0 (educational)',
        Accept: 'text/html,application/xml,application/json',
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!r.ok) return null;
    return await r.text();
  } catch {
    return null;
  }
}

function cleanHits(hits: ResearchHit[]): ResearchHit[] {
  return hits.filter((h) => h.title && !BLOCK.test(`${h.title} ${h.snippet}`));
}

/** DuckDuckGo Instant Answer API (JSON, works server-side) */
export async function searchDuckDuckGo(query: string, limit = 5): Promise<ResearchHit[]> {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
  const data = await fetchJson(url);
  if (!data) return [];
  const hits: ResearchHit[] = [];

  if (data.Heading && (data.AbstractText || data.Abstract)) {
    hits.push({
      title: String(data.Heading),
      snippet: String(data.AbstractText || data.Abstract || '').slice(0, 500),
      url: String(data.AbstractURL || data.SearchURL || `https://duckduckgo.com/?q=${encodeURIComponent(query)}`),
      source: 'duckduckgo',
    });
  }

  const related = data.RelatedTopics || [];
  for (const item of related) {
    if (hits.length >= limit) break;
    if (item.Topics && Array.isArray(item.Topics)) {
      for (const sub of item.Topics) {
        if (hits.length >= limit) break;
        if (sub.Text && sub.FirstURL) {
          hits.push({
            title: String(sub.Text).split(' - ')[0].slice(0, 120),
            snippet: String(sub.Text).slice(0, 300),
            url: String(sub.FirstURL),
            source: 'duckduckgo',
          });
        }
      }
    } else if (item.Text && item.FirstURL) {
      hits.push({
        title: String(item.Text).split(' - ')[0].slice(0, 120),
        snippet: String(item.Text).slice(0, 300),
        url: String(item.FirstURL),
        source: 'duckduckgo',
      });
    }
  }
  return cleanHits(hits).slice(0, limit);
}

export async function searchWikipedia(query: string, limit = 4): Promise<ResearchHit[]> {
  try {
    const openUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
      query
    )}&limit=${limit}&namespace=0&format=json&origin=*`;
    const data = await fetchJson(openUrl);
    if (!data) return [];
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
    // Enrich first result
    if (titles[0]) {
      const sum = await fetchJson(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titles[0].replace(/ /g, '_'))}`
      );
      if (sum?.extract && hits[0]) hits[0].snippet = String(sum.extract).slice(0, 700);
    }
    return cleanHits(hits);
  } catch {
    return [];
  }
}

/** Simple wiki search via media API as extra signal */
async function searchWikipediaFulltext(query: string, limit = 3): Promise<ResearchHit[]> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
    query
  )}&srlimit=${limit}&format=json&origin=*`;
  const data = await fetchJson(url);
  if (!data?.query?.search) return [];
  return cleanHits(
    data.query.search.map((s: any) => ({
      title: String(s.title),
      snippet: String(s.snippet || '')
        .replace(/<[^>]+>/g, ' ')
        .slice(0, 300),
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(String(s.title).replace(/ /g, '_'))}`,
      source: 'wikipedia' as const,
    }))
  );
}

export async function researchTopic(query: string): Promise<ResearchPack> {
  const toolQuery = `free tools ${query}`.slice(0, 100);
  const [ddg, wiki, wiki2, tools] = await Promise.all([
    searchDuckDuckGo(query, 5),
    searchWikipedia(query, 3),
    searchWikipediaFulltext(query, 3),
    searchDuckDuckGo(toolQuery, 4),
  ]);

  const seen = new Set<string>();
  const hits: ResearchHit[] = [];
  for (const h of [...ddg, ...wiki, ...wiki2]) {
    const k = h.title.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    hits.push(h);
    if (hits.length >= 8) break;
  }

  const toolHits = cleanHits(tools).map((t) => ({ ...t, source: 'tools' as const }));
  console.log(`[research] q="${query.slice(0, 50)}" hits=${hits.length} tools=${toolHits.length}`);
  return { query, hits, tools: toolHits };
}

export function packToContext(pack: ResearchPack): string {
  const lines: string[] = [
    `Primary topic / query: ${pack.query}`,
    'Write ONLY about this topic. Educational content. Not financial advice.',
    'Do not invent unrelated crypto deposit or airdrop sections unless the topic is about those risks.',
    '',
  ];
  if (pack.hits.length) {
    lines.push('Research sources:');
    for (const h of pack.hits.slice(0, 6)) {
      lines.push(`- (${h.source}) ${h.title}: ${h.snippet.slice(0, 240)} [${h.url}]`);
    }
  } else {
    lines.push(
      'No external search hits. Use general best-practice knowledge for this beginner topic. Be concrete and on-topic.'
    );
  }
  if (pack.tools.length) {
    lines.push('', 'Optional tools to mention (reader must verify):');
    for (const t of pack.tools.slice(0, 4)) {
      lines.push(`- ${t.title}: ${t.snippet.slice(0, 160)} [${t.url}]`);
    }
  }
  return lines.join('\n');
}
