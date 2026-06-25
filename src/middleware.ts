import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Pages that DO NOT need login
const publicPages = ['/', '/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow public pages through
  if (publicPages.includes(pathname)) {
    return NextResponse.next()
  }

  // Allow API routes through (they handle their own auth)
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // For all other pages, check for token
  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    // No token — send to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const payload = verifyToken(token)
  
  if (!payload) {
    // Token is invalid or expired — send to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Token is good — let them through
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}