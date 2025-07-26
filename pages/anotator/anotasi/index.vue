<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white font-inter px-4 py-8"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Statistic Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="stat-card">
          <UIcon name="i-lucide-file-text" class="stat-icon text-blue-400" />
          <span class="stat-value">{{ stats.annotated }}</span>
          <span class="stat-label">Dokumen Dianotasi</span>
        </div>
        <div class="stat-card">
          <UIcon
            name="i-lucide-check-circle"
            class="stat-icon text-green-400"
          />
          <span class="stat-value">{{ stats.reviewed }}</span>
          <span class="stat-label">Dokumen Ditinjau</span>
        </div>
        <div class="stat-card">
          <UIcon
            name="i-lucide-bar-chart-2"
            class="stat-icon text-purple-400"
          />
          <span class="stat-value">{{ stats.total }}</span>
          <span class="stat-label">Total Dokumen</span>
        </div>
      </div>

      <!-- Simple Bar Chart (dummy) -->
      <div class="glassmorphism-custom p-6 mb-10">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <UIcon name="i-lucide-bar-chart" class="w-6 h-6 text-blue-400" />
          Statistik Anotasi Mingguan
        </h3>
        <div class="flex items-end gap-3 h-32">
          <div
            v-for="(val, i) in weeklyStats"
            :key="i"
            class="flex flex-col items-center w-8"
          >
            <div
              class="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t shadow"
              :style="{ height: `${val.count * 2 + 8}px` }"
              style="min-height: 8px"
            ></div>
            <span class="text-xs text-gray-400 mt-1">{{ val.label }}</span>
          </div>
        </div>
      </div>

      <!-- Document List -->
      <div class="glassmorphism-custom p-6">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <h2 class="text-xl font-bold flex items-center gap-2">
            <UIcon
              name="i-heroicons-document-text"
              class="w-6 h-6 text-blue-400"
            />
            Daftar Dokumen
          </h2>
          <div class="flex flex-wrap gap-2 items-center filter-bar">
            <UInput
              v-model="search"
              placeholder="Cari judul dokumen..."
              :ui="{ base: 'w-48 md:w-64' }"
              size="md"
              icon="i-heroicons-magnifying-glass"
            />
            <UInput
              v-model="filter.tanggal"
              type="date"
              placeholder="Tanggal"
              :ui="{ base: 'w-32' }"
              size="md"
              icon="i-heroicons-calendar"
            />
            <UButton
              icon="i-heroicons-arrow-path"
              color="neutral"
              variant="ghost"
              size="sm"
              :ui="{ base: 'rounded-full px-3 py-2' }"
              @click="resetFilters"
              title="Reset Filter"
            />
          </div>
        </div>
        <div v-if="isLoading" class="text-center py-8">
          <span class="text-gray-400">Memuat dokumen...</span>
        </div>
        <div v-else class="overflow-x-auto rounded-lg">
          <table class="min-w-full text-sm table-auto">
            <thead>
              <tr class="bg-gray-800/60 text-gray-300 sticky top-0 z-10">
                <th class="px-4 py-2 text-left">Judul</th>
                <th class="px-4 py-2 text-left">ID</th>
                <th class="px-4 py-2 text-left">Tanggal</th>
                <th class="px-4 py-2 text-left">Sentences</th>
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="doc in filteredDocs"
                :key="doc.id"
                class="border-b border-white/10 hover:bg-blue-900/20 transition"
              >
                <td class="px-4 py-2 font-semibold">{{ doc.title }}</td>
                <td class="px-4 py-2">{{ doc.id }}</td>
                <td class="px-4 py-2">{{ formatDate(doc.created_at) }}</td>
                <td class="px-4 py-2">{{ doc.sentences?.length || 0 }}</td>
                <td class="px-4 py-2">
                  <UButton
                    label="Anotasi"
                    color="primary"
                    size="md"
                    icon="i-heroicons-pencil-square"
                    @click="goToDetail(doc.id)"
                    :ui="{
                      base: 'rounded-full px-5 py-2 font-semibold shadow hover:scale-105 transition',
                    }"
                  />
                </td>
              </tr>
              <tr v-if="filteredDocs.length === 0">
                <td colspan="5" class="text-center text-gray-400 py-8">
                  Tidak ada dokumen ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { navigateTo } from "#app";
import { useDocumentsApi } from "~/data/documents";
import { useAnnotationsApi } from "~/data/annotations";
import type { DocumentResponse, AnnotationResponse } from "~/types/api";

const { getDocuments } = useDocumentsApi();
const { getAnnotations } = useAnnotationsApi();

// State
const docs = ref<DocumentResponse[]>([]);
const annotations = ref<AnnotationResponse[]>([]);
const isLoading = ref(false);

// Statistics computed from real data
const stats = computed(() => ({
  annotated: annotations.value.length,
  reviewed: 0, // TODO: Get from reviews API
  total: docs.value.length,
}));

// Weekly stats (dummy for now)
const weeklyStats = ref([
  { label: "Sen", count: 3 },
  { label: "Sel", count: 5 },
  { label: "Rab", count: 2 },
  { label: "Kam", count: 4 },
  { label: "Jum", count: 6 },
  { label: "Sab", count: 2 },
  { label: "Min", count: 2 },
]);

// Filter/search state
const search = ref("");
const filter = ref({
  tanggal: "",
});

// Filtering logic
const filteredDocs = computed(() => {
  return docs.value.filter((doc) => {
    const matchSearch =
      !search.value ||
      doc.title.toLowerCase().includes(search.value.toLowerCase());
    const matchTanggal =
      !filter.value.tanggal ||
      doc.created_at.startsWith(filter.value.tanggal);
    return matchSearch && matchTanggal;
  });
});

// Methods
function resetFilters() {
  search.value = "";
  filter.value = {
    tanggal: "",
  };
}

function goToDetail(id: number) {
  navigateTo(`/anotator/anotasi/${id}`);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID");
}

// Fetch data on mount
async function fetchData() {
  isLoading.value = true;
  try {
    const [documentsData, annotationsData] = await Promise.all([
      getDocuments(),
      getAnnotations().catch(() => []), // Handle case where user has no annotations yet
    ]);

    docs.value = documentsData || [];
    annotations.value = annotationsData || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    docs.value = [];
    annotations.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchData);
</script>

<style scoped>
.glassmorphism-custom {
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1.25rem;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15), 0 12px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.glassmorphism-custom:hover {
  background-color: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2), 0 15px 25px rgba(0, 0, 0, 0.15);
}
.stat-card {
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1.25rem;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15), 0 12px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.stat-icon {
  width: 2.5rem;
  height: 2.5rem;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.18));
}
.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: white;
}
.stat-label {
  color: #cbd5e1;
  margin-top: 0.25rem;
  font-size: 0.95rem;
}
.filter-bar > * {
  margin-right: 0.25rem;
}
.filter-bar > *:last-child {
  margin-right: 0;
}
</style>