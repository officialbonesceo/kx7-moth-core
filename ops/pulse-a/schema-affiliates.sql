-- Run once in D1 console
CREATE TABLE IF NOT EXISTS affiliates (
  id TEXT PRIMARY KEY,
  keyword TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  enabled INTEGER DEFAULT 1,
  hits INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_aff_keyword ON affiliates(keyword);
CREATE TABLE IF NOT EXISTS affiliate_hints (
  id TEXT PRIMARY KEY,
  keyword TEXT NOT NULL,
  article_slug TEXT,
  seen_count INTEGER DEFAULT 1,
  last_seen TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_aff_hints_kw ON affiliate_hints(keyword);
