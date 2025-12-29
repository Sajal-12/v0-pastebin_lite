import { getPaste, incrementViewCount } from "@/lib/db"
import { headers } from "next/headers"

function getCurrentTime(): number {
  if (process.env.TEST_MODE === "1") {
    // For testing: use x-test-now-ms header if provided
    const headersList = headers()
    const testNow = headersList.get("x-test-now-ms")
    if (testNow) {
      return Number.parseInt(testNow, 10)
    }
  }
  return Date.now()
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const paste = await getPaste(id)

    if (!paste) {
      return Response.json({ error: "Paste not found" }, { status: 404 })
    }

    const now = getCurrentTime()

    // Check if paste has expired
    if (paste.expires_at) {
      const expiresAt = new Date(paste.expires_at).getTime()
      if (now >= expiresAt) {
        return Response.json({ error: "Paste has expired" }, { status: 404 })
      }
    }

    // Check if view limit exceeded (before incrementing)
    if (paste.max_views !== null && paste.view_count >= paste.max_views) {
      return Response.json({ error: "View limit exceeded" }, { status: 404 })
    }

    // Increment view count
    const newViewCount = await incrementViewCount(id)

    // Calculate remaining views
    const remainingViews = paste.max_views !== null ? paste.max_views - newViewCount : null

    return Response.json(
      {
        content: paste.content,
        remaining_views: remainingViews,
        expires_at: paste.expires_at || null,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error fetching paste:", error)
    return Response.json({ error: "Failed to fetch paste" }, { status: 500 })
  }
}
