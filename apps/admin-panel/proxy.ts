import { NextRequest, NextResponse } from 'next/server'

const DEV_ADMIN_SESSION_SECRET = 'dev-admin-session'

function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_SECRET ?? (process.env.NODE_ENV === 'production' ? '' : DEV_ADMIN_SESSION_SECRET)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('admin_token')?.value
  const adminSessionSecret = getAdminSessionSecret()

  if (!adminSessionSecret || !token || token !== adminSessionSecret) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
