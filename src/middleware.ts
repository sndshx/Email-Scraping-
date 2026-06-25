import { NextRequest, NextResponse } from 'next/server'

const publicPages = ['/', '/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (publicPages.includes(pathname)) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}