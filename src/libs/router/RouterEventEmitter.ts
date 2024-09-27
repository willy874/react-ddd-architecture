import { EventEmitter } from 'events'
import { RouteConfig } from './types'
import { To, Location } from 'react-router-dom'

const BEFORE_ROUTE_CHANGE = 'beforeRouteChange'
const ROUTE_CHANGE = 'routeChange'
const ROUTES_CHANGE = 'routesChange'

export class RouterEventEmitter {
  private emitter = new EventEmitter()

  emitBeforeRouteChange(to: To | number, from: Location) {
    this.emitter.emit(BEFORE_ROUTE_CHANGE, to, from)
  }

  onBeforeRouteChange(callback: (to: To | number, from: Location) => void) {
    this.emitter.on(BEFORE_ROUTE_CHANGE, callback)
    return () => {
      this.emitter.off(BEFORE_ROUTE_CHANGE, callback)
    }
  }

  emitRouteChange(to: Location, from: Location) {
    this.emitter.emit(ROUTE_CHANGE, to, from)
  }

  onRouteChange(callback: (to: Location, from: Location) => void) {
    this.emitter.on(ROUTE_CHANGE, callback)
    return () => {
      this.emitter.off(ROUTE_CHANGE, callback)
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
