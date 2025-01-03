<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'default',
})
</script>

<template>
  <div>
    <h3>Главное</h3>
    <p>Для управления используйте меню слева</p>
  </div>
</template>
