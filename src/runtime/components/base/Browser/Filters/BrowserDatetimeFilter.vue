<script setup lang="ts">
import type { Ref } from 'vue'
import type { IPayload, IPayloadMultiple } from '~/components/Base/Datepicker/types'
import type { IFilter, IFilterConfig } from '~/components/Base/Browser/Browser.vue'
import DatetimePicker from '../../Datepicker/DatetimePicker.vue'
import 'moment/dist/locale/ru'
import moment from 'moment'

moment.locale('ru')

const emit = defineEmits(['update:modelValue'])

type IValue = number | string | undefined | null

interface IDatetimeFilterConfig extends IFilterConfig {
  is_timestamp: boolean;
}

export interface IDatetimeFilter extends IFilter {
  config: IDatetimeFilterConfig;
}

const props = defineProps<{
  modelValue?: [number|string]|[(number|string),(number|string)],
  filter: IDatetimeFilter
}>()

const localValue: Ref<IValue> = ref(undefined)
const localValues: Ref<[IValue,IValue]> = ref([undefined, undefined])

watch(
    () => props.modelValue,
    (value) => {

      if (props.filter.config.range) {

        if (value === undefined) {
          localValues.value = [undefined, undefined]
        }

        if (Array.isArray(value)) {
          localValues.value = [
            value[0] === '' ? undefined : value[0],
            value[1] === '' ? undefined : value[1],
          ]
        }

        return
      }

      if (value === undefined) {
        localValue.value = undefined
        return
      }

      if (Array.isArray(value)) {
        localValue.value = value[0]
      }
    },
    {
      immediate: true
    }
)

const onFilterValueChangedMultiple = (payload: IPayloadMultiple) => {

  let preparedValue: ([IValue,IValue] | undefined) = ['', '']
  preparedValue[0] = localValues.value[0]
  preparedValue[1] = localValues.value[1]

  if (props.filter.config.is_timestamp) {
    preparedValue[payload.rangeIndex] = payload.value ? Number(payload.value) : payload.value
  } else {
    preparedValue[payload.rangeIndex] = payload.value
  }

  if ((preparedValue[0] === undefined || preparedValue[0] === null) && preparedValue[1]) {
    preparedValue[0] = ''
  } else if ((preparedValue[1] === undefined || preparedValue[1] === null) && preparedValue[0]) {
    preparedValue[1] = ''
  } else if (
      (preparedValue[0] === undefined || preparedValue[0] === null) &&
      (preparedValue[1] === undefined || preparedValue[1] === null)) {
    preparedValue = undefined
  }

  emit('update:modelValue', props.filter.type, props.filter.id, preparedValue)
}

const onFilterValueChanged = (payload: IPayload) => {

  if (payload.value === null) {
    emit('update:modelValue', props.filter.type, props.filter.id, undefined)
    return
  }

  if (props.filter.config.is_timestamp) {
    emit('update:modelValue', props.filter.type, props.filter.id, payload.value ? [Number(payload.value)] : payload.value)
    return
  }

  emit('update:modelValue', props.filter.type, props.filter.id, payload.value ? [payload.value] : payload.value)
}
</script>
<template>
  <div class="browser__filter">
    <div :for="filter.id" class="browser__filter-name">{{ filter.title }}</div>
    <div class="browser__filter-container date">
      <template v-if="filter.config.range">
        <DatetimePicker
            @update:modelValue="onFilterValueChangedMultiple"
            :model-value="localValues[0]"
            :filter="filter"
            :range-index="0"
            :format="props.filter.config.is_timestamp ? 'X' : 'DD.MM.yyyy HH:mm'"
        />
        <DatetimePicker
            @update:modelValue="onFilterValueChangedMultiple"
            :model-value="localValues[1]"
            :filter="filter"
            :range-index="1"
            :style="{'marginTop': '2px'}"
            :format="props.filter.config.is_timestamp ? 'X' : 'DD.MM.yyyy HH:mm'"
        />
      </template>
      <DatetimePicker
          v-else
          :model-value="localValue"
          @update:modelValue="onFilterValueChanged"
          :filter="filter"
          :format="props.filter.config.is_timestamp ? 'X' : 'DD.MM.yyyy HH:mm'"
      />
    </div>
  </div>
</template>
