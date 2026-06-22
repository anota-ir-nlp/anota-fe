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
            @success="fetchDocuments"
          />
          <DocumentBulkUploadDialog
            v-model:open="isBulkDialogOpen"
            :project-id="selectedProjectId"
            @success="fetchDocuments"
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
          @success="fetchDocuments"
        />

        <div v-if="isLoading" class="text-gray-600 mb-4">
          Memuat data dokumen...
        </div>

        <div v-if="documents.length" class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
          <DataTable
            :columns="documentColumns"
            :data="paginatedDocuments"
            @selection-change="handleSelectionChange"
            @delete-document="handleDeleteDocument"
          />
          
          <div v-if="totalItems > 0" class="flex justify-center mt-6">
            <UPagination
              v-model:page="currentPage"
              :page-count="itemsPerPage"
              :total="totalItems"
            />
          </div>
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
import { UserPlus } from "lucide-vue-next";
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
const itemsPerPage = ref(20);

const isCreateDialogOpen = ref(false);
const isBulkDialogOpen = ref(false);
const isAssignmentDialogOpen = ref(false);
const isReopenDialogOpen = ref(false);
const documentToReopen = ref<DocumentResponse | null>(null);

const totalItems = computed(() => documents.value.length);

const paginatedDocuments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return documents.value.slice(start, end);
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
      fetchDocuments();
    })
    .catch((error: any) => {
      toast.error("Gagal menghapus dokumen");
    });
}

function handleReopenDocument(document: DocumentResponse) {
  documentToReopen.value = document;
  isReopenDialogOpen.value = true;
}

function handleAssignmentSuccess() {
  selectedDocuments.value = [];
  fetchDocuments();
}

async function fetchDocuments() {
  isLoading.value = true;
  try {
    if (!selectedProjectId.value) {
      documents.value = [];
      return;
    }
    const projectDocuments = await getDocumentsInProject(selectedProjectId.value);
    documents.value = projectDocuments || [];
    currentPage.value = 1;
  } catch (error) {
    toast.error("Gagal memuat data dokumen");
    documents.value = [];
  } finally {
    isLoading.value = false;
  }
}

async function fetchUsers() {
  try {
    if (selectedProjectId.value) {
      const response = await getAllUsersInProject(selectedProjectId.value);
      if (Array.isArray(response)) {
        users.value = response;
      } else if (response && Array.isArray((response as any).results)) {
        users.value = (response as any).results;
      } else {
        users.value = [];
      }
    } else {
      users.value = [];
      toast.error("Pilih project terlebih dahulu untuk melihat pengguna");
    }
  } catch (error) {
    users.value = [];
    toast.error("Gagal memuat daftar user");
  }
}

onMounted(async () => {
  await fetchUsers();
  if (selectedProjectId.value) {
    await fetchDocuments();
  }
});

watch(
  selectedProjectId,
  async () => {
    if (selectedProjectId.value) {
      await fetchUsers();
      await fetchDocuments();
    } else {
      documents.value = [];
      users.value = [];
      currentPage.value = 1;
    }
  },
  { immediate: false }
);

watch(currentPage, () => {
  selectedDocuments.value = [];
});
</script>