<script setup lang="ts">
import { watch, ref, defineAsyncComponent, onMounted, getCurrentInstance, shallowRef } from 'vue'
import { useNuxtApp } from '#imports'

const componentFilename = ref(null)
const component = shallowRef(null)
const isPreset = ref(false)
const modalContainerClassModifier = ref(null)
const componentProps = ref({})

const { $modal } = useNuxtApp()

onMounted(() => {
  $modal.componentFilename = componentFilename
  $modal.componentProps = componentProps
  $modal.isPreset = isPreset
  $modal.instance = getCurrentInstance()
})

watch(componentFilename, (name) => {

  if (name === null) {
    component.value = null
    window.onscroll = function () {}
    return
  }

  try {
    const dynamicComponent = defineAsyncComponent( () => {
      if (isPreset.value) {
        return import(`./presets/${name}.vue`)
      }

      /** Для playground раскомментировать */
      //return import(`@/modals/${name}.vue`)

      return import(`../../../../../../modals/${name}.vue`)
    })

    modalContainerClassModifier.value = dynamicComponent?.parentClassModifier
    component.value = dynamicComponent

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
</script>

<template>
  <teleport to="#teleports">
      <div
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
        <div :class="['modal__container', modalContainerClassModifier]">
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
