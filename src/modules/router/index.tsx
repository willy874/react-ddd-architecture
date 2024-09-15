import { useEffect } from 'react'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from 'react-router-dom'
import { ApplicationPlugin } from '@/core'
import NavigationGuards from './NavigationGuards'
import { LayoutManager } from './layoutManager'
import { RouterManager } from './routerManager'
import type { RouteObject } from 'react-router-dom'

const layoutManager = new LayoutManager()
const routerManager = new RouterManager()

function RootRouteComponent() {
  const Layout = layoutManager.getCurrentLayout()
  const navigate = useNavigate()

  useEffect(() => {
    routerManager.navigate = navigate
  }, [navigate])

  return (
    <NavigationGuards>
      <Layout>
        <Outlet />
      </Layout>
    </NavigationGuards>
  )
}

interface RouterPluginOptions {
  routes?: RouteObject[]
  basename?: string
}

export const RouterPlugin = (
  options: RouterPluginOptions,
): ApplicationPlugin => {
  const { routes = [], basename = '/' } = options
  return app => {
    routerManager.routes = [
      {
        id: 'root',
        path: '',
        element: <RootRouteComponent />,
        children: [
          //
          ...routes,
          //
        ],
      },
    ]
    layoutManager.onLayoutChange(() => app.query('render'))
    app.provider(
      'registerLayout',
      layoutManager.registerLayout.bind(layoutManager),
    )
    app.provider(
      'setCurrentLayout',
      layoutManager.setCurrentLayout.bind(layoutManager),
    )
    app.provider('routerPush', (to: string) => {
      routerManager.navigate(to)
    })
    app.provider('routerReplace', (to: string) => {
      routerManager.navigate(to, { replace: true })
    })
    app.provider('routerGo', (delta: number) => {
      routerManager.navigate(delta)
    })
    return {
      start: () => {
        app.query('setAppSlot', prev => {
          if (prev) {
            throw new Error(
              'RouterPlugin must be the first AppSlot in the chain',
            )
          }
          const router = createBrowserRouter(routerManager.routes, {
            basename,
          })
          return <RouterProvider router={router} />
        })
      },
    }
  }
}

declare module '@/core' {
  interface ApplicationService {
    routerPush: (to: string) => void
    routerReplace: (to: string) => void
    routerGo: (delta: number) => void
    setCurrentLayout: (type: string) => void
    registerLayout: (
      type: string,
      node: React.FC<{ children: React.ReactNode }>,
    ) => void
  }
}
