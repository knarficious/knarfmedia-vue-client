<template>
    <div class="container mx-auto px-4 max-w-2xl mt-4">
        <div v-if="data">
        <div class="px-6 py-4 whitespace-nowrap">
            {{ data.username }}
        </div>        
         <div class="px-6 py-4 whitespace-nowrap">
            <h3>Vos Publications: Quantité={{ data.posts?.length }} : </h3>
            <br/>
            <template v-if="router.hasRoute('PublicationShow')" >
            <router-link 
            v-for="post in data.posts"
                :to="{ name: 'PublicationShow', params: { id: post } }"
                :key="post"
                class="text-blue-600 hover:text-blue-800"
            >
                {{ post }}

                <br />
            </router-link>
            </template>
            <template v-else>
              <p
                v-for="post in data.posts"
                :key="post"
              >
                {{ post }}
              </p>
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
//import router from '@/router';
import { useUserAuthStore } from '@/stores/authenticator/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from "vue-router";
import { usePublicationDeleteStore } from '@/stores/publication/delete';
const publicationDeleteStore = usePublicationDeleteStore();
const authStore = useUserAuthStore();
const { retrieved: data } = storeToRefs(authStore);
const router = useRouter();

</script>