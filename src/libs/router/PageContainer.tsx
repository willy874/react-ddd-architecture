import { lazy, Suspense, useEffect, useMemo } from 'react'
import {
  useLocation,
  useNavigate,
  useParams,
  NavigateFunction as ReactNavigateFunction,
} from 'react-router-dom'
import { PageRouteComponentProps } from './types'
import { RemixRouterManager } from './RemixRouterManager'
import { getNavigate } from './methods'

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
        return router.awaitNavigate().then(component)
      })
    }
    return () => null
  }, [component, router])

  const reactNavigate: ReactNavigateFunction = useNavigate()
  useEffect(() => {
    router.updateNavigateFunction(reactNavigate)
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
