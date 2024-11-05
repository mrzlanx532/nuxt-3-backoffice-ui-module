import NotificationManager from './plugins/notification'
import ModalManager from './plugins/modal'

declare module '#app' {
  interface NuxtApp {
    $notification: typeof NotificationManager
    $modal: typeof ModalManager
  }
}

export {}
