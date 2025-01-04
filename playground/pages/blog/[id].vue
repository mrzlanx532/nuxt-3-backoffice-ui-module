<script setup lang="ts">
import { useRoute, useNuxtApp } from '#imports';

import Detail from '../../../src/runtime/components/base/Detail.vue'
import Button from '../../../src/runtime/components/base/Button.vue'
import BlogForm from '../../modals/blog/BlogForm.vue'
import BrowserSmall from '../../../src/runtime/components/base/BrowserSmall/BrowserSmall.vue'
import BlogPhotoForm from '../../modals/blog/BlogPhotoForm.vue'
import Picture from '../../../src/runtime/components/base/Browser/ColumnComponents/Picture.vue'

const route = useRoute()

const {
  $modal,
  $notification,
  $authFetch
} = useNuxtApp()

const {
  item,

  onClickEdit,
  onClickDelete,

  SSRLoadDetail
} = usePage()

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
    window.location.reload()
  })
}

const sections = ref([
  {
    title: 'Общее',
    rows: [
      {
        title: 'id',
        name: 'id'
      },
      {
        title: 'Заголовок',
        name: 'name'
      },
      {
        title: 'Дата',
        name: 'date'
      },
      {
        title: 'Локаль',
        name: 'locale',
        toFormat(item: any) {
          return item.locale.title
        }
      },
      {
        title: 'Статус',
        name: 'state',
        toFormat(item: any) {
          return item.state.title
        }
      },
      {
        title: 'Категория',
        name: 'category',
        toFormat(item: any) {
          let string = item.category.name_ru

          if (item.category.name_en) {
            string = string + ' (' + item.category.name_en + ')'
          }

          return string
        }
      },
      {
        title: 'Кол-во просмотров',
        name: 'views_counter',
      },
      {
        title: 'Создано',
        name: 'created_at',
        preset: {
          name: 'timestampToFormatPreset'
        }
      },
      {
        title: 'Обновлено',
        name: 'updated_at',
        preset: {
          name: 'timestampToFormatPreset'
        }
      },
      {
        title: 'Ident',
        name: 'ident',
      },
      {
        title: 'cover',
        name: 'cover',
        component: {
          component: Picture,
          width: 200,
          'max-width': 200,
          height: 'auto'
        }
      },
    ]
  }, {
    title: 'Контент',
    rows: [
      {
        title: 'Контент (короткий)',
        name: 'content_short'
      },
      {
        title: 'Контент',
        name: 'content',
        isRaw: true
      },
    ]
  }
])

const filters = ref({
  'blog_post_id': [route.params.id]
})

const onClickCreate = async () => {
  const formResponse = await $authFetch('blog/posts/contents/form', {
    method: 'GET',
  })

  $modal.load(BlogPhotoForm, {
    title: 'Добавить фото',
    formResponse,
    blogPostId: route.params.id
  }).then(() => {
    browserEl.value!.reset()
    $notification.push({type: 'success', message: 'Фото добавлено'})
  })
}

const columns = shallowRef([
  {
    name: 'id',
    title: 'ID'
  },
  {
    name: 'name',
    title: 'Название',
  },
  {
    name: 'picture',
    title: 'Картинка',
    component: {
      component: Picture,
      title: 'name',
    }
  },
  {
    name: 'created_at',
    title: 'Создано',
    preset: {name: 'timestampToFormatPreset'},
  },
])

await SSRLoadDetail(item, 'blog/posts/detail', route.params.id)
</script>

<template>
  <Detail
      entity-name="Статья блога"
      back-link="/blog"
      :item="item!"
      :sections="sections"
  >
    <template #actions>
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
            :class="['--small --outline-primary']"
        >
          Изменить
        </Button>
        <Button
            @click="onClickDelete({
              deleteURL: 'blog/posts/delete',
              notificationMessage: 'Статья удалена'}
            )"
            :class="['--small --outline-danger']"
        >
          Удалить
        </Button>
      </div>
      <Button
          @click="onChangeState"
          :class="{
            'ml_10': true,
            '--small': true,
            '--outline-contrast-success': item?.state?.id === 'DRAFT',
            '--outline-contrast-default': item?.state?.id === 'PUBLISHED'
          }"
      >{{ item?.state && item.state.id === 'DRAFT' ? 'Опубликовать' : 'Снять с публикации' }}</Button>
    </template>

    <template #more>
      <div class="clouds__cloud --has-browser">
        <BrowserSmall
            ref="browserEl"
            h1="Фото"
            urlPrefix="blog/posts/contents/browse"
            :filters="filters"
            :columns="columns"
        >
          <template #actions>
            <Button class="--small --success" @click="onClickCreate">Добавить</Button>
          </template>
        </BrowserSmall>
      </div>
    </template>
  </Detail>
</template>
