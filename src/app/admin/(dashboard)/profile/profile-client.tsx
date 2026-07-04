'use client'

import React, { useState } from 'react'
import { 
  User, 
  Lock, 
  Mail, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  Phone,
  BarChart,
  Calendar,
  Layers,
  Database,
  ArrowRight,
  Sliders,
  Users,
  CreditCard,
  MessageSquare,
  DollarSign,
  ArrowUpRight,
  Key
} from 'lucide-react'

interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  plan: string
  whatsappNumber: string | null
  scrapeCount: number
  scrapeLimit: number
  createdAt: string
  jobsCount: number
  paymentsCount: number
}

interface ScrapeJob {
  id: number
  query: string
  status: string
  totalFound: number
  createdAt: string
}

interface PlatformStats {
  totalUsers: number
  totalScrapes: number
  totalPayments: number
  totalWhatsApp: number
  totalRevenue: number
}

interface ProfileClientProps {
  admin: AdminUser
  recentJobs: ScrapeJob[]
  platformStats: PlatformStats
}

export default function ProfileClient({ admin, recentJobs, platformStats }: ProfileClientProps) {
  // Profile Details State
  const [name, setName] = useState(admin.name)
  const [email, setEmail] = useState(admin.email)
  const [whatsappNumber, setWhatsappNumber] = useState(admin.whatsappNumber || '')
  const [scrapeLimit, setScrapeLimit] = useState(admin.scrapeLimit)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)

  // Password State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [securityLoading, setSecurityLoading] = useState(false)
  const [securityError, setSecurityError] = useState<string | null>(null)
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null)

  // Progress percentage
  const scrapePercent = Math.min(100, Math.round((admin.scrapeCount / (scrapeLimit || 1)) * 100))

  // Handle Profile Update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError(null)
    setProfileSuccess(null)

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, whatsappNumber, scrapeLimit }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile')
      }

      setProfileSuccess('Profile details updated successfully.')
      
      // Reload page to refresh header/sidebar values
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err: any) {
      setProfileError(err.message)
    } finally {
      setProfileLoading(false)
    }
  }

  // Handle Password Update
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSecurityLoading(true)
    setSecurityError(null)
    setSecuritySuccess(null)

    if (newPassword !== confirmPassword) {
      setSecurityError('New passwords do not match')
      setSecurityLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setSecurityError('New password must be at least 6 characters long')
      setSecurityLoading(false)
      return
    }

    try {
      const res = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          whatsappNumber,
          scrapeLimit,
          currentPassword,
          newPassword,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password')
      }

      setSecuritySuccess('Password updated successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setSecurityError(err.message)
    } finally {
      setSecurityLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: Platform Overview Cards (Admin Dashboard summary) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Users */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-200 transition-colors duration-200">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total platform users</div>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{platformStats.totalUsers}</div>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Registrations managed</p>
        </div>

        {/* Card 2: Scrapes */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-emerald-200 transition-colors duration-200">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Scrapes Run</div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{platformStats.totalScrapes}</div>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Extractions executed</p>
        </div>

        {/* Card 3: Payments */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-purple-200 transition-colors duration-200">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Platform Revenue</div>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">${platformStats.totalRevenue.toLocaleString()}</div>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">{platformStats.totalPayments} sales completed</p>
        </div>

        {/* Card 4: WhatsApp Messages */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-pink-200 transition-colors duration-200">
          <div className="flex justify-between items-center">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">WhatsApp Logs</div>
            <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
              <MessageSquare className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{platformStats.totalWhatsApp}</div>
          <p className="text-[10px] text-slate-400 font-semibold mt-1">Bot conversations logged</p>
        </div>

      </div>

      {/* SECTION 2: Profile settings split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Overview Card & Platform Usage */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-3xl border-2 border-blue-200 shadow-sm mb-4">
              {admin.name?.charAt(0)?.toUpperCase() ?? 'A'}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{admin.name}</h2>
            <p className="text-sm text-slate-500 font-medium">{admin.email}</p>
            
            <div className="mt-6 pt-6 border-t border-slate-100 w-full space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider justify-center">
                <Shield className="w-4 h-4 text-blue-600" /> Administrative Role
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                {admin.role}
              </span>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <BarChart className="w-4 h-4 text-indigo-500" /> Personal Usage
            </h3>

            <div className="space-y-4">
              {/* Scrape Progress bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Scrapes Used</span>
                  <span>{admin.scrapeCount} / {scrapeLimit} ({scrapePercent}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      scrapePercent > 90 ? 'bg-rose-500' : scrapePercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${scrapePercent}%` }}
                  />
                </div>
              </div>

              {/* General metrics */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Admin Scrapes</div>
                  <div className="text-lg font-extrabold text-slate-800">{admin.jobsCount}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Admin Sales</div>
                  <div className="text-lg font-extrabold text-slate-800">{admin.paymentsCount}</div>
                </div>
              </div>

              {/* Meta details */}
              <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs font-medium text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Registered:</span>
                  <span className="text-slate-800 font-semibold">{new Date(admin.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> System Plan:</span>
                  <span className="text-slate-800 font-bold uppercase text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">{admin.plan}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Action Navigation links */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Navigation</h3>
            <div className="grid grid-cols-1 gap-2 text-sm font-semibold">
              <a href="/admin/users" className="flex justify-between items-center p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-colors">
                <span>Manage Platform Users</span> <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </a>
              <a href="/admin/scrape-jobs" className="flex justify-between items-center p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-colors">
                <span>All Scrape Jobs</span> <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </a>
              <a href="/admin/payments" className="flex justify-between items-center p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-colors">
                <span>Financial Transactions</span> <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </a>
              <a href="/admin/whatsapp" className="flex justify-between items-center p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-indigo-600 transition-colors">
                <span>WhatsApp Log Streams</span> <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Edit forms & Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Form 1: General Info (Detailed) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <User className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Profile Details</h3>
                <p className="text-xs text-slate-500 font-medium">Update name, email, WhatsApp, and set limits.</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              {profileError && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm font-medium flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  {profileError}
                </div>
              )}
              {profileSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm font-medium flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  {profileSuccess}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profile-name" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        id="profile-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9 pr-4 py-2.5 w-full text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition duration-150 font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="profile-email" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        id="profile-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 pr-4 py-2.5 w-full text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition duration-150 font-medium text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="profile-whatsapp" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      WhatsApp Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        id="profile-whatsapp"
                        type="text"
                        placeholder="e.g. +9779706570754"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="pl-9 pr-4 py-2.5 w-full text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition duration-150 font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="profile-scrapelimit" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Personal Scrape Limit
                    </label>
                    <div className="relative">
                      <Sliders className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        id="profile-scrapelimit"
                        type="number"
                        min={1}
                        required
                        value={scrapeLimit}
                        onChange={(e) => setScrapeLimit(parseInt(e.target.value) || 0)}
                        className="pl-9 pr-4 py-2.5 w-full text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition duration-150 font-medium text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Enter your number to link this admin dashboard account with WhatsApp Bot messaging. As an administrator, you can configure your own monthly scrape limit directly using the limit settings field.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition duration-150 disabled:opacity-55 disabled:cursor-not-allowed"
                >
                  {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Recent Admin Activity Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Database className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Recent Scrape Activities</h3>
                <p className="text-xs text-slate-500 font-medium">Verify your latest query extractions.</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {recentJobs.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-sm font-medium">
                  No scrape jobs initiated by this admin account yet.
                </div>
              ) : (
                recentJobs.map((job) => (
                  <div key={job.id} className="py-4 flex justify-between items-center text-sm font-medium gap-3">
                    <div className="min-w-0">
                      <div className="text-slate-800 font-bold truncate leading-relaxed">
                        {job.query}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-0.5">
                        <span>Job #{job.id}</span>
                        <span>•</span>
                        <span>{new Date(job.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="text-slate-500 text-xs font-semibold">
                        {job.totalFound} results
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                        job.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : job.status === 'FAILED'
                          ? 'bg-rose-50 text-rose-700 border-rose-100'
                          : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {job.status.toLowerCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {recentJobs.length > 0 && (
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <a
                  href="/admin/scrape-jobs"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                >
                  View all scrape jobs <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Form 3: Password Update */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Key className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Change Password</h3>
                <p className="text-xs text-slate-500 font-medium">Update your account password for enhanced security.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {securityError && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm font-medium flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  {securityError}
                </div>
              )}
              {securitySuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm font-medium flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  {securitySuccess}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="current-pass" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      id="current-pass"
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pl-9 pr-4 py-2.5 w-full text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition duration-150 font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="new-pass" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        id="new-pass"
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-9 pr-4 py-2.5 w-full text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition duration-150 font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirm-pass" className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        id="confirm-pass"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-9 pr-4 py-2.5 w-full text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition duration-150 font-medium text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={securityLoading}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition duration-150 disabled:opacity-55 disabled:cursor-not-allowed"
                >
                  {securityLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
      
    </div>
  )
}
