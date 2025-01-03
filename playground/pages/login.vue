<script setup lang="ts">
import type { Ref } from 'vue'
import LoginInput from '../../src/runtime/components/pages/login/LoginInput.vue'
import { definePageMeta, useNuxtApp } from '#imports'

const errors: Ref<Record<string, never>> = ref({})

const isWait = ref(false)

definePageMeta({
  middleware: ['guest'],
  layout: 'empty',
})

const formData = ref({
  email: 'denis_danilov_97@mail.ru',
  password: '',
})

const { $auth, $notification } = useNuxtApp()

async function onClick() {
  isWait.value = true

  await $auth().login(formData.value).catch((err) => {
    if (err.status === undefined) {
      $notification.push({ type: 'danger', message: ['Сервер недоступен,', 'попробуйте позже'] })

      return
    }

    errors.value = err.data.errors
  }).finally(() => {
    isWait.value = false
  })
}
</script>

<template>
  <div class="login">
    <form class="login__form">
      <div class="login__img">
        <img
          src="/img/logo.png"
          alt="logo"
          style="height: 20px; width: 20px;"
        >
        <div>Digital Dyatel</div>
      </div>
      <div class="login__header">
        Авторизация
      </div>
      <LoginInput
        v-model="formData.email"
        type="text"
        label="Логин"
        name="email"
        :errors="errors"
      />
      <LoginInput
        v-model="formData.password"
        type="password"
        label="Пароль"
        name="password"
        :errors="errors"
      />
      <button
        class="login__btn"
        type="submit"
        :disabled="isWait"
        @click.prevent="onClick"
      >
        Войти
      </button>
    </form>
  </div>
</template>

<style scoped>
.login__img {
  display: flex;
  place-items: center center;
  flex-direction: column;
  opacity: .5;
}
</style>
