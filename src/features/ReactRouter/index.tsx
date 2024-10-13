import { ApplicationPlugin } from '@/core'
import { RemixRouterManager, getNavigate } from '@/libs/router'
import type {
  RouterManager,
  AfterRouteChangeInterceptor,
  BeforeRouteChangeInterceptor,
  NavigateFunction,
  RouteConfig,
} from '@/libs/router'
import RouterProvider from './RouterProvider'

interface ReactRouterPluginOptions {
  beforeRouteChange?: BeforeRouteChangeInterceptor
  afterRouteChange?: AfterRouteChangeInterceptor
}

export function initRouterModule(routes: RouteConfig[]) {
  const router = new RemixRouterManager(routes)
  return {
    ReactRouterPlugin: function (
      options: ReactRouterPluginOptions = {},
    ): ApplicationPlugin {
      return (app) => {
        if (options.beforeRouteChange) {
          router.addBeforeRouteChangeInterceptor(options.beforeRouteChange)
        }
        if (options.afterRouteChange) {
          router.addAfterRouteChangeInterceptor(options.afterRouteChange)
        }
        app.provider('navigate', getNavigate(router))
        app.provider('updateRoutes', router.updateRoutes.bind(router))
        router.onBeforeRouteChange((to, from) => {
          app.emit('beforeRouteChange', to, from)
        })
        router.onAfterRouteChange((to, from) => {
          app.emit('afterRouteChange', to, from)
        })
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
  interface ApplicationEvent {
    beforeRouteChange: RouterManager['emitBeforeRouteChange']
    afterRouteChange: RouterManager['emitAfterRouteChange']
  }
}
