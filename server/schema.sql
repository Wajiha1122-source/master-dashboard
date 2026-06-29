CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dashboard_items (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('software', 'website', 'social', 'vault')),
  name TEXT NOT NULL,
  label TEXT,
  description TEXT,
  company TEXT,
  platform TEXT,
  url TEXT,
  username TEXT,
  password TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
