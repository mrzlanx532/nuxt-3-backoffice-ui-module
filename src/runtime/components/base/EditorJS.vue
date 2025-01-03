<script setup lang="ts">
const props = defineProps<{
  data: OutputData | undefined
}>()
const emit = defineEmits(['change'])

import EditorJS, {type OutputData} from '@editorjs/editorjs'

const editorEl = useTemplateRef<HTMLDivElement>('editorEl')

let editor = null

onMounted(() => {
  editor = new EditorJS({
    holder: editorEl.value!,
    placeholder: 'Let`s write an awesome story!',
    minHeight: 50,
    onChange(api) {
      api.saver.save().then(data => {
        emit('change', data)
      })
    },
    data: props.data
  })
})

onUnmounted(() => {
  editor.destroy()
})


</script>

<template>
  <div ref="editorEl"/>
</template>