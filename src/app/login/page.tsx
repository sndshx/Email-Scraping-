'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSignIn, useAuth } from '@clerk/nextjs'
import type { OAuthStrategy } from '@clerk/types'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { signIn, isLoaded } = useSignIn()
  const { isSignedIn, isLoaded: authLoaded } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (authLoaded && isSignedIn) {
      router.push('/dashboard')
    }
  }, [authLoaded, isSignedIn, router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded || !signIn) return
    setLoading(true)
    setError('')

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })

      if ('status' in result && result.status === 'complete') {
        await signIn.reload()
        router.push('/dashboard')
      } else {
        setError('Login incomplete, please try again')
      }
    } catch (err: any) {
      const clerkError = err.errors?.[0]

      if (clerkError?.code === 'session_exists') {
        router.push('/dashboard')
        return
      }

      if (clerkError?.code === 'form_password_incorrect' || clerkError?.code === 'strategy_for_user_invalid') {
        setError('This email is linked to a Google/Apple account. Please use "Continue with Google" or "Continue with Apple" to sign in.')
      } else {
        setError(clerkError?.message || err.message || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    if (!isLoaded || !signIn) return
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google' as OAuthStrategy,
        redirectUrl: '/login/sso-callback',
        redirectUrlComplete: '/dashboard',
      })
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Google login failed')
    }
  }

  async function handleApple() {
    if (!isLoaded || !signIn) return
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_apple' as OAuthStrategy,
        redirectUrl: '/login/sso-callback',
        redirectUrlComplete: '/dashboard',
      })
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Apple login failed')
    }
  }

  if (!authLoaded || isSignedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg">

          <div className="text-center mb-8">
            <h1 className="text-slate-900 text-2xl font-black mb-1">Welcome Back</h1>
            <p className="text-slate-400 text-sm">login to access your dashboard</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
                style={{ '--tw-ring-color': '#3b82f6' } as React.CSSProperties}
                className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:border-[#3b82f6] transition"
              />
            </div>

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
                  placeholder="Password"
                  required
                  style={{ '--tw-ring-color': '#3b82f6' } as React.CSSProperties}
                  className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl pl-11 pr-11 py-3.5 text-sm focus:outline-none focus:ring-2 focus:border-[#3b82f6] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="text-right mt-2">
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold hover:underline"
                  style={{ color: '#3b82f6' }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isLoaded}
              style={{ backgroundColor: loading || !isLoaded ? '#93c5fd' : '#3b82f6' }}
              className="w-full hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Logging in...' : 'Get Started'}
            </button>
          </form>

          <div id="clerk-captcha" />

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-slate-400 text-xs font-semibold">Or sign in with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Google Button */}
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

            {/* Apple Button */}
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
            Don't have an account?{' '}
            <Link href="/signup" className="font-bold hover:underline" style={{ color: '#3b82f6' }}>
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          <Link href="/" className="hover:text-[#3b82f6] transition font-semibold">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}