<template>
  <div class="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 font-sans">
    <NuxtLoadingIndicator color="#6366f1" :height="3" />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { initUserFromToken } = useAuth()

onMounted(() => {
  initUserFromToken()
})
</script>
