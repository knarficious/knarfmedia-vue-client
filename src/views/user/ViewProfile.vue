<template>
    <Suspense>
      <Show />
  
      <template #fallback>Loading...</template>
    </Suspense>
  </template>
  
  <script setup lang="ts">
  import Show from "@/components/user/UserProfile.vue";
  </script>
  