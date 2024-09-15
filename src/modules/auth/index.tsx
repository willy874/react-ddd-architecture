import { lazy } from 'react'

const Login = lazy(() => import('./pages/Login'))

export const routes = [
  {
    id: 'login',
    path: '/login',
    element: <Login />,
  },
]
