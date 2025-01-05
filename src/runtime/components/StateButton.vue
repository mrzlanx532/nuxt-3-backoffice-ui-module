<script setup lang="ts">
const props = withDefaults(defineProps<{
  options: [],
  url?: string,
  selectedOption: {},
  updateParamName?: string
  dataId?: number
}>(), {
  updateParamName: 'state_id'
})

const emit = defineEmits(['change'])

const isOpen = ref(false)
const selectedOptionLocal = ref(props.selectedOption)
const loadingMessage = ref('&nbsp;')
const setIntervalInstance = ref(null)

watch(
    () => props.selectedOption,
    (selectedOption) => {
      if (
          Object.keys(selectedOptionLocal.value).length === 0 ||
          Object.keys(selectedOption.value).length === 0
      ) {

        selectedOptionLocal.value = selectedOption

        clearInterval(setIntervalInstance.value)

        setIntervalInstance.value = null

        return
      }

      selectedOptionLocal.value = selectedOption

      this.$authFetch(props.url, {
        method: 'POST',
        body: {
          id: dataId.value,
          [props.updateParamName]: selectedOptionLocal.value.id
        }
      })
    }
)

const onOptionClick = async (option) => {
  if (props.selectedOption.value.id === option.id) {
    isOpen.value = false
    return
  }

  emit('change', option);
  isOpen.value = false
}

const onBlur = () => {
  isOpen.value = false
}

onMounted(() => {
  setIntervalInstance.value = setInterval(() => {
    loadingMessage.value = loadingMessage.value === '&nbsp;...' || loadingMessage.value === '...' ? '.' : loadingMessage.value + '.'
  }, 100)
})
</script>

<template>
  <div class="btn-state__container">
    <button
        v-if="Object.keys(selectedOption).length > 0"
        type="button"
        class="btn-state"
        @click="isOpen = !isOpen"
        tabindex="0"
        @blur="onBlur"
        :class="[
            {'btn-state__open': isOpen},
            {'--default': selectedOptionLocal.class === '--default'},
            {'--primary': selectedOptionLocal.class === '--primary'},
            {'--success': selectedOptionLocal.class === '--success'},
            {'--warning': selectedOptionLocal.class === '--warning'},
            {'--danger': selectedOptionLocal.class === '--danger'},
        ]"
    >
      {{ selectedOptionLocal.title }}
    </button>
    <button
        v-else
        class="btn-state --default"
        v-html="loadingMessage"
    />
    <div class="btn-state__dropdown" :class="{'btn-state__dropdown_open': isOpen}">
      <div
          v-for="option in options"
          class="btn-state__dropdown-option"
          @mousedown="onOptionClick(option)"
      >{{ option.title }}</div>
    </div>
  </div>
</template>