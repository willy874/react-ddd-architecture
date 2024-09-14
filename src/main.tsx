import './index.css'
import { app } from './core'
import { ReactPlugin } from './modules/react'
import { RouterPlugin } from './modules/router'
import App from './App'

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
          path: '',
          element: <App />,
        },
      ],
    }),
  )
  .start()
