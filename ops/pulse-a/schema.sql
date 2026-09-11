-- LaneCash D1 schema
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'money',
  image_url TEXT,
  reading_minutes INTEGER DEFAULT 8,
  views INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  author_team TEXT DEFAULT 'LaneCash Fin Team',
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

-- One row per day only (low writes)
CREATE TABLE IF NOT EXISTS daily_stats (
  day TEXT PRIMARY KEY,
  visitors INTEGER DEFAULT 0,
  pageviews INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  pushes INTEGER DEFAULT 0
);

-- Push subscriptions (write only on enable/disable)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id TEXT PRIMARY KEY,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  topics TEXT DEFAULT 'all',
  created_at TEXT DEFAULT (datetime('now')),
  last_seen TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);

INSERT OR IGNORE INTO categories (id, slug, name, description) VALUES
  ('cat_money', 'money', 'Money & Hustle', 'Side hustles and practical finance'),
  ('cat_opps', 'opportunities', 'Crypto', 'Crypto and USDT'),
  ('cat_scams', 'scams', 'Scam Alerts', 'Warnings'),
  ('cat_guides', 'guides', 'Guides', 'How-to guides'),
  ('cat_news', 'news', 'Quick Updates', 'Short money news');
