export type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  image_url?: string;
  reading_minutes: number;
  views: number;
  saves?: number;
  is_featured: number;
  status: string;
  author_team?: string;
  source_name?: string;
  source_url?: string;
  published_at: string;
};

export async function getArticles(
  db: D1Database,
  limit = 12,
  category?: string,
  offset = 0
) {
  if (category) {
    return db
      .prepare(
        `SELECT * FROM articles WHERE status = 'published' AND category = ? ORDER BY published_at DESC LIMIT ? OFFSET ?`
      )
      .bind(category, limit, offset)
      .all<Article>();
  }
  return db
    .prepare(
      `SELECT * FROM articles WHERE status = 'published' ORDER BY published_at DESC LIMIT ? OFFSET ?`
    )
    .bind(limit, offset)
    .all<Article>();
}

export async function countArticles(db: D1Database, category?: string) {
  if (category) {
    const row = await db
      .prepare(`SELECT COUNT(*) as c FROM articles WHERE status = 'published' AND category = ?`)
      .bind(category)
      .first<{ c: number }>();
    return row?.c || 0;
  }
  const row = await db
    .prepare(`SELECT COUNT(*) as c FROM articles WHERE status = 'published'`)
    .first<{ c: number }>();
  return row?.c || 0;
}

export async function getArticleBySlug(db: D1Database, slug: string) {
  return db
    .prepare(`SELECT * FROM articles WHERE slug = ? AND status = 'published' LIMIT 1`)
    .bind(slug)
    .first<Article>();
}

export async function searchArticles(db: D1Database, q: string, limit = 20) {
  const like = `%${q.replace(/[%_]/g, "")}%`;
  return db
    .prepare(
      `SELECT * FROM articles WHERE status = 'published' AND (title LIKE ? OR summary LIKE ? OR content LIKE ?) ORDER BY published_at DESC LIMIT ?`
    )
    .bind(like, like, like, limit)
    .all<Article>();
}

export async function bumpViews(db: D1Database, id: string) {
  await db.prepare(`UPDATE articles SET views = COALESCE(views,0) + 1 WHERE id = ?`).bind(id).run();
}

export async function adminStats(db: D1Database) {
  const total = await db.prepare(`SELECT COUNT(*) as c FROM articles`).first<{ c: number }>();
  const published = await db
    .prepare(`SELECT COUNT(*) as c FROM articles WHERE status = 'published'`)
    .first<{ c: number }>();
  const views = await db
    .prepare(`SELECT COALESCE(SUM(views),0) as v FROM articles`)
    .first<{ v: number }>();
  const top = await db
    .prepare(
      `SELECT title, slug, views, category FROM articles WHERE status = 'published' ORDER BY views DESC LIMIT 8`
    )
    .all();
  const byCat = await db
    .prepare(
      `SELECT category, COUNT(*) as c FROM articles WHERE status = 'published' GROUP BY category`
    )
    .all();
  return {
    total: total?.c || 0,
    published: published?.c || 0,
    views: views?.v || 0,
    top: top.results || [],
    byCat: byCat.results || [],
  };
}
