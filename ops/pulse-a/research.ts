/**
 * Research helpers — niche focused: scam defence, naira money habits, phone skills.
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

/** Narrow LaneCash niche — scam defence + safe money + practical phone skills */
const SEED_QUERIES = [
  'WhatsApp Telegram remote job activation fee scams Nigeria how to verify',
  'fake FIRS NRS recruitment messages Nigeria how to spot',
  'fake investment apps deposit ladder trap Nigeria walk away',
  'crypto recovery agent scams after a loss what to do',
  'BVN OTP sharing risks job offer Nigeria',
  'P2P crypto escrow pressure plays beginner safety Nigeria',
  'fake airdrop comment your wallet traps educational',
  'weekly budget in naira irregular income beginner system',
  'Opay Moniepoint Kuda fees for receiving payments Nigeria',
  'how to verify employer before sharing ID documents Nigeria',
  'Canva phone flyer service pricing for beginners Nigeria',
  'online tutoring one subject WAEC JAMB phone setup',
  'ghostwriting first paid job Nigeria portfolio outreach',
  'market run personal shopping side income fees trust Nigeria',
  'paid app testing microtasks vs course access fee scams',
  'student side income without inventory Nigeria realistic',
  'how to mute scam recruiters on social media practical',
  'POS agent float costs and hidden charges Nigeria educational',
];

const BLOCK =
  /\b(forex signal|binary options|prop firm challenge|guaranteed pips|get rich in 7 days)\b/i;

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
  const ranked = [...SEED_QUERIES].sort((a, b) => hash(a + salt + hour) - hash(b + salt + hour));
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

function cleanHits(hits: ResearchHit[]): ResearchHit[] {
  return hits.filter((h) => h.title && !BLOCK.test(`${h.title} ${h.snippet}`));
}

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
    'LaneCash niche: Nigeria scam defence, safe money habits, practical phone skills.',
    'Do not invent unrelated get-rich schemes. Prefer checklists and red/green flags.',
    'Use Nigeria-relevant examples when natural (WhatsApp, BVN, naira, Opay) without inventing laws.',
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
