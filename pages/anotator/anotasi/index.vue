<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter text-gray-900">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-black mb-1">Anotator</h1>
          <p class="text-gray-700">
            Kelola dan lakukan anotasi pada dataset yang ditugaskan
          </p>
        </div>
        <div v-if="firstInProgressDoc">
          <Button
            class="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-lg transition-all flex items-center gap-2"
            @click="goToDetail(firstInProgressDoc.id)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M5 3v18l15-9L5 3z"></path>
            </svg>
            Lanjutkan Anotasi
          </Button>
        </div>
      </div>

      <Card class="p-6 bg-white border border-gray-200 rounded-xl mb-10">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p class="text-sm text-gray-500 mb-1">Progres Anotasi</p>
            <div class="flex items-end gap-2">
              <span class="text-3xl font-bold text-black">{{ stats.annotated }}</span>
              <span class="text-gray-400 mb-1">/ {{ stats.total }} Dokumen</span>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500 mb-1">Persentase Selesai</p>
            <p class="text-3xl font-bold text-blue-600">{{ accuracy }}%</p>
          </div>
        </div>
        <div class="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
          <div 
            class="bg-blue-600 h-full transition-all duration-500" 
            :style="{ width: `${accuracy}%` }"
          ></div>
        </div>
      </Card>

      <Card class="p-6 bg-white border border-gray-200 rounded-xl mb-10">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 class="text-xl font-bold flex items-center gap-3 text-black">
            <span class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-gray-50">
              <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <line x1="8" y1="8" x2="16" y2="8" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="8" y1="16" x2="12" y2="16" />
              </svg>
            </span>
            Daftar Dokumen
          </h2>
          <div class="flex flex-wrap gap-3 items-center">
            <div class="relative">
              <input
                v-model="search"
                type="text"
                placeholder="Cari dokumen..."
                class="w-48 md:w-64 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <UIcon name="i-heroicons-magnifying-glass" class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            <select
              v-model="filter.status"
              class="w-40 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all cursor-pointer"
            >
              <option value="">Semua Status</option>
              <option value="belum_dianotasi">Belum Dianotasi</option>
              <option value="sedang_dianotasi">Sedang Dianotasi</option>
              <option value="sudah_dianotasi">Sudah Dianotasi</option>
            </select>

            <select
              v-model="dateFilterType"
              @change="handleDateFilterChange"
              class="w-48 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all cursor-pointer"
            >
              <option value="">Semua Tanggal</option>
              <option value="today">Hari Ini</option>
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
              <option value="custom">Rentang Kustom</option>
            </select>

            <div v-if="dateFilterType === 'custom'" class="flex gap-2 items-center">
              <input
                v-model="filter.dateFrom"
                type="date"
                class="w-36 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
              <span class="text-gray-400">s/d</span>
              <input
                v-model="filter.dateTo"
                type="date"
                class="w-36 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              />
            </div>

            <button
              @click="resetFilters"
              class="p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-200 transition-all"
            >
              <UIcon name="i-heroicons-arrow-path" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="py-4">
          <div class="animate-pulse space-y-4">
            <div class="h-10 bg-gray-100 rounded w-full"></div>
            <div class="h-10 bg-gray-100 rounded w-full"></div>
            <div class="h-10 bg-gray-100 rounded w-full"></div>
          </div>
        </div>

        <div v-else class="overflow-x-auto rounded-lg">
          <table class="min-w-full table-fixed w-full text-sm">
            <thead>
              <tr class="bg-black text-white">
                <th class="px-4 py-3 text-left w-[5%]">No</th>
                <th class="px-4 py-3 text-left w-[40%]">
                  <button class="flex items-center gap-1" @click="setSort('title')">
                    Judul
                    <UIcon :name="sortIcon('title')" class="w-4 h-4" />
                  </button>
                </th>
                <th class="px-4 py-3 text-left">
                  <button class="flex items-center gap-1" @click="setSort('status')">
                    Status
                    <UIcon :name="sortIcon('status')" class="w-4 h-4" />
                  </button>
                </th>
                <th class="px-4 py-3 text-left">
                  <button class="flex items-center gap-1" @click="setSort('created_at')">
                    Tanggal
                    <UIcon :name="sortIcon('created_at')" class="w-4 h-4" />
                  </button>
                </th>
                <th class="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(doc, index) in filteredDocs" :key="doc.id" class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td class="px-4 py-4">{{ (page - 1) * pageCount + index + 1 }}</td>
                <td class="px-4 py-4 font-semibold">{{ doc.title }}</td>
                <td class="px-4 py-4">
                  <span :class="getStatusClass(doc.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                    {{ getStatusText(doc.status) }}
                  </span>
                </td>
                <td class="px-4 py-4 text-gray-500">{{ formatDate(doc.created_at) }}</td>
                <td class="px-4 py-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    @click="goToDetail(doc.id)"
                    :disabled="!(doc.status === 'belum_dianotasi' || doc.status === 'sedang_dianotasi')"
                    class="bg-blue-600 hover:bg-blue-700 text-white border-none"
                  >
                    Anotasi
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    :disabled="doc.status !== 'sudah_dianotasi'"
                    @click="handleReopen(doc)"
                    class="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    Reopen
                  </Button>
                </td>
              </tr>
              <tr v-if="filteredDocs.length === 0">
                <td colspan="5" class="py-20 text-center text-gray-400">
                  Tidak ada dokumen ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="totalItems > 0" class="flex justify-center mt-6">
            <UPagination
              v-model:page="page"
              :page-count="pageCount"
              :total="totalItems"
              @update:page="fetchData"
            />
          </div>
        </div>
      </Card>

      <div v-if="showReopenModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-4 text-black">Reopen Dokumen</h3>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Alasan Reopen (opsional)</label>
            <textarea
              v-model="reopenReason"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-black"
              placeholder="Tulis alasan..."
            ></textarea>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <Button variant="outline" @click="closeReopenModal" class="bg-gray-100 text-gray-700">Batal</Button>
            <Button :loading="reopenLoading" @click="submitReopen" class="bg-black text-white">Kirim</Button>
          </div>
          <div v-if="reopenError" class="mt-3 text-red-500 text-sm">{{ reopenError }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Button } from "~/components/ui/button"
import { useUserDocumentsApi } from "~/data/user-documents"
import { useAnnotationsApi } from "~/data/annotations"
import type { DocumentResponse, DocumentStatus } from "~/types/api"

const ANNOTATION_STATUSES: DocumentStatus[] = ["belum_dianotasi", "sedang_dianotasi", "sudah_dianotasi"]

const { getAssignedDocuments } = useUserDocumentsApi()
const { reopenAnnotation } = useAnnotationsApi()

const docs = ref<DocumentResponse[]>([])
const isLoading = ref(false)

const search = ref("")
const filter = ref({ status: "", dateFrom: "", dateTo: "" })
const dateFilterType = ref("")
const sort = ref<{ key: string; dir: "asc" | "desc" }>({ key: "created_at", dir: "desc" })

const page = ref(1)
const pageCount = ref(10)
const totalItems = ref(0)

const stats = computed(() => ({
  annotated: docs.value.filter((doc) => doc.status === "sudah_dianotasi").length,
  total: totalItems.value,
}))

const accuracy = computed(() => {
  if (!totalItems.value) return "0"
  return ((stats.value.annotated / totalItems.value) * 100).toFixed(0)
})

const filteredDocs = computed(() => {
  const base = docs.value.filter((doc) => {
    const matchSearch = !search.value || doc.title.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = !filter.value.status || doc.status === filter.value.status
    const docDate = new Date(doc.created_at)
    let matchDate = true

    if (dateFilterType.value && dateFilterType.value !== "custom") {
      const today = new Date()
      const todayStr = today.toISOString().split("T")[0]
      switch (dateFilterType.value) {
        case "today":
          matchDate = doc.created_at.startsWith(todayStr)
          break
        case "week": {
          const weekAgo = new Date(today)
          weekAgo.setDate(today.getDate() - 7)
          matchDate = docDate >= weekAgo
          break
        }
        case "month": {
          const monthAgo = new Date(today)
          monthAgo.setMonth(today.getMonth() - 1)
          matchDate = docDate >= monthAgo
          break
        }
      }
    } else if (filter.value.dateFrom && filter.value.dateTo) {
      matchDate = docDate >= new Date(filter.value.dateFrom) && docDate <= new Date(filter.value.dateTo)
    }

    return matchSearch && matchStatus && matchDate
  })

  return [...base].sort((a, b) => {
    const dir = sort.value.dir === "asc" ? 1 : -1
    const key = sort.value.key as keyof DocumentResponse
    if (key === "title") return a.title.localeCompare(b.title) * dir
    if (key === "status") return a.status.localeCompare(b.status) * dir
    return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * dir
  })
})

const firstInProgressDoc = computed(() =>
  docs.value.find((doc) => doc.status === "belum_dianotasi" || doc.status === "sedang_dianotasi")
)

function resetFilters() {
  search.value = ""
  filter.value = { status: "", dateFrom: "", dateTo: "" }
  dateFilterType.value = ""
  page.value = 1
  fetchData()
}

function handleDateFilterChange() {
  if (dateFilterType.value !== "custom") {
    filter.value.dateFrom = ""
    filter.value.dateTo = ""
  }
  page.value = 1
  fetchData()
}

watch([search, () => filter.value.status], () => {
  page.value = 1
})

function setSort(key: string) {
  if (sort.value.key === key) {
    sort.value.dir = sort.value.dir === "asc" ? "desc" : "asc"
  } else {
    sort.value.key = key
    sort.value.dir = "asc"
  }
}

function sortIcon(key: string) {
  if (sort.value.key !== key) return "i-heroicons-arrows-up-down"
  return sort.value.dir === "asc" ? "i-heroicons-arrow-up" : "i-heroicons-arrow-down"
}

function goToDetail(id: number) {
  navigateTo(`/anotator/anotasi/${id}`)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID")
}

function getStatusText(status: DocumentStatus) {
  const statusMap: Record<string, string> = {
    belum_dianotasi: "Belum Dianotasi",
    sedang_dianotasi: "Sedang Dianotasi",
    sudah_dianotasi: "Sudah Dianotasi",
  }
  return statusMap[status] || status
}

function getStatusClass(status: DocumentStatus) {
  const classMap: Record<string, string> = {
    belum_dianotasi: "bg-gray-100 text-gray-700",
    sedang_dianotasi: "bg-yellow-50 text-yellow-700",
    sudah_dianotasi: "bg-blue-50 text-blue-700",
  }
  return classMap[status] || "bg-gray-50 text-gray-700"
}

async function fetchData() {
  isLoading.value = true
  try {
    const response = await getAssignedDocuments(page.value)
    docs.value = response?.results?.filter((doc: any) => ANNOTATION_STATUSES.includes(doc.status)) || []
    totalItems.value = response?.count || 0
  } catch (e) {
    docs.value = []
    totalItems.value = 0
  }
  isLoading.value = false
}

onMounted(fetchData)

const showReopenModal = ref(false)
const reopenReason = ref("")
const reopenDocId = ref<number | null>(null)
const reopenLoading = ref(false)
const reopenError = ref("")

function handleReopen(doc: any) {
  reopenDocId.value = doc.id
  reopenReason.value = ""
  reopenError.value = ""
  showReopenModal.value = true
}

function closeReopenModal() {
  showReopenModal.value = false
  reopenDocId.value = null
}

async function submitReopen() {
  if (!reopenDocId.value) return
  reopenLoading.value = true
  try {
    await reopenAnnotation({ document: reopenDocId.value, reason: reopenReason.value })
    closeReopenModal()
    fetchData()
  } catch (e: any) {
    reopenError.value = e?.message || "Gagal melakukan reopen."
  } finally {
    reopenLoading.value = false
  }
}
</script>