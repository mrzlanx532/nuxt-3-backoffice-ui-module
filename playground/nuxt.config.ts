export default defineNuxtConfig({
  modules: ['../src/module'],
  myModule: {},
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Backoffice UI',
    }
  },

  compatibilityDate: '2024-12-13',
})