<script setup lang="ts">
const props = defineProps<{
  h1?: string
}>()
</script>

<template>
  <div class="page__container">
    <h1 v-if="h1" class="page__title">{{ props.h1 }}</h1>
    <slot/>
  </div>
</template>