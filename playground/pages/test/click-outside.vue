<script setup>
import { definePageMeta } from '#imports'

definePageMeta({
  layout: 'test',
})

const onClickOutside = () => {
  console.log('click-outside работает')
}
</script>

<template>
  <div>
    <input
      v-click-outside="onClickOutside"
      type="text"
    >
    <div> Другое место</div>
  </div>
</template>
