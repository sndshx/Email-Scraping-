"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ScanSearch,
  Table2,
  History,
  LogOut,
  Zap,
  CheckCircle2,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Scraper", href: "/scrape", icon: ScanSearch },
  { label: "Results", href: "/results", icon: Table2 },
  { label: "History", href: "/history", icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [planType, setPlanType] = useState<string>("Free");
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true); // ← add this

  useEffect(() => {
    fetch("/api/user-subscription")
      .then((res) => res.json())
      .then((data) => {
        setPlanType(data.planType || "Free");
        setIsActive(data.isActive || false);
      })
      .catch(() => {})
      .finally(() => setLoading(false)); // ← add this
  }, []);

  const isPaid = isActive && planType.toLowerCase() !== "free";

  return (
    <aside className="hidden md:flex w-56 min-h-screen bg-white border-r border-slate-200 flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-5 border-b border-slate-100">
        <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="12" rx="2" stroke="white" strokeWidth="2" fill="none" />
            <path d="M3 8L12 13L21 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-[17px] font-bold tracking-tight text-[#2563EB]">ScrapeEngine</span>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 flex-1 px-3 py-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-blue-50 text-[#2563EB]"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-[#2563EB]" : "text-slate-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade / Current Plan Button */}
      <div className="px-3 pb-2">
        {loading ? (
          // ← neutral skeleton while API is loading — no flicker
          <div className="w-full h-10 rounded-xl bg-slate-100 animate-pulse" />
        ) : isPaid ? (
          <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {planType} Plan
          </div>
        ) : (
          <Link
            href="/pricing"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
          >
            <Zap className="w-4 h-4 flex-shrink-0" />
            Upgrade to Pro
          </Link>
        )}
      </div>

      {/* Sign Out */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={() => { window.location.href = "/"; }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}