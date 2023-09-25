export default [
  {
    name: "UserList",
    path: "/users/",
    component: () => import("@/views/user/ViewList.vue"),
  },
  {
    name: "UserCreate",
    path: "/users/create",
    component: () => import("@/views/user/ViewCreate.vue"),
  },
  {
    name: "UserUpdate",
    path: "/users/edit/:id",
    component: () => import("@/views/user/ViewUpdate.vue"),
  },
  {
    name: "UserShow",
    path: "/users/show/:id",
    component: () => import("@/views/user/ViewShow.vue"),
  },
];
