import { getLockedEmail } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { kenwaApiUrl } = useRuntimeConfig()

  const email = String(body?.email || '').trim().toLowerCase()
  if (email !== getLockedEmail()) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Dit dashboard accepteert alleen het vaste beheerdersadres.'
    })
  }

  try {
    const response = await $fetch<any>(`${kenwaApiUrl}/api/auth/login`, {
      method: 'POST',
      body: { ...body, email },
      headers: { 'Content-Type': 'application/json' }
    })
    return response
  } catch (err: any) {
    throw createError({
      statusCode: err?.response?.status || err?.statusCode || 500,
      statusMessage: err?.data?.statusMessage || err?.message || 'Inloggen mislukt'
    })
  }
})
