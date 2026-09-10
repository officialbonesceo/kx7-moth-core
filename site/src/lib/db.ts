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
  is_featured: number;
  status: string;
  published_at: string;
};

export async function getArticles(db: D1Database, limit = 12, category?: string) {
  if (category) {
    return db
      .prepare(
        `SELECT * FROM articles WHERE status = 'published' AND category = ? ORDER BY published_at DESC LIMIT ?`
      )
      .bind(category, limit)
      .all<Article>();
  }
  return db
    .prepare(
      `SELECT * FROM articles WHERE status = 'published' ORDER BY published_at DESC LIMIT ?`
    )
    .bind(limit)
    .all<Article>();
}

export async function getArticleBySlug(db: D1Database, slug: string) {
  return db
    .prepare(`SELECT * FROM articles WHERE slug = ? AND status = 'published' LIMIT 1`)
    .bind(slug)
    .first<Article>();
}
