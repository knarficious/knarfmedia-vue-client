export default [
    {
      name: "UserLogin",
      path: "/login/",
      component: () => import("@/views/user/ViewLogin.vue"),
    },

    {
      name: "UserLogout",
      path: "/logout/",
      component: () => import("@/components/authenticator/AuthenticatorLogout.vue")
    }

  ];
  