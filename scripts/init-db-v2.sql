-- Verify tables exist and have correct structure
CREATE TABLE IF NOT EXISTS pastes (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP,
  max_views INTEGER,
  view_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_pastes_expires_at ON pastes(expires_at);
CREATE INDEX IF NOT EXISTS idx_pastes_id ON pastes(id);

-- This script can be run via: psql $DATABASE_URL < scripts/init-db.sql
