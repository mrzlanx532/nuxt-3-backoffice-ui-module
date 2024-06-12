import { defineNuxtModule, addPlugin, createResolver, addComponent } from '@nuxt/kit'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'backoffice-ui',
    configKey: 'backofficeUI',
  },
  defaults: {},
  async setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.hook('nitro:config', async (nitroConfig) => {
      nitroConfig.publicAssets ||= []
      nitroConfig.publicAssets.push({
        dir: resolver.resolve('./runtime/public'),
        maxAge: 60 * 60 * 24 * 365
      })
    })

    nuxt.options.css.push(resolver.resolve('./runtime/assets/scss/style.scss'))

    await addComponent({
      name: 'Notification',
      filePath: resolver.resolve('./runtime/components/Notification.vue'),
    })

    await addComponent({
      name: 'Modal',
      filePath: resolver.resolve('./runtime/components/modal/Modal.vue'),
    })

    addPlugin(resolver.resolve('./runtime/plugins'))
  },
})
