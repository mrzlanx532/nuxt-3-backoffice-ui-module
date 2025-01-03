<script setup lang="ts">
import { type Component, useSlots } from 'vue'
import type { IConfigItem } from '~/composables/useBrowser'
import BrowserCheckbox from '~/components/Base/Browser/BrowserCheckbox.vue'

const {
  callPreset,
  isVueComponent,
  getSubComponent
} = useBrowser()

export interface IColumn {
  name: string,
  title: string,
  toFormat?: (item: { [key: string]: any }) => {}
  component?: any | {
    component: Component,
    [key: string]: any
  },
  preset?: {
    name: string
  }
}

const emit = defineEmits([
  'closeBulkActions',
  'clickMultipleCheckbox'
])

const props = withDefaults(defineProps<{
  isOpen: boolean,
  allSelected: boolean,
  selectedIds: Record<string, any>,
  items: Record<string, any>,
  columns: IColumn[],
  itemPrimaryKeyPropertyName: string,
}>(), {})

const preparedItems = computed(() => {

  const selectedIdsAsEntries = Object.entries(props.selectedIds)

  return props.items.filter((item: any) => {

    let isNeedToStay = false

    selectedIdsAsEntries.forEach(([id, value]) => {
      if (item.id.toString() === id) {
        isNeedToStay = value !== false
      }
    })

    return isNeedToStay;
  })
})

const preparedSelectedIds = computed(() => {
  const ids: string[] = [];

  Object.entries(props.selectedIds).forEach(([key, value]) => {
    if (!value) {
      return
    }

    ids.push(key)
  })

  return ids
})

const isLoading = ref(false)
const isClosing = ref(false)

type IItem = { [key: string]: any }

const item: IItem = ref({})

const slots = useSlots()

const onClickCloseButton = () => {
  emit('closeBulkActions');
}

const onClickMultipleCheckbox = (id: string | number) => {
  emit('clickMultipleCheckbox', id)
}
</script>

<template>
  <div
      class="browser-detail"
      :class="[
        {'browser-detail_open': isOpen },
        {'browser-detail_loading': isLoading},
        {'browser-detail_closing': isClosing},
      ]"
  >
    <div class="browser-detail__container" :class="[
        {'browser-detail__container_open': isOpen && !isLoading},
        {'browser-detail__container_closing': isClosing}
        ]">
      <div class="browser-detail__header">
        <div class="browser-detail__header-first-row">
          <template v-if="slots.header_top">
            <slot name="header_top"/>
            <div class="browser-detail__header-buttons">
              <div class="browser-detail__header-close-button" @click="onClickCloseButton">
                <svg>
                  <use xlink:href="/img/sprite.svg#cancel_cross"/>
                </svg>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="browser-detail__header-title-container">
              <div class="browser-detail__header-title">
                Массовые действия
              </div>
              <div class="browser-detail__header-subtitle">
                Выбрано {{ preparedSelectedIds.length }} элементов
              </div>
            </div>
            <div class="browser-detail__header-buttons">
              <div class="browser-detail__header-close-button" @click="onClickCloseButton">
                <svg>
                  <use xlink:href="/img/sprite.svg#cancel_cross"/>
                </svg>
              </div>
            </div>
          </template>
        </div>
        <div class="browser-detail__header-second-row" v-if="slots.header && preparedItems.length">
          <slot name="header"/>
        </div>
      </div>
      <div class="browser-detail__content v-scrollable" v-scrollable>
        <table v-if="preparedItems.length" class="browser__table --with-border">
          <thead>
          <tr>
            <th class="--min-width"/>
            <th v-for="column in columns">
              {{ column.title }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="item in preparedItems"
              :key="item[itemPrimaryKeyPropertyName]"
              @pointerdown="onClickMultipleCheckbox(item.id)"
          >
            <td>
              <BrowserCheckbox v-model="selectedIds[item[props.itemPrimaryKeyPropertyName]]"/>
            </td>
            <td v-for="column in columns">
              <component
                  v-if="column.component && isVueComponent(column.component)"
                  :is="column.component"
                  :item="item"
                  :column="column"
              />
              <component
                  v-else-if="column.component && isVueComponent(column.component.component)"
                  :is="getSubComponent(column.component)"
                  :item="item"
                  :column="column"
              />
              <template v-else-if="column.preset">
                {{ callPreset(column.preset!.name, column as IConfigItem, item) }}
              </template>
              <template v-else-if="column.toFormat">
                {{ column.toFormat(item) }}
              </template>
              <template v-else>
                {{ item[column.name] }}
              </template>
            </td>
          </tr>
          </tbody>
        </table>
        <div v-else>
          <div class="browser-detail__empty-bulk-actions-items-label">Здесь пока ничего нет</div>
          <div class="browser-detail__empty-bulk-actions-items-label">Выберите элементы из каталога, чтобы совершить с
            ними массовые действия
          </div>
        </div>
      </div>
    </div>
  </div>
</template>