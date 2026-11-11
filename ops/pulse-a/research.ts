/**
 * Research helpers — long-tail Nigeria money topics, multi-source interest signals.
 * Prefer less competitive phrases; score queries before writing.
 */

export type ResearchHit = {
  title: string;
  snippet: string;
  url: string;
  source: 'duckduckgo' | 'wikipedia' | 'tools' | 'rss' | 'suggest';
};

export type ResearchPack = {
  query: string;
  hits: ResearchHit[];
  tools: ResearchHit[];
  signalScore?: number;
};

/** Long-tail, student/Nigeria-specific — avoid one-word competitive head terms */
const SEED_QUERIES = [
  // Money habits (long-tail)
  'how Nigerian students budget irregular allowance weekly without an app',
  'seven small habits that quietly drain campus savings in Nigeria',
  'how to build a five thousand naira emergency buffer on campus',
  'Opay vs Moniepoint fees when friends send you school money',
  'how to keep hustle money separate from food money on one phone',
  // Earning (specific offers, not generic "make money online")
  'how to sell one-page Canva flyers for church and campus events Nigeria',
  'pricing a CapCut short video edit for local business WhatsApp clients',
  'online tutoring one WAEC subject from phone realistic first week plan',
  'personal shopping market run side income Lagos or campus city fees trust',
  'ghostwriting short bio for small business first paid order Nigeria',
  'airtime data resale for beginners margins and common losses Nigeria',
  'how students earn three to ten thousand naira weekly under five thousand capital',
  // Scam defence (specific situations, not only FG grant)
  'POS agent says send school fees to this account red flags Nigeria',
  'pay small small campus loan daily interest traps what to refuse',
  'WhatsApp remote job asks activation fee before first task Nigeria',
  'fake investment app shows profit then demands withdrawal tax Nigeria',
  'how to refuse BVN OTP requests from job offer chats Nigeria',
  'how to verify a hiring manager before sending ID photos Nigeria',
  'crypto recovery agent after a loss never send more money Nigeria',
  // Grants — only occasional long-tail variants (not every run)
  'how to read an official FG youth support page without paying a WhatsApp agent',
  // Skills
  'first paid Canva design job portfolio on phone only Nigeria',
  'student side income without buying inventory realistic Nigeria plan',
];

/** Phrases already over-published — soft-ban in ranking */
const OVERUSED =
  /\bfg\b.*grant|youth grant|50\s*k|50000|firs\s*recruit|activation fee scam|app testing/i;

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

function longTailBonus(q: string) {
  const words = q.trim().split(/\s+/).length;
  // Prefer 8–16 word queries (lower competition long-tail)
  if (words >= 8 && words <= 18) return 25;
  if (words >= 6) return 12;
  return 0;
}

export function pickQueries(n: number): string[] {
  const salt = daySalt();
  const hour = new Date().getUTCHours();
  const scored = SEED_QUERIES.map((q) => {
    let s = (hash(q + salt + hour) % 40) + longTailBonus(q);
    if (OVERUSED.test(q)) s -= 35; // deprioritize overused grant/FIRS style
    if (/budget|habit|buffer|Canva|CapCut|tutoring|POS agent|pay small/i.test(q)) s += 15;
    return { q, s };
  }).sort((a, b) => b.s - a.s);

  return scored.slice(0, Math.max(n, 10)).map((x) => x.q);
}

async function fetchJson(url: string, timeoutMs = 12000): Promise<any | null> {
  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'LaneCashBot/1.1 (educational)',
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

/** DuckDuckGo Instant Answer + related topics (proxy for interest breadth) */
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

/** Free autocomplete-style signal via DuckDuckGo related searches HTML is blocked; use Wikipedia + DDG only */
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

/** Wikimedia search as extra signal (count of hits ≈ topic exists in public knowledge) */
async function searchWikimediaSuggest(query: string): Promise<ResearchHit[]> {
  const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
    query.split(' ').slice(0, 6).join(' ')
  )}&limit=5&namespace=0&format=json&origin=*`;
  const data = await fetchJson(url);
  if (!data) return [];
  const titles: string[] = data[1] || [];
  const urls: string[] = data[3] || [];
  return titles.map((t, i) => ({
    title: t,
    snippet: 'suggest',
    url: urls[i] || '',
    source: 'suggest' as const,
  }));
}

/** Rough multi-source interest score: more independent hits = safer educational topic */
export function scoreTopicInterest(hits: ResearchHit[], tools: ResearchHit[]): number {
  let score = 0;
  score += Math.min(hits.length, 8) * 8;
  score += Math.min(tools.length, 4) * 3;
  const sources = new Set(hits.map((h) => h.source));
  score += sources.size * 10;
  // Prefer topics with at least some public text, not empty research
  if (hits.length === 0) score -= 20;
  return score;
}

export async function researchTopic(query: string): Promise<ResearchPack> {
  const toolQuery = `Nigeria ${query}`.slice(0, 100);
  const [ddg, wiki, wiki2, tools, suggest] = await Promise.all([
    searchDuckDuckGo(query, 6),
    searchWikipedia(query, 3),
    searchWikipediaFulltext(query, 3),
    searchDuckDuckGo(toolQuery, 4),
    searchWikimediaSuggest(query),
  ]);

  const seen = new Set<string>();
  const hits: ResearchHit[] = [];
  for (const h of [...ddg, ...wiki, ...wiki2, ...suggest]) {
    const k = h.title.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    hits.push(h);
    if (hits.length >= 10) break;
  }

  const toolHits = cleanHits(tools).map((t) => ({ ...t, source: 'tools' as const }));
  const signalScore = scoreTopicInterest(hits, toolHits) + longTailBonus(query);
  console.log(
    `[research] q="${query.slice(0, 55)}" hits=${hits.length} tools=${toolHits.length} signal=${signalScore}`
  );
  return { query, hits, tools: toolHits, signalScore };
}

export function packToContext(pack: ResearchPack): string {
  const lines: string[] = [
    `Primary topic / query: ${pack.query}`,
    'Write ONLY about this topic. Educational content. Not financial advice.',
    'LaneCash niche: Nigeria money habits, practical phone skills, scam defence, student earning.',
    'Target long-tail phrasing in the title (specific situation, not generic "make money online").',
    'If research is thin, still write a practical checklist from general safe practice — do not invent laws or fees.',
    'Do not invent get-rich schemes. Prefer steps, red flags, and realistic naira ranges when you give examples.',
    `Interest signal (internal): ${pack.signalScore ?? 0}`,
    '',
  ];
  if (pack.hits.length) {
    lines.push('Research sources (paraphrase only):');
    for (const h of pack.hits.slice(0, 6)) {
      lines.push(`- (${h.source}) ${h.title}: ${h.snippet.slice(0, 220)} [${h.url}]`);
    }
  } else {
    lines.push(
      'No external search hits. Use general best-practice knowledge for this beginner topic. Be concrete and on-topic.'
    );
  }
  if (pack.tools.length) {
    lines.push('', 'Optional tools to mention (reader must verify):');
    for (const t of pack.tools.slice(0, 4)) {
      lines.push(`- ${t.title}: ${t.snippet.slice(0, 140)} [${t.url}]`);
    }
  }
  return lines.join('\n');
}
