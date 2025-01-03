<script setup lang="ts">
import Badge from '@/components/Base/Badge.vue'

type IItem = Record<string, any>

const props = defineProps<{
  item: IItem
  column: {
    name: string,
    title: string,
    toFormat: (item: IItem) => {title: string, class: string}
  }
}>()

const data = ref(props.column.toFormat(props.item))

watch(
    () => props.item,
    (value) => {
      data.value = props.column.toFormat(value)
    }
)
</script>

<template>
  <Badge :title="data.title" :class="data.class"/>
</template>