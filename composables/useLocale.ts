import { watch } from 'vue'
import { useHead, useState } from '#imports'

const LOCALE_STORAGE_KEY = 'kenwa_locale'
const SUPPORTED_LOCALES = ['nl', 'en'] as const

export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

function resolveInitialLocale (): SupportedLocale {
  if (process.client) {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
      return stored as SupportedLocale
    }
    const navigatorLang = window.navigator.language?.split('-')[0]?.toLowerCase() || ''
    if (SUPPORTED_LOCALES.includes(navigatorLang as SupportedLocale)) {
      return navigatorLang as SupportedLocale
    }
  }
  return 'nl'
}

export function useLocale () {
  const locale = useState<SupportedLocale>('kenwa-locale', () => resolveInitialLocale())
  const initialized = useState<boolean>('kenwa-locale-initialized', () => false)

  if (process.client && !initialized.value) {
    initialized.value = true
    locale.value = resolveInitialLocale()
  }

  if (process.client) {
    watch(
      locale,
      (value) => {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, value)
      },
      { immediate: true }
    )
  }

  useHead(() => ({
    htmlAttrs: { lang: locale.value }
  }))

  function setLocale (value: string) {
    if (SUPPORTED_LOCALES.includes(value as SupportedLocale)) {
      locale.value = value as SupportedLocale
    }
  }

  return {
    locale,
    setLocale,
    supportedLocales: SUPPORTED_LOCALES
  }
}
