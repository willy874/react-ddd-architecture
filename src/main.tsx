import './index.css'
import { Application } from './core'
import { ReactAppPlugin } from './modules/ReactApp'
import { RouterGuardPlugin } from './modules/RouterGuard'
import App from './App'
import { routerManager } from './libs/router'

const app = new Application({})

app
  .use(
    ReactAppPlugin({
      el: document.getElementById('root')!,
    }),
  )
  .use(
    RouterGuardPlugin({
      onInit: route => {
        routerManager.addRouteChild(route.id, {
          path: '/',
          element: <App />,
        })
      },
    }),
  )
  .start()
