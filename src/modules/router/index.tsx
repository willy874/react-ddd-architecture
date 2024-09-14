import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { ApplicationPlugin } from '@/core'
import NavigationGuards from './NavigationGuards'
import { layoutManager } from './layoutManager'
import type { RouteObject } from 'react-router-dom'

function RootRouteComponent() {
  const Layout = layoutManager.getCurrentLayout()
  return (
    <NavigationGuards>
      <Layout>
        <Outlet />
      </Layout>
    </NavigationGuards>
  )
}

interface RouterPluginOptions {
  routes: RouteObject[]
  basename?: string
}

export const RouterPlugin = (
  options: RouterPluginOptions,
): ApplicationPlugin => {
  return ctx => {
    const rootRoute: RouteObject = {
      id: 'root',
      path: '',
      Component: RootRouteComponent,
      children: options.routes,
    }
    const baseRoutes = [rootRoute]
    ctx.setCurrentLayout = layoutManager.setCurrentLayout
    ctx.registerLayout = layoutManager.registerLayout
    const router = createBrowserRouter(baseRoutes, {
      basename: options.basename || '/',
    })
    return {
      start: () => {
        ctx.setAppSlot(prev => {
          if (prev) {
            throw new Error(
              'RouterPlugin must be the first AppSlot in the chain',
            )
          }
          return <RouterProvider router={router} />
        })
      },
    }
  }
}

declare module '@/core' {
  interface ApplicationContext {
    setCurrentLayout: typeof layoutManager.setCurrentLayout
    registerLayout: typeof layoutManager.registerLayout
  }
}
