<script setup lang="ts">
import 'moment/dist/locale/ru'
import DatetimePicker from '@/components/Base/Datepicker/DatetimePicker.vue'
import type { IPayload } from '@/components/Base/Datepicker/types'

const emit = defineEmits(['update:modelValue'])

interface IComponentData {
  forceInverse?: boolean,
  format?: string,
  disabled?: boolean,
  toUTC?: boolean
}

const props = defineProps<{
  label: string,
  name: string,
  modelValue?: number|string,
  errors?: string[],
  componentData?: IComponentData,
}>()

const onUpdateModelValue = (payload: IPayload) => {
  emit('update:modelValue', payload.value)
}
</script>

<template>
  <div>
    <div class="label">{{ label }}</div>
    <DatetimePicker
        :model-value="props.modelValue"
        @update:model-value="onUpdateModelValue"
        :force-inverse="props?.componentData?.forceInverse"
        :format="props?.componentData?.format"
        :disabled="props?.componentData?.disabled"
        :to-u-t-c="props?.componentData?.toUTC"
        :errors="errors"
    />
    <div class="input__error">{{ errors && errors[0] ? errors[0] : null }}</div>
  </div>
</template>