import type { H3Event } from 'h3'
import { getCookie, setCookie, getRequestHeader } from 'h3'

const TOKEN_COOKIE = 'kenwa_token'

export function getTokenFromRequest (event: H3Event): string | null {
  const cookie = getCookie(event, TOKEN_COOKIE)
  if (cookie) return cookie
  const auth = getRequestHeader(event, 'authorization')
  if (!auth) return null
  const [type, token] = auth.split(' ')
  return type === 'Bearer' ? token : null
}

export function attachTokenCookie (event: H3Event, token: string) {
  setCookie(event, TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })
}

export function clearTokenCookie (event: H3Event) {
  setCookie(event, TOKEN_COOKIE, '', { maxAge: 0, path: '/' })
}

/**
 * Controleert bij kenwa.nl of een token nog geldig is én bij een admin hoort.
 * Retourneert het user-object of null. Wijzigt niets aan kenwa.nl.
 */
export async function verifyKenwaAdminToken (token: string): Promise<{ role: string; [key: string]: any } | null> {
  const { kenwaApiUrl } = useRuntimeConfig()
  try {
    const res = await $fetch<{ user: { role: string; [key: string]: any } }>(
      `${kenwaApiUrl}/api/auth/profile`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (res.user?.role !== 'admin') return null
    return res.user
  } catch {
    return null
  }
}
