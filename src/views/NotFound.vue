<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
    <div class="max-w-lg w-full text-center">
      <!-- 404 Image -->
      <div class="mb-8 flex justify-center">
        <img :src="'/404.svg'" alt="404" class="w-64 h-64" />
      </div>

      <!-- Content -->
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-8">
        The page you are looking for might have been removed, had its name changed, or is
        temporarily unavailable.
      </p>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <router-link
          :to="{ name: 'dashboard' }"
          class="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-2 transition-all duration-200 font-medium"
        >
          Go to Dashboard
        </router-link>
        <button
          @click="goBack"
          class="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-2 transition-all duration-200 font-medium"
        >
          Go Back
        </button>
      </div>

      <!-- Company Logo -->
      <div class="mt-12">
        <img
          :src="'/logo-light.webp'"
          alt="Company Logo"
          class="h-12 w-auto mx-auto rounded-2xl p-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>
