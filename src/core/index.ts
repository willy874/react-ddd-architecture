export interface ApplicationContext {}

export interface ApplicationPluginOptions {}

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
}

export const app = new Application()
