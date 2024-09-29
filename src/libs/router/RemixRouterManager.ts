import { RouteConfig, RouterInterceptor } from './types'
import type {
  Location,
  NavigateFunction,
  To,
  NavigateOptions,
} from 'react-router-dom'
import { RouterEventEmitter } from './RouterEventEmitter'
import { mapTree } from './utils'

export class RemixRouterManager extends RouterEventEmitter {
  private routes: RouteConfig[] = []
  private navigateFunction: NavigateFunction = () => {}
  private prevRoute: Location | null = null
  private currentRoute: Location = {
    state: {},
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    key: 'default',
  }
  private interceptor: RouterInterceptor = {
    beforeRouteChange: [],
    afterRouteChange: [],
  }

  private promise: Promise<void> = Promise.resolve()
  private resolve: () => void = () => {}

  constructor(routes: RouteConfig[]) {
    super()
    this.routes = routes
  }

  awaitNavigate() {
    return Promise.resolve(this.promise)
  }

  getRoutes() {
    return this.routes
  }

  updateNavigateFunction(navigate: NavigateFunction) {
    this.navigateFunction = navigate
  }

  async beforeRouteChange(to: To | number, from: Location) {
    let isRedirect = false
    let newTo = to
    for (const interceptor of this.interceptor.beforeRouteChange) {
      const current = await interceptor(to, from)
      if (to !== current) {
        newTo = current
        isRedirect = true
      }
      if (isRedirect) {
        break
      }
    }
    if (isRedirect) {
      this.navigate(newTo)
    }
  }

  async afterRouteChange(to: Location, from: Location) {
    const base = {
      pathname: to.pathname,
      search: to.search,
      hash: to.hash,
    }
    let current = to
    for (const interceptor of this.interceptor.afterRouteChange) {
      current = await interceptor(current, from)
    }
    if (
      base.pathname !== current.pathname ||
      base.search !== current.search ||
      base.hash !== current.hash
    ) {
      this.navigate(current)
    }
  }

  async navigate(to: To | number, options?: NavigateOptions) {
    this.promise = new Promise((resolve) => {
      this.resolve = resolve
    })
    this.emitBeforeRouteChange(to, this.currentRoute)
    await this.beforeRouteChange(to, this.currentRoute)
    if (typeof to === 'number') {
      this.navigateFunction(to)
    } else {
      this.navigateFunction(to, options)
    }
    return Promise.resolve(this.promise)
  }

  async navigated(current: Location) {
    this.prevRoute = this.currentRoute
    this.currentRoute = current
    await this.afterRouteChange(this.currentRoute, this.prevRoute)
    this.resolve()
    this.emitRouteChange(this.currentRoute, this.prevRoute)
  }

  nextPath(current: string, add?: string): string {
    if (add) {
      return (current + add)
        .replace(/\/\.\//, '/') // remove /./
        .replace(/\/\//, '/') // remove //
        .replace(/\/.+\/\.\.\//, '/') // remove /{path}/../
    }
    return current
  }

  findRoute<R extends { path?: string; id?: string; children?: unknown }>(
    routes: R[],
    id: string,
    handler?: (item: R, index: number, routes: R[]) => void,
    path = '/',
  ): (R & { path: string }) | undefined {
    let index = 0
    let current: R | undefined
    while (routes.length >= index) {
      current = routes[index]
      if (current?.id === id) {
        handler?.(current, index, routes)
        break
      }
      if (current?.children) {
        const nextPath = this.nextPath(path, current.path)
        this.findRoute(current.children as R[], id, handler, nextPath)
      }
      index++
    }
    if (current) {
      return Object.assign(current, { path })
    }
    return current
  }

  updateRoutes(
    iteratee: (
      item: RouteConfig,
      index: number,
      routes: RouteConfig[],
    ) => RouteConfig | RouteConfig[] | void,
  ) {
    const routes = mapTree(this.routes, iteratee)
    this.emitRoutesChange(routes)
    return routes
  }
}
