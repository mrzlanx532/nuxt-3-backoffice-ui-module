<script setup lang="ts">
import { onMounted } from 'vue'
import { type defaultProps, useForm } from '../../../src/runtime/composables/useForm'

const props = defineProps<defaultProps>()

const emit = defineEmits([
    'modal:resolve',
    'modal:close'
])

const {
  initForm,

  fillComponents,

  select,
  input,
  datetime,
  //date,
  inputFile,
  textArea,
  editor
} = useForm()

const {
  formData,
  formDataValues,
  errors,
  getFormComponent
} = initForm(
    'blog/posts/create',
    'blog/posts/update',
    [
  /*date({
    name: 'created_at_from_front',
    label: 'created at from front',
    class: '--full',
  }),*/
  select({
    name: 'locale_id',
    label: 'Язык публикации',
    class: '--full'
  }),
  select({
    name: 'category_id',
    label: 'Категории',
    class: '--full'
  }),
  input({
    name: 'name',
    label: 'Заголовок',
    class: '--full',
  }),
  datetime({
    name: 'date',
    label: 'Дата',
    class: '--full',
  }),
  inputFile({
    name: 'cover',
    label: 'Изображение',
    class: '--full',
  }),
  textArea({
    name: 'content_short',
    label: 'Краткое содержание',
    class: '--full'
  }),
  editor({
    name: 'content',
    label: 'Содержание',
    class: '--full'
  }),
])

const FormComponent = getFormComponent(emit, props, formData, errors)

onMounted(async () => {

  fillComponents(props, formData, formDataValues, {
    locales: {
      to: 'locale_id',
      fn: (locale) => {
        return {
          id: locale.id,
          title: locale.title
        }
      }
    },
    categories: {
      to: 'category_id',
      fn: (category) => {
        return {
          id: category.id,
          title: `${category.name_en} (${category.name_ru})`
        }
      }
    }
  })
})
</script>
<template>
  <FormComponent/>
</template>
