<script setup lang="ts">
import type { IFilter } from '~/components/Base/Browser/Browser.vue'
import type { Ref } from 'vue'

interface IOption {
  id: number|string,
  title: string
}

const props = defineProps<{
  modelValue?: any,
  filter: IFilter,
}>()

const emit = defineEmits(['update:modelValue'])

const selectedItems: Ref<{[key: string]: IOption}> = ref({})
const selectedId: Ref<string | number | undefined> = ref()
const selectedTitle: Ref<string | undefined> = ref()
const isSelecting = ref(false)
const searchString = ref('')
const filteredOptions: Ref<({
  id: string
  title: string
}[])|undefined> = ref([])
const inverseRender = ref(false)
const topPxStyle = ref('0')
const topPxStyleInput = ref('0')

watch(
    () => props.modelValue,
    (value) => {

      if (props.filter.config.multiple) {

        if (value === undefined) {
          selectedItems.value = {}
          return
        }

        if (props.filter.options!.length && value instanceof Array) {

          const preparedSelectedItems: {[key: string]: IOption} = {}

          props.filter.options!.map(option => {
            value.forEach(_option => {
              if (option.id === _option) {
                preparedSelectedItems[option.id] = option
              }
            })
          })

          selectedItems.value = preparedSelectedItems
        }

        return
      }

      if (value === undefined) {
        selectedId.value = undefined
        selectedTitle.value = undefined

        return
      }

      selectedId.value = value as string | number | undefined

      if (props.filter.options!.length && value instanceof Array) {
        props.filter.options!.map(option => {
          if (option.id === value[0]) {
            selectedTitle.value = option.title

            return
          }
        })

        return
      }

      selectedTitle.value = undefined
    },
    {
      immediate: true
    }
)

const selectDropdownEl = useTemplateRef<HTMLDivElement>('selectDropdownEl')
const selectContainerEl = useTemplateRef<HTMLDivElement>('selectContainerEl')
const inputEl = useTemplateRef<HTMLInputElement>('inputEl')

const onDocumentVisibilityChange = () => {
  if (document.hidden) {
    isSelecting.value = false
  }
}

const updateDimensions = (rect: DOMRect) => {

  if (!isSelecting.value) {
    return
  }

  if (window.innerHeight >= (rect.height + rect.top)) {
    topPxStyle.value = '0'
    topPxStyleInput.value = '0'
    inverseRender.value = false
    return
  }

  inverseRender.value = true
  topPxStyle.value = ((selectDropdownEl.value!.offsetHeight + selectContainerEl.value!.offsetHeight + 30) * -1) + 'px'
  topPxStyleInput.value = ((selectDropdownEl.value!.offsetHeight + selectContainerEl.value!.offsetHeight + 30) * -1) + 'px'
}

const onClickSelectedValue = () => {
  searchString.value = ''

  nextTick(() => {
    nextTick(() => {
      if (inputEl.value !== undefined) {
        inputEl.value!.focus()
      }
    })
  })

  isSelecting.value = !isSelecting.value
}

const onMouseDownOnDropdownOption = (filterName: string, option: IOption) => {

  if (props.filter.config.multiple) {

    selectedItems.value[option.id] ? delete selectedItems.value[option.id] : selectedItems.value[option.id] = option

    emit('update:modelValue', props.filter.type, filterName, Object.values(selectedItems.value).map(item => item.id))
    return
  }

  selectedId.value = option.id
  selectedTitle.value = option.title
  isSelecting.value = false

  emit('update:modelValue', props.filter.type, filterName, [option.id])
}

const onClickOutside = () => {
  isSelecting.value = false
}

const onClickCancel = (filterName: string, index: number) => {
  if (props.filter.config.multiple) {
    delete selectedItems.value[index]

    const preparedValues = Object.values(selectedItems.value).map(item => item.id)

    emit('update:modelValue', props.filter.type, filterName, preparedValues.length ? preparedValues : undefined)
  }
}

const onCrossClick = (filterName: string) => {
  selectedId.value = undefined
  selectedTitle.value = undefined

  emit('update:modelValue', props.filter.type, filterName, undefined)
}

watch(
    searchString,
    (newValue) => {
      filteredOptions.value = props.filter.options
      filteredOptions.value = filteredOptions.value!.filter((option: IOption) => {
        return option.title.toLowerCase().includes(newValue.toLowerCase())
      })
    }
)

watch(
    isSelecting,
    () => {
      nextTick(() => {
        if (selectDropdownEl.value === null) {
          inverseRender.value = false
          topPxStyle.value = '0';
          return
        }

        const rect = selectDropdownEl.value.getBoundingClientRect()

        inverseRender.value = window.innerHeight < (rect.height + rect.top)

        const ro = new ResizeObserver(() => {
          updateDimensions(rect)
        })
        ro.observe(selectContainerEl.value!, {})

        const ro2 = new ResizeObserver(() => {
          updateDimensions(rect)
        })
        ro2.observe(selectDropdownEl.value)
      })
    }
)

onMounted(() => {
  filteredOptions.value = props.filter.options

  document.addEventListener('visibilitychange', onDocumentVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onDocumentVisibilityChange)
})
</script>

<template>
  <div class="browser__filter">
    <div :for="filter.id" class="browser__filter-name">{{ filter.title }}</div>
    <div class="browser__filter-container select__container" v-click-outside="onClickOutside">
      <div
          ref="selectContainerEl"
          class="select__selected-container"
          :class="{
            '--open': isSelecting,
            '--multiple': filter.config.multiple,
            '--inverse': inverseRender
          }"
          @click="onClickSelectedValue"
      >
        <div class="select__active-select_multiple" v-if="filter.config.multiple">
          <transition-group name="list">
            <div
                class="select__active-select-option"
                @click.stop.prevent
                v-for="(selectedItem, index) in selectedItems" :key="selectedItem.id"
            >
              <div class="select__active-select-option-title">
                {{ selectedItem.title }}
              </div>
              <div class="select__active-select-option-cancel" @click.stop="onClickCancel(filter.id, index as number)">
                <svg>
                  <use xlink:href="/img/temp_sprite.svg#min_cross"/>
                </svg>
              </div>
            </div>
          </transition-group>
        </div>
        <div class="select__active-select" v-else>{{ selectedTitle }}</div>
        <div class="select__active-select-remove-button"
             v-if="selectedId"
             @click.stop="onCrossClick(filter.id)"
        >
          <svg>
            <use xlink:href="/img/temp_sprite.svg#min_cross"/>
          </svg>
        </div>
        <div
            class="select__dropdown-icon-container"
            :class="{'select__dropdown-icon-container_open': isSelecting}"
        ></div>
      </div>
      <div
          class="select__search-input-container"
          :style="{top: topPxStyleInput}"
      >
        <input
            spellcheck="false"
            autocomplete="off"
            name="search"
            v-show="isSelecting"
            ref="inputEl"
            type="text"
            class="select__search-input select__search-input_open"
            :class="{'--inverse': inverseRender}"
            v-model="searchString"
        >
      </div>
      <div
          v-if="isSelecting"
          class="select__dropdown-container"
          :style="{top: topPxStyle}"
      >
        <div
            ref="selectDropdownEl"
            class="select__dropdown select__dropdown_select-search"
            :class="{'--inverse': inverseRender}"
            v-scrollable="{classes: ['--without-track', '--smart-opacity']}"
        >
          <template v-if="filteredOptions!.length > 0">
            <div
                v-for="(option, index) in filteredOptions"
                class="select__dropdown-option"
                :class="{'select__dropdown-option_selected': selectedItems[option.id]}"
                @mouseup="onMouseDownOnDropdownOption(filter.id, option)"
            >{{ option.title }}</div>
          </template>
          <div class="select__dropdown-option select__dropdown-option_empty" v-else>Нет записей</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: opacity .2s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0 !important;
}
</style>