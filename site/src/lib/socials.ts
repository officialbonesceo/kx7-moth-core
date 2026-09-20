export const DEFAULT_SOCIALS = [
  { key: 'youtube', name: 'YouTube', href: 'https://www.youtube.com/@only_lanecash' },
  { key: 'tiktok', name: 'TikTok', href: 'https://www.tiktok.com/@lanecash' },
  { key: 'instagram', name: 'Instagram', href: 'https://www.instagram.com/lanecash' },
  { key: 'facebook', name: 'Facebook', href: 'https://www.facebook.com/lanecash' },
  { key: 'telegram', name: 'Telegram', href: 'https://t.me/lanecash' },
];

export const SOCIAL_HREFS: Record<string, string> = {
  youtube: 'https://www.youtube.com/@only_lanecash',
  tiktok: 'https://www.tiktok.com/@lanecash',
  instagram: 'https://www.instagram.com/lanecash',
  facebook: 'https://www.facebook.com/lanecash',
  telegram: 'https://t.me/lanecash',
};

export function teamFor(category?: string, title?: string) {
  const t = `${category || ''} ${title || ''}`.toLowerCase();
  if (/scam|fraud|ponzi|fake/.test(t)) return 'LaneCash Scam Team';
  if (/crypto|usdt|bitcoin|token|defi/.test(t)) return 'LaneCash Crypto Desk';
  if (/hustle|freelance|earn|side/.test(t)) return 'LaneCash Hustle Desk';
  return 'LaneCash Fin Team';
}
