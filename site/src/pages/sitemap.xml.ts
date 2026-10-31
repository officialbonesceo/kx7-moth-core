import type { APIRoute } from 'astro';
import { getArticles } from '../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const origin = 'https://lanecash.name.ng';
  const staticPaths = [
    { path: '/', priority: '1.0' },
    { path: '/about', priority: '0.6' },
    { path: '/disclaimer', priority: '0.3' },
    { path: '/tools', priority: '0.85' },
    { path: '/tools/usd-ngn', priority: '0.8' },
    { path: '/tools/currency', priority: '0.8' },
    { path: '/search', priority: '0.4' },
  ];
  let articlePaths: { loc: string; lastmod?: string; priority: string }[] = [];

  try {
    const db = (locals as any).runtime?.env?.DB;
    if (db) {
      const res = await getArticles(db, 200);
      const rows = res.results || [];
      articlePaths = rows.map((a: any) => ({
        loc: `${origin}/article/${a.slug}`,
        lastmod: (a.updated_at || a.published_at || '').slice(0, 10) || undefined,
        priority: '0.75',
      }));
    }
  } catch {}

  const urls = [
    ...staticPaths.map((p) => ({
      loc: `${origin}${p.path === '/' ? '/' : p.path}`,
      lastmod: undefined as string | undefined,
      priority: p.priority,
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
    <priority>${u.priority}</priority>
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
