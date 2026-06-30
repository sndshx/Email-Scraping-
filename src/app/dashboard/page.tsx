"use client";

import { useEffect, useState, useRef } from "react";
import { RefreshCw, LayoutDashboard, ScanSearch, Table2, History, LogOut, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ── WhatsApp Icon Component ────────────────────────────────────────────────
function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-5.247 1.414 1.414-5.247-0.292-0.507c-1.224-2.162-1.87-4.588-1.87-7.070 0-7.51 6.123-13.633 13.633-13.633s13.633 6.123 13.633 13.633c0 7.51-6.123 13.633-13.633 13.633z"/>
      <path d="M23.274 19.654c-0.385-0.194-2.283-1.125-2.637-1.253-0.354-0.129-0.611-0.194-0.868 0.194s-0.998 1.253-1.223 1.511c-0.226 0.258-0.451 0.29-0.836 0.097-0.385-0.194-1.625-0.599-3.096-1.911-1.145-1.020-1.918-2.282-2.144-2.667s-0.024-0.595 0.169-0.788c0.175-0.173 0.385-0.451 0.578-0.677 0.193-0.226 0.257-0.387 0.386-0.645s0.064-0.483-0.032-0.677c-0.097-0.194-0.868-2.091-1.189-2.863-0.314-0.751-0.632-0.651-0.868-0.663-0.225-0.011-0.482-0.013-0.739-0.013s-0.675 0.097-1.029 0.483c-0.354 0.387-1.349 1.318-1.349 3.215s1.381 3.728 1.574 3.986c0.193 0.258 2.717 4.15 6.584 5.818 0.92 0.397 1.638 0.634 2.197 0.811 0.923 0.294 1.762 0.253 2.427 0.153 0.741-0.111 2.283-0.933 2.605-1.834s0.322-1.673 0.226-1.834c-0.097-0.161-0.354-0.258-0.739-0.451z"/>
    </svg>
  );
}

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
    <div className={`bg-white rounded-2xl p-6 border-l-[6px] shadow-sm hover:shadow-md transition-shadow`} style={{ borderLeftColor: borderColor }}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="text-gray-400" style={{ color: borderColor }}>{icon}</div>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-[30px] font-geist font-semibold text-gray-900 mb-4 tracking-tight leading-none">{value}</div>
      <div className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-semibold ${
        trendUp ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
      }`}>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          {trendUp ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          )}
        </svg>
        {trend}
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showWhatsAppChat, setShowWhatsAppChat] = useState(false);
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

  const openWhatsApp = () => {
    const phoneNumber = "14155238886"; // Your Twilio WhatsApp number
    const message = "Hi! I'd like to scrape some companies.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

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

            {/* WhatsApp Quick Action Button */}
            <button
              onClick={() => setShowWhatsAppChat(!showWhatsAppChat)}
              className="flex items-center gap-2 text-sm text-white bg-green-500 rounded-lg px-4 py-2 hover:bg-green-600 transition font-medium shadow-lg shadow-green-200"
            >
              <WhatsAppIcon className="w-5 h-5" />
              WhatsApp
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
                icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 22V12h6v10"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1"/></svg>}
              />
              <StatCard
                label="Emails extracted"
                value={data.emailsExtracted}
                trend="+18%"
                trendUp={true}
                borderColor="#22c55e"
                icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>}
              />
              <StatCard
                label="Total jobs"
                value={data.totalJobs}
                trend="+12%"
                trendUp={true}
                borderColor="#eab308"
                icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>}
              />
              <StatCard
                label="Success rate"
                value={`${data.successRate}%`}
                trend="Needs attention"
                trendUp={false}
                borderColor="#3b82f6"
                icon={<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>}
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

        {/* WhatsApp Chat Widget */}
        {showWhatsAppChat && (
          <div className="fixed bottom-24 right-8 w-[420px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-slideUp">
            {/* Header - WhatsApp Green */}
            <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <WhatsAppIcon className="w-8 h-8 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-white font-bold text-base">ScrapeEngine</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    <p className="text-white/90 text-sm font-medium">Online</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowWhatsAppChat(false)}
                className="text-white/90 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Body - WhatsApp Background Pattern */}
            <div className="p-6 bg-[#E5DDD5] min-h-[420px] max-h-[420px] overflow-y-auto relative" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d9d9d9' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}>
              <div className="space-y-4">
                {/* Bot Message with realistic WhatsApp styling */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 shadow-md">
                    <WhatsAppIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-md max-w-[85%] border border-slate-100">
                    <p className="text-sm text-slate-800 leading-relaxed">
                      👋 <span className="font-semibold">Hi! I&apos;m your ScrapeEngine AI assistant.</span>
                    </p>
                    <p className="text-sm text-slate-700 mt-3 leading-relaxed">
                      Send me a message on WhatsApp to:
                    </p>
                    <ul className="text-sm text-slate-700 mt-3 space-y-2 leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="text-[#25D366] font-bold">•</span>
                        <span>Scrape companies by keyword</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#25D366] font-bold">•</span>
                        <span>Get CSV files instantly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#25D366] font-bold">•</span>
                        <span>Check your subscription</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#25D366] font-bold">•</span>
                        <span>Ask questions anytime</span>
                      </li>
                    </ul>
                    <p className="text-xs text-slate-400 mt-2">10:30 AM</p>
                  </div>
                </div>

                {/* Info Card with improved styling */}
                <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-100">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-blue-900 mb-1">Quick Tips</p>
                      <p className="text-xs text-blue-700 mb-3">Try sending:</p>
                    </div>
                  </div>
                  <div className="space-y-2 ml-11">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-3 py-2 border border-blue-200">
                      <p className="text-xs text-blue-900 font-mono">
                        &quot;IT companies in New York&quot;
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-3 py-2 border border-blue-200">
                      <p className="text-xs text-blue-900 font-mono">
                        &quot;plan&quot; - Check usage
                      </p>
                    </div>
                  </div>
                </div>

                {/* Typing indicator (optional) */}
                <div className="flex items-center gap-3 opacity-60">
                  <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0 shadow-md">
                    <WhatsAppIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-md">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer with improved button */}
            <div className="p-5 bg-white border-t border-slate-200">
              <button
                onClick={openWhatsApp}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BD5A] hover:to-[#0F7A6B] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 transform hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="w-6 h-6" />
                <span className="text-base">Open WhatsApp Chat</span>
              </button>
              <p className="text-xs text-slate-500 text-center mt-3 font-medium">
                💬 Chat with AI • ⚡ Available 24/7
              </p>
            </div>
          </div>
        )}

        {/* Floating WhatsApp Button */}
        <button
          onClick={() => setShowWhatsAppChat(!showWhatsAppChat)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 rounded-full shadow-2xl shadow-green-300/50 flex items-center justify-center transition-all hover:scale-110 z-40 group"
        >
          <WhatsAppIcon className="w-9 h-9 text-white group-hover:scale-110 transition-transform" />
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-white text-xs font-bold">1</span>
          </div>
          {/* Pulse ring animation */}
          <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
        </button>
      </main>
    </div>
  );
}