export const DEFAULT_SOCIALS = [
  { key: 'youtube', name: 'YouTube', href: 'https://youtube.com/@LaneCash' },
  { key: 'tiktok', name: 'TikTok', href: 'https://www.tiktok.com/@lanecash' },
  { key: 'instagram', name: 'Instagram', href: 'https://instagram.com/lanecash' },
  { key: 'facebook', name: 'Facebook', href: 'https://facebook.com/lanecash' },
];

export function teamFor(category?: string, title?: string) {
  const t = `${category || ''} ${title || ''}`.toLowerCase();
  if (/scam|fraud|ponzi|fake/.test(t)) return 'LaneCash Scam Team';
  if (/crypto|usdt|bitcoin|token|defi/.test(t)) return 'LaneCash Crypto Desk';
  if (/hustle|freelance|earn|side/.test(t)) return 'LaneCash Hustle Desk';
  return 'LaneCash Fin Team';
}
