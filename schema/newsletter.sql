-- Run once on LaneCash D1

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL COLLATE NOCASE,
  site TEXT NOT NULL DEFAULT 'lanecash',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(email, site)
);

CREATE INDEX IF NOT EXISTS idx_nl_active ON newsletter_subscribers (site, status);
