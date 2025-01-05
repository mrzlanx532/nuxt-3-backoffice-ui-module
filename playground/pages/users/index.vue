<script setup lang="ts">
import { definePageMeta } from '#imports'

import Browser from '#backoffice-ui/components/Browser.vue';
import Tabs from '#backoffice-ui/components/Tabs.vue';
import Button from '#backoffice-ui/components/Button.vue';
import SubscriptionTab from './_tabs/subscription.vue'
import Picture from '#backoffice-ui/components/Browser/ColumnComponents/Picture.vue'

import UserForm from '~/modals/users/UserForm.vue'
import MainTab from './_tabs/main.vue'

definePageMeta({
  middleware: ['auth']
})

const {
  browserEl,
  item,

  onClickCreate,
  onClickEdit,
  onClickDelete,
  onItemUpdated
} = usePage()

const {
  initTabs,
} = useTabs()

const requestProperties = ref([
  'id',
  'name',
  'picture',
  'subscription_till',
  'subscription_till_for_exclusive_tracks',
  'subscription_type_id',
  'subscription_type',
  'downloads_counter',
  'views_counter',
  'created_at'
])

const {
  tabs,
  selectedTabComponent,
  onChangeSelectedTab
} = initTabs([
  {
    title: 'Инфо',
    component: MainTab
  },
  {
    title: 'Подписка',
    component: SubscriptionTab
  },
])

const columns = shallowRef([
  {
    name: 'id',
    title: 'ID'
  },
  {
    name: 'picture',
    title: 'Имя',
    component: {
      component: Picture,
      title: 'name',
    }
  },
  {
    name: 'company',
    title: 'Подписка (Срок действия)',
  },
  {
    name: 'downloads_counter',
    title: 'Скач.'
  },
  {
    name: 'views_counter',
    title: 'Просмотр'
  },
  {
    name: 'created_at',
    title: 'Дата создания',
    preset: {
      name: 'timestampToFormatPreset',
    }
  },
])
</script>

<template>
  <Browser
      ref="browserEl"
      h1="Каталог пользователей"
      url-prefix="users/browse"

      detail-url-prefix="users/detail"
      detail-title-property="id"
      detail-subtitle-property="name"
      detail-page-url-prefix="users"

      :columns="columns"
      :request-properties="requestProperties"

      @itemUpdated="onItemUpdated"
  >
    <template #rightSide>
      <div class="btn__group">
        <Button @click="onClickCreate({
          formURL: 'users/form',
          modalComponent: UserForm,
          modalTitle: 'Добавление пользователя',
          notificationMessage: 'Пользователь добавлен'
        })" :class="['--small --success']">Добавить</Button>
      </div>
    </template>

    <template #browserDetailHeader>
      <div class="btn__group">
        <Button @click="onClickEdit({
          formURL: 'users/form',
          modalComponent: UserForm,
          modalTitle: 'Изменение пользователя',
          notificationMessage: 'Пользователь изменен'
        })" :class="['--big --outline-primary']">Изменить</Button>
        <Button @click="onClickDelete({
          deleteURL: 'users/delete',
          notificationMessage: 'Пользователь удален'
        })" :class="['--big --outline-danger']">Удалить</Button>
      </div>
      <Tabs @change="onChangeSelectedTab" :tabs="tabs"/>
    </template>

    <template #browserDetailContent>
      <component :is="selectedTabComponent" :item="item"/>
    </template>
  </Browser>
</template>
