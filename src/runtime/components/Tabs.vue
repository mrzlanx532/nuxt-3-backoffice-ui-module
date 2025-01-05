<script setup lang="ts">
import { type Component, type Ref, useTemplateRef, ref } from 'vue'

export interface ITabItem {
  title: string,
  component: Component,
  hasError?: boolean
}

const props = withDefaults(defineProps<{
  selectedItem?: number,
  tabs: ITabItem[]
}>(), {
  selectedItem: 0,
  hasError: false
})

const emit = defineEmits(['change'])

type TMouseUpListener = () => void
type TMouseMoveListener = (e: MouseEvent) => void

let mouseUpListener: null|TMouseUpListener = null
let mouseMoveListener: null|TMouseMoveListener = null

const localSelectedItem = ref(props.selectedItem)
const isDraggable = ref(false)
const currentScrolledLeft: Ref<number|null> = ref(null)
const screenXWhenMouseDown: Ref<number|null> = ref(null)
const tabsEl = useTemplateRef<HTMLElement>('tabsEl')

const documentPointerUpListener = (): void => {
  isDraggable.value = false
  screenXWhenMouseDown.value = null
  currentScrolledLeft.value = null

  document.removeEventListener('pointerup', mouseUpListener as TMouseUpListener)
  document.removeEventListener('pointermove', mouseMoveListener as TMouseMoveListener)

  mouseUpListener = null
  mouseMoveListener = null
}

const documentPointerMoveListener = (e: MouseEvent) => {
  if (!isDraggable.value) {
    return
  }

  tabsEl.value!.scrollTo(
      (screenXWhenMouseDown.value! + currentScrolledLeft.value!) - e.screenX,
      tabsEl.value!.offsetTop
  )
}

const onClick = (index: number) => {
  localSelectedItem.value = index

  emit('change', localSelectedItem.value)
}

const onMouseDown = (e: MouseEvent) => {
  isDraggable.value = true
  currentScrolledLeft.value = tabsEl.value!.scrollLeft
  screenXWhenMouseDown.value = e.screenX

  mouseUpListener = documentPointerUpListener.bind(document)
  mouseMoveListener = documentPointerMoveListener.bind(null)

  document.addEventListener('pointerup', mouseUpListener)
  document.addEventListener('pointermove', mouseMoveListener)
}
</script>

<template>
  <div
      class="tabs"
      ref="tabsEl"
      @mousedown="onMouseDown"
  >
    <div
        v-for="(tab, index) in tabs"
        class="tabs__item"
        :class="{
          'tabs__item_active': localSelectedItem === index,
          '--with-error': tab.hasError
        }"
        @click="onClick(index)"
    >
      {{ tab.title }}
    </div>
  </div>
</template>
