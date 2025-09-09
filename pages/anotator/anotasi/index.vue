<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <!-- Header & Lanjutkan Anotasi -->
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
      >
        <div>
          <h1 class="text-2xl font-bold text-black mb-1">Anotator</h1>
          <p class="text-gray-700">
            Kelola dan lakukan anotasi pada dataset yang ditugaskan
          </p>
        </div>
        <div v-if="firstInProgressDoc">
          <Button
            class="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-all flex items-center gap-2"
            @click="goToDetail(firstInProgressDoc.id)"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 3v18l15-9L5 3z"></path>
            </svg>
            Lanjutkan Anotasi
          </Button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card
          class="p-6 bg-white border border-gray-200 rounded-xl group cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Total Anotasi</p>
              <p class="text-2xl font-bold text-black">
                {{ stats.annotated }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 19.5A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 17.5 2h-11A2.5 2.5 0 0 0 4 4.5v15ZM8 6h8M8 10h8m-8 4h6"
                />
              </svg>
            </div>
          </div>
        </Card>
        <Card
          class="p-6 bg-white border border-gray-200 rounded-xl group cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Hari Ini</p>
              <p class="text-2xl font-bold text-black">
                {{ todayAnnotated }}
              </p>
            </div>
            <div
              class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          </div>
        </Card>
        <Card
          class="p-6 bg-white border border-gray-200 rounded-xl group cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Akurasi</p>
              <p class="text-2xl font-bold text-black">{{ accuracy }}%</p>
            </div>
            <div
              class="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 17.75 18.2 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
              </svg>
            </div>
          </div>
        </Card>
        <Card
          class="p-6 bg-white border border-gray-200 rounded-xl group cursor-pointer"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Total Dokumen</p>
              <p class="text-2xl font-bold text-black">{{ stats.total }}</p>
            </div>
            <div
              class="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center group-hover:scale-105 transition"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 19.5A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 17.5 2h-11A2.5 2.5 0 0 0 4 4.5v15Z"
                />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <!-- 2 Column Layout: Statistik Anotasi Mingguan & Aksi Cepat (same height) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <!-- Statistik Anotasi Mingguan -->
        <Card
          class="p-6 bg-white border border-gray-200 rounded-xl flex flex-col h-full lg:col-span-2"
        >
          <h3
            class="text-lg font-semibold mb-6 flex items-center gap-3 text-black"
          >
            <span
              class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-gray-100"
            >
              <!-- Use BarChart3 icon from lucide-vue-next or fallback to a simple bar icon -->
              <svg
                class="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="10" width="4" height="11" rx="1" />
                <rect x="9" y="3" width="4" height="18" rx="1" />
                <rect x="15" y="6" width="4" height="15" rx="1" />
              </svg>
            </span>
            Statistik Anotasi Mingguan
          </h3>
          <div class="flex items-end gap-4 h-40">
            <div
              v-for="(val, i) in weeklyStats"
              :key="i"
              class="flex flex-col items-center flex-1"
            >
              <div class="relative w-full group">
                <div
                  class="bg-black rounded-t transition-all duration-300 group-hover:bg-gray-800"
                  :style="{ height: `${Math.max(val.count * 8, 20)}px` }"
                ></div>
                <div
                  class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {{ val.count }} dokumen
                </div>
              </div>
              <span class="text-sm text-gray-700 mt-3 font-medium">{{
                val.label
              }}</span>
            </div>
          </div>
          <div class="mt-4 text-center">
            <span class="text-sm text-gray-500"
              >Total minggu ini: {{ weeklyTotal }} dokumen</span
            >
          </div>
        </Card>
        <!-- Aksi Cepat -->
        <Card
          class="p-6 bg-white border border-gray-200 rounded-xl flex flex-col h-full justify-between"
        >
          <h3 class="text-lg text-black mb-4 font-semibold">Aksi Cepat</h3>
          <div class="space-y-3 flex-1">
            <Button
              class="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 font-medium transition"
            >
              <svg
                class="w-4 h-4 mr-2 shadow-0"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4 19.5A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 17.5 2h-11A2.5 2.5 0 0 0 4 4.5v15Z"
                />
              </svg>
              Laporan Harian
            </Button>
            <Button
              class="w-full justify-start bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 font-medium transition"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Target Mingguan
            </Button>
            <Button
              class="w-full justify-start bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 font-medium transition"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 17.75 18.2 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
              </svg>
              Skor Kualitas
            </Button>
            <Button
              class="w-full justify-start bg-yellow-50 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800 font-medium transition"
            >
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Riwayat Kerja
            </Button>
          </div>
        </Card>
      </div>

      <!-- Daftar Dokumen (full row) -->
      <Card class="p-6 bg-white border border-gray-200 rounded-xl mb-10">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <h2 class="text-xl font-bold flex items-center gap-3 text-black">
            <span
              class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-blue-50"
            >
              <!-- Use FileText icon from lucide-vue-next or fallback to a simple doc icon -->
              <svg
                class="w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <line x1="8" y1="8" x2="16" y2="8" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="8" y1="16" x2="12" y2="16" />
              </svg>
            </span>
            Daftar Dokumen
          </h2>
          <!-- Filters -->
          <div class="flex flex-wrap gap-3 items-center">
            <!-- Search -->
            <div class="relative">
              <input
                v-model="search"
                type="text"
                placeholder="Cari dokumen..."
                class="w-48 md:w-64 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
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
                class="w-40 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all appearance-none cursor-pointer"
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

            <!-- Date Filter -->
            <div class="relative">
              <select
                v-model="dateFilterType"
                @change="handleDateFilterChange"
                class="w-48 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all appearance-none cursor-pointer"
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

            <!-- Custom Date Range -->
            <div
              v-if="dateFilterType === 'custom'"
              class="flex gap-2 items-center"
            >
              <div class="relative">
                <input
                  v-model="filter.dateFrom"
                  type="date"
                  class="w-36 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
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
                  class="w-36 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
                <span class="absolute -bottom-6 left-0 text-xs text-gray-400"
                  >Sampai</span
                >
              </div>
            </div>

            <!-- Clear Filters Button -->
            <button
              @click="resetFilters"
              class="px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
              title="Clear Filters"
            >
              <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="py-4">
          <div class="animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div class="space-y-2">
              <div class="h-10 bg-gray-100 rounded"></div>
              <div class="h-10 bg-gray-100 rounded"></div>
              <div class="h-10 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>

        <div v-else class="overflow-x-auto rounded-lg">
          <table class="min-w-full text-sm table-auto">
            <thead>
              <tr class="bg-black text-white sticky top-0 z-10">
                <th class="px-4 py-3 text-left">No</th>
                <th class="px-4 py-3 text-left">
                  <button
                    class="flex items-center gap-1 hover:text-blue-200 transition"
                    @click="setSort('title')"
                  >
                    Judul
                    <UIcon :name="sortIcon('title')" class="w-4 h-4" />
                  </button>
                </th>
                <th class="px-4 py-3 text-left">
                  <button
                    class="flex items-center gap-1 hover:text-blue-200 transition"
                    @click="setSort('institusi')"
                  >
                    Lembaga Asal
                    <UIcon :name="sortIcon('institusi')" class="w-4 h-4" />
                  </button>
                </th>
                <th class="px-4 py-3 text-left">
                  <button
                    class="flex items-center gap-1 hover:text-blue-200 transition"
                    @click="setSort('assigned_by_name')"
                  >
                    Assigned By
                    <UIcon
                      :name="sortIcon('assigned_by_name')"
                      class="w-4 h-4"
                    />
                  </button>
                </th>
                <th class="px-4 py-3 text-left">
                  <button
                    class="flex items-center gap-1 hover:text-blue-200 transition"
                    @click="setSort('status')"
                  >
                    Status
                    <UIcon :name="sortIcon('status')" class="w-4 h-4" />
                  </button>
                </th>
                <th class="px-4 py-3 text-left">
                  <button
                    class="flex items-center gap-1 hover:text-blue-200 transition"
                    @click="setSort('created_at')"
                  >
                    Tanggal
                    <UIcon :name="sortIcon('created_at')" class="w-4 h-4" />
                  </button>
                </th>
                <th class="px-4 py-3 text-left">
                  <button
                    class="flex items-center gap-1 hover:text-blue-200 transition"
                    @click="setSort('jumlah_sentence')"
                  >
                    Sentences
                    <UIcon
                      :name="sortIcon('jumlah_sentence')"
                      class="w-4 h-4"
                    />
                  </button>
                </th>
                <th class="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody class="text-black-900">
              <tr
                v-for="(doc, index) in filteredDocs"
                :key="doc.id"
                class="border-b border-gray-200 hover:bg-blue-50 text-gray-900 transition-colors"
              >
                <td class="px-4 py-3 font-semibold">{{ index + 1 }}</td>
                <td class="px-4 py-3 font-semibold">{{ doc.title }}</td>
                <td class="px-4 py-3">{{ doc.institusi }}</td>
                <td class="px-4 py-3">
                  {{ doc.assigned_by?.full_name || "-" }}
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="getStatusClass(doc.status)"
                    class="px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {{ getStatusText(doc.status) }}
                  </span>
                </td>
                <td class="px-4 py-3">{{ formatDate(doc.created_at) }}</td>
                <td class="px-4 py-3">{{ doc.jumlah_sentence }}</td>
                <td class="px-4 py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    :disabled="
                      !(
                        doc.status === 'belum_dianotasi' ||
                        doc.status === 'sedang_dianotasi'
                      )
                    "
                    @click="goToDetail(doc.id)"
                    class="bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 transition-all duration-150"
                  >
                    <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
                    Anotasi
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    :disabled="
                      !(
                        doc.status === 'sudah_dianotasi' ||
                        doc.status === 'belum_direview'
                      )
                    "
                    @click="handleReopen(doc)"
                    class="ml-2 bg-purple-500 hover:bg-purple-600 text-white hover:scale-105 transition-all duration-150"
                  >
                    <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
                    Reopen
                  </Button>
                </td>
              </tr>
              <tr v-if="filteredDocs.length === 0">
                <td colspan="8" class="py-10">
                  <div class="flex flex-col items-center gap-3 text-gray-400">
                    <UIcon
                      name="i-heroicons-document-magnifying-glass"
                      class="w-10 h-10"
                    />
                    <div>Tidak ada dokumen ditemukan.</div>
                    <button
                      @click="resetFilters"
                      class="px-3 py-1.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs transition"
                    >
                      Reset Filter
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <!-- Reopen Document Modal -->
      <div
        v-if="showReopenModal"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <div
          class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4"
          @click.stop
        >
          <h3
            class="text-lg font-semibold mb-4 text-black flex items-center gap-2"
          >
            <UIcon
              name="i-heroicons-arrow-path"
              class="w-5 h-5 text-purple-500"
            />
            Reopen Dokumen
          </h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Alasan Reopen (opsional)</label
            >
            <textarea
              v-model="reopenReason"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              placeholder="Tulis alasan mengapa dokumen perlu dibuka kembali..."
            ></textarea>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              @click="closeReopenModal"
              class="bg-gray-100 text-gray-700"
              >Batal</Button
            >
            <Button
              :loading="reopenLoading"
              @click="submitReopen"
              class="bg-purple-500 text-white hover:bg-purple-600"
              >Kirim</Button
            >
          </div>
          <div v-if="reopenError" class="mt-3 text-red-500 text-sm">
            {{ reopenError }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { navigateTo } from "#app";
import { Button } from "~/components/ui/button";
import { useUserDocumentsApi } from "~/data/user-documents";
import { useAnnotationsApi } from "~/data/annotations";
import type { DocumentResponse, AnnotationResponse } from "~/types/api";

const { getAssignedDocuments } = useUserDocumentsApi();
const { reopenAnnotation } = useAnnotationsApi();

// State
const docs = ref<DocumentResponse[]>([]);
const annotations = ref<AnnotationResponse[]>([]);
const isLoading = ref(false);

// Statistics computed from real data
const stats = computed(() => ({
  annotated: docs.value.filter((doc) => doc.status === "sudah_dianotasi")
    .length,
  reviewed: docs.value.filter((doc) => doc.status === "sudah_direview").length,
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
const sort = ref<{ key: string; dir: "asc" | "desc" }>({
  key: "created_at",
  dir: "desc",
});

// Filtering logic
const filteredDocs = computed(() => {
  const base = docs.value.filter((doc) => {
    // Search filter
    const matchSearch =
      !search.value ||
      doc.title.toLowerCase().includes(search.value.toLowerCase()) ||
      doc.text.toLowerCase().includes(search.value.toLowerCase());

    // Status filter
    const matchStatus =
      !filter.value.status || doc.status === filter.value.status;

    // Date filter
    const docDate = new Date(doc.created_at);
    let matchDate = true;

    if (dateFilterType.value && dateFilterType.value !== "custom") {
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

  // sort
  const sorted = [...base].sort((a, b) => {
    const dir = sort.value.dir === "asc" ? 1 : -1;
    const key = sort.value.key;
    if (key === "title" || key === "institusi") {
      const av = (a as any)[key] || "";
      const bv = (b as any)[key] || "";
      return av.localeCompare(bv) * dir;
    }
    if (key === "assigned_by_name") {
      const av = a.assigned_by?.full_name || "";
      const bv = b.assigned_by?.full_name || "";
      return av.localeCompare(bv) * dir;
    }
    if (key === "status") {
      const av = a.status;
      const bv = b.status;
      return av.localeCompare(bv) * dir;
    }
    if (key === "jumlah_sentence") {
      const av = a.jumlah_sentence || 0;
      const bv = b.jumlah_sentence || 0;
      return (av - bv) * dir;
    }
    // default by created_at
    return (
      (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) *
      dir
    );
  });

  return sorted;
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

function setSort(key: string) {
  if (sort.value.key === key) {
    sort.value.dir = sort.value.dir === "asc" ? "desc" : "asc";
  } else {
    sort.value.key = key;
    sort.value.dir = "asc";
  }
}

function sortIcon(key: string) {
  if (sort.value.key !== key) return "i-heroicons-arrows-up-down";
  return sort.value.dir === "asc"
    ? "i-heroicons-arrow-up"
    : "i-heroicons-arrow-down";
}

// removed quick status chips

function goToDetail(id: number) {
  navigateTo(`/anotator/anotasi/${id}`);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID");
}

function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    belum_dianotasi: "Belum Dianotasi",
    sedang_dianotasi: "Sedang Dianotasi",
    sudah_dianotasi: "Sudah Dianotasi",
    sudah_direview: "Sudah Direview",
    belum_direview: "Belum Direview",
  };
  return statusMap[status] || status;
}

function getStatusClass(status: string) {
  const classMap: Record<string, string> = {
    belum_dianotasi: "bg-gray-200 text-gray-700",
    sedang_dianotasi: "bg-yellow-100 text-yellow-700",
    sudah_dianotasi: "bg-blue-100 text-blue-700",
    sudah_direview: "bg-green-100 text-green-700",
    belum_direview: "bg-purple-100 text-purple-700",
  };
  return classMap[status] || "bg-gray-200 text-gray-700";
}

// Find first in-progress doc for "Lanjutkan Anotasi"
const firstInProgressDoc = computed(() =>
  filteredDocs.value.find(
    (doc) =>
      doc.status === "sedang_dianotasi" || doc.status === "sudah_dianotasi"
  )
);

// Today annotated count
const todayAnnotated = computed(() => {
  const todayStr = new Date().toISOString().split("T")[0];
  return docs.value.filter(
    (doc) =>
      (doc.status === "sedang_dianotasi" ||
        doc.status === "sudah_dianotasi" ||
        doc.status === "sudah_direview") &&
      doc.created_at.startsWith(todayStr)
  ).length;
});

// Dummy accuracy calculation
const accuracy = computed(() => {
  if (!docs.value.length) return 0;
  // Example: ratio of reviewed to annotated
  return stats.value.annotated
    ? ((stats.value.reviewed / stats.value.annotated) * 100).toFixed(1)
    : "0.0";
});

// Helper functions for generating realistic data
function getInstitutionName(id: number): string {
  const institutions = [
    "Universitas Indonesia",
    "Institut Teknologi Bandung",
    "Universitas Gadjah Mada",
    "Universitas Padjadjaran",
    "Universitas Diponegoro",
    "Universitas Airlangga",
    "Universitas Brawijaya",
    "Universitas Hasanuddin",
  ];
  return institutions[id % institutions.length];
}

function getAdminName(id: number): string {
  const admins = [
    "Dr. Ahmad Supriyadi",
    "Prof. Siti Nurhaliza",
    "Dr. Bambang Sutejo",
    "Prof. Rina Marlina",
    "Dr. Hendra Gunawan",
    "Prof. Dewi Sartika",
    "Dr. Agus Setiawan",
    "Prof. Maya Indah",
  ];
  return admins[id % admins.length];
}

// Fetch data on mount
async function fetchData() {
  isLoading.value = true;
  try {
    const response = await getAssignedDocuments();
    docs.value =
      response?.results
        ?.sort((a: any, b: any) => a.id - b.id) // Sort by id ascending
        .map((doc: any) => ({
          ...doc,
          // fallback for missing fields if needed
          assigned_by: doc.assigned_by || {
            id: null,
            username: "Unknown",
            full_name: "Unknown",
            institusi: "Unknown",
          },
          institusi: doc.institusi || "-",
          jumlah_sentence:
            doc.jumlah_sentence ?? (doc.sentences ? doc.sentences.length : 0),
        })) || [];
  } catch (e) {
    docs.value = [];
  }
  isLoading.value = false;
}

onMounted(fetchData);

// Reopen document modal state
const showReopenModal = ref(false);
const reopenReason = ref("");
const reopenDocId = ref<number | null>(null);
const reopenLoading = ref(false);
const reopenError = ref("");

function handleReopen(doc: any) {
  reopenDocId.value = doc.id;
  reopenReason.value = "";
  reopenError.value = "";
  showReopenModal.value = true;
}
function closeReopenModal() {
  showReopenModal.value = false;
  reopenDocId.value = null;
  reopenReason.value = "";
  reopenError.value = "";
}
async function submitReopen() {
  if (!reopenDocId.value) return;
  reopenLoading.value = true;
  reopenError.value = "";
  try {
    await reopenAnnotation({
      document: reopenDocId.value,
      reason: reopenReason.value,
    });
    closeReopenModal();
    fetchData();
  } catch (e: any) {
    reopenError.value = e?.message || "Gagal melakukan reopen dokumen.";
  } finally {
    reopenLoading.value = false;
  }
}
</script>

<style scoped>
/* Remove dark theme, use light theme defaults */
select option {
  background-color: #fff;
  color: #222;
}
</style>
