export const prerender = false;

export async function GET({ locals, request }: any) {
  const db = locals.runtime?.env?.DB;
  if (!db) return json({ ok: false, items: [] });
  try {
    const res = await db
      .prepare(`SELECT keyword, label, url FROM affiliates WHERE enabled = 1`)
      .all();
    return json({ ok: true, items: res.results || [] }, 200, 'public, max-age=120');
  } catch {
    return json({ ok: true, items: [] });
  }
}

function json(body: any, status = 200, cache = 'no-store') {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': cache },
  });
}
