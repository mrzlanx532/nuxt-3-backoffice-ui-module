<script setup lang="ts">
import type { IFilter } from '~/components/Base/Browser/Browser.vue'
import type { Ref } from 'vue'
type IValue = string | undefined

const emit = defineEmits(['update:modelValue'])

const props = defineProps<{
  filter: IFilter,
  modelValue?: [IValue] | [IValue, IValue]
}>()

let unconfirmedValue1: IValue = undefined
let unconfirmedValue2: IValue = undefined
const value1: Ref<IValue> = ref()
const value2: Ref<IValue> = ref()

watch(
    () => props.modelValue,
    (value) => {

      if (props.filter.config.range) {

        if (value === undefined) {
          unconfirmedValue1 = undefined
          unconfirmedValue2 = undefined

          value1.value = unconfirmedValue1
          value2.value = unconfirmedValue2
          return
        }

        unconfirmedValue1 = value[0] === undefined || value[0] === '' ? undefined : value[0]
        unconfirmedValue2 = value[1] === undefined || value[1] === '' ? undefined : value[1]

        value1.value = unconfirmedValue1
        value2.value = unconfirmedValue2

        return
      }

      unconfirmedValue1 = value === undefined ? undefined : value[0]
      value1.value = unconfirmedValue1
    },
    { immediate: true }
)

const onSubmit = () => {
  if (unconfirmedValue1 !== undefined && unconfirmedValue1 !== value1.value) {
    emitSingleValue(unconfirmedValue1)
  }
}

const onSubmitMultiple = (param: number) => {
  if (unconfirmedValue1 !== undefined && param === 0 && unconfirmedValue1 !== value1.value) {
    emitDoubleValue(unconfirmedValue1, unconfirmedValue2)
  }

  if (unconfirmedValue2 !== undefined && param === 1 && unconfirmedValue2 !== value2.value) {
    emitDoubleValue(unconfirmedValue1, unconfirmedValue2)
  }
}

const onInput = (e: InputEvent) => {

  unconfirmedValue1 = (e.target as HTMLInputElement).value

  if (unconfirmedValue1 === '') {
    unconfirmedValue1 = undefined
  }

  if (unconfirmedValue1 === undefined && value1.value !== unconfirmedValue1) {
    emitSingleValue(unconfirmedValue1)
  }
}

const onInputMultiple = (e: InputEvent, param: number) => {

  const value = (e.target as HTMLInputElement).value === '' ? undefined : (e.target as HTMLInputElement).value

  if (param === 0) {
    unconfirmedValue1 = value
  }

  if (param === 1) {
    unconfirmedValue2 = value
  }

  if (value === undefined && param === 0 && value1.value !== unconfirmedValue1) {
    emitDoubleValue(unconfirmedValue1, unconfirmedValue2)
  }

  if (value === undefined && param === 1 && value2.value !== unconfirmedValue2) {
    emitDoubleValue(unconfirmedValue1, unconfirmedValue2)
  }
}

const onClickRemove = () => {
  unconfirmedValue1 = undefined
  emitSingleValue(unconfirmedValue1)
}

const onClickRemoveMultiple = (param: number) => {
  if (param === 0) {
    unconfirmedValue1 = undefined
  }

  if (param === 1) {
    unconfirmedValue2 = undefined
  }

  emitDoubleValue(unconfirmedValue1, unconfirmedValue2)
}

const emitSingleValue = (value: IValue) => {
  emit('update:modelValue', props.filter.type, props.filter.id, value === undefined ? undefined : [value])
}

const emitDoubleValue = (value1: IValue, value2: IValue) => {

  if (value1 === undefined && value2 === undefined) {
    emit('update:modelValue', props.filter.type, props.filter.id, undefined)
    return
  }

  emit('update:modelValue', props.filter.type, props.filter.id, [
    value1 === undefined ? '' : value1,
    value2 === undefined ? '' : value2
  ])
}
</script>

<template>
  <div class="browser__filter">
    <div :for="filter.id" class="browser__filter-name">{{ filter.title }}</div>
    <div class="browser__filter-container">
      <div class="input__container-flex" v-if="filter.config.range">
        <div class="input__container input__container_range">
          <div class="input__label">
            От
          </div>
          <input
              spellcheck="false"
              :value="value1"
              class="input input_range"
              type="text"
              @input="onInputMultiple($event as InputEvent, 0)"
              @blur="onSubmitMultiple(0)"
              @keyup.enter="onSubmitMultiple(0)"
          >
          <div
              class="input__remove-button input__remove-button_range"
              @click="onClickRemoveMultiple(0)"
              v-show="value1 !== undefined"
          >
            <svg>
              <use xlink:href="/img/temp_sprite.svg#min_cross"/>
            </svg>
          </div>
        </div>
        <div class="input__container input__container_range">
          <div class="input__label">
            До
          </div>
          <input
              spellcheck="false"
              :value="value2"
              class="input"
              type="text"
              @input="onInputMultiple($event as InputEvent, 1)"
              @blur="onSubmitMultiple(1)"
              @keyup.enter="onSubmitMultiple(1)"
          >
          <div
              class="input__remove-button input__remove-button_range"
              @click="onClickRemoveMultiple(1)"
              v-show="value2 !== undefined"
          >
            <svg>
              <use xlink:href="/img/temp_sprite.svg#min_cross"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="input__container" v-else>
        <input
            spellcheck="false"
            :value="value1"
            class="input"
            type="text"
            @input="onInput($event as InputEvent)"
            @keyup.enter="onSubmit"
            @blur="onSubmit"
        >
        <div
            class="input__remove-button"
            @click="onClickRemove"
            v-show="value1 !== undefined"
        >
          <svg>
            <use xlink:href="/img/temp_sprite.svg#min_cross"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>