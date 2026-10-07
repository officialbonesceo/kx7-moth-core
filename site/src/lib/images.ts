/** Covers: topic-aligned raster, unique SVG fallback per article */

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
  ['#0b0f14', '#10b981', '#34d399'],
  ['#0f172a', '#38bdf8', '#7dd3fc'],
  ['#1a0a0e', '#f43f5e', '#fb7185'],
  ['#0c1a12', '#fbbf24', '#fde68a'],
  ['#111827', '#a78bfa', '#c4b5fd'],
  ['#0a1628', '#2dd4bf', '#5eead4'],
  ['#1c1917', '#fb923c', '#fdba74'],
  ['#0f1419', '#4ade80', '#86efac'],
];

export function topicKey(article: CoverInput): 'scams' | 'crypto' | 'hustle' | 'money' | 'jobs' | 'fallback' {
  const title = `${article.title || ''} ${article.category || ''}`.toLowerCase();
  if (article.category === 'scams' || /scam|fraud|ponzi|phish|fake|bvn|activation/.test(title)) return 'scams';
  if (/crypto|usdt|bitcoin|eth|airdrop|wallet|token|p2p|defi/.test(title)) return 'crypto';
  if (/student|100.?level|campus|online job|side hustle|tutor|freelance|canva|content creator|ghostwrit/.test(title))
    return 'jobs';
  if (/hustle|youtube|tiktok|affiliate|dropship|creator/.test(title)) return 'hustle';
  if (article.category === 'money' || /budget|fee|naira|payment|bank|price|convert/.test(title)) return 'money';
  return 'fallback';
}

export function uniqueSvgDataUri(article: CoverInput) {
  const key = `${article.slug || ''}|${article.title || ''}|${article.category || ''}`;
  const h = hashStr(key);
  const [bg, c1, c2] = PALETTES[h % PALETTES.length];
  const label = (article.category || 'guide').slice(0, 12).toUpperCase();
  const r1 = 80 + (h % 60);
  const r2 = 40 + ((h >> 3) % 40);
  const cx = 200 + ((h >> 5) % 280);
  const cy = 180 + ((h >> 7) % 200);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="960" viewBox="0 0 960 960">
<rect width="960" height="960" fill="${bg}"/>
<circle cx="${cx}" cy="${cy}" r="${r1}" fill="${c1}" opacity=".18"/>
<circle cx="${960 - cx}" cy="${960 - cy}" r="${r2}" fill="${c2}" opacity=".22"/>
<rect x="48" y="48" width="864" height="864" rx="48" fill="none" stroke="${c1}" stroke-width="2" opacity=".35"/>
<text x="80" y="860" font-family="Inter,Arial,sans-serif" font-size="28" font-weight="800" fill="${c1}" opacity=".9">${label}</text>
<text x="80" y="120" font-family="Inter,Arial,sans-serif" font-size="36" font-weight="900" fill="#f1f5f9" opacity=".95">LC</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function svgCover(article: CoverInput) {
  return uniqueSvgDataUri(article);
}

/** Topic-locked scenes so covers match the article, not random people */
export function generatedCover(article: CoverInput) {
  const topic = topicKey(article);
  const scenes: Record<string, string> = {
    scams:
      'editorial cybersecurity concept, abstract shield and lock silhouette, soft red accent on dark slate desk, no people, no faces, no text, no logo, photorealistic',
    crypto:
      'editorial fintech abstract, soft emerald teal light, geometric shapes soft focus, dark modern, no people, no text, no logo, photorealistic',
    jobs:
      'editorial student study desk with notebook laptop phone edge soft daylight, campus study vibe, no faces, no text, no logo, photorealistic',
    hustle:
      'editorial creator desk notebook smartphone soft window light, clean workspace, no faces, no text, no logo, photorealistic',
    money:
      'editorial personal finance abstract, soft gold and green light, notebook calculator soft focus, no people, no text, no logo, photorealistic',
    fallback:
      'editorial modern abstract emerald gradient on dark slate, soft geometric light, no people, no text, no logo, photorealistic',
  };
  const scene = scenes[topic] || scenes.fallback;
  const seed = hashStr(article.slug || article.title || 'x') % 99999;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(scene)}?width=960&height=960&nologo=true&seed=${seed}`;
}

export function coverFor(article: CoverInput) {
  const url = article.image_url || '';
  if (url.startsWith('/') && url.includes('/covers/')) return url;
  if (url && !url.includes('pollinations.ai') && /^https?:\/\//i.test(url)) return url;
  return generatedCover(article);
}

export function coverWithFallbackAttrs(article: CoverInput) {
  return { primary: coverFor(article), fallback: svgCover(article) };
}
