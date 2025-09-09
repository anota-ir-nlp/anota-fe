<template>
  <div class="flex flex-col items-center justify-start text-center bg-slate-900 text-white p-8 min-h-screen">
    <div class="flex items-center justify-center gap-4 mb-20">
      <h1 class="text-4xl font-bold text-blue-400">Kelola Dokumen</h1>
    </div>

    <!-- Project Selection Required Notice -->
    <div v-if="!selectedProject" class="mb-6 w-full max-w-6xl">
      <div class="bg-yellow-600/20 border border-yellow-600/50 rounded-xl p-6 text-center">
        <h3 class="text-yellow-300 font-semibold mb-2">Project Belum Dipilih</h3>
        <p class="text-yellow-200">Silakan pilih project terlebih dahulu dari dropdown di header untuk mengelola
          dokumen.</p>
      </div>
    </div>

    <template v-if="selectedProject">
      <!-- Upload Controls -->
      <div class="mb-6 w-full flex gap-3 max-w-6xl mx-auto">
        <!-- Single Upload Dialog -->
        <Dialog v-model:open="isCreateDialogOpen">
          <DialogTrigger as-child>
            <Button class="flex items-center gap-2">
              <Plus class="w-4 h-4" />
              Upload Dokumen
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-4xl h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Upload Dokumen</DialogTitle>
              <DialogDescription>
                Pilih file TXT atau DOCX untuk diupload. Nama file akan menjadi judul dokumen.
              </DialogDescription>
            </DialogHeader>
            <div class="flex-1 flex flex-col gap-4 py-4 overflow-hidden">
              <Input type="file" accept=".txt,.docx" @change="handleSingleFile" class="mb-2" />
              <div v-if="singleFilePreview"
                class="flex-1 bg-slate-800 rounded p-4 text-sm flex flex-col overflow-hidden">
                <div class="font-semibold text-blue-300 mb-3">Preview:</div>
                <div class="flex-1 text-left space-y-3 flex flex-col overflow-hidden">
                  <div class="font-medium text-lg">{{ singleFilePreview.title }}</div>
                  <div class="flex-1 text-gray-300 p-4 bg-slate-700 rounded overflow-y-auto whitespace-pre-wrap">
                    {{ singleFilePreview.text }}
                  </div>
                  <div class="flex gap-2 mt-4 pt-4 border-t border-slate-600">
                    <Button @click="confirmFile('single')" variant="default" size="sm" class="flex items-center gap-2">
                      <Plus class="w-4 h-4" />
                      Konfirmasi File
                    </Button>
                    <Button @click="deleteFile('single')" variant="destructive" size="sm"
                      class="flex items-center gap-2">
                      <Trash class="w-4 h-4" />
                      Hapus File
                    </Button>
                  </div>
                </div>
              </div>
              <div v-if="fileError" class="text-red-400 text-sm">{{ fileError }}</div>
            </div>
            <DialogFooter>
              <Button variant="outline" @click="resetForm('single')">Reset</Button>
              <Button @click="uploadFiles('single')" :disabled="isUploading || !singleFileConfirmed"
                class="flex items-center gap-2">
                <Plus v-if="!isUploading" class="w-4 h-4" />
                <Loader2 v-else class="w-4 h-4 animate-spin" />
                {{ isUploading ? 'Mengupload...' : 'Upload Dokumen' }}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <!-- Bulk Upload Dialog -->
        <Dialog v-model:open="isBulkDialogOpen">
          <DialogTrigger as-child>
            <Button variant="outline" class="flex items-center gap-2">
              <Upload class="w-4 h-4" />
              Upload Folder
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-4xl h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Bulk Upload Dokumen dari Folder</DialogTitle>
              <DialogDescription>
                Pilih folder yang berisi file TXT atau DOCX. Setiap file akan menjadi dokumen baru dengan nama file
                sebagai judul.
              </DialogDescription>
            </DialogHeader>
            <div class="flex-1 flex flex-col gap-4 py-4 overflow-hidden">
              <Input type="file" webkitdirectory multiple accept=".txt,.docx" @change="handleBulkFiles" class="mb-2" />

              <div v-if="bulkFilesPreview.length" class="flex-1 flex flex-col gap-4 overflow-hidden">
                <div class="flex items-center justify-between">
                  <div class="font-semibold">
                    <template v-if="currentBulkFile">
                      File {{ currentBulkFileIndex + 1 }} dari {{ bulkFilesPreview.length }}
                    </template>
                    <template v-else>
                      Semua {{ bulkFilesPreview.length }} file telah diproses
                    </template>
                    ({{ processedBulkFiles.length }} diproses)
                  </div>
                  <div v-if="currentBulkFile" class="flex items-center space-x-2">
                    <input type="checkbox" id="applyToAll" v-model="applyToAllFiles" class="rounded border-gray-300" />
                    <label for="applyToAll" class="text-sm text-gray-300">Terapkan ke semua file berikutnya</label>
                  </div>
                </div>

                <!-- Current File Preview -->
                <div v-if="currentBulkFile" class="flex-1 bg-slate-800 rounded p-6 flex flex-col overflow-hidden">
                  <div class="space-y-4 flex-1 flex flex-col overflow-hidden">
                    <div class="font-medium text-blue-300 text-lg">{{ currentBulkFile.title }}</div>
                    <div
                      class="flex-1 text-gray-300 p-4 bg-slate-700 rounded overflow-y-auto whitespace-pre-wrap text-sm">
                      {{ currentBulkFile.text }}
                    </div>
                    <div class="flex gap-2 pt-4 border-t border-slate-600">
                      <Button @click="confirmFile('bulk')" variant="default" size="sm" class="flex items-center gap-2">
                        <Plus class="w-4 h-4" />
                        Konfirmasi File
                      </Button>
                      <Button @click="deleteFile('bulk')" variant="destructive" size="sm"
                        class="flex items-center gap-2">
                        <Trash class="w-4 h-4" />
                        Hapus File
                      </Button>
                    </div>
                  </div>
                </div>

                <!-- Summary when all files processed -->
                <div v-else class="flex-1 bg-slate-800 rounded p-6 flex flex-col items-center justify-center">
                  <div class="text-center space-y-4">
                    <div class="text-xl font-semibold text-green-400">Semua File Telah Diproses</div>
                    <div class="text-gray-300">
                      <div>Dikonfirmasi: {{ confirmedBulkFiles.length }} file</div>
                      <div>Dihapus: {{ deletedBulkFiles.length }} file</div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="fileError" class="text-red-400 text-sm">{{ fileError }}</div>
              <Progress v-if="isUploading" :model-value="uploadProgress" class="mt-2" />
            </div>
            <DialogFooter>
              <Button variant="outline" @click="resetForm('bulk')">Reset</Button>
              <Button @click="uploadFiles('bulk')" :disabled="isUploading || confirmedBulkFiles.length === 0"
                class="flex items-center gap-2">
                <Upload v-if="!isUploading" class="w-4 h-4" />
                <Loader2 v-else class="w-4 h-4 animate-spin" />
                {{ isUploading ? 'Mengupload...' : `Upload ${confirmedBulkFiles.length} File` }}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <!-- Bulk Assignment Button -->
        <Button v-if="selectedDocuments.length > 0" variant="outline" class="flex items-center gap-2 ml-auto"
          @click="openAssignmentDialog('bulk')">
          <UserPlus class="w-4 h-4" />
          Kelola Assignment ({{ selectedDocuments.length }})
        </Button>
      </div>

      <!-- Assignment Dialog -->
      <Dialog v-model:open="isAssignmentDialogOpen">
        <DialogContent class="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Kelola Assignment Dokumen</DialogTitle>
            <DialogDescription>
              {{ assignmentMode === 'bulk'
                ? `Kelola assignment untuk ${selectedDocuments.length} dokumen terpilih.`
                : `Kelola user yang di-assign untuk dokumen "${documentToManage?.title}".`
              }}
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <label class="text-sm font-medium text-left">User yang Ditugaskan</label>
              <Combobox v-model="assignedUserIds" v-model:open="openUsers" :ignore-filter="true">
                <ComboboxAnchor as-child>
                  <TagsInput v-model="assignedUserIds" class="px-2 w-full">
                    <div class="flex flex-col">
                      <div v-if="assignedUserIds.length" class="flex gap-2 flex-wrap items-center p-1 font-semibold">
                        <TagsInputItem v-for="userId in assignedUserIds" :key="userId" :value="getUserName(userId)">
                          <TagsInputItemText class="text-xs">{{ getUserName(userId) }}</TagsInputItemText>
                          <TagsInputItemDelete @click="removeUserFromAssignment(userId)" />
                        </TagsInputItem>
                      </div>
                      <ComboboxInput v-model="searchTerm" as-child>
                        <TagsInputInput placeholder="Tambah user assignment..." class="w-full" @keydown.enter.prevent />
                      </ComboboxInput>
                    </div>
                  </TagsInput>
                  <ComboboxList class="w-[--reka-popper-anchor-width]" align="start">
                    <ComboboxEmpty />
                    <ComboboxGroup>
                      <ComboboxItem v-for="user in users" :key="user.id" :value="user.id"
                        @select.prevent="addUserToAssignment">
                        {{ user.full_name }}
                      </ComboboxItem>
                    </ComboboxGroup>
                  </ComboboxList>
                </ComboboxAnchor>
              </Combobox>
            </div>
            <div class="bg-slate-800 rounded p-3 text-sm">
              <div class="font-semibold text-blue-300 mb-2">
                {{ assignmentMode === 'bulk' ? 'Dokumen Terpilih:' : 'Dokumen:' }}
              </div>
              <div class="text-left max-h-32 overflow-y-auto">
                <div v-if="assignmentMode === 'bulk'">
                  <div v-for="doc in selectedDocuments" :key="doc.id" class="text-gray-400 mb-1">• {{ doc.title }}</div>
                </div>
                <div v-else-if="documentToManage">
                  <div class="font-medium">{{ documentToManage.title }}</div>
                  <div class="text-gray-400 mt-1">
                    Previously assigned to:
                    <span v-if="originalAssignedUsers.length === 0" class="text-gray-500">No one</span>
                    <span v-else>{{ originalAssignedUsers.length }} user(s)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="closeAssignmentDialog">Batal</Button>
            <Button @click="saveAssignmentChanges" :disabled="isManaging" class="flex items-center gap-2">
              <UserPlus v-if="!isManaging" class="w-4 h-4" />
              <Loader2 v-else class="w-4 h-4 animate-spin" />
              {{ isManaging ? 'Menyimpan...' : 'Simpan Assignment' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div v-if="isLoading" class="text-gray-300 mb-4">Memuat data dokumen...</div>

      <div v-if="documents.length"
        class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg p-6 mb-6 w-full max-w-6xl">
        <DataTable :columns="documentColumns" :data="documents" @selection-change="handleSelectionChange"
          @delete-document="handleDeleteDocument" />
      </div>

      <!-- Pagination Controls -->
      <div v-if="documents.length && totalPages > 1" class="mt-4 flex justify-center w-full max-w-6xl">
        <Pagination :page="currentPage" :total="totalPages"
          :items-per-page="documents.length > 0 ? documents.length : 1" @update:page="fetchDocuments">
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useDocumentsApi } from "~/data/documents";
import { useUsersApi } from "~/data/users";
import { useAssignmentsApi } from "~/data/document-assignments";
import { useProjectsApi } from "~/data/projects";
import { useProjectContext } from "~/composables/project-context";
import type { DocumentResponse, DocumentRequest, UserResponse } from "~/types/api";
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
import { Plus, Upload, Loader2, ArrowLeft, ArrowRight, MoreHorizontal, UserPlus, Trash } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { Progress } from "~/components/ui/progress";
import { TagsInput, TagsInputItem, TagsInputInput, TagsInputItemDelete, TagsInputItemText } from "~/components/ui/tags-input";
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import DataTable from "~/components/ui/data-table/data-table.vue";
import { createColumns } from "~/components/documents/columns";
import { parseFile, isValidFileType } from "~/utils/file-parser";

const { getDocumentsInProject, createDocument: apiCreateDocument, deleteDocument: apiDeleteDocument, assignDocumentsToProject } = useDocumentsApi();
const { getUsers } = useUsersApi();
const { assignDocument: apiAssignDocument, unassignDocument: apiUnassignDocument, bulkAssignDocument: apiBulkAssignDocument } = useAssignmentsApi();
const { selectedProject, selectedProjectId } = useProjectContext();

// Core state
const documents = ref<DocumentResponse[]>([]);
const users = ref<UserResponse[]>([]);
const selectedDocuments = ref<DocumentResponse[]>([]);
const isLoading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

// File upload state
const isCreateDialogOpen = ref(false);
const isBulkDialogOpen = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const singleFilePreview = ref<DocumentRequest | null>(null);
const singleFileConfirmed = ref(false);
const fileError = ref("");
const applyToAllFiles = ref(false);

interface BulkFilePreview extends DocumentRequest {
  status?: 'pending' | 'confirmed' | 'deleted';
}

const bulkFilesPreview = ref<BulkFilePreview[]>([]);
const currentBulkFileIndex = ref(0);
const processedBulkFiles = ref<BulkFilePreview[]>([]);

// Assignment state - consolidated
const isAssignmentDialogOpen = ref(false);
const isManaging = ref(false);
const assignmentMode = ref<'single' | 'bulk'>('single');
const documentToManage = ref<DocumentResponse | null>(null);
const assignedUserIds = ref<string[]>([]);
const originalAssignedUsers = ref<string[]>([]);
const openUsers = ref(false);
const searchTerm = ref('');


const confirmedBulkFiles = computed(() => processedBulkFiles.value.filter(file => file.status === 'confirmed'));
const deletedBulkFiles = computed(() => processedBulkFiles.value.filter(file => file.status === 'deleted'));
const currentBulkFile = computed(() => {
  if (currentBulkFileIndex.value >= bulkFilesPreview.value.length) return null;
  return bulkFilesPreview.value[currentBulkFileIndex.value];
});

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

const documentColumns = computed(() => createColumns(getUserName, handleDeleteDocument));

// Consolidated file handling functions
async function handleSingleFile(e: Event) {
  resetFileState();
  const files = (e.target as HTMLInputElement).files;
  if (!files || !files[0]) return;

  const file = files[0];
  if (!isValidFileType(file.name)) {
    fileError.value = "File harus berformat .txt atau .docx";
    return;
  }

  try {
    singleFilePreview.value = await parseFile(file);
  } catch (error) {
    fileError.value = error instanceof Error ? error.message : "Gagal membaca file";
  }
}

async function handleBulkFiles(e: Event) {
  resetFileState();
  resetBulkState();

  const files = (e.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;

  const validFiles = Array.from(files).filter(file => isValidFileType(file.name));
  if (validFiles.length === 0) {
    fileError.value = "Tidak ada file dengan format yang didukung (.txt, .docx) ditemukan dalam folder";
    return;
  }

  const documents: BulkFilePreview[] = [];
  for (const file of validFiles) {
    try {
      const parsed = await parseFile(file);
      documents.push({ ...parsed, status: 'pending' });
    } catch (error) {
      console.error(`Failed to parse ${file.name}:`, error);
    }
  }

  if (documents.length === 0) {
    fileError.value = "Tidak ada file dengan konten valid ditemukan";
  } else {
    bulkFilesPreview.value = documents;
  }
}

function confirmFile(mode: 'single' | 'bulk') {
  if (mode === 'single' && singleFilePreview.value) {
    singleFileConfirmed.value = true;
    toast.success("File dikonfirmasi dan siap untuk diupload");
  } else if (mode === 'bulk' && currentBulkFile.value) {
    const currentFile = currentBulkFile.value;
    currentFile.status = 'confirmed';
    processedBulkFiles.value.push(currentFile);

    if (applyToAllFiles.value) {
      const remainingFiles = bulkFilesPreview.value.slice(currentBulkFileIndex.value + 1);
      remainingFiles.forEach(file => {
        file.status = 'confirmed';
        processedBulkFiles.value.push(file);
      });
      currentBulkFileIndex.value = bulkFilesPreview.value.length;
      toast.success(`File saat ini dan ${remainingFiles.length} file lainnya dikonfirmasi`);
    } else {
      currentBulkFileIndex.value++;
      toast.success(`File "${currentFile.title}" dikonfirmasi`);
    }
  }
}

function deleteFile(mode: 'single' | 'bulk') {
  if (mode === 'single') {
    singleFilePreview.value = null;
    singleFileConfirmed.value = false;
    const fileInput = document.querySelector('input[type="file"][accept=".txt,.docx"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    toast.info("File dihapus");
  } else if (mode === 'bulk' && currentBulkFile.value) {
    const currentFile = currentBulkFile.value;
    currentFile.status = 'deleted';
    processedBulkFiles.value.push(currentFile);

    if (applyToAllFiles.value) {
      const remainingFiles = bulkFilesPreview.value.slice(currentBulkFileIndex.value + 1);
      remainingFiles.forEach(file => {
        file.status = 'deleted';
        processedBulkFiles.value.push(file);
      });
      currentBulkFileIndex.value = bulkFilesPreview.value.length;
      toast.info(`File saat ini dan ${remainingFiles.length} file lainnya dihapus`);
    } else {
      currentBulkFileIndex.value++;
      toast.info(`File "${currentFile.title}" dihapus`);
    }
  }
}

function resetFileState() {
  fileError.value = "";
}

function resetBulkState() {
  bulkFilesPreview.value = [];
  processedBulkFiles.value = [];
  currentBulkFileIndex.value = 0;
  applyToAllFiles.value = false;
}

function resetForm(mode: 'single' | 'bulk') {
  if (mode === 'single') {
    singleFilePreview.value = null;
    singleFileConfirmed.value = false;
    isCreateDialogOpen.value = false;
    const fileInput = document.querySelector('input[type="file"][accept=".txt,.docx"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  } else {
    resetBulkState();
    isBulkDialogOpen.value = false;
    const fileInput = document.querySelector('input[webkitdirectory]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
  resetFileState();
}

async function uploadFiles(mode: 'single' | 'bulk') {
  if (!selectedProjectId.value) {
    toast.error("Pilih project terlebih dahulu");
    return;
  }

  isUploading.value = true;
  uploadProgress.value = 0;

  try {
    if (mode === 'single' && singleFilePreview.value) {
      await createAndAssignDocument(singleFilePreview.value);
      toast.success(`Dokumen "${singleFilePreview.value.title}" berhasil dibuat dan ditambahkan ke project`);
      resetForm('single');
    } else if (mode === 'bulk') {
      await bulkCreateAndAssignDocuments();
      resetForm('bulk');
    }

    await fetchDocuments(currentPage.value);
  } catch (error) {
    console.error('Error uploading files:', error);
    toast.error("Gagal mengupload dokumen");
  } finally {
    isUploading.value = false;
    uploadProgress.value = 0;
  }
}

async function createAndAssignDocument(docRequest: DocumentRequest) {
  const createdDocument = await apiCreateDocument(docRequest);
  const currentDocuments = selectedProject.value?.documents || [];
  const updatedDocuments = [...currentDocuments, createdDocument.id];
  if (selectedProjectId.value) {
    await assignDocumentsToProject(selectedProjectId.value, updatedDocuments);
  }
}

async function bulkCreateAndAssignDocuments() {
  const filesToUpload = confirmedBulkFiles.value;
  if (!filesToUpload.length) return;

  let successCount = 0;
  let failCount = 0;
  const total = filesToUpload.length;
  const createdDocumentIds: number[] = [];

  for (const [idx, doc] of filesToUpload.entries()) {
    try {
      const createdDocument = await apiCreateDocument(doc);
      createdDocumentIds.push(createdDocument.id);
      successCount++;
    } catch (error) {
      failCount++;
    }
    uploadProgress.value = Math.round(((idx + 1) / total) * 100);
  }

  if (createdDocumentIds.length > 0) {
    try {
      const currentDocuments = selectedProject.value?.documents || [];
      const updatedDocuments = [...currentDocuments, ...createdDocumentIds];
      if (selectedProjectId.value) {
        await assignDocumentsToProject(selectedProjectId.value, updatedDocuments);
      }
    } catch (error) {
      console.error('Error assigning documents to project:', error);
      toast.error("Dokumen berhasil dibuat tapi gagal ditambahkan ke project");
    }
  }

  toast.warning("Bulk Upload Selesai", {
    description: `Berhasil: ${successCount}, Gagal: ${failCount}${createdDocumentIds.length > 0 ? ', Ditambahkan ke project' : ''}`,
  });
}

// Consolidated assignment functions
function openAssignmentDialog(mode: 'single' | 'bulk', document?: DocumentResponse) {
  assignmentMode.value = mode;
  assignedUserIds.value = [];
  searchTerm.value = '';

  if (mode === 'single' && document) {
    documentToManage.value = document;
    originalAssignedUsers.value = document.assigned_to.map(id => id.toString());
    assignedUserIds.value = [...originalAssignedUsers.value];
  }

  isAssignmentDialogOpen.value = true;
}

function closeAssignmentDialog() {
  documentToManage.value = null;
  assignedUserIds.value = [];
  originalAssignedUsers.value = [];
  searchTerm.value = '';
  isAssignmentDialogOpen.value = false;
}

function addUserToAssignment(ev: any) {
  if (typeof ev.detail.value === 'string') {
    searchTerm.value = '';
    assignedUserIds.value.push(ev.detail.value);
  }
  if (users.value.length === 0) {
    openUsers.value = false;
  }
}

function removeUserFromAssignment(userId: string) {
  const index = assignedUserIds.value.indexOf(userId);
  if (index > -1) {
    assignedUserIds.value.splice(index, 1);
  }
}

async function saveAssignmentChanges() {
  isManaging.value = true;
  try {
    if (assignmentMode.value === 'single') {
      await saveSingleAssignmentChanges();
    } else {
      await saveBulkAssignmentChanges();
    }
  } finally {
    isManaging.value = false;
  }
}

async function saveSingleAssignmentChanges() {
  if (!documentToManage.value) {
    toast.error("Tidak ada dokumen yang dipilih");
    return;
  }

  toast.promise(
    (async () => {
      const currentAssigned = originalAssignedUsers.value;
      const newAssigned = assignedUserIds.value;
      const toAssign = newAssigned.filter(id => !currentAssigned.includes(id));
      const toUnassign = currentAssigned.filter(id => !newAssigned.includes(id));

      let successCount = 0;
      let failCount = 0;

      for (const userId of toAssign) {
        try {
          await apiAssignDocument({ document_id: documentToManage.value!.id, user_id: userId });
          successCount++;
        } catch (error) {
          failCount++;
        }
      }

      for (const userId of toUnassign) {
        try {
          await apiUnassignDocument({ document_id: documentToManage.value!.id, user_id: userId });
          successCount++;
        } catch (error) {
          failCount++;
        }
      }

      return { successCount, failCount, totalChanges: toAssign.length + toUnassign.length, assigned: toAssign.length, unassigned: toUnassign.length };
    })(),
    {
      loading: "Menyimpan perubahan assignment...",
      success: (result: { successCount: number; failCount: number; totalChanges: number; assigned: number; unassigned: number }) => {
        fetchDocuments(currentPage.value);
        closeAssignmentDialog();

        if (result.failCount === 0) {
          if (result.totalChanges === 0) return "Tidak ada perubahan assignment.";
          return `Assignment berhasil diperbarui: ${result.assigned} user ditambah, ${result.unassigned} user dihapus.`;
        } else {
          return `Assignment diperbarui: ${result.successCount} berhasil, ${result.failCount} gagal.`;
        }
      },
      error: "Gagal menyimpan perubahan assignment",
    }
  );
}

async function saveBulkAssignmentChanges() {
  if (selectedDocuments.value.length === 0) {
    toast.error("Tidak ada dokumen yang dipilih");
    return;
  }

  toast.promise(
    (async () => {
      let successCount = 0;
      let failCount = 0;

      for (const doc of selectedDocuments.value) {
        const usersToAssign = assignedUserIds.value.filter(userId => !doc.assigned_to.includes(parseInt(userId)));
        if (usersToAssign.length > 0) {
          try {
            await apiBulkAssignDocument(doc.id, usersToAssign);
            successCount += usersToAssign.length;
          } catch (error) {
            failCount += usersToAssign.length;
          }
        }
      }

      return { successCount, failCount };
    })(),
    {
      loading: "Menyimpan assignment untuk dokumen terpilih...",
      success: (result: { successCount: number; failCount: number }) => {
        fetchDocuments(currentPage.value);
        selectedDocuments.value = [];
        closeAssignmentDialog();

        if (result.failCount === 0) {
          return `Assignment berhasil disimpan: ${result.successCount} assignment baru ditambahkan.`;
        } else {
          return `Assignment disimpan: ${result.successCount} berhasil, ${result.failCount} gagal.`;
        }
      },
      error: "Gagal menyimpan bulk assignment",
    }
  );
}

function handleSelectionChange(selection: DocumentResponse[]) {
  selectedDocuments.value = selection;
}

function handleDeleteDocument(documentId: string) {
  const numericId = parseInt(documentId);
  if (!confirm('Apakah Anda yakin ingin menghapus dokumen ini? Semua annotations yang terkait akan ikut terhapus.')) {
    return;
  }

  apiDeleteDocument(numericId)
    .then(() => {
      toast.success("Dokumen berhasil dihapus");
      fetchDocuments(currentPage.value);
    })
    .catch((error) => {
      console.error('Error deleting document:', error);
      toast.error("Gagal menghapus dokumen");
    });
}

function getUserName(userId: string) {
  const user = users.value.find(u => u.id === userId);
  return user ? user.full_name : 'Unknown User';
}

async function fetchDocuments(page = 1) {
  if (!selectedProjectId.value) {
    documents.value = [];
    totalPages.value = 1;
    return;
  }

  isLoading.value = true;
  try {
    const projectDocuments = await getDocumentsInProject(selectedProjectId.value);
    documents.value = projectDocuments || [];
    currentPage.value = 1;
    totalPages.value = 1;
  } catch (error) {
    console.error('Error fetching documents:', error);
    toast.error("Gagal memuat data dokumen");
    documents.value = [];
    totalPages.value = 1;
  } finally {
    isLoading.value = false;
  }
}

async function fetchUsers() {
  if (!selectedProjectId.value) {
    users.value = [];
    return;
  }

  try {
    const response = await getUsers(selectedProjectId.value);
    users.value = response?.results || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    toast.error("Gagal memuat daftar user");
  }
}

onMounted(async () => {
  if (selectedProjectId.value) {
    await fetchUsers();
    await fetchDocuments(currentPage.value);
  }
});

watch(selectedProjectId, async () => {
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
}, { immediate: false });

watch(currentPage, () => {
  selectedDocuments.value = [];
});
</script>