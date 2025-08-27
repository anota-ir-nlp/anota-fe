<template>
  <div class="flex flex-col items-center justify-start text-center bg-slate-900 text-white p-8 min-h-screen">
    <div class="flex items-center justify-center gap-4 mb-20">
      <h1 class="text-4xl font-bold text-blue-400">Kelola Dokumen</h1>
      <div v-if="selectedProject" class="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
        Project: {{ selectedProject.name }}
      </div>
      <div v-else class="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
        Semua Project
      </div>
    </div>

    <!-- Add Document Button -->
    <div class="mb-6 w-full flex gap-3 max-w-6xl mx-auto">
      <!-- Single Upload Dialog -->
      <Dialog v-model:open="isCreateDialogOpen">
        <div class="flex gap-3 items-start">
          <DialogTrigger as-child>
            <Button class="flex items-center gap-2">
              <Plus class="w-4 h-4" />
              Upload Dokumen TXT
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent class="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Dokumen TXT</DialogTitle>
            <DialogDescription>
              Pilih file TXT untuk diupload. Nama file akan menjadi judul dokumen.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <Input
              type="file"
              accept=".txt"
              @change="handleSingleTxtFile"
              class="mb-2"
            />
            <div v-if="singleFilePreview" class="bg-slate-800 rounded p-3 text-sm">
              <div class="font-semibold text-blue-300 mb-2">Preview:</div>
              <div class="text-left">
                <div class="font-medium">Judul: {{ singleFilePreview.title }}</div>
                <div class="text-gray-400 mt-2 max-h-32 overflow-y-auto">
                  {{ singleFilePreview.text.substring(0, 200) }}{{ singleFilePreview.text.length > 200 ? '...' : '' }}
                </div>
              </div>
            </div>
            <div v-if="singleFileError" class="text-red-400 text-sm">{{ singleFileError }}</div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="resetSingleForm">
              Reset
            </Button>
            <Button @click="createSingleDocument" :disabled="isCreating || !singleFilePreview" class="flex items-center gap-2">
              <Plus v-if="!isCreating" class="w-4 h-4" />
              <Loader2 v-else class="w-4 h-4 animate-spin" />
              {{ isCreating ? 'Mengupload...' : 'Upload Dokumen' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Bulk Upload Folder Button & Dialog -->
      <Dialog v-model:open="isBulkDialogOpen">
        <div class="flex gap-3 items-start">
          <DialogTrigger as-child>
            <Button variant="outline" class="flex items-center gap-2">
              <Upload class="w-4 h-4" />
              Upload Folder TXT
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent class="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Bulk Upload Dokumen dari Folder</DialogTitle>
            <DialogDescription>
              Pilih folder yang berisi file-file TXT. Setiap file akan menjadi dokumen baru dengan nama file sebagai judul.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <Input
              type="file"
              webkitdirectory
              multiple
              accept=".txt"
              @change="handleBulkTxtFiles"
              class="mb-2"
            />
            <div v-if="bulkFilesPreview.length" class="font-semibold">
              Total {{ bulkFilesPreview.length }} file TXT
            </div>
            <div v-if="bulkFilesPreview.length" class="bg-slate-800 rounded p-2 text-sm mb-2">
              <div class="w-full max-w-2xl mx-auto">
                <Table class="w-full text-left border-collapse table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead class="px-3 py-2 border-b border-slate-700 text-blue-300 font-semibold w-1/4">Judul</TableHead>
                      <TableHead class="px-3 py-2 border-b border-slate-700 text-gray-400 font-semibold w-3/4">Teks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="(file, idx) in bulkFilesPreview.slice(0, 5)" :key="idx">
                      <TableCell
                        class="px-3 py-2 border-b border-slate-700 align-top truncate whitespace-nowrap overflow-hidden"
                        :title="file.title">{{ file.title }}</TableCell>
                      <TableCell
                        class="px-3 py-2 border-b border-slate-700 text-gray-400 align-top truncate whitespace-nowrap overflow-hidden"
                        :title="file.text">{{ file.text }}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            <div v-if="bulkFilesError" class="text-red-400 text-sm">{{ bulkFilesError }}</div>
            <Progress v-if="isBulkUploading" :model-value="bulkProgress" class="mt-2" />
          </div>
          <DialogFooter>
            <Button variant="outline" @click="resetBulkForm">
              Reset
            </Button>
            <Button @click="bulkCreateDocuments" :disabled="isBulkUploading || !bulkFilesPreview.length"
              class="flex items-center gap-2">
              <Upload v-if="!isBulkUploading" class="w-4 h-4" />
              <Loader2 v-else class="w-4 h-4 animate-spin" />
              {{ isBulkUploading ? 'Mengupload...' : 'Upload Folder' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <!-- Bulk Assignment Button -->
      <Button
        v-if="selectedDocuments.length > 0"
        variant="outline"
        class="flex items-center gap-2 ml-auto"
        @click="showBulkAssignmentDialog"
      >
        <UserPlus class="w-4 h-4" />
        Kelola Assignment ({{ selectedDocuments.length }})
      </Button>

      <!-- Bulk Project Assignment Button -->
      <Button
        v-if="selectedDocuments.length > 0"
        variant="outline"
        class="flex items-center gap-2"
        @click="showBulkProjectAssignmentDialog"
      >
        <FolderPlus class="w-4 h-4" />
        Assign ke Project ({{ selectedDocuments.length }})
      </Button>
    </div>

    <!-- Bulk Assignment Dialog -->
    <Dialog v-model:open="isBulkAssignmentDialogOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Kelola Assignment Dokumen</DialogTitle>
          <DialogDescription>
            Kelola assignment untuk {{ selectedDocuments.length }} dokumen terpilih. Anda dapat menambah atau menghapus assignment.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <label for="bulk_users" class="text-sm font-medium text-left">User yang Ditugaskan</label>
            <Combobox v-model="bulkAssignedUserIds" v-model:open="openBulkUsers" :ignore-filter="true">
              <ComboboxAnchor as-child>
                <TagsInput v-model="bulkAssignedUserIds" class="px-2 w-full">
                  <div class="flex flex-col">
                    <div v-if="bulkAssignedUserIds.length" class="flex gap-2 flex-wrap items-center p-1 font-semibold">
                      <TagsInputItem v-for="userId in bulkAssignedUserIds" :key="userId" :value="getUserName(userId)">
                        <TagsInputItemText class="text-xs">{{ getUserName(userId) }}</TagsInputItemText>
                        <TagsInputItemDelete @click="removeUserFromBulkAssignment(userId)" />
                      </TagsInputItem>
                    </div>
                    <ComboboxInput v-model="searchTermBulk" as-child>
                      <TagsInputInput placeholder="Tambah user assignment..." class="w-full" @keydown.enter.prevent />
                    </ComboboxInput>
                  </div>
                </TagsInput>
                <ComboboxList class="w-[--reka-popper-anchor-width]" align="start">
                  <ComboboxEmpty />
                  <ComboboxGroup>
                    <ComboboxItem
                      v-for="user in availableUsersForBulkAssignment"
                      :key="user.id"
                      :value="user.id"
                      @select.prevent="(ev) => {
                        if (typeof ev.detail.value === 'string') {
                          searchTermBulk = ''
                          bulkAssignedUserIds.push(ev.detail.value)
                        }
                        if (availableUsersForBulkAssignment.length === 0) {
                          openBulkUsers = false
                        }
                      }">
                      {{ user.full_name }}
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxList>
              </ComboboxAnchor>
            </Combobox>
          </div>
          <div class="bg-slate-800 rounded p-3 text-sm">
            <div class="font-semibold text-blue-300 mb-2">Dokumen Terpilih:</div>
            <div class="text-left max-h-32 overflow-y-auto">
              <div v-for="doc in selectedDocuments" :key="doc.id" class="text-gray-400 mb-1">
                • {{ doc.title }}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="cancelBulkAssignment">
            Batal
          </Button>
          <Button @click="saveBulkAssignmentChanges" :disabled="isBulkManaging" class="flex items-center gap-2">
            <UserPlus v-if="!isBulkManaging" class="w-4 h-4" />
            <Loader2 v-else class="w-4 h-4 animate-spin" />
            {{ isBulkManaging ? 'Menyimpan...' : 'Simpan Assignment' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Manage Assignment Dialog -->
    <Dialog v-model:open="isManageAssignmentDialogOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Kelola Assignment Dokumen</DialogTitle>
          <DialogDescription>
            Kelola user yang di-assign untuk dokumen "{{ documentToManage?.title }}". Anda dapat menambah atau menghapus assignment.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <label for="manage_users" class="text-sm font-medium text-left">User yang Ditugaskan</label>
            <Combobox v-model="managedUserIds" v-model:open="openManageUsers" :ignore-filter="true">
              <ComboboxAnchor as-child>
                <TagsInput v-model="managedUserIds" class="px-2 w-full">
                  <div class="flex flex-col">
                    <div v-if="managedUserIds.length" class="flex gap-2 flex-wrap items-center p-1 font-semibold">
                      <TagsInputItem v-for="userId in managedUserIds" :key="userId" :value="getUserName(userId)">
                        <TagsInputItemText class="text-xs">{{ getUserName(userId) }}</TagsInputItemText>
                        <TagsInputItemDelete @click="removeUserFromManagement(userId)" />
                      </TagsInputItem>
                    </div>
                    <ComboboxInput v-model="searchTermManage" as-child>
                      <TagsInputInput placeholder="Tambah atau hapus user assignment..." class="w-full" @keydown.enter.prevent />
                    </ComboboxInput>
                  </div>
                </TagsInput>
                <ComboboxList class="w-[--reka-popper-anchor-width]" align="start">
                  <ComboboxEmpty />
                  <ComboboxGroup>
                    <ComboboxItem
                      v-for="user in availableUsersForManagement"
                      :key="user.id"
                      :value="user.id"
                      @select.prevent="(ev) => {
                        if (typeof ev.detail.value === 'string') {
                          searchTermManage = ''
                          managedUserIds.push(ev.detail.value)
                        }
                        if (availableUsersForManagement.length === 0) {
                          openManageUsers = false
                        }
                      }">
                      {{ user.full_name }}
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxList>
              </ComboboxAnchor>
            </Combobox>
          </div>
          <div v-if="documentToManage" class="bg-slate-800 rounded p-3 text-sm">
            <div class="font-semibold text-blue-300 mb-2">Dokumen:</div>
            <div class="text-left">
              <div class="font-medium">{{ documentToManage.title }}</div>
              <div class="text-gray-400 mt-1">
                Previously assigned to:
                <span v-if="originalAssignedUsers.length === 0" class="text-gray-500">No one</span>
                <span v-else>{{ originalAssignedUsers.length }} user(s)</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="cancelManageAssignment">
            Batal
          </Button>
          <Button @click="saveAssignmentChanges" :disabled="isManaging" class="flex items-center gap-2">
            <UserPlus v-if="!isManaging" class="w-4 h-4" />
            <Loader2 v-else class="w-4 h-4 animate-spin" />
            {{ isManaging ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Bulk Project Assignment Dialog -->
    <Dialog v-model:open="isBulkProjectAssignmentDialogOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Dokumen ke Project</DialogTitle>
          <DialogDescription>
            Assign {{ selectedDocuments.length }} dokumen terpilih ke project tertentu. Dokumen yang sudah ada di project akan tetap berada di project tersebut.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <label for="target_project" class="text-sm font-medium text-left">Pilih Project Target</label>
            <Combobox v-model="selectedTargetProjectId" v-model:open="openProjectSelect" :ignore-filter="true">
              <ComboboxAnchor as-child>
                <Button variant="outline" class="w-full justify-between">
                  {{ selectedTargetProjectId ? getProjectName(selectedTargetProjectId) : "Pilih project..." }}
                  <ChevronDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ComboboxAnchor>
              <ComboboxList class="w-[--reka-popper-anchor-width]" align="start">
                <ComboboxEmpty>Project tidak ditemukan</ComboboxEmpty>
                <ComboboxGroup>
                  <ComboboxItem
                    v-for="project in availableProjects.filter(p => p.name.toLowerCase().includes(searchTermProject.toLowerCase()))"
                    :key="project.id"
                    :value="project.id.toString()"
                    @select.prevent="(ev) => {
                      if (typeof ev.detail.value === 'string') {
                        selectedTargetProjectId = ev.detail.value
                        openProjectSelect = false
                      }
                    }">
                    {{ project.name }}
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxList>
            </Combobox>
            <ComboboxInput v-model="searchTermProject" placeholder="Cari project..." class="hidden" />
          </div>
          <div class="bg-slate-800 rounded p-3 text-sm">
            <div class="font-semibold text-blue-300 mb-2">Dokumen yang akan di-assign:</div>
            <div class="text-left max-h-32 overflow-y-auto">
              <div v-for="doc in selectedDocuments" :key="doc.id" class="text-gray-400 mb-1">
                • {{ doc.title }}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="cancelBulkProjectAssignment">
            Batal
          </Button>
          <Button @click="saveBulkProjectAssignment" :disabled="isBulkProjectAssigning || !selectedTargetProjectId" class="flex items-center gap-2">
            <FolderPlus v-if="!isBulkProjectAssigning" class="w-4 h-4" />
            <Loader2 v-else class="w-4 h-4 animate-spin" />
            {{ isBulkProjectAssigning ? 'Mengassign...' : 'Assign ke Project' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <div v-if="isLoading" class="text-gray-300 mb-4">
      Memuat data dokumen...
    </div>

    <div v-if="documents.length"
      class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg p-6 mb-6 w-full max-w-6xl">
      <DataTable
        :columns="documentColumns"
        :data="documents"
        @selection-change="handleSelectionChange"
        @delete-document="handleDeleteDocument"
      />
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
import { ref, onMounted, computed, watch } from "vue";
import { useDocumentsApi } from "~/data/documents";
import { useUsersApi } from "~/data/users";
import { useAssignmentsApi } from "~/data/document-assignments";
import { useProjectsApi } from "~/data/projects";
import { useProjectContext } from "~/composables/project-context";
import type { DocumentResponse, DocumentRequest, UserResponse, ProjectResponse } from "~/types/api";
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
  Plus, Upload, Loader2, ArrowLeft, ArrowRight, MoreHorizontal, UserPlus, UserMinus, FolderPlus, ChevronDown
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import { Progress } from "~/components/ui/progress";
import { TagsInput, TagsInputItem, TagsInputInput, TagsInputItemDelete, TagsInputItemText } from "~/components/ui/tags-input";
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import DataTable from "~/components/ui/data-table/data-table.vue";
import { createColumns } from "~/components/documents/columns";

const { getDocuments, getDocumentsInProject, createDocument: apiCreateDocument, deleteDocument: apiDeleteDocument, assignDocumentsToProject } = useDocumentsApi();
const { getUsers, getUsersInProject } = useUsersApi();
const { assignDocument: apiAssignDocument, unassignDocument: apiUnassignDocument, bulkUnassignDocument: apiBulkUnassignDocument, bulkAssignDocument: apiBulkAssignDocument } = useAssignmentsApi();
const { getProjects } = useProjectsApi();
const { selectedProject, selectedProjectId, isAllProjects } = useProjectContext();

const documents = ref<DocumentResponse[]>([]);
const isLoading = ref(false);
const isCreating = ref(false);
const isCreateDialogOpen = ref(false);
const isBulkDialogOpen = ref(false);
const isBulkUploading = ref(false);
const isManageAssignmentDialogOpen = ref(false);
const isManaging = ref(false);
const selectedDocuments = ref<DocumentResponse[]>([]);
const isBulkAssignmentDialogOpen = ref(false);
const isBulkManaging = ref(false);
const isBulkProjectAssignmentDialogOpen = ref(false);
const isBulkProjectAssigning = ref(false);

const newDocument = ref<DocumentRequest>({
  title: "",
  text: "",
});

const singleFilePreview = ref<DocumentRequest | null>(null);
const singleFileError = ref("");
const bulkFilesPreview = ref<DocumentRequest[]>([]);
const bulkFilesError = ref("");
const bulkProgress = ref(0);

const currentPage = ref(1);
const totalPages = ref(1);

const users = ref<UserResponse[]>([]);
const documentToManage = ref<DocumentResponse | null>(null);
const managedUserIds = ref<string[]>([]);
const originalAssignedUsers = ref<string[]>([]);
const openManageUsers = ref(false);
const searchTermManage = ref('');
const bulkAssignedUserIds = ref<string[]>([]);
const openBulkUsers = ref(false);
const searchTermBulk = ref('');
const selectedTargetProjectId = ref<string>("");
const availableProjects = ref<ProjectResponse[]>([]);
const openProjectSelect = ref(false);
const searchTermProject = ref('');


async function fetchDocuments(page = 1) {
  isLoading.value = true;
  try {
    let response;

    if (isAllProjects.value) {
      response = await getDocuments(page);
    } else if (selectedProjectId.value) {
      response = await getDocumentsInProject(selectedProjectId.value, page);
    } else {
      response = await getDocuments(page);
    }

    documents.value = response.results;
    currentPage.value = page;
    totalPages.value = Math.max(1, Math.ceil(response.count / 20));
  } catch (error) {
    console.error('Error fetching documents:', error);
    toast.error("Gagal memuat data dokumen");
  } finally {
    isLoading.value = false;
  }
}

async function createSingleDocument() {
  if (!singleFilePreview.value) {
    toast.message("Validasi Error", {
      description: "Pilih file TXT terlebih dahulu",
    });
    return;
  }

  isCreating.value = true;
  try {
    await apiCreateDocument(singleFilePreview.value);
    toast.success(`Dokumen "${singleFilePreview.value.title}" berhasil dibuat`);
    resetSingleForm();
    isCreateDialogOpen.value = false;
    await fetchDocuments(currentPage.value);
  } catch (error) {
    console.error('Error creating document:', error);
    toast.error("Gagal membuat dokumen baru");
  } finally {
    isCreating.value = false;
  }
}

function resetSingleForm() {
  singleFilePreview.value = null;
  singleFileError.value = "";
  // Reset file input
  const fileInput = document.querySelector('input[type="file"][accept=".txt"]') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
}

function handleSingleTxtFile(e: Event) {
  singleFileError.value = "";
  singleFilePreview.value = null;

  const files = (e.target as HTMLInputElement).files;
  if (!files || !files[0]) return;

  const file = files[0];

  if (!file.name.endsWith('.txt')) {
    singleFileError.value = "File harus berformat .txt";
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target?.result as string;
    if (!text || text.trim().length === 0) {
      singleFileError.value = "File tidak boleh kosong";
      return;
    }

    const title = file.name.replace('.txt', '');
    singleFilePreview.value = {
      title,
      text: text.trim()
    };
  };

  reader.onerror = () => {
    singleFileError.value = "Gagal membaca file";
  };

  reader.readAsText(file);
}

function handleBulkTxtFiles(e: Event) {
  bulkFilesError.value = "";
  bulkFilesPreview.value = [];

  const files = (e.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;

  const txtFiles = Array.from(files).filter(file => file.name.endsWith('.txt'));

  if (txtFiles.length === 0) {
    bulkFilesError.value = "Tidak ada file .txt ditemukan dalam folder";
    return;
  }

  let processedCount = 0;
  const totalFiles = txtFiles.length;
  const documents: DocumentRequest[] = [];

  txtFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text && text.trim().length > 0) {
        const title = file.name.replace('.txt', '');
        documents.push({
          title,
          text: text.trim()
        });
      }

      processedCount++;
      if (processedCount === totalFiles) {
        if (documents.length === 0) {
          bulkFilesError.value = "Tidak ada file dengan konten valid ditemukan";
        } else {
          bulkFilesPreview.value = documents;
        }
      }
    };

    reader.onerror = () => {
      processedCount++;
      if (processedCount === totalFiles && documents.length === 0) {
        bulkFilesError.value = "Gagal membaca file-file dalam folder";
      }
    };

    reader.readAsText(file);
  });
}

function resetBulkForm() {
  bulkFilesPreview.value = [];
  bulkFilesError.value = "";
  isBulkDialogOpen.value = false;
  const fileInput = document.querySelector('input[webkitdirectory]') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
}

async function bulkCreateDocuments() {
  if (!bulkFilesPreview.value.length) return;

  isBulkUploading.value = true;
  bulkProgress.value = 0;
  let successCount = 0;
  let failCount = 0;
  const total = bulkFilesPreview.value.length;

  for (const [idx, doc] of bulkFilesPreview.value.entries()) {
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

const availableUsersForManagement = computed(() => {
  if (!users.value || users.value.length === 0) {
    return [];
  }
  return users.value.filter(user =>
    (user.roles.includes("Annotator") || user.roles.includes("Reviewer")) &&
    (user.full_name.toLowerCase().includes(searchTermManage.value.toLowerCase()) ||
     user.username.toLowerCase().includes(searchTermManage.value.toLowerCase())) &&
    !managedUserIds.value.includes(user.id)
  );
});

const availableUsersForBulkAssignment = computed(() => {
  if (!users.value || users.value.length === 0) {
    return [];
  }
  return users.value.filter(user =>
    (user.roles.includes("Annotator") || user.roles.includes("Reviewer")) &&
    (user.full_name.toLowerCase().includes(searchTermBulk.value.toLowerCase()) ||
     user.username.toLowerCase().includes(searchTermBulk.value.toLowerCase())) &&
    !bulkAssignedUserIds.value.includes(user.id)
  );
});

function getUserName(userId: string) {
  const user = users.value.find(u => u.id === userId);
  return user ? user.full_name : 'Unknown User';
}

function removeUserFromManagement(userId: string) {
  const index = managedUserIds.value.indexOf(userId);
  if (index > -1) {
    managedUserIds.value.splice(index, 1);
  }
}

function removeUserFromBulkAssignment(userId: string) {
  const index = bulkAssignedUserIds.value.indexOf(userId);
  if (index > -1) {
    bulkAssignedUserIds.value.splice(index, 1);
  }
}

async function fetchUsers() {
  try {
    let response;

    if (isAllProjects.value) {
      response = await getUsers();
    } else if (selectedProjectId.value) {
      response = await getUsersInProject(selectedProjectId.value);
    } else {
      response = await getUsers();
    }

    users.value = response.results;
  } catch (error) {
    console.error('Error fetching users:', error);
    toast.error("Gagal memuat daftar user");
  }
}

async function fetchProjects() {
  try {
    const response = await getProjects();
    availableProjects.value = response.results;
  } catch (error) {
    console.error('Error fetching projects:', error);
    toast.error("Gagal memuat daftar project");
  }
}

function getProjectName(projectId: string) {
  const project = availableProjects.value.find(p => p.id.toString() === projectId);
  return project ? project.name : 'Unknown Project';
}

function showBulkAssignmentDialog() {
  bulkAssignedUserIds.value = [];
  searchTermBulk.value = '';
  isBulkAssignmentDialogOpen.value = true;
}

function showBulkProjectAssignmentDialog() {
  selectedTargetProjectId.value = "";
  searchTermProject.value = '';
  isBulkProjectAssignmentDialogOpen.value = true;
}

function cancelManageAssignment() {
  documentToManage.value = null;
  managedUserIds.value = [];
  originalAssignedUsers.value = [];
  searchTermManage.value = '';
  isManageAssignmentDialogOpen.value = false;
}

function cancelBulkAssignment() {
  bulkAssignedUserIds.value = [];
  searchTermBulk.value = '';
  isBulkAssignmentDialogOpen.value = false;
}

function cancelBulkProjectAssignment() {
  selectedTargetProjectId.value = "";
  searchTermProject.value = '';
  isBulkProjectAssignmentDialogOpen.value = false;
}

async function saveAssignmentChanges() {
  if (!documentToManage.value) {
    toast.error("Tidak ada dokumen yang dipilih");
    return;
  }

  isManaging.value = true;
  try {
    toast.promise(
      (async () => {
        const currentAssigned = originalAssignedUsers.value;
        const newAssigned = managedUserIds.value;

        const toAssign = newAssigned.filter(id => !currentAssigned.includes(id));
        const toUnassign = currentAssigned.filter(id => !newAssigned.includes(id));

        let successCount = 0;
        let failCount = 0;

        for (const userId of toAssign) {
          try {
            await apiAssignDocument({
              document_id: documentToManage.value!.id,
              user_id: userId
            });
            successCount++;
          } catch (error) {
            failCount++;
            console.error(`Failed to assign to user ${userId}:`, error);
          }
        }

        for (const userId of toUnassign) {
          try {
            await apiUnassignDocument({
              document_id: documentToManage.value!.id,
              user_id: userId
            });
            successCount++;
          } catch (error) {
            failCount++;
            console.error(`Failed to unassign from user ${userId}:`, error);
          }
        }

        return {
          successCount,
          failCount,
          totalChanges: toAssign.length + toUnassign.length,
          assigned: toAssign.length,
          unassigned: toUnassign.length
        };
      })(),
      {
        loading: "Menyimpan perubahan assignment...",
        success: (result: { successCount: number; failCount: number; totalChanges: number; assigned: number; unassigned: number }) => {
          fetchDocuments(currentPage.value);
          cancelManageAssignment();

          if (result.failCount === 0) {
            if (result.totalChanges === 0) {
              return "Tidak ada perubahan assignment.";
            }
            return `Assignment berhasil diperbarui: ${result.assigned} user ditambah, ${result.unassigned} user dihapus.`;
          } else {
            return `Assignment diperbarui: ${result.successCount} berhasil, ${result.failCount} gagal.`;
          }
        },
        error: "Gagal menyimpan perubahan assignment",
      }
    );
  } catch (error) {
    console.error('Error managing assignment:', error);
  } finally {
    isManaging.value = false;
  }
}

async function saveBulkAssignmentChanges() {
  if (selectedDocuments.value.length === 0) {
    toast.error("Tidak ada dokumen yang dipilih");
    return;
  }

  isBulkManaging.value = true;
  try {
    toast.promise(
      (async () => {
        let successCount = 0;
        let failCount = 0;

        for (const doc of selectedDocuments.value) {
          const usersToAssign = bulkAssignedUserIds.value.filter(userId =>
            !doc.assigned_to.includes(parseInt(userId))
          );

          if (usersToAssign.length > 0) {
            try {
              await apiBulkAssignDocument(doc.id, usersToAssign);
              successCount += usersToAssign.length;
            } catch (error) {
              failCount += usersToAssign.length;
              console.error(`Failed to bulk assign to document ${doc.id}:`, error);
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
          cancelBulkAssignment();

          if (result.failCount === 0) {
            return `Assignment berhasil disimpan: ${result.successCount} assignment baru ditambahkan.`;
          } else {
            return `Assignment disimpan: ${result.successCount} berhasil, ${result.failCount} gagal.`;
          }
        },
        error: "Gagal menyimpan bulk assignment",
      }
    );
  } catch (error) {
    console.error('Error bulk managing assignment:', error);
  } finally {
    isBulkManaging.value = false;
  }
}

async function saveBulkProjectAssignment() {
  if (selectedDocuments.value.length === 0 || !selectedTargetProjectId.value) {
    toast.error("Pilih project target terlebih dahulu");
    return;
  }

  isBulkProjectAssigning.value = true;
  try {
    toast.promise(
      (async () => {
        const targetProject = availableProjects.value.find(p => p.id.toString() === selectedTargetProjectId.value);
        if (!targetProject) {
          throw new Error("Project tidak ditemukan");
        }

        const currentDocumentIds = targetProject.documents || [];

        const selectedDocumentIds = selectedDocuments.value.map(doc => doc.id);
        const updatedDocumentIds = [...new Set([...currentDocumentIds, ...selectedDocumentIds])];

        await assignDocumentsToProject(parseInt(selectedTargetProjectId.value), updatedDocumentIds);

        return {
          projectName: targetProject.name,
          documentCount: selectedDocumentIds.length,
          totalDocuments: updatedDocumentIds.length
        };
      })(),
      {
        loading: "Mengassign dokumen ke project...",
        success: (result: { projectName: string; documentCount: number; totalDocuments: number }) => {
          fetchDocuments(currentPage.value);
          selectedDocuments.value = [];
          cancelBulkProjectAssignment();
          return `${result.documentCount} dokumen berhasil di-assign ke project "${result.projectName}". Total dokumen di project: ${result.totalDocuments}`;
        },
        error: "Gagal mengassign dokumen ke project",
      }
    );
  } catch (error) {
    console.error('Error bulk assigning to project:', error);
  } finally {
    isBulkProjectAssigning.value = false;
  }
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

const documentColumns = computed(() => createColumns(getUserName, handleDeleteDocument));

onMounted(async () => {
  await fetchUsers();
  await fetchProjects();
  await fetchDocuments(currentPage.value);
});


watch(selectedProjectId, async () => {
  await fetchUsers();
  await fetchDocuments(1);
}, { immediate: false });

function handleSelectionChange(selection: DocumentResponse[]) {
  selectedDocuments.value = selection;
}

watch(currentPage, () => {
  selectedDocuments.value = [];
});

const pageTitle = computed(() => {
  if (selectedProject.value) {
    return `Kelola Dokumen - ${selectedProject.value.name}`;
  }
  return "Kelola Dokumen - Semua Project";
});

useHead({
  title: pageTitle.value + " - ANOTA",
  meta: [
    { name: "description", content: "Halaman kelola dokumen aplikasi ANOTA." },
  ],
});
</script>