<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter bg-gray-50">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Kelola Dokumen</h1>
        <p class="text-gray-600">Upload dan kelola dokumen untuk proses anotasi dan review</p>
      </div>

      <div v-if="!selectedProject" class="mb-6">
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <h3 class="text-yellow-800 font-semibold mb-2">Project Belum Dipilih</h3>
          <p class="text-yellow-700">
            Silakan pilih project terlebih dahulu dari dropdown di header untuk mengelola dokumen.
          </p>
        </div>
      </div>

      <template v-if="selectedProject">
        <div class="mb-6 flex gap-3">
          <DocumentSingleUploadDialog
            v-model:open="isCreateDialogOpen"
            :project-id="selectedProjectId"
            @success="fetchDocuments(currentPage)"
          />
          <DocumentBulkUploadDialog
            v-model:open="isBulkDialogOpen"
            :project-id="selectedProjectId"
            @success="fetchDocuments(currentPage)"
          />
        </div>

        <div v-if="selectedDocuments.length > 0 && isAdmin" class="mb-6 flex gap-2 justify-end">
          <Button variant="outline" class="flex items-center gap-2" @click="isAssignmentDialogOpen = true">
            <UserPlus class="w-4 h-4" />
            Kelola Assignment ({{ selectedDocuments.length }})
          </Button>
        </div>

        <DocumentAssignmentDialog
          v-model:open="isAssignmentDialogOpen"
          :selected-documents="selectedDocuments"
          :users="users"
          @success="handleAssignmentSuccess"
        />

        <DocumentReopenDialog
          v-model:open="isReopenDialogOpen"
          :document="documentToReopen"
          :users="users"
          :project-id="selectedProjectId"
          @success="fetchDocuments(currentPage)"
        />

        <div v-if="isLoading" class="text-gray-600 mb-4">
          Memuat data dokumen...
        </div>

        <div v-if="documents.length" class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
          <DataTable
            :columns="documentColumns"
            :data="documents"
            @selection-change="handleSelectionChange"
            @delete-document="handleDeleteDocument"
          />
        </div>

        <div v-if="documents.length && totalPages > 1" class="mt-4 flex justify-center">
          <Pagination :page="currentPage" :total="totalPages" :items-per-page="documents.length > 0 ? documents.length : 1" @update:page="fetchDocuments">
            <PaginationContent>
              <PaginationPrevious :disabled="currentPage === 1" @click="fetchDocuments(currentPage - 1)">
                <ArrowLeft class="w-4 h-4" />
              </PaginationPrevious>
              <template v-for="(page, idx) in paginationPages" :key="idx">
                <PaginationItem v-if="typeof page === 'number'" :value="page" :is-active="page === currentPage" @click="fetchDocuments(page)">
                  {{ page }}
                </PaginationItem>
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

        <div v-if="!documents.length && !isLoading" class="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <span class="text-gray-500">Tidak ada dokumen ditemukan.</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "~/data/auth";
import { useDocumentsApi } from "~/data/documents";
import { useUsersApi } from "~/data/users";
import { useProjectsApi } from "~/data/projects";
import { useProjectContext } from "~/composables/project-context";
import type { DocumentResponse, UserResponse } from "~/types/api";

import { Button } from "~/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationEllipsis } from "~/components/ui/pagination";
import { ArrowLeft, ArrowRight, MoreHorizontal, UserPlus } from "lucide-vue-next";
import { toast } from "vue-sonner";
import DataTable from "~/components/ui/data-table/data-table.vue";
import { createColumns } from "~/components/documents/columns";

const { deleteDocument: apiDeleteDocument } = useDocumentsApi();
const { getDocumentsInProject } = useProjectsApi();
const { getAllUsersInProject } = useUsersApi();
const { selectedProject, selectedProjectId } = useProjectContext();
const { userRoles } = useAuth();

const isAdmin = computed(() => userRoles.value.includes("Admin"));

const documents = ref<DocumentResponse[]>([]);
const users = ref<UserResponse[]>([]);
const selectedDocuments = ref<DocumentResponse[]>([]);
const isLoading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

const isCreateDialogOpen = ref(false);
const isBulkDialogOpen = ref(false);
const isAssignmentDialogOpen = ref(false);
const isReopenDialogOpen = ref(false);
const documentToReopen = ref<DocumentResponse | null>(null);

const paginationPages = computed(() => {
  const pages: (number | string)[] = [];
  const total = totalPages.value || 1;
  const current = currentPage.value || 1;

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else if (current <= 3) {
    pages.push(1, 2, 3, 4, 5, "ellipsis", total);
  } else if (current >= total - 2) {
    pages.push(1, "ellipsis");
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    pages.push(1, "ellipsis", current - 1, current, current + 1, "ellipsis", total);
  }
  return pages;
});

const documentColumns = computed(() => createColumns(getUserName, getUserFullNameFromUsername, handleDeleteDocument, handleReopenDocument));

function getUserName(userId: string) {
  const user = users.value.find((u: UserResponse) => u.id === userId);
  return user ? user.full_name : "Unknown User";
}

function getUserFullNameFromUsername(username: string) {
  const user = users.value.find((u: UserResponse) => u.username === username);
  return user ? user.full_name : username;
}

function handleSelectionChange(selection: DocumentResponse[]) {
  selectedDocuments.value = selection;
}

function handleDeleteDocument(documentId: string) {
  const numericId = parseInt(documentId);
  if (!confirm("Apakah Anda yakin ingin menghapus dokumen ini? Semua annotations yang terkait akan ikut terhapus.")) {
    return;
  }
  apiDeleteDocument(numericId)
    .then(() => {
      toast.success("Dokumen berhasil dihapus");
      fetchDocuments(currentPage.value);
    })
    .catch((error: any) => {
      console.error("Error deleting document:", error);
      toast.error("Gagal menghapus dokumen");
    });
}

function handleReopenDocument(document: DocumentResponse) {
  documentToReopen.value = document;
  isReopenDialogOpen.value = true;
}

function handleAssignmentSuccess() {
  selectedDocuments.value = [];
  fetchDocuments(currentPage.value);
}

async function fetchDocuments(page = 1) {
  isLoading.value = true;
  try {
    if (!selectedProjectId.value) {
      documents.value = [];
      totalPages.value = 1;
      return;
    }
    const projectDocuments = await getDocumentsInProject(selectedProjectId.value);
    documents.value = projectDocuments || [];
    currentPage.value = 1;
    totalPages.value = 1;
  } catch (error) {
    console.error("Error fetching documents:", error);
    toast.error("Gagal memuat data dokumen");
    documents.value = [];
    totalPages.value = 1;
  } finally {
    isLoading.value = false;
  }
}

async function fetchUsers() {
  try {
    if (selectedProjectId.value) {
      const response = await getAllUsersInProject(selectedProjectId.value);
      users.value = response || [];
    } else {
      users.value = [];
      toast.error("Pilih project terlebih dahulu untuk melihat pengguna");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Gagal memuat daftar user");
  }
}

onMounted(async () => {
  await fetchUsers();
  if (selectedProjectId.value) {
    await fetchDocuments(currentPage.value);
  }
});

watch(
  selectedProjectId,
  async () => {
    if (selectedProjectId.value) {
      await fetchUsers();
      await fetchDocuments(1);
      currentPage.value = 1;
    } else {
      documents.value = [];
      users.value = [];
      totalPages.value = 1;
      currentPage.value = 1;
    }
  },
  { immediate: false }
);

watch(currentPage, () => {
  selectedDocuments.value = [];
});
</script>