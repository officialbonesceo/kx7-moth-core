import type { APIRoute } from 'astro';
export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals as any)?.runtime?.env || {};
  const hasDB = Boolean(env.DB);
  let articleCount = null;
  let err = null;
  if (env.DB) {
    try {
      const row = await env.DB.prepare(`SELECT COUNT(*) as c FROM articles`).first();
      articleCount = row?.c ?? 0;
    } catch (e: any) {
      err = e?.message || String(e);
    }
  }
  return new Response(
    JSON.stringify({ ok: true, hasDB, articleCount, err }, null, 2),
    { headers: { 'content-type': 'application/json' } }
  );
};
