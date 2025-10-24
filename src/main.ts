import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Notifications from 'notiwind'
import App from './App.vue'
import router from './router'
import { createHead } from '@unhead/vue/client'
// import { renderSSRHead } from '@unhead/ssr'


/* import the fontawesome core */
import { library, type IconPack } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { fas } from '@fortawesome/free-solid-svg-icons'
// Icônes de marque
import { faFacebookF, faTwitter, faYoutube, faLinkedin } from '@fortawesome/free-brands-svg-icons'

import { useUserAuthStore } from './stores/authenticator/auth'

import { useCookies } from 'vue3-cookies'
const {cookies} = useCookies();

/* add icons to the library */
library.add(fas as IconPack)
library.add(faFacebookF)
library.add(faTwitter)
library.add(faLinkedin)
library.add(faYoutube)

const app = createApp(App)
const head = createHead()
// const payload = await renderSSRHead(head)
app.use(createPinia())
app.use(head)
app.use(router)
app.use(Notifications)
router.beforeEach((to) => {
    const auth = useUserAuthStore();

    if (to.meta.requiresAuth && auth.isLoggedIn === false && !cookies.isKey('jwt_hp')) return '/login'
})
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')