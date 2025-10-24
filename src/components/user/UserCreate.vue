<template>
  <div class="container mx-auto px-4 max-w-2xl mt-4">

    <h1 class="text-3xl my-4">S'enregistrer</h1>

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
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import Form from "@/components/user/UserForm.vue";
import { useUserCreateStore } from "@/stores/user/create";
import type { User } from "@/types/user";

const router = useRouter();

const userCreateStore = useUserCreateStore();
const { isLoading, error, violations } = storeToRefs(userCreateStore);

async function create(item: User) {
  await userCreateStore.create(item);

  if (!userCreateStore.created) return;

  alert(userCreateStore.created.username + ": nous avons envoyé un email à l'adresse " + userCreateStore.created.email);
  router.push({
    name: "UserShow",
    params: { id: userCreateStore.created["@id"] },
  });
}

onBeforeUnmount(() => {
  userCreateStore.$reset();
});
</script>
