import { defineNuxtPlugin } from '#imports'

import NotificationManager from './classes/notification'
import ModalManager from './classes/modal'

import vClickOutside from 'click-outside-vue3/src/index'
import { vMaska } from 'maska'

import '@mrzlanx532/nuxt-3-custom-scroll-plugin/dist/css/common.css'
import '@mrzlanx532/nuxt-3-custom-scroll-plugin/dist/css/v-scrollable.css'

import { Scrollable } from '@mrzlanx532/nuxt-3-custom-scroll-plugin'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vClickOutside)
  nuxtApp.vueApp.directive('maska', vMaska)
  nuxtApp.vueApp.directive('scrollable', {
    mounted: function (el, binding) {
      el.scrollable_manager = new Scrollable(el, binding.value)
    },
    unmounted: function (el) {
      el.scrollable_manager.destroy()
    }
  })

  return {
    provide: {
      notification: new NotificationManager(),
      modal: new ModalManager(),
    },
  }
})
