<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <AppNavbar @open-create="openCreateModal" />

    <main class="flex-1 max-w-4xl w-full mx-auto px-4 py-8 animate-fade-in">
      <!-- Back Link -->
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 mb-6 transition-colors font-medium"
      >
        <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
        Back to All Contacts
      </NuxtLink>

      <!-- Loading State -->
      <div v-if="isLoading" class="glass-panel p-8 text-center animate-pulse space-y-4">
        <div class="w-20 h-20 rounded-full bg-white/10 mx-auto"></div>
        <div class="h-6 bg-white/10 rounded w-1/3 mx-auto"></div>
        <div class="h-4 bg-white/5 rounded w-1/4 mx-auto"></div>
      </div>

      <!-- Contact Detail Profile View -->
      <div v-else-if="contact" class="glass-panel p-6 sm:p-8 space-y-8">
        <!-- Profile Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div class="flex items-center gap-4">
            <div class="relative">
              <UAvatar
                :src="contact.avatar || undefined"
                :alt="`${contact.firstName} ${contact.lastName}`"
                size="3xl"
                class="ring-4 ring-indigo-500/40 bg-gradient-to-br from-indigo-900 to-violet-950 text-indigo-100 font-bold"
              />
              <span
                v-if="contact.favorite"
                class="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-gray-950 flex items-center justify-center shadow"
              >
                <UIcon name="i-heroicons-star-20-solid" class="w-4 h-4" />
              </span>
            </div>

            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-bold text-white">{{ contact.firstName }} {{ contact.lastName }}</h1>
                <UBadge color="indigo" variant="subtle">{{ contact.category || 'Personal' }}</UBadge>
              </div>
              <p v-if="contact.jobTitle || contact.company" class="text-sm text-gray-300 mt-1">
                {{ contact.jobTitle }} <span v-if="contact.jobTitle && contact.company">at</span>
                <span class="text-indigo-400 font-semibold">{{ contact.company }}</span>
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 self-end sm:self-auto">
            <UButton
              color="amber"
              variant="soft"
              :icon="contact.favorite ? 'i-heroicons-star-20-solid' : 'i-heroicons-star'"
              @click="onToggleFavorite"
            >
              {{ contact.favorite ? 'Favorited' : 'Favorite' }}
            </UButton>
            <UButton
              color="indigo"
              icon="i-heroicons-pencil-square"
              @click="isModalOpen = true"
            >
              Edit
            </UButton>
          </div>
        </div>

        <!-- Contact Information Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Email Card -->
          <div class="glass-card rounded-xl p-4 space-y-1">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</p>
            <div class="flex items-center gap-2 text-sm text-white">
              <UIcon name="i-heroicons-envelope" class="w-4 h-4 text-indigo-400" />
              <a v-if="contact.email" :href="`mailto:${contact.email}`" class="hover:underline">{{ contact.email }}</a>
              <span v-else class="text-gray-500">Not provided</span>
            </div>
          </div>

          <!-- Phone Card -->
          <div class="glass-card rounded-xl p-4 space-y-1">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</p>
            <div class="flex items-center gap-2 text-sm text-white">
              <UIcon name="i-heroicons-phone" class="w-4 h-4 text-cyan-400" />
              <a v-if="contact.phone" :href="`tel:${contact.phone}`" class="hover:underline">{{ contact.phone }}</a>
              <span v-else class="text-gray-500">Not provided</span>
            </div>
          </div>

          <!-- Address Card -->
          <div class="glass-card rounded-xl p-4 space-y-1">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Address</p>
            <div class="flex items-center gap-2 text-sm text-white">
              <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-rose-400" />
              <span>{{ contact.address || 'Not provided' }}</span>
            </div>
          </div>

          <!-- Created Date Card -->
          <div class="glass-card rounded-xl p-4 space-y-1">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Added On</p>
            <div class="flex items-center gap-2 text-sm text-white">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-emerald-400" />
              <span>{{ new Date(contact.createdAt).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>

        <!-- Notes Section -->
        <div v-if="contact.notes" class="glass-card rounded-xl p-5 space-y-2">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-indigo-400" />
            Notes & Comments
          </h3>
          <p class="text-sm text-gray-200 whitespace-pre-line leading-relaxed">{{ contact.notes }}</p>
        </div>
      </div>

      <!-- Edit Modal -->
      <ContactModal
        v-if="contact"
        v-model="isModalOpen"
        :contactToEdit="contact"
        @saved="loadContact"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import type { Contact } from '~/types/contact'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const { getContactById, toggleFavorite } = useContacts()

const contact = ref<Contact | null>(null)
const isLoading = ref(true)
const isModalOpen = ref(false)

const loadContact = async () => {
  isLoading.value = true
  try {
    const id = route.params.id as string
    contact.value = await getContactById(id)
  } finally {
    isLoading.value = false
  }
}

const onToggleFavorite = async () => {
  if (contact.value) {
    const updated = await toggleFavorite(contact.value)
    contact.value = updated
  }
}

const openCreateModal = () => {
  navigateTo('/')
}

onMounted(() => {
  loadContact()
})
</script>
