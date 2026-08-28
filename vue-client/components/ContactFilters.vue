<template>
  <div class="glass-panel p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
    <!-- Search Input -->
    <div class="relative w-full md:w-80">
      <UInput
        v-model="searchInput"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search contacts by name, email, phone..."
        size="md"
        color="gray"
        variant="outline"
        class="w-full"
        @input="onSearchInput"
      />
    </div>

    <!-- Category Filter Pills -->
    <div class="flex flex-wrap items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
      <UButton
        v-for="cat in categories"
        :key="cat.name"
        :color="selectedCategory === cat.name ? 'indigo' : 'gray'"
        :variant="selectedCategory === cat.name ? 'solid' : 'ghost'"
        size="xs"
        class="rounded-lg transition-all"
        @click="selectCat(cat.name)"
      >
        <UIcon :name="cat.icon" class="w-3.5 h-3.5 mr-1" />
        {{ cat.name }}
      </UButton>

      <UButton
        :color="filterFavorite ? 'amber' : 'gray'"
        :variant="filterFavorite ? 'solid' : 'ghost'"
        size="xs"
        class="rounded-lg transition-all"
        @click="toggleFavFilter"
      >
        <UIcon name="i-heroicons-star" class="w-3.5 h-3.5 mr-1" />
        Favorites Only
      </UButton>
    </div>

    <!-- View Mode Toggle -->
    <div class="flex items-center gap-1 bg-gray-900/60 p-1 rounded-xl border border-white/10 self-end md:self-auto">
      <UButton
        :color="viewMode === 'grid' ? 'indigo' : 'gray'"
        :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
        icon="i-heroicons-squares-2x2"
        size="xs"
        @click="$emit('update:viewMode', 'grid')"
      />
      <UButton
        :color="viewMode === 'table' ? 'indigo' : 'gray'"
        :variant="viewMode === 'table' ? 'solid' : 'ghost'"
        icon="i-heroicons-list-bullet"
        size="xs"
        @click="$emit('update:viewMode', 'table')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  viewMode: 'grid' | 'table'
}>()

defineEmits(['update:viewMode'])

const { searchQuery, selectedCategory, filterFavorite, fetchContacts } = useContacts()

const searchInput = ref(searchQuery.value)
let searchTimeout: any = null

const categories = [
  { name: 'All', icon: 'i-heroicons-squares-2x2' },
  { name: 'Work', icon: 'i-heroicons-briefcase' },
  { name: 'Personal', icon: 'i-heroicons-home' },
  { name: 'Family', icon: 'i-heroicons-heart' },
]

const onSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    searchQuery.value = searchInput.value
    fetchContacts(1)
  }, 350)
}

const selectCat = (catName: string) => {
  selectedCategory.value = catName
  fetchContacts(1)
}

const toggleFavFilter = () => {
  filterFavorite.value = filterFavorite.value === true ? null : true
  fetchContacts(1)
}
</script>
