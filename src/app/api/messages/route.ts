import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where = search ? {
      OR: [
        { from: { contains: search } },
        { customerMessage: { contains: search } },
      ]
    } : {}

    const messages = await prisma.whatsAppMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })

    const total = await prisma.whatsAppMessage.count({ where })

    return NextResponse.json({
      messages,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    })

  } catch (error: any) {
    console.error('Messages API error:', error.message)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}