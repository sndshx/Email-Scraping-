import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/login(.*)',
  '/signup(.*)',
  '/forgot-password(.*)',
  '/verify-email(.*)',
  '/api/whatsapp(.*)',
  '/api/webhook(.*)',       // ✅ Stripe webhook must be public (no Clerk session)
  '/api/subscription-details(.*)', // ✅ Called from success page with session_id
])

export default clerkMiddleware(
  async (auth, request) => {
    if (!isPublicRoute(request)) {
      await auth.protect()
    }
  },
  { debug: false }  // ✅ Disabled debug logs
)

export const config = {
  matcher: [
    // Skip Next.js internals and all static files (images, fonts, etc.) unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}