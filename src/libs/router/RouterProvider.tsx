import { useMemo, useSyncExternalStore } from 'react'
import { RemixRouterManager } from './RemixRouterManager'
import { createReactRouter } from './createReactRouter'
import { RouterProvider as ReactRouterProvider } from 'react-router-dom'

interface RouterProviderProps {
  router: RemixRouterManager
}

export function RouterProvider({ router }: RouterProviderProps) {
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
