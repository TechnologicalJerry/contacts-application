<template>
  <header class="sticky top-0 z-40 glass-panel !rounded-none border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center justify-between">
    <!-- Brand Logo -->
    <NuxtLink to="/" class="flex items-center gap-3 group">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
        <UIcon name="i-heroicons-user-group" class="w-6 h-6 text-white" />
      </div>
      <div>
        <span class="text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-indigo-300 bg-clip-text text-transparent">
          ContactHub
        </span>
        <span class="block text-[10px] uppercase tracking-wider text-indigo-400 font-semibold">Vue 3 + Nuxt 3</span>
      </div>
    </NuxtLink>

    <!-- User Profile & Actions -->
    <div v-if="user" class="flex items-center gap-3">
      <!-- Add Contact Button -->
      <UButton
        color="indigo"
        variant="solid"
        icon="i-heroicons-plus-circle"
        class="font-medium shadow-md shadow-indigo-500/20 hover:scale-105 transition-transform"
        @click="$emit('open-create')"
      >
        <span class="hidden sm:inline">Add Contact</span>
      </UButton>

      <!-- User Avatar / Info -->
      <div class="flex items-center gap-2 pl-2 border-l border-white/10">
        <UAvatar
          :alt="user.name || user.email"
          size="sm"
          class="ring-2 ring-indigo-500/50 bg-indigo-950 text-indigo-200"
        />
        <div class="hidden md:block text-left">
          <p class="text-sm font-semibold text-gray-200 leading-none">{{ user.name }}</p>
          <p class="text-xs text-gray-400 leading-tight">{{ user.email }}</p>
        </div>
      </div>

      <!-- Logout Button -->
      <UButton
        color="gray"
        variant="ghost"
        icon="i-heroicons-arrow-right-on-rectangle"
        title="Logout"
        class="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
        @click="logout"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits(['open-create'])

const { user, logout } = useAuth()
</script>
