import { ApplicationPlugin } from '@/core'
import {
  getNavigate,
  NavigateFunction,
  RemixRouterManager,
  RouteConfig,
  RouterProvider,
} from '@/libs/router'

export function createRouter(routes: RouteConfig[]) {
  const router = new RemixRouterManager(routes)
  return {
    ReactRouterPlugin: function plugin(): ApplicationPlugin {
      return (app) => {
        app.provider('navigate', getNavigate(router))
        app.provider('updateRoutes', router.updateRoutes.bind(router))
        return {
          name: 'ReactRouterPlugin',
        }
      }
    },
    RouterProvider: () => <RouterProvider router={router} />,
  }
}

declare module '@/core' {
  interface ApplicationService {
    navigate: NavigateFunction
    updateRoutes: (
      iteratee: (
        item: RouteConfig,
        index: number,
        routes: RouteConfig[],
      ) => RouteConfig | RouteConfig[] | void,
    ) => RouteConfig[]
  }
}
