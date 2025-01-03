<script setup lang="ts">
export interface IConfigItem {
  columnClass: number,
  title: string,
  name: string,
  toFormat?: (item: {[key: string]: any}) => {},
  component?: {}
  preset?: {
    name: string,
    locale?: string ,
    format?: string
  }
}

const props = defineProps<{
  item: Record<string, any>,
  configItem: IConfigItem
}>()
</script>

<template>
  <img
      class="flex-table__picture"
      v-if="props.item?.original"
      :src="props.item?.original"
      alt="picture"
  />
  <p v-else>—</p>
</template>