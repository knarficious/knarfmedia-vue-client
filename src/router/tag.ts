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
  },
  {
    name: "TagUpdate",
    path: "/tags/edit/:id",
    component: () => import("@/views/tag/ViewUpdate.vue"),
  },
  {
    name: "TagShow",
    path: "/tags/show/:id",
    component: () => import("@/views/tag/ViewShow.vue"),
  },
];
