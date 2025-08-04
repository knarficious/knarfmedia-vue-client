<template>
  <Suspense>
    <Create />

    <template #fallback>Chargement...</template>
  </Suspense>
</template>

<script setup lang="ts">
import Create from "@/components/user/UserCreate.vue";
</script>
