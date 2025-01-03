<script setup lang="ts">
const emit = defineEmits(['@update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: false,
    default: false
  },
})

const localValue: Ref<boolean> = ref(props.modelValue)

watch(
    () => props.modelValue,
    (value) => {
      localValue.value = value as boolean
    }
)

const onClick = () => {
  emit('@update:modelValue', localValue.value === undefined || localValue.value === false)
}
</script>

<template>
  <div class="checkbox">
    <input type="checkbox" v-model="localValue">
    <div class="checkbox__container" @click="onClick">
      <div class="checkbox__fake" :class="{'--checked': localValue}">
        <svg v-if="localValue">
          <use xlink:href="/img/temp_sprite.svg#check_mark"/>
        </svg>
      </div>
    </div>
  </div>
</template>