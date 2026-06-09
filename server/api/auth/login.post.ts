export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { kenwaApiUrl } = useRuntimeConfig()

  try {
    const response = await $fetch<any>(`${kenwaApiUrl}/api/auth/login`, {
      method: 'POST',
      body,
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
