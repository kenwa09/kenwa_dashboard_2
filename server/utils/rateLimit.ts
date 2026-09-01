import type { H3Event } from 'h3'
import { getRequestHeader, createError } from 'h3'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const stores = new Map<string, Map<string, RateLimitEntry>>()

function getStore (name: string) {
  if (!stores.has(name)) {
    stores.set(name, new Map())
  }
  return stores.get(name)!
}

function getClientIp (event: H3Event): string {
  return getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() ||
    event.node.req.socket.remoteAddress ||
    'unknown'
}

/**
 * Simpele in-memory rate limiter (per proces).
 * Gooit een 429 als de limiet is overschreden.
 */
export function rateLimit (event: H3Event, opts: {
  name: string
  max: number
  windowMs: number
}) {
  const store = getStore(opts.name)
  const ip = getClientIp(event)
  const now = Date.now()

  // Periodiek verlopen entries opruimen
  if (Math.random() < 0.01) {
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) store.delete(key)
    }
  }

  const entry = store.get(ip)

  if (!entry || entry.resetAt <= now) {
    store.set(ip, { count: 1, resetAt: now + opts.windowMs })
    return
  }

  entry.count++

  if (entry.count > opts.max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    throw createError({
      statusCode: 429,
      statusMessage: `Te veel pogingen. Probeer het over ${retryAfter} seconden opnieuw.`
    })
  }
}
