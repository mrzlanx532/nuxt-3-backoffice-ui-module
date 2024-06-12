<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useNuxtApp } from '#imports'

const notifications = ref([])

const { $notification } = useNuxtApp()

onMounted(() => {
  $notification.instance = getCurrentInstance()
  $notification.notifications = notifications
})

const onMouseOver = (id) => {
  const notification = notifications.value.find((notification) => notification.id === id)

  if (notification) {
    notification.isWaiting = true
  }
}

const onMouseOut = (id) => {
  const notification = notifications.value.find((notification) => notification.id === id)

  if (notification) {
    notification.isWaiting = false

    $notification.removeItemByTimer(500, notification.id)
  }
}

const onClickCross = (index) => {
  notifications.value.splice(index, 1)
}
</script>

<template>
  <teleport to="#teleports">
    <div class="notification">
        <transition-group name="slide">
          <div
            @mouseout="onMouseOut(notification.id)"
            @mouseover="onMouseOver(notification.id)"
            v-for="(notification, index) in notifications"
            class="notification__notification"
            :class="notification.classModifier"
            :key="notification.id"
          >
            <div class="notification__wrapper">
              <div class="notification__icon">
                <svg>
                  <use :xlink:href="'/img/sprite.svg#' + notification.type"/>
                </svg>
              </div>
              <div class="notification__content">
                {{ notification.message }}
              </div>
              <svg class="notification__cross" @click="onClickCross(index)">
                <use xlink:href="/img/sprite.svg#cancel_cross_bold"/>
              </svg>
            </div>
          </div>
        </transition-group>
      </div>
  </teleport>
</template>

<style scoped>
.slide-enter-active {
  animation: slide-in .4s;
}

.slide-leave-active {
  animation: slide-in .4s reverse;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-1000px);
}

@keyframes slide-in {
  0% {
    transform: translateX(-1000px);
  }

  50% {
    transform: translateX(20px);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
