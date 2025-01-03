<script setup lang="ts">
import { type IColumn } from '~/composables/useBrowser'

const emit = defineEmits(['sortChanged'])

type ISort = 'asc' | 'desc' | 'null'

const props = defineProps<{
  column: IColumn,
  sorts: Record<string, ISort>
}>()

const nextValueMap = {
  null: 'desc',
  desc: 'asc',
  asc: null
}

const onClick = (name: string) => {
  emit('sortChanged', name, nextValue(props.sorts[name]))
}
const nextValue = (value: ISort) => {
  return nextValueMap[value]
}
</script>

<template>
  <th :class="column.class">
    <div class="container">
      <div class="title">{{ column.title }}</div>
      <div
          class="svg-container"
          v-if="sorts.hasOwnProperty(column.name)"
          @click="onClick(column.name)"
          :class="[
            {'svg-container_desc': sorts[column.name] === 'desc'},
            {'svg-container_asc': sorts[column.name] === 'asc'},
          ]"
      >
        <svg width="14px" height="14px">
          <use xlink:href="/img/sprite.svg#order"/>
        </svg>
      </div>
    </div>
  </th>
</template>