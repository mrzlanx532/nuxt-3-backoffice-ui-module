<script setup>
const onClickOutside = () => {
  alert('Работает')
}
</script>

<template>
  <div>
    <input type="text" v-click-outside="onClickOutside"/>
    <div> Другое место</div>
  </div>
</template>
