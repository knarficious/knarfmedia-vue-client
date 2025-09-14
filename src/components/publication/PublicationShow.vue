<template>
  <div class="container mx-auto px-4 max-w-2xl mt-4">
    <div class="flex items-center justify-between">

      <div v-if="useAuthStore.getIsLoggedIn === true && item?.author.username === useAuthStore.retrieved?.username">
        <router-link v-if="item" :to="{ name: 'PublicationUpdate', params: { id: item['@id'] } }"
          class="px-6 py-2 mr-2 bg-green-600 text-white text-xs rounded shadow-md hover:bg-green-700">
          Modifier

        </router-link>
      </div>
      <div v-if="useAuthStore.getIsAdmin === true">
        <button class="px-6 py-2 bg-red-600 text-white text-xs rounded shadow-md hover:bg-red-700" @click="deleteItem">
          Supprimer
        </button>
      </div>
    </div>

    <!-- <h1 class="text-3xl my-4">Show Publication {{ item?.["@id"] }}</h1> -->

    <div v-if="isLoading" class="bg-blue-100 rounded py-4 px-4 text-blue-700 text-sm" role="status">
      Chargement...
    </div>

    <div v-if="error || deleteError" class="bg-red-100 rounded py-4 px-4 my-2 text-red-700 text-sm" role="alert">
      {{ error || deleteError }}
    </div>

    <div v-if="item" class="overflow-x-auto">
      <article class="bg-white rounded-2xl shadow-md overflow-hidden max-w-3xl mx-auto mb-8 justify-center">
        <!-- Image -->
        <!-- <img :src="image" alt="Image de l'article" class="w-full h-64 object-cover"> -->

        <div v-if="item?.filePath">
          <img v-if="isImage" class="w-48 md:w-96 lg:w-250" :src="awsUrl + item.filePath" :alt="item.filePath" />
          <video v-else-if="isVideo" class="w-48 md:w-96 lg:w-250" :src="awsUrl + item.filePath" controls />
          <audio v-else-if="isAudio" :src="awsUrl + item.filePath" controls />
          <p v-else class="text-sm text-red-600">Fichier non pris en charge : {{ item.filePath }}</p>
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
          

        </div>
      </article>
      <template v-if="useAuthStore.getIsLoggedIn === true">
        <router-link :to="{ name: 'PublicationComment', params: { id: item['@id'] } }" :key="item['@id']" class="px-3 ">Commenter</router-link>
      </template>
      <template v-for="comment in item.comments" :key="comment">
        <div class="py-2">
          "{{ comment.content }}"
          <span class="px-2">par {{ comment.author.username }}</span>
          <span class="px-2">le {{ comment.publishedAt }}</span>
        </div>

        <br />
      </template>
      <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"><router-link :to="{ name: 'PublicationList' }" class="">
        Retour
      </router-link></button>
      
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { usePublicationShowStore } from "@/stores/publication/show";
import { usePublicationDeleteStore } from "@/stores/publication/delete";
import { formatDateTime } from "@/utils/date";
import { useMercureItem } from "@/composables/mercureItem";
import { useUserAuthStore } from "@/stores/authenticator/auth";
import { useHead } from '@vueuse/head'

const route = useRoute();
const router = useRouter();
const awsUrl = "https://jaur-compartiment.s3.eu-north-1.amazonaws.com/uploads/";
const baseUrl = "https://blog.jaurinformatique.fr/publications/";

const publicationDeleteStore = usePublicationDeleteStore();
const { error: deleteError, deleted } = storeToRefs(publicationDeleteStore);

const publicationShowStore = usePublicationShowStore();
const { retrieved: item, isLoading, error } = storeToRefs(publicationShowStore);
const useAuthStore = useUserAuthStore();

const extension = computed(() => {
  const path = item?.value?.filePath || ''
  return path.split('.').pop()?.toLowerCase() || ''
})

const isImage = computed(() =>
  ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension.value)
)

const isVideo = computed(() =>
  ['mp4', 'webm', 'ogg', 'mov'].includes(extension.value)
)

const isAudio = computed(() =>
  ['mp3', 'wav', 'ogg', 'aac'].includes(extension.value)
)

useMercureItem({
  store: publicationShowStore,
  deleteStore: publicationDeleteStore,
  redirectRouteName: "PublicationList",
});

const isClient = typeof window !== 'undefined'

if (isClient) {
  await publicationShowStore.retrieve(decodeURIComponent(route.params.id as string));
}

async function deleteItem() {
  if (!item?.value) {
    publicationDeleteStore.setError("This item does not exist anymore");
    return;
  }

  if ( isClient && window.confirm("Are you sure you want to delete this publication?")) {
    await publicationDeleteStore.deleteItem(item.value);

    if (deleted) {
      router.push({ name: "PublicationList" });
    }
  }
}

function pushToComment() {

  if (!isClient) return;

  const id = publicationShowStore.getPublication?.id;
  localStorage.setItem("publicationId", JSON.stringify(id));

  router.push({
    name: 'PublicationComment',
    params: { id: item?.value?.id }
  });

}

watch(
  () => publicationShowStore.getPublication,
  (publication) => {
    if (!publication) return
  

    useHead({
      title: publication.title,
      link: [
        {
          rel: 'canonical',
          href: computed(() => baseUrl + publication.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
        }
      ],
      meta: [
        {
          name: 'description',
          content: publication.summary
        },
        {
          property: 'og:title',
          content: publication.title
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:description',
          content: publication.summary
        },
        {
          property: 'og:image',
          content: awsUrl + publication.filePath
        },
        {
          property: 'og:url',
          content: computed(() => baseUrl + publication.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'twitter:title',
          content: publication.title
        },
        {
          name: 'twitter:description',
          content: publication.summary
        },
        {
          name: 'twitter:image',
          content: awsUrl + publication.filePath
        }
      ]
    })
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  publicationShowStore.$reset();
});
</script>
