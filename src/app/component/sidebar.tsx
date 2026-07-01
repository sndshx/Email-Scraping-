"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  ScanSearch,
  Table2,
  History,
  LogOut,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Scraper", href: "/scrape", icon: ScanSearch },
  { label: "Results", href: "/results", icon: Table2 },
  { label: "History", href: "/history", icon: History },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut(() => {
        window.location.href = "/";
      });
    } catch (err) {
      console.error("Sign out failed:", err);
      window.location.href = "/";
    }
  };

  return (
    <aside className="hidden md:flex w-56 min-h-screen bg-white border-r border-slate-200 flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-5 border-b border-slate-100">
        <Image
          src="/logo.png"
          alt="ScrapeEngine logo"
          width={36}
          height={36}
          className="object-contain flex-shrink-0"
        />
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

      {/* Upgrade to Pro */}
      <div className="px-3 pb-2">
        <Link
          href="/pricing"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
        >
          <Zap className="w-4 h-4 flex-shrink-0" />
          Upgrade to Pro
        </Link>
      </div>

      {/* Sign Out */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer disabled:opacity-60"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {signingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}