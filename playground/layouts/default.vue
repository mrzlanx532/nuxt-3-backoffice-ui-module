<script setup>
import { Notification } from '#components'
</script>

<template>
  <div>
    <slot />
    <Notification />
  </div>
</template>

<style scoped>
div {
  height: 100%;
  width: 100%;
}
</style>
