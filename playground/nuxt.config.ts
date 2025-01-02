export default defineNuxtConfig({
  modules: [
    '@mrzlanx532/nuxt-3-laravel-auth-module',
    '../src/module',
  ],
  // myModule: {},
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Backoffice UI',
    },
  },

  compatibilityDate: '2024-12-13',
})
