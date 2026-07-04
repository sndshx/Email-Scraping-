import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export default async function AdminScrapeJobs() {
  await requireAdmin()

  const jobs = await prisma.scrapeJob.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { companies: true } },
    },
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Scrape Jobs Monitoring</h1>
      
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Query</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Companies</th>
                <th className="px-6 py-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="text-slate-900 font-bold">{job.user?.name ?? 'Anonymous / Unknown'}</div>
                    <div className="text-slate-400 text-xs">{job.user?.email ?? 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-mono text-xs">{job.query}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      job.status.toLowerCase() === 'success' || job.status.toLowerCase() === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : job.status.toLowerCase() === 'running' 
                        ? 'bg-blue-50 text-blue-700 border-blue-100 animate-pulse' 
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {job.status.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-mono font-semibold">{job._count.companies}</td>
                  <td className="px-6 py-4 text-slate-400 text-xs font-semibold">
                    {new Date(job.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No scrape jobs recorded yet
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
