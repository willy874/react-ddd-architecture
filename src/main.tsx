import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Application } from './core'
import { RouteConfig } from './libs/router'
import { ReactAppPlugin } from './modules/ReactApp'
import { initRouterModule } from './modules/ReactRouter'
import { RestClient } from './libs/RestClient'
import { appOperator } from './libs/apis'

const queryCache = new QueryClient()

const app = new Application({
  restClient: new RestClient(),
})

appOperator.init(app)

declare module './core' {
  interface ApplicationContext {
    restClient: RestClient
  }
}

const { RouterProvider, ReactRouterPlugin } = initRouterModule([
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
      providers: [
        ({ children }) => (
          <QueryClientProvider client={queryCache}>
            {children}
          </QueryClientProvider>
        ),
      ],
    }),
  )
  .use(ReactRouterPlugin())

app.query('render')
