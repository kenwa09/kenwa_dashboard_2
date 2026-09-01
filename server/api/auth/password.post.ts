import { attachTokenCookie, verifyKenwaAdminToken } from '~/server/utils/auth'
import {
  readStore, writeStore, isConfigured, isTrustedDevice, readDeviceToken,
  verifySecret, getCachedKenwaToken,
  assertPasswordNotLocked, registerPasswordFailure, resetPasswordFailures
} from '~/server/utils/adminAuth'

/**
 * Inlog met het dashboard-eigen wachtwoord (geen kenwa.nl-wachtwoord).
 * Werkt uitsluitend op een vertrouwd apparaat en zolang de gecachete
 * kenwa.nl-token geldig is.
 */
export default defineEventHandler(async (event) => {
  rateLimit(event, { name: 'dashboard-password', max: 20, windowMs: 15 * 60 * 1000 })

  const body = await readBody<{ password?: string }>(event)
  const password = (body?.password || '').trim()
  if (!password) {
    throw createError({ statusCode: 400, statusMessage: 'Voer je dashboardwachtwoord in.' })
  }

  const record = await readStore()
  if (!record || !isConfigured(record)) {
    throw createError({ statusCode: 409, statusMessage: 'Er is nog geen dashboardwachtwoord ingesteld. Log in via e-mail.' })
  }

  if (!isTrustedDevice(record, readDeviceToken(event))) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Wachtwoord-login is op dit apparaat niet toegestaan. Log eerst in via e-mail.'
    })
  }

  assertPasswordNotLocked(record)

  if (!verifySecret(password, record.passwordHash, record.passwordSalt)) {
    registerPasswordFailure(record)
    await writeStore(record)
    assertPasswordNotLocked(record)
    throw createError({ statusCode: 401, statusMessage: 'Onjuist dashboardwachtwoord.' })
  }

  const cached = getCachedKenwaToken(record)
  const user = cached ? await verifyKenwaAdminToken(cached) : null

  if (!cached || !user) {
    record.kenwaTokenEnc = null
    record.kenwaTokenExp = null
    resetPasswordFailures(record)
    await writeStore(record)
    return {
      needFullLogin: true,
      message: 'Je sessie is verlopen. Log opnieuw in via e-mail; daarna werkt je wachtwoord weer.'
    }
  }

  resetPasswordFailures(record)
  await writeStore(record)

  attachTokenCookie(event, cached)
  return { token: cached, user }
})
