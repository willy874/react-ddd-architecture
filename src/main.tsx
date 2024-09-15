import './index.css'
import { Application } from './core'
import { StoragePlugin } from './modules/storage'
import { ReactPlugin } from './modules/react'
import { RouterPlugin } from './modules/router'
import App from './App'

const app = new Application({})

app
  .use(StoragePlugin())
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
