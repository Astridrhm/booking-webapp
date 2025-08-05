import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const expiryTime = Number(request.cookies.get('expiryTime')?.value || 0)
  const { pathname } = request.nextUrl

  const publicPaths = ['/signin', '/auth/register', '/public']
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  const now = Math.floor(Date.now() / 1000)
  const isExpired = expiryTime < now
  const isTokenValid = !!token && !isExpired

  if (!isPublicPath && !isTokenValid) {
    const loginUrl = new URL('/signin', request.url);
    loginUrl.searchParams.set('expired', 'true');

    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')
    response.cookies.delete('expiryTime')
    return response
  }

  if (isPublicPath && isTokenValid) {
    const dashboardUrl = new URL('/', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!_next|api|static|favicon.ico).*)'],
}