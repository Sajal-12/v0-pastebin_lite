import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function createPaste(id: string, content: string, ttlSeconds?: number, maxViews?: number) {
  const expiresAt = ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : null

  const result = await sql`
    INSERT INTO pastes (id, content, expires_at, max_views)
    VALUES (${id}, ${content}, ${expiresAt}, ${maxViews || null})
    RETURNING id, created_at, expires_at, max_views
  `

  return result[0]
}

export async function getPaste(id: string) {
  const result = await sql`
    SELECT id, content, expires_at, max_views, view_count
    FROM pastes WHERE id = ${id}
  `

  return result[0] || null
}

export async function incrementViewCount(id: string) {
  const result = await sql`
    UPDATE pastes SET view_count = view_count + 1
    WHERE id = ${id}
    RETURNING view_count
  `

  return result[0]?.view_count || null
}

export async function healthCheck() {
  try {
    await sql`SELECT 1`
    return true
  } catch {
    return false
  }
}
