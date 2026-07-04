import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  console.log("--> API POST /api/admin/login started")
  try {
    const body = await request.json()
    console.log("--> Request body:", JSON.stringify(body))
    const { email, password } = body

    if (!email || !password) {
      console.log("--> Missing email or password")
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log("--> Querying database for email:", email)
    const user = await prisma.user.findUnique({
      where: { email }
    })
    console.log("--> Database query finished. User found:", !!user)

    if (!user || user.role !== 'admin') {
      console.log("--> Unauthorized: Not an admin or user not found")
      return NextResponse.json(
        { error: 'Unauthorized: Admin access only' },
        { status: 401 }
      )
    }

    if (!user.password) {
      console.log("--> Admin password is not set in DB")
      return NextResponse.json(
        { error: 'Admin password not set' },
        { status: 401 }
      )
    }

    console.log("--> Comparing bcrypt password")
    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log("--> Bcrypt match result:", passwordMatch)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log("--> Admin verified. Signing token...")
    const token = signToken({ userId: user.id, email: user.email })

    const response = NextResponse.json(
      { success: true, message: 'Admin login successful' },
      { status: 200 }
    )

    // Set secure httpOnly cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    console.log("--> Set cookie. Returning success response.")
    return response

  } catch (error) {
    console.error('--> Admin login API error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
