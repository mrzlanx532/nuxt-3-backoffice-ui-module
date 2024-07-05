import { defineNuxtPlugin, onNuxtReady } from '#imports'

import NotificationManager from './plugins/notification'
import ModalManager from './plugins/modal'

import * as vClickOutside from 'click-outside-vue3'

import '@mrzlanx532/nuxt-3-custom-scroll-plugin/dist/css/common.css'
import '@mrzlanx532/nuxt-3-custom-scroll-plugin/dist/css/v-scrollable.css'
import '@mrzlanx532/nuxt-3-custom-scroll-plugin/dist/css/document-scroll.no-ssr.css'

import { Scrollable, DocumentScroll } from '@mrzlanx532/nuxt-3-custom-scroll-plugin'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vClickOutside)
  nuxtApp.vueApp.directive('scrollable', {
    mounted: function (el, binding) {
      new Scrollable(el, binding.value)
    }
  })

  onNuxtReady(async () => {
    window.documentScroll = new DocumentScroll

    try {
      new ResizeObserver(() => {
        window.documentScroll.updateScroll()
      }).observe(document.documentElement)
    } catch (e) {
      console.warn('Не удалось установить ResizeObserver для document')
    }
  })

  return {
    provide: {
      notification: new NotificationManager(),
      modal: new ModalManager(),
    },
  }
})
