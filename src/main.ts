import './assets/main.css'
import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import Notifications from 'notiwind'
import { createHead } from '@vueuse/head'
import App from './App.vue'
import { createMyRouter } from './router'

/* FontAwesome */
import { library, type IconPack } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faTwitter, faYoutube, faLinkedin } from '@fortawesome/free-brands-svg-icons'

/* Stores */
import { useUserAuthStore } from './stores/authenticator/auth'
import { useCookies } from 'vue3-cookies'

/* Add icons to the library */
library.add(fas as IconPack)
library.add(faFacebookF, faTwitter, faLinkedin, faYoutube)

export const createApp = ViteSSG(
  App,
  { routes: createMyRouter().getRoutes() },
  ({ app, router }) => {
    const pinia = createPinia()
    const head = createHead()
    const { cookies } = useCookies()

    app.use(pinia)
    app.use(head)
    app.use(router)
    app.use(Notifications)
    app.component('font-awesome-icon', FontAwesomeIcon)

    // Auth route guard (s'exécute uniquement côté client)
    if (!import.meta.env.SSR) {
      router.beforeEach((to: any) => {
        const auth = useUserAuthStore()
        if (to.meta.requiresAuth && auth.isLoggedIn === false && !cookies.isKey('jwt_hp')) {
          return '/login'
        }
      })

      // Event pour prerender ou tests
      document.dispatchEvent(new Event('render-event'))
    }
  }
)
