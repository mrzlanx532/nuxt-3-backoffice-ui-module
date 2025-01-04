<script setup lang="ts">
import { SideMenu } from '#components'
import { useNuxtApp } from '#imports'

interface IUser {
  id: number
  name: string
  picture: {
    original: string
  } | null
}

const items = [
  {
    name: 'Объекты',
    link: '/objects',
    icon: '/img/menu_icons_sprite.svg#home'
  },
  {
    name: 'Блог',
    link: '/blog',
    icon: '/img/menu_icons_sprite.svg#document',
  },
  {
    name: 'Пользователи',
    icon: '/img/menu_icons_sprite.svg#user',
    children: [
      {
        name: 'Каталог пользователей',
        link: '/users',
        icon: '/img/menu_icons_sprite.svg#user',
      },
    ]
  },
  {
    name: 'Менеджеры',
    link: '/managers',
    icon: '/img/menu_icons_sprite.svg#users',
  },
]

const {
  $auth,
} = useNuxtApp()

const authorizedUser = $auth().getUser<IUser>()

const user = ref({
  id: authorizedUser.value!.id,
  name: authorizedUser.value!.name,
  img: authorizedUser.value!.picture?.original,
})
</script>

<template>
  <div id="app">
    <div class="container">
      <SideMenu :items="items" :user="user">
        <div class="img-container">
          <img alt="logo" src="/img/logo.png">
          <div class="logo-text-container">Example project</div>
        </div>
      </SideMenu>
      <div class="page">
        <div class="page__container">
          <slot />
        </div>
      </div>
    </div>
    <Modal />
    <Notification />
  </div>
</template>

<style scoped>
.logo-text-container {
  display: flex;
  place-items: center center;
  padding-left: 10px;
  user-select: none;
}

.img-container {
  padding: 30px 10px 30px 30px;
  display: flex;
  flex-direction: row;
}

img {
  width: 30px;
  height: 30px;
}
</style>
