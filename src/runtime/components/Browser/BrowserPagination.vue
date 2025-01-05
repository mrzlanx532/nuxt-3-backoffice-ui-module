<script setup lang="ts">
import  { type Component, type Ref, nextTick } from 'vue'

const emit = defineEmits(['changePage'])

const props = withDefaults(defineProps<{
  total: number,
  page?: number,
  perPage: number
}>(), {
  page: 1
})

const paginatorInputEl: Ref<Component|null> = ref(null)
const isSelecting = ref(false)
const value = ref('')

const totalPages = computed(() => {
  /* @ts-ignore */
  let int = parseInt(props.total / props.perPage)

  if (int === 0) {
    return 1
  }

  return int + (props.total % props.perPage > 0 ? 1 : 0)
})

const leftArrowsIsDisabled = computed(() => {
  return props.page === 1;
})

const rightArrowsIsDisabled = computed(() => {
  return props.page === totalPages.value;
})

const leftDoubleArrowClick = () => {
  emit('changePage', 1)
}
const leftSingleArrowClick = () => {
  if (props.page === 1) {
    return
  }

  emit('changePage', props.page - 1)
}

const rightSingleArrowClick = () => {
  if (props.page === totalPages.value) {
    return
  }

  emit('changePage', props.page + 1)
}

const rightDoubleArrowClick = () => {
  emit('changePage', totalPages.value)
}

const onClickPaginatorInputLabel = () => {
  isSelecting.value = true

  nextTick(() => {
    /* @ts-ignore */
    paginatorInputEl.value.focus()
  })
}

const onKeypress = (e: KeyboardEvent) => {
  if (e.key.match(/[0-9]+/) === null)  {
    e.preventDefault()
  }
}

const onKeyUp = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {

    /* @ts-ignore */
    if (e.target!.value === '') {
      isSelecting.value = false
      return
    }

    /* @ts-ignore */
    let value = parseInt(e.target.value)

    if (value > totalPages.value) {
      value = totalPages.value
    }

    if (value === 0) {
      value = 1
    }

    emit('changePage', value)
    isSelecting.value = false
  }
}
</script>

<template>
  <div class="browser__paginator">
    <div
        class="browser__paginator-arrow-container browser__paginator-arrow-container_left-double"
        :class="{'browser__paginator-arrow-container_disabled': leftArrowsIsDisabled}"
        @click="leftDoubleArrowClick"
    >
      <svg height="15px">
        <use xlink:href="/img/sprite.svg#left_double_arrow"></use>
      </svg>
    </div>
    <div
        class="browser__paginator-arrow-container browser__paginator-arrow-container_left-single"
        :class="{'browser__paginator-arrow-container_disabled': leftArrowsIsDisabled}"
        @click="leftSingleArrowClick"
    >
      <svg height="15px">
        <use xlink:href="/img/sprite.svg#left_single_arrow"></use>
      </svg>
    </div>
    <div>
      <input
          spellcheck="false"
          ref="paginatorInputEl"
          :value="value"
          @keyup="onKeyUp"
          @keypress="onKeypress"
          v-if="isSelecting"
          class="browser__paginator-input"
          type="text"
          @blur="isSelecting = false"
      >
      <div v-else @click="onClickPaginatorInputLabel"  class="browser__paginator-input-label">стр. {{ page }} из {{ totalPages }}</div>
    </div>
    <div
        class="browser__paginator-arrow-container browser__paginator-arrow-container_right-single"
        :class="{'browser__paginator-arrow-container_disabled': rightArrowsIsDisabled}"
        @click="rightSingleArrowClick"
    >
      <svg height="15px">
        <use xlink:href="/img/sprite.svg#right_single_arrow"></use>
      </svg>
    </div>
    <div
        class="browser__paginator-arrow-container browser__paginator-arrow-container_right-double"
        :class="{'browser__paginator-arrow-container_disabled': rightArrowsIsDisabled}"
        @click="rightDoubleArrowClick"
    >
      <svg height="15px">
        <use xlink:href="/img/sprite.svg#right_double_arrow"></use>
      </svg>
    </div>
  </div>
</template>