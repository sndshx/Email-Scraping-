'use client'

import Link from 'next/link'

interface AdminHeaderProps {
  admin: {
    name: string
    email: string
  }
}

export default function AdminHeader({ admin }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-end px-8 flex-shrink-0 sticky top-0 z-40">
      
      {/* Simple Profile Link */}
      <Link
        href="/admin/profile"
        className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-150 group cursor-pointer"
      >
        <div className="text-right">
          <div className="text-slate-800 font-bold text-sm leading-tight">
            {admin.name}
          </div>
          <div className="text-slate-400 text-xs leading-tight mt-0.5">
            {admin.email}
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200 flex-shrink-0">
          {admin.name?.charAt(0)?.toUpperCase() ?? 'S'}
        </div>
      </Link>

    </header>
  )
}
