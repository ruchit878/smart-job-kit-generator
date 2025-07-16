'use client'

import { Button } from '@/components/ui/button'

export default function LinkedInLoginButton() {
  const CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID as string
  const REDIRECT_URI = encodeURIComponent(
    process.env.NEXT_PUBLIC_REDIRECT_URI as string
  )

  const SCOPE = ['openid', 'profile', 'email'].join('%20')

  const loginUrl =
    `https://www.linkedin.com/oauth/v2/authorization` +
    `?response_type=code` +
    `&client_id=${CLIENT_ID}` +
    `&redirect_uri=${REDIRECT_URI}` +
    `&scope=${SCOPE}`

  return (
    <a href={loginUrl}>
      <Button className="w-full rounded-full">Login with LinkedIn</Button>
    </a>
  )
}
