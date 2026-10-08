/** Editorial team labels — brand personas only, never fake licensed experts */

export function teamFor(category?: string, title?: string): string {
  const t = `${category || ''} ${title || ''}`.toLowerCase();
  if (/scam|fraud|phish|ponzi|fake job|activation/.test(t)) return 'LaneCash Scam Desk';
  if (/student|campus|100.?level|jamb|school/.test(t)) return 'LaneCash Campus Desk';
  if (/crypto|usdt|wallet|airdrop/.test(t)) return 'LaneCash Crypto Desk';
  if (/budget|naira|fee|payment|money/.test(t)) return 'LaneCash Money Desk';
  return 'LaneCash Editorial';
}

export const DESK_BLURB =
  'LaneCash Editorial is the brand byline for this site. Guides are educational only — not financial, legal, or investment advice. No one here claims to be a licensed adviser.';
