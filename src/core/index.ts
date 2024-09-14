export interface ApplicationContext {}

export interface ApplicationPluginOptions {
  start?: () => void
}

export type ApplicationPlugin = (
  ctx: ApplicationContext,
) => ApplicationPluginOptions

class Application {
  context = {} as ApplicationContext

  plugins: ApplicationPluginOptions[] = []

  use(plugin: ApplicationPlugin) {
    this.plugins = [...this.plugins, plugin(this.context)]
    return this
  }

  start() {
    this.plugins.forEach(plugin => {
      plugin.start?.()
    })
  }
}

export const app = new Application()
