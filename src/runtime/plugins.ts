import { defineNuxtPlugin } from '#imports'

import NotificationManager from './plugins/notification'
import ModalManager from './plugins/modal'

import * as vClickOutside from 'click-outside-vue3'

export default defineNuxtPlugin((_nuxtApp) => {
  _nuxtApp.vueApp.use(vClickOutside)

  return {
    provide: {
      notification: new NotificationManager(),
      modal: new ModalManager(),
    },
  }
})
