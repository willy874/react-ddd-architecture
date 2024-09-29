import { EventEmitter } from 'events'
import { RouteConfig, RouteLocation, RouteTo } from './types'

const BEFORE_ROUTE_CHANGE = 'beforeRouteChange'
const AFTER_ROUTE_CHANGE = 'afterRouteChange'
const ROUTES_CHANGE = 'routesChange'

export class RouterEventEmitter {
  private emitter = new EventEmitter()

  emitBeforeRouteChange(to: RouteTo | number, from: RouteLocation) {
    this.emitter.emit(BEFORE_ROUTE_CHANGE, to, from)
  }

  onBeforeRouteChange(
    callback: (to: RouteTo | number, from: RouteLocation) => void,
  ) {
    this.emitter.on(BEFORE_ROUTE_CHANGE, callback)
    return () => {
      this.emitter.off(BEFORE_ROUTE_CHANGE, callback)
    }
  }

  emitAfterRouteChange(to: RouteLocation, from: RouteLocation) {
    this.emitter.emit(AFTER_ROUTE_CHANGE, to, from)
  }

  onAfterRouteChange(
    callback: (to: RouteLocation, from: RouteLocation) => void,
  ) {
    this.emitter.on(AFTER_ROUTE_CHANGE, callback)
    return () => {
      this.emitter.off(AFTER_ROUTE_CHANGE, callback)
    }
  }

  emitRoutesChange(routes: RouteConfig[]) {
    this.emitter.emit(ROUTES_CHANGE, routes)
  }

  onRoutesChange(callback: (routes: RouteConfig[]) => void) {
    this.emitter.on(ROUTES_CHANGE, callback)
    return () => {
      this.emitter.off(ROUTES_CHANGE, callback)
    }
  }
}
