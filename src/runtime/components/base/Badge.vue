<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <div class="badge">
    {{ props.title }}
  </div>
</template>