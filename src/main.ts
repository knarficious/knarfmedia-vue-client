import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import Notifications from 'notiwind'
import App from './App.vue'
import router from './router'

/* FontAwesome */
import { library, type IconPack } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faTwitter, faYoutube, faLinkedin } from '@fortawesome/free-brands-svg-icons'

/* Stores & cookies */
import { useCookies } from 'vue3-cookies'
import { useUserAuthStore } from './stores/authenticator/auth'

/* Icons */
library.add(fas as IconPack)
library.add(faFacebookF, faTwitter, faLinkedin, faYoutube)

const app = createApp(App)
const pinia = createPinia()
const head = createHead()

app.use(pinia)
app.use(head)
app.use(router)
app.use(Notifications)
app.component('font-awesome-icon', FontAwesomeIcon)

const { cookies } = useCookies()

router.beforeEach((to) => {
  const auth = useUserAuthStore()

  if (
    to.meta.requiresAuth &&
    !auth.isLoggedIn &&
    !cookies.isKey('jwt_hp')
  ) {
    return { name: 'UserLogin' }
  }
})

app.mount('#app')
