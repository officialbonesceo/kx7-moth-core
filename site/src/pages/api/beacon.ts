import type { APIRoute } from 'astro';

export const prerender = false;

const WINDOW_MS = 6 * 60 * 60 * 1000; // 6 hours

/** Unique visitors = 1 count per device id per 6-hour window. Pageviews still +1 each load. */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = (locals as any).runtime?.env?.DB;
    if (!db) return json({ ok: false }, 500);

    const body = await request.json().catch(() => ({} as any));
    const type = String(body.type || 'pageview');
    const device = String(body.device || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    const day = new Date().toISOString().slice(0, 10);

    await db
      .prepare(
        `INSERT INTO daily_stats (day, visitors, pageviews, saves, pushes) VALUES (?, 0, 0, 0, 0) ON CONFLICT(day) DO NOTHING`
      )
      .bind(day)
      .run();

    // Ensure dedup table exists (idempotent)
    try {
      await db
        .prepare(
          `CREATE TABLE IF NOT EXISTS visitor_dedup (
            id TEXT PRIMARY KEY,
            day TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now'))
          )`
        )
        .run();
    } catch {}

    if (type === 'visit') {
      if (!device) return json({ ok: true, skipped: 'no_device' });
      const bucket = Math.floor(Date.now() / WINDOW_MS);
      const dedupId = `${device}:${bucket}`;
      try {
        const existing = await db.prepare(`SELECT id FROM visitor_dedup WHERE id = ?`).bind(dedupId).first();
        if (existing) {
          return json({ ok: true, unique: false });
        }
        await db.prepare(`INSERT INTO visitor_dedup (id, day) VALUES (?, ?)`).bind(dedupId, day).run();
        await db.prepare(`UPDATE daily_stats SET visitors = visitors + 1 WHERE day = ?`).bind(day).run();
        return json({ ok: true, unique: true });
      } catch {
        // race: already inserted
        return json({ ok: true, unique: false });
      }
    }

    if (type === 'save') {
      await db.prepare(`UPDATE daily_stats SET saves = saves + 1 WHERE day = ?`).bind(day).run();
    } else if (type === 'push') {
      await db.prepare(`UPDATE daily_stats SET pushes = pushes + 1 WHERE day = ?`).bind(day).run();
    } else {
      // pageview: count real loads (optional light client throttle is separate)
      await db.prepare(`UPDATE daily_stats SET pageviews = pageviews + 1 WHERE day = ?`).bind(day).run();
    }

    return json({ ok: true });
  } catch (e: any) {
    return json({ ok: false, error: e.message }, 500);
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
