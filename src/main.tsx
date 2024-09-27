import './index.css'
import { Application } from './core'
import { ReactAppPlugin } from './modules/ReactApp'
import { RouterProvider } from 'react-router-dom'
import { createRouter, RemixRouterManager } from './libs/router'
import { useMemo } from 'react'

const app = new Application({})

const router = new RemixRouterManager()

function useRouter() {
  return useMemo(() => createRouter(router), [])
}

function App() {
  const r = useRouter()
  return <RouterProvider router={r} />
}

app.use(
  ReactAppPlugin({
    el: () => document.getElementById('root')!,
    main: App,
    providers: [],
  }),
)

app.query('render')
