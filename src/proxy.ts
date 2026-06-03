import { NextResponse, type NextRequest } from 'next/server'

// Cheap edge gate: only checks for a session cookie's presence (no DB/adapter).
// Real validation happens in (user)/layout.tsx via auth().
const SESSION_COOKIES = ['authjs.session-token', '__Secure-authjs.session-token']

export function proxy(request: NextRequest) {
  const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name))
  if (hasSession) return NextResponse.next()

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/watchlist', '/watched'],
}
