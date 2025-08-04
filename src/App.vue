<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useUserAuthStore } from '@/stores/authenticator/auth'
//import { useCookies } from 'vue3-cookies';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useHead } from '@vueuse/head'
const useAuthStore = useUserAuthStore();
//const {cookies} = useCookies();
document.readyState === "complete";
document.onreadystatechange = function() {
  useAuthStore.logout();
}

useHead({
  title: 'Le blog de Franck',
  meta: [
    {
      name: 'description',
      content: 'Voici le blog de Franck aka Kifran aka LeKnarf aka Knarficious'
    },
    {
      property: 'og:title',
      content: 'Le blog de Franck'
    },
    {
      property: 'og:description',
      content: 'Voici le blog de Franck aka Kifran aka LeKnarf aka Knarficious'
    },
    {
      property: 'og:url',
      content: 'https://blog.jaurinformatique.fr'
    },
    {
      property: 'og:image',
      content: ''
    }
  ]
})

const navigation = [
  { name: "À propos", to: "/about", current: false },
  { name: "Tags", to: "/tags", current: false },
]
if (import.meta.env.VUE_APP_DEBUG === 'true') {
  console.log('Debug mode');
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
  <header>
  <div class="">
  <Disclosure as="nav" class="bg-slate-500" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center">
            <RouterLink to="/"><img class="h-8 w-auto" src="/logo.png" alt="Knarf Media" /></RouterLink>
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <RouterLink v-for="item in navigation" :key="item.name" :to="item.to" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</RouterLink>
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <button type="button" class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span class="absolute -inset-1.5" />
            <span class="sr-only">View notifications</span>
            <BellIcon class="h-6 w-6" aria-hidden="true" />
          </button>

          <!-- Profile dropdown -->
          <Menu as="div" class="relative ml-3">
            <div>
              <MenuButton class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span class="absolute -inset-1.5" />
                <span class="sr-only">Open user menu</span>
                <UserIcon class="h-8 w-8 roundef-full" aria-hidden="true" />
              </MenuButton>
            </div>
            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem v-if="useAuthStore.isLoggedIn == true" v-slot="{ active }">
                  <RouterLink to="/profile" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Votre Profil</RouterLink>
                </MenuItem>
                <MenuItem v-if="useAuthStore.isLoggedIn === false" v-slot="{ active }">
                  <RouterLink to="/login" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Se connecter</RouterLink>
                </MenuItem>
                <MenuItem v-if="useAuthStore.isLoggedIn === false" v-slot="{ active }">
                  <RouterLink to="/register" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">S'enregistrer</RouterLink>
                </MenuItem>
                <MenuItem v-if="useAuthStore.isLoggedIn === true" v-slot="{ active }">
                  <RouterLink to="/logout" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Se déconnecter</RouterLink>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2">
        <DisclosureButton v-for="item in navigation" :key="item.name" as="RouterLink" :href="item.to" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
  </div>
</header>
<main class="flex-1">
  <RouterView />
</main>
  <footer class="bg-gray-500 text-white py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Logo & description -->
        <div>
          <h2 class="text-xl font-bold mb-4">Knarf Media</h2>
          <p class="text-sm text-gray-400">
            Le blog de Franck
          </p>
        </div>

        <!-- Liens utiles -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Liens</h3>
          <ul class="space-y-2">
            <li><a href="/" class="text-gray-300 hover:text-white">Accueil</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white">Contact</a></li>
          </ul>
        </div>

        <!-- Ressources -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Ressources</h3>
          <ul class="space-y-2">
            <li><a href="https://api.knarfmedia.jaurinformatique.fr" target="_blank" class="text-gray-300 hover:text-white">API</a></li>
          </ul>
        </div>

        <!-- Réseaux sociaux -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Suivez-moi</h3>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white">
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <font-awesome-icon icon="['fab', 'youtube']" id="youtube"/>
            </a>
            <a href="https://facebook.com/franckruer" target="_blank" class="text-gray-400 hover:text-white">
              <font-awesome-icon icon="['fab', 'facebook-f']" id="facebook"/>
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <font-awesome-icon icon="['fab', 'linkedin']" id="linkedin"/>
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        &copy; {{ new Date().getFullYear() }} Knarf Media. Tous droits réservés.
      </div>
    </div>
  </footer>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}


</style>
