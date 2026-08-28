<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fade-in">
    <!-- Total Contacts Card -->
    <div class="glass-card rounded-2xl p-4 flex items-center justify-between">
      <div>
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400">Total Contacts</p>

        <h3 class="text-2xl font-bold text-white mt-1">{{ totalContacts }}</h3>
      </div>
      <div class="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
        <UIcon name="i-heroicons-users" class="w-6 h-6" />
      </div>
    </div>

    <!-- Favorite Contacts Card -->
    <div class="glass-card rounded-2xl p-4 flex items-center justify-between">
      <div>
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400">Favorites</p>
        <h3 class="text-2xl font-bold text-amber-400 mt-1">{{ favoriteCount }}</h3>
      </div>
      <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
        <UIcon name="i-heroicons-star" class="w-6 h-6" />
      </div>
    </div>

    <!-- Work Contacts Card -->
    <div class="glass-card rounded-2xl p-4 flex items-center justify-between">
      <div>
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400">Work Contacts</p>
        <h3 class="text-2xl font-bold text-cyan-400 mt-1">{{ workCount }}</h3>
      </div>
      <div class="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
        <UIcon name="i-heroicons-briefcase" class="w-6 h-6" />
      </div>
    </div>

    <!-- Personal Contacts Card -->
    <div class="glass-card rounded-2xl p-4 flex items-center justify-between">
      <div>
        <p class="text-xs font-medium uppercase tracking-wider text-gray-400">Personal</p>
        <h3 class="text-2xl font-bold text-emerald-400 mt-1">{{ personalCount }}</h3>
      </div>
      <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
        <UIcon name="i-heroicons-home-modem" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { contacts, totalContacts } = useContacts()

const favoriteCount = computed(() => contacts.value.filter(c => c.favorite).length)
const workCount = computed(() => contacts.value.filter(c => c.category === 'Work').length)
const personalCount = computed(() => contacts.value.filter(c => c.category === 'Personal').length)
</script>
