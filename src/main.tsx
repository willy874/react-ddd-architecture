import './index.css'
import { Application } from './core'
import { ReactPlugin } from './modules/react'
import { RouterPlugin } from './modules/router'
import App from './App'
import { routerManager } from './libs/router'

const app = new Application({})

app
  .use(
    ReactPlugin({
      el: document.getElementById('root')!,
    }),
  )
  .use(
    RouterPlugin({
      onInit: route => {
        routerManager.addRouteChild(route.id, {
          path: '/',
          element: <App />,
        })
      },
    }),
  )
  .start()
