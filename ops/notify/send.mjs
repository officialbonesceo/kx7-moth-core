/**
 * Send web-push to all D1 subscriptions (runs in GitHub Actions / Node).
 * Secrets: CF_*, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT
 * Usage: node ops/notify/send.mjs "Title" "Body" "/path"
 */
import webpush from 'web-push';

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_D1_DATABASE_ID = process.env.CF_D1_DATABASE_ID;
const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:officialbonesceo@gmail.com';

const title = process.argv[2] || 'LaneCash';
const body = process.argv[3] || 'New update on LaneCash';
const url = process.argv[4] || '/';

if (!CF_ACCOUNT_ID || !CF_API_TOKEN || !CF_D1_DATABASE_ID) {
  console.error('Missing Cloudflare credentials');
  process.exit(1);
}
if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
  console.error('Missing VAPID keys');
  process.exit(1);
}

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

async function d1(sql, params = []) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data?.result?.[0]?.results || [];
}

const rows = await d1(`SELECT endpoint, p256dh, auth FROM push_subscriptions LIMIT 500`);
console.log(`[notify] subscribers: ${rows.length}`);

let ok = 0, fail = 0;
for (const row of rows) {
  try {
    await webpush.sendNotification(
      {
        endpoint: row.endpoint,
        keys: { p256dh: row.p256dh, auth: row.auth },
      },
      JSON.stringify({ title, body, url })
    );
    ok++;
  } catch (e) {
    fail++;
    if (String(e.statusCode) === '410' || String(e.statusCode) === '404') {
      await d1(`DELETE FROM push_subscriptions WHERE endpoint = ?`, [row.endpoint]);
    }
  }
}

const day = new Date().toISOString().slice(0, 10);
await d1(
  `INSERT INTO daily_stats (day, visitors, pageviews, saves, pushes) VALUES (?,0,0,0,?) ON CONFLICT(day) DO UPDATE SET pushes = pushes + ?`,
  [day, ok, ok]
);

console.log(`[notify] sent=${ok} fail=${fail}`);
