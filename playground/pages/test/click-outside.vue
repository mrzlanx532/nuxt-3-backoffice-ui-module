<script setup>
const onClickOutside = () => {
  console.log('click-outside работает')
}
</script>

<template>
  <div>
    <input type="text" v-click-outside="onClickOutside"/>
    <div> Другое место</div>
  </div>
</template>
