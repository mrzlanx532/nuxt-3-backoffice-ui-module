<script lang="ts">
export { type IItem, type IConfigItem, type IColumn } from '~/composables/useBrowser'

export interface IBrowser {
  reset: () => void,
}
</script>

<script setup lang="ts">
import { type Component, type Ref, getCurrentInstance, useSlots } from 'vue'
import { FetchError } from 'ofetch'
import { useNuxtApp, useBrowser } from '#imports'
import Spinner from '~/components/Base/Spinner.vue'
import BrowserTHeadTh from '~/components/Base/Browser/BrowserTHeadTh.vue'
import BrowserSearchString from '~/components/Base/Browser/BrowserSearchString.vue'
import BrowserPagination from '~/components/Base/BrowserSmall/BrowserPagination.vue'
import { type IItem, type IConfigItem, type IColumn } from '~/composables/useBrowser'

const {
  // Items
  items,
  setItems,
  getLocalRequestProperties,

  // Pagination
  totalItems,

  // Other
  callPreset,
  firstLoadingIsActive,
  loadingIsActive,
  isVueComponent,
  getSubComponent
} = useBrowser()

interface Props {
  h1: string,
  urlPrefix: string,
  columns?: IColumn[],
  filters?: {
    [key: string]: any[]
  }
  params?: {
    [key: string]: any[]
  },
  isEnabledSearch?: boolean,
  itemPrimaryKeyPropertyName?: string,
  requestProperties?: string[],
  isEnabledTHead?: boolean,
  customTr?: Component
}

const props = withDefaults(defineProps<Props>(), {
  itemPrimaryKeyPropertyName: 'id',
  isEnabledTHead: true,
  isEnabledSearch: false,
  columns: () => [] as IColumn[],
})

enum FilterType {
  // noinspection JSUnusedGlobalSymbols
  SELECT = 'SELECT',
  SELECT_SEARCH = 'SELECT_SEARCH',
  INPUT = 'INPUT',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
}

interface IRequestParams {
  filters?: {},
  search_string?: string,
  sort?: {
    field: string,
    direction: string
  }
  per_page: number,
  page: number,
  [key: string]: any
}

interface IFilter {
  id: string,
  title: string,
  type: keyof typeof FilterType,
  options?: {
    id: string,
    title: string,
  }[]
  config: {
    filter: boolean,
    hidden: boolean,
    mask: string|null,
    multiple: boolean,
    range: boolean,
    url: string
  }
}

interface IResponse {
  filters: IFilter[],
  items: IItem[],
  meta: {
    browser_id: string,
    count: number,
    page: number,
    per_page: number,
    searchable: boolean,
    sort: string[]
  }
}

const BrowserSmallEl = getCurrentInstance()

const emit = defineEmits([
  'clickRow',
])

const slots = useSlots()

const { $authFetch } = useNuxtApp()

const filters: Ref<IFilter[]> = ref([])
const filtersByName: Ref<{[key: string]: IFilter}> = ref({})

const searchString = ref('')
const selectedPaginationItemsCount = ref(10)
const fetchError: Ref<FetchError|null> = ref(null)

/** pagination */
const currentPage = ref(1)

/** sorts */
const sorts: Ref<{[key: string]: any}> = ref({})
const activeSort: Ref<string|null> = ref(null)

const localRequestProperties: Ref<{} | null> = ref(getLocalRequestProperties(props.requestProperties))

const setFilters = (_filters: IFilter[]) => {
  const preparedFilters: IFilter[] = [];
  const preparedFiltersByName: {[key: string]: IFilter} = {};

  _filters.forEach((filter) => {
    preparedFilters.push(filter)
    preparedFiltersByName[filter.id] = filter
  })

  filters.value = preparedFilters
  filtersByName.value = preparedFiltersByName
}

const fetchData = async () => {

  loadingIsActive.value = true

  const config: { params?: IRequestParams } = {}

  const requestData = {} as IRequestParams;

  if (props.filters) {
    requestData.filters = props.filters
  }

  if (props.params) {
    Object.entries(props.params).map(([key, value]) => {
      requestData[key] = value
    })
  }

  if (searchString.value !== '') {
    requestData.search_string = searchString.value
  }

  if (activeSort.value && sorts.value[activeSort.value]) {
    requestData.sort = {
      field: activeSort.value,
      direction: sorts.value[activeSort.value]
    }
  }

  if (selectedPaginationItemsCount.value !== 20) {
    requestData.per_page = selectedPaginationItemsCount.value
  }

  if (currentPage.value > 1) {
    requestData.page = currentPage.value
  }

  config.params = requestData

  try {

    const data = await $authFetch<IResponse>(props.urlPrefix, config)

    fetchError.value = null
    totalItems.value = data.meta.count

    setItems(data.items, localRequestProperties)

    if (firstLoadingIsActive.value) {

      setFilters(data.filters)

      sorts.value = data.meta.sort.reduce((acc: {[key: string]: any}, value: string) => {
        return {...acc, [value]: null}
      }, {})
    }

    loadingIsActive.value = false

  } catch (err: unknown) {
    if (err instanceof FetchError) {
      fetchError.value = err
    }
  }
}

const onSortChanged = (name: string, value: string) => {

  if (activeSort.value !== name) {
    activeSort.value = name

    for (let sort in sorts.value) {
      sorts.value[sort] = null
    }
  }

  sorts.value[name] = value

  fetchData()
}

const onClickRow = (item: IItem) => {
  emit('clickRow', item)
}

const onSearchStringInput = (value: string) => {
  currentPage.value = 1
  searchString.value = value

  fetchData()
}

const reset = () => {
  currentPage.value = 1
  selectedPaginationItemsCount.value = 10
  activeSort.value = null

  Object.keys(sorts.value).map((key) => {
    sorts.value[key] = null
  })

  fetchData()
}

const onChangePage = (page: number, fetchData: () => {}) => {
  currentPage.value = page

  fetchData()
}

watch(
    () => props.filters,
    () => {
      fetchData()
    }
)

onMounted(() => {
  fetchData().then(() => {
    firstLoadingIsActive.value = false
  })
})

defineExpose({
  reset
})
</script>

<template>
  <div class="browser-small" :class="{'--is-disabled-thead': !isEnabledTHead}">
    <ClientOnly>
      <Transition name="fade">
        <div
            v-if="!firstLoadingIsActive"
            class="browser-small__container"
            :class="{'--empty': items.length === 0}"
        >
          <div v-if="fetchError !== null" class="browser__error-container">
            <div class="browser__error">
              <div class="browser__error-status-code">
                Error code: {{ fetchError.statusCode }}
              </div>
              <div class="browser__error-message">
                {{ fetchError.message }}
              </div>
            </div>
          </div>
          <div
              v-else
              class="browser__table-container"
          >
            <div class="browser-small__header">
              <div class="browser-small__header-left">
                <span>{{ props.h1 }}</span>
              </div>
              <div v-if="slots.actions" class="browser-small__actions">
                <slot name="actions"/>
              </div>
            </div>

            <BrowserSearchString
                style="width: 100%; margin-top: 10px;"
                v-if="isEnabledSearch"
                @search="onSearchStringInput"
                class="--in-small-browser"
            />
            <BrowserPagination
                :page="currentPage"
                :total="totalItems"
                :per-page="selectedPaginationItemsCount"
                @changePage="onChangePage($event, fetchData)"
            />
            <div
                v-if="items.length === 0"
                class="browser-small__empty-list"
            >
              <div>
                <svg>
                  <use xlink:href="/img/temp_sprite.svg#empty_list"/>
                </svg>
                <span class="browser-small__empty-list-header">Список пуст</span>
                <span class="browser-small__empty-list-description">По вашему запросу ничего не найдено</span>
              </div>
            </div>
            <template v-if="items.length">
              <table class="browser-small__table" :class="{'--loading': loadingIsActive}">
                <thead v-if="isEnabledTHead">
                  <tr>
                    <BrowserTHeadTh
                        @sortChanged="onSortChanged"
                        v-for="column in columns"
                        :key="column.name"
                        :sorts="sorts"
                        :column="column"
                    />
                  </tr>
                </thead>
                <tbody>
                  <template v-if="props.customTr">
                    <component
                        :is="props.customTr"
                        v-for="item in items"
                        :item="item"
                        :key="item[itemPrimaryKeyPropertyName]"
                        @click="onClickRow(item)"
                        :browserSmallEl="BrowserSmallEl"
                    />
                  </template>
                  <template v-else>
                    <tr v-for="item in items" :key="item[itemPrimaryKeyPropertyName]" @click="onClickRow(item)">
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
                          {{ callPreset(column.preset!.name, column as IConfigItem, item)}}
                        </template>
                        <template v-else-if="column.toFormat">
                          {{ column.toFormat(item) }}
                        </template>
                        <template v-else>
                          {{ item[column.name] }}
                        </template>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </template>
          </div>
        </div>
      </Transition>
    </ClientOnly>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>