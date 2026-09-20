export const prerender = false;

function validEmail(e: string | null) {
  const s = String(e || '')
    .trim()
    .toLowerCase()
    .slice(0, 120);
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(s)) return null;
  return s;
}

async function getSetting(db: D1Database, key: string) {
  try {
    const row = await db.prepare(`SELECT value FROM settings WHERE key = ?`).bind(key).first<{ value: string }>();
    return row?.value || '';
  } catch {
    return '';
  }
}

async function setSetting(db: D1Database, key: string, value: string) {
  await db
    .prepare(
      `INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`
    )
    .bind(key, value)
    .run();
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export async function POST({ request, locals }: any) {
  const env = locals?.runtime?.env || {};
  const db = env.DB as D1Database | undefined;
  if (!db) return json({ ok: false, error: 'no_db' }, 500);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const action = String(body.action || 'subscribe');
  const adminOk =
    request.headers.get('x-admin-key') === env.ADMIN_PASSWORD ||
    request.headers.get('x-admin-key') === env.ADMIN_KEY;

  if (action === 'config') {
    if (!adminOk) return json({ ok: false, error: 'unauthorized' }, 401);
    if (typeof body.from_email === 'string') await setSetting(db, 'brevo_from_email', body.from_email.trim().slice(0, 120));
    if (typeof body.from_name === 'string') await setSetting(db, 'brevo_from_name', body.from_name.trim().slice(0, 80));
    if (typeof body.enabled === 'boolean') await setSetting(db, 'newsletter_enabled', body.enabled ? '1' : '0');
    if (typeof body.api_key === 'string' && body.api_key.trim()) {
      await setSetting(db, 'brevo_api_key', body.api_key.trim().slice(0, 200));
    }
    if (body.clear_api_key === true) await setSetting(db, 'brevo_api_key', '');
    return json({ ok: true });
  }

  if (action === 'send') {
    if (!adminOk) return json({ ok: false, error: 'unauthorized' }, 401);
    const key = String(env.BREVO_API_KEY || (await getSetting(db, 'brevo_api_key')) || '').trim();
    if (!key) return json({ ok: false, error: 'missing_brevo_key' }, 400);
    const fromEmail = (await getSetting(db, 'brevo_from_email')) || body.from_email;
    const fromName = (await getSetting(db, 'brevo_from_name')) || body.from_name || 'LaneCash';
    if (!fromEmail) return json({ ok: false, error: 'missing_from_email' }, 400);
    const subject = String(body.subject || '').trim().slice(0, 200);
    const html = String(body.html || '').trim().slice(0, 50000);
    if (!subject || !html) return json({ ok: false, error: 'subject_html_required' }, 400);

    const testTo = validEmail(body.test_to);
    let recipients: string[] = [];
    if (testTo) recipients = [testTo];
    else {
      const res = await db
        .prepare(
          `SELECT email FROM newsletter_subscribers WHERE site = 'lanecash' AND status = 'active' ORDER BY id DESC LIMIT 50`
        )
        .all<{ email: string }>();
      recipients = (res.results || []).map((r) => r.email);
    }
    if (!recipients.length) return json({ ok: false, error: 'no_recipients' }, 400);

    let sent = 0;
    for (const to of recipients) {
      try {
        const r = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': key,
          },
          body: JSON.stringify({
            sender: { name: fromName, email: fromEmail },
            to: [{ email: to }],
            subject,
            htmlContent: html,
          }),
        });
        if (r.ok) sent++;
      } catch {}
    }
    return json({ ok: true, sent, attempted: recipients.length });
  }

  const email = validEmail(body.email);
  if (!email) return json({ ok: false, error: 'invalid_email' }, 400);
  const enabled = (await getSetting(db, 'newsletter_enabled')) !== '0';
  if (!enabled) return json({ ok: false, error: 'newsletter_off' }, 403);

  try {
    await db
      .prepare(
        `INSERT INTO newsletter_subscribers (email, site, status) VALUES (?, 'lanecash', 'active')
         ON CONFLICT(email, site) DO UPDATE SET status = 'active'`
      )
      .bind(email)
      .run();
  } catch (e: any) {
    return json({ ok: false, error: String(e?.message || e) }, 500);
  }

  const key = String(env.BREVO_API_KEY || (await getSetting(db, 'brevo_api_key')) || '').trim();
  const fromEmail = await getSetting(db, 'brevo_from_email');
  if (key && fromEmail) {
    try {
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': key,
        },
        body: JSON.stringify({
          sender: {
            name: (await getSetting(db, 'brevo_from_name')) || 'LaneCash',
            email: fromEmail,
          },
          to: [{ email }],
          subject: 'You joined the LaneCash list',
          htmlContent:
            '<p>Thanks for subscribing to LaneCash money & digital skills tips.</p><p>If this was not you, ignore this email.</p>',
        }),
      });
    } catch {}
  }

  return json({ ok: true });
}

export async function GET({ request, locals }: any) {
  const env = locals?.runtime?.env || {};
  const db = env.DB as D1Database | undefined;
  if (!db) return json({ ok: true, enabled: true });
  const adminOk =
    request.headers.get('x-admin-key') === env.ADMIN_PASSWORD ||
    request.headers.get('x-admin-key') === env.ADMIN_KEY;
  const enabled = (await getSetting(db, 'newsletter_enabled')) !== '0';
  if (!adminOk) return json({ ok: true, enabled });
  const key = String(env.BREVO_API_KEY || (await getSetting(db, 'brevo_api_key')) || '').trim();
  let count = 0;
  try {
    const row = await db
      .prepare(`SELECT COUNT(*) as c FROM newsletter_subscribers WHERE site = 'lanecash' AND status = 'active'`)
      .first<{ c: number }>();
    count = Number(row?.c || 0);
  } catch {}
  return json({
    ok: true,
    enabled,
    from_email: await getSetting(db, 'brevo_from_email'),
    from_name: await getSetting(db, 'brevo_from_name'),
    has_api_key: !!key,
    key_source: env.BREVO_API_KEY ? 'env' : key ? 'settings' : 'none',
    subscribers: count,
  });
}
