import { defineNuxtPlugin } from '#imports'

import NotificationManager from './plugins_parts/notification'
import ModalManager from './plugins_parts/modal'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      notification: new NotificationManager(),
      modal: new ModalManager(),
    },
  }
})
