<template>
  <div class="space-y-8">
    <!-- Stats Section -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
      <!-- Total Users -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex flex-col">
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</dt>
          <dd class="mt-2">
            <div class="flex items-baseline text-2xl font-semibold text-gray-900 dark:text-white">
              <template v-if="isLoading">
                <div class="h-8 bg-gray-200 dark:bg-gray-700/50 rounded w-24 animate-pulse"></div>
              </template>
              <template v-else>
                {{ formatNumber(stats?.totalUsersCount ?? 0) }}
              </template>
            </div>
          </dd>
        </div>
      </div>

      <!-- Monthly Tokens -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex flex-col">
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Tokens</dt>
          <dd class="mt-2">
            <div class="flex items-baseline text-2xl font-semibold text-gray-900 dark:text-white">
              <template v-if="isLoading">
                <div class="h-8 bg-gray-200 dark:bg-gray-700/50 rounded w-24 animate-pulse"></div>
              </template>
              <template v-else>
                {{ formatNumber(monthlyTokens) }}
              </template>
            </div>
          </dd>
        </div>
      </div>

      <!-- Today's Requests -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex flex-col">
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Today's Requests</dt>
          <dd class="mt-2">
            <div class="flex items-baseline text-2xl font-semibold text-gray-900 dark:text-white">
              <template v-if="isLoading">
                <div class="h-8 bg-gray-200 dark:bg-gray-700/50 rounded w-24 animate-pulse"></div>
              </template>
              <template v-else>
                {{ formatNumber(stats?.totalDayRequests ?? 0) }}
              </template>
            </div>
          </dd>
        </div>
      </div>

      <!-- Weekly Requests -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex flex-col">
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Weekly Requests</dt>
          <dd class="mt-2">
            <div class="flex items-baseline text-2xl font-semibold text-gray-900 dark:text-white">
              <template v-if="isLoading">
                <div class="h-8 bg-gray-200 dark:bg-gray-700/50 rounded w-24 animate-pulse"></div>
              </template>
              <template v-else>
                {{ formatNumber(stats?.totalWeekRequests ?? 0) }}
              </template>
            </div>
          </dd>
        </div>
      </div>

      <!-- Monthly Requests -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div class="flex flex-col">
          <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Monthly Requests</dt>
          <dd class="mt-2">
            <div class="flex items-baseline text-2xl font-semibold text-gray-900 dark:text-white">
              <template v-if="isLoading">
                <div class="h-8 bg-gray-200 dark:bg-gray-700/50 rounded w-24 animate-pulse"></div>
              </template>
              <template v-else>
                {{ formatNumber(stats?.totalMonthRequests ?? 0) }}
              </template>
            </div>
          </dd>
        </div>
      </div>
    </div>

    <!-- Chart Section -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Provider History</h2>
        <div class="space-y-8">
          <!-- Requests Chart -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Requests</h3>
            <div class="h-[300px]">
              <ContentSkeleton v-if="isLoading" type="chart" />
              <Line v-else :data="requestsChartData" :options="requestsChartOptions" />
            </div>
          </div>

          <!-- Tokens Chart -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Tokens</h3>
            <div class="h-[300px]">
              <ContentSkeleton v-if="isLoading" type="chart" />
              <Line v-else :data="tokensChartData" :options="tokensChartOptions" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Share Charts Section -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div class="p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Provider Share Distribution
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Today's Share -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Today's Share</h3>
            <div class="h-[300px] relative">
              <ContentSkeleton v-if="isLoading" type="chart" />
              <Pie v-else :data="todayShareChartData" :options="pieChartOptions" />
            </div>
          </div>
          <!-- Monthly Share -->
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">30 Days Share</h3>
            <div class="h-[300px] relative">
              <ContentSkeleton v-if="isLoading" type="chart" />
              <Pie v-else :data="monthlyShareChartData" :options="pieChartOptions" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Latest Provider Statistics Table -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            Latest Provider Statistics
          </h2>
          <router-link
            to="/user/providers"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
          >
            <span>Show All</span>
            <svg
              class="ml-2 -mr-1 h-4 w-4 text-gray-900 dark:text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </router-link>
        </div>
        <div class="overflow-x-auto -mx-6">
          <div class="inline-block min-w-full align-middle px-6">
            <ContentSkeleton v-if="isLoading" type="table" :rows="5" :columns="3" />
            <table
              v-else
              class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed md:table-auto hidden md:table"
            >
              <thead class="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[200px] md:w-auto"
                  >
                    Provider
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[200px] md:w-auto"
                  >
                    Today
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[200px] md:w-auto"
                  >
                    30 Days
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[200px] md:w-auto"
                  >
                    Today Tokens
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[200px] md:w-auto"
                  >
                    30 Days Tokens
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[200px] md:w-auto"
                  >
                    Today %
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[200px] md:w-auto"
                  >
                    30 Days %
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
              >
                <tr v-for="provider in providerStats" :key="provider.provider">
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white truncate"
                  >
                    {{ provider.provider }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatNumber(provider.todayCount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatNumber(provider.monthCount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatNumber(provider.todayTokens) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatNumber(provider.monthTokens) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ provider.todayPercentage.toFixed(1) }}%
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ provider.monthPercentage.toFixed(1) }}%
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Mobile View -->
            <div class="md:hidden space-y-4">
              <div
                v-for="provider in providerStats"
                :key="provider.provider"
                class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div class="divide-y divide-gray-200 dark:divide-gray-700">
                  <div class="p-4 flex justify-between items-center">
                    <span class="font-medium text-gray-900 dark:text-white">Provider</span>
                    <span class="text-gray-900 dark:text-white">{{ provider.provider }}</span>
                  </div>
                  <div class="p-4 flex justify-between items-center">
                    <span class="text-gray-500 dark:text-gray-400">Today</span>
                    <span class="text-gray-900 dark:text-white">{{
                      formatNumber(provider.todayCount)
                    }}</span>
                  </div>
                  <div class="p-4 flex justify-between items-center">
                    <span class="text-gray-500 dark:text-gray-400">30 Days</span>
                    <span class="text-gray-900 dark:text-white">{{
                      formatNumber(provider.monthCount)
                    }}</span>
                  </div>
                  <div class="p-4 flex justify-between items-center">
                    <span class="text-gray-500 dark:text-gray-400">Today Tokens</span>
                    <span class="text-gray-900 dark:text-white">{{
                      formatNumber(provider.todayTokens)
                    }}</span>
                  </div>
                  <div class="p-4 flex justify-between items-center">
                    <span class="text-gray-500 dark:text-gray-400">30 Days Tokens</span>
                    <span class="text-gray-900 dark:text-white">{{
                      formatNumber(provider.monthTokens)
                    }}</span>
                  </div>
                  <div class="p-4 flex justify-between items-center">
                    <span class="text-gray-500 dark:text-gray-400">Today %</span>
                    <span class="text-gray-900 dark:text-white"
                      >{{ provider.todayPercentage.toFixed(1) }}%</span
                    >
                  </div>
                  <div class="p-4 flex justify-between items-center">
                    <span class="text-gray-500 dark:text-gray-400">30 Days %</span>
                    <span class="text-gray-900 dark:text-white"
                      >{{ provider.monthPercentage.toFixed(1) }}%</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Users Table -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Top Users(Monthly)</h2>
          <router-link
            to="/user/users"
            class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
          >
            <span>Show All</span>
            <svg
              class="ml-2 -mr-1 h-4 w-4 text-gray-900 dark:text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </router-link>
        </div>
        <div class="overflow-x-auto -mx-6">
          <div class="inline-block min-w-full align-middle px-6">
            <ContentSkeleton v-if="isLoading" type="table" :rows="5" :columns="3" />
            <table
              v-else
              class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed md:table-auto hidden md:table"
            >
              <thead class="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[300px] md:w-auto"
                  >
                    Email
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[200px] md:w-auto"
                  >
                    Requests
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[200px] md:w-auto"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
              >
                <tr v-if="!stats?.dayTopUsers?.length">
                  <td
                    colspan="3"
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center"
                  >
                    No data available
                  </td>
                </tr>
                <tr
                  v-for="(user, index) in stats?.dayTopUsers"
                  :key="user.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white truncate"
                  >
                    <div class="flex items-center">
                      <span class="w-6 text-gray-500 dark:text-gray-400"> #{{ index + 1 }} </span>
                      <span class="truncate">{{ user.email }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatNumber(user.requestsCount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <router-link
                      :to="`user/details/${user.id}`"
                      class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                    >
                      View Details
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Mobile View -->
            <div class="md:hidden space-y-4">
              <div
                v-for="(user, index) in stats?.dayTopUsers"
                :key="user.id"
                class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div class="divide-y divide-gray-200 dark:divide-gray-700">
                  <div class="p-4 flex justify-between items-center">
                    <span class="font-medium text-gray-900 dark:text-white">Rank</span>
                    <span class="text-gray-500 dark:text-gray-400">#{{ index + 1 }}</span>
                  </div>
                  <div class="p-4 flex justify-between items-center">
                    <span class="text-gray-500 dark:text-gray-400">Email</span>
                    <span class="text-gray-900 dark:text-white truncate max-w-[200px]">{{
                      user.email
                    }}</span>
                  </div>
                  <div class="p-4 flex justify-between items-center">
                    <span class="text-gray-500 dark:text-gray-400">Requests</span>
                    <span class="text-gray-900 dark:text-white">{{
                      formatNumber(user.requestsCount)
                    }}</span>
                  </div>
                  <div class="p-4 flex justify-between items-center">
                    <span class="text-gray-500 dark:text-gray-400">Actions</span>
                    <router-link
                      :to="`user/details/${user.id}`"
                      class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                    >
                      View Details
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import ContentSkeleton from '../components/ContentSkeleton.vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js'
import { Line, Pie } from 'vue-chartjs'
import { GetSystemStatDto, useStatStore } from '../stores/stats'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
)

const isLoading = ref(true)
const stats = ref<GetSystemStatDto>()
const store = useStatStore()

const monthlyTokens = computed(() => {
  if (!stats.value?.lastMonthRequestsHistory) return 0

  return stats.value.lastMonthRequestsHistory.reduce((total, day) => {
    const dayTotal = day.providers.reduce((sum, provider) => sum + provider.tokens, 0)
    return total + dayTotal
  }, 0)
})

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

const requestsChartData = computed(() => ({
  labels:
    stats.value?.lastMonthRequestsHistory
      .map((h) =>
        new Date(h.date).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        }),
      )
      .reverse() ?? [],
  datasets:
    stats.value?.lastMonthRequestsHistory[0]?.providers.flatMap((provider) => ({
      label: `${provider.provider} Requests`,
      data: stats.value?.lastMonthRequestsHistory
        .map((day) => {
          const providerData = day.providers.find((p) => p.provider === provider.provider)
          return providerData?.count ?? 0
        })
        .reverse(),

      backgroundColor: 'transparent',
      tension: 0.4,
      borderWidth: 1.5,
      pointRadius: 2,
    })) ?? [],
}))

const tokensChartData = computed(() => ({
  labels:
    stats.value?.lastMonthRequestsHistory
      .map((h) =>
        new Date(h.date).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        }),
      )
      .reverse() ?? [],
  datasets:
    stats.value?.lastMonthRequestsHistory[0]?.providers.map((provider) => ({
      label: `${provider.provider} Tokens`,
      data: stats.value?.lastMonthRequestsHistory
        .map((day) => {
          const providerData = day.providers.find((p) => p.provider === provider.provider)
          return providerData?.tokens ?? 0
        })
        .reverse(),
      backgroundColor: 'transparent',
      tension: 0.4,
      borderWidth: 1.5,
      pointRadius: 2,
    })) ?? [],
}))

const baseChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#E5E7EB50',
      },
      ticks: {
        callback: (value: number) => formatNumber(value),
        color: '#6B7280',
        precision: 0,
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#6B7280',
        maxRotation: 45,
        minRotation: 45,
      },
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#374151',
        usePointStyle: true,
        pointStyle: 'circle',
      },
    },
    tooltip: {
      backgroundColor: '#FFFFFF',
      titleColor: '#111827',
      bodyColor: '#374151',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      callbacks: {
        label: (context) => {
          return `${context.dataset.label}: ${Math.round(context.parsed.y).toLocaleString()}`
        },
      },
    },
  },
}))

const requestsChartOptions = computed(() => ({
  ...baseChartOptions.value,
  plugins: {
    ...baseChartOptions.value.plugins,
    tooltip: {
      ...baseChartOptions.value.plugins.tooltip,
      callbacks: {
        label: (context) => {
          return `${context.dataset.label}: ${Math.round(
            context.parsed.y,
          ).toLocaleString()} requests`
        },
      },
    },
  },
}))

const tokensChartOptions = computed(() => ({
  ...baseChartOptions.value,
  plugins: {
    ...baseChartOptions.value.plugins,
    tooltip: {
      ...baseChartOptions.value.plugins.tooltip,
      callbacks: {
        label: (context) => {
          return `${context.dataset.label}: ${Math.round(context.parsed.y).toLocaleString()} tokens`
        },
      },
    },
  },
}))

const providerStats = computed(() => {
  if (!stats.value?.lastMonthRequestsHistory[0]?.providers) return []

  const history = stats.value.lastMonthRequestsHistory
  const todayData = history[0].providers

  const todayTotal = todayData.reduce((sum, p) => sum + p.count, 0)
  const todayTokensTotal = todayData.reduce((sum, p) => sum + p.tokens, 0)

  const monthlyTotals = new Map()
  const monthlyTokens = new Map()
  let monthlyTotal = 0
  let monthlyTokensTotal = 0

  history.forEach((day) => {
    day.providers.forEach((p) => {
      const currentCount = monthlyTotals.get(p.provider) || 0
      const currentTokens = monthlyTokens.get(p.provider) || 0
      monthlyTotals.set(p.provider, currentCount + p.count)
      monthlyTokens.set(p.provider, currentTokens + p.tokens)
      monthlyTotal += p.count
      monthlyTokensTotal += p.tokens
    })
  })

  return todayData
    .map((p) => ({
      provider: p.provider,
      todayCount: p.count,
      monthCount: monthlyTotals.get(p.provider) || 0,
      todayTokens: p.tokens,
      monthTokens: monthlyTokens.get(p.provider) || 0,
      todayPercentage: (p.count / todayTotal) * 100,
      monthPercentage: ((monthlyTotals.get(p.provider) || 0) / monthlyTotal) * 100,
      todayTokensPercentage: (p.tokens / todayTokensTotal) * 100,
      monthTokensPercentage: ((monthlyTokens.get(p.provider) || 0) / monthlyTokensTotal) * 100,
    }))
    .sort((a, b) => b.monthCount - a.monthCount)
})

const getPieChartColor = (index: number) => {
  const warmColors = [
    '#D64545', // Deep Red
    '#2A9D8F', // Dark Teal
    '#E67E22', // Burnt Orange
    '#4A6FA5', // Navy Blue
    '#E74C3C', // Dark Coral
    '#2D8A4E', // Forest Green
    '#D4AC0D', // Dark Gold
    '#5D4C86', // Deep Purple
    '#CC5A42', // Rusty Orange
    '#3B7A5C', // Deep Green
    '#B7950B', // Dark Yellow
  ]
  return warmColors[index % warmColors.length]
}

const todayShareChartData = computed(() => ({
  labels: providerStats.value.map((p) => p.provider),
  datasets: [
    {
      data: providerStats.value.map((p) => p.todayPercentage),
      backgroundColor: providerStats.value.map((_, i) => getPieChartColor(i)),
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
  ],
}))

const monthlyShareChartData = computed(() => ({
  labels: providerStats.value.map((p) => p.provider),
  datasets: [
    {
      data: providerStats.value.map((p) => p.monthPercentage),
      backgroundColor: providerStats.value.map((_, i) => getPieChartColor(i)),
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
  ],
}))

const pieChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: {
        color: '#374151',
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
        font: {
          size: 11,
        },
      },
    },
    tooltip: {
      backgroundColor: '#FFFFFF',
      titleColor: '#111827',
      bodyColor: '#374151',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      callbacks: {
        label: (context) => {
          const label = context.label || ''
          const value = context.raw.toFixed(1)
          return ` ${label}: ${value}%`
        },
      },
    },
  },
}))

onMounted(async () => {
  try {
    stats.value = await store.getSystemStat()
  } finally {
    isLoading.value = false
  }
})
</script>
