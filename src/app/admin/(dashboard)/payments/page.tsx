import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export default async function AdminPayments() {
  await requireAdmin()

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  })

  const total = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      OR: [
        { status: 'succeeded' },
        { status: 'paid' }
      ]
    }
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payments History</h1>
          <p className="text-slate-500 text-sm mt-1">Stripe billing history and records</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 text-lg font-bold">
            $
          </div>
          <div>
            <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Total Revenue</div>
            <div className="font-extrabold text-xl text-slate-900">${(total._sum.amount ?? 0).toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Stripe ID</th>
                <th className="px-6 py-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="text-slate-900 font-bold">
                      {payment.user?.name ?? payment.customerEmail}
                    </div>
                    <div className="text-slate-400 text-xs">{payment.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 font-mono">
                    <span className="text-emerald-600 font-extrabold text-base">${payment.amount.toFixed(2)}</span>
                    <span className="text-slate-400 text-[10px] ml-1 uppercase font-bold">{payment.currency}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      payment.status === 'succeeded' || payment.status === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : payment.status === 'failed'
                        ? 'bg-rose-50 text-rose-700 border-rose-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-mono font-semibold">
                    {payment.stripePaymentId.length > 22
                      ? `${payment.stripePaymentId.slice(0, 22)}…`
                      : payment.stripePaymentId}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-semibold">
                    {new Date(payment.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No transactions recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
