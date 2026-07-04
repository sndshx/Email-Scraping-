import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

// Called after Clerk login to auto-set admin cookie if user is admin
export async function POST(request: NextRequest) {
  try {
    // Try to get email from request body first (passed from login form)
    let email: string | null = null

    try {
      const body = await request.json()
      email = body.email || null
    } catch (_) {}

    // If not in body, try to get from Clerk session
    if (!email) {
      const { userId } = await auth()
      if (userId) {
        const { clerkClient } = await import('@clerk/nextjs/server')
        const client = await clerkClient()
        const clerkUser = await client.users.getUser(userId)
        email = clerkUser.emailAddresses[0]?.emailAddress || null
      }
    }

    if (!email) {
      return NextResponse.json({ isAdmin: false })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true },
    })

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ isAdmin: false })
    }

    // Generate admin token and set cookie
    const token = signToken({ userId: user.id, email: user.email })

    const response = NextResponse.json({ isAdmin: true })
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Admin auto-login error:', error)
    return NextResponse.json({ isAdmin: false })
  }
}
