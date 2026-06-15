<template>
  <div class="login-page">
    <!-- Background pattern -->
    <div class="bg-pattern" aria-hidden="true">
      <div class="grid-lines" />
      <div class="glow glow-1" />
      <div class="glow glow-2" />
    </div>

    <div class="login-wrapper">
      <!-- Brand -->
      <div class="brand">
        <div class="brand-logo">
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="url(#logo-grad)" />
            <path d="M20 10C15.58 10 12 13.58 12 18C12 24.5 20 32 20 32C20 32 28 24.5 28 18C28 13.58 24.42 10 20 10ZM20 21C18.34 21 17 19.66 17 18C17 16.34 18.34 15 20 15C21.66 15 23 16.34 23 18C23 19.66 21.66 21 20 21Z" fill="white" />
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stop-color="#6366f1" />
                <stop offset="1" stop-color="#2563eb" />
              </linearGradient>
            </defs>
          </svg>
          <span class="brand-name">Kenwa</span>
          <span class="brand-tag">Admin</span>
        </div>
        <p class="brand-sub">Beveiligd beheerportaal</p>
      </div>

      <!-- Card -->
      <div class="login-card">
        <!-- Step 1: credentials -->
        <div v-if="!awaitingTwoFactor" class="card-body">
          <div class="card-header">
            <div class="lock-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1>Inloggen</h1>
            <p>Vul je admingegevens in om door te gaan</p>
          </div>

          <form class="form" @submit.prevent="handleLogin">
            <div class="field">
              <label for="email">E-mailadres</label>
              <div class="input-wrap">
                <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="admin@kenwa.nl"
                  autocomplete="email"
                  required
                >
              </div>
            </div>

            <div class="field">
              <label for="password">Wachtwoord</label>
              <div class="input-wrap">
                <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  required
                >
                <button type="button" class="eye-btn" :aria-label="showPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="authStore.error" class="error-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{{ authStore.error }}</span>
            </div>

            <button type="submit" class="btn-submit" :disabled="authStore.loading">
              <span v-if="authStore.loading" class="spinner" />
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              {{ authStore.loading ? 'Even geduld...' : 'Inloggen' }}
            </button>
          </form>
        </div>

        <!-- Step 2: 2FA -->
        <div v-else class="card-body twofa-body">
          <div class="card-header">
            <div class="lock-icon twofa-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <h1>Verificatie vereist</h1>
            <p>
              Een 6-cijferige code is verstuurd naar<br>
              <strong class="email-highlight">{{ challenge?.email || form.email }}</strong>
            </p>
          </div>

          <div class="info-banner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            Check ook je spam/ongewenste e-mail map.
          </div>

          <div v-if="challenge?.verificationCode" class="fallback-code">
            <p>E-mail kon niet worden verstuurd. Gebruik deze code:</p>
            <div class="code-value">{{ challenge.verificationCode }}</div>
          </div>

          <form class="form" @submit.prevent="submitLoginCode">
            <div class="field">
              <label for="code">Verificatiecode</label>
              <input
                id="code"
                v-model="loginCode"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="6"
                placeholder="000000"
                class="code-input"
                required
              >
            </div>

            <div v-if="authStore.error" class="error-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{{ authStore.error }}</span>
            </div>

            <button type="submit" class="btn-submit" :disabled="authStore.loading">
              <span v-if="authStore.loading" class="spinner" />
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {{ authStore.loading ? 'Verifiëren...' : 'Verifiëren' }}
            </button>

            <button type="button" class="btn-back" @click="cancelTwoFactor">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Terug naar inloggen
            </button>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <div class="login-footer">
        <div class="security-badges">
          <span class="badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            SSL beveiligd
          </span>
          <span class="badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            JWT versleuteld
          </span>
          <span class="badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
            2FA vereist
          </span>
        </div>
        <p class="footer-text">Kenwa Admin © {{ new Date().getFullYear() }} — Alleen geautoriseerde admins</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'

definePageMeta({ middleware: ['guest'], layout: false })

const authStore = useAuthStore()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const loginCode = ref('')
const showPassword = ref(false)

const awaitingTwoFactor = computed(() => authStore.awaitingTwoFactor)
const challenge = computed(() => authStore.pendingLoginChallenge)

watch(awaitingTwoFactor, (val) => {
  if (val) loginCode.value = ''
})

async function handleLogin () {
  const email = form.email?.trim() || ''
  form.email = email
  if (!email || !form.password) return
  await authStore.login({ email, password: form.password })
  if (!authStore.awaitingTwoFactor && authStore.loggedIn) {
    const redirect = (route.query.redirect as string) || '/admin'
    await navigateTo(redirect)
  }
}

async function submitLoginCode () {
  if (!loginCode.value.trim()) return
  await authStore.verifyLoginCode(loginCode.value.trim())
  if (authStore.loggedIn) {
    const redirect = (route.query.redirect as string) || '/admin'
    await navigateTo(redirect)
  }
}

function cancelTwoFactor () {
  authStore.cancelLoginChallenge()
  loginCode.value = ''
}
</script>

<style scoped>
/* ── Base ─────────────────────────────────────────────── */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    linear-gradient(135deg, rgba(103, 65, 255, 0.9) 0%, rgba(67, 40, 200, 0.93) 55%, rgba(15, 8, 60, 0.97) 100%),
    url('/hero-mockup.png') center / cover no-repeat;
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ── Background decoration ────────────────────────────── */
.bg-pattern {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.2;
}

.glow-1 {
  width: 500px;
  height: 500px;
  background: #a78bfa;
  top: -150px;
  right: -80px;
}

.glow-2 {
  width: 400px;
  height: 400px;
  background: #06b6d4;
  bottom: -150px;
  left: -60px;
}

/* ── Wrapper ──────────────────────────────────────────── */
.login-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

/* ── Brand ────────────────────────────────────────────── */
.brand {
  text-align: center;
}

.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.brand-name {
  font-size: 1.375rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.brand-tag {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  margin-left: 0.25rem;
}

.brand-sub {
  margin: 0.4rem 0 0;
  font-size: 0.825rem;
  color: rgba(255, 255, 255, 0.55);
}

/* ── Card ─────────────────────────────────────────────── */
.login-card {
  width: 100%;
  background: #ffffff;
  border-radius: 1.25rem;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 4px 16px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.card-body {
  padding: 2.25rem 2rem;
}

/* ── Card header ──────────────────────────────────────── */
.card-header {
  text-align: center;
  margin-bottom: 1.75rem;
}

.lock-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, rgba(103, 65, 255, 0.1), rgba(85, 51, 238, 0.07));
  border: 1px solid rgba(103, 65, 255, 0.2);
  border-radius: 0.875rem;
  color: #6741ff;
  margin: 0 auto 1rem;
}

.twofa-icon-wrap {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(103, 65, 255, 0.07));
  border-color: rgba(6, 182, 212, 0.25);
  color: #06b6d4;
}

.card-header h1 {
  font-size: 1.375rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.4rem;
  letter-spacing: -0.02em;
}

.card-header p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.email-highlight {
  color: #6741ff;
  font-weight: 600;
}

/* ── Form ─────────────────────────────────────────────── */
.form {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.02em;
}

.input-wrap {
  position: relative;
}

.field-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.input-wrap input,
.code-input {
  width: 100%;
  padding: 0.75rem 0.875rem 0.75rem 2.5rem;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.625rem;
  color: #111827;
  font-size: 0.9rem;
  transition: all 0.15s ease;
  box-sizing: border-box;
  outline: none;
}

.input-wrap input::placeholder {
  color: #d1d5db;
}

.input-wrap input:focus {
  border-color: #6741ff;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(103, 65, 255, 0.12);
}

.eye-btn {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}

.eye-btn:hover {
  color: #6741ff;
}

/* ── 2FA code input ───────────────────────────────────── */
.code-input {
  padding: 1rem;
  padding-left: 1rem;
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.4em;
  background: #faf8ff;
  border-color: rgba(103, 65, 255, 0.2);
  color: #111827;
}

.code-input:focus {
  border-color: #6741ff;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(103, 65, 255, 0.12);
}

/* ── Info banner ──────────────────────────────────────── */
.info-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  color: #2563eb;
  font-size: 0.8rem;
  margin-bottom: 1.25rem;
}

/* ── Fallback code ────────────────────────────────────── */
.fallback-code {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 0.625rem;
  padding: 0.875rem 1rem;
  text-align: center;
  margin-bottom: 1.25rem;
}

.fallback-code p {
  font-size: 0.8rem;
  color: #92400e;
  margin: 0 0 0.4rem;
}

.code-value {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.35em;
  color: #d97706;
}

/* ── Error box ────────────────────────────────────────── */
.error-box {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem 0.875rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.625rem;
  color: #dc2626;
  font-size: 0.85rem;
}

.error-box svg {
  flex-shrink: 0;
  margin-top: 0.1rem;
}

/* ── Buttons ──────────────────────────────────────────── */
.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.8rem 1rem;
  background: linear-gradient(135deg, #6741ff, #5533ee);
  color: white;
  border: none;
  border-radius: 0.625rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(103, 65, 255, 0.4);
  margin-top: 0.25rem;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #7c5cff, #6741ff);
  box-shadow: 0 6px 20px rgba(103, 65, 255, 0.5);
  transform: translateY(-1px);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(103, 65, 255, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.625rem;
  background: none;
  color: #9ca3af;
  border: none;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.15s;
}

.btn-back:hover {
  color: #6741ff;
}

/* ── Spinner ──────────────────────────────────────────── */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Footer ───────────────────────────────────────────── */
.login-footer {
  text-align: center;
}

.security-badges {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
}

.footer-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
  margin: 0;
}

/* ── Mobile ───────────────────────────────────────────── */
@media (max-width: 480px) {
  .card-body {
    padding: 1.75rem 1.25rem;
  }

  .security-badges {
    gap: 0.75rem;
  }
}
</style>
