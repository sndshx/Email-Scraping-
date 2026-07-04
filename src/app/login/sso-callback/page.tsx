'use client'

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'

export default function SSOCallback() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // After OAuth callback, check if admin and redirect accordingly
      fetch('/api/admin/auto-login', { method: 'POST' })
        .then(r => r.json())
        .then(data => {
          if (data.isAdmin) {
            router.push('/admin')
          } else {
            router.push('/dashboard')
          }
        })
        .catch(() => router.push('/dashboard'))
    }
  }, [isLoaded, isSignedIn])

  return <AuthenticateWithRedirectCallback />
}