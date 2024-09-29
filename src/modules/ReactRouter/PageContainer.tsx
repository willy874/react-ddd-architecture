import { lazy, Suspense, useEffect, useMemo } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import {
  getNavigate,
  RouterManager,
  PageRouteComponentProps,
  // RouteConfig,
} from '@/libs/router'

interface PageContainerProps {
  router: RouterManager
  // config: Omit<RouteConfig, 'component' | 'fallback'>
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
  const reactNavigate = useNavigate()
  const location = useLocation()
  const params = useParams()

  const Component = useMemo(() => {
    if (component) {
      return lazy(() => {
        return router.awaitNavigate().then(component)
      })
    }
    return () => null
  }, [component, router])
  useEffect(() => {
    router.updateNavigateFunction(reactNavigate)
  }, [reactNavigate, router])
  useEffect(() => {
    router.navigated(location)
  }, [location, router])

  const navigate = useMemo(() => getNavigate(router), [router])

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
