"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Sidebar from "@/app/component/sidebar";

const SCRAPERS = [
  { id: "linkedin", label: "LinkedIn", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "google_maps", label: "Google Maps", color: "bg-green-50 text-green-700 border-green-200" },
  { id: "apollo", label: "Apollo.io", color: "bg-violet-50 text-violet-700 border-violet-200" },
];

export default function ScrapePage() {
  const router = useRouter();
  const [selectedScraper, setSelectedScraper] = useState("");
  const [keyword, setKeyword] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [maxResults, setMaxResults] = useState("50");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);

  const handleScrape = async () => {
    if (!selectedScraper) return alert("Please select a scraper!");
    if (!keyword) return alert("Please enter a keyword!");

    try {
      setLoading(true);
      setResult(null);

      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scraper: selectedScraper,
          keyword,
          industry,
          location,
          companySize,
          maxResults: parseInt(maxResults),
        }),
      });

      const data = await res.json();

      // ── Auto redirect to pricing if limit reached ──────────────────────
      if (res.status === 403 && data.error === "LIMIT_REACHED") {
        router.push(data.upgradeUrl || "/pricing");
        return;
      }

      if (!res.ok) throw new Error(data.error || "Scraping failed");

      setResult({
        success: true,
        message: "Scraping completed!",
        count: data.count,
      });

      // If this scrape pushed user to the limit, redirect after 1.5s
      if (data.usage?.isLimitReached) {
        setTimeout(() => router.push("/pricing"), 1500);
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />

      <div className="flex-1 overflow-auto flex flex-col">
        {/* Header — envelope icon removed */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Welcome back, <span className="text-[#2563EB]">ScrapeEngine</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Start a new scraping job below.
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
            <span className="text-white text-sm font-extrabold leading-none select-none">S</span>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">New Scrape Job</h2>
            <p className="text-slate-400 text-sm mt-0.5">Select a platform and enter your search details below.</p>
          </div>

          {/* Scraper Selection */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Select Scraping Platform</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SCRAPERS.map((scraper) => (
                <button
                  key={scraper.id}
                  onClick={() => setSelectedScraper(scraper.id)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                    selectedScraper === scraper.id
                      ? scraper.color + " ring-2 ring-offset-1 ring-blue-400"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {scraper.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Search Filters</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Keyword *</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. IT companies in USA"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Industry</label>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-600 focus:outline-none cursor-pointer">
                  <option value="">All Industries</option>
                  <option>IT</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Real Estate</option>
                  <option>Retail</option>
                  <option>Manufacturing</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Location</label>
                <select value={location} onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-600 focus:outline-none cursor-pointer">
                  <option value="">All Locations</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>India</option>
                  <option>Germany</option>
                  <option>France</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Company Size</label>
                <select value={companySize} onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-600 focus:outline-none cursor-pointer">
                  <option value="">All Sizes</option>
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">Max Results</label>
                <select value={maxResults} onChange={(e) => setMaxResults(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-600 focus:outline-none cursor-pointer">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                  <option>200</option>
                </select>
              </div>
            </div>
          </div>

          {/* Result Message */}
          {result && (
            <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
              result.success
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-rose-50 border-rose-200 text-rose-700"
            }`}>
              {result.success ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <div>
                <p className="text-sm font-semibold">{result.message}</p>
                {result.count !== undefined && (
                  <p className="text-xs mt-0.5">{result.count} companies saved to database!</p>
                )}
              </div>
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={handleScrape}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-[#2563EB] text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-60 cursor-pointer shadow-sm shadow-blue-200"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Scraping in progress...</>
            ) : (
              <><Play className="w-5 h-5" /> Start Scraping</>
            )}
          </button>
        </main>
      </div>
    </div>
  );
}