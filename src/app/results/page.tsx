"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Download,
  Trash2,
  RefreshCw,
  Copy,
  ChevronLeft,
  ChevronRight,
  Check,
  LayoutDashboard,
  ScanSearch,
  Table2,
  History,
  LogOut,
  MoreHorizontal,
  Building2,
} from "lucide-react";
import Link from "next/link";

interface Company {
  id: string;
  name: string;
  email: string | null;
  website: string | null;
  location: string | null;
  industry: string | null;
  companySize: string | null;
  source: string | null;
  createdAt: string;
}

interface PaginationData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

const SOURCE_COLORS: Record<string, string> = {
  LinkedIn: "bg-blue-50 text-blue-700 border-blue-200",
  "Google Maps": "bg-green-50 text-green-700 border-green-200",
  "Yellow Pages": "bg-yellow-50 text-yellow-700 border-yellow-200",
  Crunchbase: "bg-purple-50 text-purple-700 border-purple-200",
  Clutch: "bg-orange-50 text-orange-700 border-orange-200",
  Indeed: "bg-sky-50 text-sky-700 border-sky-200",
  Apollo: "bg-rose-50 text-rose-700 border-rose-200",
  Craigslist: "bg-slate-50 text-slate-700 border-slate-200",
};

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Scraper", href: "/scrape", icon: ScanSearch },
  { label: "Results", href: "/results", icon: Table2 },
  { label: "History", href: "/history", icon: History },
];

export default function ResultsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("");
  const [size, setSize] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: page.toString(), limit: "50" });
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (industry) params.append("industry", industry);
      if (location) params.append("location", location);
      if (source) params.append("source", source);
      if (size) params.append("size", size);
      const res = await fetch(`/api/results?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch results");
      const data = await res.json();
      setCompanies(data.companies || []);
      setPagination(data.pagination || null);
      setSelectedIds([]);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, industry, location, source, size]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? companies.map((c) => c.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((i) => i !== id)
    );
  };

  const handleCopyEmail = (id: string, email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return;
    if (!confirm(`Delete ${selectedIds.length} selected companies?`)) return;
    try {
      setDeleting(true);
      await fetch("/api/results", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      fetchCompanies();
    } catch {
      alert("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      setDownloading(true);
      const res = await fetch("/api/results/download");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "results.csv";
      a.click();
    } catch {
      alert("Failed to download");
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Top Header - same as dashboard */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Welcome back, <span className="text-[#2563EB]">ScrapeEngine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">View and manage your scraped results.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            <span className="text-white text-sm font-extrabold leading-none select-none">S</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - exact same as dashboard */}
        <aside className="w-56 min-h-screen bg-white border-r border-slate-200 flex flex-col py-6 px-4 sticky top-[57px] h-[calc(100vh-57px)]">
          <nav className="flex flex-col gap-1 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  item.href === "/results"
                    ? "bg-blue-50 text-[#2563EB] font-semibold"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => { window.location.href = "/"; }}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <p className="text-xs text-slate-300 px-1 mt-3">Scraping Platform v1.0</p>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-5">

          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Results</h2>
              <p className="text-slate-400 text-sm mt-0.5">
                {pagination ? `${pagination.totalItems.toLocaleString()} companies found` : "Loading..."}
              </p>
            </div>
            <div className="flex gap-2">
              {selectedIds.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-sm font-semibold hover:bg-rose-100 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete ({selectedIds.length})
                </button>
              )}
              <button
                onClick={fetchCompanies}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleDownloadCSV}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {downloading ? "Downloading..." : "Download CSV"}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex gap-3 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search company, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400"
              />
            </div>
            <select value={industry} onChange={(e) => { setIndustry(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-600 focus:outline-none cursor-pointer">
              <option value="">All Industries</option>
              <option>IT</option>
              <option>Marketing</option>
              <option>Finance</option>
              <option>Healthcare</option>
              <option>Education</option>
            </select>
            <select value={location} onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-600 focus:outline-none cursor-pointer">
              <option value="">All Locations</option>
              <option>USA</option>
              <option>UK</option>
              <option>Canada</option>
              <option>Australia</option>
            </select>
            <select value={source} onChange={(e) => { setSource(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-600 focus:outline-none cursor-pointer">
              <option value="">All Sources</option>
              <option>LinkedIn</option>
              <option>Google Maps</option>
              <option>Yellow Pages</option>
              <option>Crunchbase</option>
              <option>Clutch</option>
              <option>Indeed</option>
              <option>Apollo</option>
            </select>
            <select value={size} onChange={(e) => { setSize(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-600 focus:outline-none cursor-pointer">
              <option value="">All Sizes</option>
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Table Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#2563EB]" />
                Scraped Companies
              </h3>
              <button className="p-1 rounded-lg hover:bg-slate-50 cursor-pointer">
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {error && (
              <div className="px-6 py-3 bg-rose-50 text-rose-700 text-sm border-b border-rose-100">{error}</div>
            )}

            {loading ? (
              <div className="p-8 space-y-3 animate-pulse">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-10 bg-slate-100 rounded-xl w-full" />
                ))}
              </div>
            ) : companies.length === 0 ? (
              <div className="py-20 text-center px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <Table2 className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No results found</h3>
                <p className="text-slate-400 text-sm mt-1">Try scraping something first!</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 w-10">
                          <input type="checkbox"
                            checked={selectedIds.length === companies.length && companies.length > 0}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 cursor-pointer"
                          />
                        </th>
                        {["Company Name", "Email", "Website", "Location", "Industry", "Size", "Source", "Date Scraped", ""].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {companies.map((company) => (
                        <tr key={company.id} className="hover:bg-slate-50/70 transition-colors group">
                          <td className="px-6 py-3.5">
                            <input type="checkbox"
                              checked={selectedIds.includes(company.id)}
                              onChange={(e) => handleSelectOne(company.id, e.target.checked)}
                              className="rounded border-slate-300 text-blue-600 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-slate-800 max-w-[140px] truncate">{company.name}</td>
                          <td className="px-4 py-3.5 text-slate-500 max-w-[160px] truncate">{company.email || "—"}</td>
                          <td className="px-4 py-3.5 text-slate-500 max-w-[130px] truncate">
                            {company.website ? (
                              <a href={`https://${company.website}`} target="_blank" rel="noreferrer"
                                className="text-[#2563EB] hover:underline">{company.website}</a>
                            ) : "—"}
                          </td>
                          <td className="px-4 py-3.5 text-slate-500 max-w-[120px] truncate">{company.location || "—"}</td>
                          <td className="px-4 py-3.5 text-slate-500">{company.industry || "—"}</td>
                          <td className="px-4 py-3.5 text-slate-500">{company.companySize || "—"}</td>
                          <td className="px-4 py-3.5">
                            {company.source ? (
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${SOURCE_COLORS[company.source] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                                {company.source}
                              </span>
                            ) : "—"}
                          </td>
                          <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">{formatDate(company.createdAt)}</td>
                          <td className="px-4 py-3.5">
                            {company.email && (
                              <button
                                onClick={() => handleCopyEmail(company.id, company.email!)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                              >
                                {copiedId === company.id
                                  ? <Check className="w-4 h-4 text-green-500" />
                                  : <Copy className="w-4 h-4" />}
                              </button>
                            )}
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
                      Page <span className="font-semibold text-slate-800">{pagination.currentPage}</span> of{" "}
                      <span className="font-semibold text-slate-800">{pagination.totalPages}</span>
                      {" "}· {pagination.totalItems.toLocaleString()} total
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer">
                        <ChevronLeft className="w-3 h-3" /> Prev
                      </button>
                      <button onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))} disabled={page === pagination.totalPages}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer">
                        Next <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}