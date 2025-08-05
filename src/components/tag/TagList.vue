<template>
  <div class="p-4">
    <div class="flex items-center justify-center gap-3">
      <h1 class="text-3xl my-4">Catégories</h1>
      <div v-if="useAuthStore.isLoggedIn === true">
      <router-link
        :to="{ name: 'TagCreate' }"
        class="px-6 py-2 bg-green-600 text-white text-xs rounded shadow-md hover:bg-green-700"
      >
        Créer
      </router-link>
    </div>
    </div>

    <div
      v-if="isLoading"
      class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm"
      role="status"
    >
      Chargement...
    </div>

    <div
      v-if="error"
      class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm"
      role="alert"
    >
      {{ error }}
    </div>

    <div
      v-if="deletedItem || mercureDeletedItem"
      class="bg-green-100 rounded py-4 px-4 my-2 text-green-700 text-sm"
      role="status"
    >
      <template v-if="deletedItem">
        {{ deletedItem["@id"] }} deleted.
      </template>
      <template v-else-if="mercureDeletedItem">
        {{ mercureDeletedItem["@id"] }} deleted by another user.
      </template>
    </div>

    <div class="flex flex-wrap gap-2 p-4 justify-center">
      <span v-for="item in items" :key="item['@id']" 
      class="px-3 py-1 rounded-full text-sm font-medium text-white"
      :class="getRandomBgColor()">
      <router-link :to="{ name: 'TagShow', params: { id: item['@id'] } }" class="px-6 py-2 text-white text-sm rounded shadow-md">
      {{ item.name }}
      </router-link>
      </span>  
    </div>

    <div v-if="view" class="flex justify-center">
      <nav aria-label="Page navigation">
        <ul class="flex list-style-none">
          <li :class="{ disabled: !view['hydra:previous'] }">
            <router-link
              :to="
                view['hydra:first']
                  ? view['hydra:first']
                  : { name: 'TagList' }
              "
              aria-label="First page"
              :class="
                !view['hydra:previous']
                  ? 'text-gray-500 pointer-events-none'
                  : 'text-gray-800 hover:bg-gray-200'
              "
              class="block py-2 px-3 rounded"
            >
              <span aria-hidden="true">&lArr;</span> First
            </router-link>
          </li>

          <li :class="{ disabled: !view['hydra:previous'] }">
            <router-link
              :to="
                !view['hydra:previous'] ||
                view['hydra:previous'] === view['hydra:first']
                  ? { name: 'TagList' }
                  : view['hydra:previous']
              "
              :class="
                !view['hydra:previous']
                  ? 'text-gray-500 pointer-events-none'
                  : 'text-gray-800 hover:bg-gray-200'
              "
              class="block py-2 px-3 rounded"
              aria-label="Previous page"
            >
              <span aria-hidden="true">&larr;</span> Previous
            </router-link>
          </li>

          <li :class="{ disabled: !view['hydra:next'] }">
            <router-link
              :to="view['hydra:next'] ? view['hydra:next'] : '#'"
              :class="
                !view['hydra:next']
                  ? 'text-gray-500 pointer-events-none'
                  : 'text-gray-800 hover:bg-gray-200'
              "
              class="block py-2 px-3 rounded"
              aria-label="Next page"
            >
              Next <span aria-hidden="true">&rarr;</span>
            </router-link>
          </li>

          <li :class="{ disabled: !view['hydra:next'] }">
            <router-link
              :to="view['hydra:last'] ? view['hydra:last'] : '#'"
              :class="
                !view['hydra:next']
                  ? 'text-gray-500 pointer-events-none'
                  : 'text-gray-800 hover:bg-gray-200'
              "
              class="block py-2 px-3 rounded"
              aria-label="Last page"
            >
              Last <span aria-hidden="true">&rArr;</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, watch } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useUserAuthStore } from "@/stores/authenticator/auth";
import { useTagDeleteStore } from "@/stores/tag/delete";
import { useTagListStore } from "@/stores/tag/list";
import { useMercureList } from "@/composables/mercureList";

const route = useRoute();

const tagDeleteStore = useTagDeleteStore();
const { deleted: deletedItem, mercureDeleted: mercureDeletedItem } =
  storeToRefs(tagDeleteStore);
const useAuthStore = useUserAuthStore();
const tagListStore = useTagListStore();
const { items, error, view, isLoading } = storeToRefs(tagListStore);

useMercureList({ store: tagListStore, deleteStore: tagDeleteStore });

watch(
  () => route.query.page,
  (newPage) => {
    const page = newPage as string;
    tagListStore.getItems(page);
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  tagDeleteStore.$reset();
});

// Array of Tailwind background color classes
const bgColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-indigo-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-orange-500',
];

// Function to get random background color
const getRandomBgColor = () => {
  return bgColors[Math.floor(Math.random() * bgColors.length)];
};
</script>
