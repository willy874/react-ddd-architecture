import { EventEmitter } from 'events'
import { NavigateFunction, RouteObject } from 'react-router-dom'

const BEFORE_ROUTE_CHANGE = 'beforeRouteChange'
const ROUTES_CHANGE = 'routesChange'

export class RouterManager<Route extends RouteObject> {
  private routes: Route[] = []
  private navigate: NavigateFunction = () => {}
  private emitter = new EventEmitter()

  getRoutes() {
    return this.routes
  }

  setNavigate(navigate: NavigateFunction) {
    this.navigate = navigate
  }

  findRoute(
    routes: Route[],
    id: string,
    handler?: (item: Route, index: number, routes: Route[]) => void,
  ) {
    let index = 0
    let current: Route | undefined
    while (routes.length >= index) {
      current = routes[index]
      if (current?.id === id) {
        handler?.(current, index, routes)
        break
      }
      if (current?.children) {
        this.findRoute(current.children as Route[], id, handler)
      }
      index++
    }
    return current
  }

  addRoutes<R extends Route>(...newRoutes: R[]) {
    this.routes.push(...newRoutes)
    this.emitter.emit(ROUTES_CHANGE, this.routes)
    return newRoutes
  }

  addRouteChild<R extends Route>(id: string, ...newRoutes: R[]) {
    this.findRoute(this.routes, id, item => {
      if (item.children) {
        item.children.push(...newRoutes)
      } else {
        item.children = newRoutes
      }
    })
    this.emitter.emit(ROUTES_CHANGE, this.routes)
    return newRoutes
  }

  beforeAddRoutes<R extends Route>(id: string, ...newRoutes: R[]) {
    this.findRoute(this.routes, id, (_, index, routes) => {
      routes.splice(index, 0, ...newRoutes)
    })
    this.emitter.emit(ROUTES_CHANGE, this.routes)
    return newRoutes
  }

  afterAddRoutes<R extends Route>(id: string, ...newRoutes: R[]) {
    this.findRoute(this.routes, id, (_, index, routes) => {
      routes.splice(index + 1, 0, ...newRoutes)
    })
    this.emitter.emit(ROUTES_CHANGE, this.routes)
    return newRoutes
  }

  removeRoute(id: string) {
    this.findRoute(this.routes, id, (_, index, routes) => {
      routes.splice(index, 1)
    })
    this.emitter.emit(ROUTES_CHANGE, this.routes)
  }

  onRoutesChange(callback: (routes: Route[]) => void) {
    this.emitter.on(ROUTES_CHANGE, callback)
    return () => {
      this.emitter.off(ROUTES_CHANGE, callback)
    }
  }

  push(to: string) {
    this.emitter.emit(BEFORE_ROUTE_CHANGE, to)
    this.navigate(to)
  }

  replace(to: string) {
    this.emitter.emit(BEFORE_ROUTE_CHANGE, to)
    this.navigate(to, { replace: true })
  }

  go(delta: number) {
    this.emitter.emit(BEFORE_ROUTE_CHANGE, delta)
    this.navigate(delta)
  }

  onBeforeRouteChange(callback: (to: string | number) => void) {
    this.emitter.on(BEFORE_ROUTE_CHANGE, callback)
    return () => {
      this.emitter.off(BEFORE_ROUTE_CHANGE, callback)
    }
  }
}
