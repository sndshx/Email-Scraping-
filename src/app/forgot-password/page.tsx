'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const { signIn, isLoaded, setActive } = useSignIn()
  const router = useRouter()

  const [stage, setStage] = useState<'request' | 'reset'>('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded || !signIn) return
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      setStage('reset')
      setMessage('Check your email for a reset code.')
    } catch (err: any) {
      const clerkError = err.errors?.[0]

      // This fires if the email belongs to an OAuth-only account (no password to reset)
      if (
        clerkError?.code === 'form_identifier_not_found' ||
        clerkError?.code === 'strategy_for_user_invalid'
      ) {
        setError(
          'No password is set for this email. If you signed up with Google or Apple, please use that button to sign in instead.'
        )
      } else {
        setError(clerkError?.message || err.message || 'Could not send reset code')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded || !signIn) return
    setLoading(true)
    setError('')

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/dashboard')
      } else {
        setError('Reset incomplete, please try again')
      }
    } catch (err: any) {
      const clerkError = err.errors?.[0]
      setError(clerkError?.longMessage || clerkError?.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-slate-900 text-2xl font-black mb-1">
              {stage === 'request' ? 'Reset Password' : 'Enter New Password'}
            </h1>
            <p className="text-slate-400 text-sm">
              {stage === 'request'
                ? "We'll email you a code to reset your password"
                : 'Enter the code from your email and a new password'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          {message && !error && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-xl mb-5">
              {message}
            </div>
          )}

          {stage === 'request' ? (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !isLoaded}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition text-sm cursor-pointer"
              >
                {loading ? 'Sending code...' : 'Send Reset Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code"
                  required
                  className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition tracking-widest"
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  required
                  minLength={8}
                  className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !isLoaded}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl transition text-sm cursor-pointer"
              >
                {loading ? 'Resetting...' : 'Reset Password & Sign In'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStage('request')
                  setError('')
                  setMessage('')
                }}
                className="w-full text-slate-400 text-xs font-semibold hover:text-blue-600 transition cursor-pointer"
              >
                Didn't get a code? Try again
              </button>
            </form>
          )}

          <p className="text-center text-slate-400 text-sm mt-6">
            Remembered your password?{' '}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          <Link href="/" className="hover:text-blue-600 transition font-semibold">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}