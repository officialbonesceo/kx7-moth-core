export const prerender = false;

/** Public endpoint: returns Monetag in-page script from settings (empty if unset) */
export async function GET({ locals }: any) {
  const db = locals.runtime?.env?.DB;
  let script = '';
  if (db) {
    try {
      const row = await db.prepare(`SELECT value FROM settings WHERE key = ?`).bind('ad_monetag_inpage').first();
      if (row?.value) script = String(row.value);
    } catch {}
  }
  return new Response(JSON.stringify({ script }), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=60',
    },
  });
}
