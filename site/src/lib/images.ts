/** Cover images: prefer stored URL, else topic SVG, else generated art with SVG onerror */

export type CoverInput = {
  slug?: string;
  title?: string;
  category?: string;
  image_url?: string | null;
};

export function topicKey(article: CoverInput): 'scams' | 'crypto' | 'hustle' | 'money' | 'fallback' {
  const title = `${article.title || ''} ${article.category || ''}`.toLowerCase();
  if (article.category === 'scams' || /scam|fraud|ponzi|phish|fake|telegram earn/.test(title)) return 'scams';
  if (/crypto|usdt|bitcoin|eth|airdrop|wallet|token|p2p|defi/.test(title)) return 'crypto';
  if (/hustle|freelance|content|youtube|tiktok|affiliate|dropship|creator|reel|skill/.test(title))
    return 'hustle';
  if (article.category === 'money' || /budget|fee|naira|payment|wallet|bank|price/.test(title)) return 'money';
  return 'fallback';
}

export function svgCover(article: CoverInput) {
  return `/covers/${topicKey(article)}.svg`;
}

export function generatedCover(article: CoverInput) {
  const title = (article.title || '').toLowerCase();
  const cat = (article.category || 'money').toLowerCase();
  let scene =
    'minimal dark fintech poster, soft green neon edge light, abstract geometric money chart, no people, no text, no logo, high quality';
  if (cat === 'scams' || /scam|fraud|ponzi|fake/.test(title))
    scene =
      'minimal dark security poster, soft red glow, abstract shield lock geometry, no people, no text, no logo';
  else if (/usdt|tether|stablecoin/.test(title))
    scene =
      'minimal dark crypto poster, soft emerald glow, abstract stablecoin disc geometry, no people, no text';
  else if (/bitcoin|crypto|token|airdrop|wallet/.test(title))
    scene =
      'minimal dark crypto poster, soft green candlestick shapes, abstract, no people, no text, no logo';
  else if (/youtube|tiktok|reel|content|creator|affiliate|dropship/.test(title))
    scene =
      'minimal dark creator desk abstract, soft green accent bars, no people, no faces, no text';
  else if (/hustle|freelance|earn|side/.test(title))
    scene =
      'minimal dark productivity abstract growth bars, soft green, no people, no text';
  const seed =
    Math.abs([...(article.slug || article.title || 'x')].reduce((a, c) => a + c.charCodeAt(0), 0) % 99999);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(scene)}?width=800&height=800&nologo=true&seed=${seed}`;
}

/** Primary URL used in img src — generated when possible; onerror should swap to svgCover */
export function coverFor(article: CoverInput) {
  if (article.image_url && !article.image_url.includes('pollinations.ai')) {
    return article.image_url;
  }
  // Prefer stable SVG for reliability; optional generated still available via generatedCover
  if (article.image_url) return article.image_url;
  return svgCover(article);
}

export function coverWithFallbackAttrs(article: CoverInput) {
  const primary = article.image_url || generatedCover(article);
  const fallback = svgCover(article);
  return { primary, fallback };
}
