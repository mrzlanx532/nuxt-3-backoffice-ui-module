<script setup lang="ts">
import { watch, ref, defineAsyncComponent, onMounted, getCurrentInstance, shallowRef } from 'vue'
import { useNuxtApp } from '#imports'

const componentFilename = ref(null)
const component = shallowRef(null)
const isPreset = ref(false)
const isPreventClickOverlay = ref(false)
const modalContainerClass = ref('')
const componentProps = ref({})
const modalEl: Ref<HTMLElement|null> = ref(null)
const modalContainerEl: Ref<HTMLElement|null> = ref(null)

const { $modal } = useNuxtApp()

onMounted(() => {
  $modal.componentFilename = componentFilename
  $modal.componentProps = componentProps
  $modal.isPreset = isPreset
  $modal.isPreventClickOverlay = isPreventClickOverlay
  $modal.instance = getCurrentInstance()
  $modal.modalContainerClass = modalContainerClass
})

watch(componentFilename, (name) => {

  if (name === null) {
    component.value = null
    window.onscroll = function () {}
    return
  }

  try {
    component.value = defineAsyncComponent( () => {
      if (isPreset.value) {
        return import(`./presets/${name}.vue`)
      }

      /** Для playground раскомментировать */
      //return import(`@/modals/${name}.vue`)

      return import(`../../../../../../../modals/${name}.vue`)
    })

    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft

    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop)
    }
  }
  catch (e) {
    console.error(e)
  }
})

const emit = defineEmits(['modal:close'])

const onOverlayClick = () => {

  if (isPreventClickOverlay.value) {
    return
  }

  componentFilename.value = null
  emit('modal:close')
}

const onResolve = (payload: unknown) => {

  componentFilename.value = null
  emit('modal:close')

  $modal.instance.resolve(payload)
}

const onReject = (payload: unknown) => {
  componentFilename.value = null
  emit('modal:close')

  $modal.instance.reject(payload)
}

const updateModalDimensions = () => {
  modalEl.value.style.height = document.documentElement.clientHeight + 'px'
  modalEl.value.style.width = document.documentElement.clientWidth + 'px'

  modalContainerEl.value.style.maxHeight = document.documentElement.clientHeight - 40 + 'px'
}

onMounted(() => {
  window.addEventListener('resize', updateModalDimensions)
  updateModalDimensions()
})
</script>

<template>
  <teleport to="#teleports">
      <div
        ref="modalEl"
        class="modal"
        :class="{'modal_active': componentFilename}"
      >
        <Transition>
          <div
            v-show="componentFilename"
            class="modal__overlay"
            @click="onOverlayClick"
          />
        </Transition>
        <div v-show="component !== null" ref="modalContainerEl" :class="['modal__container', modalContainerClass]" v-scrollable>
          <component
            :is="component"
            :data="componentProps"
            @modal:close="onOverlayClick"
            @modal:resolve="onResolve"
            @modal:reject="onReject"
          />
        </div>
      </div>
  </teleport>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity .5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-leave-from {
  opacity: 0.5;
}
</style>
