<script setup lang="ts">
import moment from 'moment/moment'

export type IItem = {[key: string]: any}

export interface IConfigItem {
  class: number,
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

interface Props {
  config: IConfigItem[],
  item?: IItem,
  emptySymbol?: string
}

const props = withDefaults(defineProps<Props>(), {
  emptySymbol: '—'
})

const dynamicMethods: {[key: string]: (configItem: IConfigItem, item: IItem) => string | null} = {
  timestampToFormatPreset: (configItem: IConfigItem, item: IItem) => {

    if (item[configItem.name] === null) {
      return props.emptySymbol
    }

    const date = moment(item[configItem.name] * 1000)

    if (!date.isValid()) {
      return props.emptySymbol;
    }

    if (configItem.preset?.hasOwnProperty('locale')) {
      date.locale(configItem.preset.locale!)
    } else {
      date.locale('ru')
    }

    return configItem.preset?.format ? date.format(configItem.preset.format) : date.format('DD.MM.YYYY')
  }
}

const callPreset = (methodName: string, configItem: IConfigItem, item: IItem) => {
  return dynamicMethods[methodName](configItem, item)
}
</script>

<template>
  <div class="detail__flex-table flex-table" v-if="item">
    <div class="flex-table__item" v-for="configItem in props.config" :class="[
        {'--col-12': configItem.class === 12},
        {'--col-6': configItem.class === 6},
        {'--col-4': configItem.class === 4},
        {'--col-3': configItem.class === 3},
        {'--col-2': configItem.class === 2},
    ]">
      <div class="flex-table__item-header">
        {{ configItem.title }}
      </div>
      <div class="flex-table__item-content">
        <template v-if="configItem.component">
          <component :is="configItem.component" :item="item[configItem.name]"/>
        </template>
        <template v-else-if="configItem.preset">
          {{ callPreset(configItem.preset!.name, configItem, item)}}
        </template>
        <template v-else-if="configItem.toFormat">
          {{ configItem.toFormat!(item) }}
        </template>
        <template v-else>
          {{ item[configItem.name] !== null ? item[configItem.name] : emptySymbol }}
        </template>
      </div>
    </div>
  </div>
</template>