import {
  NonIndexRouteObject,
  IndexRouteObject,
  To,
  Location,
  NavigateFunction as ReactNavigateFunction,
  NavigateOptions as ReactNavigateOptions,
} from 'react-router-dom'

export type { ReactNavigateFunction, ReactNavigateOptions }

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

export type RouteTo = To
export type RouteLocation = Location<unknown>

export type BeforeRouteChangeInterceptor = (
  RouteTo: To | number,
  from: RouteLocation,
) => Promise<RouteTo>

export type AfterRouteChangeInterceptor = (
  to: RouteLocation,
  from: RouteLocation,
) => Promise<RouteLocation>

export interface RouterInterceptor {
  beforeRouteChange: BeforeRouteChangeInterceptor[]
  afterRouteChange: AfterRouteChangeInterceptor[]
}

interface RouterEventEmitter {
  onBeforeRouteChange(
    callback: (to: RouteTo | number, from: RouteLocation) => void,
  ): () => void
  onAfterRouteChange(
    callback: (to: RouteLocation, from: RouteLocation) => void,
  ): () => void
  onRoutesChange(callback: (routes: RouteConfig[]) => void): () => void
  emitBeforeRouteChange(to: RouteTo | number, from: RouteLocation): void
  emitAfterRouteChange(to: RouteLocation, from: RouteLocation): void
  emitRoutesChange(routes: RouteConfig[]): void
}

export interface RouterManager extends RouterEventEmitter {
  addAfterRouteChangeInterceptor(interceptor: AfterRouteChangeInterceptor): void
  addBeforeRouteChangeInterceptor(
    interceptor: BeforeRouteChangeInterceptor,
  ): void
  awaitNavigate(): Promise<void>
  getRoutes(): RouteConfig[]
  updateNavigateFunction(navigate: ReactNavigateFunction): void
  beforeRouteChange(to: RouteTo | number, from: RouteLocation): Promise<void>
  afterRouteChange(to: RouteLocation, from: RouteLocation): Promise<void>
  navigate(to: RouteTo | number, options?: ReactNavigateOptions): Promise<void>
  navigated(current: RouteLocation): void
  nextPath(current: string, add?: string): string
  findRoute<R extends { path?: string; id?: string; children?: unknown }>(
    routes: R[],
    id: string,
    handler?: (item: R, index: number, routes: R[]) => void,
    path?: string,
  ): (R & { path: string }) | undefined
  updateRoutes(
    iteratee: (
      item: RouteConfig,
      index: number,
      routes: RouteConfig[],
    ) => RouteConfig | RouteConfig[] | void,
  ): RouteConfig[]
}
