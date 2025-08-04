<template>
    <Suspense>
      <Login />
  
      <template #fallback>Chargement...</template>
    </Suspense>
  </template>
  
  <script setup lang="ts">
  import Login from "@/components/authenticator/AuthenticatorLogin.vue";

  </script>