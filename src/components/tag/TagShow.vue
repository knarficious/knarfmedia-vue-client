<template>
  <div class="container mx-auto px-4 max-w-2xl mt-4">
    <div class="flex items-center justify-between">
      <router-link
        :to="{ name: 'TagList' }"
        class="px-3 bg-blue-600 text-white text-sm rounded shadow-md hover:bg-blue-700"
      >
        retour à la liste
      </router-link>

      <div v-if="useAuthStore.isLoggedIn === true">
        <router-link
          v-if="item"
          :to="{ name: 'TagUpdate', params: { id: item['@id'] } }"
          class="px-6 py-2 mr-2 bg-green-600 text-white text-sm rounded shadow-md hover:bg-green-700"
        >
          Modifier
        </router-link>
        <button
          class="px-6 py-2 bg-red-600 text-white text-sm rounded shadow-md hover:bg-red-700"
          @click="deleteItem"
        >
          Supprimer
        </button>
      </div>
    </div>

    <h1 class="text-3xl my-4">Catégorie: {{ item?.name }}</h1>

    <div
      v-if="isLoading"
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

    <div v-if="item" class="overflow-x-auto">
            <div class="mx-auto my-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              <template v-if="router.hasRoute('PublicationShow')">
        <article v-for="publication in item.publications" :key="publication.id" class="flex max-w-xl flex-col rounded overflow-hidden shadow-lg items-center justify-between">
          <div class="flex items-center gap-x-4 text-xs">
          </div>
          <div class="group relative">
            <h3 class="mt-3 ml-5 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
              <router-link
                :to="{ name: 'PublicationShow', params: { id: publication['@id'] } }"
                class="px-6 py-2 bg-blue-600 text-white text-lg rounded shadow-md hover:bg-blue-700"
              >
                {{ publication.title }}
              </router-link>
            </h3>
            <p class="mt-5 ml-5 line-clamp-3 text-sm leading-6 text-gray-600">{{ publication.summary }}</p>
          </div>
          <div class="relative mt-8 flex items-center gap-x-4">
            <UserIcon class="h-6 w-6 rounded-full bg-gray-50" />
            <div class="text-sm leading-6">
              <p class="font-semibold text-gray-900">
                <template v-if="router.hasRoute('UserShow')">
              <router-link
                :to="{ name: 'UserShow', params: { id: publication.author['@id']} }"
                :key="publication.author['@id']"
                >
                <span class="absolute inset-0" />
            {{ publication.author.username }}
          </router-link>
          
            </template>

            <time :datetime="publication.publishedAt" class="text-gray-500 ml-3">{{ formatDateTime(publication.publishedAt) }}</time>
              </p>
              <p class="text-gray-600">{{ publication.author.role }}</p>
            </div>
          </div>
        </article>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useTagShowStore } from "@/stores/tag/show";
import { useTagDeleteStore } from "@/stores/tag/delete";
import { useUserAuthStore } from "@/stores/authenticator/auth";
import { useMercureItem } from "@/composables/mercureItem";
import { formatDateTime } from "@/utils/date";
import { UserIcon } from "@heroicons/vue/24/outline";

const route = useRoute();
const router = useRouter();

const tagDeleteStore = useTagDeleteStore();
const { error: deleteError, deleted } = storeToRefs(tagDeleteStore);
const useAuthStore = useUserAuthStore();
const tagShowStore = useTagShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(tagShowStore);

useMercureItem({
  store: tagShowStore,
  deleteStore: tagDeleteStore,
  redirectRouteName: "TagList",
});

await tagShowStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    tagDeleteStore.setError("This item does not exist anymore");
    return;
  }

  if (window.confirm("Are you sure you want to delete this tag?")) {
    await tagDeleteStore.deleteItem(item.value);

    if (deleted) {
      router.push({ name: "TagList" });
    }
  }
}

onBeforeUnmount(() => {
  tagShowStore.$reset();
});
</script>

