<script setup lang="ts">
import { useSlots } from 'vue'
import { useNuxtApp } from '#imports'

const emit = defineEmits([
  'close',
  'itemUpdated'
])

const props = withDefaults(defineProps<{
  dataId: number|null,
  urlPrefix: string,
  detailPageUrlPrefix?: string,
  titleProperty?: string,
  subtitleProperty?: string,
}>(), {
  titleProperty: 'id'
})

const {
  $authFetch
} = useNuxtApp()

const isLoading = ref(false)
const isClosing = ref(false)
const setTimeoutInstance = ref(null)

type IItem = {[key: string]: any}

const item: IItem  = ref({})

const slots = useSlots()

watch(
    () => props.dataId,
    (newValue) => {

      if (setTimeoutInstance.value) {
        clearTimeout(setTimeoutInstance.value)
      }

      if (newValue === null) {
        item.value = {}

        isClosing.value = true

        setTimeout(() => {
          isClosing.value = false
        }, 500)
        return
      }

      fetchData()
    }
)

const fetchData = async () => {
  isLoading.value = true

  try {
    item.value = await $authFetch(props.urlPrefix, {
      params: {
        id: props.dataId
      }
    })

  } catch (err) {
    throw err
  }

  isLoading.value = false

  emit('itemUpdated', item.value)
}

const onClickCloseButton = () => {
  emit('close');
}

defineExpose({
  fetchData
})
</script>

<template>
  <div
      class="browser-detail"
      :class="[
        {'browser-detail_open': dataId !== null},
        {'browser-detail_loading': isLoading},
        {'browser-detail_closing': isClosing},
      ]"
  >
    <div class="browser-detail__container" :class="[
        {'browser-detail__container_open': dataId !== null && !isLoading},
        {'browser-detail__container_closing': isClosing}
        ]">
        <div class="browser-detail__header">
          <div class="browser-detail__header-first-row">
            <template v-if="slots.header_top">
              <slot name="header_top"/>
              <div class="browser-detail__header-buttons">
                <div class="browser-detail__header-close-button" @click="onClickCloseButton">
                  <svg>
                    <use xlink:href="/img/sprite.svg#cancel_cross" />
                  </svg>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="browser-detail__header-title-container">
                <div class="browser-detail__header-title">
                  {{ item[titleProperty]}}
                </div>
                <div class="browser-detail__header-subtitle">
                  {{ subtitleProperty ? item[subtitleProperty] : null }}
                </div>
              </div>
              <div class="browser-detail__header-buttons">
                <div class="browser-detail__header-more-button" v-if="detailPageUrlPrefix">
                  <NuxtLink :to="detailPageUrlPrefix">
                    <svg stroke="currentColor" class="feather feather-external-link">
                      <use xlink:href="/img/sprite.svg#more_button"/>
                    </svg>
                  </NuxtLink>
                </div>
                <div class="browser-detail__header-close-button" @click="onClickCloseButton">
                  <svg>
                    <use xlink:href="/img/sprite.svg#cancel_cross" />
                  </svg>
                </div>
              </div>
            </template>
          </div>
          <div class="browser-detail__header-second-row" v-if="slots.header">
            <slot name="header"/>
          </div>
        </div>
        <div class="browser-detail__content v-scrollable" v-scrollable>
          <slot name="content"/>
        </div>
    </div>
  </div>
</template>