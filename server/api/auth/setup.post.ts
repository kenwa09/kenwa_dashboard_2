import { getTokenFromRequest, verifyKenwaAdminToken } from '~/server/utils/auth'
import {
  readStore, writeStore, blankRecord, hashSecret, getLockedEmail,
  issueDeviceCookie, registerTrustedDevice, readDeviceToken, cacheKenwaToken,
  resetPinFailures, resetPasswordFailures, storageLocation
} from '~/server/utils/adminAuth'

/**
 * Stelt (of vervangt) het dashboard-eigen wachtwoord + de 5-cijferige pincode in.
 * Vereist een geldige, zojuist verkregen kenwa.nl-sessie (volledige e-mail+2FA-login).
 * Raakt kenwa.nl niet aan: de kenwa.nl-token wordt alleen versleuteld gecachet.
 */
export default defineEventHandler(async (event) => {
  rateLimit(event, { name: 'dashboard-setup', max: 10, windowMs: 15 * 60 * 1000 })

  const body = await readBody<{ password?: string; pin?: string }>(event)
  const password = (body?.password || '').trim()
  const pin = (body?.pin || '').trim()

  if (password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Kies een dashboardwachtwoord van minimaal 8 tekens.' })
  }
  if (!/^\d{5}$/.test(pin)) {
    throw createError({ statusCode: 400, statusMessage: 'De pincode moet exact 5 cijfers zijn.' })
  }

  const token = getTokenFromRequest(event)
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Log eerst volledig in via e-mail voordat je een wachtwoord en pincode instelt.'
    })
  }

  const user = await verifyKenwaAdminToken(token)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Je kenwa.nl-sessie is verlopen of is geen admin. Log opnieuw in via e-mail.'
    })
  }

  const record = (await readStore()) || blankRecord()
  record.email = getLockedEmail()

  const pw = hashSecret(password)
  record.passwordHash = pw.hash
  record.passwordSalt = pw.salt

  const pn = hashSecret(pin)
  record.pinHash = pn.hash
  record.pinSalt = pn.salt

  record.setupCompletedAt = new Date().toISOString()
  resetPinFailures(record)
  resetPasswordFailures(record)

  try {
    cacheKenwaToken(record, token)
  } catch (e: any) {
    console.warn('[auth] setup: kenwa.nl-token niet gecachet (DASHBOARD_SECRET?):', e?.statusMessage || e?.message)
  }

  const rawDevice = readDeviceToken(event) || issueDeviceCookie(event)
  registerTrustedDevice(record, rawDevice, 'setup')

  try {
    await writeStore(record)
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage:
        'Kon het wachtwoord en de pincode niet op de server opslaan. Er is geen beschrijfbare, ' +
        `persistente opslag geconfigureerd (${storageLocation()}). Stel DASHBOARD_STORAGE_DIR in ` +
        'op een gekoppeld volume en probeer opnieuw.'
    })
  }

  return { ok: true }
})
