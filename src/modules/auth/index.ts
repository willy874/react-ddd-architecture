import { ApplicationPlugin } from '@/core'
import { RestClient } from '@/libs/RestClient'
import type { RouteConfig } from '@/libs/router'
import {
  errorInterceptor,
  requestInterceptor,
  responseInterceptor,
} from './interceptor'
import { appOperator } from './services'
import { responseErrorInterceptor } from './errorHandler'

export const routes = [
  {
    id: 'login',
    path: '/login',
    component: () => import('./pages/Login'),
  },
] satisfies RouteConfig[]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const AuthPlugin = (_options: {}): ApplicationPlugin => {
  return (app) => {
    appOperator.init(app)
    const context = app.getContext()
    const getRestClient = () =>
      context.restClient.headers({
        'Content-Type': 'application/json; charset=utf-8',
      })
    const getAuthRestClient = () =>
      context.restClient
        .addRequestInterceptor(requestInterceptor())
        .addResponseInterceptor(responseInterceptor())
        .addErrorInterceptor(
          errorInterceptor({
            response: responseErrorInterceptor,
          }),
        )

    app.provider('getRestClient', getRestClient)
    app.provider('getAuthRestClient', getAuthRestClient)
    return {
      name: 'ReactAppPlugin',
    }
  }
}

declare module '@/core' {
  interface ApplicationService {
    getRestClient: () => RestClient
    getAuthRestClient: () => RestClient
  }
}
