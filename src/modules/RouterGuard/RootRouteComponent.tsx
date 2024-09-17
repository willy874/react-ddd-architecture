import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import type { Application } from '@/core'

import NavigationGuards from './NavigationGuards'

interface RootRouteComponentProps {
  app: Application
}

export default function RootRouteComponent({ app }: RootRouteComponentProps) {
  const { router: routerManager, layout: layoutManager } = app.getContext()
  const Layout = layoutManager.getCurrentLayout()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    routerManager.setNavigate(navigate)
  }, [navigate, routerManager])

  useEffect(() => {
    return routerManager.onBeforeRouteChange(() => {
      app.emit('beforeRouteChange', location)
    })
  }, [app, location, routerManager])

  return (
    <NavigationGuards
      onChange={(value: Location, oldValue: Location) => {
        app.emit('routeChange', value, oldValue)
      }}
    >
      <Layout>
        <Outlet />
      </Layout>
    </NavigationGuards>
  )
}
