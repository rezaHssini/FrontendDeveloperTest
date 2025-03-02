import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'
import { jwtDecode } from 'jwt-decode'

export const isLoadingRoute = ref(false)

import MainLayout from '../layouts/main.vue'
import AuthLayout from '../layouts/auth.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/user',
    },
    // Main Layout Routes
    {
      path: '/user',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/Dashboard.vue'),
        },
      ],
    },
    // Auth Layout Routes
    {
      path: '/auth',
      component: AuthLayout,
      meta: { guest: true },
      children: [
        {
          path: '',
          redirect: { name: 'login' },
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/Login.vue'),
        },
      ],
    },

    // 404 Route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const { getTokens, refreshToken } = useAuthStore()
  isLoadingRoute.value = true

  if (to.matched.some((record) => record.meta.guest)) {
    return next()
  }

  try {
    const tokens = getTokens()

    if (!tokens.accessToken) {
      return next({ name: 'login' })
    }

    const decodedAccess = jwtDecode<{ exp: number }>(tokens.accessToken)
    const accessExpiration = decodedAccess.exp * 1000

    if (accessExpiration > Date.now()) {
      return next()
    }

    if (!tokens.refreshToken) {
      return next({ name: 'login' })
    }

    const decodedRefresh = jwtDecode<{ exp: number }>(tokens.refreshToken)
    const refreshExpiration = decodedRefresh.exp * 1000

    if (refreshExpiration > Date.now()) {
      await refreshToken()
      return next()
    }

    return next({ name: 'login' })
  } catch (error) {
    console.error('Auth error:', error)
    return next({ name: 'login' })
  }
})

router.afterEach(() => {
  setTimeout(() => {
    isLoadingRoute.value = false
  }, 3000)
})

export default router
