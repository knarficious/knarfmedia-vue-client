import { JSDOM } from 'jsdom'
import { fileURLToPath, URL } from 'node:url'
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import App from './src/App.vue'
import router from './src/router'

import Notifications from 'notiwind'
import { library, type IconPack } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faFacebookF, faTwitter, faYoutube, faLinkedin } from '@fortawesome/free-brands-svg-icons'

library.add(fas as IconPack, faFacebookF, faTwitter, faLinkedin, faYoutube)

export async function prerender({ route }: { route: string }) {
  // Créer un DOM virtuel
  const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body><div id="app"></div></body></html>`, {
    url: `http://localhost${route}`,
  })

  const { window } = dom
  // @ts-ignore
  global.window = window
  // @ts-ignore
  global.document = window.document
  // @ts-ignore
  global.navigator = window.navigator

  // Créer l'app SSR
  const app = createSSRApp(App)
  const pinia = createPinia()
  const head = createHead()

  app.use(pinia)
  app.use(head)
  app.use(router)
  app.use(Notifications)
  app.component('font-awesome-icon', FontAwesomeIcon)

  // Naviguer sur la route
  await router.isReady()
  await router.push(route)
  await new Promise((resolve) => setTimeout(resolve, 2000)) // attendre le fetch API

  // Générer les meta tags
const headTagsArray = await head.resolveTags()
const headTags = headTagsArray.map(tag => tag).join('\n')
  // Générer le HTML final
  const html = dom.serialize()
    .replace('<head></head>', `<head>${headTags}</head>`)
    .replace('<div id="app"></div>', `<div id="app">${document.getElementById('app')?.innerHTML || ''}</div>`)

  return html
}
