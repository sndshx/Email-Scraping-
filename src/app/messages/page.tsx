"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScanSearch,
  Table2,
  History,
  LogOut,
  MessageSquare,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Scraper", href: "/scrape", icon: ScanSearch },
  { label: "Results", href: "/results", icon: Table2 },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "History", href: "/history", icon: History },
];

interface Message {
  id: string;
  phone: string;
  customerMessage: string;
  aiReply: string;
  companiesFound: number;
  status: "SENT" | "FAILED" | "PENDING";
  createdAt: string;
}

interface PaginationData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 min-h-screen bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
      <div className="flex items-center gap-3 h-16 px-5 border-b border-slate-100">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
          <rect x="2" y="6" width="24" height="17" rx="2.5" fill="#2563EB" />
          <polyline points="2,6 14,16 26,6" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
        </svg>
        <span className="text-[17px] font-bold tracking-tight text-[#2563EB]">ScrapeEngine</span>
      </div>
      <nav className="flex flex-col gap-1 flex-1 px-3 py-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active ? "bg-blue-50 text-[#2563EB]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}>
              <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-[#2563EB]" : "text-slate-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-slate-100">
        <button onClick={() => { window.location.href = "/"; }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

const STATUS_CONFIG = {
  SENT: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2, label: "Sent" },
  FAILED: { cls: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle, label: "Failed" },
  PENDING: { cls: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock, label: "Pending" },
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: page.toString(), limit: "10" });
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (dateFilter) params.append("date", dateFilter);
      const res = await fetch(`/api/messages?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data.messages || []);
      setPagination(data.pagination || null);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, dateFilter]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Welcome back, <span className="text-[#2563EB]">ScrapeEngine</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">View all incoming WhatsApp conversations.</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            <span className="text-white text-sm font-extrabold leading-none select-none">S</span>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-5">

          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">WhatsApp Messages</h2>
              <p className="text-slate-400 text-sm mt-0.5">
                {pagination ? `${pagination.totalItems.toLocaleString()} conversations total` : "Loading..."}
              </p>
            </div>
            <button onClick={fetchMessages}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex gap-3 flex-wrap items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search by phone or message..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400" />
            </div>
            <select value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-600 focus:outline-none cursor-pointer">
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#2563EB]" />
                Conversations
              </h3>
              <span className="text-xs text-slate-400">Auto-refreshes every 30 seconds</span>
            </div>

            {error && (
              <div className="px-6 py-3 bg-rose-50 text-rose-700 text-sm border-b border-rose-100">{error}</div>
            )}

            {loading ? (
              <div className="p-8 space-y-3 animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 bg-slate-100 rounded-xl w-full" />
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="py-20 text-center px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-blue-300" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No messages yet</h3>
                <p className="text-slate-400 text-sm mt-1">WhatsApp messages will appear here!</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        {["Phone Number", "Customer Message", "AI Reply", "Companies Found", "Time", "Status", ""].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {messages.map((msg) => {
                        const status = STATUS_CONFIG[msg.status] || STATUS_CONFIG.PENDING;
                        const StatusIcon = status.icon;
                        const isExpanded = expandedId === msg.id;

                        return (
                          <>
                            <tr key={msg.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                              onClick={() => setExpandedId(isExpanded ? null : msg.id)}>
                              <td className="px-4 py-3.5 font-semibold text-slate-800 whitespace-nowrap">{msg.phone}</td>
                              <td className="px-4 py-3.5 text-slate-500 max-w-[200px] truncate">{msg.customerMessage}</td>
                              <td className="px-4 py-3.5 text-slate-500 max-w-[200px] truncate">{msg.aiReply}</td>
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-1.5">
                                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                  <span className="font-semibold text-slate-700">{msg.companiesFound}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">{formatDate(msg.createdAt)}</td>
                              <td className="px-4 py-3.5">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.cls}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {status.label}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-xs text-[#2563EB] font-semibold">
                                {isExpanded ? "Hide ▲" : "View ▼"}
                              </td>
                            </tr>

                            {/* Expanded Row */}
                            {isExpanded && (
                              <tr key={`${msg.id}-expanded`} className="bg-blue-50/30">
                                <td colSpan={7} className="px-6 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Full Customer Message</p>
                                      <p className="text-sm text-slate-700 bg-white rounded-xl p-3 border border-slate-200">{msg.customerMessage}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Full AI Reply</p>
                                      <p className="text-sm text-slate-700 bg-white rounded-xl p-3 border border-slate-200">{msg.aiReply}</p>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
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