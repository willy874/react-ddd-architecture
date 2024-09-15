import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import type { Location, RouteObject } from 'react-router-dom'

import { ApplicationPlugin } from '@/core'
import { routerManager } from '@/libs/router'
import { layoutManager } from '@/libs/layout'

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
    const ROOT_ROUTE = {
      id: ROOT_ROUTE_ID,
      path: '',
      element: <RootRouteComponent app={app} />,
      children: [],
    }
    routerManager.addRoutes(ROOT_ROUTE)
    onInit?.(ROOT_ROUTE)
    layoutManager.onLayoutChange(() => app.query('render'))
    routerManager.onRoutesChange(() => app.query('render'))
    return {
      start: () => {
        app.query('setAppSlot', prev => {
          if (prev) {
            throw new Error(
              'RouterPlugin must be the first AppSlot in the chain',
            )
          }
          const router = createBrowserRouter(routerManager.getRoutes(), {
            basename,
          })
          return <RouterProvider router={router} />
        })
      },
    }
  }
}

declare module '@/core' {
  interface ApplicationEvent {
    routeChange: (value: Location, oldValue: Location) => void
    beforeRouteChange: (value: Location) => void
  }
}
