<template>
  <div class="beranda-container">
    <h1 class="beranda-title">Kelola Dokumen</h1>
    <div v-if="isLoading" class="text-gray-300 mb-4">
      Memuat data dokumen...
    </div>
    <table v-if="documents.length" class="min-w-full text-sm table-auto mb-6">
      <thead>
        <tr class="bg-gray-800/60 text-gray-300">
          <th class="px-4 py-2 text-left">Judul</th>
          <th class="px-4 py-2 text-left">ID</th>
          <th class="px-4 py-2 text-left">Tanggal</th>
          <th class="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="doc in documents"
          :key="doc.id"
          class="border-b border-white/10"
        >
          <td class="px-4 py-2 font-semibold">{{ doc.title }}</td>
          <td class="px-4 py-2">{{ doc.id }}</td>
          <td class="px-4 py-2">{{ doc.created_at }}</td>
          <td class="px-4 py-2">
            <UButton
              label="Hapus"
              color="red"
              size="sm"
              icon="i-heroicons-trash"
              @click="deleteDocument(doc.id)"
              :ui="{ base: 'rounded-full px-4 py-1 font-semibold' }"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!documents.length && !isLoading" class="text-gray-400 py-8">
      Tidak ada dokumen ditemukan.
    </div>
    <UButton
      label="Kembali ke Halaman Utama"
      icon="i-heroicons-home"
      variant="outline"
      color="neutral"
      class="back-button"
      @click="navigateTo('/')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDocumentsApi } from "~/data/documents";
import { navigateTo } from "#app";

const { getDocuments } = useDocumentsApi();
const documents = ref([]);
const isLoading = ref(false);

async function fetchDocuments() {
  isLoading.value = true;
  try {
    documents.value = await getDocuments();
  } finally {
    isLoading.value = false;
  }
}
// Dummy delete (API not in docs, so just remove from list for now)
function deleteDocument(id: string) {
  documents.value = documents.value.filter((d) => d.id !== id);
}

onMounted(fetchDocuments);

useHead({
  title: "Kelola Dokumen - ANOTA",
  meta: [
    { name: "description", content: "Halaman kelola dokumen aplikasi ANOTA." },
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
