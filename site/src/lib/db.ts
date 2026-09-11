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

export async function getArticles(db: D1Database, limit = 12, category?: string, offset = 0) {
  if (category) {
    return db
      .prepare(`SELECT id,slug,title,summary,category,image_url,reading_minutes,views,author_team,source_name,source_url,published_at FROM articles WHERE status='published' AND category=? ORDER BY published_at DESC LIMIT ? OFFSET ?`)
      .bind(category, limit, offset)
      .all<Article>();
  }
  return db
    .prepare(`SELECT id,slug,title,summary,category,image_url,reading_minutes,views,author_team,source_name,source_url,published_at FROM articles WHERE status='published' ORDER BY published_at DESC LIMIT ? OFFSET ?`)
    .bind(limit, offset)
    .all<Article>();
}

export async function countArticles(db: D1Database, category?: string) {
  if (category) {
    const row = await db.prepare(`SELECT COUNT(*) as c FROM articles WHERE status='published' AND category=?`).bind(category).first<{ c: number }>();
    return row?.c || 0;
  }
  const row = await db.prepare(`SELECT COUNT(*) as c FROM articles WHERE status='published'`).first<{ c: number }>();
  return row?.c || 0;
}

export async function getArticleBySlug(db: D1Database, slug: string) {
  return db.prepare(`SELECT * FROM articles WHERE slug=? AND status='published' LIMIT 1`).bind(slug).first<Article>();
}

export async function searchArticles(db: D1Database, q: string, limit = 20) {
  const like = `%${q.replace(/[%_]/g, '')}%`;
  return db
    .prepare(`SELECT id,slug,title,summary,category,image_url,reading_minutes,views,author_team,published_at FROM articles WHERE status='published' AND (title LIKE ? OR summary LIKE ?) ORDER BY published_at DESC LIMIT ?`)
    .bind(like, like, limit)
    .all<Article>();
}

export async function bumpViews(db: D1Database, id: string) {
  // low-write: 30% chance only
  if (Math.random() > 0.3) return;
  await db.prepare(`UPDATE articles SET views = COALESCE(views,0) + 3 WHERE id = ?`).bind(id).run();
}

export async function adminStats(db: D1Database) {
  const total = await db.prepare(`SELECT COUNT(*) as c FROM articles`).first<{ c: number }>();
  const published = await db.prepare(`SELECT COUNT(*) as c FROM articles WHERE status='published'`).first<{ c: number }>();
  const views = await db.prepare(`SELECT COALESCE(SUM(views),0) as v FROM articles`).first<{ v: number }>();
  const subs = await db.prepare(`SELECT COUNT(*) as c FROM push_subscriptions`).first<{ c: number }>();
  const today = new Date().toISOString().slice(0, 10);
  const day = await db.prepare(`SELECT * FROM daily_stats WHERE day = ?`).bind(today).first();
  const last7 = await db.prepare(`SELECT * FROM daily_stats ORDER BY day DESC LIMIT 7`).all();
  const top = await db.prepare(`SELECT title, slug, views, category FROM articles WHERE status='published' ORDER BY views DESC LIMIT 8`).all();
  const byCat = await db.prepare(`SELECT category, COUNT(*) as c FROM articles WHERE status='published' GROUP BY category`).all();
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
