'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const planBadge: Record<string, string> = {
  free:    'bg-slate-100 text-slate-600 border-slate-200',
  starter: 'bg-blue-50 text-blue-700 border-blue-100',
  plus:    'bg-purple-50 text-purple-700 border-purple-100',
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs">
        <p className="text-slate-500 font-bold mb-1">{label}</p>
        <p className="text-emerald-600 font-extrabold text-sm">${Number(payload[0].value).toFixed(2)}</p>
      </div>
    )
  }
  return null
}

export default function AdminAnalyticsChart({ payments, topScrapers }: any) {
  // Group payments by day
  const byDay = payments.reduce((acc: any, p: any) => {
    const day = new Date(p.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
    acc[day] = (acc[day] ?? 0) + p.amount
    return acc
  }, {})

  const chartData = Object.entries(byDay).map(([date, amount]) => ({ date, amount }))

  return (
    <div className="space-y-6">
      {/* Revenue Bar Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-slate-900 font-bold text-base">Revenue — Last 30 Days</h2>
        <p className="text-slate-400 text-xs mt-0.5 mb-6">Daily revenue from successful payments</p>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 4, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: '600' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: '600' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.05)' }} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-40 flex items-center justify-center text-slate-400 text-sm font-medium">
            No payment data in the last 30 days
          </div>
        )}
      </div>

      {/* Top Scrapers Leaderboard */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-slate-900 font-bold text-base">Top Scrapers</h2>
        <p className="text-slate-400 text-xs mt-0.5 mb-6">Users with the most companies scraped</p>
        {topScrapers.length > 0 ? (
          <div className="space-y-2">
            {topScrapers.map((user: any, i: number) => (
              <div
                key={user.email}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
              >
                <span className={`text-xs font-extrabold w-6 text-center ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-orange-400' : 'text-slate-300'}`}>
                  #{i + 1}
                </span>
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm flex-shrink-0">
                  {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-900 text-sm font-bold truncate">{user.name}</div>
                  <div className="text-slate-400 text-xs truncate">{user.email}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${planBadge[user.plan] ?? planBadge.free}`}>
                    {user.plan}
                  </span>
                  <div className="text-right">
                    <div className="text-blue-600 font-extrabold text-base">{user.scrapeCount.toLocaleString()}</div>
                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">scrapes</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-slate-400 text-sm font-medium">
            No scrape activity yet
          </div>
        )}
      </div>
    </div>
  )
}
