<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef } from 'vue'
/* @ts-ignore */
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'

i18nChangeLanguage('ru')

const props = defineProps<{
  modelValue?: string,
}>()

const emit = defineEmits(['update:modelValue'])

const editorRef = shallowRef()

const valueHtml = ref(props.modelValue)

watch(
    () => props.modelValue,
    (value) => {
      if (value === null) {
        valueHtml.value = undefined

        return
      }

      valueHtml.value = value
    },
    { once: true }
)

const toolbarKeys = [
  'headerSelect',
  {
    key: 'group-more-style',
    title: 'Стиль',
    menuKeys: [
      'bold',
      'italic',
      'through',
      'underline',
      'code',
      'clearStyle'
    ]
  },
  '|',
  {
    key: 'group-more-alignment',
    title: 'Align',
    iconSvg: '<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>',
    menuKeys: [
      'justifyLeft',
      'justifyRight',
      'justifyCenter',
      'justifyJustify',
    ]
  },
  'insertTable',
  {
    key: 'group-more-list',
    title: 'Список',
    menuKeys: [
      'numberedList',
      'bulletedList'
    ]
  },
  {
    key: 'group-more-more',
    title: 'Еще',
    menuKeys: [
      'insertImage',
      'insertVideo',
      'todo',
      'blockquote',
      'insertLink',
      'divider',
      'codeBlock',
    ]
  },
    'undo',
    'redo'
]

const toolbarConfig = {
  toolbarKeys
}
const editorConfig = {
  autoFocus: false,
  toolbarKeys
}

onBeforeUnmount(() => {
  const editor = editorRef.value

  if (editor == null) {
    return
  }

  editor.destroy()
})

// @ts-ignore
const handleCreated = (editor) => {
  editorRef.value = editor
}

// @ts-ignore
const handleChange = (editor) => {
  emit('update:modelValue', editor.isEmpty() ? null : editor.getHtml())
}

// @ts-ignore
const onCustomPaste = (editor, event) => {
  editor.insertText(event.clipboardData.getData('text/plain'))
  event.preventDefault()
}
</script>

<template>
  <div class="wangeditor-container">
    <Toolbar
        style="border-bottom: 1px solid #dbdbdb;"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="'default'"
    />
    <Editor
        style="height: auto; min-height: 300px; background: #fff; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="'default'"
        @onCreated="handleCreated"
        @onChange="handleChange"
        @customPaste="onCustomPaste"
    />
  </div>
</template>

<style>
.wangeditor-container {
  border: 1px solid #dbdbdb;
  border-radius: 5px;

  >div:nth-child(1) {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .w-e-bar {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }

  .w-e-text-container {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .w-e-text-container [data-slate-editor] {
    padding: 0 12px;
  }

  .w-e-scroll {
    min-height: 300px;
  }
}
</style>