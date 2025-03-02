<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
    <!-- Simple Header -->
    <header class="w-full bg-white dark:bg-gray-800 shadow-sm">
      <div class="w-full px-6">
        <div class="flex items-center justify-between h-16">
          <!-- Logo - Left corner -->
          <div class="flex-shrink-0">
            <img
              :src="'/logo-light.webp'"
              alt="Logo"
              class="h-12 w-auto rounded-2xl p-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center py-12">
      <div class="w-full">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in" appear>
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Simple Footer -->
    <footer class="bg-white dark:bg-gray-800 shadow-sm mt-auto">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex flex-col items-center justify-center space-y-2">
          <div class="flex items-center space-x-4">
            <a
              href="#"
              class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Terms
            </a>
            <a
              href="#"
              class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="#"
              class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
            >
              Contact
            </a>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            © {{ new Date().getFullYear() }} Test App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  font-family: 'Inter', sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
