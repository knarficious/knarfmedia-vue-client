<template>
  <div class="container mx-auto px-4 max-w-2xl mt-4">
    <div class="flex items-center justify-between">
      <router-link
        :to="{ name: 'PublicationShow', params: { id: route.params.id } }"
        class="text-blue-600 hover:text-blue-800"
      >
        &lt; Retour
      </router-link>
    </div>

    <h1 class="text-3xl my-4">Modifier le fichier de la Publication {{ item?.["@id"] }}</h1>

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

    <div
      v-if="created || updated"
      class="bg-green-100 rounded py-4 px-4 my-2 text-green-700 text-sm"
      role="status"
    >
      <template v-if="created">{{ created["@id"] }} created. </template>
      <template v-else-if="updated">{{ updated["@id"] }} updated. </template>
    </div>

    <Form v-if="item" :values="item" :errors="violations" @submit="update" />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { usePublicationCreateStore } from "@/stores/publication/create";
import { usePublicationFileUpdateStore } from "@/stores/publication/updateFile";
import type { Publication } from "@/types/publication";
import Form from "@/components/publication/PublicationUpdateFileForm.vue";

const route = useRoute();
const router = useRouter();

const publicationCreateStore = usePublicationCreateStore();
const { created } = storeToRefs(publicationCreateStore);

const publicationFileUpdateStore = usePublicationFileUpdateStore();
const {
  retrieved: item,
  updated,
  error,
  isLoading,
  violations,
} = storeToRefs(publicationFileUpdateStore);

await publicationFileUpdateStore.retrieve(decodeURIComponent(route.params.id as string));

function update(item: Publication) {
  publicationFileUpdateStore.update(item);
}



onBeforeUnmount(() => {
  publicationFileUpdateStore.$reset();
  publicationCreateStore.$reset();
});
</script>
