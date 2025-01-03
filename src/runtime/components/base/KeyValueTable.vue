<script setup lang="ts">
import moment from 'moment'

export interface IConfigItem {
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

const props = withDefaults(defineProps<{
  item?: Record<string, any>,
  config: IConfigItem[],
  emptySymbol?: string
}>(), {
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
  <table class="key-value-table" v-if="item">
    <tbody>
      <tr v-for="configItem in config">
        <th>{{ configItem.title }}</th>
        <td>
          <template v-if="configItem.component">
            <component :is="configItem.component" :item="item[configItem.name]"/>
          </template>
          <template v-else-if="configItem.preset">
            {{ callPreset(configItem.preset!.name, configItem, item)}}
          </template>
          <template v-else-if="configItem.toFormat">
            {{ configItem.toFormat(item) ? configItem.toFormat(item) : props.emptySymbol  }}
          </template>
          <template v-else>
            {{ item[configItem.name] !== null ? item[configItem.name] : emptySymbol }}
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>