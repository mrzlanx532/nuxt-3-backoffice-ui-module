<script setup lang="ts">
import { defineComponent, h, withDirectives } from 'vue'
import { vMaska } from 'maska'

const emit = defineEmits(['update:modelValue'])

interface IComponentData {
  isMultiple: boolean,
  isForceInverse?: boolean
  isFilterable?: boolean,
  isRemovable?: boolean,
  type?: 'text' | 'password' | 'number',
  disabled?: boolean,
  mask?: string,
  description?: string
}

const props = defineProps<{
  label: string,
  name: string,
  modelValue?: string | number,
  errors?: string[],
  componentData: IComponentData
}>()

const onInput = (e) => {
  emit('update:modelValue', e.target.value === '' ? null : e.target.value)
}

const InputComponent = defineComponent(
  (_props) => {
    return () => {

      const inputProps = {
        class: 'input',
        name: props.name,
        spellcheck: 'false',
        type: props.componentData?.type || 'text',
        autocomplete: 'off',
        value: props.modelValue,
        label: props.label,
        onInput: onInput,
      }

      if (props.componentData?.disabled) {
        inputProps.disabled = true
      }

      const directives = []

      if (props.componentData?.mask) {
        inputProps['data-maska'] = props.componentData.mask
        directives.push([vMaska])
      }

      const input = h('input', inputProps)

      return withDirectives(input, directives)
    }
  }
)
</script>

<template>
  <div>
    <label class="label">{{ props.label }}</label>
    <div class="input__container" :class="{'input__container_error': props.errors && props.errors[0]}">
      <InputComponent />
    </div>
    <div v-if="props.componentData?.description" class="input__description">
      {{ props.componentData.description }}
    </div>
    <div class="input__error">{{ props.errors && props.errors[0] ? props.errors[0] : null }}</div>
  </div>
</template>
