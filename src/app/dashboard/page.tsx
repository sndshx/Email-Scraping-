"use client";

import { useEffect, useState, useRef } from "react";
import { RefreshCw, LayoutDashboard, ScanSearch, Table2, History, LogOut, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ── Types ──────────────────────────────────────────────────────────────────
interface DashboardData {
  totalCompanies: number;
  emailsExtracted: number;
  totalJobs: number;
  successRate: number;
  successJobs: number;
  runningJobs: number;
  failedJobs: number;
  weeklyEmails: number[];
  emailsOverTime: number[];
}

// ── Donut Chart ────────────────────────────────────────────────────────────
function DonutChart({ successful, running, failed, total, rate }: {
  successful: number; running: number; failed: number; total: number; rate: number;
}) {
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 58;
  const strokeWidth = 18;

  function getArc(startPct: number, pct: number, color: string) {
    if (pct <= 0) return null;
    const gap = 0.012;
    const start = (startPct + gap) * 2 * Math.PI - Math.PI / 2;
    const end = (startPct + pct - gap) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = pct > 0.5 ? 1 : 0;
    return (
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
        fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
      />
    );
  }

  const t = total || 1;
  const sPct = successful / t;
  const rPct = running / t;
  const fPct = failed / t;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
      {getArc(0, sPct, "#22c55e")}
      {getArc(sPct, rPct, "#eab308")}
      {getArc(sPct + rPct, fPct, "#ef4444")}
      <text x={cx} y={cy - 8} textAnchor="middle" fontSize="26" fontWeight="700" fill="#111827">{rate}%</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#9ca3af">success rate</text>
    </svg>
  );
}

// ── Bar Chart ──────────────────────────────────────────────────────────────
function BarChart({ data, days }: { data: number[]; days: string[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-sm transition-all duration-500"
            style={{
              height: `${Math.round((v / max) * 80)}px`,
              background: v === Math.max(...data) ? "#3b82f6" : v > max * 0.4 ? "#93c5fd" : "#dbeafe",
              minHeight: "4px",
            }}
          />
          <span className="text-[10px] text-gray-400">{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ── Line Chart ─────────────────────────────────────────────────────────────
function LineChart({ data }: { data: number[] }) {
  const w = 580;
  const h = 120;
  const pad = { t: 10, b: 30, l: 40, r: 10 };
  const gW = w - pad.l - pad.r;
  const gH = h - pad.t - pad.b;
  const max = Math.max(...data, 1);
  const min = 0;

  const xs = data.map((_, i) => pad.l + (i / (data.length - 1)) * gW);
  const ys = data.map(v => pad.t + gH - ((v - min) / (max - min)) * gH);

  const linePath = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const fillPath = linePath + ` L${xs[xs.length - 1]},${pad.t + gH} L${xs[0]},${pad.t + gH} Z`;

  const yLabels = [0, Math.round(max * 0.33), Math.round(max * 0.66), max];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {yLabels.map((v, i) => {
        const y = pad.t + gH - ((v - min) / (max - min)) * gH;
        return (
          <g key={i}>
            <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="#f3f4f6" strokeWidth="1" />
            <text x={pad.l - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#9ca3af">{v}</text>
          </g>
        );
      })}
      <path d={fillPath} fill="url(#lineGrad)" />
      <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
      ))}
      {days.map((d, i) => (
        <text key={i} x={xs[i]} y={h - 6} textAnchor="middle" fontSize="9" fill="#9ca3af">{d}</text>
      ))}
    </svg>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar() {
  const pathname = usePathname();
  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Scraper", href: "/scrape", icon: ScanSearch },
    { label: "Result", href: "/results", icon: Table2 },
    { label: "History", href: "/history", icon: History },
  ];

  return (
    <aside className="hidden md:flex w-56 min-h-screen bg-white border-r border-slate-100 flex-col sticky top-0 h-screen">
      <div className="flex items-center gap-2.5 h-16 px-5 border-b border-slate-100">
        <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
          <rect x="2" y="6" width="24" height="17" rx="2.5" fill="#2563EB" />
          <polyline points="2,6 14,16 26,6" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
        </svg>
        <span className="text-[16px] font-bold text-[#2563EB]">ScrapeEngine</span>
      </div>

      <nav className="flex flex-col gap-0.5 flex-1 px-3 py-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active ? "bg-blue-50 text-[#2563EB]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <item.icon className={`w-4 h-4 ${active ? "text-[#2563EB]" : "text-slate-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-2">
        <Link
          href="/pricing"
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
        >
          <Zap className="w-4 h-4" />
          Upgrade to Pro
        </Link>
      </div>

      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={() => { window.location.href = "/"; }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut className="w-4 h-4" />
          sign out
        </button>
      </div>
    </aside>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({
  label, value, trend, trendUp, borderColor, icon,
}: {
  label: string; value: string | number; trend: string; trendUp: boolean; borderColor: string; icon: React.ReactNode;
}) {
  return (
    <div className={`bg-white rounded-2xl p-5 border-l-4 shadow-sm`} style={{ borderLeftColor: borderColor }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="text-gray-400">{icon}</div>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-4xl font-light text-gray-900 mb-3">{value}</div>
      <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
        trendUp ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
      }`}>
        {trendUp ? "↗" : "↘"} {trend}
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: 'user@scrapeengine.com',
    name: 'ScrapeEngine User',
    initial: 'S'
  });
  const [subscriptionInfo, setSubscriptionInfo] = useState({
    daysLeft: 30,
    planType: 'Free',
    isActive: false
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await fetch("/api/user-info");
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data);
      }
    } catch (err) {
      console.error("User info fetch error:", err);
    }
  };

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/user-subscription");
      if (res.ok) {
        const data = await res.json();
        setSubscriptionInfo(data);
      }
    } catch (err) {
      console.error("Subscription fetch error:", err);
    }
  };

  useEffect(() => { 
    fetchData();
    fetchUserInfo();
    fetchSubscription();
  }, []);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-400 mt-0.5">Here&apos;s what&apos;s happening with your campaigns today</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button className="flex items-center gap-2 text-sm text-white bg-blue-600 rounded-lg px-4 py-2 hover:bg-blue-700 transition font-medium">
              New campaign
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
              >
                <span className="text-white text-sm font-extrabold leading-none select-none">{userInfo.initial}</span>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  {/* Profile Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white text-lg font-bold">{userInfo.initial}</span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{userInfo.name}</p>
                        <p className="text-blue-100 text-xs">{userInfo.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Info */}
                  <div className="p-4 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Subscription</span>
                      {subscriptionInfo.isActive && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-emerald-700 text-[10px] font-bold">Active</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-blue-600 font-medium mb-0.5">{subscriptionInfo.planType} Plan</p>
                          <p className="text-lg font-bold text-blue-900">{subscriptionInfo.daysLeft} Days</p>
                        </div>
                        <div className="w-14 h-14 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center">
                          <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-[10px] text-blue-600 mt-1">Remaining in your subscription</p>
                    </div>

                    {!subscriptionInfo.isActive && (
                      <Link 
                        href="/pricing"
                        className="block w-full text-center py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Upgrade to Pro
                      </Link>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <Link
                      href="/pricing"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Zap className="w-4 h-4 text-slate-400" />
                      Manage Subscription
                    </Link>
                    <button
                      onClick={() => { window.location.href = "/"; }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : data ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Total companies"
                value={data.totalCompanies}
                trend="+12%"
                trendUp={true}
                borderColor="#3b82f6"
                icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 22V12h6v10"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1"/></svg>}
              />
              <StatCard
                label="Emails extracted"
                value={data.emailsExtracted}
                trend="+18%"
                trendUp={true}
                borderColor="#22c55e"
                icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>}
              />
              <StatCard
                label="Total jobs"
                value={data.totalJobs}
                trend="+12%"
                trendUp={true}
                borderColor="#eab308"
                icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>}
              />
              <StatCard
                label="Success rate"
                value={`${data.successRate}%`}
                trend="Needs attention"
                trendUp={false}
                borderColor="#3b82f6"
                icon={<svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>}
              />
            </div>

            {/* Mid row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Job success rate */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-900">Job success rate</span>
                  <span className="text-xs text-gray-400">All time</span>
                </div>
                <div className="flex items-center gap-6">
                  <DonutChart
                    successful={data.successJobs}
                    running={data.runningJobs}
                    failed={data.failedJobs}
                    total={data.totalJobs}
                    rate={data.successRate}
                  />
                  <div className="flex flex-col gap-3 text-sm">
                    {[
                      { label: "Successful", val: data.successJobs,  color: "#22c55e" },
                      { label: "Running",    val: data.runningJobs,   color: "#eab308" },
                      { label: "Failed",     val: data.failedJobs,    color: "#ef4444" },
                      { label: "Total",      val: data.totalJobs,     color: "#d1d5db" },
                    ].map((r) => (
                      <div key={r.label} className="flex items-center justify-between gap-8">
                        <span className="flex items-center gap-2 text-gray-500">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                          {r.label}
                        </span>
                        <span className="font-semibold text-gray-900">{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Emails extracted this week */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-900">Emails extracted</span>
                  <span className="text-xs text-gray-400">This week</span>
                </div>
                <BarChart
                  data={data.weeklyEmails?.length ? data.weeklyEmails : [0, 0, 0, 0, 0, 0, 0]}
                  days={weekDays}
                />
              </div>
            </div>

            {/* Emails extracted over time */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-900">Emails extracted over time</span>
                <span className="text-xs text-gray-400">This week</span>
              </div>
              <LineChart
                data={data.emailsOverTime?.length ? data.emailsOverTime : [0, 0, 0, 0, 0, 0, 0]}
              />
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400 mt-20">Failed to load data. Please refresh.</div>
        )}
      </main>
    </div>
  );
}