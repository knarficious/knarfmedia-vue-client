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
    redirect: () => {
      const auth = useUserAuthStore()
      auth.logout() // on appelle la fonction mais pas de await ici
      return '/'      // on redirige vers la home
    }
  }
]
