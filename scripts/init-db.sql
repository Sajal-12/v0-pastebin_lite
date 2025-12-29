-- Create pastes table
CREATE TABLE IF NOT EXISTS pastes (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP,
  max_views INTEGER,
  view_count INTEGER NOT NULL DEFAULT 0
);

-- Create index on expires_at for efficient expiry queries
CREATE INDEX IF NOT EXISTS idx_pastes_expires_at ON pastes(expires_at);

-- Create index on id for quick lookups
CREATE INDEX IF NOT EXISTS idx_pastes_id ON pastes(id);
