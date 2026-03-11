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
          <p class="text-yellow-700">Silakan pilih project terlebih dahulu dari dropdown di header.</p>
        </div>
      </div>

      <template v-if="selectedProject">
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex gap-3">
            <Dialog v-model:open="isCreateDialogOpen">
              <DialogTrigger as-child>
                <Button class="flex items-center gap-2"><Plus class="w-4 h-4" /> Upload Dokumen</Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-4xl h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader><DialogTitle>Upload Dokumen</DialogTitle></DialogHeader>
                <div class="flex-1 flex flex-col gap-4 py-4 overflow-hidden">
                  <Input type="file" accept=".txt,.docx" @change="handleSingleFile" class="mb-2" />
                  <div class="grid gap-2">
                    <label class="text-sm font-medium">Institusi (opsional)</label>
                    <Input v-model="documentInstitution" placeholder="Contoh: Universitas Indonesia" />
                  </div>
                  <div v-if="isLoadingPreview" class="flex-1 flex flex-col items-center justify-center">
                    <Loader2 class="w-8 h-8 animate-spin text-blue-600 mb-2" />
                    <div class="text-gray-600">Memproses file...</div>
                  </div>
                  <div v-else-if="singleFilePreview" class="flex-1 flex flex-col overflow-hidden bg-gray-50 p-4 rounded">
                    <div class="font-medium text-lg mb-2">{{ singleFilePreview.title }}</div>
                    <div class="flex-1 bg-white border p-4 overflow-y-auto whitespace-pre-wrap text-sm">{{ singleFilePreview.text }}</div>
                  </div>
                </div>
                <DialogFooter>
                  <Button @click="uploadFiles('single')" :disabled="isUploading || !singleFileConfirmed">
                    <Loader2 v-if="isUploading" class="w-4 h-4 animate-spin mr-2" />
                    Upload
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog v-model:open="isBulkDialogOpen">
              <DialogTrigger as-child>
                <Button variant="outline" class="flex items-center gap-2"><Upload class="w-4 h-4" /> Upload Folder</Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-4xl h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader><DialogTitle>Bulk Upload</DialogTitle></DialogHeader>
                <div class="flex-1 flex flex-col gap-4 py-4 overflow-hidden">
                  <Input type="file" webkitdirectory multiple accept=".txt,.docx" @change="handleBulkFiles" />
                  <div v-if="bulkFilesPreview.length" class="flex-1 overflow-hidden flex flex-col">
                    <div class="flex-1 bg-gray-50 p-4 overflow-y-auto">
                      <div v-for="f in bulkFilesPreview" :key="f.title" class="p-2 border-b flex justify-between">
                        <span>{{ f.title }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button @click="uploadFiles('bulk')" :disabled="isUploading || !confirmedBulkFiles.length">Upload Massal</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div v-if="isAdmin">
            <Button 
              variant="outline" 
              class="flex items-center gap-2" 
              :disabled="selectedDocuments.length === 0" 
              @click="isAssignmentDialogOpen = true"
            >
              <UserPlus class="w-4 h-4" />
              Kelola Assignment Massal ({{ selectedDocuments.length }})
            </Button>
          </div>
        </div>

        <AssignmentDialog
          v-model:open="isAssignmentDialogOpen"
          :selected-documents="selectedDocuments"
          :users="users"
          :is-managing="isManaging"
          @save="handleSaveAssignment"
        />

        <ReopenDialog
          v-model:open="isReopenDialogOpen"
          :document="documentToReopen"
          :users="users"
          :is-reopening="isReopening"
          @submit="handleSubmitReopen"
        />

        <DuplicateWarningDialog
          v-model:open="isDuplicateWarningOpen"
          :pending-request="pendingDocumentRequest"
          :duplicate-error="duplicateError"
          :mode="duplicateHandlingMode"
          @cancel="isDuplicateWarningOpen = false"
          @proceed="proceedWithDuplicate"
        />

        <div v-if="isLoading" class="text-gray-600 mb-4">Memuat data...</div>

        <div v-if="documents.length" class="bg-white border rounded-xl shadow-sm p-6 mb-6">
          <DataTable
            :columns="documentColumns"
            :data="documents"
            @selection-change="handleSelectionChange"
          />
        </div>

        <div v-if="documents.length && totalPages > 1" class="mt-4 flex justify-center">
          <Pagination :page="currentPage" :total="totalPages" :items-per-page="documents.length" @update:page="fetchDocuments">
            <PaginationContent>
              <PaginationPrevious @click="fetchDocuments(currentPage - 1)" :disabled="currentPage === 1" />
              <PaginationNext @click="fetchDocuments(currentPage + 1)" :disabled="currentPage === totalPages" />
            </PaginationContent>
          </Pagination>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { Plus, Upload, Loader2, UserPlus } from "lucide-vue-next";
import { toast } from "vue-sonner";

import AssignmentDialog from "./components/AssignmentDialog.vue";
import ReopenDialog from "./components/ReopenDialog.vue";
import DuplicateWarningDialog from "./components/DuplicateWarningDialog.vue";

import { useAuth } from "~/data/auth";
import { useDocumentsApi } from "~/data/documents";
import { useUsersApi } from "~/data/users";
import { useProjectsApi } from "~/data/projects";
import { useAssignmentsApi } from "~/data/document-assignments";
import { useAnnotationsApi } from "~/data/annotations";
import { useReviewsApi } from "~/data/reviews";
import { useProjectContext } from "~/composables/project-context";
import { parseFile, isValidFileType } from "~/utils/file-parser";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import DataTable from "~/components/ui/data-table/data-table.vue";
import { createColumns } from "~/components/documents/columns";

const { getDocument, createDocument, deleteDocument, previewDocumentSentences } = useDocumentsApi();
const { getDocumentsInProject } = useProjectsApi();
const { getAllUsersInProject } = useUsersApi();
const { assignDocument, unassignDocument } = useAssignmentsApi();
const { adminReopenAnnotator } = useAnnotationsApi();
const { adminReopenReview } = useReviewsApi();
const { selectedProjectId, selectedProject } = useProjectContext();
const { userRoles } = useAuth();

const isAdmin = computed(() => userRoles.value.includes("Admin"));
const documents = ref([]);
const users = ref([]);
const selectedDocuments = ref([]);
const isLoading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

const isCreateDialogOpen = ref(false);
const isBulkDialogOpen = ref(false);
const isUploading = ref(false);
const isLoadingPreview = ref(false);
const singleFilePreview = ref(null);
const singleFileConfirmed = ref(false);
const documentInstitution = ref("");
const bulkFilesPreview = ref([]);

const isAssignmentDialogOpen = ref(false);
const isManaging = ref(false);

const isReopenDialogOpen = ref(false);
const isReopening = ref(false);
const documentToReopen = ref(null);

const isDuplicateWarningOpen = ref(false);
const duplicateError = ref(null);
const pendingDocumentRequest = ref(null);
const duplicateHandlingMode = ref("single");

const confirmedBulkFiles = computed(() => bulkFilesPreview.value.filter(f => f.status === 'confirmed'));

const documentColumns = computed(() =>
  createColumns(
    (id) => users.value.find(u => u.id === id)?.full_name || "Unknown",
    (username) => users.value.find(u => u.username === username)?.full_name || username,
    handleDeleteDocument,
    (doc) => { 
      documentToReopen.value = doc; 
      isReopenDialogOpen.value = true; 
    },
    (doc) => { 
      selectedDocuments.value = [doc]; 
      isAssignmentDialogOpen.value = true; 
    }
  )
);

async function handleSingleFile(e) {
  const file = e.target.files?.[0];
  if (!file || !isValidFileType(file.name)) return;
  isLoadingPreview.value = true;
  try {
    const parsed = await parseFile(file);
    const prev = await previewDocumentSentences({ text: parsed.text });
    singleFilePreview.value = { ...parsed, ...prev };
    singleFileConfirmed.value = true;
  } finally { isLoadingPreview.value = false; }
}

async function handleBulkFiles(e) {
  const files = Array.from(e.target.files || []).filter(f => isValidFileType(f.name));
  bulkFilesPreview.value = await Promise.all(files.map(async f => {
    const p = await parseFile(f);
    return { ...p, status: 'confirmed' };
  }));
}

async function uploadFiles(mode) {
  isUploading.value = true;
  try {
    const docs = mode === 'single' ? [singleFilePreview.value] : confirmedBulkFiles.value;
    for (const doc of docs) {
      await createDocument({ ...doc, project: selectedProjectId.value, institution: documentInstitution.value });
    }
    toast.success("Upload berhasil");
    isCreateDialogOpen.value = isBulkDialogOpen.value = false;
    fetchDocuments();
  } catch (e: any) {
    if (e.status === 400) {
      duplicateError.value = e.data;
      duplicateHandlingMode.value = mode;
      pendingDocumentRequest.value = mode === 'single' ? singleFilePreview.value : confirmedBulkFiles.value[0];
      isDuplicateWarningOpen.value = true;
    }
  } finally { isUploading.value = false; }
}

async function handleSaveAssignment({ userIds, deadline }) {
  isManaging.value = true;
  try {
    for (const doc of selectedDocuments.value) {
      const detail = await getDocument(doc.id);
      const current = detail.assigned_to_ids || [];
      const toAdd = userIds.filter(id => !current.includes(id));
      const toRem = current.filter(id => !userIds.includes(id));
      for (const id of toAdd) await assignDocument({ document_id: doc.id, user_id: id, deadline });
      for (const id of toRem) await unassignDocument({ document_id: doc.id, user_id: id });
    }
    toast.success("Assignment berhasil diperbarui");
    isAssignmentDialogOpen.value = false;
    fetchDocuments();
  } finally { isManaging.value = false; }
}

async function handleSubmitReopen({ mode, userIds, reason }) {
  isReopening.value = true;
  try {
    for (const id of userIds) {
      const req = { document: documentToReopen.value.id, user_id: id, reason };
      mode === 'annotator' ? await adminReopenAnnotator(selectedProjectId.value, req) : await adminReopenReview(selectedProjectId.value, req);
    }
    toast.success("Reopen berhasil");
    isReopenDialogOpen.value = false;
    fetchDocuments();
  } finally { isReopening.value = false; }
}

async function proceedWithDuplicate() {
  await createDocument({ ...pendingDocumentRequest.value, project: selectedProjectId.value, allow_duplicate: true });
  isDuplicateWarningOpen.value = false;
  fetchDocuments();
}

function handleSelectionChange(s) { selectedDocuments.value = s; }

async function handleDeleteDocument(id) {
  if (!confirm("Hapus dokumen ini?")) return;
  await deleteDocument(parseInt(id));
  fetchDocuments();
}

async function fetchDocuments(page = 1) {
  isLoading.value = true;
  try {
    const res = await getDocumentsInProject(selectedProjectId.value);
    documents.value = res || [];
  } finally { isLoading.value = false; }
}

async function fetchUsers() {
  if (selectedProjectId.value) users.value = await getAllUsersInProject(selectedProjectId.value) || [];
}

onMounted(() => { fetchUsers(); if (selectedProjectId.value) fetchDocuments(); });
watch(selectedProjectId, () => { fetchUsers(); fetchDocuments(); });
</script>