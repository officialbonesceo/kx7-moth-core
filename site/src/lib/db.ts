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
  // SELECT * avoids crashing if optional columns (author_team, etc.) are missing
  if (category) {
    return safeAll<Article>(
      db,
      `SELECT * FROM articles WHERE status = 'published' AND category = ? ORDER BY published_at DESC LIMIT ? OFFSET ?`,
      [category, limit, offset]
    );
  }
  return safeAll<Article>(
    db,
    `SELECT * FROM articles WHERE status = 'published' ORDER BY published_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
}

export async function countArticles(db: D1Database, category?: string) {
  if (category) {
    const row = await safeFirst<{ c: number }>(
      db,
      `SELECT COUNT(*) as c FROM articles WHERE status = 'published' AND category = ?`,
      [category]
    );
    return row?.c || 0;
  }
  const row = await safeFirst<{ c: number }>(db, `SELECT COUNT(*) as c FROM articles WHERE status = 'published'`);
  return row?.c || 0;
}

export async function getArticleBySlug(db: D1Database, slug: string) {
  return safeFirst<Article>(
    db,
    `SELECT * FROM articles WHERE slug = ? AND status = 'published' LIMIT 1`,
    [slug]
  );
}

export async function searchArticles(db: D1Database, q: string, limit = 20) {
  const like = `%${q.replace(/[%_]/g, '')}%`;
  return safeAll<Article>(
    db,
    `SELECT * FROM articles WHERE status = 'published' AND (title LIKE ? OR summary LIKE ?) ORDER BY published_at DESC LIMIT ?`,
    [like, like, limit]
  );
}

export async function bumpViews(db: D1Database, id: string) {
  if (Math.random() > 0.3) return;
  try {
    await db.prepare(`UPDATE articles SET views = COALESCE(views,0) + 3 WHERE id = ?`).bind(id).run();
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
