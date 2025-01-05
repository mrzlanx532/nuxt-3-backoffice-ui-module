<script setup lang="ts">
import BaseLink from '#backoffice-ui/components/BaseLink.vue'
import { type IConfigItem, type IItem } from '#backoffice-ui/composables/useBrowser'
import { type Component, toRaw } from 'vue'
import { useBrowser } from '#backoffice-ui/composables/useBrowser'
import Badge from '#backoffice-ui/components/Badge.vue'

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
                :is="toRaw(row.component)"
                :item="item"
                :column="row"
            />
            <component
                v-else-if="row.component && isVueComponent(row.component.component) && item[row.name] !== undefined && item[row.name] !== null"
                :is="getSubComponent(toRaw(row.component))"
                :item="item"
                :column="row"
            />
            <template v-else-if="row.preset">
              {{ callPreset(row.preset.name, row as IConfigItem, item)}}
            </template>
            <template v-else-if="row.toFormat">
              {{ row.toFormat(item) }}
            </template>
            <div v-else-if="row.isRaw && item[row.name]" v-html="item[row.name]"/>
            <template v-else>
              <template v-if="item[row.name] !== undefined && item[row.name] !== null">
                {{ item[row.name] }}
              </template>
              <template v-else>
                <Badge class="--default" title="Не заполнено" />
              </template>
            </template>
          </div>
        </div>
      </div>

      <slot name="more" />

    </div>
  </div>
</template>
