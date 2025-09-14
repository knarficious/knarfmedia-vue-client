import './assets/main.css'
import { createApp } from 'vue'
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
const { cookies } = useCookies()

/* Add icons to the library */
library.add(fas as IconPack)
library.add(faFacebookF, faTwitter, faLinkedin, faYoutube)

/* Création de l'app */
export function createMyApp() {
  const app = createApp(App)
  const pinia = createPinia()
  const head = createHead()
  const router = createMyRouter()

  app.use(pinia)
  app.use(head)
  app.use(router)
  app.use(Notifications)
  app.component('font-awesome-icon', FontAwesomeIcon)

  /* Auth route guard */
  router.beforeEach((to) => {
    const auth = useUserAuthStore()
    if (to.meta.requiresAuth && auth.isLoggedIn === false && !cookies.isKey('jwt_hp')) {
      return '/login'
    }
  })

  return { app, router }
}

/* Montage classique côté client */
if (typeof window !== 'undefined') {
  const { app, router } = createMyApp()
  router.isReady().then(() => {
    app.mount('#app')

    /* Event pour prerender ou tests */
    document.dispatchEvent(new Event('render-event'))
  })
}
