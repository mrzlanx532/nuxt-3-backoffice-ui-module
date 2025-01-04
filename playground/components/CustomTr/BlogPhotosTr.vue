<script setup lang="ts">
import { useNuxtApp } from '#imports'
import ButtonDropdown from '../../../src/runtime/components/base/ButtonDropdown.vue'
import BlogPhotoForm from '../../modals/blog/BlogPhotoForm.vue'

type IItem = Record<string, any>

const {
  $authFetch,
  $modal,
  $notification
} = useNuxtApp()

const props = defineProps<{
  item: IItem,
  browserSmallEl: {
    exposed: {
      reset: () => void
    }
  }
}>()

const onClickEdit = async () => {
  const formResponse = await $authFetch('blog/posts/contents/form', {
    method: 'GET',
    params: {
      id: props.item.id,
    },
  })

  $modal.load(BlogPhotoForm, {
    title: 'Изменить фото',
    id: props.item.id,
    formResponse,
    blogPostId: props.item!.blog_post_id,
  }).then(() => {
    props.browserSmallEl.exposed.reset()
    $notification.push({type: 'success', message: 'Фото изменено'})
  })
}

const onClickDelete = async () => {
  $modal.confirm().then(async (isAgree: boolean) => {
    if (!isAgree) {
      return
    }

    await $authFetch('blog/posts/contents/delete', {
      method: 'POST',
      body: {
        id: props.item.id,
      },
    })

    props.browserSmallEl.exposed.reset()
    $notification.push({type: 'success', message: 'Фото удалено'})
  })
}

const buttonDropdownItems = [
  {title: 'Изменить', class: '--primary', onClick: onClickEdit},
  {title: 'Удалить', class: '--danger', onClick: onClickDelete},
]
</script>

<template>
  <tr class="--disable-cursor">
    <td>
      <div class="img__container">
        <img :src="props.item.picture.original" alt="picture">
        <p>{{ props.item.name }}</p>
      </div>
    </td>
    <td class="--min-width">
      <ButtonDropdown :items="buttonDropdownItems"/>
    </td>
  </tr>
</template>

<style scoped>
.img__container {
  width: 250px;
}

p {
  text-align: center;
  color: grey;
}

img {
  width: 100%;
  border-radius: 5px;
}

svg {
  width: 20px;
  height: 20px;
  color: grey;
  cursor: pointer;
}

svg:hover {
  color: orange;
}
</style>
