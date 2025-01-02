import { defineNuxtModule, addPlugin, createResolver, addComponent } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { type NitroConfig } from 'nitropack'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'backoffice-ui',
    configKey: 'backofficeUI',
  },
  defaults: {},
  async setup(_options: ModuleOptions, nuxt: Nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.hook('nitro:config', async (nitroConfig: NitroConfig) => {

      nitroConfig.publicAssets ||= []
      nitroConfig.publicAssets.push({
        dir: resolve('./runtime/public'),
        maxAge: 60 * 60 * 24 * 365,
      })
    })

    nuxt.options.css.push(resolve('./runtime/assets/css/style.css'))

    await addComponent({
      name: 'Notification',
      filePath: resolve('./runtime/components/Notification.vue'),
    })

    await addComponent({
      name: 'Modal',
      filePath: resolve('./runtime/components/modal/Modal.vue'),
    })

    await addComponent({
      name: 'SideMenu',
      filePath: resolve('./runtime/components/base/SideMenu.vue'),
    })

    addPlugin(resolve('./runtime/plugins'))
  },
})
