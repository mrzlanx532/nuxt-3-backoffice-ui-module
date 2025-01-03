<script setup lang="ts">
type ButtonType = 'button' | 'submit' | 'reset' | undefined

const props = withDefaults(defineProps<{
  type?: ButtonType
}>(), {
  type: 'button'
})
</script>

<template>
  <button
      class="btn"
      :type="props.type"
  >
    <slot/>
  </button>
</template>