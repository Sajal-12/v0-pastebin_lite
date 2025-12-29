import { getPaste } from "@/lib/db"
import { notFound } from "next/navigation"

export default async function ViewPastePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  try {
    const paste = await getPaste(id)

    if (!paste) {
      notFound()
    }

    const now = Date.now()

    // Check if expired
    if (paste.expires_at) {
      const expiresAt = new Date(paste.expires_at).getTime()
      if (now >= expiresAt) {
        notFound()
      }
    }

    // Check if view limit exceeded
    if (paste.max_views !== null && paste.view_count >= paste.max_views) {
      notFound()
    }

    // Increment view count
    await fetch(
      `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/pastes/${id}`,
    )

    // Sanitize content to prevent XSS
    const sanitizedContent = paste.content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")

    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-lg shadow-sm p-6">
            <div className="mb-4 text-sm text-muted-foreground">
              <p>
                ID: <code className="bg-muted px-2 py-1 rounded text-xs font-mono">{id}</code>
              </p>
              {paste.expires_at && <p>Expires: {new Date(paste.expires_at).toISOString()}</p>}
              {paste.max_views && (
                <p>
                  Views: {paste.view_count} / {paste.max_views}
                </p>
              )}
            </div>
            <pre className="bg-muted p-4 rounded overflow-x-auto font-mono text-sm leading-relaxed whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
              <code>{sanitizedContent}</code>
            </pre>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return {
    title: `Paste ${id} - Pastebin Lite`,
  }
}
