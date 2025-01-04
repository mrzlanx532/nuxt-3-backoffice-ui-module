<script setup lang="ts">
import { definePageMeta, useNuxtApp, useTabs, usePage } from '#imports'
import Button from '../../../src/runtime/components/base/Button.vue'
import Browser, { type IItem } from '../../../src/runtime/components/base/Browser/Browser.vue';
import Badge from '../../../src/runtime/components/base/Browser/ColumnComponents/Badge.vue'
import Picture from '../../../src/runtime/components/base/Browser/ColumnComponents/Picture.vue'
import MainTab from './_tabs/main.vue'
import PhotosTab from './_tabs/photos.vue'
import Tabs from '../../../src/runtime/components/base/Tabs.vue'
import BlogForm from '../../modals/blog/BlogForm.vue'

definePageMeta({
  middleware: ['auth']
})

const {
  $modal,
  $notification,
  $authFetch
} = useNuxtApp()

const {
  browserEl,
  item,

  onClickCreate,
  onClickEdit,
  onClickDelete,
  onItemUpdated
} = usePage()

const { initTabs } = useTabs()

const {
  tabs,
  selectedTabComponent,
  onChangeSelectedTab
} = initTabs([
  {
    title: 'Пост',
    component: MainTab
  },
  {
    title: 'Фото',
    component: PhotosTab
  }
])

const columns = shallowRef([
  {
    name: 'id',
    title: 'ID'
  },
  {
    name: 'date',
    title: 'Дата',
  },
  {
    name: 'cover',
    title: 'Заголовок',
    component: {
      component: Picture,
      title: 'name',
    }
  },
  {
    name: 'category',
    title: 'Рубрика',
    toFormat(item: IItem) {
      return item?.category?.name_ru
    }
  },
  {
    name: 'locale',
    title: 'Локаль',
    toFormat(item: IItem) {
      return item?.locale?.title
    }
  },
  {
    name: 'state',
    title: 'Статус',
    component: Badge,
    toFormat(item: IItem) {

      const mapper: Record<string, string> = {
        DRAFT: '--default',
        PUBLISHED: '--success'
      }

      return {
        title: item?.state?.title,
        class: mapper[item?.state?.id]
      }
    }
  },
  {
    name: 'created_at',
    title: 'Создан',
    preset: {
      name: 'timestampToFormatPreset'
    }
  },
])

const requestProperties = ref([
  'id',
  'date',
  'name',
  'category',
  'cover',
  'locale',
  'state',
  'created_at',
  'company_business_type',
  'job_title',
  'company_address',
  'company_index',
  'company_country',
  'company_city',
  'subscription_type'
])

const onChangeState = async () => {

  $modal.confirm({
    question: item.value!.state.id === 'DRAFT' ? 'Опубликовать?' : 'Снять с публикации?'
  }).then(async (isAgree: boolean) => {
    if (!isAgree) {
      return
    }

    const prefix = item.value!.state.id === 'DRAFT' ? 'publish' : 'withdraw'

    await $authFetch(`blog/posts/${prefix}`, {
      method: 'POST',
      body: {
        id: item.value!.id,
      },
    })

    $notification.push({type: 'success', message: 'Статус обновлен'})
    browserEl.value!.reset(true)
  })
}
</script>

<template>
  <Browser
      ref="browserEl"
      h1="Статьи блога"
      url-prefix="blog/posts/browse"
      detail-url-prefix="blog/posts/detail"

      detail-title-property="id"
      detail-subtitle-property="name"
      detail-page-url-prefix="blog"

      :columns="columns"
      :request-properties="requestProperties"

      @itemUpdated="onItemUpdated"
  >
    <template #rightSide>
      <div class="btn__group">
        <Button
            @click="onClickCreate({
              formURL: 'blog/posts/form',
              modalComponent: BlogForm,
              modalTitle: 'Создание статьи',
              notificationMessage: 'Статья добавлена',
              modalConfig: {
                isPreventClickOverlay: true
              }
            })"
            :class="['--small --primary']"
        >
          Добавить
        </Button>
      </div>
    </template>
    <template #browserDetailHeader>
      <div class="btn__group">
        <Button
            @click="onClickEdit({
              formURL: 'blog/posts/form',
              modalComponent: BlogForm,
              modalTitle: 'Редактирование статьи',
              notificationMessage: 'Статья изменена',
              modalConfig: {
                isPreventClickOverlay: true
              }
            })"
            :class="['--big --outline-primary']"
        >
          Изменить
        </Button>
        <Button
            @click="onClickDelete({
              deleteURL: 'blog/posts/delete',
              notificationMessage: 'Статья удалена'}
            )"
            :class="['--big --outline-danger']"
        >
          Удалить
        </Button>
      </div>
      <Button
          @click="onChangeState"
          :class="{
            'ml_10': true,
            '--big': true,
            '--outline-contrast-success': item?.state?.id === 'DRAFT',
            '--outline-contrast-default': item?.state?.id === 'PUBLISHED'
          }"
      >{{ item?.state && item.state.id === 'DRAFT' ? 'Опубликовать' : 'Снять с публикации' }}</Button>
      <Tabs @change="onChangeSelectedTab" :tabs="tabs"/>
    </template>
    <template #browserDetailContent>
      <component :is="selectedTabComponent" :item="item"/>
    </template>
  </Browser>
</template>
