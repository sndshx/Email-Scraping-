"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Search, Filter, ArrowLeft, ArrowRight, PlayCircle,
  Briefcase, RotateCcw, RefreshCw, LogOut, ExternalLink,
  Building2, CheckCircle2, XCircle
} from "lucide-react";
import Sidebar from "@/app/component/sidebar";

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
    const handler = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 300);
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

  useEffect(() => { fetchDashboardStats(); }, []);
  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleReset = () => { setSearch(""); setStatusFilter(""); setPage(1); };
  const handleRefreshAll = () => { fetchDashboardStats(); fetchHistory(); };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const upper = status?.toUpperCase();
    const configs: Record<string, { cls: string; label: string }> = {
      SUCCESS:   { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Successful" },
      COMPLETED: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Successful" },
      FAILED:    { cls: "bg-rose-50 text-rose-700 border-rose-200",          label: "Failed"     },
      RUNNING:   { cls: "bg-amber-50 text-amber-700 border-amber-200 animate-pulse", label: "Running" },
    };
    const c = configs[upper] || { cls: "bg-slate-50 text-slate-700 border-slate-200", label: status };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.cls}`}>
        {upper === "RUNNING" && <PlayCircle className="w-3 h-3" />}
        {c.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      {/* Everything inside flex-1 */}
      <div className="flex-1 overflow-auto flex flex-col">

        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Scraping History</h1>
            <p className="text-xs text-slate-400 mt-0.5">Complete list of all email scraping jobs.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
              >
                <span className="text-white text-sm font-extrabold leading-none select-none">S</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden z-50">
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
                  <button
                    onClick={() => { setProfileOpen(false); window.location.href = "/"; }}
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

        {/* Page Content */}
        <div className="p-6 space-y-6 max-w-screen-2xl mx-auto w-full">

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Briefcase, label: "Total Jobs", value: stats?.totalJobs ?? "—", iconBg: "bg-indigo-50", iconColor: "text-indigo-600", sub: "Submitted keyword scans" },
              { icon: CheckCircle2, label: "Successful Jobs", value: stats?.successJobs ?? "—", iconBg: "bg-emerald-50", iconColor: "text-emerald-600", sub: "Completed successfully" },
              { icon: XCircle, label: "Failed Jobs", value: stats?.failedJobs ?? "—", iconBg: "bg-rose-50", iconColor: "text-rose-600", sub: "Unsuccessful runs" },
              { icon: Building2, label: "Total Extracted", value: stats?.totalCompanies ?? "—", iconBg: "bg-blue-50", iconColor: "text-[#2563EB]", sub: "Extracted companies" },
            ].map(({ icon: Icon, label, value, iconBg, iconColor, sub }) => (
              <div key={label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor} flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-400 font-medium truncate">{label}</p>
                    <p className="text-xl font-bold text-slate-800 tracking-tight mt-0.5">
                      {typeof value === "number" ? value.toLocaleString() : value}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 border-t border-slate-50 pt-2">{sub}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search keyword..."
                  value={search}
                  autoComplete="off"
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder-slate-400"
                />
              </div>
              <div className="relative min-w-[160px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="w-full pl-10 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="SUCCESS">Success</option>
                  <option value="FAILED">Failed</option>
                  <option value="RUNNING">Running</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {(search || statusFilter) && (
                <button onClick={handleReset} className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold transition-all cursor-pointer">
                  <RotateCcw className="w-4 h-4" /> Reset Filters
                </button>
              )}
              <button
                onClick={handleRefreshAll}
                disabled={loading || statsLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold border border-slate-200 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading || statsLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {error && (
              <div className="px-6 py-3 bg-rose-50 text-rose-700 text-xs border-b border-rose-100">
                Failed to load history: {error}
              </div>
            )}

            {loading ? (
              <div className="p-6 space-y-4 animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded-xl w-full" />)}
              </div>
            ) : jobs.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-100">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Keyword</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Results Count</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm">
                      {jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-slate-50/70 transition-colors group">
                          <td className="px-6 py-4 text-slate-800 font-semibold truncate max-w-xs">{job.keyword}</td>
                          <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{formatDate(job.createdAt)}</td>
                          <td className="px-6 py-4 text-slate-700 font-bold whitespace-nowrap">{(job.resultsCount ?? 0) .toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={job.status} /></td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/dashboard?search=${encodeURIComponent(job.keyword)}`}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-blue-700 bg-blue-50/60 hover:bg-blue-100/80 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              View Emails
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                    <span className="text-xs text-slate-500">
                      Page <span className="font-semibold text-slate-800">{pagination.currentPage}</span> of <span className="font-semibold text-slate-800">{pagination.totalPages}</span> · {pagination.totalItems} total records
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer">
                        <ArrowLeft className="w-3 h-3" /> Previous
                      </button>
                      <button onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))} disabled={page === pagination.totalPages} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer">
                        Next <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No history records found</h3>
                <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                  We couldn&apos;t find any scrape jobs matching your current filters.
                </p>
                {(search || statusFilter) && (
                  <button onClick={handleReset} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#2563EB] rounded-xl text-sm font-semibold transition-all cursor-pointer">
                    <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>{/* end flex-1 */}
    </div>
  );
}
