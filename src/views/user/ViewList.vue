<template>
  <Suspense>
    <List />

    <template #fallback>Chargement...</template>
  </Suspense>
</template>

<script setup lang="ts">
import List from "@/components/user/UserList.vue";
</script>
