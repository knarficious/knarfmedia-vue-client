import router from "./src/router";

export default () => {
  // on renvoie simplement les chemins à prerender
  return router.getRoutes().map((r) => r.path);

  // ⚠️ si tu as des routes dynamiques (ex: /publications/:id),
  // tu peux ici fetch ton API Platform pour construire la liste finale
  // Exemple:
  // const res = await fetch("https://api.example.com/publications");
  // const data = await res.json();
  // return data["hydra:member"].map((p: any) => `/publications/${p.id}`);
};