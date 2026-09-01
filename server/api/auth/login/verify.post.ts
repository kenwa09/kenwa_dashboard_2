import { attachTokenCookie } from '~/server/utils/auth'
import {
  readStore, writeStore, blankRecord, isConfigured, cacheKenwaToken, getLockedEmail,
  issueDeviceCookie, registerTrustedDevice, readDeviceToken
} from '~/server/utils/adminAuth'

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

    // Ververs de versleuteld gecachete kenwa.nl-token zodat pincode/wachtwoord
    // de komende ~7 dagen direct kunnen inloggen. Raakt kenwa.nl niet aan.
    const record = (await readStore()) || blankRecord()
    record.email = getLockedEmail()
    cacheKenwaToken(record, response.token)

    // Vertrouw dit apparaat: een volledige e-mail+2FA-login is de enige manier
    // waarop een apparaat pincode/wachtwoord-login mag gebruiken.
    const existingDevice = readDeviceToken(event)
    const rawDevice = existingDevice || issueDeviceCookie(event)
    registerTrustedDevice(record, rawDevice, 'email-login')

    await writeStore(record)

    return { ...response, dashboardConfigured: isConfigured(record) }
  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({
      statusCode: err?.response?.status || err?.statusCode || 500,
      statusMessage: err?.data?.statusMessage || err?.message || 'Verificatie mislukt'
    })
  }
})
