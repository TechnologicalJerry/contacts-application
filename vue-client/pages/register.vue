<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cyan-600/20 blur-3xl"></div>

    <div class="glass-panel w-full max-w-md p-8 relative z-10 animate-fade-in">
      <!-- Logo Header -->
      <div class="text-center mb-8">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 mx-auto flex items-center justify-center shadow-xl shadow-violet-500/30 mb-4">
          <UIcon name="i-heroicons-user-plus" class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Create Account</h1>
        <p class="text-xs text-gray-400 mt-1">Get started with your Contacts Management Dashboard</p>
      </div>

      <!-- Auth Error Alert -->
      <UAlert
        v-if="authError || localError"
        color="red"
        variant="subtle"
        title="Registration Failed"
        :description="localError || authError || 'Failed to create account'"
        icon="i-heroicons-exclamation-triangle"
        class="mb-6"
      />

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-300 mb-1.5">Full Name</label>
          <UInput
            v-model="name"
            type="text"
            placeholder="Jane Doe"
            icon="i-heroicons-user"
            size="md"
            required
            color="gray"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
          <UInput
            v-model="email"
            type="email"
            placeholder="jane.doe@example.com"
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
            placeholder="Minimum 6 characters"
            icon="i-heroicons-lock-closed"
            size="md"
            required
            color="gray"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-300 mb-1.5">Confirm Password</label>
          <UInput
            v-model="passwordConfirmation"
            type="password"
            placeholder="Repeat password"
            icon="i-heroicons-shield-check"
            size="md"
            required
            color="gray"
          />
        </div>

        <UButton
          type="submit"
          color="violet"
          size="lg"
          block
          class="font-semibold shadow-lg shadow-violet-500/25 mt-6"
          :loading="isLoading"
        >
          Register & Continue
        </UButton>
      </form>

      <!-- Login Footer Link -->
      <div class="text-center mt-6 pt-6 border-t border-white/10 text-xs text-gray-400">
        Already have an account?
        <NuxtLink to="/login" class="text-violet-400 font-semibold hover:underline ml-1">
          Sign In
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { register, authError } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const localError = ref<string | null>(null)
const isLoading = ref(false)

const handleRegister = async () => {
  localError.value = null
  if (password.value !== passwordConfirmation.value) {
    localError.value = 'Passwords do not match'
    return
  }
  if (password.value.length < 6) {
    localError.value = 'Password must be at least 6 characters'
    return
  }

  isLoading.value = true
  try {
    await register({
      name: name.value,
      email: email.value,
      password: password.value,
      passwordConfirmation: passwordConfirmation.value,
    })
    navigateTo('/')
  } catch {
    // Handled in composables
  } finally {
    isLoading.value = false
  }
}
</script>
