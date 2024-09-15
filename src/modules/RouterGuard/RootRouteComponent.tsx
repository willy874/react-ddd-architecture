import { Application } from '@/core'
import { layoutManager } from '@/libs/layout'
import { routerManager } from '@/libs/router'
import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import NavigationGuards from './NavigationGuards'
import type { Location } from 'react-router-dom'

interface RootRouteComponentProps {
  app: Application
}

export default function RootRouteComponent({ app }: RootRouteComponentProps) {
  const Layout = layoutManager.getCurrentLayout()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    routerManager.setNavigate(navigate)
  }, [navigate])

  useEffect(() => {
    return routerManager.onBeforeRouteChange(() => {
      app.emit('beforeRouteChange', location)
    })
  }, [app, location])

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
