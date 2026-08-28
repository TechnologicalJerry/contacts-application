<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan-600/20 blur-3xl"></div>

    <div class="glass-panel w-full max-w-md p-8 relative z-10 animate-fade-in">
      <!-- Logo Header -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 mx-auto flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-4">
          <UIcon name="i-heroicons-user-group" class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
        <p class="text-xs text-gray-400 mt-1">Sign in to access your Contacts Management Application</p>
      </div>

      <!-- Auth Error Alert -->
      <UAlert
        v-if="authError"
        color="red"
        variant="subtle"
        title="Authentication Failed"
        :description="authError"
        icon="i-heroicons-exclamation-triangle"
        class="mb-6"
      />

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
          <UInput
            v-model="email"
            type="email"
            placeholder="test@example.com"
            icon="i-heroicons-envelope"
            size="md"
            required
            color="gray"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
          <UInput
            v-model="password"
            type="password"
            placeholder="••••••••"
            icon="i-heroicons-lock-closed"
            size="md"
            required
            color="gray"
          />
        </div>

        <!-- Demo Autofill Button -->
        <div class="flex items-center justify-between text-xs pt-1">
          <button
            type="button"
            class="text-indigo-400 hover:text-indigo-300 underline font-medium"
            @click="fillDemo"
          >
            Auto-fill Test Credentials
          </button>
        </div>

        <UButton
          type="submit"
          color="indigo"
          size="lg"
          block
          class="font-semibold shadow-lg shadow-indigo-500/25 mt-6"
          :loading="isLoading"
        >
          Sign In
        </UButton>
      </form>

      <!-- Register Footer Link -->
      <div class="text-center mt-6 pt-6 border-t border-white/10 text-xs text-gray-400">
        Don't have an account?
        <NuxtLink to="/register" class="text-indigo-400 font-semibold hover:underline ml-1">
          Create Account
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { login, authError } = useAuth()

const email = ref('')
const password = ref('')
const isLoading = ref(false)

const fillDemo = () => {
  email.value = 'test@example.com'
  password.value = 'Password456!'
}

const handleLogin = async () => {
  isLoading.value = true
  try {
    await login({ email: email.value, password: password.value })
    navigateTo('/')
  } catch {
    // Handled in composables
  } finally {
    isLoading.value = false
  }
}
</script>
