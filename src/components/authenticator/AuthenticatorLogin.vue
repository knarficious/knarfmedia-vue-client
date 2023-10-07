<template>
  <div class="container mx-auto px-4 max-w-2xl mt-4">
    <h1 class="text-3xl my-4">S'authentifier</h1>

    <div
      v-if="isLoading"
      class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm"
      role="status"
    >
      Loading...
    </div>
    <div
      v-if="error"
      class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      role="alert"
    >
      {{ error }}
    </div>

    <Form :errors="violations" @submit="login" />
  </div>
  </template>
  <script lang="ts" setup>
//import { onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Form from "@/components/user/UserFormLogin.vue";
import { useUserAuthStore } from "@/stores/authenticator/auth";
import type { User } from "@/types/user";


const router = useRouter();
const useAuthStore = useUserAuthStore();
const { isLoading, error, violations } = storeToRefs(useAuthStore);

if (useAuthStore.isLoggedIn === true) {
  router.push('/');
}

async function login(item: User) {

  await useAuthStore.login(item);

  if (!useAuthStore.isLoggedIn) return;

  router.push({
    name: "profile",
  })
}



</script>