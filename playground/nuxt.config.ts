export default defineNuxtConfig({
  modules: [
    '@mrzlanx532/nuxt-3-laravel-auth-module',
    '../src/module',
  ],

  laravelAuth: {
    domain: 'http://backoffice-api.example-laravel-backend-for-nuxt.ru',
    redirects: {
      guest: '/login',
      auth: '/'
    },
    endpoints: {
      login: 'managers/self/auth',
      logout: 'managers/self/logout',
      fetchUser: 'managers/self/detail',
      register: 'managers/self/register', // Опционально
    },
  },
  // myModule: {},
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Backoffice UI',
    },
  },

  compatibilityDate: '2024-12-13',
})
