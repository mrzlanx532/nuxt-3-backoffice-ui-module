import { defineNuxtModule, addPlugin, createResolver, addComponent, addImports } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { type NitroConfig } from 'nitropack'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

export * from './runtime/types'

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

    nuxt.hook('nitro:config', async (nitroConfig: NitroConfig) => {

      nitroConfig.publicAssets ||= []
      nitroConfig.publicAssets.push({
        dir: resolve('./runtime/public'),
        maxAge: 60 * 60 * 24 * 365,
      })
    })

    nuxt.options.css.push(resolve('./runtime/assets/css/style.css'))
    nuxt.options.css.push(resolve(`./runtime/assets/css/themes/${_options.theme}.css`))

    await addImportsByFolderRecursively(resolve('./runtime/composables'))

    addPlugin(resolve('./runtime/plugins'))
    addPlugin(resolve('./runtime/plugins/wangEditor.client'))

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
  },
})

async function addImportsByFolderRecursively(folderPath: string) {
  const files = await getFilesRecursively(folderPath)

  for (const file of files) {

    const filename = path.parse(file).name

    await addImports({
      name: filename,
      as: filename,
      from: file
    })
  }
}

async function getFilesRecursively(dir: string): Promise<string[]> {
  let files: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const subFiles = await getFilesRecursively(fullPath);
        files = files.concat(subFiles);

      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }

    return files

  } catch(error) {
    console.error("Failed to read directory:", error);
    return [];
  }
}
