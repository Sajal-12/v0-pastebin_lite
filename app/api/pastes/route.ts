import { createPaste } from "@/lib/db"
import { nanoid } from "nanoid"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, ttl_seconds, max_views } = body

    // Validation
    if (!content || typeof content !== "string" || content.trim() === "") {
      return Response.json({ error: "content is required and must be a non-empty string" }, { status: 400 })
    }

    if (ttl_seconds !== undefined) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return Response.json({ error: "ttl_seconds must be an integer ≥ 1" }, { status: 400 })
      }
    }

    if (max_views !== undefined) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        return Response.json({ error: "max_views must be an integer ≥ 1" }, { status: 400 })
      }
    }

    // Generate unique ID
    const id = nanoid(10)

    // Create paste in database
    await createPaste(id, content, ttl_seconds, max_views)

    // Determine base URL
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:3000`

    return Response.json(
      {
        id,
        url: `${baseUrl}/p/${id}`,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error creating paste:", error)
    return Response.json({ error: "Failed to create paste" }, { status: 500 })
  }
}
