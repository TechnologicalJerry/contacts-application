<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <AppNavbar @open-create="openCreateModal" />

    <!-- Main Dashboard Container -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards Overview -->
      <StatsOverview />

      <!-- Search & Filters Toolbar -->
      <ContactFilters v-model:viewMode="viewMode" />

      <!-- Error Alert -->
      <UAlert
        v-if="contactError"
        color="red"
        variant="subtle"
        title="Error"
        :description="contactError"
        icon="i-heroicons-exclamation-triangle"
        class="mb-6"
      />

      <!-- Loading Skeleton Grid -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="n in 6" :key="n" class="glass-card rounded-2xl p-5 h-44 animate-pulse flex flex-col justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-white/10"></div>
            <div class="space-y-2 flex-1">
              <div class="h-4 bg-white/10 rounded w-1/2"></div>
              <div class="h-3 bg-white/5 rounded w-1/3"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="h-3 bg-white/5 rounded w-3/4"></div>
            <div class="h-3 bg-white/5 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!contacts || contacts.length === 0"
        class="glass-panel p-12 text-center my-8 max-w-lg mx-auto flex flex-col items-center justify-center animate-fade-in"
      >
        <div class="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
          <UIcon name="i-heroicons-user-plus" class="w-8 h-8" />
        </div>
        <h3 class="text-lg font-bold text-white mb-1">No contacts found</h3>
        <p class="text-xs text-gray-400 mb-6">
          {{ searchQuery ? 'No contacts matched your search query.' : 'Get started by creating your first contact.' }}
        </p>
        <UButton
          color="indigo"
          icon="i-heroicons-plus"
          @click="openCreateModal"
        >
          Add Contact
        </UButton>
      </div>

      <!-- Contacts GRID View -->
      <div
        v-else-if="viewMode === 'grid'"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
      >
        <ContactCard
          v-for="contact in contacts"
          :key="contact._id || contact.contactId"
          :contact="contact"
          @view="onViewContact"
          @edit="onEditContact"
          @delete="confirmDelete"
          @toggle-favorite="toggleFavorite"
        />
      </div>

      <!-- Contacts TABLE View -->
      <div v-else class="glass-panel overflow-hidden mb-8">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-white/5 text-gray-400 uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th class="py-3.5 px-4">Contact</th>
                <th class="py-3.5 px-4">Email</th>
                <th class="py-3.5 px-4">Phone</th>
                <th class="py-3.5 px-4">Category</th>
                <th class="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr
                v-for="contact in contacts"
                :key="contact.contactId"
                class="hover:bg-white/5 transition-colors group"
              >
                <td class="py-3 px-4 flex items-center gap-3">
                  <UAvatar
                    :src="contact.avatar || undefined"
                    :alt="`${contact.firstName} ${contact.lastName}`"
                    size="sm"
                    class="bg-indigo-950 text-indigo-200"
                  />
                  <div>
                    <span class="font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {{ contact.firstName }} {{ contact.lastName }}
                    </span>
                    <span v-if="contact.jobTitle" class="block text-[11px] text-gray-400">{{ contact.jobTitle }}</span>
                  </div>
                </td>
                <td class="py-3 px-4 text-gray-300">{{ contact.email || '-' }}</td>
                <td class="py-3 px-4 text-gray-300">{{ contact.phone || '-' }}</td>
                <td class="py-3 px-4">
                  <UBadge size="xs" color="gray" variant="subtle">{{ contact.category || 'Personal' }}</UBadge>
                </td>
                <td class="py-3 px-4 text-right space-x-1">
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-eye"
                    size="xs"
                    @click="onViewContact(contact)"
                  />
                  <UButton
                    color="indigo"
                    variant="ghost"
                    icon="i-heroicons-pencil-square"
                    size="xs"
                    @click="onEditContact(contact)"
                  />
                  <UButton
                    color="red"
                    variant="ghost"
                    icon="i-heroicons-trash"
                    size="xs"
                    @click="confirmDelete(contact)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="flex items-center justify-between glass-panel p-4">
        <p class="text-xs text-gray-400">
          Showing Page <span class="font-semibold text-white">{{ currentPage }}</span> of <span class="font-semibold text-white">{{ totalPages }}</span>
        </p>

        <div class="flex items-center gap-2">
          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-chevron-left"
            size="xs"
            :disabled="currentPage <= 1"
            @click="changePage(currentPage - 1)"
          >
            Previous
          </UButton>

          <UButton
            color="gray"
            variant="soft"
            icon="i-heroicons-chevron-right"
            size="xs"
            :disabled="currentPage >= totalPages"
            @click="changePage(currentPage + 1)"
          >
            Next
          </UButton>
        </div>
      </div>
    </main>

    <!-- Create/Edit Contact Modal -->
    <ContactModal
      v-model="isModalOpen"
      :contactToEdit="selectedContact"
      @saved="fetchContacts"
    />

    <!-- Delete Confirmation Modal -->
    <UModal v-model="isDeleteModalOpen" title="Confirm Delete">
      <div class="p-6 space-y-4">
        <h3 class="text-lg font-bold text-white flex items-center gap-2">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-400" />
          Delete Contact
        </h3>
        <p class="text-xs text-gray-300">
          Are you sure you want to delete <span class="font-bold text-white">{{ contactToDelete?.firstName }} {{ contactToDelete?.lastName }}</span>? This action cannot be undone.
        </p>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <UButton color="gray" variant="ghost" @click="isDeleteModalOpen = false">Cancel</UButton>
          <UButton color="red" :loading="isDeleting" @click="executeDelete">Delete</UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Contact } from '~/types/contact'

definePageMeta({
  middleware: 'auth'
})

const {
  contacts,
  currentPage,
  totalPages,
  isLoading,
  contactError,
  fetchContacts,
  toggleFavorite,
  deleteContact,
} = useContacts()

const viewMode = ref<'grid' | 'table'>('grid')
const isModalOpen = ref(false)
const selectedContact = ref<Contact | null>(null)

const isDeleteModalOpen = ref(false)
const contactToDelete = ref<Contact | null>(null)
const isDeleting = ref(false)

onMounted(() => {
  fetchContacts(1)
})

const openCreateModal = () => {
  selectedContact.value = null
  isModalOpen.value = true
}

const onViewContact = (contact: Contact) => {
  navigateTo(`/contacts/${contact.contactId}`)
}

const onEditContact = (contact: Contact) => {
  selectedContact.value = contact
  isModalOpen.value = true
}

const confirmDelete = (contact: Contact) => {
  contactToDelete.value = contact
  isDeleteModalOpen.value = true
}

const executeDelete = async () => {
  if (!contactToDelete.value) return
  isDeleting.value = true
  try {
    await deleteContact(contactToDelete.value.contactId)
    isDeleteModalOpen.value = false
    contactToDelete.value = null
  } finally {
    isDeleting.value = false
  }
}

const changePage = (page: number) => {
  fetchContacts(page)
}
</script>
