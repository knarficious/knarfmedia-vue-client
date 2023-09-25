<template>
  <div class="container mx-auto px-4 max-w-2xl mt-4">
    <div class="flex items-center justify-between">
      <router-link
        :to="{ name: 'PublicationList' }"
        class="text-blue-600 hover:text-blue-800"
      >
        &lt; Back to list
      </router-link>

      <button
        class="px-6 py-2 bg-red-600 text-white text-xs rounded shadow-md hover:bg-red-700"
        @click="deleteItem"
      >
        Delete
      </button>
    </div>

    <h1 class="text-3xl my-4">Edit Publication {{ item?.["@id"] }}</h1>

    <div
      v-if="isLoading || deleteLoading"
      class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm"
      role="status"
    >
      Loading...
    </div>

    <div
      v-if="error || deleteError"
      class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      role="alert"
    >
      {{ error || deleteError }}
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
import { usePublicationDeleteStore } from "@/stores/publication/delete";
import { usePublicationUpdateStore } from "@/stores/publication/update";
import type { Publication } from "@/types/publication";
import Form from "@/components/publication/PublicationForm.vue";
import { useMercureItem } from "@/composables/mercureItem";

const route = useRoute();
const router = useRouter();

const publicationCreateStore = usePublicationCreateStore();
const { created } = storeToRefs(publicationCreateStore);

const publicationDeleteStore = usePublicationDeleteStore();
const { error: deleteError, isLoading: deleteLoading } =
  storeToRefs(publicationDeleteStore);

const publicationUpdateStore = usePublicationUpdateStore();
const {
  retrieved: item,
  updated,
  error,
  isLoading,
  violations,
} = storeToRefs(publicationUpdateStore);

useMercureItem({
  store: publicationUpdateStore,
  deleteStore: publicationDeleteStore,
  redirectRouteName: "PublicationList",
});

await publicationUpdateStore.retrieve(decodeURIComponent(route.params.id as string));

function update(item: Publication) {
  publicationUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    publicationUpdateStore.setError("No publication found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this publication?")) {
    await publicationDeleteStore.deleteItem(item.value);

    if (publicationDeleteStore.deleted) {
      router.push({ name: "PublicationList" });
    }
  }
}

onBeforeUnmount(() => {
  publicationUpdateStore.$reset();
  publicationCreateStore.$reset();
  publicationDeleteStore.$reset();
});
</script>
