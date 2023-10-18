<template>
  <div class="container mx-auto px-4 max-w-2xl mt-4">
    <router-link
      :to="{ name: 'PublicationShow', params: { id: path} }"
      class="text-blue-600 hover:text-blue-800"
    >
      &lt; Back to Publication
    </router-link>

    <h1 class="text-3xl my-4">Create Comment</h1>

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

    <Form :errors="violations" @submit="create" />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import Form from "@/components/comment/CommentForm.vue";
import { useCommentCreateStore } from "@/stores/comment/create";
import type { Comment } from "@/types/comment";

const router = useRouter();
const route = useRoute();
const path = route.path.slice(0,15);

const commentCreateStore = useCommentCreateStore();
const { isLoading, error, violations } = storeToRefs(commentCreateStore);

async function create(item: Comment) {
  await commentCreateStore.create(item);

  if (!commentCreateStore.created) return;

  router.push({
    name: "CommentShow",
    params: { id: commentCreateStore.created["@id"] },
  });
}

onBeforeUnmount(() => {
  commentCreateStore.$reset();
});
</script>
