<script setup>
import { Notification, Modal } from '#components'
</script>

<template>
  <div>
    <div class="links">
      <NuxtLink to="modal">Модалка</NuxtLink>
      <NuxtLink to="notifications">Уведомления</NuxtLink>
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
