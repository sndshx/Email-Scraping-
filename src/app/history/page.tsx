
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
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6">History Page Loading...</div>
    </div>
  );
}
