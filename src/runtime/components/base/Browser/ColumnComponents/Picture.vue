<script setup lang="ts">
type IItem = Record<string, any>

const props = withDefaults(defineProps<{
  item: IItem
  column: {
    name: string,
    title: string,
    toFormat?: (item: IItem) => {title: string, class: string}
  },
  height?: number,
  width?: number,
  title?: string,
  maxWidth?: number,
  firstLetterAsImage?: boolean,
  toFormat?: (item: IItem) => {title: string, class: string}
}>(), {
  height: 32,
  width: 32,
  maxWidth: 200,
  firstLetterAsImage: false,
})

const prepareLetter = (property: string) => {
  return property.toUpperCase()[0]
}

const prepareText = (isWithPrepareLetter: boolean = false) => {
  if (props.toFormat) {
    return props.toFormat(props.item)
  }

  if (props.title) {
    if (isWithPrepareLetter) {
      return prepareLetter(props.item[props.title])
    }

    return props.item[props.title]
  }

  return null
}
</script>

<template>
  <div class="browser__tr-picture" :style="{maxWidth: maxWidth + 'px'}">
    <img
        v-if="props.item[props.column.name]"
        class="browser__tr-picture-img"
        :style="{
          height: props.height + 'px',
          width: props.width + 'px'
        }"
        :src="props.item[props.column.name].original"
        alt="picture"
    />
    <div
        v-else-if="props.firstLetterAsImage"
        class="browser__tr-picture-letter"
        :style="{
          height: props.height + 'px',
          width: props.width + 'px'
        }"
    >
      <div>
        {{ prepareText(true) }}
      </div>
    </div>
    <div
        class="browser__tr-picture-text"
        :title="prepareText()"
    >{{ prepareText() }}</div>
  </div>
</template>