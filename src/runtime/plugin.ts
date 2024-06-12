import { defineNuxtPlugin } from '#imports'

import NotificationManager from './parts/notification'
import ModalManager from './parts/modal'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      notification: new NotificationManager(),
      modal: new ModalManager(),
    },
  }
})
