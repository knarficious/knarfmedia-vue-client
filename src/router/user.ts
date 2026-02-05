export default [
  {
    name: "UserList",
    path: "/users/",
    component: () => import("@/views/user/ViewList.vue"),
    meta: { requiresAuth: true }
  },
  {
    name: "UserCreate",
    path: "/creer-compte",
    component: () => import("@/views/user/ViewCreate.vue"),
  },
  {
    name: "UserUpdate",
    path: "/users/edit/:id",
    component: () => import("@/views/user/ViewUpdate.vue"),
    meta: { requiresAuth: true }
  },
  {
    name: "UserShow",
    path: "/users/show/:id",
    component: () => import("@/views/user/ViewShow.vue"),
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/mon-compte',
    name: 'mon-compte',
    component: () => import('@/views/user/ViewProfile.vue'),
    meta: { requiresAuth: true }
  },
];
