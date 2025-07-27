<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white font-inter px-4 py-8"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Statistic Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card variant="glassmorphism" class="p-6 text-center">
          <UIcon
            name="i-lucide-file-text"
            class="w-10 h-10 text-blue-400 mx-auto mb-4"
          />
          <span class="text-2xl font-bold text-white block">{{
            stats.annotated
          }}</span>
          <span class="text-slate-300 text-sm">Dokumen Dianotasi</span>
        </Card>
        <Card variant="glassmorphism" class="p-6 text-center">
          <UIcon
            name="i-lucide-check-circle"
            class="w-10 h-10 text-green-400 mx-auto mb-4"
          />
          <span class="text-2xl font-bold text-white block">{{
            stats.reviewed
          }}</span>
          <span class="text-slate-300 text-sm">Dokumen Ditinjau</span>
        </Card>
        <Card variant="glassmorphism" class="p-6 text-center">
          <UIcon
            name="i-lucide-bar-chart-2"
            class="w-10 h-10 text-purple-400 mx-auto mb-4"
          />
          <span class="text-2xl font-bold text-white block">{{
            stats.total
          }}</span>
          <span class="text-slate-300 text-sm">Total Dokumen</span>
        </Card>
      </div>

      <!-- Improved Weekly Statistics -->
      <Card variant="glassmorphism" class="p-6 mb-10">
        <h3 class="text-lg font-semibold mb-6 flex items-center gap-2">
          <UIcon name="i-lucide-bar-chart" class="w-6 h-6 text-blue-400" />
          Statistik Anotasi Mingguan
        </h3>
        <div class="flex items-end gap-4 h-40">
          <div
            v-for="(val, i) in weeklyStats"
            :key="i"
            class="flex flex-col items-center flex-1"
          >
            <div class="relative w-full">
              <div
                class="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t shadow-lg transition-all duration-300 hover:from-blue-500 hover:to-blue-300"
                :style="{ height: `${Math.max(val.count * 8, 20)}px` }"
              ></div>
              <div
                class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {{ val.count }} dokumen
              </div>
            </div>
            <span class="text-sm text-gray-300 mt-3 font-medium">{{
              val.label
            }}</span>
          </div>
        </div>
        <div class="mt-4 text-center">
          <span class="text-sm text-gray-400"
            >Total minggu ini: {{ weeklyTotal }} dokumen</span
          >
        </div>
      </Card>

      <!-- Document List -->
      <Card variant="glassmorphism" class="p-6">
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

          <!-- Improved Filters -->
          <div class="flex flex-wrap gap-3 items-center">
            <!-- Search -->
            <div class="relative">
              <input
                v-model="search"
                type="text"
                placeholder="Cari dokumen..."
                class="w-48 md:w-64 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              />
            </div>

            <!-- Status Filter -->
            <div class="relative">
              <select
                v-model="filter.status"
                class="w-40 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="">Semua Status</option>
                <option value="belum_dianotasi">Belum Dianotasi</option>
                <option value="sedang_dianotasi">Sedang Dianotasi</option>
                <option value="sudah_dianotasi">Sudah Dianotasi</option>
                <option value="sudah_direview">Sudah Direview</option>
              </select>
              <UIcon
                name="i-heroicons-chevron-down"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              />
            </div>

            <!-- Unified Date Filter -->
            <div class="relative">
              <select
                v-model="dateFilterType"
                @change="handleDateFilterChange"
                class="w-48 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="">Semua Tanggal</option>
                <option value="today">Hari Ini</option>
                <option value="week">Minggu Ini</option>
                <option value="month">Bulan Ini</option>
                <option value="last_month">Bulan Lalu</option>
                <option value="custom">Rentang Kustom</option>
              </select>
              <UIcon
                name="i-heroicons-chevron-down"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              />
            </div>

            <!-- Custom Date Range (shown when custom is selected) -->
            <div
              v-if="dateFilterType === 'custom'"
              class="flex gap-2 items-center"
            >
              <div class="relative">
                <input
                  v-model="filter.dateFrom"
                  type="date"
                  class="w-36 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <span class="absolute -bottom-6 left-0 text-xs text-gray-400"
                  >Dari</span
                >
              </div>
              <span class="text-gray-400 text-sm">s/d</span>
              <div class="relative">
                <input
                  v-model="filter.dateTo"
                  type="date"
                  class="w-36 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <span class="absolute -bottom-6 left-0 text-xs text-gray-400"
                  >Sampai</span
                >
              </div>
            </div>

            <!-- Clear Filters Button -->
            <button
              @click="resetFilters"
              class="px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
              title="Clear Filters"
            >
              <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="text-center py-8">
          <span class="text-gray-400">Memuat dokumen...</span>
        </div>

        <div v-else class="overflow-x-auto rounded-lg">
          <table class="min-w-full text-sm table-auto">
            <thead>
              <tr class="bg-gray-800/60 text-gray-300 sticky top-0 z-10">
                <th class="px-4 py-3 text-left">No</th>
                <th class="px-4 py-3 text-left">Judul</th>
                <th class="px-4 py-3 text-left">Status</th>
                <th class="px-4 py-3 text-left">Tanggal</th>
                <th class="px-4 py-3 text-left">Sentences</th>
                <th class="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(doc, index) in filteredDocs"
                :key="doc.id"
                class="border-b border-white/10 hover:bg-blue-900/20 transition-colors"
              >
                <td class="px-4 py-3 font-semibold">{{ index + 1 }}</td>
                <td class="px-4 py-3 font-semibold">{{ doc.title }}</td>
                <td class="px-4 py-3">
                  <span
                    :class="getStatusClass(getDocumentStatus(doc))"
                    class="px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {{ getStatusText(getDocumentStatus(doc)) }}
                  </span>
                </td>
                <td class="px-4 py-3">{{ formatDate(doc.created_at) }}</td>
                <td class="px-4 py-3">{{ doc.sentences?.length || 0 }}</td>
                <td class="px-4 py-3">
                  <Button
                    variant="default"
                    size="sm"
                    @click="goToDetail(doc.id)"
                    class="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
                    Anotasi
                  </Button>
                </td>
              </tr>
              <tr v-if="filteredDocs.length === 0">
                <td colspan="6" class="text-center text-gray-400 py-8">
                  Tidak ada dokumen ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { navigateTo } from "#app";
import { Button } from "~/components/ui/button";
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
  annotated: docs.value.filter((doc) =>
    doc.sentences.some((sentence) => sentence.has_error)
  ).length,
  reviewed: docs.value.filter((doc) =>
    doc.sentences.every(
      (sentence) => sentence.has_error && sentence.corrected_text
    )
  ).length,
  total: docs.value.length,
}));

// Improved weekly stats with real data
const weeklyStats = computed(() => {
  const today = new Date();
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const stats = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const count = docs.value.filter((doc) => {
      const docDate = doc.created_at.split("T")[0];
      return docDate === dateStr;
    }).length;

    stats.push({
      label: days[date.getDay()],
      count: count,
      date: dateStr,
    });
  }

  return stats;
});

const weeklyTotal = computed(() => {
  return weeklyStats.value.reduce((sum, day) => sum + day.count, 0);
});

// Filter/search state
const search = ref("");
const filter = ref({
  status: "",
  dateFrom: "",
  dateTo: "",
});
const dateFilterType = ref("");

// Filtering logic
const filteredDocs = computed(() => {
  return docs.value.filter((doc) => {
    // Search filter
    const matchSearch =
      !search.value ||
      doc.title.toLowerCase().includes(search.value.toLowerCase()) ||
      doc.text.toLowerCase().includes(search.value.toLowerCase());

    // Status filter - derive status from sentences
    const docStatus = getDocumentStatus(doc);
    const matchStatus =
      !filter.value.status || docStatus === filter.value.status;

    // Date filter
    const docDate = new Date(doc.created_at);
    let matchDate = true;

    if (dateFilterType.value && dateFilterType.value !== "custom") {
      // Apply preset date filters
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      switch (dateFilterType.value) {
        case "today":
          matchDate = doc.created_at.startsWith(todayStr);
          break;
        case "week":
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          matchDate = docDate >= weekAgo;
          break;
        case "month":
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          matchDate = docDate >= monthAgo;
          break;
        case "last_month":
          const twoMonthsAgo = new Date(today);
          twoMonthsAgo.setMonth(today.getMonth() - 2);
          const lastMonth = new Date(today);
          lastMonth.setMonth(today.getMonth() - 1);
          matchDate = docDate >= twoMonthsAgo && docDate < lastMonth;
          break;
      }
    } else if (filter.value.dateFrom && filter.value.dateTo) {
      const fromDate = new Date(filter.value.dateFrom);
      const toDate = new Date(filter.value.dateTo);
      matchDate = docDate >= fromDate && docDate <= toDate;
    }

    return matchSearch && matchStatus && matchDate;
  });
});

// Methods
function resetFilters() {
  search.value = "";
  filter.value = {
    status: "",
    dateFrom: "",
    dateTo: "",
  };
  dateFilterType.value = "";
}

function handleDateFilterChange() {
  // Clear custom date inputs when switching to presets
  if (dateFilterType.value !== "custom") {
    filter.value.dateFrom = "";
    filter.value.dateTo = "";
  }
}

function goToDetail(id: number) {
  navigateTo(`/anotator/anotasi/${id}`);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID");
}

function getDocumentStatus(doc: DocumentResponse): string {
  if (
    doc.sentences.every(
      (sentence) => sentence.has_error && sentence.corrected_text
    )
  ) {
    return "sudah_direview";
  } else if (doc.sentences.some((sentence) => sentence.has_error)) {
    return "sudah_dianotasi";
  } else if (doc.sentences.some((sentence) => sentence.has_error === false)) {
    return "sedang_dianotasi";
  } else {
    return "belum_dianotasi";
  }
}

function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    belum_dianotasi: "Belum Dianotasi",
    sedang_dianotasi: "Sedang Dianotasi",
    sudah_dianotasi: "Sudah Dianotasi",
    sudah_direview: "Sudah Direview",
  };
  return statusMap[status] || status;
}

function getStatusClass(status: string) {
  const classMap: Record<string, string> = {
    belum_dianotasi: "bg-gray-500 text-white",
    sedang_dianotasi: "bg-yellow-500 text-white",
    sudah_dianotasi: "bg-blue-500 text-white",
    sudah_direview: "bg-green-500 text-white",
  };
  return classMap[status] || "bg-gray-500 text-white";
}

// Fetch data on mount
async function fetchData() {
  isLoading.value = true;

  // Use dummy data immediately for testing
  docs.value = [
    {
      id: 1,
      title: "Artikel Bahasa Indonesia 1",
      text: "Ini adalah isi dokumen artikel Bahasa Indonesia 1.\n\nSilakan lakukan anotasi pada bagian yang diperlukan.\n\nDokumen ini berisi beberapa paragraf untuk testing anotasi.\n\nSetiap paragraf dapat dianotasi secara terpisah.",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      assigned_to: [1, 2],
      sentences: [
        {
          id: 1,
          text: "Ini adalah isi dokumen artikel Bahasa Indonesia 1.",
          m2_text: "",
          corrected_text: "",
          has_error: false,
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z",
          document: 1,
        },
        {
          id: 2,
          text: "Silakan lakukan anotasi pada bagian yang diperlukan.",
          m2_text: "",
          corrected_text: "",
          has_error: false,
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z",
          document: 1,
        },
        {
          id: 3,
          text: "Dokumen ini berisi beberapa paragraf untuk testing anotasi.",
          m2_text: "",
          corrected_text: "",
          has_error: false,
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z",
          document: 1,
        },
        {
          id: 4,
          text: "Setiap paragraf dapat dianotasi secara terpisah.",
          m2_text: "",
          corrected_text: "",
          has_error: false,
          created_at: "2024-01-15T10:30:00Z",
          updated_at: "2024-01-15T10:30:00Z",
          document: 1,
        },
      ],
    },
    {
      id: 2,
      title: "Artikel Bahasa Indonesia 2",
      text: "Artikel kedua untuk testing anotasi.\n\nParagraf pertama berisi beberapa kalimat.\n\nParagraf kedua juga dapat dianotasi.\n\nIni adalah paragraf terakhir.",
      created_at: "2024-01-16T14:20:00Z",
      updated_at: "2024-01-16T14:20:00Z",
      assigned_to: [2, 3],
      sentences: [
        {
          id: 5,
          text: "Artikel kedua untuk testing anotasi.",
          m2_text: "",
          corrected_text: "",
          has_error: true,
          created_at: "2024-01-16T14:20:00Z",
          updated_at: "2024-01-16T14:20:00Z",
          document: 2,
        },
        {
          id: 6,
          text: "Paragraf pertama berisi beberapa kalimat.",
          m2_text: "",
          corrected_text: "",
          has_error: false,
          created_at: "2024-01-16T14:20:00Z",
          updated_at: "2024-01-16T14:20:00Z",
          document: 2,
        },
        {
          id: 7,
          text: "Paragraf kedua juga dapat dianotasi.",
          m2_text: "",
          corrected_text: "",
          has_error: false,
          created_at: "2024-01-16T14:20:00Z",
          updated_at: "2024-01-16T14:20:00Z",
          document: 2,
        },
        {
          id: 8,
          text: "Ini adalah paragraf terakhir.",
          m2_text: "",
          corrected_text: "",
          has_error: false,
          created_at: "2024-01-16T14:20:00Z",
          updated_at: "2024-01-16T14:20:00Z",
          document: 2,
        },
      ],
    },
    {
      id: 3,
      title: "Artikel Bahasa Indonesia 3",
      text: "Artikel ketiga dengan konten yang lebih panjang.\n\nParagraf ini berisi beberapa kalimat yang dapat dianotasi.\n\nKami dapat menambahkan lebih banyak paragraf jika diperlukan.\n\nSetiap kalimat dapat memiliki anotasi yang berbeda.",
      created_at: "2024-01-17T09:15:00Z",
      updated_at: "2024-01-17T09:15:00Z",
      assigned_to: [1],
      sentences: [
        {
          id: 9,
          text: "Artikel ketiga dengan konten yang lebih panjang.",
          m2_text: "",
          corrected_text: "Artikel ketiga dengan konten yang lebih panjang.",
          has_error: true,
          created_at: "2024-01-17T09:15:00Z",
          updated_at: "2024-01-17T09:15:00Z",
          document: 3,
        },
        {
          id: 10,
          text: "Paragraf ini berisi beberapa kalimat yang dapat dianotasi.",
          m2_text: "",
          corrected_text:
            "Paragraf ini berisi beberapa kalimat yang dapat dianotasi.",
          has_error: true,
          created_at: "2024-01-17T09:15:00Z",
          updated_at: "2024-01-17T09:15:00Z",
          document: 3,
        },
        {
          id: 11,
          text: "Kami dapat menambahkan lebih banyak paragraf jika diperlukan.",
          m2_text: "",
          corrected_text:
            "Kami dapat menambahkan lebih banyak paragraf jika diperlukan.",
          has_error: true,
          created_at: "2024-01-17T09:15:00Z",
          updated_at: "2024-01-17T09:15:00Z",
          document: 3,
        },
        {
          id: 12,
          text: "Setiap kalimat dapat memiliki anotasi yang berbeda.",
          m2_text: "",
          corrected_text: "Setiap kalimat dapat memiliki anotasi yang berbeda.",
          has_error: true,
          created_at: "2024-01-17T09:15:00Z",
          updated_at: "2024-01-17T09:15:00Z",
          document: 3,
        },
      ],
    },
  ];

  isLoading.value = false;
}

onMounted(fetchData);
</script>

<style scoped>
/* Custom styles for better dark theme compatibility */
select option {
  background-color: #1f2937;
  color: white;
}

/* Glassmorphism styles */
.glassmorphism-custom {
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1.25rem;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15), 0 12px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 2rem;
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
  padding: 1.5rem 0.5rem;
  margin-bottom: 0;
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
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}
.filter-bar > * {
  margin-right: 0.25rem;
}
.filter-bar > *:last-child {
  margin-right: 0;
}
</style>
