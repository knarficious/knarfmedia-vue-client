<template>
    <Suspense>
      <Login />
  
      <template #fallback>Loading...</template>
    </Suspense>
  </template>
  
  <script setup lang="ts">
  import Login from "@/components/authenticator/AuthenticatorLogin.vue";

  </script>