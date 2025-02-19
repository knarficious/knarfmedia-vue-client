<template>
    <div class="card container mx-auto px-4 max-w-2xl mt-4">
        <div v-if="data">
        <div class="px-6 py-4">
            {{ data.username }} <span v-if="authStore.isAdmin == true">ADMIN</span>
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
            <h3>Vos Commentaires: </h3>
            <br/>
            <template v-for="comment in commentItems" :key="comment['@id']">
              <div class="px-6 py-4">
              <router-link 
              :to="{ name: 'CommentShow', params: { id: comment['@id'] } }"
                class="text-blue-600 hover:text-blue-800"
            >
                {{ comment['@id'] }}

                <br />
            </router-link>
            </div>
            </template>

         </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { watch } from 'vue';
import { useUserAuthStore } from '@/stores/authenticator/auth';
import { storeToRefs } from 'pinia';
import { useRoute } from "vue-router";
import { useUserPublicationsListStore } from "@/stores/publication/list_by_user";
import { useUserCommentsListStore } from '@/stores/comment/list_by_user';
const authStore = useUserAuthStore();
const publicationListStore = useUserPublicationsListStore();
const commentListStore = useUserCommentsListStore();
const { retrieved: data } = storeToRefs(authStore);
const { items } = storeToRefs(publicationListStore);
const { commentItems } = storeToRefs(commentListStore);
const route = useRoute();

watch(
  () => route.query.page,
  (newPage) => {
    const page = newPage as string;
    publicationListStore.getItems(page, authStore.retrieved?.id);
    commentListStore.getItems(page, authStore.retrieved?.id);
  },
  { immediate: true }
);

</script>