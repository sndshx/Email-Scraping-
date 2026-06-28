"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScanSearch,
  Table2,
  History,
  LogOut,
  MessageSquare,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Scraper", href: "/scrape", icon: ScanSearch },
  { label: "Results", href: "/results", icon: Table2 },
  { label: "History", href: "/history", icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-5 border-b border-slate-100">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
          <rect x="2" y="6" width="24" height="17" rx="2.5" fill="#2563EB" />
          <polyline points="2,6 14,16 26,6" stroke="white" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
        </svg>
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
              <item.icon
                className={`w-4 h-4 flex-shrink-0 ${
                  active ? "text-[#2563EB]" : "text-slate-400"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

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