import { computed, watch } from 'vue'
import { useState } from '#imports'
import { useLocale } from './useLocale'

type Messages = Record<string, any>

const FALLBACK_LOCALE = 'nl'
const localeLoaders: Record<string, () => Promise<Messages>> = {
  nl: () => import('~/locales/nl.json').then(module => module.default),
  en: () => import('~/locales/en.json').then(module => module.default)
}

function getNestedValue (messages: Messages, path: string) {
  const segments = path.split('.')
  let value: any = messages
  for (const segment of segments) {
    if (value && typeof value === 'object') {
      value = value[segment]
    } else {
      value = undefined
      break
    }
  }
  return value
}

export function useTranslations () {
  const { locale, supportedLocales, setLocale } = useLocale()
  const cachedMessages = useState<Record<string, Messages>>('kenwa-i18n-cache', () => ({}))
  const currentMessages = useState<Messages>('kenwa-i18n-current', () => ({}))
  const loading = useState<boolean>('kenwa-i18n-loading', () => false)

  async function loadLocaleMessages (targetLocale: string) {
    const normalized = supportedLocales.includes(targetLocale as any) ? targetLocale : FALLBACK_LOCALE

    if (cachedMessages.value[normalized]) {
      currentMessages.value = cachedMessages.value[normalized]
      return
    }

    loading.value = true
    try {
      const loader = localeLoaders[normalized] || localeLoaders[FALLBACK_LOCALE]
      const messages = await loader()
      cachedMessages.value = {
        ...cachedMessages.value,
        [normalized]: messages
      }
      currentMessages.value = messages
    } catch (error) {
      console.error('Kon vertalingen niet laden voor', normalized, error)
      if (normalized !== FALLBACK_LOCALE) {
        await loadLocaleMessages(FALLBACK_LOCALE)
        setLocale(FALLBACK_LOCALE)
      } else {
        currentMessages.value = {}
      }
    } finally {
      loading.value = false
    }
  }

  watch(
    locale,
    (value) => {
      loadLocaleMessages(value)
    },
    { immediate: true }
  )

  function t (path: string, replacements?: Record<string, string | number>): string {
    const rawValue = getNestedValue(currentMessages.value, path)
    if (typeof rawValue !== 'string') {
      return path
    }

    if (!replacements) {
      return rawValue
    }

    return Object.entries(replacements).reduce((result, [key, value]) => {
      return result.replace(new RegExp(`{${key}}`, 'g'), String(value))
    }, rawValue)
  }

  const messages = computed(() => currentMessages.value)

  return {
    t,
    messages,
    locale,
    setLocale,
    supportedLocales,
    loading: computed(() => loading.value)
  }
}
