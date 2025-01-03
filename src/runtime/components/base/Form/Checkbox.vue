<script setup lang="ts">
const emit = defineEmits(['update:modelValue'])

interface IComponentData {}

const props = withDefaults(defineProps<{
  label: string,
  modelValue?: boolean|number,
  errors?: string[],
  componentData?: IComponentData
}>(), {
  errors: () => [],
  componentData: () => ({})
})

const localValue: Ref<boolean|number|undefined> = ref(props.modelValue)

watch(
    () => props.modelValue,
    (value) => {
      localValue.value = value as boolean
    }
)

const onClick = () => {
  emit('update:modelValue', localValue.value === undefined || localValue.value === false)
}
</script>

<template>
  <div class="checkbox">
    <input type="checkbox" v-model="localValue">
    <div class="checkbox__container" @click="onClick">
      <div class="checkbox__fake" :class="{'--has-errors': errors && errors[0]}">
        <svg v-if="localValue">
          <use xlink:href="/img/temp_sprite.svg#check_mark"/>
        </svg>
      </div>
      <div class="checkbox__label">{{ label }}</div>
      <div class="input__error">{{ errors && errors[0] ? errors[0] : null }}</div>
    </div>
  </div>
</template>
