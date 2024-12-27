type NotificationType = 'default' | 'primary' | 'success' | 'danger' | 'warning'

type INotification = {
  message: string | string[],
  type?: NotificationType,
  autoRemoving?: boolean,
  milli?: number,
  milliAfterHover?: number,
  isWaiting?: boolean
}

export interface INotificationManager {
  instance: null,
  notifications: INotification[]

  removeItemByTime: (milli: number, id: symbol) => void,
  push: (notification: INotification) => void
}

export default class NotificationManager implements INotificationManager{
  public instance = null
  public notifications = null

  public removeItemByTimer = (milli = 2000, id: symbol): void => {

    setTimeout(() => {

      const notification = this.notifications.value.find((notification) => notification.id === id)

      if (!notification?.autoRemoving) {
        return
      }

      if (!notification.isWaiting) {
        this.notifications.value.splice(notification, 1)
      }

    }, milli)
  }

  public push(notification: INotification): void {

    if (notification.type === undefined) {
      notification.type = Type.DEFAULT
    }

    notification.classModifier = `--${notification.type}`
    notification.id = Symbol('id')
    notification.isWaiting = false
    notification.milliAfterHover = notification.milliAfterHover ? notification.milliAfterHover : 500

    if (notification.autoRemoving === undefined) {
      notification.autoRemoving = true
    }

    this.notifications.value.push(notification)

    this.removeItemByTimer(notification.milli, notification.id)
  }
}
