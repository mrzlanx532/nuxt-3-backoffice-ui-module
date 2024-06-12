import { defineNuxtPlugin } from '#imports'

import NotificationManager from './plugins/notification'
import ModalManager from './plugins/modal'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      notification: new NotificationManager(),
      modal: new ModalManager(),
    },
  }
})
