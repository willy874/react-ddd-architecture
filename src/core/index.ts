import { EventEmitter } from 'events'

export interface ApplicationContext {}

export interface ApplicationService {}

export interface ApplicationEvent {}

export interface ApplicationPluginOptions {
  start?: () => void
}

export type ApplicationPlugin = (ctx: Application) => ApplicationPluginOptions

export class Application {
  private emitter = new EventEmitter()
  private context: ApplicationContext
  private plugins: ApplicationPluginOptions[] = []

  constructor(context: ApplicationContext) {
    this.context = context
  }

  getContext() {
    return this.context
  }

  on<T extends keyof ApplicationEvent>(
    event: T,
    listener: ApplicationEvent[T],
  ): void
  on(event: string, listener: (...args: unknown[]) => void) {
    this.emitter.on(event, listener)
    return () => {
      this.emitter.off(event, listener)
    }
  }

  off<T extends keyof ApplicationEvent>(
    event: T,
    listener: ApplicationEvent[T],
  ): void
  off(event: string, listener: (...args: unknown[]) => void) {
    this.emitter.off(event, listener)
  }

  emit<T extends keyof ApplicationEvent>(
    event: T,
    ...args: Parameters<ApplicationEvent[T]>
  ): void
  emit(event: string, ...args: unknown[]) {
    this.emitter.emit(event, ...args)
  }

  query<T extends keyof ApplicationService>(
    type: T,
    ...params: Parameters<ApplicationService[T]>
  ): ReturnType<ApplicationService[T]>
  query(type: string, ...params: unknown[]) {
    const fail = Symbol('fail')
    let response: unknown = fail
    this.emitter.once(`provider:${type}`, params => {
      response = params
    })
    this.emitter.emit(`query:${type}`, ...params)
    if (fail === response) {
      throw new Error(`No provider for query type: ${type}`)
    }
    return response
  }

  provider<T extends keyof ApplicationService>(
    type: T,
    handler: ApplicationService[T],
  ): void
  provider(type: string, handler: (...params: unknown[]) => unknown) {
    const provider = (...params: unknown[]) => {
      this.emitter.emit(`provider:${type}`, handler(...params))
    }
    this.emitter.on(`query:${type}`, provider)
    return () => {
      this.emitter.off(`query:${type}`, provider)
    }
  }

  use(plugin: ApplicationPlugin) {
    this.plugins = [...this.plugins, plugin(this)]
    return this
  }

  start(cb?: () => void) {
    this.plugins.forEach(plugin => {
      plugin.start?.()
    })
    cb?.()
  }
}
