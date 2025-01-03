<script setup lang="ts">
import { h, nextTick, useTemplateRef } from 'vue'
import { defineComponent } from '#imports'

export interface IDropdownItem {
  title: string,
  class: string,
  onClick?: () => void
}

const props = defineProps<{
  items: IDropdownItem[],
}>()

const btnDropdownEl = useTemplateRef<HTMLElement>('btnDropdownEl')
const dropdownEl = useTemplateRef<HTMLElement>('dropdownEl')

const isOpen = ref(false)
const top = ref(0)
const left = ref(0)

const updateDimensions = () => {

  const rect = btnDropdownEl.value!.getBoundingClientRect()

  top.value = document.documentElement.scrollTop + rect.top + rect.height + 5

  return rect
}

const onClick = () => {

  const rect = updateDimensions()

  isOpen.value = true

  document.addEventListener('scroll', updateDimensions)
  document.querySelectorAll('.scrollable__content').forEach((scrollableContainer) => {
    scrollableContainer.addEventListener('scroll', updateDimensions)
  })

  nextTick(() => {
    if ((rect.right + dropdownEl.value!.clientWidth) > document.documentElement.clientWidth) {
      left.value = rect.right - dropdownEl.value!.clientWidth
      return
    }

    left.value = rect.right - (dropdownEl.value!.clientWidth / 2)
  })
}

const setIsOpenAsFalse = () => {
  isOpen.value = false

  document.removeEventListener('scroll', updateDimensions)
  document.querySelectorAll('.scrollable__content').forEach((scrollableContainer) => {
    scrollableContainer.removeEventListener('scroll', updateDimensions)
  })
}

const BtnDropdownItemComponent = defineComponent(
    (props, expose) => {
      return () => {
        return h('div', {
          class: 'btn-dropdown__item',
          onClick: [props.item.onClick, setIsOpenAsFalse]
        }, {
          default: () => {
            if (expose.slots.default) {
              return expose.slots.default()
            }
          }
        })
      }
    }, {
      props: {
        item: Object
      }
    }
)

const listener = (e: Event) => e.preventDefault()

const onMouseOver = () => {
  window.addEventListener('selectstart', listener)
}

const onMouseOut = () => {
  window.removeEventListener('selectstart', listener)
}
</script>

<template>
  <div
      v-bind="$attrs"
      ref="btnDropdownEl"
      class="btn-dropdown"
      :class="{'--is-open': isOpen}"
      @click="onClick"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
  >
    <svg>
      <use xlink:href="/img/temp_sprite.svg#more"/>
    </svg>
  </div>
  <teleport to="body">
    <div
        ref="dropdownEl"
        v-if="isOpen"
        class="btn-dropdown__container"
        :style="{top: top + 'px', left: left + 'px'}"
        v-click-outside="setIsOpenAsFalse"
    >
      <BtnDropdownItemComponent v-for="item in props.items" :class="item.class" :item="item">
        {{ item.title }}
      </BtnDropdownItemComponent>
    </div>
  </teleport>
</template>
