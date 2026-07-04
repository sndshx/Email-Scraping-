import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import WhatsAppLogsClient from './whatsapp-logs-client'

export default async function AdminWhatsApp() {
  await requireAdmin()

  // Fetch the data in parallel for optimal performance
  const [users, messages, webUsers] = await Promise.all([
    prisma.whatsAppUser.findMany({
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.whatsAppMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 1000, // Fetch up to 1000 messages for grouping
    }),
    prisma.user.findMany({
      where: {
        whatsappNumber: { not: null },
      },
      select: {
        id: true,
        name: true,
        email: true,
        whatsappNumber: true,
        plan: true,
      },
    }),
  ])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          WhatsApp Logs <span className="text-slate-400 text-lg font-semibold ml-1">({messages.length})</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Monitor and view conversational logs between the WhatsApp bot AI and customers.
        </p>
      </div>

      <WhatsAppLogsClient 
        initialUsers={users} 
        initialMessages={messages} 
        webUsers={webUsers} 
      />
    </div>
  )
}

