import { generatePath } from 'react-router-dom'
import { NavigateRoute, NavigateFunction, RouterManager } from './types'

function toUrl(path: string, options: Omit<NavigateRoute, 'id' | 'replace'>) {
  const { params, query } = options
  let url = path
  if (params) url = generatePath(url, params)
  if (query) url = url + '?' + new URLSearchParams(query).toString()
  return url
}

export function getNavigate(router: RouterManager) {
  const navigate: NavigateFunction = (to) => {
    if (typeof to === 'string') {
      return router.navigate(to)
    }
    if (typeof to === 'number') {
      return router.navigate(to)
    }
    if ('id' in to) {
      const { params, query, replace = false } = to
      const route = router.findRoute(router.getRoutes(), to.id)
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
