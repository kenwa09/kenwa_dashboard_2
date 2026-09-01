import { getLockedEmail, readStore, isConfigured, isTrustedDevice, readDeviceToken } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  const record = await readStore()
  const deviceTrusted = !!record && isTrustedDevice(record, readDeviceToken(event))

  return {
    lockedEmail: getLockedEmail(),
    configured: isConfigured(record),
    deviceTrusted
  }
})
