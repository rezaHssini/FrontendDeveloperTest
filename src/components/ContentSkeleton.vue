<template>
  <div class="animate-pulse">
    <div v-if="type === 'chart'" class="h-[300px] bg-gray-200 dark:bg-gray-700/50 rounded-lg"></div>

    <div v-else-if="type === 'table'" class="space-y-4">
      <div class="h-8 bg-gray-200 dark:bg-gray-700/50 rounded-lg w-1/3"></div>
      <div class="space-y-3">
        <div v-for="i in rows" :key="i" class="flex gap-4">
          <div
            v-for="j in columns"
            :key="j"
            class="h-10 bg-gray-200 dark:bg-gray-700/50 rounded-lg"
            :class="[j === 1 ? 'w-1/4' : 'flex-1']"
          ></div>
        </div>
      </div>
    </div>

    <div v-else-if="type === 'card'" class="space-y-4">
      <div class="h-8 bg-gray-200 dark:bg-gray-700/50 rounded-lg w-1/3"></div>
      <div class="space-y-4">
        <div
          v-for="i in rows"
          :key="i"
          class="p-4 bg-gray-200 dark:bg-gray-700/50 rounded-lg space-y-3"
        >
          <div v-for="j in 3" :key="j" class="flex justify-between">
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'chart' | 'table' | 'card'
  rows?: number
  columns?: number
}>()
</script>
