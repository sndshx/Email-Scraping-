
import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { 
  Search, Filter, ArrowLeft, ArrowRight, PlayCircle,
  Briefcase, RotateCcw, RefreshCw, LogOut, ExternalLink,
  Building2, CheckCircle2, XCircle
} from "lucide-react";

interface ScrapeJob {
  id: string;
  keyword: string;
  status: "SUCCESS" | "FAILED" | "RUNNING";
  resultsCount: number;
  createdAt: string;
}

interface PaginationData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface DashboardData {
  totalCompanies: number;
  totalJobs: number;
  successJobs: number;
  failedJobs: number;
  latestJob: ScrapeJob | null;
}

export default function History() {
  const [jobs, setJobs] = useState<ScrapeJob[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [stats, setStats] = useState<DashboardData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

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

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: page.toString(), limit: "10" });
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (statusFilter) params.append("status", statusFilter);
      const res = await fetch(`/api/history?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setJobs(data.jobs || []);
      setPagination(data.pagination || null);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    setPage(1);
  };

  const handleRefreshAll = () => {
    fetchDashboardStats();
    fetchHistory();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Scraping History</h1>
          <p className="text-xs text-slate-400 mt-0.5">Complete list of all email scraping jobs.</p>
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
        {/* Statistics Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: Briefcase,
              label: "Total Jobs",
              value: stats?.totalJobs ?? "ΓÇö",
              iconBg: "bg-indigo-50",
              iconColor: "text-indigo-600",
              sub: "Submitted keyword scans",
            },
            {
              icon: CheckCircle2,
              label: "Successful Jobs",
              value: stats?.successJobs ?? "ΓÇö",
              iconBg: "bg-emerald-50",
              iconColor: "text-emerald-600",
              sub: "Completed successfully",
            },
            {
              icon: XCircle,
              label: "Failed Jobs",
              value: stats?.failedJobs ?? "ΓÇö",
              iconBg: "bg-rose-50",
              iconColor: "text-rose-600",
              sub: "Unsuccessful runs",
            },
            {
              icon: Building2,
              label: "Total Extracted",
              value: stats?.totalCompanies ?? "ΓÇö",
              iconBg: "bg-blue-50",
      </div>
    </div>
  );
}
