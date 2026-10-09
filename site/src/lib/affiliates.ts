/** Affiliate keywords → CTA buttons. Logs unmatched commercial terms for admin. */

const HINT_TERMS = [
  'selar',
  'gumroad',
  'paystack',
  'flutterwave',
  'binance',
  'bybit',
  'roqqu',
  'quidax',
  'amazon',
  'jumia',
  'konga',
  'hostinger',
  'namecheap',
  'canva pro',
  'nordvpn',
  'expressvpn',
  'tradingview',
  'dropshipping course',
  'affiliate marketing',
];

export type AffRow = {
  id: string;
  keyword: string;
  label: string;
  url: string;
  enabled?: number;
  hits?: number;
};

export async function listAffiliates(db: D1Database): Promise<AffRow[]> {
  try {
    const res = await db
      .prepare(
        `SELECT id, keyword, label, url, enabled, hits FROM affiliates WHERE enabled = 1 ORDER BY keyword ASC`
      )
      .all<AffRow>();
    return res.results || [];
  } catch {
    return [];
  }
}

export async function listAllAffiliates(db: D1Database): Promise<AffRow[]> {
  try {
    const res = await db
      .prepare(`SELECT id, keyword, label, url, enabled, hits FROM affiliates ORDER BY keyword ASC`)
      .all<AffRow>();
    return res.results || [];
  } catch {
    return [];
  }
}

export async function listHints(db: D1Database) {
  try {
    const res = await db
      .prepare(
        `SELECT id, keyword, article_slug, seen_count, last_seen FROM affiliate_hints ORDER BY seen_count DESC LIMIT 40`
      )
      .all();
    return res.results || [];
  } catch {
    return [];
  }
}

/** Replace whole-word keywords with CTA buttons; log other commercial terms */
export function applyAffiliateButtons(html: string, rows: AffRow[]): string {
  let out = String(html || '');
  // Sort longer keywords first
  const sorted = [...rows].sort((a, b) => b.keyword.length - a.keyword.length);
  for (const row of sorted) {
    if (!row.keyword || !row.url) continue;
    const kw = row.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?<![\\w/])(${kw})(?![\\w/])`, 'gi');
    out = out.replace(re, (match) => {
      // skip if already inside a link
      return `<a class="aff-cta" href="${escapeAttr(row.url)}" rel="sponsored noopener noreferrer" target="_blank">${escapeHtml(row.label || match)} ↗</a>`;
    });
  }
  return out;
}

export async function logAffiliateHints(db: D1Database, text: string, slug?: string) {
  const lower = String(text || '').toLowerCase();
  for (const term of HINT_TERMS) {
    if (!lower.includes(term)) continue;
    const id = 'ah_' + term.replace(/\s+/g, '_');
    try {
      await db
        .prepare(
          `INSERT INTO affiliate_hints (id, keyword, article_slug, seen_count, last_seen)
           VALUES (?, ?, ?, 1, datetime('now'))
           ON CONFLICT(id) DO UPDATE SET
             seen_count = seen_count + 1,
             last_seen = datetime('now'),
             article_slug = COALESCE(excluded.article_slug, article_slug)`
        )
        .bind(id, term, slug || null)
        .run();
    } catch {
      // table may not exist yet
    }
  }
}

function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escapeAttr(s: string) {
  return escapeHtml(s).replace(/"/g, '&quot;');
}
