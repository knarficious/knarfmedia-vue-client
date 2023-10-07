<template>
  <div></div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onBeforeUnmount } from 'vue';
import { useUserAuthStore } from '@/stores/authenticator/auth';

const router = useRouter();
const useAuthStore = useUserAuthStore();

useAuthStore.logout();
router.push({
    name: "home"
})
onBeforeUnmount(() => {
  useAuthStore.$reset();
});
</script>