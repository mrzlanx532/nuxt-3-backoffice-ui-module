import { type INotificationManager } from './plugins/notification'
import { type IModalManager } from './plugins/modal'

declare module '#app' {
  interface NuxtApp {
    $notification: INotificationManager
    $modal: IModalManager
  }
}

export {}
