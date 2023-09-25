export default [
  {
    name: "CommentList",
    path: "/comments/",
    component: () => import("@/views/comment/ViewList.vue"),
  },
  {
    name: "CommentCreate",
    path: "/comments/create",
    component: () => import("@/views/comment/ViewCreate.vue"),
  },
  {
    name: "CommentUpdate",
    path: "/comments/edit/:id",
    component: () => import("@/views/comment/ViewUpdate.vue"),
  },
  {
    name: "CommentShow",
    path: "/comments/show/:id",
    component: () => import("@/views/comment/ViewShow.vue"),
  },
];
