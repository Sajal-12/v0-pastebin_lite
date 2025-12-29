import { type NextRequest, NextResponse } from "next/server"

export function proxy(request: NextRequest) {
  // Store test-now-ms header in a way that can be accessed in route handlers
  if (request.headers.get("x-test-now-ms")) {
    const requestHeaders = new Headers(request.headers)
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/pastes/:path*"],
}
