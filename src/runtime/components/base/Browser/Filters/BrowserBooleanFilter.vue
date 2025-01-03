<script setup lang="ts">
import type { IFilter } from '~/components/Base/Browser/Browser.vue'
import type { Ref } from 'vue'
type IValue = boolean | null | undefined

const emit = defineEmits(['update:modelValue'])

const props = defineProps<{
  filter: IFilter,
  modelValue?: [boolean | null]
}>()

const value: Ref<IValue> = ref()

watch(
    () => props.modelValue,
    (_value) => {
      value.value = _value === undefined ? _value : _value[0]
    }, {
      immediate: true
    }
)

const onClick = (_value: IValue) => {
  if (_value === value.value) {
    return
  }

  emit('update:modelValue', props.filter.type, props.filter.id, _value === undefined ? _value : [_value])
}
</script>

<template>
  <div class="browser__filter">
    <div :for="filter.id" class="browser__filter-name">{{ filter.title }}</div>
    <div class="browser__filter-container">
      <div class="boolean">
        <div class="boolean__item-container" @click="onClick(undefined)">
          <input type="radio" hidden="hidden" :value="undefined" v-model="value">
          <div class="boolean__radio" :class="{'--checked': value === undefined}">
            <div class="boolean__checker" v-if="value === undefined"></div>
          </div>
          <label class="boolean__label --not-selected">Не задано</label>
        </div>
        <div class="boolean__item-container" @click="onClick(true)">
          <input type="radio" hidden="hidden" :value="true" v-model="value">
          <div class="boolean__radio" :class="{'--checked': value == true}">
            <div class="boolean__checker" v-if="value == true"/>
          </div>
          <label class="boolean__label">Да</label>
        </div>
        <div class="boolean__item-container" @click="onClick(false)">
          <input type="radio" hidden="hidden" :value="false" v-model="value">
          <div class="boolean__radio" :class="{'--checked': value == false}">
            <div class="boolean__checker" v-if="value == false"/>
          </div>
          <label class="boolean__label">Нет</label>
        </div>
        <div class="boolean__item-container" v-if="props.filter.config.nullable" @click="onClick(null)">
          <input type="radio" hidden="hidden" :value="null" v-model="value">
          <div class="boolean__radio" :class="{'--checked': value === null}">
            <div class="boolean__checker" v-if="value === null"/>
          </div>
          <label class="boolean__label">Пусто</label>
        </div>
      </div>
    </div>
  </div>
</template>