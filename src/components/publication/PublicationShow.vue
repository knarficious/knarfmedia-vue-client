<template>
  <div class="container mx-auto px-4 max-w-2xl mt-4">
    <div class="flex items-center justify-between">

      <div v-if="useAuthStore.getIsLoggedIn === true && item?.author.username === useAuthStore.retrieved?.username">
        <router-link v-if="item" :to="{ name: 'PublicationUpdate', params: { id: item['@id'] } }"
          class="px-6 py-2 mr-2 bg-green-600 text-white text-xs rounded shadow-md hover:bg-green-700">
          Edit

        </router-link>
      </div>
      <div v-if="useAuthStore.getIsAdmin === true">
        <button class="px-6 py-2 bg-red-600 text-white text-xs rounded shadow-md hover:bg-red-700" @click="deleteItem">
          Delete
        </button>
      </div>
    </div>

    <!-- <h1 class="text-3xl my-4">Show Publication {{ item?.["@id"] }}</h1> -->

    <div v-if="isLoading" class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm" role="status">
      Loading...
    </div>

    <div v-if="error || deleteError" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm" role="alert">
      {{ error || deleteError }}
    </div>

    <div v-if="item" class="overflow-x-auto">
      <article class="bg-white rounded-2xl shadow-md overflow-hidden max-w-3xl mx-auto mb-8 justify-center">
        <!-- Image -->
        <!-- <img :src="image" alt="Image de l'article" class="w-full h-64 object-cover"> -->
        <div v-if="item.filePath">
          <img class="w-48 md:w-96 lg:w-250" v-bind:src="baseUrl + item.filePath" alt=" item.filePath " />
        </div>

        <!-- Contenu -->
        <div class="p-6">
          <!-- Titre -->
          <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ item.title }}</h1>

          <!-- Métadonnées -->
          <div class="text-sm text-gray-500 mb-4 flex flex-wrap justify-between items-center gap-2">
            <span>
              <template v-if="router.hasRoute('UserShow')">
                <router-link :to="{ name: 'UserShow', params: { id: item.author['@id'] } }" :key="item.author['@id']">
                  {{ item.author.username }}
                </router-link>
              </template></span>
            <span>{{ formatDateTime(item.publishedAt) }}</span>
          </div>

          <!-- Contenu -->
          <div class="prose max-w-none text-gray-800 mb-4" v-html="item.content"></div>

          <!-- Tags -->
          <template v-if="router.hasRoute('TagShow')">
            <router-link v-for="tag in item.tags" :to="{ name: 'TagShow', params: { id: tag['@id'] } }" :key="tag"
              class="text-blue-600 hover:text-blue-800">
              {{ tag.name }}

              <br />
            </router-link>
          </template>

          <template v-else>
            <p v-for="tag in item.tags" :key="tag">
              {{ tag.name }}
            </p>
          </template>
          <template v-for="comment in item.comments" :key="comment">
                <div class="py-2">
                  "{{ comment.content }}"
                  <span class="px-2">par {{ comment.author.username }}</span>
                  <span class="px-2">le {{ comment.publishedAt }}</span>
                </div>

                <br />
              </template>
        </div>
      </article>
      <router-link :to="{ name: 'PublicationList' }" class="text-blue-600 hover:text-blue-800 mb-8">
        &lt; Back to list
      </router-link>  
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { usePublicationShowStore } from "@/stores/publication/show";
import { usePublicationDeleteStore } from "@/stores/publication/delete";
import { formatDateTime } from "@/utils/date";
import { useMercureItem } from "@/composables/mercureItem";
import { useUserAuthStore } from "@/stores/authenticator/auth";

const route = useRoute();
const router = useRouter();
const baseUrl = "https://jaur-compartiment.s3.eu-north-1.amazonaws.com/uploads/";

const publicationDeleteStore = usePublicationDeleteStore();
const { error: deleteError, deleted } = storeToRefs(publicationDeleteStore);

const publicationShowStore = usePublicationShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(publicationShowStore);
const useAuthStore = useUserAuthStore();

useMercureItem({
  store: publicationShowStore,
  deleteStore: publicationDeleteStore,
  redirectRouteName: "PublicationList",
});

await publicationShowStore.retrieve(decodeURIComponent(route.params.id as string));

async function deleteItem() {
  if (!item?.value) {
    publicationDeleteStore.setError("This item does not exist anymore");
    return;
  }

  if (window.confirm("Are you sure you want to delete this publication?")) {
    await publicationDeleteStore.deleteItem(item.value);

    if (deleted) {
      router.push({ name: "PublicationList" });
    }
  }
}

function pushToComment() {

  const id = publicationShowStore.getPublication?.id;
  localStorage.setItem("publicationId", JSON.stringify(id));

  router.push({
    name: 'PublicationComment',
    params: { id: item?.value?.id }
  });

}

onBeforeUnmount(() => {
  publicationShowStore.$reset();
});
</script>
