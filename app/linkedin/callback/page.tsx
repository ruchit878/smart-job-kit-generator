'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function LinkedInCallback() {
  const qs = useSearchParams()
  const code = qs.get('code')
  const router = useRouter()
  const { setUser } = useAuth()

  useEffect(() => {
    if (!code) return

    fetch('/api/linkedin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setUser(data.user)        // 🟢 save user in context + localStorage
          router.push('/dashboard') //    then off to dashboard
        } else {
          router.push('/?error=login')
        }
      })
      .catch(() => router.push('/?error=login'))
  }, [code])

  return <p className="p-8 text-center">Finishing sign-in…</p>
}
