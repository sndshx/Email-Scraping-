'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSignUp } from '@clerk/nextjs'
import type { OAuthStrategy } from '@clerk/types'
import { useRouter } from 'next/navigation'

// ── Password rules ──────────────────────────────────────────────────────────
const rules = [
  { id: 'length',    label: 'At least 8 characters',          test: (p: string) => p.length >= 8 },
  { id: 'upper',     label: 'At least 1 uppercase letter',    test: (p: string) => /[A-Z]/.test(p) },
  { id: 'number',    label: 'At least 1 number',              test: (p: string) => /[0-9]/.test(p) },
  { id: 'special',   label: 'At least 1 special character (@#$%^&*!)',  test: (p: string) => /[@#$%^&*!]/.test(p) },
]

function validatePassword(password: string): string | null {
  for (const rule of rules) {
    if (!rule.test(password)) return rule.label
  }
  return null
}

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null
  const passed = rules.filter(r => r.test(password)).length
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e']
  const labels = ['Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {rules.map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ background: i < passed ? colors[passed - 1] : '#e2e8f0' }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {rules.map(rule => (
            <div key={rule.id} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full flex items-center justify-center transition-colors ${rule.test(password) ? 'bg-green-500' : 'bg-slate-200'}`}>
                {rule.test(password) && (
                  <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-xs transition-colors ${rule.test(password) ? 'text-green-600' : 'text-slate-400'}`}>
                {rule.label}
              </span>
            </div>
          ))}
        </div>
        <span className="text-xs font-bold" style={{ color: passed > 0 ? colors[passed - 1] : '#94a3b8' }}>
          {passed > 0 ? labels[passed - 1] : ''}
        </span>
      </div>
    </div>
  )
}

export default function SignupPage() {
  const { signUp, isLoaded } = useSignUp()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordFocused, setPasswordFocused] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded || !signUp) {
      setError('Still loading, please wait...')
      return
    }

    // Client-side password validation before hitting Clerk
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(`Password must include: ${passwordError}`)
      return
    }

    setLoading(true)
    setError('')

    try {
      await signUp.create({
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1] || '',
        emailAddress: email,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      router.push('/verify-email')

    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    if (!isLoaded || !signUp) return
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google' as OAuthStrategy,
        redirectUrl: '/login/sso-callback',
        redirectUrlComplete: '/dashboard',
      })
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Google signup failed')
    }
  }

  async function handleApple() {
    if (!isLoaded || !signUp) return
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_apple' as OAuthStrategy,
        redirectUrl: '/login/sso-callback',
        redirectUrlComplete: '/dashboard',
      })
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Apple signup failed')
    }
  }

  const allRulesPassed = rules.every(r => r.test(password))

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg">

          <div className="text-center mb-8">
            <h1 className="text-slate-900 text-2xl font-black mb-1">Create Account</h1>
            <p className="text-slate-400 text-sm">Sign up to get started</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>

            {/* Email */}
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
                className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  placeholder="Password"
                  required
                  className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl pl-11 pr-11 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                />
                {/* Show/hide password toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password strength indicator — shows when user starts typing */}
              {passwordFocused && <PasswordStrengthBar password={password} />}
            </div>

            <button
              type="submit"
              disabled={loading || !isLoaded || !allRulesPassed}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3.5 rounded-xl transition text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {!isLoaded ? 'Loading...' : loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <div id="clerk-captcha" />

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-xs font-semibold">Or sign up with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGoogle}
              disabled={!isLoaded}
              className="group relative flex items-center justify-center gap-2.5 px-5 py-3.5 bg-white border-2 border-slate-200 hover:border-blue-300 rounded-xl transition-all cursor-pointer disabled:opacity-50 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/50 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
              <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-bold text-slate-700 relative z-10">Google</span>
            </button>

            <button
              onClick={handleApple}
              disabled={!isLoaded}
              className="group relative flex items-center justify-center gap-2.5 px-5 py-3.5 bg-black hover:bg-slate-800 border-2 border-black rounded-xl transition-all cursor-pointer disabled:opacity-50 hover:shadow-lg hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-3.06 1.57-.12 0-.23-.02-.336-.05-.012-.105-.02-.22-.02-.347 0-1.14.55-2.34 1.27-3.16.9-1.04 2.39-1.5 3.27-1.5.075.13.052.27.052.41zm.5 4.55c-1.69 0-3.15.96-3.97.96-.86 0-2.16-.91-3.55-.89-1.83.03-3.5 1.06-4.43 2.71-1.9 3.3-.49 8.23 1.4 10.92.92 1.34 2.02 2.84 3.45 2.79 1.38-.05 1.92-.9 3.62-.9 1.69 0 2.18.9 3.62.88 1.49-.02 2.49-1.36 3.41-2.7 1.07-1.55 1.51-3.07 1.53-3.15-.03-.02-2.93-1.13-2.95-4.47-.02-2.8 2.29-4.14 2.4-4.21-1.31-1.93-3.34-2.13-4.05-2.18-.21-.02-.4-.04-.66-.04-.5 0-1.18.16-1.83.16z"/>
              </svg>
              <span className="text-sm font-bold text-white">Apple</span>
            </button>
          </div>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
          </p>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          <Link href="/" className="hover:text-blue-600 transition font-semibold">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}