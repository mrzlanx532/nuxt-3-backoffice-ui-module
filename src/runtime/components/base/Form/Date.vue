<script setup lang="ts">
import 'moment/dist/locale/ru'
import DatePicker from '@/components/Base/Datepicker/DatePicker.vue'
import type { IPayload } from '@/components/Base/Datepicker/types'

const emit = defineEmits(['update:modelValue'])

interface IComponentData {
  forceInverse?: boolean,
  format?: string,
  disabled?: boolean
}

const props = defineProps<{
  label: string,
  name: string,
  modelValue?: number|string,
  errors?: string[],
  componentData?: IComponentData
}>()

const onUpdateModelValue = (payload: IPayload) => {
  emit('update:modelValue', payload.value)
}
</script>

<template>
  <div>
    <div class="label">{{ label }}</div>
    <DatePicker
        :modelValue="props.modelValue"
        @update:modelValue="onUpdateModelValue"
        :force-inverse="props?.componentData?.forceInverse"
        :format="props?.componentData?.format"
        :disabled="props?.componentData?.disabled"
        :errors="errors"
    />
    <div class="input__error">{{ errors && errors[0] ? errors[0] : null }}</div>
  </div>
</template>