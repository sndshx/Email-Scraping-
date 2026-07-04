import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/admin'
import AdminSidebar from '@/components/admin/admin-sidebar'
import AdminHeader from '@/components/admin/admin-header'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getAdminUser()
  if (!admin) redirect('/admin/login')

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AdminSidebar admin={admin} />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header Navbar */}
        <AdminHeader admin={admin} />

        {/* Main Content Pane */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}


