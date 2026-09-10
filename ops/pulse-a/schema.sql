-- LaneCash D1 schema
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'money',
  image_url TEXT,
  reading_minutes INTEGER DEFAULT 4,
  views INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  source_name TEXT,
  source_url TEXT,
  published_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);

INSERT OR IGNORE INTO categories (id, slug, name, description) VALUES
  ('cat_money', 'money', 'Money & Hustle', 'Side hustles, income tips, practical finance'),
  ('cat_opps', 'opportunities', 'Opportunities', 'Jobs, grants, schemes, openings'),
  ('cat_scams', 'scams', 'Scam Alerts', 'Warnings and how to stay safe'),
  ('cat_guides', 'guides', 'Guides', 'Step-by-step how-to articles'),
  ('cat_news', 'news', 'Quick Updates', 'Short practical money news');
