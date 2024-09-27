import { lazy, Suspense, useEffect, useMemo } from 'react'
import {
  useLocation,
  useNavigate,
  generatePath,
  useParams,
  NavigateFunction as ReactNavigateFunction,
} from 'react-router-dom'
import {
  NavigateRoute,
  PageRouteComponentProps,
  NavigateFunction,
} from './types'
import { RemixRouterManager } from './RemixRouterManager'

function toUrl(path: string, options: Omit<NavigateRoute, 'id' | 'replace'>) {
  const { params, query } = options
  let url = path
  if (params) url = generatePath(url, params)
  if (query) url = url + '?' + new URLSearchParams(query).toString()
  return url
}

function getNavigate(router: RemixRouterManager) {
  const navigate: NavigateFunction = to => {
    if (typeof to === 'string') {
      return router.navigate(to)
    }
    if (typeof to === 'number') {
      return router.navigate(to)
    }
    if ('id' in to) {
      const { params, query, replace = false } = to
      const route = router.findRoute(router.routes, to.id)
      if (!route) {
        throw new Error(`Route with id "${to.id}" not found`)
      }
      const url = toUrl(route.path, { params, query })
      return router.navigate(url, { replace })
    }
    if (to.path) {
      const { replace = false } = to
      return router.navigate(to.path, { replace })
    }
    throw new Error(`Invalid route.`)
  }
  return navigate
}

interface PageContainerProps {
  router: RemixRouterManager
  fallback?: React.ReactNode
  component?: () => Promise<{
    default: React.ComponentType<PageRouteComponentProps>
  }>
}

export default function PageContainer({
  router,
  fallback,
  component,
}: PageContainerProps) {
  const Component = useMemo(() => {
    if (component) {
      return lazy(() => {
        const promise = router.promise
        return Promise.resolve(promise).then(component)
      })
    }
    return () => null
  }, [component, router])

  const reactNavigate: ReactNavigateFunction = useNavigate()
  useEffect(() => {
    router.navigateFunction = reactNavigate
  }, [reactNavigate, router])

  const location = useLocation()
  useEffect(() => {
    router.navigated(location)
  }, [location, router])

  const navigate = useMemo(() => getNavigate(router), [router])

  const params = useParams()
  const route = useMemo<PageRouteComponentProps>(() => {
    const { pathname, search } = location
    return {
      path: pathname,
      params,
      query: new URLSearchParams(search),
      navigate,
    }
  }, [location, navigate, params])

  return (
    <Suspense fallback={fallback}>
      <Component {...route} />
    </Suspense>
  )
}
