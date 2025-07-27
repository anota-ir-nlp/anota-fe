<template>
  <div class="flex flex-col items-center justify-start text-center bg-slate-900 text-white p-8 min-h-screen">
    <h1 class="text-4xl font-bold mb-20 text-blue-400">Kelola Dokumen</h1>

    <!-- Add Document Button -->
    <div class="mb-6 w-full">
      <Dialog v-model:open="isCreateDialogOpen">
        <div class="flex gap-3 items-start w-full max-w-6xl mx-auto">
          <DialogTrigger as-child>
            <Button class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Dokumen Baru
            </Button>
          </DialogTrigger>

          <Button variant="outline" class="flex items-center gap-2" @click="navigateTo('/beranda')">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Kembali ke Beranda
          </Button>
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
              <svg v-if="!isCreating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isCreating ? 'Menambah...' : 'Tambah Dokumen' }}
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
            <svg v-if="!isUpdating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
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
      <h2 class="text-xl font-semibold mb-4 text-blue-300">Daftar Dokumen</h2>
      <div class="rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow class="bg-gray-800/60 hover:bg-gray-800/60">
              <TableHead class="text-gray-300 font-medium text-left">Judul</TableHead>
              <TableHead class="text-gray-300 font-medium text-left">ID</TableHead>
              <TableHead class="text-gray-300 font-medium text-left">Assigned To</TableHead>
              <TableHead class="text-gray-300 font-medium text-left">Tanggal Dibuat</TableHead>
              <TableHead class="text-gray-300 font-medium text-left">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="doc in documents" :key="doc.id" class="border-white/10 hover:bg-white/5">
              <TableCell class="font-semibold text-white text-left">{{ doc.title }}</TableCell>
              <TableCell class="text-white text-left">{{ doc.id }}</TableCell>
              <TableCell class="text-left">
                <div class="flex flex-wrap gap-1">
                  <Badge v-for="userId in doc.assigned_to" :key="userId" variant="blue">
                    User {{ userId }}
                  </Badge>
                  <span v-if="!doc.assigned_to.length" class="text-gray-400 text-sm">Belum ada assignment</span>
                </div>
              </TableCell>
              <TableCell class="text-white text-left">{{ formatDate(doc.created_at) }}</TableCell>
              <TableCell class="text-left">
                <div class="flex gap-2">
                  <Button size="sm" variant="outline" @click="editDocument(doc)"
                    class="rounded-full px-4 py-1 font-semibold">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" @click="deleteDocument(doc.id)"
                    class="rounded-full px-4 py-1 font-semibold">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Hapus
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <div v-if="!documents.length && !isLoading"
      class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg p-6 text-center">
      <span class="text-gray-400">Tidak ada dokumen ditemukan.</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDocumentsApi } from "~/data/documents";
import { navigateTo } from "#app";
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

const { getDocuments, createDocument: apiCreateDocument, deleteDocument: apiDeleteDocument, updateDocument: apiUpdateDocument } = useDocumentsApi();
const toast = useToast();

const documents = ref<DocumentResponse[]>([]);
const isLoading = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);

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

async function fetchDocuments() {
  isLoading.value = true;
  try {
    const response = await getDocuments();
    documents.value = response.results;
  } catch (error) {
    console.error('Error fetching documents:', error);
    toast.add({
      title: "Error",
      description: "Gagal memuat data dokumen",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}

async function createDocument() {
  if (!newDocument.value.title || !newDocument.value.text) {
    toast.add({
      title: "Validasi Error",
      description: "Judul dan teks dokumen harus diisi",
      color: "error",
    });
    return;
  }

  isCreating.value = true;
  try {
    await apiCreateDocument(newDocument.value);
    toast.add({
      title: "Berhasil",
      description: `Dokumen "${newDocument.value.title}" berhasil dibuat`,
      color: "success",
    });
    resetForm();
    isCreateDialogOpen.value = false;
    await fetchDocuments();
  } catch (error) {
    console.error('Error creating document:', error);
    toast.add({
      title: "Error",
      description: "Gagal membuat dokumen baru",
      color: "error",
    });
  } finally {
    isCreating.value = false;
  }
}

async function updateDocument() {
  if (!editingDocument.value.id || !editingDocument.value.title || !editingDocument.value.text) {
    toast.add({
      title: "Validasi Error",
      description: "Judul dan teks dokumen harus diisi",
      color: "error",
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
    toast.add({
      title: "Berhasil",
      description: `Dokumen "${editingDocument.value.title}" berhasil diupdate`,
      color: "success",
    });
    isEditDialogOpen.value = false;
    await fetchDocuments();
  } catch (error) {
    console.error('Error updating document:', error);
    toast.add({
      title: "Error",
      description: "Gagal mengupdate dokumen",
      color: "error",
    });
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
    toast.add({
      title: "Berhasil",
      description: "Dokumen berhasil dihapus",
      color: "success",
    });
    await fetchDocuments();
  } catch (error) {
    console.error('Error deleting document:', error);
    toast.add({
      title: "Error",
      description: "Gagal menghapus dokumen",
      color: "error",
    });
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

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID');
}

onMounted(fetchDocuments);

useHead({
  title: "Kelola Dokumen - ANOTA",
  meta: [
    { name: "description", content: "Halaman kelola dokumen aplikasi ANOTA." },
  ],
});
</script>
