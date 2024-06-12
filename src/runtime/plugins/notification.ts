enum Type {
  DEFAULT = 'default',
  PRIMARY = 'primary',
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
}

type Notification = {
  message: string,
  type?: Type,
  autoRemoving: boolean,
  milli?: number,
  milliAfterHover?: number,
  isWaiting?: boolean
}

export default class NotificationManager {
  public instance = null
  public notifications = null

  public removeItemByTimer = (milli = 2000, id) => {

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

  public push(notification: Notification): void {

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
