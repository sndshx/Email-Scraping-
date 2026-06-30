import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/forgot-password(.*)',
  '/verify-email(.*)',
  '/api/whatsapp(.*)',
])

export default clerkMiddleware(
  async (auth, request) => {
    if (!isPublicRoute(request)) {
      await auth.protect()
    }
  },
  { debug: true }
)

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}