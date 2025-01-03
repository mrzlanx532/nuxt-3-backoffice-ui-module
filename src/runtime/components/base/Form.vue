<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <form class="form">
    <div class="form__header">
      <div class="form__header-section-top">
        <div class="form__header-title">{{ props.title }}</div>
        <div class="form__header-close-button" @click="$emit('close')">
          <svg>
            <use xlink:href="/img/sprite.svg#cancel_cross"/>
          </svg>
        </div>
      </div>
      <slot name="header"/>
    </div>
    <div class="form__content">
      <slot name="content"/>
    </div>
    <div class="form__footer">
      <slot name="footer"/>
    </div>
  </form>
</template>