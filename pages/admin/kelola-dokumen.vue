<template>
  <div class="flex flex-col items-center justify-start text-center bg-slate-900 text-white p-8 min-h-screen">
    <h1 class="text-4xl font-bold mb-20 text-blue-400">Kelola Dokumen</h1>

    <!-- Add Document Button -->
    <div class="mb-6 w-full flex gap-3 max-w-6xl mx-auto">
      <Dialog v-model:open="isCreateDialogOpen">
        <div class="flex gap-3 items-start">
          <DialogTrigger as-child>
            <Button class="flex items-center gap-2">
              <Plus class="w-4 h-4" />
              Tambah Dokumen Baru
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent class="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Dokumen Baru</DialogTitle>
            <DialogDescription>
              Masukkan judul dan teks dokumen. Teks akan otomatis dipecah menjadi kalimat-kalimat.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <label for="title" class="text-sm font-medium text-left">Judul Dokumen</label>
              <Input id="title" v-model="newDocument.title" placeholder="Judul dokumen" class="w-full" />
            </div>
            <div class="grid gap-2">
              <label for="text" class="text-sm font-medium text-left">Teks Dokumen</label>
              <Textarea id="text" v-model="newDocument.text" placeholder="Masukkan teks dokumen..."
                class="w-full min-h-32" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="resetForm">
              Reset
            </Button>
            <Button @click="createDocument" :disabled="isCreating" class="flex items-center gap-2">
              <Plus v-if="!isCreating" class="w-4 h-4" />
              <Loader2 v-else class="w-4 h-4 animate-spin" />
              {{ isCreating ? 'Menambah...' : 'Tambah Dokumen' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <!-- Bulk Upload CSV Button & Dialog -->
      <Dialog v-model:open="isBulkDialogOpen">
        <div class="flex gap-3 items-start">
          <DialogTrigger as-child>
            <Button variant="outline" class="flex items-center gap-2">
              <Upload class="w-4 h-4" />
              Upload CSV Dokumen
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent class="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Bulk Upload Dokumen via CSV</DialogTitle>
            <DialogDescription>
              Upload file CSV dengan kolom <b>title</b> dan <b>text</b>. Setiap baris akan menjadi dokumen baru.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <Input
              type="file"
              accept=".csv"
              @change="handleCsvFile"
              class="mb-2"
            />
            <div v-if="csvPreview.length" class="font-semibold">
              Total {{ csvPreview.length }} dokumen
            </div>
            <div v-if="csvPreview.length" class="bg-slate-800 rounded p-2 text-sm mb-2">
              <div class="w-full max-w-2xl mx-auto">
                <Table class="w-full text-left border-collapse table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead class="px-3 py-2 border-b border-slate-700 text-blue-300 font-semibold w-1/4">Judul</TableHead>
                      <TableHead class="px-3 py-2 border-b border-slate-700 text-gray-400 font-semibold w-3/4">Teks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="(row, idx) in csvPreview.slice(0, 5)" :key="idx">
                      <TableCell
                        class="px-3 py-2 border-b border-slate-700 align-top truncate whitespace-nowrap overflow-hidden"
                        :title="row.title">{{ row.title }}</TableCell>
                      <TableCell
                        class="px-3 py-2 border-b border-slate-700 text-gray-400 align-top truncate whitespace-nowrap overflow-hidden"
                        :title="row.text">{{ row.text }}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            <div v-if="csvError" class="text-red-400 text-sm">{{ csvError }}</div>
            <Progress v-if="isBulkUploading" :model-value="bulkProgress" class="mt-2" />
          </div>
          <DialogFooter>
            <Button variant="outline" @click="resetBulkForm">
              Reset
            </Button>
            <Button @click="bulkCreateDocuments" :disabled="isBulkUploading || !csvPreview.length"
              class="flex items-center gap-2">
              <Upload v-if="!isBulkUploading" class="w-4 h-4" />
              <Loader2 v-else class="w-4 h-4 animate-spin" />
              {{ isBulkUploading ? 'Mengupload...' : 'Upload CSV' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Edit Document Dialog -->
    <Dialog v-model:open="isEditDialogOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Dokumen</DialogTitle>
          <DialogDescription>
            Update informasi dokumen. Mengubah teks akan me-regenerate semua kalimat.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <label for="edit_title" class="text-sm font-medium text-left">Judul Dokumen</label>
            <Input id="edit_title" v-model="editingDocument.title" placeholder="Judul dokumen" class="w-full" />
          </div>
          <div class="grid gap-2">
            <label for="edit_text" class="text-sm font-medium text-left">Teks Dokumen</label>
            <Textarea id="edit_text" v-model="editingDocument.text" placeholder="Masukkan teks dokumen..."
              class="w-full min-h-32" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="cancelEdit">
            Batal
          </Button>
          <Button @click="updateDocument" :disabled="isUpdating" class="flex items-center gap-2">
            <Check v-if="!isUpdating" class="w-4 h-4" />
            <Loader2 v-else class="w-4 h-4 animate-spin" />
            {{ isUpdating ? 'Mengupdate...' : 'Update Dokumen' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <div v-if="isLoading" class="text-gray-300 mb-4">
      Memuat data dokumen...
    </div>

    <div v-if="documents.length"
      class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg p-6 mb-6 w-full max-w-6xl">
      <div class="rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow class="bg-gray-800/60 hover:bg-gray-800/60">
              <TableHead class="text-gray-300 font-medium text-left w-96 truncate">Judul</TableHead>
              <TableHead class="text-gray-300 font-medium text-left">Assigned To</TableHead>
              <TableHead class="text-gray-300 font-medium text-left">Tanggal Dibuat</TableHead>
              <TableHead class="text-gray-300 font-medium text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="doc in documents" :key="doc.id" class="border-white/10 hover:bg-white/5">
              <TableCell class="font-semibold text-white text-left w-96 truncate">
                <span class="block truncate">{{ doc.title }}</span>
              </TableCell>
              <TableCell class="text-left">
                <div class="flex flex-wrap gap-1">
                  <Badge v-for="userId in doc.assigned_to" :key="userId" variant="blue">
                    User {{ userId }}
                  </Badge>
                  <span v-if="!doc.assigned_to.length" class="text-gray-400 text-sm">Belum ada assignment</span>
                </div>
              </TableCell>
              <TableCell class="text-white text-left">{{ formatDate(doc.created_at) }}</TableCell>
              <TableCell class="text-right">
                <div class="flex gap-2 w-full justify-end">
                  <Button size="sm" variant="outline" @click="editDocument(doc)"
                    class="rounded-full px-4 py-1 font-semibold">
                    <Pencil class="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" @click="deleteDocument(doc.id)"
                    class="rounded-full px-4 py-1 font-semibold">
                    <Trash2 class="w-4 h-4 mr-1" />
                    Hapus
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
    <!-- Pagination Controls: moved outside the card -->
    <div v-if="documents.length" class="mt-4 flex justify-center w-full max-w-6xl">
      <Pagination :page="currentPage" :total="totalPages" :items-per-page="documents.length > 0 ? documents.length : 1"
        @update:page="fetchDocuments">
        <PaginationContent>
          <PaginationPrevious :disabled="currentPage === 1" @click="fetchDocuments(currentPage - 1)">
            <ArrowLeft class="w-4 h-4" />
          </PaginationPrevious>
          <template v-for="(page, idx) in paginationPages" :key="idx">
            <PaginationItem v-if="typeof page === 'number'" :value="page" :is-active="page === currentPage"
              @click="fetchDocuments(page)">{{ page }}</PaginationItem>
            <PaginationEllipsis v-else>
              <MoreHorizontal class="w-4 h-4" />
            </PaginationEllipsis>
          </template>
          <PaginationNext :disabled="currentPage === totalPages" @click="fetchDocuments(currentPage + 1)">
            <ArrowRight class="w-4 h-4" />
          </PaginationNext>
        </PaginationContent>
      </Pagination>
    </div>

    <div v-if="!documents.length && !isLoading"
      class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg p-6 w-full max-w-6xl text-center">
      <span class="text-gray-400">Tidak ada dokumen ditemukan.</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useDocumentsApi } from "~/data/documents";
import type { DocumentResponse, DocumentRequest } from "~/types/api";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "~/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from "~/components/ui/pagination";
import Papa from "papaparse";
import {
  Plus, Upload, Loader2, Check, Pencil, Trash2, ArrowLeft, ArrowRight, MoreHorizontal
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import { Progress } from "~/components/ui/progress";

const { getDocuments, createDocument: apiCreateDocument, deleteDocument: apiDeleteDocument, updateDocument: apiUpdateDocument } = useDocumentsApi();

const documents = ref<DocumentResponse[]>([]);
const isLoading = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const isBulkDialogOpen = ref(false);
const isBulkUploading = ref(false);

const newDocument = ref<DocumentRequest>({
  title: "",
  text: "",
});

const editingDocument = ref<{
  id?: number;
  title: string;
  text: string;
}>({
  title: "",
  text: "",
});

const csvPreview = ref<DocumentRequest[]>([]);
const csvError = ref("");
const bulkProgress = ref(0);

const currentPage = ref(1);
const totalPages = ref(1);

async function fetchDocuments(page = 1) {
  isLoading.value = true;
  try {
    const response = await getDocuments(page);
    documents.value = response.results;
    currentPage.value = page;
    totalPages.value = Math.max(1, Math.ceil(response.count / 20));
    console.log(response)
  } catch (error) {
    console.error('Error fetching documents:', error);
    toast.error("Gagal memuat data dokumen");
  } finally {
    isLoading.value = false;
  }
}

async function createDocument() {
  if (!newDocument.value.title || !newDocument.value.text) {
    toast.message("Validasi Error", {
      description: "Judul dan teks dokumen harus diisi",
    });
    return;
  }

  isCreating.value = true;
  try {
    await apiCreateDocument(newDocument.value);
    toast.success(`Dokumen "${newDocument.value.title}" berhasil dibuat`);
    resetForm();
    isCreateDialogOpen.value = false;
    await fetchDocuments(currentPage.value);
  } catch (error) {
    console.error('Error creating document:', error);
    toast.error("Gagal membuat dokumen baru");
  } finally {
    isCreating.value = false;
  }
}

async function updateDocument() {
  if (!editingDocument.value.id || !editingDocument.value.title || !editingDocument.value.text) {
    toast.message("Validasi Error", {
      description: "Judul dan teks dokumen harus diisi",
    });
    return;
  }

  isUpdating.value = true;
  try {
    const updateData = {
      title: editingDocument.value.title,
      text: editingDocument.value.text,
    };

    await apiUpdateDocument(editingDocument.value.id, updateData);
    toast.success(`Dokumen "${editingDocument.value.title}" berhasil diupdate`);
    isEditDialogOpen.value = false;
    await fetchDocuments(currentPage.value);
  } catch (error) {
    console.error('Error updating document:', error);
    toast.error("Gagal mengupdate dokumen");
  } finally {
    isUpdating.value = false;
  }
}

async function deleteDocument(id: number) {
  if (!confirm('Apakah Anda yakin ingin menghapus dokumen ini? Semua annotations yang terkait akan ikut terhapus.')) {
    return;
  }

  try {
    await apiDeleteDocument(id);
    toast.success("Dokumen berhasil dihapus");
    await fetchDocuments(currentPage.value);
  } catch (error) {
    console.error('Error deleting document:', error);
    toast.error("Gagal menghapus dokumen");
  }
}

function editDocument(doc: DocumentResponse) {
  editingDocument.value = {
    id: doc.id,
    title: doc.title,
    text: doc.text,
  };
  isEditDialogOpen.value = true;
}

function cancelEdit() {
  editingDocument.value = {
    title: "",
    text: "",
  };
  isEditDialogOpen.value = false;
}

function resetForm() {
  newDocument.value = {
    title: "",
    text: "",
  };
}

function handleCsvFile(e: Event) {
  csvError.value = "";
  csvPreview.value = [];
  const files = (e.target as HTMLInputElement).files;
  if (!files || !files[0]) return;
  const file = files[0];
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      if (!results.data || !Array.isArray(results.data)) {
        csvError.value = "Format CSV tidak valid.";
        return;
      }

      const docs: DocumentRequest[] = [];
      for (const row of results.data as any[]) {
        if (row.title && row.text) {
          docs.push({ title: row.title, text: row.text });
        }
      }
      if (!docs.length) {
        csvError.value = "Tidak ada baris valid ditemukan (pastikan kolom 'title' dan 'text' ada).";
      }
      csvPreview.value = docs;
    },
    error: (err) => {
      csvError.value = "Gagal membaca file CSV: " + err.message;
    }
  });
}

function resetBulkForm() {
  csvPreview.value = [];
  csvError.value = "";
  isBulkDialogOpen.value = false;
}

async function bulkCreateDocuments() {
  if (!csvPreview.value.length) return;
  isBulkUploading.value = true;
  bulkProgress.value = 0;
  let successCount = 0;
  let failCount = 0;
  const total = csvPreview.value.length;
  for (const [idx, doc] of csvPreview.value.entries()) {
    try {
      await apiCreateDocument(doc);
      successCount++;
    } catch (error) {
      failCount++;
    }
    bulkProgress.value = Math.round(((idx + 1) / total) * 100);
  }
  toast.warning("Bulk Upload Selesai", {
    description: `Berhasil: ${successCount}, Gagal: ${failCount}`,
  });
  resetBulkForm();
  await fetchDocuments(currentPage.value);
  isBulkUploading.value = false;
  bulkProgress.value = 0;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID');
}

const paginationPages = computed(() => {
  const pages: (number | string)[] = [];
  if (totalPages.value <= 5) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i);
  } else if (currentPage.value <= 3) {
    pages.push(1, 2, 3, 4, 5, 'ellipsis', totalPages.value);
  } else if (currentPage.value >= totalPages.value - 2) {
    pages.push(1, 'ellipsis');
    for (let i = totalPages.value - 4; i <= totalPages.value; i++) pages.push(i);
  } else {
    pages.push(1, 'ellipsis', currentPage.value - 1, currentPage.value, currentPage.value + 1, 'ellipsis', totalPages.value);
  }
  return pages;
});

onMounted(() => fetchDocuments(currentPage.value));

useHead({
  title: "Kelola Dokumen - ANOTA",
  meta: [
    { name: "description", content: "Halaman kelola dokumen aplikasi ANOTA." },
  ],
});
</script>