"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Building2, Briefcase, CheckCircle2,
  RefreshCw, TrendingUp, LogOut, Zap, ExternalLink, Clock,
} from "lucide-react";
import Sidebar from "@/app/component/sidebar";

interface DashboardData {
  totalCompanies: number; totalJobs: number;
  successJobs: number; failedJobs: number;
}

function Sparkline({ color = "#2563EB", id }: { color?: string; id: string }) {
  const pts = "0,28 10,22 20,24 30,18 40,20 50,14 60,16 70,10 80,12 90,6 100,8";
  return (
    <svg viewBox="0 0 100 36" className="w-24 h-10" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,36 ${pts} 100,36`} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarChart() {
  const bars = [25, 30, 25, 30, 35, 80, 95];
  const days = ["M","T","W","T","F","S","S"];
  return (
    <div className="flex items-end gap-2 w-full h-24">
      {bars.map((h, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1 justify-end h-full">
          <div className="w-full rounded-md transition-all"
            style={{ height: `${h}%`, background: i >= 5 ? "#2563EB" : "#dbeafe" }} />
          <span className="text-[10px] text-slate-400">{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ success, failed, running, total }: { success: number; failed: number; running: number; total: number }) {
  const r = 52, cx = 60, cy = 60, circ = 2 * Math.PI * r;
  const sp = total > 0 ? success / total : 0;
  const fp = total > 0 ? failed  / total : 0;
  const rp = total > 0 ? running / total : 0;
  const g  = total > 0 ? 0.012 : 0;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="flex-shrink-0">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="14" />
      {total === 0
        ? <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth="14" />
        : <>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#10b981" strokeWidth="14" strokeLinecap="round"
              strokeDasharray={`${Math.max(0,sp-g)*circ} ${circ}`} strokeDashoffset={circ*0.25} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f43f5e" strokeWidth="14" strokeLinecap="round"
              strokeDasharray={`${Math.max(0,fp-g)*circ} ${circ}`} strokeDashoffset={circ*0.25 - sp*circ} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f59e0b" strokeWidth="14" strokeLinecap="round"
              strokeDasharray={`${Math.max(0,rp-g)*circ} ${circ}`} strokeDashoffset={circ*0.25 - (sp+fp)*circ} />
          </>
      }
      <text x={cx} y={cy-4} textAnchor="middle" fontSize="18" fontWeight="800" fill="#0f172a">
        {total > 0 ? `${Math.round(sp*100)}%` : "—"}
      </text>
      <text x={cx} y={cy+14} textAnchor="middle" fontSize="10" fill="#94a3b8">success rate</text>
    </svg>
  );
}

export default function Dashboard() {
  const [stats, setStats]               = useState<DashboardData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError]     = useState<string | null>(null);
  const [profileOpen, setProfileOpen]   = useState(false);
  const profileRef                      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const r = await fetch("/api/dashboard");
      if (!r.ok) throw new Error("Failed to load stats");
      setStats(await r.json());
    } catch (e: unknown) { setStatsError(e instanceof Error ? e.message : "Error"); }
    finally { setStatsLoading(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  const total       = stats?.totalJobs      ?? 0;
  const success     = stats?.successJobs    ?? 0;
  const failed      = stats?.failedJobs     ?? 0;
  const running     = Math.max(0, total - success - failed);
  const companies   = stats?.totalCompanies ?? 0;
  const successRate = total > 0 ? Math.round((success / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#f0f4f8] px-4 md:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900">
              Welcome back, <span className="text-[#2563EB]">ScrapeEngine</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Here&apos;s what&apos;s happening with your campaigns today.</p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={fetchStats}
              className="flex items-center gap-1.5 px-2 md:px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer shadow-sm">
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <Link href="/scrape"
              className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition cursor-pointer shadow-sm">
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Campaign</span>
            </Link>
            <div className="relative" ref={profileRef}>
              <button onClick={() => setProfileOpen(p => !p)}
                className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center hover:bg-blue-700 transition cursor-pointer">
                <span className="text-white text-sm font-extrabold select-none">S</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-11 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">ScrapeEngine</p>
                    <p className="text-[10px] text-slate-400">Platform v1.0</p>
                  </div>
                  <button onClick={() => { setProfileOpen(false); window.location.href = "/"; }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="flex-1 px-4 md:px-6 pb-6 flex flex-col gap-4">

          {statsError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-xl text-xs">⚠ {statsError}</div>
          )}

          {/* Row 1: stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Building2,    label: "Total companies", sub: "Extracted businesses",    val: companies, color: "#2563EB", bg: "bg-blue-50",    id: "sg1" },
              { icon: Briefcase,    label: "Total jobs",      sub: "Campaigns submitted",     val: total,     color: "#6366f1", bg: "bg-indigo-50",  id: "sg2" },
              { icon: CheckCircle2, label: "Successful",      sub: "Completed without error", val: success,   color: "#10b981", bg: "bg-emerald-50", id: "sg3" },
            ].map(({ icon: Icon, label, sub, val, color, bg, id }) => (
              <div key={label} className="bg-white rounded-2xl px-5 py-4 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <Sparkline color={color} id={id} />
                </div>
                {statsLoading
                  ? <div className="h-8 w-16 bg-slate-100 rounded-lg animate-pulse" />
                  : <p className="text-3xl font-extrabold text-slate-900 leading-tight">{(val ?? 0).toLocaleString()}</p>
                }
                <p className="text-xs text-slate-400 leading-tight">{sub}</p>
                <div className="flex items-center justify-between pt-1 border-t border-slate-50 mt-auto">
                  <span className="text-xs font-semibold text-slate-600">{label}</span>
                  <span className="flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                    <TrendingUp className="w-3 h-3" />{label === "Successful" ? `${successRate}% rate` : "+12%"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Donut + Bar + Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Job success rate */}
            <div className="bg-white rounded-2xl px-5 py-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Job success rate</h3>
                <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">All time</span>
              </div>
              <div className="flex items-center gap-4">
                <DonutChart success={success} failed={failed} running={running} total={total} />
                <div className="space-y-3 flex-1">
                  {[
                    { label:"Successful", val:success, color:"#10b981" },
                    { label:"Failed",     val:failed,  color:"#f43f5e" },
                    { label:"Running",    val:running, color:"#f59e0b" },
                    { label:"Total",      val:total,   color:"#6366f1" },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                      <span className="text-xs text-slate-500 flex-1">{label}</span>
                      <span className="text-sm font-bold text-slate-800">{(val ?? 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/history" className="text-xs font-semibold text-[#2563EB] hover:underline border-t border-slate-50 pt-2">
                → View full history
              </Link>
            </div>

            {/* Emails extracted */}
            <div className="bg-white rounded-2xl px-5 py-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Emails extracted</h3>
                <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">This week</span>
              </div>
              {statsLoading
                ? <div className="h-10 w-24 bg-slate-100 rounded-lg animate-pulse" />
                : <p className="text-4xl font-extrabold text-slate-900">{companies.toLocaleString()}</p>
              }
              <p className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                <TrendingUp className="w-3 h-3" />+18% vs last week
              </p>
              <BarChart />
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-2xl px-5 py-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
              <h3 className="text-sm font-bold text-slate-800">Quick actions</h3>
              <div className="flex flex-col gap-2">
                {[
                  { href:"/scrape",  icon:Zap,       label:"New scrape campaign", sub:"Launch a new scraping job"   },
                  { href:"/results", icon:Building2,  label:"Browse results",      sub:"View extracted companies"   },
                  { href:"/history", icon:Clock,      label:"Scrape history",      sub:"All past jobs & statuses"   },
                ].map(({ href, icon: Icon, label, sub }) => (
                  <Link key={href} href={href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800">{label}</p>
                      <p className="text-xs text-slate-400 truncate">{sub}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
