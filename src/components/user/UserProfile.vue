<template>
    <div class="container mx-auto px-4 max-w-2xl mt-4">
        <div v-if="data">
        <div class="px-6 py-4 whitespace-nowrap">
            {{ data.username }}
        </div>        
         <div class="px-6 py-4 whitespace-nowrap">
            <h3>Vos Publications:  </h3>
            <br/>
            <template v-for="item in items" :key="item['@id']" >
            <div class="px-6 py-4">
              <router-link
                v-if="item.author.username === authStore.getUser?.username"
                :to="{ name: 'PublicationShow', params: { id: item['@id'] } }"
                class="text-blue-600 hover:text-blue-800"
            >
                {{ item.title }}

                <br />
            </router-link>
          </div>
            </template>

            <br>
            <h3>Vos Commentaires: Quantité={{ data.comments?.length }} : </h3>
            <br/>
            <template v-if="router.hasRoute('CommentShow')">
            <router-link 
            v-for="comment in data.comments"
                :to="{ name: 'CommentShow', params: { id: comment } }"
                :key="comment"
                class="text-blue-600 hover:text-blue-800"
            >
                {{ comment }}

                <br />
            </router-link>
            </template>
            <template v-else>
              <p
                v-for="comment in data.comments"
                :key="comment"
              >
                {{ comment }}
              </p>
            </template>

         </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { watch } from 'vue';
import { useUserAuthStore } from '@/stores/authenticator/auth';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from "vue-router";
import { usePublicationListStore } from "@/stores/publication/list";
const authStore = useUserAuthStore();
const publicationListStore = usePublicationListStore();
const { retrieved: data } = storeToRefs(authStore);
const { items, error, view, isLoading } = storeToRefs(publicationListStore);
const router = useRouter();
const route = useRoute();

watch(
  () => route.query.page,
  (newPage) => {
    const page = newPage as string;
    publicationListStore.getItems(page);
  },
  { immediate: true }
);

</script>