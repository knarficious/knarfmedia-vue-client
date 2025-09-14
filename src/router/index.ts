import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import publicationRoutes from '@/router/publication'
import userRoutes from '@/router/user'
import commentRoutes from '@/router/comment'
import tagRoutes from '@/router/tag'
import authRoute from '@/router/authenticator'

const routes: RouteRecordRaw[] = [
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  ...publicationRoutes,
  ...userRoutes,
  ...commentRoutes,
  ...tagRoutes,
  ...authRoute
]

export function createMyRouter() {
  const isServer = typeof window === 'undefined'
  const history = isServer ? createMemoryHistory() : createWebHistory(import.meta.env.BASE_URL)
  return createRouter({ history, routes })
}
