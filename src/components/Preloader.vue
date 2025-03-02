<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-white dark:bg-gray-900 z-[100] flex flex-col items-center justify-center transition-all duration-500"
    :class="{ 'opacity-0': isHiding }"
  >
    <!-- Logo Container -->
    <div class="bg-transparent h-32 rounded-3xl">
      <img :src="'/logo-light.webp'" alt="Logo" class="w-32 h-32 object-contain rounded-3xl" />
    </div>

    <!-- Progress Bar -->
    <div class="w-32 h-0.5 mt-5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        class="h-full bg-gray-900 dark:bg-white transition-all duration-300 ease-out"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'hidden'): void
}>()

const isHiding = ref(false)
const progress = ref(0)
let progressInterval: any = null

const startProgress = () => {
  // Reset states
  progress.value = 0
  isHiding.value = false

  // Clear any existing interval
  if (progressInterval) {
    clearInterval(progressInterval)
  }

  // Start new progress
  progressInterval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += 1
    } else {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      // Start hiding animation
      isHiding.value = true
      // Emit hidden event after animation
      setTimeout(() => {
        emit('hidden')
      }, 500)
    }
  }, 10)
}

// Watch for show prop changes
watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      startProgress()
    } else {
      // Clean up if hidden externally
      if (progressInterval) {
        clearInterval(progressInterval)
      }
    }
  },
  { immediate: true },
)

// Clean up on unmount
onMounted(() => {
  return () => {
    if (progressInterval) {
      clearInterval(progressInterval)
    }
  }
})
</script>
