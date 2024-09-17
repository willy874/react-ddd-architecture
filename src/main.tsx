import './index.css'
import { Application } from './core'
import { ReactAppPlugin } from './modules/ReactApp'
import { RouterGuardPlugin } from './modules/RouterGuard'
import { Dashboard } from './modules/Dashboard'
import { RouterManager } from './libs/router'
import { LayoutManager } from './libs/layout'
import { RouteObject } from 'react-router-dom'

const app = new Application({
  router: new RouterManager(),
  layout: new LayoutManager(),
})

declare module './core' {
  interface ApplicationContext {
    router: RouterManager<RouteObject>
    layout: LayoutManager
  }
}

app
  .use(
    ReactAppPlugin({
      el: document.getElementById('root')!,
    }),
  )
  .use(
    RouterGuardPlugin({
      onInit: route => {
        const ctx = app.getContext()
        ctx.router.addRouteChild(route.id, {
          path: '*',
          element: <Dashboard />,
        })
      },
    }),
  )
  .start()
