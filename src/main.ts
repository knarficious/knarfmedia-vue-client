import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

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
library.add(fas)
library.add(faFacebookF, faTwitter, faYoutube, faLinkedin)

const app = createApp(App)
app.use(createPinia())
app.use(router)
router.beforeEach((to) => {
    const auth = useUserAuthStore();

    if (to.meta.requiresAuth && auth.isLoggedIn === false && !cookies.isKey('jwt_hp')) return '/login'
})
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')