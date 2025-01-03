<script setup lang="ts">
import type { Ref } from 'vue'

const props = defineProps<{
  options: number[],
  selectedValue: number
}>()

const localSelectedValue: Ref<number | null> = ref(null)
const isSelecting = ref(false)

watch(
    () => props.selectedValue,
    (value) => {
      localSelectedValue.value = value
    }
)

const emit = defineEmits(['change'])

const onClickSelectedValue = () => {
  isSelecting.value = !isSelecting.value
}

const onMouseDownOnDropdownOption = (option: number) => {

  localSelectedValue.value = option
  isSelecting.value = false

  emit('change', localSelectedValue.value)
}

const onClickOutside = () => {
  isSelecting.value = false
}

onMounted(() => {
  localSelectedValue.value = props.selectedValue;
})
</script>

<template>
  <div class="browser__pagination-count select">
    <div class="select__label">Показывать по</div>
    <div class="select__container" tabindex="0" v-click-outside="onClickOutside">
      <div
          class="select__selected-container"
          :class="{'select__selected-container_open': isSelecting}"
          @click="onClickSelectedValue"
      >
        <div class="select__active-select">{{ localSelectedValue }}</div>
        <div
            class="select__dropdown-icon-container"
            :class="{'select__dropdown-icon-container_open': isSelecting}"
        ></div>
      </div>
      <div v-if="isSelecting" class="select__dropdown-container">
        <div class="select__dropdown">
          <div
              class="select__dropdown-option"
              v-for="option in options"
              @mousedown="onMouseDownOnDropdownOption(option)"
          >{{ option }}</div>
        </div>
      </div>
    </div>
  </div>
</template>