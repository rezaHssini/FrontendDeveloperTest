<template>
  <div class="w-full max-w-md mx-auto px-4 sm:px-6">
    <div
      class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8"
    >
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-8">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {{ getTabTitle() }}
        </h1>
        <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
          {{ getTabDescription() }}
        </p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleSubmit" class="space-y-5 sm:space-y-6">
        <!-- Social Login Buttons -->
        <div class="space-y-3" v-if="currentStep === 0">
          <button
            type="button"
            @click="handleGoogleLogin"
            class="w-full px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-2 transition-all duration-200 font-medium text-sm sm:text-base border border-gray-200 dark:border-gray-600 flex items-center justify-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            @click="handleMicrosoftLogin"
            class="w-full px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-2 transition-all duration-200 font-medium text-sm sm:text-base border border-gray-200 dark:border-gray-600 flex items-center justify-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#ff5722" d="M6 6h16v16H6z" />
              <path fill="#4caf50" d="M26 6h16v16H26z" />
              <path fill="#ffc107" d="M6 26h16v16H6z" />
              <path fill="#03a9f4" d="M26 26h16v16H26z" />
            </svg>
            Continue with Microsoft
          </button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500">Or</span>
            </div>
          </div>
        </div>

        <!-- Email Step -->
        <template v-if="currentStep === 0">
          <div class="space-y-1.5 sm:space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"> Email </label>
            <input
              type="email"
              v-model="form.email"
              required
              placeholder="Enter your email"
              class="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-gray-900 dark:focus:border-white transition-colors duration-200 text-sm sm:text-base"
            />
          </div>
        </template>

        <!-- Password Step -->
        <template v-if="currentStep === 1">
          <div class="space-y-1.5 sm:space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"> Password </label>
            <input
              type="password"
              v-model="form.password"
              required
              placeholder="Enter your password"
              class="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-gray-900 dark:focus:border-white transition-colors duration-200 text-sm sm:text-base"
            />
          </div>
          <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-500">
            {{ error }}
          </p>
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                type="checkbox"
                v-model="form.remember"
                class="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-white"
              />
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400"> Remember me </span>
            </label>
            <div class="text-sm">
              <router-link
                to="/auth/forgot-password"
                class="font-medium text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-200 transition-colors duration-200"
              >
                Forgot your password?
              </router-link>
            </div>
          </div>
        </template>

        <!-- 2FA Step -->
        <template v-if="currentStep === 2">
          <div class="space-y-1.5 sm:space-y-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300"> 2FA Code </label>
            <input
              type="text"
              v-model="form.twoFactorCode"
              required
              placeholder="Enter 6-digit code"
              maxlength="6"
              pattern="\d{6}"
              class="w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-gray-900 dark:focus:border-white transition-colors duration-200 text-sm sm:text-base"
            />
          </div>
        </template>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-3">
          <!-- Submit/Continue Button -->
          <button
            type="submit"
            class="w-full px-4 py-2.5 sm:py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-2 transition-all duration-200 font-medium text-sm sm:text-base"
          >
            {{ currentStep === 2 ? 'Sign in' : 'Continue' }}
          </button>

          <!-- Back Button (Show only if not on first step) -->
          <button
            v-if="currentStep > 0"
            type="button"
            @click="handleBack"
            class="w-full px-4 py-2.5 sm:py-3 bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:ring-offset-2 transition-all duration-200 font-medium text-sm sm:text-base"
          >
            Back
          </button>
        </div>

        <!-- Register Link -->
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?
          <a href="#" class="font-medium text-gray-900 dark:text-white hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { AuthSocialProviderEnum, useAuthStore } from '../stores/auth'

const { signin, updateTokens, loginWithSocialProvider } = useAuthStore()
const router = useRouter()
const currentStep = ref(0)
const error = ref('')

const stepTitles = {
  0: 'Welcome back',
  1: 'Enter password',
  2: 'Two-factor authentication',
}

const stepDescriptions = {
  0: 'Please enter your email to continue',
  1: 'Please enter your password',
  2: 'Enter the 6-digit code sent to your device',
}

const form = ref({
  email: '',
  password: '',
  remember: false,
  twoFactorCode: '',
})

const getTabTitle = () => {
  return stepTitles[currentStep.value as keyof typeof stepTitles]
}

const getTabDescription = () => {
  return stepDescriptions[currentStep.value as keyof typeof stepDescriptions]
}

const handleSubmit = async () => {
  error.value = ''
  if (currentStep.value === 0) {
    currentStep.value = 1
  } else if (currentStep.value === 1) {
    try {
      const result = await signin({
        email: form.value.email,
        password: form.value.password,
      })

      if (!result.success && result.errMsg === 'Invalid or Expired Totp code!') {
        currentStep.value = 2
      }

      if (!result.success) {
        error.value = !result.errMsg?.length ? 'Invalid Email or Password' : result.errMsg
      }

      if (result.success) {
        const decoded = jwtDecode(result.data?.accessToken as string)
        if ('ai_role' in decoded && (decoded.ai_role as string).toLowerCase() == 'admin') {
          updateTokens(result.data as any)
          router.push({ name: 'dashboard' })
        } else {
          error.value = 'Invalid Role'
        }
      }
    } catch (err) {
      error.value = 'Invalid Email or Password'
    }
  } else {
    try {
      const result = await signin({
        email: form.value.email,
        password: form.value.password,
        twoFactor: form.value.twoFactorCode,
      })

      if (!result.success) {
        error.value = !result.errMsg?.length ? 'Invalid Email or Password' : result.errMsg
      }

      if (result.success) {
        const decoded = jwtDecode(result.data?.accessToken as string)
        if ('ai_role' in decoded && (decoded.ai_role as string).toLowerCase() == 'admin') {
          updateTokens(result.data as any)
          router.push({ name: 'dashboard' })
        } else {
          error.value = 'Invalid Role'
        }
      }
    } catch (err) {
      error.value = 'Invalid verification code'
    }
  }
}

const handleBack = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleGoogleLogin = async () => {
  try {
    const result = await loginWithSocialProvider(AuthSocialProviderEnum.GOOGLE)
    const decoded = jwtDecode(result?.accessToken as string)
    if ('ai_role' in decoded && (decoded.ai_role as string).toLowerCase() == 'admin') {
      updateTokens(result)
      router.push({ name: 'dashboard' })
    } else {
      error.value = 'Invalid Role'
    }
  } catch (err) {
    console.log(error)
    error.value = 'Invalid Account'
  }
}

const handleMicrosoftLogin = async () => {
  try {
    const result = await loginWithSocialProvider(AuthSocialProviderEnum.MICROSOFT)
    const decoded = jwtDecode(result?.accessToken as string)
    if ('ai_role' in decoded && (decoded.ai_role as string).toLowerCase() == 'admin') {
      updateTokens(result)
      router.push({ name: 'dashboard' })
    } else {
      error.value = 'Invalid Role'
    }
  } catch (err) {
    console.log(error)
    error.value = 'Invalid Account'
  }
}
</script>
