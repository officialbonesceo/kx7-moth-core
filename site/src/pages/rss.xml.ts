import type { APIRoute } from 'astro';
import { getArticles } from '../lib/db';

export const prerender = false;

export const GET: APIRoute = async ({ locals, url }) => {
  const origin = url.origin;
  let items = '';

  try {
    const db = (locals as any).runtime?.env?.DB;
    if (db) {
      const res = await getArticles(db, 50);
      const rows = res.results || [];
      items = rows
        .map((a: any) => {
          const link = `${origin}/article/${a.slug}`;
          const pub = a.published_at ? new Date(a.published_at).toUTCString() : new Date().toUTCString();
          const desc = escapeXml(String(a.summary || a.title || ''));
          return `    <item>
      <title>${escapeXml(String(a.title || ''))}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pub}</pubDate>
      <category>${escapeXml(String(a.category || 'guides'))}</category>
      <description>${desc}</description>
    </item>`;
        })
        .join('\n');
    }
  } catch {}

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>LaneCash</title>
    <link>${escapeXml(origin)}/</link>
    <description>Practical finance, hustles, crypto safety and scam alerts — educational guides only.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(origin)}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=1800',
    },
  });
};

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
