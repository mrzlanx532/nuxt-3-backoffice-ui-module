<script setup lang="ts">
import { nextTick } from 'vue'

const emit = defineEmits(['update:modelValue'])

const textareaEl: Ref<HTMLElement|null> = ref(null)

const internalValue = ref()

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

const setLocalValues = (value: any) => {
  internalValue.value = value

  nextTick(() => {
    triggerAutosize()
  })
}

watch(
    () => props.modelValue,
    (value) => {
      setLocalValues(value)
    },
    {
      immediate: true
    }
)

const triggerAutosize = () => {
  textareaEl.value!.style.height = "50px";
  textareaEl.value!.style.height = textareaEl.value!.scrollHeight + 2 + "px";
}

const onInput = () => {
  triggerAutosize()
  emit('update:modelValue', internalValue.value === '' ? null : internalValue.value)
}
</script>

<template>
  <div>
    <label class="label">{{ props.label }}</label>
    <textarea spellcheck="false" class="textarea" @input="onInput" ref="textareaEl" v-model="internalValue"/>
    <div class="input__error">{{ props.errors && props.errors[0] ? props.errors[0] : null }}</div>
  </div>
</template>
