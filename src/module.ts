import { defineNuxtModule, addPlugin, createResolver, addComponent, addImports, addImportsDir } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { type NitroConfig } from 'nitropack'

export type * from './runtime/types'

export const enum Theme {
  DEFAULT = 'default',
  ALT1 = 'alt1',
  ALT2 = 'alt2',
}

export interface ModuleOptions {
  theme: Theme
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'backoffice-ui',
    configKey: 'backofficeUI',
  },
  defaults: {
    theme: Theme.DEFAULT
  },
  async setup(_options: ModuleOptions, nuxt: Nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.alias['#backoffice-ui'] = resolve('./runtime')

    nuxt.hook('nitro:config', async (nitroConfig: NitroConfig) => {

      nitroConfig.publicAssets ||= []
      nitroConfig.publicAssets.push({
        dir: resolve('./runtime/public'),
        maxAge: 60 * 60 * 24 * 365,
      })
    })

    nuxt.options.css.push(resolve('./runtime/assets/css/style.css'))
    nuxt.options.css.push(resolve(`./runtime/assets/css/themes/${_options.theme}.css`))

    await addImportsDir(resolve('./runtime/composables'))

    addPlugin(resolve('./runtime/plugins'))
    addPlugin(resolve('./runtime/plugins/wangEditor.client'))

    await addComponent({
      name: 'Notification',
      filePath: resolve('./runtime/components/Notification.vue'),
    })

    await addComponent({
      name: 'Modal',
      filePath: resolve('./runtime/components/Modal.vue'),
    })

    await addComponent({
      name: 'SideMenu',
      filePath: resolve('./runtime/components/SideMenu.vue'),
    })
  },
})
