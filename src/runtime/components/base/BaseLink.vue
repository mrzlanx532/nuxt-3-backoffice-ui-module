<script setup lang="ts">
  const props = defineProps({
    to: {
      required: true,
      type: String,
    }
  })
</script>
<template>
  <RouterLink class="link" :to="props.to">
    <slot/>
  </RouterLink>
</template>