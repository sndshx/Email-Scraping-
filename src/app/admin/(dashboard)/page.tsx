import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import AdminDashboardCharts from '@/components/admin/dashboard-charts'
import Link from 'next/link'

export default async function AdminDashboard() {
  await requireAdmin()

  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [
    totalUsers,
    newUsersThisMonth,
    newUsersLastMonth,
    totalScrapeJobs,
    totalCompanies,
    totalPayments,
    activeSubscriptions,
    totalWhatsApp,
    bannedUsers,
    adminCount,
    recentUsers,
    recentPayments,
    recentScrapeJobs,
    usersByPlan,
    scrapeJobsByStatus,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: thisMonthStart } } }),
    prisma.user.count({ where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart } } }),
    prisma.scrapeJob.count(),
    prisma.company.count(),
    prisma.payment.count(),
    prisma.subscription.count({ where: { status: 'active' } }),
    prisma.whatsAppMessage.count(),
    prisma.user.count({ where: { isBanned: true } }),
    prisma.user.count({ where: { role: 'admin' } }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, email: true, plan: true, role: true, createdAt: true, isBanned: true } }),
    prisma.payment.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { user: { select: { name: true } } } }),
    prisma.scrapeJob.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { user: { select: { name: true, email: true } }, _count: { select: { companies: true } } } }),
    prisma.user.groupBy({ by: ['plan'], _count: true }),
    prisma.scrapeJob.groupBy({ by: ['status'], _count: true }),
  ])

  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { OR: [{ status: 'succeeded' }, { status: 'paid' }] },
  })
  const revenueThisMonth = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { createdAt: { gte: thisMonthStart }, OR: [{ status: 'succeeded' }, { status: 'paid' }] },
  })
  const revenueLastMonth = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { createdAt: { gte: lastMonthStart, lt: thisMonthStart }, OR: [{ status: 'succeeded' }, { status: 'paid' }] },
  })

  // Daily signups for last 7 days
  const dailySignups = await prisma.user.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    select: { createdAt: true },
  })
  const dailyRevenue = await prisma.payment.findMany({
    where: { createdAt: { gte: sevenDaysAgo }, OR: [{ status: 'succeeded' }, { status: 'paid' }] },
    select: { createdAt: true, amount: true },
  })

  // Build 7-day chart data
  const days7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (6 - i))
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      dateStr: d.toDateString(),
    }
  })
  const chartData = days7.map(({ label, dateStr }) => ({
    date: label,
    signups: dailySignups.filter(u => new Date(u.createdAt).toDateString() === dateStr).length,
    revenue: dailyRevenue.filter(p => new Date(p.createdAt).toDateString() === dateStr).reduce((s, p) => s + p.amount, 0),
  }))

  const userGrowthPct = newUsersLastMonth === 0
    ? 100
    : Math.round(((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100)
  const revenueGrowthPct = (revenueLastMonth._sum.amount ?? 0) === 0
    ? 100
    : Math.round((((revenueThisMonth._sum.amount ?? 0) - (revenueLastMonth._sum.amount ?? 0)) / (revenueLastMonth._sum.amount ?? 0)) * 100)

  const planOrder = ['free', 'starter', 'plus']
  const sortedPlanData = [...usersByPlan].sort((a, b) => planOrder.indexOf(a.plan) - planOrder.indexOf(b.plan))

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time metrics and platform activity</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm text-right">
          <div className="text-slate-400 text-xs uppercase tracking-wide font-bold">Last Updated</div>
          <div className="text-slate-800 text-sm font-semibold">
            {now.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      </div>

      {/* ── TOP KPI CARDS ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-lg">
              👥
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${userGrowthPct >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {userGrowthPct >= 0 ? '↑' : '↓'}{Math.abs(userGrowthPct)}%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-950 tracking-tight">{totalUsers.toLocaleString()}</div>
            <div className="text-slate-500 text-sm font-medium mt-1">Total Users</div>
            <div className="text-slate-400 text-xs mt-2">+{newUsersThisMonth} new this month</div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-lg">
              💰
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${revenueGrowthPct >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              {revenueGrowthPct >= 0 ? '↑' : '↓'}{Math.abs(revenueGrowthPct)}%
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-955 tracking-tight">${(totalRevenue._sum.amount ?? 0).toFixed(2)}</div>
            <div className="text-slate-500 text-sm font-medium mt-1">Total Revenue</div>
            <div className="text-slate-400 text-xs mt-2">${(revenueThisMonth._sum.amount ?? 0).toFixed(2)} earned this month</div>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-lg">
              📦
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
              {totalUsers > 0 ? Math.round((activeSubscriptions / totalUsers) * 100) : 0}% ratio
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-955 tracking-tight">{activeSubscriptions}</div>
            <div className="text-slate-500 text-sm font-medium mt-1">Active Subscriptions</div>
            <div className="text-slate-400 text-xs mt-2">{totalPayments} total transactions</div>
          </div>
        </div>

        {/* Scrape Jobs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center text-lg">
              🔍
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700">
              {totalScrapeJobs > 0 ? Math.round(totalCompanies / totalScrapeJobs) : 0} avg / job
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-955 tracking-tight">{totalScrapeJobs.toLocaleString()}</div>
            <div className="text-slate-500 text-sm font-medium mt-1">Scrape Jobs</div>
            <div className="text-slate-400 text-xs mt-2">{totalCompanies.toLocaleString()} total companies found</div>
          </div>
        </div>
      </div>

      {/* ── SECONDARY STATS ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-lg">💬</div>
          <div>
            <div className="text-slate-900 font-bold text-lg">{totalWhatsApp.toLocaleString()}</div>
            <div className="text-slate-500 text-xs font-semibold">WhatsApp Messages</div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-lg">🚫</div>
          <div>
            <div className="text-slate-900 font-bold text-lg">{bannedUsers}</div>
            <div className="text-slate-500 text-xs font-semibold">Banned Users</div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-lg">🛡️</div>
          <div>
            <div className="text-slate-900 font-bold text-lg">{adminCount}</div>
            <div className="text-slate-500 text-xs font-semibold">System Admins</div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-lg">🏢</div>
          <div>
            <div className="text-slate-900 font-bold text-lg">{totalCompanies.toLocaleString()}</div>
            <div className="text-slate-500 text-xs font-semibold">Companies Extracted</div>
          </div>
        </div>
      </div>

      {/* ── CHARTS ROW ───────────────────────────────────────────────────────── */}
      <AdminDashboardCharts chartData={chartData} planData={sortedPlanData} scrapeJobStatus={scrapeJobsByStatus} />

      {/* ── THREE COLUMN ROW ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users by Plan Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-slate-900 font-bold text-base mb-5 flex items-center gap-2">
            <span>📊</span> Users by Plan
          </h2>
          <div className="space-y-4">
            {sortedPlanData.map((p) => {
              const pct = totalUsers > 0 ? Math.round((p._count / totalUsers) * 100) : 0
              const colors: Record<string, { bar: string; text: string; bg: string }> = {
                free: { bar: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-100' },
                starter: { bar: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50' },
                plus: { bar: 'bg-purple-500', text: 'text-purple-600', bg: 'bg-purple-50' },
              }
              const c = colors[p.plan] ?? colors.free
              return (
                <div key={p.plan}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-xs font-bold uppercase tracking-wider ${c.text}`}>{p.plan}</span>
                    <span className="text-slate-900 font-bold text-sm">{p._count} <span className="text-slate-400 font-normal text-xs">({pct}%)</span></span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${c.bar} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Scrape Job Status */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-slate-900 font-bold text-base mb-5 flex items-center gap-2">
            <span>🔍</span> Scrape Job Statuses
          </h2>
          <div className="space-y-3">
            {scrapeJobsByStatus.map((s) => {
              const statusColors: Record<string, { dot: string; text: string; bg: string }> = {
                SUCCESS: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
                RUNNING: { dot: 'bg-blue-500 animate-pulse', text: 'text-blue-700', bg: 'bg-blue-50' },
                FAILED: { dot: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50' },
                completed: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
                running: { dot: 'bg-blue-500 animate-pulse', text: 'text-blue-700', bg: 'bg-blue-50' },
                failed: { dot: 'bg-rose-500', text: 'text-rose-700', bg: 'bg-rose-50' },
              }
              const c = statusColors[s.status] ?? { dot: 'bg-slate-500', text: 'text-slate-700', bg: 'bg-slate-50' }
              const pct = totalScrapeJobs > 0 ? Math.round((s._count / totalScrapeJobs) * 100) : 0
              return (
                <div key={s.status} className={`flex items-center justify-between p-3 rounded-xl border border-slate-100/80 ${c.bg}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                    <span className={`text-sm font-semibold capitalize ${c.text}`}>{s.status.toLowerCase()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-900 font-bold">{s._count}</span>
                    <span className="text-slate-400 text-xs ml-1">({pct}%)</span>
                  </div>
                </div>
              )
            })}
            {scrapeJobsByStatus.length === 0 && (
              <div className="text-center text-slate-400 text-sm py-4">No jobs registered yet</div>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-slate-900 font-bold text-base mb-5 flex items-center gap-2">
            <span>💳</span> Recent Payments
          </h2>
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition border border-slate-100">
                <div className="min-w-0">
                  <div className="text-slate-900 text-sm font-bold truncate">
                    {payment.user?.name ?? payment.customerEmail}
                  </div>
                  <div className="text-slate-400 text-xs">
                    {new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <div className="text-right ml-3 flex-shrink-0">
                  <div className="text-emerald-600 font-bold text-sm">${payment.amount.toFixed(2)}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider ${payment.status === 'succeeded' || payment.status === 'paid' ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {payment.status}
                  </div>
                </div>
              </div>
            ))}
            {recentPayments.length === 0 && (
              <div className="text-center text-slate-400 text-sm py-4">No payments recorded yet</div>
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-slate-900 font-bold text-base flex items-center gap-2"><span>👥</span> Recently Registered Users</h2>
            <Link href="/admin/users" className="text-blue-600 hover:text-blue-700 text-xs font-bold transition">View All →</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-900 text-sm font-bold truncate">{user.name}</div>
                  <div className="text-slate-400 text-xs truncate">{user.email}</div>
                </div>
                <div className="flex gap-2 flex-shrink-0 items-center">
                  {user.isBanned && <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 font-bold uppercase tracking-wider">Banned</span>}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
                    user.plan === 'plus' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                    user.plan === 'starter' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>{user.plan}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Scrape Jobs */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-slate-900 font-bold text-base flex items-center gap-2"><span>🔍</span> Recent Scrape Jobs</h2>
            <Link href="/admin/scrape-jobs" className="text-blue-600 hover:text-blue-700 text-xs font-bold transition">View All →</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentScrapeJobs.map((job) => (
              <div key={job.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition">
                <div className="flex-1 min-w-0">
                  <div className="text-slate-900 text-sm font-bold truncate">{job.query}</div>
                  <div className="text-slate-400 text-xs truncate">{job.user?.email ?? 'Anonymous / Unknown'}</div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-slate-900 text-sm font-bold">{job._count.companies}</div>
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">found</div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
                    job.status === 'SUCCESS' || job.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : job.status === 'RUNNING' || job.status === 'running'
                      ? 'bg-blue-50 text-blue-700 border-blue-100 animate-pulse'
                      : 'bg-rose-50 text-rose-700 border-rose-100'
                  }`}>
                    {job.status.toLowerCase()}
                  </span>
                </div>
              </div>
            ))}
            {recentScrapeJobs.length === 0 && (
              <div className="px-5 py-10 text-center text-slate-400 text-sm">No scrape jobs recorded yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
