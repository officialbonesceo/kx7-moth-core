export const prerender = false;

/** Public verification meta fragments for Base layout */
export async function GET({ locals }: any) {
  const db = locals.runtime?.env?.DB;
  const out: Record<string, string> = {
    google: '',
    bing: '',
    yandex: '',
    extra: '',
  };
  if (db) {
    const map: Record<string, string> = {
      verify_google_meta: 'google',
      verify_bing_meta: 'bing',
      verify_yandex_meta: 'yandex',
      verify_extra_head: 'extra',
    };
    for (const [key, field] of Object.entries(map)) {
      try {
        const row = await db.prepare(`SELECT value FROM settings WHERE key = ?`).bind(key).first();
        if (row?.value) out[field] = String(row.value);
      } catch {}
    }
  }
  return new Response(JSON.stringify(out), {
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=120' },
  });
}
