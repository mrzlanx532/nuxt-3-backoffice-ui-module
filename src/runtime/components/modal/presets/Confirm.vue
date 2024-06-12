<script setup lang="ts">
const emit = defineEmits(['modal:resolve'])

const props = defineProps({
  data: {
    type: Object,
    default() {
      return {
        question: 'Вы уверены?',
        moreText: null,
        agreeText: 'Да',
        disagreeText: 'Нет',
      }
    }
  },
})

const onClick = (payload) => {
  emit('modal:resolve', payload)
}

const dataLocal = computed(() => {
  return Object.assign({}, {
    question: 'Вы уверены?',
    moreText: null,
    agreeText: 'Да',
    disagreeText: 'Нет',
  }, props.data)
})
</script>

<template>
  <div class="modal-confirm">
    <div class="modal-confirm__close-button-container">
      <div class="modal-confirm__close-button" @click="onClick(false)"></div>
    </div>
    <div class="modal-confirm__question">{{ dataLocal.question }}</div>
    <div class="modal-confirm__more" v-if="dataLocal.moreText">{{ dataLocal.moreText }}</div>
    <div class="modal-confirm__actions">
      <button class="btn --outline-contrast-danger --big --full-width" @click="onClick(false)">{{ dataLocal.disagreeText }}</button>
      <button class="btn --success --big --full-width" @click="onClick(true)">{{ dataLocal.agreeText }}</button>
    </div>
  </div>
</template>
