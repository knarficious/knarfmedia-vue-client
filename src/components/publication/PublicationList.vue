<template>
  <div class="p-4">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl my-4">Publication List</h1>
      <div v-if="useAuthStore.isLoggedIn === true">
      <router-link
        :to="{ name: 'PublicationCreate' }"
        class="px-6 py-2 bg-green-600 text-white text-xs rounded shadow-md hover:bg-green-700"
      >
        Create
      </router-link>
      </div>
    </div>

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
    <div class="overflow-x-auto">
      <table class="min-w-full">
        <thead class="border-b">
          <tr>
            <th
              class="text-sm font-medium px-6 py-4 text-left capitalize"
            >
              id
            </th>
            <th
              class="text-sm font-medium px-6 py-4 text-left capitalize"
            >
            title
            </th>
            <th
              class="text-sm font-medium px-6 py-4 text-left capitalize"
            >
            summary
            </th>
            <th
              class="text-sm font-medium px-6 py-4 text-left capitalize"
            >
            publishedAt
            </th>
            <th
              class="text-sm font-medium px-6 py-4 text-left capitalize"
            >
            updatedAt
            </th>
            <th
              class="text-sm font-medium px-6 py-4 text-left capitalize"
            >
            author
            </th>
            <th
              class="text-sm font-medium px-6 py-4 text-left capitalize"
            >
            tags
            </th>
            <th
              colspan="2"
              class="text-sm font-medium px-6 py-4 text-left capitalize"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item['@id']" class="border-b">
            <td class="px-6 py-4 text-sm">
              <router-link
                v-if="item"
                :to="{ name: 'PublicationShow', params: { id: item['@id'] } }"
                class="text-blue-600 hover:text-blue-800"
              >
                {{ item["@id"] }}
              </router-link>
            </td>
            <td class="px-6 py-4 text-sm">
            {{ item.title }}
                        </td>
            <td class="px-6 py-4 text-sm">
            {{ item.summary }}
                        </td>
            <td class="px-6 py-4 text-sm">
            {{ formatDateTime(item.publishedAt) }}
            </td>
            <td class="px-6 py-4 text-sm">
            {{ formatDateTime(item.updatedAt) }}
            </td>
            <td class="px-6 py-4 text-sm">
            <template v-if="router.hasRoute('UserShow')">
              <router-link
                :to="{ name: 'UserShow', params: { id: item.author['@id']} }"
                :key="item.author['@id']"
                >
            {{ item.author.username }}
          </router-link>
            </template>
            </td>
            <td class="px-6 py-4 text-sm">
            <template v-if="router.hasRoute('TagShow')">
              <router-link
                v-for="tag in item.tags"
                :to="{ name: 'TagShow', params: { id: tag['@id'] } }"
                :key="tag"
                class="text-blue-600 hover:text-blue-800"
              >
                {{ tag.name }}

                <br />
              </router-link>
            </template>

            <template v-else>
              <p
                v-for="tag in item.tags"
                :key="tag"
              >
                {{ tag }}
              </p>
            </template>
            </td>
            <td class="px-6 py-4 text-sm">
              <router-link
                :to="{ name: 'PublicationShow', params: { id: item['@id'] } }"
                class="px-6 py-2 bg-blue-600 text-white text-xs rounded shadow-md hover:bg-blue-700"
              >
                Show
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="view" class="flex justify-center">
      <nav aria-label="Page navigation">
        <ul class="flex list-style-none">
          <li :class="{ disabled: !view['hydra:previous'] }">
            <router-link
              :to="
                view['hydra:first']
                  ? view['hydra:first']
                  : { name: 'PublicationList' }
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
                  ? { name: 'PublicationList' }
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
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { usePublicationDeleteStore } from "@/stores/publication/delete";
import { usePublicationListStore } from "@/stores/publication/list";
import { formatDateTime } from "@/utils/date";
import { useMercureList } from "@/composables/mercureList";
import { useUserAuthStore } from "@/stores/authenticator/auth";

const route = useRoute();
const router = useRouter();

const publicationDeleteStore = usePublicationDeleteStore();
const { deleted: deletedItem, mercureDeleted: mercureDeletedItem } =
  storeToRefs(publicationDeleteStore);
const useAuthStore = useUserAuthStore();
const publicationListStore = usePublicationListStore();
const { items, error, view, isLoading } = storeToRefs(publicationListStore);

useMercureList({ store: publicationListStore, deleteStore: publicationDeleteStore });

watch(
  () => route.query.page,
  (newPage) => {
    const page = newPage as string;
    publicationListStore.getItems(page);
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  publicationDeleteStore.$reset();
});
</script>
