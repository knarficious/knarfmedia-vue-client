<template>
  <div class="container mx-auto px-4 max-w-2xl mt-4">
    <div class="flex items-center justify-between">
      <router-link
        :to="{ name: 'TagList' }"
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

    <h1 class="text-3xl my-4">Edit Tag {{ item?.["@id"] }}</h1>

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
import { useTagCreateStore } from "@/stores/tag/create";
import { useTagDeleteStore } from "@/stores/tag/delete";
import { useTagUpdateStore } from "@/stores/tag/update";
import type { Tag } from "@/types/tag";
import Form from "@/components/tag/TagForm.vue";
import { useMercureItem } from "@/composables/mercureItem";

const route = useRoute();
const router = useRouter();

const tagCreateStore = useTagCreateStore();
const { created } = storeToRefs(tagCreateStore);

const tagDeleteStore = useTagDeleteStore();
const { error: deleteError, isLoading: deleteLoading } =
  storeToRefs(tagDeleteStore);

const tagUpdateStore = useTagUpdateStore();
const {
  retrieved: item,
  updated,
  error,
  isLoading,
  violations,
} = storeToRefs(tagUpdateStore);

useMercureItem({
  store: tagUpdateStore,
  deleteStore: tagDeleteStore,
  redirectRouteName: "TagList",
});

await tagUpdateStore.retrieve(decodeURIComponent(route.params.id as string));

function update(item: Tag) {
  tagUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    tagUpdateStore.setError("No tag found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this tag?")) {
    await tagDeleteStore.deleteItem(item.value);

    if (tagDeleteStore.deleted) {
      router.push({ name: "TagList" });
    }
  }
}

onBeforeUnmount(() => {
  tagUpdateStore.$reset();
  tagCreateStore.$reset();
  tagDeleteStore.$reset();
});
</script>
