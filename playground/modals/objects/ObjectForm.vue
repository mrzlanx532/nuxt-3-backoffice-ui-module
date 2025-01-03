<script setup lang="ts">
import { onMounted } from 'vue'
import type { defaultProps } from '~/composables/useForm'

const props = defineProps<defaultProps>()

const emit = defineEmits([
  'modal:resolve',
  'modal:close'
])

const {
  initForm,

  fillComponents,

  checkbox,
  select,
  selectWrap,
  input,
  datetime,
  date,
  inputFile,
  textArea,
  editor,
  switcher
} = useForm()

const {
  formData,
  formDataValues,
  errors,
  getFormComponent
} = initForm(
    'pencils/create',
    'pencils/update',
    [

      date({
        name: 'example_date',
        label: 'Date',
        class: '--full'
      }),
      datetime({
        name: 'example_datetime',
        label: 'Date',
        class: '--full'
      }),
      editor({
        name: 'example_editor',
        label: 'Editor',
        class: '--full'
      }),
      input({
        name: 'example_input',
        label: 'Input',
        class: '--full',
      }),
      inputFile({
        name: 'example_input_file',
        label: 'Input',
        class: '--full',
      }),
      select({
        name: 'example_select',
        label: 'Select',
        class: '--full',
        componentData: {
          isRemovable: true
        }
      }),
      selectWrap({
        name: 'example_select_wrap',
        label: 'SelectWrap',
        class: '--full',
      }),
      switcher({
        name: 'example_switcher',
        label: 'Switcher',
        class: '--full',
      }),
      textArea({
        name: 'example_textarea',
        label: 'Textarea',
        class: '--full'
      }),
      checkbox({
        name: 'example_checkbox',
        label: 'Checkbox',
        class: '--full',
      }),
    ])

const FormComponent = getFormComponent(emit, props, formData, errors)

onMounted(async () => {

  fillComponents(props, formData, formDataValues, {
    example_select: {
      to: 'example_select',
      fn: (value) => {
        return {
          id: value.id,
          title: value.title
        }
      }
    },
    example_select_wrap: {
      to: 'example_select_wrap',
      fn: (value) => {
        return {
          id: value.id,
          title: value.title
        }
      }
    }
  })
})
</script>
<template>
  <FormComponent/>
</template>