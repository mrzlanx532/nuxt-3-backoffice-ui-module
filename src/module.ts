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

    nuxt.options.css.push(resolver.resolve('./runtime/style.css'))

    await addComponent({
      name: 'Notification',
      filePath: resolver.resolve('./runtime/components/Notification.vue'),
    })

    addPlugin(resolver.resolve('./runtime/plugins'))
  },
})
