import { promises as fs } from 'fs'
import { join } from 'path'
import crypto from 'crypto'
import type { H3Event } from 'h3'
import { getCookie, setCookie, createError } from 'h3'
import { useRuntimeConfig } from '#imports'

/**
 * Lokale auth-opslag voor het dashboard.
 *
 * Dit raakt kenwa.nl NIET aan. Het dashboard blijft voor admin-calls volledig
 * afhankelijk van de kenwa.nl-JWT; die token wordt hier alleen versleuteld
 * gecachet zodat een pincode/dashboardwachtwoord binnen de geldigheidsduur
 * (7 dagen) direct kan inloggen zonder de volledige e-mail+2FA-flow.
 */

const STORE_DIR = join(process.cwd(), 'server/storage')
const STORE_PATH = join(STORE_DIR, 'admin-auth.json')

const PBKDF2_ITERATIONS = 210_000
const PBKDF2_KEYLEN = 64
const PBKDF2_DIGEST = 'sha512'

export const KENWA_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

export const DEVICE_COOKIE = 'kenwa_device'
const DEVICE_TTL_MS = 180 * 24 * 60 * 60 * 1000

export const PIN_MAX_ATTEMPTS = 5
export const PW_MAX_ATTEMPTS = 10
export const LOCK_MS = 15 * 60 * 1000

export interface TrustedDevice {
  hash: string
  createdAt: string
  lastSeenAt: string
  label?: string
}

export interface AdminAuthRecord {
  email: string
  passwordHash?: string
  passwordSalt?: string
  pinHash?: string
  pinSalt?: string
  pinFailCount: number
  pinLockedUntil?: string | null
  pwFailCount: number
  pwLockedUntil?: string | null
  trustedDevices: TrustedDevice[]
  kenwaTokenEnc?: string | null
  kenwaTokenExp?: string | null
  setupCompletedAt?: string | null
  updatedAt: string
}

/* ── Config ─────────────────────────────────────────────── */

export function getLockedEmail (): string {
  const { lockedEmail } = useRuntimeConfig()
  return String(lockedEmail || 'ser_syv@hotmail.com').trim().toLowerCase()
}

function getDashboardSecret (): string {
  const { dashboardSecret } = useRuntimeConfig()
  const secret = String(dashboardSecret || '')
  if (!secret || secret.length < 16) {
    throw createError({
      statusCode: 500,
      statusMessage: 'DASHBOARD_SECRET ontbreekt of is te kort. Stel deze in via .env voordat pincode/wachtwoord-login werkt.'
    })
  }
  return secret
}

/* ── Store I/O (geserialiseerd) ─────────────────────────── */

let writeChain: Promise<unknown> = Promise.resolve()

export function blankRecord (): AdminAuthRecord {
  return {
    email: getLockedEmail(),
    pinFailCount: 0,
    pinLockedUntil: null,
    pwFailCount: 0,
    pwLockedUntil: null,
    trustedDevices: [],
    kenwaTokenEnc: null,
    kenwaTokenExp: null,
    setupCompletedAt: null,
    updatedAt: new Date().toISOString()
  }
}

export async function readStore (): Promise<AdminAuthRecord | null> {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf-8')
    const parsed = JSON.parse(raw) as AdminAuthRecord
    if (!Array.isArray(parsed.trustedDevices)) parsed.trustedDevices = []
    return parsed
  } catch (err: any) {
    if (err?.code === 'ENOENT') return null
    throw err
  }
}

export async function writeStore (record: AdminAuthRecord): Promise<AdminAuthRecord> {
  record.updatedAt = new Date().toISOString()
  const run = async () => {
    await fs.mkdir(STORE_DIR, { recursive: true })
    const tmp = `${STORE_PATH}.${process.pid}.${Date.now()}.tmp`
    await fs.writeFile(tmp, JSON.stringify(record, null, 2), { encoding: 'utf-8', mode: 0o600 })
    await fs.rename(tmp, STORE_PATH)
  }
  writeChain = writeChain.then(run, run)
  await writeChain
  return record
}

export function isConfigured (record: AdminAuthRecord | null): boolean {
  return !!(record?.setupCompletedAt && record.passwordHash && record.pinHash)
}

/* ── Hashing (PBKDF2-HMAC-SHA512, zoals de rest van de codebase) ─ */

export function hashSecret (value: string, salt?: string) {
  const usedSalt = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(value, usedSalt, PBKDF2_ITERATIONS, PBKDF2_KEYLEN, PBKDF2_DIGEST)
    .toString('hex')
  return { hash, salt: usedSalt }
}

export function verifySecret (value: string, hash?: string, salt?: string): boolean {
  if (!hash || !salt) return false
  const { hash: candidate } = hashSecret(value, salt)
  const a = Buffer.from(candidate, 'hex')
  const b = Buffer.from(hash, 'hex')
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

/* ── Versleuteling van de gecachete kenwa.nl-token (AES-256-GCM) ─ */

function tokenKey (): Buffer {
  return crypto.scryptSync(getDashboardSecret(), 'kenwa-dash', 32)
}

export function encryptToken (plain: string): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', tokenKey(), iv)
  const enc = Buffer.concat([cipher.update(plain, 'utf-8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv.toString('base64'), tag.toString('base64'), enc.toString('base64')].join(':')
}

export function decryptToken (payload?: string | null): string | null {
  if (!payload) return null
  try {
    const [ivB64, tagB64, dataB64] = payload.split(':')
    if (!ivB64 || !tagB64 || !dataB64) return null
    const decipher = crypto.createDecipheriv('aes-256-gcm', tokenKey(), Buffer.from(ivB64, 'base64'))
    decipher.setAuthTag(Buffer.from(tagB64, 'base64'))
    const dec = Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64')), decipher.final()])
    return dec.toString('utf-8')
  } catch {
    return null
  }
}

export function cacheKenwaToken (record: AdminAuthRecord, token: string) {
  record.kenwaTokenEnc = encryptToken(token)
  record.kenwaTokenExp = new Date(Date.now() + KENWA_TOKEN_TTL_MS).toISOString()
}

export function getCachedKenwaToken (record: AdminAuthRecord): string | null {
  if (!record.kenwaTokenEnc || !record.kenwaTokenExp) return null
  if (Date.parse(record.kenwaTokenExp) <= Date.now()) return null
  return decryptToken(record.kenwaTokenEnc)
}

/* ── Apparaatbinding ────────────────────────────────────── */

function hashDeviceToken (raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex')
}

export function readDeviceToken (event: H3Event): string | null {
  return getCookie(event, DEVICE_COOKIE) || null
}

export function issueDeviceCookie (event: H3Event): string {
  const raw = crypto.randomBytes(32).toString('hex')
  setCookie(event, DEVICE_COOKIE, raw, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.floor(DEVICE_TTL_MS / 1000)
  })
  return raw
}

export function registerTrustedDevice (record: AdminAuthRecord, rawToken: string, label?: string) {
  const hash = hashDeviceToken(rawToken)
  const now = new Date().toISOString()
  const existing = record.trustedDevices.find(d => d.hash === hash)
  if (existing) {
    existing.lastSeenAt = now
    if (label) existing.label = label
    return
  }
  record.trustedDevices.push({ hash, createdAt: now, lastSeenAt: now, label })
  // Hou de lijst kort — max 10 apparaten, oudste eruit
  if (record.trustedDevices.length > 10) {
    record.trustedDevices.sort((a, b) => Date.parse(a.lastSeenAt) - Date.parse(b.lastSeenAt))
    record.trustedDevices = record.trustedDevices.slice(-10)
  }
}

export function isTrustedDevice (record: AdminAuthRecord, rawToken: string | null): boolean {
  if (!rawToken) return false
  const hash = hashDeviceToken(rawToken)
  const device = record.trustedDevices.find(d => d.hash === hash)
  if (!device) return false
  device.lastSeenAt = new Date().toISOString()
  return true
}

/* ── Lockout ────────────────────────────────────────────── */

function assertNotLocked (lockedUntil: string | null | undefined, wat: string) {
  if (lockedUntil && Date.parse(lockedUntil) > Date.now()) {
    const mins = Math.ceil((Date.parse(lockedUntil) - Date.now()) / 60000)
    throw createError({
      statusCode: 429,
      statusMessage: `${wat} is tijdelijk geblokkeerd na te veel foute pogingen. Probeer het over ${mins} minuten opnieuw of log in via e-mail.`
    })
  }
}

export function assertPinNotLocked (record: AdminAuthRecord) {
  assertNotLocked(record.pinLockedUntil, 'Pincode')
}

export function assertPasswordNotLocked (record: AdminAuthRecord) {
  assertNotLocked(record.pwLockedUntil, 'Wachtwoord')
}

export function registerPinFailure (record: AdminAuthRecord) {
  record.pinFailCount = (record.pinFailCount || 0) + 1
  if (record.pinFailCount >= PIN_MAX_ATTEMPTS) {
    record.pinLockedUntil = new Date(Date.now() + LOCK_MS).toISOString()
    record.pinFailCount = 0
  }
}

export function resetPinFailures (record: AdminAuthRecord) {
  record.pinFailCount = 0
  record.pinLockedUntil = null
}

export function registerPasswordFailure (record: AdminAuthRecord) {
  record.pwFailCount = (record.pwFailCount || 0) + 1
  if (record.pwFailCount >= PW_MAX_ATTEMPTS) {
    record.pwLockedUntil = new Date(Date.now() + LOCK_MS).toISOString()
    record.pwFailCount = 0
  }
}

export function resetPasswordFailures (record: AdminAuthRecord) {
  record.pwFailCount = 0
  record.pwLockedUntil = null
}
