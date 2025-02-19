<template>
  <div class="">

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
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0 flex items-center justify-between">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Publications</h2>
        <p class="mt-2 text-lg leading-8 text-gray-600">Retouvez les dernières publications.</p>

      <div v-if="useAuthStore.isLoggedIn === true">
      <router-link
        :to="{ name: 'PublicationCreate' }"
        class="px-6 py-2 bg-green-600 text-white text-xs rounded shadow-md hover:bg-green-700"
      >
        Publier
      </router-link>
      </div>
      </div>
      <div class="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <article v-for="post in items" :key="post.id" class="flex max-w-xl flex-col rounded overflow-hidden shadow-lg items-center justify-between">
          <div class="flex items-center gap-x-4 text-xs">
            <template v-if="router.hasRoute('TagShow')">
              <router-link
                v-for="tag in post.tags"
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
                v-for="tag in post.tags"
                :key="tag"
              >
                {{ tag }}
              </p>
            </template>
          </div>
          <div class="group relative">
            <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
              <router-link
                :to="{ name: 'PublicationShow', params: { id: post['@id'] } }"
                class="px-6 py-2 bg-blue-600 text-white text-xs rounded shadow-md hover:bg-blue-700"
              >
                {{ post.title }}
              </router-link>
            </h3>
            <p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{{ post.summary }}</p>
          </div>
          <div class="relative mt-8 flex items-center gap-x-4">
            <UserIcon class="h-6 w-6 rounded-full bg-gray-50" />
            <div class="text-sm leading-6">
              <p class="font-semibold text-gray-900">
                <template v-if="router.hasRoute('UserShow')">
              <router-link
                :to="{ name: 'UserShow', params: { id: post.author['@id']} }"
                :key="post.author['@id']"
                >
                <span class="absolute inset-0" />
            {{ post.author.username }}
          </router-link>
          
            </template>

            <time :datetime="post.publishedAt" class="text-gray-500 ml-3">{{ formatDateTime(post.publishedAt) }}</time>
              </p>
              <p class="text-gray-600">{{ post.author.role }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
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
import { UserIcon } from "@heroicons/vue/24/outline";

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
