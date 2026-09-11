export function coverFor(article: {
  slug?: string;
  title?: string;
  category?: string;
  image_url?: string | null;
}) {
  if (article.image_url) return article.image_url;
  const title = (article.title || "").toLowerCase();
  const cat = (article.category || "money").toLowerCase();
  let scene = "dark fintech abstract green neon charts money symbols, no people, no faces";
  if (cat === "scams" || /scam|fraud|ponzi|fake/.test(title))
    scene = "dark cybersecurity red warning triangle lock shield abstract, no people";
  else if (/usdt|tether|stablecoin/.test(title))
    scene = "dark USDT tether stablecoin green glow abstract crypto chart, no people";
  else if (/bitcoin|crypto|token|blockchain|defi/.test(title))
    scene = "dark bitcoin crypto coins green neon candlestick chart abstract, no people";
  else if (/pos|agent banking|moniepoint|opay|kuda/.test(title))
    scene = "dark mobile payment fintech naira wallet abstract green, no people";
  else if (/hustle|freelance|earn|side income|capital/.test(title))
    scene = "dark desk laptop notebook growth chart green accent, no face";
  const seed = Math.abs([...(article.slug || title || "x")].reduce((a, c) => a + c.charCodeAt(0), 0) % 99999);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(scene)}?width=800&height=800&nologo=true&seed=${seed}`;
}
