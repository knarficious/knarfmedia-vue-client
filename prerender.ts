// prerender.ts
import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import { renderToString } from 'vue/server-renderer';
import router from './src/router';
import App from './src/App.vue';
import { createHead } from '@vueuse/head';
import api from './src/utils/api';
import { setActivePinia, createPinia as createPiniaInstance } from 'pinia';
import { usePublicationShowStore } from "./src/stores/publication/show";


// ⚠️ export nommé requis par vite-prerender-plugin
export const prerender = async () => {
  const routes: string[] = ['/','/about']; // routes statiques

  try {
    // 1️⃣ Récupérer les publications depuis API Platform
    const response = await api('publications'); // remplace par ton endpoint
    const data = await response.json();

    const publicationRoutes = data['hydra:member'].map((p: any) => `/publications/${p.id}`);
    routes.push(...publicationRoutes);

    const renderedRoutes: string[] = [];

 

  for (const path of routes) {
    const app = createSSRApp(App);
    const pinia = createPinia();
    app.use(pinia);
    setActivePinia(pinia);

    const head = createHead();
    app.use(head);
    app.use(router);

    await router.push(path);
    await router.isReady();

    // si route publication, hydrate le store côté SSR
    if (path.startsWith("/publications/")) {
      const pubId = path.split("/").pop();
      const pubData = data["hydra:member"].find((p: any) => p.id.toString() === pubId);
      if (pubData) {
        const store = usePublicationShowStore(pinia);
        store.setPublicationSSR(pubData);

        // head meta dynamiques
        head.push({
          title: pubData.title,
          meta: [
            { name: "description", content: pubData.description },
            { property: "og:title", content: pubData.title },
            { property: "og:description", content: pubData.description },
            { property: "og:type", content: "article" },
            { name: "twitter:title", content: pubData.title },
            { name: "twitter:description", content: pubData.description },
          ],
        });
      }
    }

    await renderToString(app);
    renderedRoutes.push(path);
  }

    return renderedRoutes;

  } catch (err) {
    console.error('Erreur pendant le prerender:', err);
    return ['/']; // fallback minimal
  }
};
