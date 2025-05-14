export default [
  {
    name: "PublicationList",
    path: "/",
    component: () => import("@/views/publication/ViewList.vue"),
  },
  {
    name: "PublicationCreate",
    path: "/create",
    component: () => import("@/views/publication/ViewCreate.vue"),
    meta: { requiresAuth: true }
  },
  {
    name: "PublicationUpdate",
    path: "/edit/:id",
    component: () => import("@/views/publication/ViewUpdate.vue"),
    meta: { requiresAuth: true }
  },
  {
    name: "PublicationShow",
    path: "/show/:id",
    component: () => import("@/views/publication/ViewShow.vue"),
  },
  {
    name: "PublicationComment",
    path: "/:id/commenter",
    component: () => import("@/views/comment/ViewCreate.vue"),
    meta: { requiresAuth: true}
  }
];
