import './index.css'
import { Application } from './core'
import { RouteConfig } from './libs/router'
import { ReactAppPlugin } from './modules/ReactApp'
import { createRouter } from './modules/ReactRouter'
import { RestClient } from './libs/RestClient'

const app = new Application({
  restClient: new RestClient(),
})

declare module './core' {
  interface ApplicationContext {
    restClient: RestClient
  }
}

const { RouterProvider, ReactRouterPlugin } = createRouter([
  {
    id: 'home',
    path: '/',
    component: () => import('./Home'),
  },
] satisfies RouteConfig[])

app
  .use(
    ReactAppPlugin({
      el: () => document.getElementById('root')!,
      main: RouterProvider,
      providers: [],
    }),
  )
  .use(ReactRouterPlugin())

app.query('render')
