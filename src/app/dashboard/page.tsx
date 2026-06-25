"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Building2,
  Briefcase,
  CheckCircle2,
  XCircle,
  PlayCircle,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Search,
  Filter,
  RotateCcw,
  MoreHorizontal,
  TrendingUp,
  BarChart3,
  Smartphone,
  Monitor,
  Tablet,
  Mail,
  LogOut,
} from "lucide-react";

interface ScrapeJob {
  id: string;
  keyword: string;
  status: "SUCCESS" | "FAILED" | "RUNNING";
  resultsCount: number;
  createdAt: string;
}

interface DashboardData {
  totalCompanies: number;
  totalJobs: number;
  successJobs: number;
  failedJobs: number;
  latestJob: ScrapeJob | null;
}

interface PaginationData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

// Mini sparkline SVG component
function Sparkline({ color = "#2563EB", uptrend = true }: { color?: string; uptrend?: boolean }) {
  const points = uptrend
    ? "0,28 10,22 20,24 30,18 40,20 50,14 60,16 70,10 80,12 90,6 100,8"
    : "0,8 10,12 20,10 30,16 40,14 50,20 60,18 70,24 80,22 90,28 100,26";
  return (
    <svg viewBox="0 0 100 36" className="w-full h-14" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${uptrend ? "up" : "dn"}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points={`0,36 ${points} 100,36`}
        fill={`url(#grad-${uptrend ? "up" : "dn"})`}
      />
    </svg>
  );
}

// Bar chart component for emails sent
function BarChart({ activeIndex = 2 }: { activeIndex?: number }) {
  const bars = [35, 55, 80, 45, 60, 30, 50];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return (
    <div className="flex items-end gap-1.5 h-20 w-full">
      {bars.map((h, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-sm transition-all duration-300"
            style={{
              height: `${h}%`,
              background:
                i === activeIndex
                  ? "linear-gradient(180deg, #2563EB 0%, #1d4ed8 100%)"
                  : "#e2e8f0",
            }}
          />
          <span className="text-[9px] text-slate-400">{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

// Donut gauge for open/reply rate
function GaugeChart() {
  const r = 54;
  const cx = 70;
  const cy = 70;
  const circ = Math.PI * r; // half-circle circumference

  // open rate 40%, reply rate 37%, CTR 23%
  const openPct = 0.4;
  const replyPct = 0.37;
  const ctrPct = 0.23;

  const openDash = openPct * circ;
  const replyDash = replyPct * circ;
  const ctrDash = ctrPct * circ;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="90" viewBox="0 0 140 90">
        {/* Background arc */}
        <path
          d="M 16 80 A 54 54 0 0 1 124 80"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* CTR arc (outermost) */}
        <path
          d="M 16 80 A 54 54 0 0 1 124 80"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${ctrDash} ${circ}`}
        />
        {/* Reply arc */}
        <path
          d="M 22 80 A 48 48 0 0 1 118 80"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${replyPct * Math.PI * 48} ${Math.PI * 48}`}
        />
        {/* Open rate arc (innermost) */}
        <path
          d="M 28 80 A 42 42 0 0 1 112 80"
          fill="none"
          stroke="#2563EB"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${openPct * Math.PI * 42} ${Math.PI * 42}`}
        />
      </svg>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [jobs, setJobs] = useState<ScrapeJob[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard statistics");
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      setStatsError(err.message || "An error occurred");
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchHistoryJobs = useCallback(async () => {
    try {
      setJobsLoading(true);
      const params = new URLSearchParams({ page: page.toString(), limit: "6" });
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (statusFilter) params.append("status", statusFilter);
      const res = await fetch(`/api/history?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setJobs(data.jobs || []);
      setPagination(data.pagination || null);
    } catch (err: any) {
      setJobsError(err.message || "An error occurred");
    } finally {
      setJobsLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => { fetchDashboardStats(); }, []);
  useEffect(() => { fetchHistoryJobs(); }, [fetchHistoryJobs]);

  const handleRefreshAll = () => { fetchDashboardStats(); fetchHistoryJobs(); };
  const handleResetFilters = () => { setSearch(""); setStatusFilter(""); setPage(1); };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const StatusBadge = ({ status }: { status: "SUCCESS" | "FAILED" | "RUNNING" }) => {
    const configs = {
      SUCCESS: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Successful" },
      FAILED: { cls: "bg-rose-50 text-rose-700 border-rose-200", label: "Failed" },
      RUNNING: { cls: "bg-amber-50 text-amber-700 border-amber-200 animate-pulse", label: "Running" },
    };
    const c = configs[status] || { cls: "bg-slate-50 text-slate-700 border-slate-200", label: status };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.cls}`}>
        {status === "RUNNING" && <PlayCircle className="w-3 h-3" />}
        {c.label}
      </span>
    );
  };

  const isAnyLoading = statsLoading || jobsLoading;

  // Derived stats
  const totalCampaigns = stats?.totalJobs ?? 0;
  const emailsSent = (stats?.totalCompanies ?? 0) * 3;
  const openRate = stats?.successJobs ? Math.round((stats.successJobs / Math.max(stats.totalJobs, 1)) * 100) : 40;
  const replyRate = 37;
  const ctrRate = 23;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Welcome back, <span className="text-[#2563EB]">ScrapeEngine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Glad to have you back! Let&apos;s get started.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* User profile avatar with dropdown */}
          <div className="relative flex items-center" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((p) => !p)}
              className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
              <span className="text-white text-sm font-extrabold leading-none select-none">S</span>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-12 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden z-50">
                {/* Profile info */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-extrabold leading-none select-none">S</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">ScrapeEngine</p>
                      <p className="text-[10px] text-slate-400">Platform v1.0</p>
                    </div>
                  </div>
                </div>
                {/* Sign Out */}
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    window.location.href = "/";
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">

        {/* Error Banner */}
        {statsError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm">
            Error loading statistics: {statsError}
          </div>
        )}

        {/* ΓöÇΓöÇ Row 0: Quick Stats Summary ΓöÇΓöÇ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: Building2, label: "Total Companies", value: stats?.totalCompanies ?? "ΓÇö",
              iconBg: "bg-blue-50", iconColor: "text-[#2563EB]", sub: "Extracted businesses",
            },
            {
              icon: Briefcase, label: "Total Jobs", value: stats?.totalJobs ?? "ΓÇö",
              iconBg: "bg-indigo-50", iconColor: "text-indigo-600", sub: "Jobs submitted",
            },
            {
              icon: CheckCircle2, label: "Successful Jobs", value: stats?.successJobs ?? "ΓÇö",
              iconBg: "bg-emerald-50", iconColor: "text-emerald-600", sub: "Completed successfully",
            },
            {
              icon: XCircle, label: "Failed Jobs", value: stats?.failedJobs ?? "ΓÇö",
              iconBg: "bg-rose-50", iconColor: "text-rose-600", sub: "Failed or crashed",
            },
          ].map(({ icon: Icon, label, value, iconBg, iconColor, sub }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow group cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{label}</p>
                {statsLoading ? (
                  <div className="h-7 w-12 bg-slate-100 rounded animate-pulse mt-1" />
                ) : (
                  <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {typeof value === "number" ? value.toLocaleString() : value}
                  </p>
                )}
                <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ΓöÇΓöÇ Row 1: 3 stat cards ΓöÇΓöÇ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Card: Total Campaigns */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Total Campaigns</p>
              <button className="p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="flex items-end justify-between">
              <div>
                {statsLoading ? (
                  <div className="h-9 w-16 bg-slate-100 rounded animate-pulse" />
                ) : (
                  <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {totalCampaigns}
                  </h2>
                )}
                <p className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +3 Increased vs last week
                </p>
              </div>
              <div className="w-32">
                <Sparkline color="#2563EB" uptrend={true} />
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
          </div>

          {/* Card: Emails Sent */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Emails Sent</p>
              <button className="p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div>
              {statsLoading ? (
                <div className="h-9 w-20 bg-slate-100 rounded animate-pulse" />
              ) : (
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                  {emailsSent.toLocaleString()}
                </h2>
              )}
              <p className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mt-1">
                <TrendingUp className="w-3.5 h-3.5" />
                +12% Increased vs last week
              </p>
            </div>
            <BarChart activeIndex={2} />
          </div>

          {/* Card: Engagement Insights */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">Engagement Insights</p>
              <button className="p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Smartphone, label: "Mobile", pct: "72%", w: "72%" },
                { icon: Monitor, label: "Desktop", pct: "20%", w: "20%" },
                { icon: Tablet, label: "Tablet", pct: "8%", w: "8%" },
              ].map(({ icon: Icon, label, pct, w }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">{label}</span>
                  <span className="text-xl font-extrabold text-slate-900">{pct}</span>
                  <div className="w-full h-16 bg-blue-50 rounded-lg overflow-hidden flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-[#2563EB] to-blue-300 rounded-lg"
                      style={{ height: w }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ΓöÇΓöÇ Row 2: Campaign Performance + Open Rate ΓöÇΓöÇ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Campaign Performance ΓÇö 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Campaign Performance</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                Jan 2024 - Dec 2024
              </div>
            </div>
            {/* SVG Line Chart */}
            {(() => {
              const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
              const values = [14200, 17800, 19500, 15800, 26446, 18200, 21000, 23500, 17200, 22100, 19800, 21500];
              const W = 540, H = 160, padL = 44, padR = 16, padT = 28, padB = 24;
              const minV = 10000, maxV = 30000;
              const toX = (i: number) => padL + (i / (months.length - 1)) * (W - padL - padR);
              const toY = (v: number) => padT + (1 - (v - minV) / (maxV - minV)) * (H - padT - padB);
              const peakIdx = values.indexOf(Math.max(...values));
              const points = values.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
              const areaPoints = `${toX(0)},${H - padB} ${points} ${toX(months.length - 1)},${H - padB}`;
              const yLabels = ["$30K","$25K","$20K","$15K","$10K"];
              const yVals   = [30000, 25000, 20000, 15000, 10000];
              return (
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 200 }}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#2563EB" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Grid lines */}
                  {yVals.map((v, i) => (
                    <g key={i}>
                      <line
                        x1={padL} y1={toY(v)} x2={W - padR} y2={toY(v)}
                        stroke="#f1f5f9" strokeWidth="1"
                      />
                      <text x={padL - 6} y={toY(v) + 4} textAnchor="end"
                        fontSize="9" fill="#94a3b8">{yLabels[i]}</text>
                    </g>
                  ))}

                  {/* Filled area */}
                  <polygon points={areaPoints} fill="url(#lineGrad)" />

                  {/* Line */}
                  <polyline
                    points={points}
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data points */}
                  {values.map((v, i) => (
                    <circle
                      key={i}
                      cx={toX(i)} cy={toY(v)} r={i === peakIdx ? 5 : 3}
                      fill={i === peakIdx ? "#2563EB" : "#fff"}
                      stroke="#2563EB"
                      strokeWidth={i === peakIdx ? 0 : 2}
                    />
                  ))}

                  {/* Peak tooltip */}
                  <g>
                    <rect
                      x={toX(peakIdx) - 28} y={toY(values[peakIdx]) - 22}
                      width={56} height={17} rx={5}
                      fill="#2563EB"
                    />
                    <text
                      x={toX(peakIdx)} y={toY(values[peakIdx]) - 10}
                      textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff"
                    >
                      $26,446
                    </text>
                  </g>

                  {/* X-axis labels */}
                  {months.map((m, i) => (
                    <text
                      key={m}
                      x={toX(i)} y={H - padB + 14}
                      textAnchor="middle" fontSize="9" fill="#94a3b8"
                    >{m}</text>
                  ))}
                </svg>
              );
            })()}
          </div>

          {/* Email Reply and Open Rate ΓÇö 1/3 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-800">Email Reply and Open Rate</h3>
              <button className="p-1 rounded-lg hover:bg-slate-50 cursor-pointer">
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="flex justify-center mt-2 mb-4">
              <GaugeChart />
            </div>
            <div className="space-y-2">
              {[
                { label: "Open Rate", pct: `${openRate}%`, color: "#2563EB" },
                { label: "Reply Rate", pct: `${replyRate}%`, color: "#93c5fd" },
                { label: "Click-Through Rate", pct: `${ctrRate}%`, color: "#cbd5e1" },
              ].map(({ label, pct, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: color }}
                  />
                  <span className="text-xs text-slate-600 flex-1">{label}</span>
                  <span className="text-xs font-bold text-slate-800">{pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ΓöÇΓöÇ Row 3: Email Accounts Table (full width) ΓöÇΓöÇ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          {/* Table Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Email Accounts</h3>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search contact..."
                  value={search}
                  autoComplete="off"
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder-slate-400 w-48"
                />
              </div>
              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="pl-9 pr-6 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 appearance-none cursor-pointer transition-all"
                >
                  <option value="">All Status</option>
                  <option value="SUCCESS">Successful</option>
                  <option value="FAILED">Failed</option>
                  <option value="RUNNING">Running</option>
                </select>
              </div>
              {(search || statusFilter) && (
                <button
                  onClick={handleResetFilters}
                  className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl transition-all cursor-pointer"
                  title="Reset Filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl transition-all cursor-pointer">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table */}
          {jobsError && (
            <div className="px-6 py-3 bg-rose-50 text-rose-700 text-xs border-b border-rose-100">
              Failed to load records: {jobsError}
            </div>
          )}

          {jobsLoading ? (
            <div className="p-6 space-y-3 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-slate-100 rounded-lg" />
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="w-10 px-6 py-3">
                        <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Verified</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Tags</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sent</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {jobs.map((job, idx) => (
                      <tr key={job.id} className="hover:bg-slate-50/70 transition-colors group">
                        <td className="px-6 py-3.5">
                          <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                        </td>
                        <td className="px-4 py-3.5 text-slate-800 font-medium text-xs truncate max-w-[220px]">
                          {job.keyword}@scrapeengine.com
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={job.status} />
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                          {formatDate(job.createdAt)}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {idx % 3 === 0 ? (
                              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">Nothing</span>
                            ) : idx % 3 === 1 ? (
                              <span className="text-xs px-2 py-0.5 bg-blue-50 text-[#2563EB] rounded-full font-medium">Promo</span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium">Lead</span>
                            )}
                            <button className="text-xs text-slate-400 hover:text-[#2563EB] transition-colors cursor-pointer font-medium">
                              Add +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#2563EB] rounded-full"
                                style={{ width: `${Math.min((job.resultsCount % 5) * 20, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
                              {job.resultsCount % 5}/5
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-[#2563EB] rounded-lg transition-colors cursor-pointer">
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-lg transition-colors cursor-pointer">
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                  <span className="text-xs text-slate-500">
                    Page{" "}
                    <span className="font-semibold text-slate-800">{pagination.currentPage}</span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-800">{pagination.totalPages}</span>
                    {" "}┬╖ {pagination.totalItems} total records
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      disabled={page === 1}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3 h-3" /> Previous
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
                      disabled={page === pagination.totalPages}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      Next <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center px-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No accounts found</h3>
              <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                No email accounts match your current filters. Try adjusting your search.
              </p>
              {(search || statusFilter) && (
                <button
                  onClick={handleResetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-xl text-sm font-semibold transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
                </button>
              )}
            </div>
          )}
        </div>



      </div>
    </div>
  );
}
