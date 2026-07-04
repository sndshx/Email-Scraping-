import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { signToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin()
    const body = await request.json()
    const { name, email, whatsappNumber, scrapeLimit, currentPassword, newPassword } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // 1. Check if email is changing and if it is already taken
    if (email.toLowerCase() !== admin.email.toLowerCase()) {
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already in use by another account' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {
      name,
      email: email.toLowerCase(),
      whatsappNumber: whatsappNumber || null,
    }

    if (scrapeLimit !== undefined) {
      updateData.scrapeLimit = parseInt(scrapeLimit) || 50
    }

    // 2. Handle password update if password fields are provided
    if (currentPassword && newPassword) {
      const user = await prisma.user.findUnique({
        where: { id: admin.id },
      })

      if (!user || !user.password) {
        return NextResponse.json(
          { error: 'Admin account not fully configured' },
          { status: 400 }
        )
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return NextResponse.json(
          { error: 'Incorrect current password' },
          { status: 401 }
        )
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      updateData.password = hashedPassword
    }

    // Update in database
    const updatedUser = await prisma.user.update({
      where: { id: admin.id },
      data: updateData,
      select: { id: true, name: true, email: true, scrapeLimit: true },
    })

    const response = NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    })

    // 3. If email changed, sign a new admin token and set it in the cookies
    if (email.toLowerCase() !== admin.email.toLowerCase()) {
      const newToken = signToken({ userId: admin.id, email: updatedUser.email })
      response.cookies.set('admin-token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
    }

    return response

  } catch (error: any) {
    console.error('Admin profile update error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}
