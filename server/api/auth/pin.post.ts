import { attachTokenCookie, verifyKenwaAdminToken } from '~/server/utils/auth'
import {
  readStore, writeStore, isConfigured, isTrustedDevice, readDeviceToken,
  verifySecret, getCachedKenwaToken,
  assertPinNotLocked, registerPinFailure, resetPinFailures
} from '~/server/utils/adminAuth'

/** Opslaan mag de inlogflow niet breken bij een niet-beschrijfbare opslag. */
async function persist (record: Parameters<typeof writeStore>[0]) {
  try {
    await writeStore(record)
  } catch (e: any) {
    console.warn('[auth] pin: kon opslag niet bijwerken:', e?.code || e?.message)
  }
}

/**
 * Snelle inlog met alleen de 5-cijferige pincode.
 * Werkt uitsluitend op een apparaat dat eerder via e-mail is ingelogd
 * (vertrouwd `kenwa_device`-cookie) en zolang de gecachete kenwa.nl-token geldig is.
 */
export default defineEventHandler(async (event) => {
  rateLimit(event, { name: 'dashboard-pin', max: 20, windowMs: 15 * 60 * 1000 })

  const body = await readBody<{ pin?: string }>(event)
  const pin = (body?.pin || '').trim()
  if (!/^\d{5}$/.test(pin)) {
    throw createError({ statusCode: 400, statusMessage: 'Voer je 5-cijferige pincode in.' })
  }

  const record = await readStore()
  if (!record || !isConfigured(record)) {
    throw createError({ statusCode: 409, statusMessage: 'Er is nog geen pincode ingesteld. Log in via e-mail.' })
  }

  if (!isTrustedDevice(record, readDeviceToken(event))) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Pincode-login is op dit apparaat niet toegestaan. Log eerst in via e-mail.'
    })
  }

  assertPinNotLocked(record)

  if (!verifySecret(pin, record.pinHash, record.pinSalt)) {
    registerPinFailure(record)
    await persist(record)
    assertPinNotLocked(record) // gooit 429 als deze poging de blokkade activeerde
    throw createError({ statusCode: 401, statusMessage: 'Onjuiste pincode.' })
  }

  const cached = getCachedKenwaToken(record)
  const user = cached ? await verifyKenwaAdminToken(cached) : null

  if (!cached || !user) {
    record.kenwaTokenEnc = null
    record.kenwaTokenExp = null
    resetPinFailures(record)
    await persist(record)
    return {
      needFullLogin: true,
      message: 'Je sessie is verlopen. Log opnieuw in via e-mail; daarna werkt je pincode weer.'
    }
  }

  resetPinFailures(record)
  await persist(record)

  attachTokenCookie(event, cached)
  return { token: cached, user }
})
