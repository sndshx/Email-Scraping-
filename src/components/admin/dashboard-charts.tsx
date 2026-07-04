'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const PIE_COLORS = ['#94a3b8', '#3b82f6', '#8b5cf6'] // slate, blue, purple

interface ChartDataPoint {
  date: string
  signups: number
  revenue: number
}

interface PlanData {
  plan: string
  _count: number
}

interface JobStatusData {
  status: string
  _count: number
}

interface Props {
  chartData: ChartDataPoint[]
  planData: PlanData[]
  scrapeJobStatus: JobStatusData[]
}

const CustomTooltipRevenue = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs">
        <p className="text-slate-500 font-bold mb-2">{label}</p>
        {payload.map((p: any) => (
          <div key={p.name} className="flex items-center gap-2 mt-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-600 capitalize font-medium">{p.name}:</span>
            <span className="text-slate-900 font-bold ml-auto">
              {p.name === 'revenue' ? `$${Number(p.value).toFixed(2)}` : p.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function AdminDashboardCharts({ chartData, planData, scrapeJobStatus }: Props) {
  const pieData = planData.map((p, i) => ({
    name: p.plan.charAt(0).toUpperCase() + p.plan.slice(1),
    value: p._count,
    color: PIE_COLORS[i] ?? '#94a3b8',
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 7-day Signups Area Chart */}
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-slate-900 font-bold text-base">Signups & Revenue</h2>
            <p className="text-slate-400 text-xs mt-0.5">Platform activity over the last 7 days</p>
          </div>
          <div className="flex gap-4 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-500 rounded-full" />
              Signups
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full" />
              Revenue
            </span>
          </div>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradSignups" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '600' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '600' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '600' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltipRevenue />} />
              <Area yAxisId="left" type="monotone" dataKey="signups" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradSignups)" dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 3 }} name="signups" />
              <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#gradRevenue)" dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }} name="revenue" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">
            Not enough data to display chart yet
          </div>
        )}
      </div>

      {/* Plan Distribution Pie */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-slate-900 font-bold text-base">Plan Distribution</h2>
          <p className="text-slate-400 text-xs mt-0.5">Active users segmented by plan type</p>
        </div>
        {pieData.some(p => p.value > 0) ? (
          <>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#1e293b', fontSize: 12, fontWeight: '600' }}
                  formatter={(v: any, name: any) => [v, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5 mt-4">
              {pieData.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                    <span className="text-slate-500 font-semibold capitalize">{p.name}</span>
                  </div>
                  <span className="text-slate-900 font-bold">{p.value}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">
            No active user data found
          </div>
        )}
      </div>
    </div>
  )
}
