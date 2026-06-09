import { clearTokenCookie, getTokenFromRequest } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const { kenwaApiUrl } = useRuntimeConfig()
  const token = getTokenFromRequest(event)

  if (token) {
    await $fetch(`${kenwaApiUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {})
  }

  clearTokenCookie(event)
  return { ok: true }
})
