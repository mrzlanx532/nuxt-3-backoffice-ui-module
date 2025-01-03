<script setup lang="ts">
import { onMounted, onUnmounted, watch, nextTick, type Ref } from 'vue'

interface IOption {
  id: number|string,
  title: string
}

interface IComponentData {
  options: IOption[]
  isMultiple: boolean,
  isForceInverse?: boolean
  isFilterable?: boolean,
  isRemovable?: boolean
}

const props = withDefaults(defineProps<{
  label: string,
  name: string,
  componentData: IComponentData,
  modelValue?: number|number[]|string|string[]|null,
  errors?: string[]
}>(), {
  errors: () => []
})

const emit = defineEmits(['update:modelValue'])

const select__dropdown = useTemplateRef<HTMLElement>('select__dropdown')
const selected__container = useTemplateRef<HTMLElement>('selected__container')

const isSelecting = ref(false)
const searchString = ref('')
const filteredOptions: Ref<IOption[]> = ref(props.componentData?.isFilterable ? props.componentData.options : [])
const inverseRender = ref(false)
const selectedItems: Ref<{[key: string]: IOption}> = ref({})
const topPxStyle = ref('0')
const topPxStyleInput = ref('0')
const selectedItemOrItems: Ref<IOption|IOption[]|undefined> = ref()
const resizeObserverIsSet = false

const setLocalValues = (value: number|number[]|string|string[]|null|undefined) => {

  if (value === undefined || value === null) {
    selectedItems.value = {}
    selectedItemOrItems.value = undefined

    return
  }

  if (Array.isArray(value)) {

    const preparedItems: IOption[] = []
    const preparedSelectedItems: {[key: string]: IOption} = {}

    props.componentData.options.forEach((option: IOption) => {
      // @ts-ignore
      value.forEach((id: number|string) => {
        if (option.id === id) {
          preparedItems.push(option)
          // @ts-ignore
          preparedSelectedItems[id] = option
        }
      })
    })

    // @ts-ignore
    selectedItems.value = preparedSelectedItems
    selectedItemOrItems.value = preparedItems
  }
}

watch(
    () => props.modelValue,
    (value) => {
      setLocalValues(value)
    },
    {
      immediate: true
    }
)

const onClickOutside = () => isSelecting.value = false
const onClickSelectedValue = () => isSelecting.value = !isSelecting.value
const onDocumentVisibilityChange = () =>  {
  if (document.hidden) {
    isSelecting.value = false
  }
}
const onClickCancel = (index?: number|string) => {
  const preparedModelValue = Object.values(selectedItems.value).map(item => item.id).filter(id => id != index)

  emit('update:modelValue', Array.isArray(preparedModelValue) && preparedModelValue.length === 0 ? null : preparedModelValue)
}
const onMouseDownOnDropdownOption = (option: IOption) => {

  selectedItems.value[option.id] ? delete selectedItems.value[option.id] : selectedItems.value[option.id] = option

  emit('update:modelValue', Object.values(selectedItems.value).map(item => item.id).filter(id => id !== undefined))

  isSelecting.value = false
  searchString.value = ''
}

onMounted(() => {
  document.addEventListener('visibilitychange', onDocumentVisibilityChange)
})
onUnmounted(() => {
  document.removeEventListener('visibilitychange', onDocumentVisibilityChange)
})

const selectedItemsCount = computed(() => {
  return Object.keys(selectedItems.value).length
})

const getInverseValue = (rect: DOMRect) => {
  if (
      props.componentData !== undefined &&
      props.componentData.isForceInverse !== undefined &&
      props.componentData.isForceInverse
  ) {
    return true
  }

  if (inverseRender.value) {
    return true
  }


  if (props.componentData!.isFilterable) {
    return window.innerHeight < (rect.height + rect.top + 28)
  }

  return window.innerHeight < (rect.height + rect.top)
}

watch(
    searchString,
    (newValue) => {
      filteredOptions.value = props.componentData.options
      filteredOptions.value = filteredOptions.value.filter((option) => {
        return option.title.toLowerCase().includes(newValue.toLowerCase())
      })
    }
)

const resizeObserverCallback = () => {

  if (!select__dropdown.value) {
    return
  }

  const rect = select__dropdown.value.getBoundingClientRect()

  inverseRender.value = getInverseValue(rect)

  if (inverseRender.value === false) {
    topPxStyle.value = props.componentData.isFilterable ? '30px' : '0'
    topPxStyleInput.value = '0'
    return
  }

  topPxStyle.value = ((rect.height + selected__container.value!.offsetHeight + (props.componentData.isFilterable ? 28 : 0)) * -1) + 'px'
  topPxStyleInput.value = props.componentData.isFilterable ? ((selected__container.value!.offsetHeight + 28) * -1) + 'px' : '0'
}

watch(
    () => isSelecting.value,
    () => {

      nextTick(() => {
        if (select__dropdown.value === null) {
          inverseRender.value = false
          topPxStyle.value = '0';
          return
        }

        if (!resizeObserverIsSet) {
          const ro = new ResizeObserver(resizeObserverCallback)
          const ro2 = new ResizeObserver(resizeObserverCallback)

          ro.observe(select__dropdown.value!)
          ro2.observe(selected__container.value!)
        }
      })
    }
)

</script>

<template>
  <div>
    <div class="label">
      <div>{{ label }}</div>
        <div class="select__container" v-click-outside="onClickOutside">
          <div
              tabindex="0"
              ref="selected__container"
              class="select__selected-container --multiple"
              :class="{
                '--open': isSelecting,
                '--inverse': inverseRender,
                '--has-errors': errors && errors[0]
              }"
              @click="onClickSelectedValue"
              @keyup.enter="onClickSelectedValue"
          >
            <div class="select__active-select">
              {{ selectedItemsCount ? 'Выбрано: ' + selectedItemsCount : '' }}
            </div>

          </div>
          <div
              v-if="props.componentData.isFilterable"
              class="select__search-input-container"
              :style="{top: topPxStyleInput}"
          >
            <input
                placeholder="Поиск.."
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
                ref="select__dropdown"
                class="select__dropdown"
                :class="{'--inverse': inverseRender}"
                v-scrollable="{classes: ['--without-track', '--smart-opacity']}"
            >
              <template v-if="props.componentData.isFilterable && filteredOptions.length > 0">
                <div
                    v-for="option in filteredOptions"
                    class="select__dropdown-option"
                    :class="{'select__dropdown-option_selected': selectedItems[option.id]}"
                    @mouseup="onMouseDownOnDropdownOption(option)"
                >{{ option.title }}</div>
              </template>
              <template v-else-if="!(props.componentData.isFilterable) && componentData.options.length > 0">
                <div
                    v-for="option in componentData.options"
                    :key="option.id"
                    class="select__dropdown-option"
                    :class="{'select__dropdown-option_selected': selectedItems[option.id]}"
                    @mouseup="onMouseDownOnDropdownOption(option)"
                >{{ option.title }}</div>
              </template>
              <div v-else class="select__dropdown-option --empty">Нет записей</div>
            </div>
          </div>
        </div>
        <div class="select__active-select_multiple --separated">
          <transition-group name="list">
            <div
                class="select__active-select-option"
                @click.stop.prevent
                v-for="(selectedItem, index) in selectedItems"
                :key="index"
            >
              <div class="select__active-select-option-title">
                {{ selectedItem.title }}
              </div>
              <div class="select__active-select-option-cancel" @click.stop="onClickCancel(index)">
                <svg>
                  <use xlink:href="/img/sprite.svg#cancel_cross_bold"></use>
                </svg>
              </div>
            </div>
          </transition-group>
        </div>
    </div>
    <div class="input__error">{{ errors && errors[0] ? errors[0] : null }}</div>
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