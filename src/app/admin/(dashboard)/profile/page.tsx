import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import ProfileClient from './profile-client'

export default async function AdminProfilePage() {
  const adminSession = await requireAdmin()

  // Fetch in parallel for better performance
  const [adminDetails, recentJobs, totalUsers, totalScrapes, totalPayments, totalWhatsApp, revenueAgg] = await Promise.all([
    prisma.user.findUnique({
      where: { id: adminSession.id },
      include: {
        _count: {
          select: { scrapeJobs: true, payments: true },
        },
      },
    }),
    prisma.scrapeJob.findMany({
      where: { userId: adminSession.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        query: true,
        status: true,
        totalFound: true,
        createdAt: true,
      },
    }),
    prisma.user.count(),
    prisma.scrapeJob.count(),
    prisma.payment.count(),
    prisma.whatsAppMessage.count(),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { OR: [{ status: 'succeeded' }, { status: 'paid' }] },
    }),
  ])

  if (!adminDetails) {
    throw new Error('Admin user details not found')
  }

  // Format dates and values to string to avoid nextjs server/client component serialization issues
  const formattedAdmin = {
    id: adminDetails.id,
    name: adminDetails.name,
    email: adminDetails.email,
    role: adminDetails.role,
    plan: adminDetails.plan,
    whatsappNumber: adminDetails.whatsappNumber,
    scrapeCount: adminDetails.scrapeCount,
    scrapeLimit: adminDetails.scrapeLimit,
    createdAt: adminDetails.createdAt.toISOString(),
    jobsCount: adminDetails._count.scrapeJobs,
    paymentsCount: adminDetails._count.payments,
  }

  const formattedJobs = recentJobs.map(job => ({
    ...job,
    createdAt: job.createdAt.toISOString(),
  }))

  const platformStats = {
    totalUsers,
    totalScrapes,
    totalPayments,
    totalWhatsApp,
    totalRevenue: revenueAgg._sum.amount || 0,
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Profile</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Manage your administrator profile details, view platform analytics, and account security.
        </p>
      </div>

      <ProfileClient 
        admin={formattedAdmin} 
        recentJobs={formattedJobs} 
        platformStats={platformStats} 
      />
    </div>
  )
}
