<script setup>
// Pas besoin de logique particulière
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center p-6">
    <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
    <p class="text-xl text-gray-600 mb-6">La page que vous recherchez n’existe pas.</p>

    <router-link
      to="/"
      class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Retour à l’accueil
    </router-link>
  </div>
</template>