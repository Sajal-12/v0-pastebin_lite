import { healthCheck } from "@/lib/db"

export async function GET() {
  const dbHealthy = await healthCheck()

  return Response.json({ ok: dbHealthy }, { status: dbHealthy ? 200 : 503 })
}
