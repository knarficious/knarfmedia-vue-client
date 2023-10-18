export default [
  {
    name: "TagList",
    path: "/tags/",
    component: () => import("@/views/tag/ViewList.vue"),
  },
  {
    name: "TagCreate",
    path: "/tags/create",
    component: () => import("@/views/tag/ViewCreate.vue"),
    meta: { requiresAuth: true }
  },
  {
    name: "TagUpdate",
    path: "/tags/edit/:id",
    component: () => import("@/views/tag/ViewUpdate.vue"),
    meta: { requiresAuth: true }
  },
  {
    name: "TagShow",
    path: "/tags/show/:id",
    component: () => import("@/views/tag/ViewShow.vue"),
  },
];
