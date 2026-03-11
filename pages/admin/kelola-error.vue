<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter bg-gray-50">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Kelola Error Types</h1>
        <p class="text-gray-600">
          Buat dan kelola jenis error untuk proses anotasi
        </p>
      </div>

      <!-- Add Error Type Button -->
      <div class="mb-6">
        <Dialog v-model:open="isCreateDialogOpen">
          <div class="flex gap-3 items-start">
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
              {{ selectedProject ? `Error type akan dibuat untuk project "${selectedProject.name}".` : 'Error type akan dibuat sebagai default (tersedia untuk semua project).' }}
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <label for="error_code" class="text-sm font-medium text-gray-700 mb-2">Error Code</label>
              <Input id="error_code" v-model="newErrorType.error_code" placeholder="Kode error (ex: GRAMMAR_ERROR)" class="w-full" />
            </div>
            <div class="grid gap-2">
              <label for="description" class="text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
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
            <label for="edit_error_code" class="text-sm font-medium text-gray-700 mb-2">Error Code</label>
            <Input id="edit_error_code" v-model="editingErrorType.error_code" placeholder="Kode error" class="w-full" />
          </div>
          <div class="grid gap-2">
            <label for="edit_description" class="text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
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

      <div v-if="isLoading" class="text-gray-600 mb-4">
        Memuat data error types...
      </div>

      <div v-if="errorTypes && errorTypes.length > 0"
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <DataTable
          :columns="errorTypeColumns"
          :data="errorTypes"
          @selection-change="handleSelectionChange"
          @edit-error-type="editErrorType"
          @delete-error-type="deleteErrorType"
        />
      </div>

      <!-- Pagination Controls -->
      <div v-if="errorTypes && errorTypes.length > 0 && totalPages > 1" class="mt-4 flex justify-center">
      <Pagination
        :page="currentPage"
        :total="totalPages"
        :items-per-page="Math.max(errorTypes?.length || 1, 1)"
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

      <div v-if="(!errorTypes || errorTypes.length === 0) && !isLoading"
        class="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <span class="text-gray-500">Tidak ada error type ditemukan.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useErrorTypesApi } from "~/data/error-types";
import { useProjectContext } from "~/composables/project-context";
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
import DataTable from "~/components/ui/data-table/data-table.vue";
import { createErrorTypeColumns } from "~/components/error-types/columns";

const {
  getErrorTypes,
  createErrorType: apiCreateErrorType,
  updateErrorType: apiUpdateErrorType,
  deleteErrorType: apiDeleteErrorType,
} = useErrorTypesApi();

const { selectedProject, selectedProjectId, isAllProjects } = useProjectContext();

const errorTypes = ref<ErrorTypeResponse[]>([]);
const selectedErrorTypes = ref<ErrorTypeResponse[]>([]);
const isLoading = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);

const newErrorType = ref<ErrorTypeRequest>({
  error_code: "",
  description: "",
});

const editingErrorType = ref<Partial<ErrorTypeResponse>>({
  error_code: "",
  description: "",
});

const currentPage = ref(1);
const totalPages = ref(1);

async function fetchErrorTypes(page = 1) {
  isLoading.value = true;
  try {
    const projectId = isAllProjects.value ? undefined : selectedProjectId.value;
    const response = await getErrorTypes(page, projectId || undefined);

    if (Array.isArray(response)) {
      errorTypes.value = response || [];
      totalPages.value = 1;
      currentPage.value = 1;
    } else {
      errorTypes.value = response?.results || [];
      currentPage.value = page;
      totalPages.value = Math.max(1, Math.ceil((response?.count || 0) / 20));
    }
  } catch (error) {
    console.error('Error fetching error types:', error);
    toast.error("Gagal memuat data error types");
    errorTypes.value = [];
    totalPages.value = 1;
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
    const createData = {
      ...newErrorType.value,
      project_id: isAllProjects.value ? undefined : selectedProjectId.value,
    };

    await apiCreateErrorType(createData);
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
  const total = totalPages.value || 1;
  const current = currentPage.value || 1;
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else if (current <= 3) {
    pages.push(1, 2, 3, 4, 5, 'ellipsis', total);
  } else if (current >= total - 2) {
    pages.push(1, 'ellipsis');
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    pages.push(1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total);
  }
  return pages;
});

const errorTypeColumns = computed(() => createErrorTypeColumns(
  (errorType: ErrorTypeResponse) => editErrorType(errorType),
  (id: number) => deleteErrorType(id)
));

function handleSelectionChange(selection: ErrorTypeResponse[]) {
  selectedErrorTypes.value = selection || [];
}

watch(selectedProjectId, async () => {
  await fetchErrorTypes(1);
}, { immediate: false });

onMounted(() => fetchErrorTypes(currentPage.value));

const pageTitle = computed(() => {
  if (selectedProject.value) {
    return `Kelola Error Types - ${selectedProject.value.name}`;
  }
  return "Kelola Error Types - Semua Project";
});

useHead({
  title: pageTitle.value + " - ANOTA",
  meta: [
    { name: "description", content: "Halaman kelola error types aplikasi ANOTA." },
  ],
});
</script>

