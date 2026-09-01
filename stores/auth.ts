import { defineStore } from 'pinia'

interface UserProfile {
  id: string
  name: string
  email?: string
  phone: string
  role: 'user' | 'admin'
  profileImage?: string
  privacyAcceptedAt?: string
}

interface PendingLoginChallenge {
  userId: string
  email?: string
  expiresAt?: string
  message?: string
  verificationCode?: string
}

type LoginPayload = {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(null)
  const token = useCookie<string | null>('kenwa_token', { sameSite: 'lax' })
  const loading = ref(false)
  const error = ref<string | null>(null)
  const errorDetail = ref<string | null>(null)
  const pendingLoginChallenge = ref<PendingLoginChallenge | null>(null)
  const authConfig = ref<{ lockedEmail: string; configured: boolean; deviceTrusted: boolean } | null>(null)
  const needsSetup = ref(false)

  function resetErrorState () {
    error.value = null
    errorDetail.value = null
  }

  function extractErrorDetail (err: any) {
    return (
      err?.data?.message ||
      err?.data?.statusMessage ||
      err?.response?._data?.message ||
      err?.response?._data?.statusMessage ||
      err?.message ||
      null
    )
  }

  async function login (payload: LoginPayload) {
    loading.value = true
    resetErrorState()
    try {
      const response = await $fetch<
        { user: UserProfile; token: string } |
        { twoFactorRequired: true; userId: string; email?: string; expiresAt?: string; message?: string; verificationCode?: string }
      >('/api/auth/login', {
        method: 'POST',
        body: payload
      })

      if ('twoFactorRequired' in response && response.twoFactorRequired) {
        pendingLoginChallenge.value = {
          userId: response.userId,
          email: response.email,
          expiresAt: response.expiresAt,
          message: response.message,
          verificationCode: response.verificationCode
        }
        return null
      }

      if (response.user.role !== 'admin') {
        error.value = 'Toegang geweigerd. Alleen admins kunnen inloggen op dit dashboard.'
        token.value = null
        user.value = null
        pendingLoginChallenge.value = null
        return null
      }

      user.value = response.user
      token.value = response.token
      pendingLoginChallenge.value = null
      return user.value
    } catch (err: any) {
      pendingLoginChallenge.value = null
      error.value = err?.data?.statusMessage || err.message || 'Inloggen mislukt'
      const detail = extractErrorDetail(err)
      if (detail && detail !== error.value) {
        errorDetail.value = detail
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function verifyLoginCode (code: string) {
    if (!pendingLoginChallenge.value) {
      throw new Error('Er is geen inlogcode aangevraagd')
    }
    loading.value = true
    resetErrorState()
    try {
      const response = await $fetch<{ user: UserProfile; token: string }>('/api/auth/login/verify', {
        method: 'POST',
        body: {
          userId: pendingLoginChallenge.value.userId,
          code
        }
      })

      if (response.user.role !== 'admin') {
        error.value = 'Toegang geweigerd. Alleen admins kunnen inloggen op dit dashboard.'
        pendingLoginChallenge.value = null
        return null
      }

      user.value = response.user
      token.value = response.token
      pendingLoginChallenge.value = null
      needsSetup.value = !(response as any).dashboardConfigured
      return user.value
    } catch (err: any) {
      error.value = err?.data?.statusMessage || err.message || 'Verifiëren van code mislukt'
      const detail = extractErrorDetail(err)
      if (detail && detail !== error.value) {
        errorDetail.value = detail
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  function cancelLoginChallenge () {
    resetErrorState()
    pendingLoginChallenge.value = null
  }

  async function fetchAuthConfig () {
    try {
      authConfig.value = await $fetch('/api/auth/config')
    } catch {
      authConfig.value = null
    }
    return authConfig.value
  }

  async function completeSetup (payload: { password: string; pin: string }) {
    loading.value = true
    resetErrorState()
    try {
      await $fetch('/api/auth/setup', { method: 'POST', body: payload })
      needsSetup.value = false
      await fetchProfile()
      await fetchAuthConfig()
      return user.value
    } catch (err: any) {
      error.value = err?.data?.statusMessage || err.message || 'Instellen van wachtwoord en pincode mislukt'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loginWithSecret (endpoint: '/api/auth/pin' | '/api/auth/password', body: Record<string, string>, fallbackMsg: string) {
    loading.value = true
    resetErrorState()
    try {
      const response = await $fetch<any>(endpoint, { method: 'POST', body })
      if (response?.needFullLogin) {
        error.value = response.message || 'Je sessie is verlopen. Log in via e-mail.'
        return { needFullLogin: true as const }
      }
      if (response.user?.role !== 'admin') {
        error.value = 'Toegang geweigerd. Alleen admins kunnen inloggen op dit dashboard.'
        return null
      }
      user.value = response.user
      token.value = response.token
      pendingLoginChallenge.value = null
      needsSetup.value = false
      return user.value
    } catch (err: any) {
      error.value = err?.data?.statusMessage || err.message || fallbackMsg
      throw err
    } finally {
      loading.value = false
    }
  }

  function loginWithPin (pin: string) {
    return loginWithSecret('/api/auth/pin', { pin }, 'Inloggen met pincode mislukt')
  }

  function loginWithPassword (password: string) {
    return loginWithSecret('/api/auth/password', { password }, 'Inloggen met wachtwoord mislukt')
  }

  async function fetchProfile () {
    if (!token.value) {
      return null
    }
    try {
      resetErrorState()
      const response = await $fetch<{ user: UserProfile }>('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      if (response.user.role !== 'admin') {
        token.value = null
        user.value = null
        return null
      }
      user.value = response.user
      return response.user
    } catch {
      token.value = null
      user.value = null
      return null
    }
  }

  async function logout () {
    await $fetch('/api/auth/logout', { method: 'POST' })
    token.value = null
    user.value = null
    pendingLoginChallenge.value = null
    needsSetup.value = false
  }

  const loggedIn = computed(() => !!user.value && !!token.value && user.value.role === 'admin')
  const awaitingTwoFactor = computed(() => !!pendingLoginChallenge.value && !loggedIn.value)

  return {
    user,
    token,
    loading,
    error,
    errorDetail,
    pendingLoginChallenge,
    authConfig,
    needsSetup,
    loggedIn,
    awaitingTwoFactor,
    login,
    verifyLoginCode,
    cancelLoginChallenge,
    fetchAuthConfig,
    completeSetup,
    loginWithPin,
    loginWithPassword,
    fetchProfile,
    logout
  }
})
