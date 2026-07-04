'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, UserMinus, UserCheck, Trash2, ArrowLeft, ArrowRight } from 'lucide-react'

export default function UsersTable({ users, total, page }: any) {
  const router = useRouter()
  const [loading, setLoading] = useState<number | null>(null)

  async function updateUser(userId: number, data: any) {
    setLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        alert('Failed to update user')
      }
    } catch (err) {
      console.error(err)
      alert('Error updating user')
    }
    setLoading(null)
    router.refresh()
  }

  async function deleteUser(userId: number) {
    if (!confirm('Delete this user? This cannot be undone.')) return
    setLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      if (!res.ok) {
        alert('Failed to delete user')
      }
    } catch (err) {
      console.error(err)
      alert('Error deleting user')
    }
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Search + Filters */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between bg-slate-50/50">
        <div className="relative flex-1 min-w-[240px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </span>
          <input
            placeholder="Search name or email..."
            className="bg-white text-slate-800 placeholder-slate-400 px-4 py-2 pl-9 rounded-xl text-sm w-full border border-slate-200 focus:outline-none focus:border-blue-500 transition"
            onChange={(e) => {
              const url = new URL(window.location.href)
              url.searchParams.set('search', e.target.value)
              url.searchParams.set('page', '1')
              router.push(url.toString())
            }}
          />
        </div>
        <div className="flex gap-3">
          <select
            className="bg-white text-slate-700 px-3 py-2 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
            onChange={(e) => {
              const url = new URL(window.location.href)
              if (e.target.value) {
                url.searchParams.set('plan', e.target.value)
              } else {
                url.searchParams.delete('plan')
              }
              url.searchParams.set('page', '1')
              router.push(url.toString())
            }}
          >
            <option value="">All Plans</option>
            <option value="free">Free</option>
            <option value="starter">Starter</option>
            <option value="plus">Plus</option>
          </select>

          <select
            className="bg-white text-slate-700 px-3 py-2 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer font-medium"
            onChange={(e) => {
              const url = new URL(window.location.href)
              if (e.target.value) {
                url.searchParams.set('role', e.target.value)
              } else {
                url.searchParams.delete('role')
              }
              url.searchParams.set('page', '1')
              router.push(url.toString())
            }}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-3.5 text-left">User</th>
              <th className="px-6 py-3.5 text-left">Plan</th>
              <th className="px-6 py-3.5 text-left">Role</th>
              <th className="px-6 py-3.5 text-left">Scrapes</th>
              <th className="px-6 py-3.5 text-left">Jobs</th>
              <th className="px-6 py-3.5 text-left">Status</th>
              <th className="px-6 py-3.5 text-left">Joined</th>
              <th className="px-6 py-3.5 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user: any) => (
              <tr key={user.id} className={`hover:bg-slate-50/50 transition-colors ${user.isBanned ? 'bg-rose-50/30 opacity-80' : ''}`}>
                <td className="px-6 py-4">
                  <div className="text-slate-900 font-bold">{user.name || 'Unnamed'}</div>
                  <div className="text-slate-400 text-xs">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.plan}
                    disabled={loading === user.id}
                    className="bg-white text-slate-700 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer font-semibold"
                    onChange={(e) => updateUser(user.id, { plan: e.target.value })}
                  >
                    <option value="free">Free</option>
                    <option value="starter">Starter</option>
                    <option value="plus">Plus</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={user.role}
                    disabled={loading === user.id}
                    className="bg-white text-slate-700 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer font-semibold"
                    onChange={(e) => updateUser(user.id, { role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-slate-700 font-mono font-semibold">
                  {user.scrapeCount}/{user.scrapeLimit}
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">
                  {user._count?.scrapeJobs ?? 0}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                    user.isBanned 
                      ? 'bg-rose-50 text-rose-700 border-rose-100' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  }`}>
                    {user.isBanned ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400 text-xs font-semibold">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      disabled={loading === user.id}
                      onClick={() => updateUser(user.id, { isBanned: !user.isBanned })}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                        user.isBanned
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100'
                      }`}
                    >
                      {user.isBanned ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          Unban
                        </>
                      ) : (
                        <>
                          <UserMinus className="w-3.5 h-3.5" />
                          Ban
                        </>
                      )}
                    </button>
                    <button
                      disabled={loading === user.id}
                      onClick={() => deleteUser(user.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-slate-400 font-medium">
                  No users matched the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-100 flex justify-between items-center text-slate-500 text-sm font-semibold bg-slate-50/30">
        <span>Showing {total === 0 ? 0 : (page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}</span>
        <div className="flex gap-2">
          {page > 1 && (
            <button
              onClick={() => {
                const url = new URL(window.location.href)
                url.searchParams.set('page', String(page - 1))
                router.push(url.toString())
              }}
              className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition flex items-center gap-1 cursor-pointer font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Prev
            </button>
          )}
          {page * 20 < total && (
            <button
              onClick={() => {
                const url = new URL(window.location.href)
                url.searchParams.set('page', String(page + 1))
                router.push(url.toString())
              }}
              className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition flex items-center gap-1 cursor-pointer font-bold"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
