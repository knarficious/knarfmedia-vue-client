import { useUserAuthStore } from '@/stores/authenticator/auth'

export default [
  {
    name: 'UserLogin',
    path: '/connexion/',
    component: () => import('@/views/user/ViewLogin.vue')
  },

  {
    name: 'UserLogout',
    path: '/deconnexion/',
    beforeEnter: async () => {
      const auth = useUserAuthStore()
      await auth.logout()
      return '/'
    }
  }
]
