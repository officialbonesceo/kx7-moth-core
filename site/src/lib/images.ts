/** Topic-synced cover prompts — never random people for money posts */
export function coverFor(article: {
  slug?: string;
  title?: string;
  category?: string;
  image_url?: string | null;
}) {
  if (article.image_url) return article.image_url;

  const title = (article.title || '').toLowerCase();
  const cat = (article.category || 'money').toLowerCase();

  let scene = 'dark fintech abstract green neon charts money no people';

  if (cat === 'scams' || /scam|fraud|ponzi|fake/.test(title)) {
    scene = 'dark cybersecurity warning red alert triangle lock shield abstract no people';
  } else if (/usdt|tether|stablecoin/.test(title)) {
    scene = 'dark crypto USDT tether coin green glow abstract chart no people';
  } else if (/bitcoin|crypto|token|blockchain|defi/.test(title)) {
    scene = 'dark bitcoin crypto coins green neon candlestick chart abstract no people';
  } else if (/pos|agent banking|moniepoint|opay|kuda/.test(title)) {
    scene = 'dark mobile payment fintech naira wallet app interface abstract green no people';
  } else if (/hustle|freelance|earn|side income|capital/.test(title)) {
    scene = 'dark productivity desk laptop notebook growth chart green accent no face closeup';
  } else if (/loan|bank|naira|inflation|investment/.test(title)) {
    scene = 'dark finance naira notes abstract growth arrow green neon no people';
  }

  const seed = Math.abs([...(article.slug || title || 'x')].reduce((a, c) => a + c.charCodeAt(0), 0) % 99999);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(scene)}?width=800&height=800&nologo=true&seed=${seed}`;
}
