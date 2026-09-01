import { attachTokenCookie } from '~/server/utils/auth'
import {
  readStore, writeStore, blankRecord, isConfigured, cacheKenwaToken, getLockedEmail,
  issueDeviceCookie, registerTrustedDevice, readDeviceToken, storageLocation
} from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { kenwaApiUrl } = useRuntimeConfig()

  // ── 1. De echte login: kenwa.nl verifieert de 6-cijferige code ──
  let response: { user: { role: string; [key: string]: any }; token: string }
  try {
    response = await $fetch(`${kenwaApiUrl}/api/auth/login/verify`, { method: 'POST', body })
  } catch (err: any) {
    throw createError({
      statusCode: err?.response?.status || err?.statusCode || 500,
      statusMessage: err?.data?.statusMessage || err?.message || 'Verificatie mislukt'
    })
  }

  if (response.user?.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Toegang geweigerd. Alleen admins kunnen inloggen op dit dashboard.'
    })
  }

  attachTokenCookie(event, response.token)

  // ── 2. Best-effort: lokale opslag verversen. Mag de login NOOIT breken. ──
  // (Bij een niet-beschrijfbare/niet-persistente opslag lukt de login gewoon;
  //  je moet dan alleen elke keer opnieuw via e-mail inloggen.)
  let dashboardConfigured = false
  try {
    const record = (await readStore().catch((e) => {
      console.warn('[auth] admin-auth kon niet worden gelezen, gebruik lege record:', e?.code || e?.message)
      return null
    })) || blankRecord()

    record.email = getLockedEmail()

    try {
      cacheKenwaToken(record, response.token)
    } catch (e: any) {
      console.warn('[auth] kenwa.nl-token niet gecachet (DASHBOARD_SECRET?):', e?.statusMessage || e?.message)
    }

    const existingDevice = readDeviceToken(event)
    const rawDevice = existingDevice || issueDeviceCookie(event)
    registerTrustedDevice(record, rawDevice, 'email-login')

    await writeStore(record)
    dashboardConfigured = isConfigured(record)
  } catch (e: any) {
    console.warn(
      `[auth] admin-auth niet opgeslagen (${storageLocation()}): ${e?.code || e?.message}. ` +
      'Setup-scherm wordt getoond; stel DASHBOARD_STORAGE_DIR in op een persistent volume.'
    )
    dashboardConfigured = false
  }

  return { ...response, dashboardConfigured }
})
