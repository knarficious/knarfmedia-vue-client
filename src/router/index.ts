import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw
} from 'vue-router'
import NotFound from '@/views/NotFound.vue'

// Import routes
import publicationRoutes from '@/router/publication'
import userRoutes from '@/router/user'
import commentRoutes from '@/router/comment'
import tagRoutes from '@/router/tag'
import authRoute from '@/router/authenticator'

const routes: RouteRecordRaw[] = [

  ...publicationRoutes,
  ...userRoutes,
  ...commentRoutes,
  ...tagRoutes,
  ...authRoute,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
