<template>
  <div class="glass-card rounded-2xl p-5 flex flex-col justify-between relative group animate-fade-in">
    <!-- Card Top Header -->
    <div class="flex items-start justify-between gap-3 mb-4">
      <div class="flex items-center gap-3.5">
        <!-- Avatar -->
        <div class="relative">
          <UAvatar
            :src="contact.avatar || undefined"
            :alt="`${contact.firstName} ${contact.lastName}`"
            size="lg"
            class="ring-2 ring-indigo-500/30 bg-gradient-to-br from-indigo-900 to-violet-950 text-indigo-200 font-bold"
          />
          <span
            v-if="contact.favorite"
            class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-gray-950 flex items-center justify-center shadow"
          >
            <UIcon name="i-heroicons-star-20-solid" class="w-3.5 h-3.5" />
          </span>
        </div>

        <div>
          <h3 class="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
            {{ contact.firstName }} {{ contact.lastName }}
          </h3>
          <p v-if="contact.jobTitle || contact.company" class="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <span>{{ contact.jobTitle }}</span>
            <span v-if="contact.jobTitle && contact.company">•</span>
            <span class="text-indigo-400 font-medium">{{ contact.company }}</span>
          </p>
        </div>
      </div>

      <!-- Favorite Toggle -->
      <UButton
        color="gray"
        variant="ghost"
        :icon="contact.favorite ? 'i-heroicons-star-20-solid' : 'i-heroicons-star'"
        :class="contact.favorite ? 'text-amber-400' : 'text-gray-500 hover:text-amber-400'"
        size="xs"
        @click.stop="$emit('toggle-favorite', contact)"
      />
    </div>

    <!-- Contact Info details -->
    <div class="space-y-2 text-xs mb-4 text-gray-300">
      <div v-if="contact.email" class="flex items-center gap-2">
        <UIcon name="i-heroicons-envelope" class="w-4 h-4 text-indigo-400 shrink-0" />
        <a :href="`mailto:${contact.email}`" class="hover:underline truncate">{{ contact.email }}</a>
      </div>
      <div v-if="contact.phone" class="flex items-center gap-2">
        <UIcon name="i-heroicons-phone" class="w-4 h-4 text-cyan-400 shrink-0" />
        <a :href="`tel:${contact.phone}`" class="hover:underline">{{ contact.phone }}</a>
      </div>
      <div v-if="contact.address" class="flex items-center gap-2 text-gray-400">
        <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-rose-400 shrink-0" />
        <span class="truncate">{{ contact.address }}</span>
      </div>
    </div>

    <!-- Tags & Category -->
    <div class="flex items-center justify-between pt-3 border-t border-white/5">
      <UBadge
        :color="categoryColor(contact.category)"
        variant="subtle"
        size="xs"
        class="font-medium"
      >
        {{ contact.category || 'Personal' }}
      </UBadge>

      <!-- Action Buttons -->
      <div class="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-eye"
          size="xs"
          title="View Details"
          @click="$emit('view', contact)"
        />
        <UButton
          color="indigo"
          variant="ghost"
          icon="i-heroicons-pencil-square"
          size="xs"
          title="Edit"
          @click="$emit('edit', contact)"
        />
        <UButton
          color="red"
          variant="ghost"
          icon="i-heroicons-trash"
          size="xs"
          title="Delete"
          @click="$emit('delete', contact)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Contact } from '~/types/contact'

defineProps<{
  contact: Contact
}>()

defineEmits(['view', 'edit', 'delete', 'toggle-favorite'])

const categoryColor = (cat?: string) => {
  switch (cat) {
    case 'Work': return 'indigo'
    case 'Family': return 'rose'
    case 'Personal': return 'emerald'
    default: return 'gray'
  }
}
</script>
