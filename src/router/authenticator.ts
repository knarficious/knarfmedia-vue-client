export default [
    {
      name: "UserLogin",
      path: "/connexion/",
      component: () => import("@/views/user/ViewLogin.vue"),
    },

    {
      name: "UserLogout",
      path: "/deconnexion/",
      component: () => import("@/components/authenticator/AuthenticatorLogout.vue")
    }

  ];
  
