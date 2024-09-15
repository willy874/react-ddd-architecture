import { NavigateFunction, RouteObject } from 'react-router-dom'

export class RouterManager<R extends RouteObject> {
  routes: R[] = []
  navigate: NavigateFunction = () => {}

  findRoute(
    routes: R[],
    id: string,
    handler?: (routes: R[], index: number) => void,
  ) {
    let index = 0
    let current: R | undefined
    while (routes.length >= index) {
      current = routes[index]
      if (current?.id === id) {
        handler?.(routes, index)
        break
      }
      if (current?.children) {
        this.findRoute(current.children as R[], id, handler)
      }
      index++
    }
    return current
  }

  beforeAddRoutes(routes: R[], id: string) {
    this.findRoute(routes, id, (routes, index) => {
      routes.splice(index, 0, ...this.routes)
    })
  }

  afterAddRoutes(routes: R[], id: string) {
    this.findRoute(routes, id, (routes, index) => {
      routes.splice(index + 1, 0, ...this.routes)
    })
  }

  removeRoute(routes: R[], id: string) {
    this.findRoute(routes, id, (routes, index) => {
      routes.splice(index, 1)
    })
  }
}

export const routerManager = new RouterManager()
