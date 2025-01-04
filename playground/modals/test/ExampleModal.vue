<script setup>
const test = defineProps({
  data: {
    type: Object,
    required: false
  }
})

const emit = defineEmits(['modal:reject'])

const onClick = () => {
  emit('modal:reject', 'что-то')
}
</script>

<template>
  <div class="content" style="height: 1800px;">
    <button @click="onClick">Подтвердить?</button>
  </div>
</template>

<style scoped>
.content {
  width: 100px;
  height: 100px;
}
</style>
