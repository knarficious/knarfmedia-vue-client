import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// Import routes
import publicationRoutes from '@/router/publication';
import userRoutes from '@/router/user';
import commentRoutes from '@/router/comment';
import tagRoutes from '@/router/tag';
import authRoute from '@/router/authenticator';

const isServer = typeof window === "undefined";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
        
    ...publicationRoutes,
    ...userRoutes,
    ...commentRoutes,
    ...tagRoutes,
    ...authRoute
  ]
})

export default router
