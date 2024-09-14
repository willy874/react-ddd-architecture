import { useEffect } from 'react'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from 'react-router-dom'
import { ApplicationContext, ApplicationPlugin } from '@/core'
import NavigationGuards from './NavigationGuards'
import { layoutManager } from './layoutManager'
import { routerManager } from './routerManager'
import type { RouteObject } from 'react-router-dom'

interface RootRouteComponentProps {
  appContext: ApplicationContext
}

function RootRouteComponent({ appContext }: RootRouteComponentProps) {
  const Layout = layoutManager.getCurrentLayout()
  const navigate = useNavigate()

  useEffect(() => {
    appContext.routerPush = (to: string) => navigate(to)
    appContext.routerReplace = (to: string) => navigate(to, { replace: true })
    appContext.routerGo = navigate
  }, [appContext, navigate])

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
  return ctx => {
    routerManager.routes = [
      {
        id: 'root',
        path: '',
        element: <RootRouteComponent appContext={ctx} />,
        children: [
          //
          ...routes,
          //
        ],
      },
    ]
    layoutManager.onLayoutChange(() => ctx.render())
    ctx.setCurrentLayout = layoutManager.setCurrentLayout.bind(layoutManager)
    ctx.registerLayout = layoutManager.registerLayout.bind(layoutManager)
    return {
      start: () => {
        ctx.setAppSlot(prev => {
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
  interface ApplicationContext {
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
