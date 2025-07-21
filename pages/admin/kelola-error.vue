<template>
  <div class="beranda-container">
    <h1 class="beranda-title">Kelola Error</h1>
    <div class="text-gray-400 py-8">
      Fitur kelola error akan menggunakan API assignments/documents.
    </div>
    <UButton
      label="Kembali ke Halaman Utama"
      icon="i-heroicons-home"
      variant="outline"
      color="white"
      class="back-button"
      @click="navigateTo('/')"
    />
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
useHead({
  title: "Kelola Error - ANOTA",
  meta: [
    { name: "description", content: "Halaman kelola error aplikasi ANOTA." },
  ],
});
</script>

<style scoped>
.beranda-container {
  min-height: calc(100vh - 16rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  background-color: #0f172a;
  color: white;
  padding: 2rem;
}

.beranda-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #60a5fa;
}

.back-button {
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
  margin-top: 2rem;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}
</style>
