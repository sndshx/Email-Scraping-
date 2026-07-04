'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { LayoutDashboard, Users, ScanSearch, CreditCard, MessageSquare, BarChart3, LogOut, ArrowLeft, UserCircle } from 'lucide-react'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/scrape-jobs', label: 'Scrape Jobs', icon: ScanSearch },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/whatsapp', label: 'WhatsApp Logs', icon: MessageSquare },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/profile', label: 'Admin Profile', icon: UserCircle },
]

export default function AdminSidebar({ admin }: { admin: any }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col min-h-screen sticky top-0 h-screen">
      {/* Brand Header */}
      <div className="flex items-center gap-3 h-16 px-5 border-b border-slate-100 flex-shrink-0">
        <Image
          src="/logo.png"
          alt="ScrapeEngine logo"
          width={36}
          height={36}
          className="object-contain flex-shrink-0"
        />
        <div className="flex flex-col">
          <span className="text-[17px] font-bold tracking-tight text-[#2563EB]">ScrapeEngine</span>
        </div>
      </div>



      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <link.icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Back to app & Logout */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </Link>
        <button
          onClick={async () => {
            try {
              const res = await fetch('/api/admin/logout', { method: 'POST' })
              if (res.ok) {
                window.location.href = '/'
              }
            } catch (err) {
              console.error('Logout failed:', err)
            }
          }}
          className="w-full text-left flex items-center gap-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Log Out Admin
        </button>
      </div>
    </aside>
  )
}
