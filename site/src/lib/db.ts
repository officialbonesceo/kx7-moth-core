export type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content?: string;
  category: string;
  image_url?: string;
  reading_minutes?: number;
  views?: number;
  saves?: number;
  is_featured?: number;
  status?: string;
  author_team?: string;
  source_name?: string;
  source_url?: string;
  published_at?: string;
};

/** Never surface failed AI one-word titles or generic stubs */
const QUALITY_WHERE = `
  status = 'published'
  AND length(trim(title)) >= 20
  AND lower(trim(title)) NOT IN ('google', 'remote work', 'affiliate', 'crypto', 'scam', 'guide', 'article')
  AND (summary IS NULL OR summary NOT LIKE 'A practical beginner guide from LaneCash%')
  AND (content IS NULL OR (
    content NOT LIKE '%Okay, I need to%'
    AND content NOT LIKE '%Data Clean Room%'
  ))
`;

async function safeAll<T = any>(db: D1Database, sql: string, binds: any[] = []) {
  try {
    const stmt = db.prepare(sql);
    const res = binds.length ? await stmt.bind(...binds).all<T>() : await stmt.all<T>();
    return res;
  } catch (e) {
    console.error('[db]', sql, e);
    return { results: [] as T[], success: false } as any;
  }
}

async function safeFirst<T = any>(db: D1Database, sql: string, binds: any[] = []) {
  try {
    const stmt = db.prepare(sql);
    return binds.length ? await stmt.bind(...binds).first<T>() : await stmt.first<T>();
  } catch (e) {
    console.error('[db]', sql, e);
    return null;
  }
}

export async function getArticles(db: D1Database, limit = 12, category?: string, offset = 0) {
  if (category) {
    return safeAll<Article>(
      db,
      `SELECT * FROM articles WHERE ${QUALITY_WHERE} AND category = ? ORDER BY published_at DESC LIMIT ? OFFSET ?`,
      [category, limit, offset]
    );
  }
  return safeAll<Article>(
    db,
    `SELECT * FROM articles WHERE ${QUALITY_WHERE} ORDER BY published_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
}

export async function countArticles(db: D1Database, category?: string) {
  if (category) {
    const row = await safeFirst<{ c: number }>(
      db,
      `SELECT COUNT(*) as c FROM articles WHERE ${QUALITY_WHERE} AND category = ?`,
      [category]
    );
    return row?.c || 0;
  }
  const row = await safeFirst<{ c: number }>(
    db,
    `SELECT COUNT(*) as c FROM articles WHERE ${QUALITY_WHERE}`
  );
  return row?.c || 0;
}

export async function getArticleBySlug(db: D1Database, slug: string) {
  return safeFirst<Article>(
    db,
    `SELECT * FROM articles WHERE slug = ? AND ${QUALITY_WHERE} LIMIT 1`,
    [slug]
  );
}

export async function getRelatedArticles(db: D1Database, slug: string, category: string, limit = 6) {
  const same = await safeAll<Article>(
    db,
    `SELECT id, slug, title, summary, category, image_url, reading_minutes, published_at FROM articles
     WHERE ${QUALITY_WHERE} AND category = ? AND slug != ?
     ORDER BY published_at DESC LIMIT ?`,
    [category, slug, limit]
  );
  let results = same.results || [];
  if (results.length < limit) {
    const need = limit - results.length;
    const exclude = [slug, ...results.map((r) => r.slug)];
    const placeholders = exclude.map(() => '?').join(',');
    const more = await safeAll<Article>(
      db,
      `SELECT id, slug, title, summary, category, image_url, reading_minutes, published_at FROM articles
       WHERE ${QUALITY_WHERE} AND slug NOT IN (${placeholders})
       ORDER BY published_at DESC LIMIT ?`,
      [...exclude, need]
    );
    results = results.concat(more.results || []);
  }
  return results.slice(0, limit);
}

export async function searchArticles(db: D1Database, q: string, limit = 20) {
  const like = `%${q.replace(/[%_]/g, '')}%`;
  return safeAll<Article>(
    db,
    `SELECT * FROM articles WHERE ${QUALITY_WHERE} AND (title LIKE ? OR summary LIKE ?) ORDER BY published_at DESC LIMIT ?`,
    [like, like, limit]
  );
}

export async function bumpViews(db: D1Database, id: string) {
  try {
    await db.prepare(`UPDATE articles SET views = COALESCE(views, 0) + 1 WHERE id = ?`).bind(id).run();
  } catch (e) {
    console.error('[db] bumpViews', e);
  }
}

export async function adminStats(db: D1Database) {
  const total = await safeFirst<{ c: number }>(db, `SELECT COUNT(*) as c FROM articles`);
  const published = await safeFirst<{ c: number }>(db, `SELECT COUNT(*) as c FROM articles WHERE status = 'published'`);
  const views = await safeFirst<{ v: number }>(db, `SELECT COALESCE(SUM(views),0) as v FROM articles`);
  const subs = await safeFirst<{ c: number }>(db, `SELECT COUNT(*) as c FROM push_subscriptions`);
  const today = new Date().toISOString().slice(0, 10);
  const day = await safeFirst(db, `SELECT * FROM daily_stats WHERE day = ?`, [today]);
  const last7 = await safeAll(db, `SELECT * FROM daily_stats ORDER BY day DESC LIMIT 7`);
  const top = await safeAll(
    db,
    `SELECT title, slug, views, category FROM articles WHERE status = 'published' ORDER BY views DESC LIMIT 8`
  );
  const byCat = await safeAll(
    db,
    `SELECT category, COUNT(*) as c FROM articles WHERE status = 'published' GROUP BY category`
  );
  return {
    total: total?.c || 0,
    published: published?.c || 0,
    views: views?.v || 0,
    subscribers: subs?.c || 0,
    today: day || { day: today, visitors: 0, pageviews: 0, saves: 0, pushes: 0 },
    last7: last7.results || [],
    top: top.results || [],
    byCat: byCat.results || [],
  };
}
