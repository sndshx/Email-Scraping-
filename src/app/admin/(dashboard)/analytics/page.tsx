import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import AdminAnalyticsChart from '@/components/admin/analytics-chart'

export default async function AdminAnalytics() {
  await requireAdmin()

  // Users by plan
  const usersByPlan = await prisma.user.groupBy({
    by: ['plan'],
    _count: true,
  })

  // Revenue last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const recentPayments = await prisma.payment.findMany({
    where: {
      createdAt: { gte: thirtyDaysAgo },
      OR: [{ status: 'succeeded' }, { status: 'paid' }],
    },
    orderBy: { createdAt: 'asc' },
    select: { amount: true, createdAt: true },
  })

  // Top scrapers
  const topScrapers = await prisma.user.findMany({
    orderBy: { scrapeCount: 'desc' },
    take: 10,
    select: { name: true, email: true, scrapeCount: true, plan: true },
  })

  const totalRevenue30d = recentPayments.reduce((sum, p) => sum + p.amount, 0)

  const planStyles: Record<string, { card: string; label: string; count: string; bar: string }> = {
    free:    { card: 'bg-white border-slate-200',   label: 'text-slate-500',  count: 'text-slate-900', bar: 'bg-slate-400' },
    starter: { card: 'bg-blue-50 border-blue-100',  label: 'text-blue-600',   count: 'text-slate-900', bar: 'bg-blue-500' },
    plus:    { card: 'bg-purple-50 border-purple-100', label: 'text-purple-600', count: 'text-slate-900', bar: 'bg-purple-500' },
  }

  const totalUsers = usersByPlan.reduce((s, p) => s + p._count, 0)

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Platform-wide performance and usage insights</p>
      </div>

      {/* Users by plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {usersByPlan.map((p) => {
          const s = planStyles[p.plan] ?? planStyles.free
          const pct = totalUsers > 0 ? Math.round((p._count / totalUsers) * 100) : 0
          return (
            <div key={p.plan} className={`border rounded-2xl p-6 shadow-sm ${s.card}`}>
              <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${s.label}`}>
                {p.plan} Plan
              </div>
              <div className={`text-4xl font-extrabold tracking-tight ${s.count}`}>{p._count}</div>
              <div className="text-slate-400 text-xs mt-1 mb-4">{pct}% of all users</div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${s.bar} rounded-full`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* 30-day revenue summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-6">
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
          📈
        </div>
        <div className="flex-1">
          <div className="text-slate-500 text-xs uppercase tracking-wider font-bold mb-1">
            Revenue — Last 30 Days
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            ${totalRevenue30d.toFixed(2)}
          </div>
          <div className="text-slate-400 text-xs mt-1">{recentPayments.length} successful transactions</div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">Avg per day</div>
          <div className="text-slate-900 font-bold text-lg mt-1">
            ${(totalRevenue30d / 30).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Charts */}
      <AdminAnalyticsChart payments={recentPayments} topScrapers={topScrapers} />
    </div>
  )
}
