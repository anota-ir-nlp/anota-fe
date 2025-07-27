<template>
  <div class="flex flex-col items-center justify-start text-center bg-slate-900 text-white p-8 min-h-screen">
    <h1 class="text-4xl font-bold mb-20 text-blue-400">Kelola Error Types</h1>

    <!-- Add Error Type Button -->
    <div class="mb-6 w-full">
      <Dialog v-model:open="isCreateDialogOpen">
        <div class="flex gap-3 items-start w-full max-w-6xl mx-auto">
          <DialogTrigger as-child>
            <Button class="flex items-center gap-2">
              <Plus class="w-4 h-4" />
              Tambah Error Type Baru
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Error Type Baru</DialogTitle>
            <DialogDescription>
              Masukkan kode error dan deskripsi error type.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <label for="error_code" class="text-sm font-medium text-left">Error Code</label>
              <Input id="error_code" v-model="newErrorType.error_code" placeholder="Kode error (ex: GRAMMAR_ERROR)" class="w-full" />
            </div>
            <div class="grid gap-2">
              <label for="description" class="text-sm font-medium text-left">Deskripsi</label>
              <Input id="description" v-model="newErrorType.description" placeholder="Deskripsi error type" class="w-full" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="resetForm">
              Reset
            </Button>
            <Button @click="createErrorType" :disabled="isCreating" class="flex items-center gap-2">
              <Plus v-if="!isCreating" class="w-4 h-4" />
              <Loader2 v-else class="w-4 h-4 animate-spin" />
              {{ isCreating ? 'Menambah...' : 'Tambah Error Type' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Edit Error Type Dialog -->
    <Dialog v-model:open="isEditDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Error Type</DialogTitle>
          <DialogDescription>
            Update informasi error type yang dipilih.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <label for="edit_error_code" class="text-sm font-medium text-left">Error Code</label>
            <Input id="edit_error_code" v-model="editingErrorType.error_code" placeholder="Kode error" class="w-full" />
          </div>
          <div class="grid gap-2">
            <label for="edit_description" class="text-sm font-medium text-left">Deskripsi</label>
            <Input id="edit_description" v-model="editingErrorType.description" placeholder="Deskripsi error type" class="w-full" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="cancelEdit">
            Batal
          </Button>
          <Button @click="updateErrorType" :disabled="isUpdating" class="flex items-center gap-2">
            <Check v-if="!isUpdating" class="w-4 h-4" />
            <Loader2 v-else class="w-4 h-4 animate-spin" />
            {{ isUpdating ? 'Mengupdate...' : 'Update Error Type' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <div v-if="isLoading" class="text-gray-300 mb-4">
      Memuat data error types...
    </div>

    <div v-if="errorTypes.length"
      class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg p-6 mb-6 w-full max-w-6xl">
      <div class="rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow class="bg-gray-800/60 hover:bg-gray-800/60">
              <TableHead class="text-gray-300 font-medium text-left w-64 truncate">Error Code</TableHead>
              <TableHead class="text-gray-300 font-medium text-left">Deskripsi</TableHead>
              <TableHead class="text-gray-300 font-medium text-left">Tanggal Dibuat</TableHead>
              <TableHead class="text-gray-300 font-medium text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="err in errorTypes" :key="err.id" class="border-white/10 hover:bg-white/5">
              <TableCell class="font-semibold text-white text-left w-64 truncate">
                <span class="block truncate">{{ err.error_code }}</span>
              </TableCell>
              <TableCell class="text-left text-gray-200">{{ err.description }}</TableCell>
              <TableCell class="text-white text-left">{{ formatDate(err.created_at) }}</TableCell>
              <TableCell class="text-right">
                <div class="flex gap-2 w-full justify-end">
                  <Button size="sm" variant="outline" @click="editErrorType(err)"
                    class="rounded-full px-4 py-1 font-semibold">
                    <Pencil class="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" @click="deleteErrorType(err.id)"
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

    <!-- Pagination Controls -->
    <div v-if="errorTypes.length" class="mt-4 flex justify-center w-full max-w-6xl">
      <Pagination
        :page="currentPage"
        :total="totalPages"
        :items-per-page="errorTypes.length > 0 ? errorTypes.length : 1"
        @update:page="fetchErrorTypes"
      >
        <PaginationContent>
          <PaginationPrevious :disabled="currentPage === 1" @click="fetchErrorTypes(currentPage - 1)">
            <ArrowLeft class="w-4 h-4" />
          </PaginationPrevious>
          <template v-for="(page, idx) in paginationPages" :key="idx">
            <PaginationItem
              v-if="typeof page === 'number'"
              :value="page"
              :is-active="page === currentPage"
              @click="fetchErrorTypes(page)"
            >{{ page }}</PaginationItem>
            <PaginationEllipsis v-else>
              <MoreHorizontal class="w-4 h-4" />
            </PaginationEllipsis>
          </template>
          <PaginationNext :disabled="currentPage === totalPages" @click="fetchErrorTypes(currentPage + 1)">
            <ArrowRight class="w-4 h-4" />
          </PaginationNext>
        </PaginationContent>
      </Pagination>
    </div>

    <div v-if="!errorTypes.length && !isLoading"
      class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg p-6 text-center w-full max-w-6xl mx-auto">
      <span class="text-gray-400">Tidak ada error type ditemukan.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useErrorTypesApi } from "~/data/error-types";
import type { ErrorTypeRequest, ErrorTypeResponse } from "~/types/api";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
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
import { 
  Plus, Loader2, Check, Pencil, Trash2, ArrowLeft, ArrowRight, MoreHorizontal 
} from "lucide-vue-next";
import { toast } from "vue-sonner";

const {
  getErrorTypes,
  createErrorType: apiCreateErrorType,
  updateErrorType: apiUpdateErrorType,
  deleteErrorType: apiDeleteErrorType,
} = useErrorTypesApi();

const errorTypes = ref<ErrorTypeResponse[]>([]);
const isLoading = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);

const newErrorType = ref<ErrorTypeRequest>({
  error_code: "",
  description: "",
});

const editingErrorType = ref<{
  id?: number;
  error_code: string;
  description: string;
}>({
  error_code: "",
  description: "",
});

const currentPage = ref(1);
const totalPages = ref(1);

async function fetchErrorTypes(page = 1) {
  isLoading.value = true;
  try {
    // getErrorTypes should support pagination if backend supports it, otherwise fetch all
    const response = await getErrorTypes(page);
    // If paginated, response.results; else, response is array
    if (Array.isArray(response)) {
      errorTypes.value = response;
      totalPages.value = 1;
      currentPage.value = 1;
    } else {
      errorTypes.value = response.results;
      currentPage.value = page;
      totalPages.value = Math.max(1, Math.ceil(response.count / 20));
    }
  } catch (error) {
    console.error('Error fetching error types:', error);
    toast.error("Gagal memuat data error types");
  } finally {
    isLoading.value = false;
  }
}

async function createErrorType() {
  if (!newErrorType.value.error_code || !newErrorType.value.description) {
    toast.message("Validasi Error", {
      description: "Error code dan deskripsi harus diisi",
    });
    return;
  }

  isCreating.value = true;
  try {
    await apiCreateErrorType(newErrorType.value);
    toast.success(`Error type "${newErrorType.value.error_code}" berhasil dibuat`);
    resetForm();
    isCreateDialogOpen.value = false;
    await fetchErrorTypes(currentPage.value);
  } catch (error) {
    console.error('Error creating error type:', error);
    toast.error("Gagal membuat error type baru");
  } finally {
    isCreating.value = false;
  }
}

async function updateErrorType() {
  if (!editingErrorType.value.id || !editingErrorType.value.error_code || !editingErrorType.value.description) {
    toast.message("Validasi Error", {
      description: "Error code dan deskripsi harus diisi",
    });
    return;
  }

  isUpdating.value = true;
  try {
    const updateData = {
      error_code: editingErrorType.value.error_code,
      description: editingErrorType.value.description,
    };

    await apiUpdateErrorType(editingErrorType.value.id, updateData);
    toast.success(`Error type "${editingErrorType.value.error_code}" berhasil diupdate`);
    isEditDialogOpen.value = false;
    await fetchErrorTypes(currentPage.value);
  } catch (error) {
    console.error('Error updating error type:', error);
    toast.error("Gagal mengupdate error type");
  } finally {
    isUpdating.value = false;
  }
}

async function deleteErrorType(id: number) {
  if (!confirm('Apakah Anda yakin ingin menghapus error type ini? Semua annotations yang terkait akan ikut terpengaruh.')) {
    return;
  }

  try {
    await apiDeleteErrorType(id);
    toast.success("Error type berhasil dihapus");
    await fetchErrorTypes(currentPage.value);
  } catch (error) {
    console.error('Error deleting error type:', error);
    toast.error("Gagal menghapus error type");
  }
}

function editErrorType(err: ErrorTypeResponse) {
  editingErrorType.value = {
    id: err.id,
    error_code: err.error_code,
    description: err.description,
  };
  isEditDialogOpen.value = true;
}

function cancelEdit() {
  editingErrorType.value = {
    error_code: "",
    description: "",
  };
  isEditDialogOpen.value = false;
}

function resetForm() {
  newErrorType.value = {
    error_code: "",
    description: "",
  };
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

onMounted(() => fetchErrorTypes(currentPage.value));

useHead({
  title: "Kelola Error Types - ANOTA",
  meta: [
    { name: "description", content: "Halaman kelola error types aplikasi ANOTA." },
  ],
});
</script>
