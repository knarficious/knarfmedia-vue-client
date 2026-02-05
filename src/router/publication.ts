export default [
  {
    name: "PublicationList",
    path: "/",
    component: () => import("@/views/publication/ViewList.vue"),
  },
  {
    name: "PublicationCreate",
    path: "/creer",
    component: () => import("@/views/publication/ViewCreate.vue"),
    meta: { requiresAuth: true }
  },
  {
    name: "PublicationUpdate",
    path: "/modifier/:id",
    component: () => import("@/views/publication/ViewUpdate.vue"),
    meta: { requiresAuth: true }
  },
  {
    name: "PublicationShow",
    path: "/publications/:id",
    component: () => import("@/views/publication/ViewShow.vue"),
  },
  {
    name: "PublicationComment",
    path: "/publications/:id/commenter",
    component: () => import("@/views/comment/ViewCreate.vue"),
    meta: { requiresAuth: true}
  },
  {
    name: "PublicationFileUpdate",
    path: "/publications/:id/fichier",
    component: () => import("@/views/publication/ViewUpdateFile.vue"),
    meta: { requiresAuth: true }
  }
];
