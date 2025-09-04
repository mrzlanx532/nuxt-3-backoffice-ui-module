<script setup lang="ts">
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
</script>

<template>
  <OverlayScrollbarsComponent class="main-custom-scroll">
    <slot />
    <Notification />
  </OverlayScrollbarsComponent>
</template>
