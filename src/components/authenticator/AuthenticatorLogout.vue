<template>
  <div></div>
</template>
<script setup lang="ts">

import { onMounted } from 'vue';
import { useUserAuthStore } from '@/stores/authenticator/auth';
import { useRouter } from "vue-router";

const useAuthStore = useUserAuthStore();
const router = useRouter();

onMounted(async () => {
  await useAuthStore.logout()
  router.replace('/')
})
</script>