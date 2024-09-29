import { ApplicationPlugin } from '@/core'
import { RemixRouterManager } from './RemixRouterManager'
import { NavigateFunction, RouteConfig } from './types'
import { getNavigate } from './methods'
import { RouterProvider } from './RouterProvider'

interface ReactRouterPluginOptions {
  router: RemixRouterManager
}

function ReactRouterPlugin({
  router,
}: ReactRouterPluginOptions): ApplicationPlugin {
  return (app) => {
    app.provider('navigate', getNavigate(router))
    return {}
  }
}

export function createRouter(routes: RouteConfig[]) {
  const router = new RemixRouterManager(routes)
  return {
    plugin: ReactRouterPlugin({ router }),
    RouterProvider: () => <RouterProvider router={router} />,
  }
}

declare module '@/core' {
  interface ApplicationService {
    navigate: NavigateFunction
  }
}

export type { RouteConfig } from './types'
