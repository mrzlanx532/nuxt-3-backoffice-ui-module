<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'default',
})
</script>

<template>
  <div style="background: white; border-radius: 7px; min-height: calc(100vh - 40px); padding: 20px;">
    <div class="page__title">Главная</div>
    <p class="mt_10">Для начала работы используйте меню слева</p>
  </div>
</template>
