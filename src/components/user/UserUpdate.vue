<template>
  <div class="container mx-auto px-4 max-w-2xl mt-4">
    <div class="flex items-center justify-between">
      <router-link
        :to="{ name: 'UserList' }"
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

    <h1 class="text-3xl my-4">Edit User {{ item?.["@id"] }}</h1>

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
import { useUserCreateStore } from "@/stores/user/create";
import { useUserDeleteStore } from "@/stores/user/delete";
import { useUserUpdateStore } from "@/stores/user/update";
import type { User } from "@/types/user";
import Form from "@/components/user/UserForm.vue";
import { useMercureItem } from "@/composables/mercureItem";

const route = useRoute();
const router = useRouter();

const userCreateStore = useUserCreateStore();
const { created } = storeToRefs(userCreateStore);

const userDeleteStore = useUserDeleteStore();
const { error: deleteError, isLoading: deleteLoading } =
  storeToRefs(userDeleteStore);

const userUpdateStore = useUserUpdateStore();
const {
  retrieved: item,
  updated,
  error,
  isLoading,
  violations,
} = storeToRefs(userUpdateStore);

useMercureItem({
  store: userUpdateStore,
  deleteStore: userDeleteStore,
  redirectRouteName: "UserList",
});

await userUpdateStore.retrieve(decodeURIComponent(route.params.id as string));

function update(item: User) {
  userUpdateStore.update(item);
}

async function deleteItem() {
  if (!item?.value) {
    userUpdateStore.setError("No user found. Please reload");
    return;
  }

  if (window.confirm("Are you sure you want to delete this user?")) {
    await userDeleteStore.deleteItem(item.value);

    if (userDeleteStore.deleted) {
      router.push({ name: "UserList" });
    }
  }
}

onBeforeUnmount(() => {
  userUpdateStore.$reset();
  userCreateStore.$reset();
  userDeleteStore.$reset();
});
</script>
