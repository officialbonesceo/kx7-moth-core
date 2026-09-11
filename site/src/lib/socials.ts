export const SOCIALS = [
  { name: "YouTube", href: "https://youtube.com/@LaneCash", icon: "YT" },
  { name: "TikTok", href: "https://www.tiktok.com/@lanecash", icon: "TT" },
  { name: "Instagram", href: "https://instagram.com/lanecash", icon: "IG" },
  { name: "Facebook", href: "https://facebook.com/lanecash", icon: "FB" },
];

export function teamFor(category?: string, title?: string) {
  const t = `${category || ""} ${title || ""}`.toLowerCase();
  if (/scam|fraud|ponzi|fake/.test(t)) return "LaneCash Scam Team";
  if (/crypto|usdt|bitcoin|token|defi/.test(t)) return "LaneCash Crypto Desk";
  if (/hustle|freelance|earn|side/.test(t)) return "LaneCash Hustle Desk";
  return "LaneCash Fin Team";
}
