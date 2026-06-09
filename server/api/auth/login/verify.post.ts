import { attachTokenCookie } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { kenwaApiUrl } = useRuntimeConfig()

  try {
    const response = await $fetch<{ user: { role: string; [key: string]: any }; token: string }>(
      `${kenwaApiUrl}/api/auth/login/verify`,
      { method: 'POST', body }
    )

    if (response.user?.role !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Toegang geweigerd. Alleen admins kunnen inloggen op dit dashboard.'
      })
    }

    attachTokenCookie(event, response.token)
    return response
  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({
      statusCode: err?.response?.status || err?.statusCode || 500,
      statusMessage: err?.data?.statusMessage || err?.message || 'Verificatie mislukt'
    })
  }
})
