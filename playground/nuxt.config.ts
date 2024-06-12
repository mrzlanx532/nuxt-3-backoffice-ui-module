export default defineNuxtConfig({
  modules: ['../src/module'],
  myModule: {},
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Backoffice UI',
    }
  },
})
