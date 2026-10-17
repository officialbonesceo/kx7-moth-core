export const prerender = false;

/** Public: ads enabled flag + optional monetag script */
export async function GET({ locals }: any) {
  const db = locals.runtime?.env?.DB;
  let script = '';
  let enabled = true;
  if (db) {
    try {
      const row = await db.prepare(`SELECT value FROM settings WHERE key = ?`).bind('ad_monetag_inpage').first();
      if (row?.value) script = String(row.value);
    } catch {}
    try {
      const en = await db.prepare(`SELECT value FROM settings WHERE key = ?`).bind('ads_enabled').first();
      if (en?.value != null) {
        const v = String(en.value).trim().toLowerCase();
        enabled = !(v === '0' || v === 'false' || v === 'off');
      }
    } catch {}
  }
  return new Response(JSON.stringify({ enabled, script }), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=30',
    },
  });
}
