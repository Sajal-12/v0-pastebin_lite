"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function CreatePastePage() {
  const [content, setContent] = useState("")
  const [ttlSeconds, setTtlSeconds] = useState("")
  const [maxViews, setMaxViews] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [pasteUrl, setPasteUrl] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setPasteUrl("")
    setLoading(true)

    try {
      const payload: any = {
        content,
      }

      if (ttlSeconds) {
        const ttl = Number.parseInt(ttlSeconds, 10)
        if (isNaN(ttl) || ttl < 1) {
          setError("TTL must be a positive integer")
          setLoading(false)
          return
        }
        payload.ttl_seconds = ttl
      }

      if (maxViews) {
        const views = Number.parseInt(maxViews, 10)
        if (isNaN(views) || views < 1) {
          setError("Max views must be a positive integer")
          setLoading(false)
          return
        }
        payload.max_views = views
      }

      const response = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.error || "Failed to create paste")
        return
      }

      const data = await response.json()
      setPasteUrl(data.url)
      setContent("")
      setTtlSeconds("")
      setMaxViews("")
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create a Paste</CardTitle>
          <CardDescription>Share text snippets with optional expiry and view limits</CardDescription>
        </CardHeader>
        <CardContent>
          {pasteUrl && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Paste created successfully!</p>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={pasteUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-foreground"
                />
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(pasteUrl)
                  }}
                >
                  Copy Link
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Enter your paste content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-48 font-mono text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">TTL (seconds)</label>
                <Input
                  type="number"
                  placeholder="e.g., 3600"
                  value={ttlSeconds}
                  onChange={(e) => setTtlSeconds(e.target.value)}
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Views</label>
                <Input
                  type="number"
                  placeholder="e.g., 5"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                  min="1"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading || !content.trim()} className="w-full">
              {loading ? "Creating..." : "Create Paste"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
