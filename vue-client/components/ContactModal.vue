<template>
  <UModal v-model="isOpen" :title="isEdit ? 'Edit Contact' : 'Add New Contact'">
    <div class="p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 class="text-lg font-bold text-white flex items-center gap-2">
          <UIcon :name="isEdit ? 'i-heroicons-pencil-square' : 'i-heroicons-user-plus'" class="w-5 h-5 text-indigo-400" />
          {{ isEdit ? 'Edit Contact' : 'Add New Contact' }}
        </h3>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark"
          size="xs"
          @click="isOpen = false"
        />
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- First Name & Last Name -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-300 mb-1">First Name *</label>
            <UInput
              v-model="form.firstName"
              placeholder="e.g. Jane"
              required
              color="gray"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-300 mb-1">Last Name *</label>
            <UInput
              v-model="form.lastName"
              placeholder="e.g. Doe"
              required
              color="gray"
            />
          </div>
        </div>

        <!-- Email & Phone -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-300 mb-1">Email</label>
            <UInput
              v-model="form.email"
              type="email"
              placeholder="jane.doe@example.com"
              icon="i-heroicons-envelope"
              color="gray"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-300 mb-1">Phone</label>
            <UInput
              v-model="form.phone"
              placeholder="+1-555-0199"
              icon="i-heroicons-phone"
              color="gray"
            />
          </div>
        </div>

        <!-- Company & Job Title -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-300 mb-1">Company</label>
            <UInput
              v-model="form.company"
              placeholder="Acme Corp"
              icon="i-heroicons-briefcase"
              color="gray"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-300 mb-1">Job Title</label>
            <UInput
              v-model="form.jobTitle"
              placeholder="Software Engineer"
              color="gray"
            />
          </div>
        </div>

        <!-- Category & Avatar URL -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-semibold text-gray-300 mb-1">Category</label>
            <USelect
              v-model="form.category"
              :options="['Personal', 'Work', 'Family', 'Other']"
              color="gray"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-300 mb-1">Avatar Image URL</label>
            <UInput
              v-model="form.avatar"
              placeholder="https://..."
              icon="i-heroicons-photo"
              color="gray"
            />
          </div>
        </div>

        <!-- Address -->
        <div>
          <label class="block text-xs font-semibold text-gray-300 mb-1">Address</label>
          <UInput
            v-model="form.address"
            placeholder="123 Main St, City, Country"
            icon="i-heroicons-map-pin"
            color="gray"
          />
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-xs font-semibold text-gray-300 mb-1">Notes</label>
          <UTextarea
            v-model="form.notes"
            placeholder="Add notes about this contact..."
            rows="2"
            color="gray"
          />
        </div>

        <!-- Favorite Checkbox -->
        <div class="flex items-center gap-2 pt-2">
          <UCheckbox v-model="form.favorite" label="Mark as Favorite" color="amber" />
        </div>

        <!-- Form Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <UButton
            color="gray"
            variant="ghost"
            @click="isOpen = false"
          >
            Cancel
          </UButton>

          <UButton
            type="submit"
            color="indigo"
            :loading="isSubmitting"
          >
            {{ isEdit ? 'Save Changes' : 'Create Contact' }}
          </UButton>
        </div>
      </form>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import type { Contact, ContactInput } from '~/types/contact'

const props = defineProps<{
  modelValue: boolean
  contactToEdit?: Contact | null
}>()

const emit = defineEmits(['update:modelValue', 'saved'])

const { createContact, updateContact } = useContacts()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEdit = computed(() => !!props.contactToEdit)
const isSubmitting = ref(false)

const form = reactive<ContactInput>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  address: '',
  category: 'Personal',
  avatar: '',
  notes: '',
  favorite: false,
})

watch(
  () => props.contactToEdit,
  (contact) => {
    if (contact) {
      form.firstName = contact.firstName || ''
      form.lastName = contact.lastName || ''
      form.email = contact.email || ''
      form.phone = contact.phone || ''
      form.company = contact.company || ''
      form.jobTitle = contact.jobTitle || ''
      form.address = contact.address || ''
      form.category = contact.category || 'Personal'
      form.avatar = contact.avatar || ''
      form.notes = contact.notes || ''
      form.favorite = contact.favorite || false
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

function resetForm() {
  form.firstName = ''
  form.lastName = ''
  form.email = ''
  form.phone = ''
  form.company = ''
  form.jobTitle = ''
  form.address = ''
  form.category = 'Personal'
  form.avatar = ''
  form.notes = ''
  form.favorite = false
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    if (isEdit.value && props.contactToEdit) {
      await updateContact(props.contactToEdit.contactId, form)
    } else {
      await createContact(form)
    }
    isOpen.value = false
    resetForm()
    emit('saved')
  } catch {
    // Error state handled in composables
  } finally {
    isSubmitting.value = false
  }
}
</script>
