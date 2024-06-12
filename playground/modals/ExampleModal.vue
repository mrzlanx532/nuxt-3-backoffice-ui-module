<script setup>
const test = defineProps({
  data: {
    type: Object,
    required: false
  }
})

const emit = defineEmits(['modal:resolve'])

const onClick = () => {
  emit('modal:resolve', 'что-то')
}
</script>

<template>
  <div class="content">
    <button @click="onClick">Подтвердить?</button>
  </div>
</template>

<style scoped>
.content {
  width: 100px;
  height: 100px;
}
</style>
