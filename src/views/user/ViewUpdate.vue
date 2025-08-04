<template>
  <Suspense>
    <Update />

    <template #fallback>Chargement...</template>
  </Suspense>
</template>

<script setup lang="ts">
import Update from "@/components/user/UserUpdate.vue";
</script>
