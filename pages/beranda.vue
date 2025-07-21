<template>
  <div class="beranda-container">
    <h1 class="beranda-title">Selamat Datang di Beranda!</h1>
    <p class="beranda-description">
      Anda telah berhasil masuk sebagai {{ userRole }}.
    </p>
    <UButton
      label="Kembali ke Halaman Utama"
      icon="i-heroicons-home"
      variant="outline"
      class="back-button"
      @click="navigateTo('/')"
    />
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
const userRole = useState<string>("userRole");

useHead({
  title: "Beranda - ANOTA",
  meta: [{ name: "description", content: "Halaman beranda aplikasi ANOTA." }],
});
</script>

<style scoped>
.beranda-container {
  min-height: calc(100vh - 16rem); /* Adjust based on header/footer height */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: #0f172a; /* A dark background */
  color: white;
  padding: 2rem;
}

.beranda-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #60a5fa; /* blue-400 */
}

.beranda-description {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #cbd5e1; /* text-gray-300 */
}

.back-button {
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}
</style>
