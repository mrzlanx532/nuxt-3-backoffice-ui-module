<script setup lang="ts">
const emit = defineEmits(['search'])
const props = defineProps<{
  value?: string
}>()

const searchString = ref(props.value)

watch(
    () => props.value,
    (value) => {
      searchString.value = value
    }
)

const onInput = () => {
  if (searchString.value === '') {
    emit('search', searchString.value)
  }
}

const onSearch = () => {
  if (searchString.value === '') {
    return;
  }

  emit('search', searchString.value)
}
</script>

<template>
  <div class="browser__search-string-container">
    <input
        spellcheck="false"
        name="search_string"
        type="text"
        class="browser__search-string"
        placeholder="Поиск"
        @keyup.enter="onSearch"
        @input="onInput"
        v-model="searchString"
        autocomplete="off"
    >
    <div class="browser__search-string-button" @click="onSearch">
      <svg width="32px" height="32px">
        <use xlink:href="/img/sprite.svg#search"/>
      </svg>
    </div>
  </div>
</template>