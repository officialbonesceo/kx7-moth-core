import type { APIRoute } from 'astro';
export const prerender = false;

const KEYS = [
  'social_youtube',
  'social_tiktok',
  'social_instagram',
  'social_facebook',
  'social_telegram',
] as const;

const DEFAULTS: Record<string, string> = {
  social_youtube: 'https://www.youtube.com/@only_lanecash',
  social_tiktok: 'https://www.tiktok.com/@lanecash',
  social_instagram: 'https://www.instagram.com/lanecash',
  social_facebook: 'https://www.facebook.com/lanecash',
  social_telegram: 'https://t.me/lanecash',
};

export const GET: APIRoute = async ({ locals }) => {
  const db = (locals as any).runtime?.env?.DB;
  const out: Record<string, string> = { ...DEFAULTS };
  if (db) {
    try {
      for (const key of KEYS) {
        const row = await db.prepare(`SELECT value FROM settings WHERE key = ?`).bind(key).first();
        if (row?.value && String(row.value).trim()) out[key] = String(row.value).trim();
      }
    } catch {}
  }
  return json({
    youtube: out.social_youtube,
    tiktok: out.social_tiktok,
    instagram: out.social_instagram,
    facebook: out.social_facebook,
    telegram: out.social_telegram,
  });
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=300',
    },
  });
}
