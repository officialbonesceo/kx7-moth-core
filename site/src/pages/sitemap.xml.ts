import type { APIRoute } from 'astro';
import { getArticles } from '../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ locals, url }) => {
  // Always use the host the visitor actually opened (custom domain or pages.dev)
  const origin = url.origin;
  const staticPaths = ['/', '/about', '/disclaimer', '/tools', '/search'];
  let articlePaths: { loc: string; lastmod?: string }[] = [];

  try {
    const db = (locals as any).runtime?.env?.DB;
    if (db) {
      const res = await getArticles(db, 200);
      const rows = res.results || [];
      articlePaths = rows.map((a: any) => ({
        loc: `${origin}/article/${a.slug}`,
        lastmod: (a.updated_at || a.published_at || '').slice(0, 10) || undefined,
      }));
    }
  } catch {}

  const urls = [
    ...staticPaths.map((p) => ({
      loc: `${origin}${p === '/' ? '/' : p}`,
      lastmod: undefined as string | undefined,
    })),
    ...articlePaths,
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
