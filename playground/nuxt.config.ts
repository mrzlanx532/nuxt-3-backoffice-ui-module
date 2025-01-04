export default defineNuxtConfig({
  modules: [
    '@mrzlanx532/nuxt-3-laravel-auth-module',
    '../src/module',
  ],

  css: [
    '../src/runtime/assets/scss/themes/default.scss',
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
  devtools: { enabled: false },

  app: {
    head: {
      title: 'Backoffice UI',
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern"
        }
      }
    }
  },

  compatibilityDate: '2024-12-13',
})
