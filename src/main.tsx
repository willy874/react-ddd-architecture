import './index.css'
import { Application } from './core'
import { RouteConfig } from './libs/router'
import { ReactAppPlugin } from './modules/ReactApp'
import { createRouter } from './modules/ReactRouter'

const app = new Application({})
const { RouterProvider, ReactRouterPlugin } = createRouter([
  {
    id: 'home',
    path: '/',
    component: () => import('./modules/Dashboard/DashboardPage'),
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
