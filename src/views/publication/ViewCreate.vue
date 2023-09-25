<template>
  <Suspense>
    <Create />

    <template #fallback>Loading...</template>
  </Suspense>
</template>

<script setup lang="ts">
import Create from "@/components/publication/PublicationCreate.vue";
</script>
