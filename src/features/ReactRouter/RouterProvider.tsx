import { useMemo, useSyncExternalStore } from 'react'
import { RouterProvider as ReactRouterProvider } from 'react-router-dom'
import { RouterManager } from '@/libs/router'
import { createReactRouter } from './createReactRouter'

interface RouterProviderProps {
  router: RouterManager
}

export default function RouterProvider({ router }: RouterProviderProps) {
  const routes = useSyncExternalStore(
    (cb) => router.onRoutesChange(cb),
    () => router.getRoutes(),
  )
  const reactRouter = useMemo(
    () => createReactRouter(router, routes),
    [router, routes],
  )
  return <ReactRouterProvider router={reactRouter} />
}
