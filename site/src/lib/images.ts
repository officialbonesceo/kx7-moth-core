/** Covers: prefer clean SVG (always on-brand). Optional external image_url only if non-AI-junk. */

export type CoverInput = {
  slug?: string;
  title?: string;
  category?: string;
  image_url?: string | null;
};

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const PALETTES = [
  ['#0b1220', '#3b82f6', '#60a5fa'],
  ['#0f172a', '#10b981', '#34d399'],
  ['#1a0a12', '#f43f5e', '#fb7185'],
  ['#0c1a12', '#f59e0b', '#fbbf24'],
  ['#111827', '#8b5cf6', '#a78bfa'],
  ['#0a1628', '#06b6d4', '#22d3ee'],
  ['#1c1917', '#fb923c', '#fdba74'],
  ['#0f1419', '#22c55e', '#4ade80'],
];

export function topicKey(
  article: CoverInput
): 'scams' | 'crypto' | 'hustle' | 'money' | 'jobs' | 'fallback' {
  const title = `${article.title || ''} ${article.category || ''}`.toLowerCase();
  if (article.category === 'scams' || /scam|fraud|ponzi|phish|fake|bvn|activation/.test(title))
    return 'scams';
  if (/crypto|usdt|bitcoin|eth|airdrop|wallet|token|p2p|defi/.test(title)) return 'crypto';
  if (
    /student|100.?level|campus|online job|side hustle|tutor|freelance|canva|content creator|ghostwrit/.test(
      title
    )
  )
    return 'jobs';
  if (/hustle|youtube|tiktok|affiliate|dropship|creator/.test(title)) return 'hustle';
  if (article.category === 'money' || /budget|fee|naira|payment|bank|price|convert/.test(title))
    return 'money';
  return 'fallback';
}

export function uniqueSvgDataUri(article: CoverInput) {
  const key = `${article.slug || ''}|${article.title || ''}|${article.category || ''}`;
  const h = hashStr(key);
  const [bg, c1, c2] = PALETTES[h % PALETTES.length];
  const label = (article.category || 'guide').slice(0, 12).toUpperCase();
  const r1 = 90 + (h % 50);
  const r2 = 45 + ((h >> 3) % 35);
  const cx = 220 + ((h >> 5) % 240);
  const cy = 200 + ((h >> 7) % 180);
  const titleBit = String(article.title || 'LaneCash')
    .replace(/[<>&"']/g, '')
    .slice(0, 28);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
<defs>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${bg}"/>
    <stop offset="100%" stop-color="#020617"/>
  </linearGradient>
</defs>
<rect width="960" height="540" fill="url(#g)"/>
<circle cx="${cx}" cy="${cy}" r="${r1}" fill="${c1}" opacity=".2"/>
<circle cx="${960 - cx}" cy="${540 - cy * 0.4}" r="${r2}" fill="${c2}" opacity=".25"/>
<rect x="36" y="36" width="888" height="468" rx="28" fill="none" stroke="${c1}" stroke-width="2" opacity=".4"/>
<text x="64" y="100" font-family="system-ui,Arial,sans-serif" font-size="28" font-weight="800" fill="${c1}">LC</text>
<text x="64" y="280" font-family="system-ui,Arial,sans-serif" font-size="22" font-weight="700" fill="#e2e8f0" opacity=".95">${titleBit}</text>
<text x="64" y="480" font-family="system-ui,Arial,sans-serif" font-size="18" font-weight="800" fill="${c2}" opacity=".9">${label}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function svgCover(article: CoverInput) {
  return uniqueSvgDataUri(article);
}

/** Default cover is clean SVG. Only use external URL if it is a normal https image (not pollinations junk). */
export function coverFor(article: CoverInput) {
  const url = String(article.image_url || '').trim();
  if (url.startsWith('/') && url.includes('/covers/')) return url;
  if (
    url &&
    /^https:\/\//i.test(url) &&
    !/pollinations\.ai|oaidalle|openai\.com\/|generated/i.test(url)
  ) {
    return url;
  }
  return svgCover(article);
}

export function coverWithFallbackAttrs(article: CoverInput) {
  return { primary: coverFor(article), fallback: svgCover(article) };
}
