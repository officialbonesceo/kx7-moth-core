/** Shared topic-synced image helper for pulse-a publishes */
export function imageFor(title: string, category: string) {
  const t = `${title} ${category}`.toLowerCase();
  let scene = 'dark fintech abstract green neon charts money symbols no people no faces';

  if (/scam|fraud|ponzi|fake/.test(t)) {
    scene = 'dark cybersecurity red warning triangle lock shield abstract no people no faces';
  } else if (/usdt|tether|stablecoin/.test(t)) {
    scene = 'dark USDT tether stablecoin green glow abstract crypto chart no people';
  } else if (/bitcoin|crypto|token|blockchain|defi|airdrop/.test(t)) {
    scene = 'dark bitcoin crypto stack coins green neon candlestick chart abstract no people';
  } else if (/pos|moniepoint|opay|kuda|wallet|payment/.test(t)) {
    scene = 'dark mobile payment fintech wallet naira abstract green interface no people';
  } else if (/hustle|freelance|earn|side income|capital|daily/.test(t)) {
    scene = 'dark desk laptop notebook growth chart green accent productivity no face closeup';
  } else if (/loan|bank|naira|inflation|invest/.test(t)) {
    scene = 'dark finance naira currency abstract upward arrow green neon no people';
  }

  const seed = Math.abs([...title].reduce((a, c) => a + c.charCodeAt(0), 0) % 99999);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(scene)}?width=1200&height=675&nologo=true&seed=${seed}`;
}
