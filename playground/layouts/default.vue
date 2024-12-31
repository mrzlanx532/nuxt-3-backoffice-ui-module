<script setup>
import { Notification, Modal } from '#components'
</script>

<template>
  <div>
    <div class="links">
      <NuxtLink to="/test/modal">Модалка</NuxtLink>
      <NuxtLink to="/test/notifications">Уведомления</NuxtLink>
      <NuxtLink to="/test/click-outside">ClickOutside</NuxtLink>
      <NuxtLink to="/test/scrollable">V-Scrollable</NuxtLink>
    </div>
    <slot />
    <Notification /><!-- Для работы уведомлений обязательно -->
    <Modal /><!-- Для работы модалок обязательно -->
  </div>
</template>

<style scoped>
div {
  height: 100%;
  width: 100%;
}

.links {
  padding: 20px;
  display: flex;
  flex-direction: row;
  grid-gap: 10px;
}
</style>
