<template>
  <div>
    <!-- Trigger Button in Header -->
    <button
      @click="isOpen = true"
      class="flex items-center px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 text-gray-500 dark:text-gray-400"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <span class="ml-2 text-sm">Search...</span>
      <span class="ml-2 text-xs text-gray-400 dark:text-gray-500">⌘K</span>
    </button>

    <!-- Dialog Overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      @click="isOpen = false"
    ></div>

    <!-- Dialog Content -->
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-start justify-center p-4" @click.stop>
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-2xl mt-[200px]"
      >
        <!-- Search Header -->
        <div class="p-4 border-b border-gray-100 dark:border-gray-700">
          <!-- Close button for mobile -->
          <div class="flex justify-end mb-4 -mt-2 sm:hidden">
            <button
              @click="isOpen = false"
              class="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
              aria-label="Close dialog"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div class="flex items-center space-x-2">
            <input
              v-model="query"
              type="text"
              placeholder="Ask anything..."
              class="flex-1 bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white text-lg placeholder-gray-400 dark:placeholder-gray-500 h-10 px-3"
              @keyup.enter="handleSearch"
              ref="searchInput"
            />
            <button
              @click="handleSearch"
              :disabled="isLoading || !query.trim()"
              class="h-10 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <svg
                v-if="isLoading"
                class="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Send</span>
            </button>
            <!-- Close Button (desktop only) -->
            <button
              @click="isOpen = false"
              class="hidden sm:flex h-10 w-10 items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
              aria-label="Close dialog"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Results Area -->
        <div class="p-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
          <div v-if="result" class="prose dark:prose-invert max-w-none">
            <div class="text-gray-600 dark:text-gray-300" v-html="formattedResult"></div>
          </div>
          <div v-else-if="!isLoading" class="text-center text-gray-500 dark:text-gray-400">
            Start typing to search...
          </div>
          <div v-else class="text-center text-gray-500 dark:text-gray-400">Searching...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { marked } from 'marked'

const isOpen = ref(false)
const query = ref('')
const result = ref('')
const isLoading = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

const formattedResult = computed(() => {
  return marked(result.value)
})

const handleSearch = async () => {
  if (!query.value.trim() || isLoading.value) return

  isLoading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    result.value =
      `Here's what I found for "${query.value}":\n\n` +
      '- This is a sample response\n' +
      '- It supports **markdown** formatting\n' +
      '- You can replace this with actual LLM response'
  } catch (error) {
    result.value = 'An error occurred while searching. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    isOpen.value = true
    setTimeout(() => {
      searchInput.value?.focus()
    }, 100)
  }

  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style></style>
