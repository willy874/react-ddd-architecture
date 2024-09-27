import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import type { Location, RouteObject } from 'react-router-dom'
import type { ApplicationPlugin } from '@/core'

import RootRouteComponent from './RootRouteComponent'

interface RouterPluginOptions {
  basename?: string
  onInit?: (
    rootRoute: RouteObject & {
      id: string
      path: string
      children: RouteObject[]
    },
  ) => void
}

const ROOT_ROUTE_ID = 'root'

export const RouterGuardPlugin = (
  options: RouterPluginOptions,
): ApplicationPlugin => {
  const { basename = '/', onInit } = options
  return app => {
    const ctx = app.getContext()
    const ROOT_ROUTE = {
      id: ROOT_ROUTE_ID,
      path: '',
      element: <RootRouteComponent app={app} />,
      children: [],
    }
    ctx.router.addRoutes(ROOT_ROUTE)
    onInit?.(ROOT_ROUTE)
    ctx.layout.onLayoutChange(() => app.query('render'))
    ctx.router.onRoutesChange(() => app.query('render'))
    return {
      start: () => {},
    }
  }
}

declare module '@/core' {
  interface ApplicationEvent {
    routeChange: (value: Location, oldValue: Location) => void
    beforeRouteChange: (value: Location) => void
  }
}
