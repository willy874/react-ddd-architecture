import { createBrowserRouter, RouteObject } from 'react-router-dom'
import { RemixRouterManager } from './RemixRouterManager'
import { mapTree } from './utils'
import { RouteConfig } from './types'
import PageContainer from './PageContainer'

export function routeConfigResolver(
  router: RemixRouterManager,
): (route: RouteConfig) => RouteObject {
  return route => {
    const { component, fallback, ...rest } = route
    return {
      ...rest,
      element: (
        <PageContainer
          router={router}
          fallback={fallback}
          component={component}
        />
      ),
    }
  }
}

export function createRouter(router: RemixRouterManager) {
  return createBrowserRouter(
    mapTree(router.routes, routeConfigResolver(router)),
  )
}
