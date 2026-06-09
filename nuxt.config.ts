import { defineNuxtConfig } from 'nuxt/config'
import 'dotenv/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.scss'],
  app: {
    head: {
      titleTemplate: '%s — Kenwa Admin',
      title: 'Admin Dashboard',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ],
      meta: [
        { name: 'description', content: 'Kenwa Admin Dashboard' },
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'theme-color', content: '#0f172a' }
      ]
    }
  },
  modules: ['@pinia/nuxt'],
  nitro: {
    compatibilityDate: '2025-10-17'
  },
  runtimeConfig: {
    // URL van de kenwa backend — alle API calls worden hierheen geproxyd
    kenwaApiUrl: process.env.KENWA_API_URL || 'https://kenwa.nl',
    public: {
      appName: 'Kenwa Admin'
    }
  }
})
