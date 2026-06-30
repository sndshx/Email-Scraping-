'use client'

import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function VerifyEmailPage() {
  const { signUp, isLoaded, setActive } = useSignUp()
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (!isLoaded || !signUp) return
    setLoading(true)
    setError('')

    try {
      const result = await signUp.attemptEmailAddressVerification({ code })

      if (result.status === 'complete') {
        // This is the missing piece — activate the session Clerk just created
        await setActive({ session: result.createdSessionId })
        router.push('/dashboard')
      } else {
        setError('Verification incomplete, please try again')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg text-center">
          <h1 className="text-slate-900 text-2xl font-black mb-2">Check your email</h1>
          <p className="text-slate-400 text-sm mb-8">We sent a verification code to your email</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              required
              className="w-full bg-slate-100 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-3.5 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            />
            <button
              type="submit"
              disabled={loading || !isLoaded}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3.5 rounded-xl transition text-sm cursor-pointer"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}