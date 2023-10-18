export default [
  {
    name: "PublicationList",
    path: "/publications/",
    component: () => import("@/views/publication/ViewList.vue"),
  },
  {
    name: "PublicationCreate",
    path: "/publications/create",
    component: () => import("@/views/publication/ViewCreate.vue"),
    meta: { requiresAuth: true }
  },
  {
    name: "PublicationUpdate",
    path: "/publications/edit/:id",
    component: () => import("@/views/publication/ViewUpdate.vue"),
    meta: { requiresAuth: true }
  },
  {
    name: "PublicationShow",
    path: "/publications/show/:id",
    component: () => import("@/views/publication/ViewShow.vue"),
  },
  {
    name: "PublicationComment",
    path: "/publications/:id/commenter",
    component: () => import("@/views/comment/ViewCreate.vue"),
    meta: { requiresAuth: true}
  }
];
