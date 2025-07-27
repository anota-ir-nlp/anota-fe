<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white font-inter px-4 py-8"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Statistic Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="stat-card flex flex-col items-center py-6">
          <UIcon
            name="i-heroicons-document-text"
            class="stat-icon text-blue-400 mb-2"
          />
          <span class="stat-value mb-1">{{ stats.annotated }}</span>
          <span class="stat-label">Dokumen Dianotasi</span>
        </div>
        <div class="stat-card flex flex-col items-center py-6">
          <UIcon
            name="i-heroicons-check-circle"
            class="stat-icon text-green-400 mb-2"
          />
          <span class="stat-value mb-1">{{ stats.reviewed }}</span>
          <span class="stat-label">Dokumen Ditinjau</span>
        </div>
        <div class="stat-card flex flex-col items-center py-6">
          <UIcon
            name="i-heroicons-bars-3"
            class="stat-icon text-purple-400 mb-2"
          />
          <span class="stat-value mb-1">{{ stats.total }}</span>
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
        </div>
        <div class="filter-bar mt-2 mb-6">
          <UInput
            v-model="search"
            placeholder="Cari judul dokumen..."
            :ui="{
              base: 'w-48 md:w-64 bg-gray-900 text-white border-gray-700 placeholder-gray-400',
              icon: 'text-blue-400',
            }"
            size="md"
            icon="i-heroicons-magnifying-glass"
          />
          <UInput
            v-model="filter.tanggal"
            type="date"
            placeholder="Tanggal"
            :ui="{
              base: 'w-32 bg-gray-900 text-white border-gray-700 placeholder-gray-400',
              icon: 'text-blue-400',
            }"
            size="md"
            icon="i-heroicons-calendar"
          />
          <USelectMenu
            v-model="filter.status"
            :items="statusItems"
            placeholder="Status"
            :ui="{
              base: 'w-40 bg-gray-900 text-white border-gray-700 placeholder-gray-400',
              icon: 'text-blue-400',
            }"
            size="md"
            icon="i-heroicons-adjustments-horizontal"
          >
            <template #leading="{ modelValue, ui }">
              <UChip
                v-if="modelValue"
                v-bind="modelValue.chip"
                inset
                standalone
                :size="(ui.itemLeadingChipSize() as ChipProps['size'])"
                :class="ui.itemLeadingChip()"
              />
            </template>
          </USelectMenu>
          <UInput
            v-model="filter.asalLembaga"
            placeholder="Asal Lembaga"
            :ui="{
              base: 'w-32 bg-gray-900 text-white border-gray-700 placeholder-gray-400',
              icon: 'text-blue-400',
            }"
            size="md"
            icon="i-heroicons-building-office"
          />
          <UInput
            v-model="filter.assignedBy"
            placeholder="Assigned By"
            :ui="{
              base: 'w-32 bg-gray-900 text-white border-gray-700 placeholder-gray-400',
              icon: 'text-blue-400',
            }"
            size="md"
            icon="i-heroicons-user"
          />
          <UButton
            label="Reset Filter"
            icon="i-heroicons-arrow-path"
            color="primary"
            variant="solid"
            size="md"
            :ui="{
              base: 'rounded-full px-4 py-2 font-semibold shadow bg-blue-900 text-white border border-blue-700 hover:bg-blue-800 transition',
            }"
            @click="resetFilters"
            title="Reset Filter"
            class="ml-2"
          />
        </div>
        <div class="overflow-x-auto rounded-lg">
          <table class="min-w-full text-sm table-auto">
            <thead>
              <tr class="bg-gray-800/60 text-gray-300 sticky top-0 z-10">
                <th class="px-4 py-2 text-left">Nomor</th>
                <th class="px-4 py-2 text-left">Judul</th>
                <th class="px-4 py-2 text-left">Tanggal</th>
                <th class="px-4 py-2 text-left">Status</th>
                <th class="px-4 py-2 text-left">Asal Lembaga</th>
                <th class="px-4 py-2 text-left">Assigned By</th>
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="doc in filteredDocs"
                :key="doc.id"
                class="border-b border-white/10 hover:bg-blue-900/20 transition"
              >
                <td class="px-4 py-2 font-semibold">{{ doc.nomor }}</td>
                <td class="px-4 py-2 font-semibold">{{ doc.judul }}</td>
                <td class="px-4 py-2">{{ doc.tanggal }}</td>
                <td class="px-4 py-2">
                  <span :class="statusColor(doc.status)">
                    {{ doc.status }}
                  </span>
                </td>
                <td class="px-4 py-2">{{ doc.asalLembaga }}</td>
                <td class="px-4 py-2">{{ doc.assignedBy }}</td>
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
                <td colspan="7" class="text-center text-gray-400 py-8">
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
import { ref, computed } from "vue";
import { navigateTo } from "#app";
import type { SelectMenuItem, ChipProps } from "@nuxt/ui";

// Dummy statistics
const stats = ref({
  annotated: 24,
  reviewed: 15,
  total: 30,
});

// Dummy weekly stats for code block
const weeklyStats = ref([
  { label: "Sen", count: 3 },
  { label: "Sel", count: 5 },
  { label: "Rab", count: 2 },
  { label: "Kam", count: 4 },
  { label: "Jum", count: 6 },
  { label: "Sab", count: 2 },
  { label: "Min", count: 2 },
]);

// Dummy document data
const docs = ref([
  {
    id: 1,
    nomor: "001/A/2024",
    judul: "Artikel Bahasa Indonesia 1",
    tanggal: "2024-06-01",
    status: "Sudah Dianotasi",
    asalLembaga: "Universitas A",
    assignedBy: "Admin",
  },
  {
    id: 2,
    nomor: "002/L/2024",
    judul: "Laporan Penelitian",
    tanggal: "2024-06-02",
    status: "Belum Dianotasi",
    asalLembaga: "Kementerian Riset",
    assignedBy: "Kepala Riset",
  },
  {
    id: 3,
    nomor: "003/B/2024",
    judul: "Berita Harian",
    tanggal: "2024-06-03",
    status: "Sedang Dianotasi",
    asalLembaga: "Media Nasional",
    assignedBy: "Admin",
  },
  {
    id: 4,
    nomor: "004/M/2024",
    judul: "Makalah Akademik",
    tanggal: "2024-06-04",
    status: "Sudah Direview",
    asalLembaga: "Universitas B",
    assignedBy: "Admin",
  },
]);

// Filter/search state
const search = ref("");
const filter = ref({
  tanggal: "",
  status: null, // will hold the selected item object
  asalLembaga: "",
  assignedBy: "",
});

// Status dropdown items with chip color
const statusItems = ref([
  {
    label: "Belum Dianotasi",
    value: "Belum Dianotasi",
    chip: { color: "warning" },
  },
  {
    label: "Sedang Dianotasi",
    value: "Sedang Dianotasi",
    chip: { color: "primary" },
  },
  {
    label: "Sudah Dianotasi",
    value: "Sudah Dianotasi",
    chip: { color: "success" },
  },
  {
    label: "Sudah Direview",
    value: "Sudah Direview",
    chip: { color: "secondary" },
  },
] satisfies SelectMenuItem[]);

// Filtering logic
const filteredDocs = computed(() => {
  return docs.value.filter((doc) => {
    const matchSearch =
      !search.value ||
      doc.judul.toLowerCase().includes(search.value.toLowerCase());
    const matchTanggal =
      !filter.value.tanggal || doc.tanggal === filter.value.tanggal;
    const matchStatus =
      !filter.value.status || doc.status === filter.value.status.value;
    const matchAsalLembaga =
      !filter.value.asalLembaga ||
      doc.asalLembaga
        .toLowerCase()
        .includes(filter.value.asalLembaga.toLowerCase());
    const matchAssigned =
      !filter.value.assignedBy ||
      doc.assignedBy
        .toLowerCase()
        .includes(filter.value.assignedBy.toLowerCase());
    return (
      matchSearch &&
      matchTanggal &&
      matchStatus &&
      matchAsalLembaga &&
      matchAssigned
    );
  });
});

function resetFilters() {
  search.value = "";
  filter.value = {
    tanggal: "",
    status: null,
    asalLembaga: "",
    assignedBy: "",
  };
}

// Status color helper
function statusColor(status: string) {
  switch (status) {
    case "Belum Dianotasi":
      return "text-yellow-400";
    case "Sedang Dianotasi":
      return "text-blue-400";
    case "Sudah Dianotasi":
      return "text-green-400";
    case "Sudah Direview":
      return "text-purple-400";
    default:
      return "text-gray-400";
  }
}

// Navigation to detail page
function goToDetail(id: number) {
  navigateTo(`/anotator/anotasi/${id}`);
}
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
