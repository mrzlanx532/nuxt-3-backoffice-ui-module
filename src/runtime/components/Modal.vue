<script setup lang="ts">
import { watch, ref, onMounted, getCurrentInstance, shallowRef, useTemplateRef } from 'vue'
import { useNuxtApp } from '#imports'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

const emit = defineEmits(['modal:close'])

const component = shallowRef(null)
const isPreventClickOverlay = ref(false)
const modalContainerClass = ref('')
const componentProps = ref({})

const modalEl = useTemplateRef<HTMLDivElement>('modalEl')
const modalContainerEl = useTemplateRef<HTMLDivElement>('modalContainerEl')

const { $modal } = useNuxtApp()

watch(component, (_component) => {

  if (_component === null) {
    window.onscroll = function () {}
    return
  }

  try {
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

const closeModal = () => {
  const os = modalContainerEl.value?.osInstance()
  os.elements().content.scrollTop = 0

  component.value = null
  emit('modal:close')
}

const onOverlayClick = () => {
  if (isPreventClickOverlay.value) {
    return
  }

  closeModal()
}

const onClose = () => {
  closeModal()
}

const onResolve = (payload: unknown) => {
  closeModal()
  $modal.instance.resolve(payload)
}

const onReject = (payload: unknown) => {
  closeModal()
  $modal.instance.reject(payload)
}

const updateModalDimensions = () => {
  if (!modalEl.value) {
    return
  }

  modalEl.value.style.height = document.documentElement.clientHeight + 'px'
  modalEl.value.style.width = document.documentElement.clientWidth + 'px'

  modalContainerEl.value.getElement().style.maxHeight = document.documentElement.clientHeight - 40 + 'px'
}

onMounted(() => {
  $modal.component = component
  $modal.componentProps = componentProps
  $modal.isPreventClickOverlay = isPreventClickOverlay
  $modal.instance = getCurrentInstance()
  $modal.modalContainerClass = modalContainerClass

  window.addEventListener('resize', updateModalDimensions)
  updateModalDimensions()
})
</script>

<template>
  <teleport to="#teleports">
      <div
        ref="modalEl"
        class="modal"
        :class="{'modal_active': component}"
      >
        <Transition>
          <div
            v-show="component"
            class="modal__overlay"
            @click="onOverlayClick"
          />
        </Transition>
        <OverlayScrollbarsComponent
          v-show="component"
          ref="modalContainerEl"
          :class="['modal__container', modalContainerClass]"
        >
          <component
            :is="component"
            :data="componentProps"
            @modal:close="onClose"
            @modal:resolve="onResolve"
            @modal:reject="onReject"
          />
        </OverlayScrollbarsComponent>
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
