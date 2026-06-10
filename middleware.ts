import { NextResponse, userAgent } from 'next/server'
import type { NextRequest } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

const FACEBOOK_REFERER = /^https?:\/\/(?:[a-z0-9-]+\.)*facebook\.com\//i

export function middleware(request: NextRequest) {
  const env = getRequestContext().env
  const WORDPRESS_ORIGIN = env.WORDPRESS_ORIGIN as string

  if (!WORDPRESS_ORIGIN) {
    throw new Error('WORDPRESS_ORIGIN environment variable is not set')
  }

  const { pathname, search } = request.nextUrl

  if (pathname === '/') return NextResponse.next()

  const referer = request.headers.get('referer') ?? ''
  if (!FACEBOOK_REFERER.test(referer)) return NextResponse.next()

  const { device } = userAgent(request)

  if (device.type !== 'mobile' && device.type !== 'tablet') {
    return NextResponse.next()
  }

  return NextResponse.redirect(
    new URL(`${pathname}${search}`, WORDPRESS_ORIGIN),
    302
  )
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}