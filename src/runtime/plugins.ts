import { defineNuxtPlugin } from '#imports'

import NotificationManager from './plugins/notification'
import ModalManager from './plugins/modal'

import vClickOutside from 'click-outside-vue3'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vClickOutside)

  return {
    provide: {
      notification: new NotificationManager(),
      modal: new ModalManager(),
    },
  }
})
