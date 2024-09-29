import { createBrowserRouter, RouteObject } from 'react-router-dom'
import { RouteConfig, RouterManager } from '@/libs/router'
import PageContainer from './PageContainer'
import { mapTree } from '@/libs/utils/tree'

export function routeConfigResolver(
  router: RouterManager,
): (route: RouteConfig) => RouteObject {
  return (route) => {
    const { component, fallback, ...rest } = route
    return {
      ...rest,
      element: (
        <PageContainer
          // config={rest}
          router={router}
          fallback={fallback}
          component={component}
        />
      ),
    }
  }
}

export function createReactRouter(
  router: RouterManager,
  routes: RouteConfig[],
) {
  return createBrowserRouter(mapTree(routes, routeConfigResolver(router)))
}
