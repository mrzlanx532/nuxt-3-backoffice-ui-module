<script setup>
import { useNuxtApp } from '#app'

const { $notification } = useNuxtApp()

const notifications = [
  {
    type: 'default',
    message: 'Изменения будут сохранены без перезагрузки страницы',
  },
  {
    type: 'primary',
    message: 'Информация строго конфиденциальна',
  },
  {
    type: 'success',
    message: 'Запись добавлена',
  },
  {
    type: 'warning',
    message: 'Оповестите администратора об инциденте',
  },
  {
    type: 'danger',
    message: 'Не удалось выполнить сохранение',
  },
]

const onShowOne = (type, message) => {
  $notification.push({message, type})
}

const onShowAll = () => {
  notifications.forEach((notification) => {
    $notification.push({message: notification.message, type: notification.type})
  })
}

definePageMeta({
  layout: 'default',
})
</script>

<template>
  <button v-for="notification in notifications" @click="onShowOne(notification.type, notification.message)">Отправить уведомление [{{notification.type}}]</button>
  <button @click="onShowAll()">Отправить все сразу</button>
</template>
