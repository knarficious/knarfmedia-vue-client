import { createRouter, createWebHistory, createMemoryHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '@/components/NotFound.vue'

// Import routes
import publicationRoutes from '@/router/publication'
import userRoutes from '@/router/user'
import commentRoutes from '@/router/comment'
import tagRoutes from '@/router/tag'
import authRoute from '@/router/authenticator'

export function createMyRouter() {
  // Utilise createWebHistory côté client, createMemoryHistory côté SSR
  const history = import.meta.env.SSR ? createMemoryHistory() : createWebHistory(import.meta.env.BASE_URL)

  const routes: RouteRecordRaw[] = [
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    },
    ...publicationRoutes,
    ...userRoutes,
    ...commentRoutes,
    ...tagRoutes,
    ...authRoute
  ]

  const router = createRouter({
    history,
    routes
  })

  return router
}
