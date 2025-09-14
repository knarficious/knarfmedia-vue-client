// main.ts
import './assets/main.css'
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Notifications from 'notiwind'
import { createHead } from '@vueuse/head'

/* FontAwesome */
import { library, type IconPack } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faTwitter, faYoutube, faLinkedin } from '@fortawesome/free-brands-svg-icons'

library.add(fas as IconPack, faFacebookF, faTwitter, faLinkedin, faYoutube)

// ✅ ViteSSG wrapper
export const createApp = ViteSSG(
  App,
  { routes: router.getRoutes() },
  ({ app, router, isClient, initialState }) => {
    const pinia = createPinia()
    const head = createHead()

    app.use(pinia)
    app.use(router)
    app.use(head)
    app.use(Notifications)

    app.component('font-awesome-icon', FontAwesomeIcon)

    // router.beforeEach uniquement côté client
    if (isClient) {
      import('./stores/authenticator/auth').then(({ useUserAuthStore }) => {
        router.beforeEach((to) => {
          const auth = useUserAuthStore()
          const cookiesKey = 'jwt_hp'
          if (to.meta.requiresAuth && auth.isLoggedIn === false && document.cookie.includes(cookiesKey) === false) {
            return '/login'
          }
        })
      })
    }
  }
)
