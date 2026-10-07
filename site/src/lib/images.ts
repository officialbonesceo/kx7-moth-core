/** Covers: raster art when possible, unique SVG per article as fallback */

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

export function topicKey(article: CoverInput): 'scams' | 'crypto' | 'hustle' | 'money' | 'fallback' {
  const title = `${article.title || ''} ${article.category || ''}`.toLowerCase();
  if (article.category === 'scams' || /scam|fraud|ponzi|phish|fake|bvn|activation/.test(title)) return 'scams';
  if (/crypto|usdt|bitcoin|eth|airdrop|wallet|token|p2p|defi/.test(title)) return 'crypto';
  if (/hustle|freelance|content|youtube|tiktok|affiliate|dropship|creator|canva|tutor|ghostwrit/.test(title))
    return 'hustle';
  if (article.category === 'money' || /budget|fee|naira|payment|bank|price|convert/.test(title)) return 'money';
  return 'fallback';
}

/** Unique geometric SVG per article (data URI) — always available offline */
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
  // Prefer unique per-article SVG over static category files
  return uniqueSvgDataUri(article);
}

export function generatedCover(article: CoverInput) {
  const title = (article.title || '').toLowerCase();
  const cat = (article.category || 'money').toLowerCase();
  let scene =
    'editorial fintech photo abstract, soft emerald light, modern dark desk, shallow depth of field, no people, no text, no logo, photorealistic';
  if (cat === 'scams' || /scam|fraud|fake|bvn/.test(title))
    scene =
      'editorial security concept photo, soft red accent light, abstract shield silhouette, dark modern, no people, no text, photorealistic';
  else if (/crypto|usdt|bitcoin|wallet|token/.test(title))
    scene =
      'editorial crypto abstract photo, emerald and teal light, soft bokeh, no people, no text, photorealistic';
  else if (/canva|design|tutor|freelance|ghostwrit|phone/.test(title))
    scene =
      'editorial creative workspace photo, soft daylight, notebook and phone edge, no faces, no text, photorealistic';
  else if (/budget|naira|fee|bank|payment/.test(title))
    scene =
      'editorial money literacy photo, soft gold and green light, abstract coins soft focus, no people, no text, photorealistic';
  const seed = hashStr(article.slug || article.title || 'x') % 99999;
  // Pollinations returns a real raster image (works like PNG/JPEG in <img>)
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(scene)}?width=960&height=960&nologo=true&seed=${seed}`;
}

export function coverFor(article: CoverInput) {
  const url = article.image_url || '';
  if (url.startsWith('/') && url.includes('/covers/')) return url;
  if (url && !url.includes('pollinations.ai') && /^https?:\/\//i.test(url)) return url;
  // Real image first; img onerror → uniqueSvgDataUri
  return generatedCover(article);
}

export function coverWithFallbackAttrs(article: CoverInput) {
  return { primary: coverFor(article), fallback: svgCover(article) };
}
