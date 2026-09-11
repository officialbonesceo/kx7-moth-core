import type { APIRoute } from 'astro';

export const prerender = false;

/** Low-write analytics: sampled increments to ONE row per day */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const db = (locals as any).runtime?.env?.DB;
    if (!db) return json({ ok: false }, 500);

    const body = await request.json().catch(() => ({} as any));
    const type = String(body.type || 'pageview');
    const day = new Date().toISOString().slice(0, 10);

    // Sampling keeps D1 writes low (statistically scale counts)
    const sample = Math.random();
    if (type === 'pageview' && sample > 0.25) return json({ ok: true, sampled: true });
    if (type === 'visit' && sample > 0.5) return json({ ok: true, sampled: true });

    await db
      .prepare(`INSERT INTO daily_stats (day, visitors, pageviews, saves, pushes) VALUES (?, 0, 0, 0, 0) ON CONFLICT(day) DO NOTHING`)
      .bind(day)
      .run();

    if (type === 'visit') {
      await db.prepare(`UPDATE daily_stats SET visitors = visitors + 4 WHERE day = ?`).bind(day).run();
    } else if (type === 'save') {
      await db.prepare(`UPDATE daily_stats SET saves = saves + 1 WHERE day = ?`).bind(day).run();
    } else {
      // pageview sample weight 4 => ~accurate under 25% sample
      await db.prepare(`UPDATE daily_stats SET pageviews = pageviews + 4 WHERE day = ?`).bind(day).run();
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
