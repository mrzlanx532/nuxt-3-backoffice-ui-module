<script setup lang="ts">
import { useSlots } from 'vue'

const slot = useSlots()
</script>

<template>
  <div class="section">
    <div class="section__header" v-if="slot.header">
      <slot name="header"/>
    </div>
    <div class="section__content">
      <slot name="content"/>
    </div>
  </div>
</template>
