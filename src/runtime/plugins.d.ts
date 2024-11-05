import NotificationManager from './plugins/notification'
import ModalManager from './plugins/modal'

declare module '#app' {
  interface NuxtApp {
    $notification: NotificationManager
    $modal: ModalManager
  }
}

export {}
