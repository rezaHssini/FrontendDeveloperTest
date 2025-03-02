<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <!-- Preloader -->
    <Preloader :show="isLoadingRoute" />

    <!-- Header -->
    <header class="fixed w-full bg-white dark:bg-gray-800 shadow-sm z-50">
      <div class="px-4 w-full">
        <div class="flex items-center justify-between h-16">
          <!-- Left Header: Menu Button + Logo -->
          <div class="flex items-center space-x-4">
            <!-- Menu Button (visible on all screens) -->
            <button
              @click="toggleSidebar"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-600 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <!-- Logo (visible on all screens) -->
            <div class="h-12 p-1 rounded-2xl overflow-hidden">
              <img
                :src="isDark ? '/logo-dark.webp' : '/logo-light.webp'"
                alt="Logo"
                class="h-full rounded-xl object-contain"
              />
            </div>
          </div>

          <!-- Right Header Items -->
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <SearchDialog />

            <!-- Theme Toggle -->
            <button
              @click="toggleTheme"
              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg
                v-if="isDark"
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>

            <!-- Profile -->
            <div class="relative">
              <button
                @click="isProfileOpen = !isProfileOpen"
                class="flex items-center space-x-2 focus:outline-none"
              >
                <div
                  class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center"
                >
                  <img
                    v-if="user?.avatar"
                    :src="user.avatar"
                    alt="Profile"
                    class="w-full h-full object-cover"
                  />
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-500 dark:text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-500 dark:text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="isProfileOpen"
                class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
              >
                <div
                  class="py-2"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <!-- User Info -->
                  <div class="px-4 py-2 border-b dark:border-gray-700">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user?.name || 'User Name' }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {{ user?.email || 'user@example.com' }}
                    </p>
                  </div>

                  <!-- Menu Items -->
                  <router-link
                    to="/user/profile"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                    @click="isProfileOpen = false"
                  >
                    Your Profile
                  </router-link>
                  <router-link
                    to="/user/settings"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                    @click="isProfileOpen = false"
                  >
                    Settings
                  </router-link>
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Overlay for mobile -->
    <div
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
    ></div>

    <!-- Sidebar and Main Content -->
    <div class="flex pt-16">
      <!-- Sidebar -->
      <aside
        :class="{
          'w-20 lg:translate-x-0': !isSidebarOpen && !isHovered,
          'w-64': isSidebarOpen || isHovered,
          '-translate-x-full': (!isSidebarOpen && !isHovered && !isLargeScreen) || isLoadingRoute,
          'translate-x-0': (isSidebarOpen || isHovered || isLargeScreen) && !isLoadingRoute,
        }"
        class="fixed h-full bg-white dark:bg-gray-800 shadow-lg z-50"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <!-- Navigation -->
        <nav class="px-4 py-6">
          <!-- Main Navigation -->
          <div class="space-y-1">
            <h3
              class="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider overflow-hidden transition-all duration-300"
              :class="{ 'opacity-0': !isSidebarOpen && !isHovered }"
            >
              Main
            </h3>
            <router-link
              v-for="item in mainMenuItems"
              :key="item.name"
              :to="item.to"
              class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
              :class="{
                'bg-gray-900 text-white dark:bg-white dark:text-gray-900': $route.path === item.to,
                'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50':
                  $route.path !== item.to,
              }"
            >
              <component
                :is="item.icon"
                class="w-5 h-5 flex-shrink-0"
                :class="[
                  $route.path === item.to
                    ? 'text-white dark:text-gray-900'
                    : 'text-gray-600 dark:text-gray-400',
                  isSidebarOpen || isHovered ? 'mr-3' : '',
                ]"
              />
              <span
                class="font-medium whitespace-nowrap transition-all duration-300"
                :class="{
                  'opacity-0 w-0': !isSidebarOpen && !isHovered,
                  'opacity-100 w-auto': isSidebarOpen || isHovered,
                }"
              >
                {{ item.name }}
              </span>
            </router-link>
          </div>

          <!-- Management Section -->
          <div class="mt-8 space-y-1">
            <h3
              class="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider overflow-hidden transition-all duration-300"
              :class="{ 'opacity-0': !isSidebarOpen && !isHovered }"
            >
              Management
            </h3>
            <router-link
              v-for="item in managementMenuItems"
              :key="item.name"
              :to="item.to"
              class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
              :class="{
                'bg-gray-900 text-white dark:bg-white dark:text-gray-900': $route.path === item.to,
                'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50':
                  $route.path !== item.to,
              }"
            >
              <component
                :is="item.icon"
                class="w-5 h-5 flex-shrink-0"
                :class="[
                  $route.path === item.to
                    ? 'text-white dark:text-gray-900'
                    : 'text-gray-600 dark:text-gray-400',
                  isSidebarOpen || isHovered ? 'mr-3' : '',
                ]"
              />
              <span
                class="font-medium whitespace-nowrap transition-all duration-300"
                :class="{
                  'opacity-0 w-0': !isSidebarOpen && !isHovered,
                  'opacity-100 w-auto': isSidebarOpen || isHovered,
                }"
              >
                {{ item.name }}
              </span>
            </router-link>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main
        class="bg-gray-50 dark:bg-gray-900/50 min-h-[calc(100vh-4rem)] w-full transition-[margin] duration-300"
        :class="{
          'ml-20': !isSidebarOpen && !isHovered && isLargeScreen,
          'ml-64': (isSidebarOpen || isHovered) && isLargeScreen,
          'ml-0': !isLargeScreen || isLoadingRoute,
        }"
      >
        <div class="h-full p-6 w-full">
          <div class="max-w-7xl mx-auto h-full">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm min-h-[calc(100vh-7rem)]">
              <div class="p-6">
                <router-view v-slot="{ Component }">
                  <component :is="Component" />
                </router-view>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Preloader from '../components/Preloader.vue'
import SearchDialog from '../components/SearchDialog.vue'
import { isLoadingRoute } from '../router'
import { useAuthStore } from '../stores/auth'
import { HomeIcon } from '@heroicons/vue/16/solid'

const { getUserDetails, logout } = useAuthStore()
const router = useRouter()
const isSidebarOpen = ref(false)
const isProfileOpen = ref(false)
const isHovered = ref(false)

const user = ref(getUserDetails())
const handleLogout = async () => {
  isProfileOpen.value = false
  router.push('/auth/login')
  await logout()
}

const closeProfileDropdown = (e: MouseEvent) => {
  if (isProfileOpen.value && !(e.target as HTMLElement).closest('.relative')) {
    isProfileOpen.value = false
  }
}

window.addEventListener('click', closeProfileDropdown)

onUnmounted(() => {
  window.removeEventListener('click', closeProfileDropdown)
})

const handleMouseEnter = () => {
  if (!isSidebarOpen.value && isLargeScreen.value) {
    isHovered.value = true
  }
}

const handleMouseLeave = () => {
  isHovered.value = false
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  isHovered.value = false
}

const mainMenuItems = [
  {
    name: 'Dashboard',
    to: '/user',
    icon: HomeIcon,
  },
]

const managementMenuItems = []

const isLargeScreen = ref(window.innerWidth >= 1024)

const handleResize = () => {
  isLargeScreen.value = window.innerWidth >= 1024
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');

.font-playfair {
  font-family: 'Playfair Display', serif;
}
</style>
