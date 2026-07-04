import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await requireAdmin()

    const [users, scrapeJobs, payments, subscriptions] = await Promise.all([
      prisma.user.groupBy({ by: ['plan'], _count: true }),
      prisma.scrapeJob.groupBy({ by: ['status'], _count: true }),
      prisma.payment.aggregate({ _sum: { amount: true }, _count: true }),
      prisma.subscription.groupBy({ by: ['status'], _count: true }),
    ])

    return NextResponse.json({ users, scrapeJobs, payments, subscriptions })
  } catch (error: any) {
    console.error("Error in admin stats:", error)
    return NextResponse.json({ error: error.message || "Failed to load stats" }, { status: 500 })
  }
}
