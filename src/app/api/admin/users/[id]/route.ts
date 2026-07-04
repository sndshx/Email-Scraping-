import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { getScrapeLimit } from '@/lib/plan-limits'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    const data = await req.json()

    // If plan is being updated, also update scrapeLimit and reset count
    if (data.plan) {
      data.scrapeLimit = getScrapeLimit(data.plan)
      data.scrapeCount = 0 
    }

    const user = await prisma.user.update({
      where: { id },
      data,
    })

    return NextResponse.json({ success: true, user })
  } catch (error: any) {
    console.error("Error in admin user PUT:", error)
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)

    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in admin user DELETE:", error)
    return NextResponse.json({ error: error.message || "Failed to delete user" }, { status: 500 })
  }
}
