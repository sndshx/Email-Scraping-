import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const publicPages = ['/', '/login', '/api/whatsapp']

export function proxy(request: NextRequest) {
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

  const payload = verifyToken(token)
  
  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}