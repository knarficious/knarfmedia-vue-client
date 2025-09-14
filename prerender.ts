import router from "./src/router";

import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import App from './src/App.vue';

export const prerender = async () => {
  const app = createSSRApp(App);
  app.use(router);

  // attendre que le router soit prêt
  await router.push('/');
  await router.isReady();

  const html = await renderToString(app);
  return ['/'].map(() => html); // retourne un tableau de routes
};