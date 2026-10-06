/** Cover images: generated topic art when possible, stable SVG fallback */

export type CoverInput = {
  slug?: string;
  title?: string;
  category?: string;
  image_url?: string | null;
};

export function topicKey(article: CoverInput): 'scams' | 'crypto' | 'hustle' | 'money' | 'fallback' {
  const title = `${article.title || ''} ${article.category || ''}`.toLowerCase();
  if (article.category === 'scams' || /scam|fraud|ponzi|phish|fake|telegram earn|bvn|activation/.test(title))
    return 'scams';
  if (/crypto|usdt|bitcoin|eth|airdrop|wallet|token|p2p|defi/.test(title)) return 'crypto';
  if (/hustle|freelance|content|youtube|tiktok|affiliate|dropship|creator|reel|skill|canva|tutor|ghostwrit/.test(title))
    return 'hustle';
  if (article.category === 'money' || /budget|fee|naira|payment|bank|price|convert/.test(title)) return 'money';
  return 'fallback';
}

export function svgCover(article: CoverInput) {
  return `/covers/${topicKey(article)}.svg`;
}

export function generatedCover(article: CoverInput) {
  const title = (article.title || '').toLowerCase();
  const cat = (article.category || 'money').toLowerCase();
  let scene =
    'minimal dark teal fintech poster, soft emerald edge light, abstract geometric safe money shapes, no people, no text, no logo, high quality 8k';
  if (cat === 'scams' || /scam|fraud|ponzi|fake|bvn|activation/.test(title))
    scene =
      'minimal dark security poster, soft rose red glow, abstract shield and lock geometry, warning atmosphere, no people, no text, no logo';
  else if (/usdt|tether|stablecoin|crypto|bitcoin|token|airdrop|wallet/.test(title))
    scene =
      'minimal dark crypto poster, soft emerald glow, abstract coin disc and network lines, no people, no text, no logo';
  else if (/canva|design|flyer|tutor|freelance|ghostwrit|phone skill|client/.test(title))
    scene =
      'minimal dark creative workspace abstract, soft teal accent bars and soft shapes, no people, no faces, no text';
  else if (/budget|naira|fee|bank|payment|convert/.test(title))
    scene =
      'minimal dark money literacy poster, soft gold and teal geometry, abstract coins and chart bars, no people, no text';
  const seed =
    Math.abs([...(article.slug || article.title || 'x')].reduce((a, c) => a + c.charCodeAt(0), 0) % 99999);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(scene)}?width=960&height=960&nologo=true&seed=${seed}`;
}

/** Primary cover: prefer non-broken stored URL, else generated art, SVG is onerror fallback */
export function coverFor(article: CoverInput) {
  const url = article.image_url || '';
  if (url && url.startsWith('/') && url.includes('/covers/')) return url;
  if (url && !url.includes('pollinations.ai') && /^https?:\/\//i.test(url)) return url;
  return generatedCover(article);
}

export function coverWithFallbackAttrs(article: CoverInput) {
  return { primary: coverFor(article), fallback: svgCover(article) };
}
