// Redis utilities for caching and rate limiting
export async function getFromCache(key: string): Promise<string | null> {
  try {
    const response = await fetch(process.env.KV_REST_API_URL! + "/get/" + key, {
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN!}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.result || null
  } catch {
    return null
  }
}

export async function setInCache(key: string, value: string, exSeconds?: number): Promise<boolean> {
  try {
    const body: Record<string, any> = { value }
    if (exSeconds) {
      body.ex = exSeconds
    }

    const response = await fetch(process.env.KV_REST_API_URL! + "/set/" + key, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    return response.ok
  } catch {
    return false
  }
}

export async function deleteFromCache(key: string): Promise<boolean> {
  try {
    const response = await fetch(process.env.KV_REST_API_URL! + "/del/" + key, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.KV_REST_API_TOKEN!}`,
      },
    })

    return response.ok
  } catch {
    return false
  }
}
