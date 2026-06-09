import { getTokenFromRequest } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const token = getTokenFromRequest(event)
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Niet geautoriseerd' })
  }

  const { kenwaApiUrl } = useRuntimeConfig()

  try {
    const response = await $fetch<{ user: { role: string; [key: string]: any } }>(
      `${kenwaApiUrl}/api/auth/profile`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (response.user?.role !== 'admin') {
      throw createError({ statusCode: 403, statusMessage: 'Geen admin toegang' })
    }

    return response
  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({ statusCode: 401, statusMessage: 'Sessie verlopen' })
  }
})
