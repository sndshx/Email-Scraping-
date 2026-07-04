import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import UsersTable from '@/components/admin/users-table'

export default async function AdminUsers({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; plan?: string; role?: string; page?: string }>
}) {
  await requireAdmin()

  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page ?? '1')
  const take = 20
  const skip = (page - 1) * take

  const where: any = {}
  if (resolvedSearchParams.search) {
    where.OR = [
      { name: { contains: resolvedSearchParams.search, mode: 'insensitive' } },
      { email: { contains: resolvedSearchParams.search, mode: 'insensitive' } },
    ]
  }
  if (resolvedSearchParams.plan) where.plan = resolvedSearchParams.plan
  if (resolvedSearchParams.role) where.role = resolvedSearchParams.role

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      include: {
        _count: { select: { scrapeJobs: true, payments: true } },
        subscription: { select: { status: true, currentPeriodEnd: true } },
      },
    }),
    prisma.user.count({ where }),
  ])

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Users ({total})</h1>
      <UsersTable users={users} total={total} page={page} />
    </div>
  )
}
