import './index.css'
import { Application } from './core'
import { ReactPlugin } from './modules/react'
import { RouterPlugin } from './modules/router'
import App from './App'

const app = new Application({})

app
  .use(
    ReactPlugin({
      el: document.getElementById('root')!,
    }),
  )
  .use(
    RouterPlugin({
      routes: [
        {
          path: '/',
          element: <App />,
        },
      ],
    }),
  )
  .start()
