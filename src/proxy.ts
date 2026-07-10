import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === 'ADMIN'

  const isAdminRoute = nextUrl.pathname.startsWith('/admin')
  const isUserRoute = nextUrl.pathname.startsWith('/my-bookings')
  const isAuthRoute = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register')

  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login', nextUrl))
    if (!isAdmin) return NextResponse.redirect(new URL('/', nextUrl))
    return NextResponse.next()
  }

  if (isUserRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
}
