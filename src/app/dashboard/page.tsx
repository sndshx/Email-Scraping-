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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: Building2, label: "Total Companies", value: stats?.totalCompanies ?? "—",
              iconBg: "bg-blue-50", iconColor: "text-[#2563EB]", sub: "Extracted businesses",
            },
            {
              icon: Briefcase, label: "Total Jobs", value: stats?.totalJobs ?? "—",
              iconBg: "bg-indigo-50", iconColor: "text-indigo-600", sub: "Jobs submitted",
            },
            {
              icon: CheckCircle2, label: "Successful Jobs", value: stats?.successJobs ?? "—",
              iconBg: "bg-emerald-50", iconColor: "text-emerald-600", sub: "Completed successfully",
            },
            {
              icon: XCircle, label: "Failed Jobs", value: stats?.failedJobs ?? "—",
              iconBg: "bg-rose-50", iconColor: "text-rose-600", sub: "Failed or crashed",
            },
          ].map(({ icon: Icon, label, value, iconBg, iconColor, sub }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
              <div className="flex-shrink-0"><Icon /></div>
              <div>
                <p className="text-xs text-slate-500 font-semibold">{label}</p>
                <p className="text-2xl font-extrabold">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
