import './index.css'
import { Application } from './core'
import { ReactAppPlugin } from './modules/ReactApp'
import { createRouter, RouteConfig } from './libs/router'

const app = new Application({})
const { RouterProvider, plugin: ReactRouterPlugin } = createRouter([
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
  .use(ReactRouterPlugin)

app.query('render')
