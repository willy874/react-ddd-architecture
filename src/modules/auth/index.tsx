import { RouteConfig } from '@/libs/router'

export const routes = [
  {
    id: 'login',
    path: '/login',
    component: () => import('./pages/Login'),
  },
] satisfies RouteConfig[]
