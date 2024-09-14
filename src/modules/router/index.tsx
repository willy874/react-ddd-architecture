import { ApplicationPlugin } from '@/core'
import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router-dom'
import NavigationGuards from './NavigationGuards'

interface RouterPluginOptions {
  routes: RouteObject[]
  basename?: string
}

export const RouterPlugin = (
  options: RouterPluginOptions,
): ApplicationPlugin => {
  return ctx => {
    const router = createBrowserRouter(
      [
        {
          path: '/',
          element: <NavigationGuards />,
          children: options.routes,
        },
      ],
      { basename: options.basename || '/' },
    )
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
  interface ApplicationContext {}
}
