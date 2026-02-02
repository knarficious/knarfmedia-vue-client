<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useUserAuthStore } from '@/stores/authenticator/auth'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useHead } from '@unhead/vue'
import { storeToRefs } from 'pinia'

const useAuthStore = useUserAuthStore()
const { isLoggedIn } = storeToRefs(useAuthStore)
const route = useRoute()

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
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:description',
      content: 'Voici le blog de Franck aka Kifran aka LeKnarf aka Knarficious'
    },
    {
      property: 'og:url',
      content: 'https://blog.franckruer.fr'
    },
    {
      property: 'og:image',
      content: 'https://blog.franckruer/logo.png'
    }
  ]
})

const navigation = [{ name: 'Catégories', to: '/tags', current: false }]
if (import.meta.env.VUE_APP_DEBUG === 'true') {
  console.log('Debug mode')
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
                <DisclosureButton
                  class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span class="absolute -inset-0.5" />
                  <span class="sr-only">Open main menu</span>
                  <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
                  <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
                </DisclosureButton>
              </div>
              <div
                class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
              >
                <div class="flex flex-shrink-0 items-center">
                  <RouterLink to="/"
                    ><img class="h-8 w-auto" src="/logo.png" alt="Knarf Media"
                  /></RouterLink>
                </div>
                <div class="hidden sm:ml-6 sm:block">
                  <div class="flex space-x-4">
                    <RouterLink
                      v-for="item in navigation"
                      :key="item.name"
                      :to="item.to"
                      :class="[
                        route.path.startsWith(item.to)
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      ]"
                      :aria-current="item.current ? 'page' : undefined"
                      >{{ item.name }}</RouterLink
                    >
                  </div>
                </div>
              </div>
              <div
                class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
              >
                <button
                  type="button"
                  class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span class="absolute -inset-1.5" />
                  <span class="sr-only">View notifications</span>
                  <BellIcon class="h-6 w-6" aria-hidden="true" />
                </button>

                <!-- Profile dropdown -->
                <Menu as="div" class="relative ml-3">
                  <div>
                    <MenuButton
                      class="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span class="absolute -inset-1.5" />
                      <span class="sr-only">Open user menu</span>
                      <UserIcon class="h-8 w-8 rounded-full" aria-hidden="true" />
                    </MenuButton>
                  </div>
                  <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <MenuItems
                      class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <MenuItem v-if="isLoggedIn == true" v-slot="{ active }">
                        <RouterLink
                          to="/mon-compte"
                          :class="[
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          ]"
                          >Votre Profil</RouterLink
                        >
                      </MenuItem>
                      <MenuItem v-if="isLoggedIn === false" v-slot="{ active }">
                        <RouterLink
                          to="/connexion"
                          :class="[
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          ]"
                          >Se connecter</RouterLink
                        >
                      </MenuItem>
                      <MenuItem v-if="isLoggedIn === false" v-slot="{ active }">
                        <RouterLink
                          to="/creer-compte"
                          :class="[
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          ]"
                          >S'enregistrer</RouterLink
                        >
                      </MenuItem>
                      <MenuItem v-if="isLoggedIn === true" v-slot="{ active }">
                        <RouterLink
                          to="/deconnexion"
                          :class="[
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700'
                          ]"
                          >Se déconnecter</RouterLink
                        >
                      </MenuItem>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
            </div>
          </div>

          <DisclosurePanel class="sm:hidden">
            <div class="space-y-1 px-2 pb-3 pt-2">
              <DisclosureButton
                v-for="item in navigation"
                :key="item.name"
                as="div"
                :href="item.to"
                :class="[
                  route.path.startsWith(item.to)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium'
                ]"
                :aria-current="item.current ? 'page' : undefined"
                ><RouterLink :to="item.to">{{ item.name }}</RouterLink></DisclosureButton
              >
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </header>
    <main class="flex-1">
      <NotificationGroup group="foo">
        <div class="fixed inset-0 flex items-start justify-end p-6 px-4 py-6 pointer-events-none">
          <div class="w-full max-w-sm">
            <Notification
              v-slot="{ notifications }"
              enter="transform ease-out duration-300 transition"
              enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
              enter-to="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-500"
              leave-from="opacity-100"
              leave-to="opacity-0"
              move="transition duration-500"
              move-delay="delay-300"
            >
              <div
                class="flex w-full max-w-sm mx-auto mt-4 overflow-hidden bg-white rounded-lg shadow-md"
                v-for="notification in notifications"
                :key="notification.id ?? notification.timestamp"
              >
                <div class="flex items-center justify-center w-12 bg-green-500">
                  <svg
                    class="w-6 h-6 text-white fill-current"
                    viewBox="0 0 40 40"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"
                    />
                  </svg>
                </div>

                <div class="px-4 py-2 -mx-3">
                  <div class="mx-3">
                    <span class="font-semibold text-green-500">{{ notification.title }}</span>
                    <p class="text-sm text-gray-600">{{ notification.text }}</p>
                  </div>
                </div>
              </div>
            </Notification>
          </div>
        </div>
      </NotificationGroup>
      <RouterView />
    </main>
    <footer class="bg-gray-500 text-white py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Logo & description -->
          <div>
            <h2 class="text-xl font-bold mb-4">Knarf Media</h2>
            <p class="text-sm text-gray-400">Le blog de Franck</p>
          </div>

          <!-- Liens utiles -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Liens</h3>
            <ul class="space-y-2">
              <li>
                <router-link
                  :to="{ name: 'PublicationList' }"
                  class="text-gray-300 hover:text-white"
                >
                  Accueil
                </router-link>
              </li>
              <li>
                <router-link :to="{ name: 'TagList' }" class="text-gray-300 hover:text-white">
                  Catégories
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Ressources -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Ressources</h3>
            <ul class="space-y-2">
              <li>
                <a
                  href="https://api.knarfmedia.franckruer.fr"
                  target="_blank"
                  class="text-gray-300 hover:text-white"
                  >API</a
                >
              </li>
            </ul>
          </div>

          <!-- Réseaux sociaux -->
          <div>
            <h3 class="text-lg font-semibold mb-4">Suivez-moi</h3>
            <div class="flex space-x-4">
              <a href="https://x.com/KifranLeKnarf" class="text-gray-400 hover:text-white">
                <font-awesome-icon :icon="['fab', 'twitter']" />
              </a>
              <a href="https://www.youtube.com/@kifran6632" class="text-gray-400 hover:text-white">
                <font-awesome-icon :icon="['fab', 'youtube']" id="youtube" />
              </a>
              <a
                href="https://facebook.com/franckruer"
                target="_blank"
                class="text-gray-400 hover:text-white"
              >
                <font-awesome-icon :icon="['fab', 'facebook-f']" id="facebook" />
              </a>
              <a
                href="https://www.linkedin.com/in/franckruer/"
                class="text-gray-400 hover:text-white"
              >
                <font-awesome-icon :icon="['fab', 'linkedin']" id="linkedin" />
              </a>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-white-500">
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
