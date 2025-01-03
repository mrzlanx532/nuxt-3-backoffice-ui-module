<script setup lang="ts">
import BaseLink from '~/components/Base/BaseLink.vue'
import { type IConfigItem, type IItem } from '~/composables/useBrowser'
import type { Component } from 'vue'
import { useBrowser } from '~/composables/useBrowser'

const {
  isVueComponent,
  getSubComponent,
  callPreset
} = useBrowser()

interface IRow {
  title: string,
  name: string,
  toFormat?: (item: {[key: string]: any}) => {},
  isRaw?: boolean,
  component?: any | {
    component: Component,
    [key: string]: any
  },
  preset?: {
    name: 'timestampToFormatPreset' | string
  },
}

interface ISection {
  title: string,
  rows: IRow[]
}

const props = withDefaults(defineProps<{
  entityName: string,
  backLink: string,
  backLinkTitle?: string
  item: IItem
  sections: ISection[]
}>(), {
  backLinkTitle: 'Вернуться к таблице'
})
</script>

<template>
  <div class="detail">
    <BaseLink :to="props.backLink" class="detail__link-back --special">{{ props.backLinkTitle }}</BaseLink>

    <div class="detail__header">
      <div class="detail__header-title">{{ props.entityName }} {{ props.item.id }}</div>
      <div class="header__actions">
        <slot name="actions"/>
      </div>
    </div>

    <div class="clouds" v-if="props.sections.length">
      <div class="clouds__cloud" v-for="section in props.sections">
        <div class="clouds__cloud-header" v-if="section.title">{{ section.title }}</div>
        <div class="clouds__cloud-row" v-for="row in section.rows">
          <div class="clouds__cloud-row-name">
            <span>{{ row.title  }}</span>
          </div>
          <div class="clouds__cloud-row-value">
            <component
                v-if="row.component && isVueComponent(row.component)"
                :is="row.component"
                :item="item"
                :column="row"
            />
            <component
                v-else-if="row.component && isVueComponent(row.component.component)"
                :is="getSubComponent(row.component)"
                :item="item"
                :column="row"
            />
            <template v-else-if="row.preset">
              {{ callPreset(row.preset.name, row as IConfigItem, item)}}
            </template>
            <template v-else-if="row.toFormat">
              {{ row.toFormat(item) }}
            </template>
            <div v-else-if="row.isRaw" v-html="item[row.name]"/>
            <template v-else>
              {{ item[row.name] }}
            </template>
          </div>
        </div>
      </div>

      <slot name="more" />

    </div>
  </div>
</template>