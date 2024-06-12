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
<script>

const dataDefault = {
  question: 'Вы уверены?',
  moreText: null,
  agreeText: 'Да',
  disagreeText: 'Нет',
}

export default {
  name: "ModalConfirm",
  parentClassModifier: "--small",
  props: {
    data: {
      type: Object,
      default() {
        return dataDefault
      }
    },
  },
  computed: {
    dataLocal() {
      return Object.assign({}, dataDefault, this.data)
    }
  },
  methods: {
    onClick(payload) {
      this.$emit('modal:resolve', payload)
    },
  }
}
</script>
