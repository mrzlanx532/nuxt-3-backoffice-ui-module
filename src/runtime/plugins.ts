import { defineNuxtPlugin } from '#imports'
import NotificationManager from './plugins/notification'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      notification: new NotificationManager(),
    },
  }
})
