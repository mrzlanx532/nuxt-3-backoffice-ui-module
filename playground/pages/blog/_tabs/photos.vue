<script setup lang="ts">
import { useNuxtApp } from '#imports'
import { useTemplateRef } from 'vue'
import BrowserSmall from '../../../../src/runtime/components/base/BrowserSmall/BrowserSmall.vue'
import Button from '../../../../src/runtime/components/base/Button.vue'
import BlogPhotosTr from '../../../components/CustomTr/BlogPhotosTr.vue'
import BlogPhotoForm from '../../../modals/blog/BlogPhotoForm.vue'

const props = defineProps<{
  item?: IItem,
}>()

const {
  $modal,
  $notification,
  $authFetch
} = useNuxtApp()

const browserEl = useTemplateRef<HTMLElement & { reset: () => void }>('browserEl')

const filters = ref({
  'blog_post_id': [props.item!.id]
})

watch(
    () => props.item,
    (value) => {
      filters.value = {
        'blog_post_id': [value!.id]
      }
    }
)

const onClickCreate = async () => {
  const formResponse = await $authFetch('blog/posts/contents/form', {
    method: 'GET',
  })

  $modal.load(BlogPhotoForm, {
    title: 'Добавить фото',
    formResponse,
    blogPostId: props.item!.id
  }).then(() => {
    browserEl.value!.reset()
    $notification.push({type: 'success', message: 'Фото добавлено'})
  })
}
</script>

<template>
  <BrowserSmall
      ref="browserEl"
      h1="Фото"
      urlPrefix="blog/posts/contents/browse"
      :filters="filters"
      :customTr="BlogPhotosTr"
      :is-enabled-t-head="false"
  >
    <template #actions>
      <Button class="--small --success" @click="onClickCreate">Добавить</Button>
    </template>
  </BrowserSmall>
</template>
