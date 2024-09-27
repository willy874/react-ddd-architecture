import {
  NonIndexRouteObject,
  IndexRouteObject,
  To,
  Location,
} from 'react-router-dom'

export interface NavigateRoute {
  id: string
  params?: Record<string, string | null>
  query?: Record<string, string> | string[][]
  replace?: boolean
}

export interface PathNavigateRoute {
  path: string
  replace?: boolean
}

export interface NavigateFunction {
  (to: string): Promise<void>
  (to: number): Promise<void>
  (to: PathNavigateRoute): Promise<void>
  (to: NavigateRoute): Promise<void>
  (to: string | number | PathNavigateRoute | NavigateRoute): Promise<void>
}

export interface PageRouteComponentProps {
  path: string
  params: Record<string, string | undefined>
  query: URLSearchParams
  navigate: NavigateFunction
}

interface NonIndexRouteConfig
  extends Omit<NonIndexRouteObject, 'id' | 'element'> {
  id: string
  component?: () => Promise<{
    default: React.ComponentType<PageRouteComponentProps>
  }>
  fallback?: React.ReactNode
  children?: RouteConfig[]
}

interface IndexRouteConfig extends Omit<IndexRouteObject, 'id' | 'element'> {
  id: string
  component?: () => Promise<{
    default: React.ComponentType<PageRouteComponentProps>
  }>
  fallback?: React.ReactNode
}

export type RouteConfig = NonIndexRouteConfig | IndexRouteConfig

export interface RouterInterceptor {
  beforeRouteChange: ((to: To | number, from: Location) => Promise<To>)[]
  afterRouteChange: ((to: Location, from: Location) => Promise<Location>)[]
}
