<script setup lang="ts">
import Form from '../../../src/runtime/components/base/Form.vue'
import { useForm } from '../../../src/runtime/composables/useForm'
import { FetchError } from 'ofetch'

const props = defineProps<{
  data: {
    formResponse: {
      entity?: { [key: string]: any }
      [key: string]: any,
    },
    title: string,
    id: number,
    blogPostId: number
  }
}>()

const emit = defineEmits([
  'modal:resolve',
  'modal:close'
])

const {
  $authFetch
} = useNuxtApp()

const {
  initForm,

  fillComponents,

  formRequestBody,

  input,
  inputFile,
} = useForm()

const {
  formData,
  formDataValues,
  errors,
} = initForm(
    'blog/posts/contents/create',
    'blog/posts/contents/update', [
      input({
        name: 'name',
        label: 'Название',
        class: '--full'
      }),
      inputFile({
        name: 'picture',
        label: 'Фото',
        class: '--full',
        componentData: {
          allowedTypes: ['jpg, png', 'jpeg']
        }
      })
    ])

const onClickSave = async () => {

  formDataValues.blog_post_id = props.data.blogPostId

  let requestBody = formRequestBody(formDataValues, props.data.id)

  const method = props.data.id ? 'update' : 'create'

  try {

    await $authFetch(`blog/posts/contents/${method}`, {
      method: 'POST',
      body: requestBody,
    })

    emit('modal:resolve')

  } catch (err) {
    if (err instanceof FetchError) {
      if (err.status === 422 && err.data.errors) {
        errors.value = err.data.errors
      }
    }
  }
}

onMounted(() => {
  fillComponents(props, formData, formDataValues)
})
</script>

<template>
  <Form
      :title=data.title
      @close="$emit('modal:close')"
  >
    <template #content>
      <div class="grid --2x2">
        <component
            v-for="formDataItem in formData"
            :componentData="formDataItem?.componentData"
            :class="formDataItem.class"
            :label="formDataItem.label"
            :name="formDataItem.name"
            :is="formDataItem.component"
            v-model="formDataValues[formDataItem.name]"
            :errors="errors[formDataItem.name]"
        />
      </div>
    </template>
    <template #footer>
      <div class="btn__group">
        <button class="btn --primary --big" @click.prevent="onClickSave">Сохранить</button>
        <button class="btn --outline-primary --big" @click="emit('modal:close')">Отмена</button>
      </div>
    </template>
  </Form>
</template>
