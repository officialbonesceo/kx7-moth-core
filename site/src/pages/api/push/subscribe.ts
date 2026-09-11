import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = (locals as any).runtime?.env?.DB;
    if (!db) return json({ ok: false, error: 'no db' }, 500);

    const body = await request.json();
    const endpoint = String(body?.endpoint || '');
    const p256dh = String(body?.keys?.p256dh || '');
    const auth = String(body?.keys?.auth || '');
    const topics = String(body?.topics || 'all');
    if (!endpoint || !p256dh || !auth) return json({ ok: false, error: 'bad subscription' }, 400);

    const id = 'p_' + hash(endpoint).slice(0, 16);
    await db
      .prepare(
        `INSERT INTO push_subscriptions (id, endpoint, p256dh, auth, topics, created_at, last_seen)
         VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
         ON CONFLICT(endpoint) DO UPDATE SET p256dh=excluded.p256dh, auth=excluded.auth, topics=excluded.topics, last_seen=datetime('now')`
      )
      .bind(id, endpoint, p256dh, auth, topics)
      .run();

    return json({ ok: true });
  } catch (e: any) {
    return json({ ok: false, error: e.message }, 500);
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    const db = (locals as any).runtime?.env?.DB;
    if (!db) return json({ ok: false }, 500);
    const body = await request.json().catch(() => ({} as any));
    const endpoint = String(body.endpoint || '');
    if (endpoint) await db.prepare(`DELETE FROM push_subscriptions WHERE endpoint = ?`).bind(endpoint).run();
    return json({ ok: true });
  } catch (e: any) {
    return json({ ok: false, error: e.message }, 500);
  }
};

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36) + s.length.toString(36);
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
