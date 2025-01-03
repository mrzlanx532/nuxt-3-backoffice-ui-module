<script setup lang="ts">
import WangEditor from '~/components/WangEditor.vue'
import type { OutputData } from '@editorjs/editorjs'

const emit = defineEmits(['update:modelValue'])

const model = defineModel<string | undefined>()

const editorEl = useTemplateRef<HTMLElement>('editorEl')

const props = defineProps({
  label: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  modelValue: {
    required: false,
    type: [Number, String, Array]
  },
  errors: {
    type: Array,
    required: false,
    default: []
  },
  componentData: {
    type: Object,
    required: false
  }
})

const onChange = (data: OutputData) => {
  emit('update:modelValue', JSON.stringify(data))
}
</script>

<template>
  <div>
    <label class="label">{{ props.label }}</label>
    <ClientOnly>
      <WangEditor v-model="model" class="mt_10" @change="onChange"/>
    </ClientOnly>
    <div class="input__error">{{ props.errors && props.errors[0] ? props.errors[0] : null }}</div>
  </div>
</template>