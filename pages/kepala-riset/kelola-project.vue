<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter bg-gray-50">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Kelola Project</h1>
        <p class="text-gray-600">
          Buat dan kelola project penelitian untuk proses anotasi
        </p>
        <div v-if="selectedProject" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-800">
            <strong>Project terpilih:</strong> {{ selectedProject.name }}
          </p>
          <p class="text-xs text-blue-600 mt-1">
            Menampilkan project yang dipilih dalam konteks
          </p>
        </div>
        <div v-else class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p class="text-sm text-gray-600">
            Menampilkan semua project
          </p>
        </div>
      </div>

      <div class="mb-6">
        <Dialog v-model:open="isCreateDialogOpen">
          <div class="flex gap-3 items-start">
            <DialogTrigger as-child>
              <Button class="flex items-center gap-2">
                <Plus class="w-4 h-4" />
                Tambah Project Baru
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent class="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Project Baru</DialogTitle>
              <DialogDescription>
                Masukkan informasi project baru. Admin dapat ditugaskan sekarang
                atau nanti.
              </DialogDescription>
            </DialogHeader>
            <div class="grid gap-6 py-4">
              <!-- Basic Project Info -->
              <div class="grid gap-4">
                <h3 class="text-lg font-medium text-left">
                  Informasi Dasar Project
                </h3>
                <div class="grid gap-2">
                  <label for="name" class="text-sm font-medium text-left"
                    >Nama Project <span class="text-red-400">*</span></label
                  >
                  <Input
                    id="name"
                    v-model="newProject.name"
                    placeholder="Nama Project"
                    class="w-full"
                  />
                </div>
                <div class="grid gap-2">
                  <label for="description" class="text-sm font-medium text-left"
                    >Deskripsi</label
                  >
                  <Textarea
                    id="description"
                    v-model="newProject.description"
                    placeholder="Deskripsi project..."
                    class="w-full min-h-[100px]"
                  />
                </div>
              </div>

              <!-- Admin Assignment (Optional) -->
              <div class="grid gap-4">
                <h3 class="text-lg font-medium text-left">
                  Assign Admin
                  <span class="text-sm text-gray-400 font-normal"
                    >(Opsional)</span
                  >
                </h3>
                <div class="grid gap-2">
                  <label
                    for="admin_select"
                    class="text-sm font-medium text-left"
                    >Admin yang Ditugaskan</label
                  >
                  <Combobox
                    v-model="newProjectAdminIds"
                    v-model:open="openCreateAdmins"
                    :ignore-filter="true"
                  >
                    <ComboboxAnchor as-child>
                      <TagsInput
                        v-model="newProjectAdminIds"
                        class="px-2 w-full"
                      >
                        <div class="flex flex-col">
                          <div
                            v-if="newProjectAdminIds.length"
                            class="flex gap-2 flex-wrap items-center p-1 font-semibold"
                          >
                            <TagsInputItem
                              v-for="adminId in newProjectAdminIds"
                              :key="adminId"
                              :value="getAdminName(adminId)"
                            >
                              <TagsInputItemText class="text-xs">{{
                                getAdminName(adminId)
                              }}</TagsInputItemText>
                              <TagsInputItemDelete
                                @click="removeAdminFromNewProject(adminId)"
                              />
                            </TagsInputItem>
                          </div>
                          <ComboboxInput
                            v-model="searchTermCreateAdmin"
                            as-child
                          >
                            <TagsInputInput
                              placeholder="Pilih admin (opsional)..."
                              class="w-full"
                              @keydown.enter.prevent
                            />
                          </ComboboxInput>
                        </div>
                      </TagsInput>
                      <ComboboxList
                        class="w-[--reka-popper-anchor-width]"
                        align="start"
                      >
                        <ComboboxEmpty />
                        <ComboboxGroup>
                          <ComboboxItem
                            v-for="admin in availableAdminsForNewProject"
                            :key="admin.id"
                            :value="admin.id"
                            @select.prevent="
                              (ev) => {
                                if (typeof ev.detail.value === 'string') {
                                  searchTermCreateAdmin = '';
                                  newProjectAdminIds.push(ev.detail.value);
                                }
                                if (availableAdminsForNewProject.length === 0) {
                                  openCreateAdmins = false;
                                }
                              }
                            "
                          >
                            {{ admin.full_name }} ({{ admin.username }})
                          </ComboboxItem>
                        </ComboboxGroup>
                      </ComboboxList>
                    </ComboboxAnchor>
                  </Combobox>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" @click="resetForm"> Reset </Button>
              <Button
                @click="createProject"
                :disabled="isCreating"
                class="flex items-center gap-2"
              >
                <Plus v-if="!isCreating" class="w-4 h-4" />
                <Loader2 v-else class="w-4 h-4 animate-spin" />
                {{ isCreating ? "Menambah..." : "Tambah Project" }}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <!-- Edit Project Dialog -->
    <Dialog v-model:open="isEditDialogOpen">
      <DialogContent class="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update informasi project. Admin dapat diubah sesuai kebutuhan.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-6 py-4">
          <div class="grid gap-4">
            <h3 class="text-lg font-medium text-left">Informasi Dasar Project</h3>
            <div class="grid gap-2">
              <label for="edit_name" class="text-sm font-medium text-left">Nama Project <span class="text-red-400">*</span></label>
              <Input id="edit_name" v-model="editingProject.name" placeholder="Nama Project" class="w-full" />
            </div>
            <div class="grid gap-2">
              <label for="edit_description" class="text-sm font-medium text-left">Deskripsi</label>
              <Textarea id="edit_description" v-model="editingProject.description" placeholder="Deskripsi project..." class="w-full min-h-[100px]" />
            </div>
          </div>

          <div class="grid gap-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-left">Admin yang Ditugaskan <span class="text-sm text-gray-400 font-normal">(Opsional)</span></h3>
              <div class="text-xs text-gray-500">
                {{ adminAssignmentStats.available }} dari {{ adminAssignmentStats.total }} admin tersedia
              </div>
            </div>
            <div class="grid gap-2">
              <div class="text-xs text-gray-500 mb-1">
                Admin hanya dapat ditugaskan ke satu project. Pilih admin yang belum ditugaskan.
              </div>
              <Combobox v-model="editingProjectAdminIds" v-model:open="openEditAdmins" :ignore-filter="true">
                <ComboboxAnchor as-child>
                  <TagsInput v-model="editingProjectAdminIds" class="px-2 w-full">
                    <div class="flex flex-col">
                      <div v-if="editingProjectAdminIds.length" class="flex gap-2 flex-wrap items-center p-1 font-semibold">
                        <TagsInputItem v-for="adminId in editingProjectAdminIds" :key="adminId" :value="getAdminName(adminId)">
                          <TagsInputItemText class="text-xs">{{ getAdminName(adminId) }}</TagsInputItemText>
                          <TagsInputItemDelete @click="removeAdminFromEditingProject(adminId)" />
                        </TagsInputItem>
                      </div>
                      <ComboboxInput v-model="searchTermEditAdmin" as-child>
                        <TagsInputInput placeholder="Pilih admin (opsional)..." class="w-full" @keydown.enter.prevent />
                      </ComboboxInput>
                    </div>
                  </TagsInput>
                  <ComboboxList class="w-[--reka-popper-anchor-width]" align="start">
                    <ComboboxEmpty />
                    <ComboboxGroup>
                      <ComboboxItem
                        v-for="admin in availableAdminsForEditingProject"
                        :key="admin.id"
                        :value="admin.id"
                        @select.prevent="(ev) => {
                          if (typeof ev.detail.value === 'string') {
                            searchTermEditAdmin = ''
                            editingProjectAdminIds.push(ev.detail.value)
                          }
                        }">
                        {{ admin.full_name }}
                      </ComboboxItem>
                    </ComboboxGroup>
                  </ComboboxList>
                </ComboboxAnchor>
              </Combobox>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="cancelEdit">
            Batal
          </Button>
          <Button @click="updateProject" :disabled="isUpdating" class="flex items-center gap-2">
            <Check v-if="!isUpdating" class="w-4 h-4" />
            <Loader2 v-else class="w-4 h-4 animate-spin" />
            {{ isUpdating ? 'Mengupdate...' : 'Update Project' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="isDeleteDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus project "{{ projectToDelete?.name }}"?
            Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="cancelDelete">
            Batal
          </Button>
          <Button variant="destructive" @click="confirmDelete" :disabled="isDeleting" class="flex items-center gap-2">
            <Trash2 v-if="!isDeleting" class="w-4 h-4" />
            <Loader2 v-else class="w-4 h-4 animate-spin" />
            {{ isDeleting ? 'Menghapus...' : 'Hapus' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Export Documents Dialog -->
    <Dialog v-model:open="isExportDialogOpen">
      <DialogContent class="sm:max-w-4xl max-h-[85vh]">
        <DialogHeader class="pb-4">
          <DialogTitle class="text-xl font-semibold">Export Dokumen - {{ projectToExport?.name }}</DialogTitle>
          <DialogDescription class="text-gray-600">
            Export dokumen yang sudah dianotasi ke file ZIP. Hanya dokumen dengan status "Sudah Dianotasi" atau lebih yang bisa diexport.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-6 max-h-[55vh] overflow-y-auto">
          <!-- Loading state -->
          <div v-if="isLoadingDocuments" class="flex items-center justify-center py-12">
            <Loader2 class="w-6 h-6 animate-spin mr-2" />
            <span class="text-gray-600">Memuat dokumen...</span>
          </div>

          <div v-else class="space-y-6">
            <!-- Export format selection -->
            <div class="bg-gray-50 rounded-lg p-4">
              <label class="block text-sm font-semibold text-gray-900 mb-3">Format Export</label>
              <div class="flex gap-6">
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="exportFormat"
                    value="parallel"
                    class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span class="text-sm font-medium text-gray-700">Parallel TSV (original → corrected)</span>
                </label>
                <label class="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="exportFormat"
                    value="m2"
                    class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span class="text-sm font-medium text-gray-700">M2 Format</span>
                </label>
              </div>
            </div>

            <!-- Document selection section -->
            <div class="space-y-4">
              <!-- Selection summary and controls -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    @click="selectAllExportableDocuments"
                    :disabled="exportableDocuments.length === 0"
                    class="flex items-center gap-2"
                  >
                    <CheckCircle class="w-4 h-4" />
                    Pilih Semua
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    @click="deselectAllDocuments"
                    :disabled="selectedDocumentsForExport.length === 0"
                    class="flex items-center gap-2"
                  >
                    <XCircle class="w-4 h-4" />
                    Batal Pilihan
                  </Button>
                </div>
                <div class="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                  {{ selectedDocumentsForExport.length }} / {{ exportableDocuments.length }} dipilih
                </div>
              </div>

              <!-- Exportable documents -->
              <div v-if="exportableDocuments.length > 0" class="space-y-3">
                <div class="flex items-center gap-2">
                  <CheckCircle class="w-5 h-5 text-green-600" />
                  <h4 class="font-semibold text-gray-900">
                    Dokumen Siap Export ({{ exportableDocuments.length }})
                  </h4>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  <div class="divide-y divide-gray-100">
                    <label
                      v-for="document in exportableDocuments"
                      :key="document.id"
                      class="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      <input
                        type="checkbox"
                        :checked="selectedDocumentsForExport.some(d => d.id === document.id)"
                        @change="toggleDocumentSelection(document)"
                        class="mr-4 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div class="flex-1 min-w-0">
                        <div class="font-medium text-gray-900 truncate">{{ document.title }}</div>
                        <div class="flex items-center gap-3 mt-1 text-sm text-gray-600">
                          <span :class="[getDocumentStatusInfo(document.status).color, 'font-medium']">
                            {{ getDocumentStatusInfo(document.status).text }}
                          </span>
                          <span class="text-gray-400">•</span>
                          <span>{{ document.jumlah_sentence }} kalimat</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Non-exportable documents info -->
              <div v-if="nonExportableDocuments.length > 0" class="space-y-3">
                <div class="flex items-center gap-2">
                  <XCircle class="w-5 h-5 text-gray-400" />
                  <h4 class="font-semibold text-gray-600">
                    Dokumen Belum Siap Export ({{ nonExportableDocuments.length }})
                  </h4>
                </div>
                <div class="bg-gray-50 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                  <div class="divide-y divide-gray-100">
                    <div
                      v-for="document in nonExportableDocuments"
                      :key="document.id"
                      class="flex items-center p-4 opacity-60"
                    >
                      <FileText class="w-4 h-4 mr-4 text-gray-400" />
                      <div class="flex-1 min-w-0">
                        <div class="font-medium text-gray-700 truncate">{{ document.title }}</div>
                        <div class="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span :class="[getDocumentStatusInfo(document.status).color, 'font-medium']">
                            {{ getDocumentStatusInfo(document.status).text }}
                          </span>
                          <span class="text-gray-400">•</span>
                          <span>{{ document.jumlah_sentence }} kalimat</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty state -->
              <div v-if="documentsInProject.length === 0" class="text-center py-12">
                <FileText class="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p class="text-gray-500 text-lg font-medium">Tidak ada dokumen dalam project ini</p>
                <p class="text-gray-400 text-sm mt-1">Tambahkan dokumen terlebih dahulu untuk melakukan export</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter class="flex items-center justify-between pt-6 border-t">
          <div class="text-sm text-gray-600">
            <span v-if="selectedDocumentsForExport.length > 0" class="font-medium">
              {{ selectedDocumentsForExport.length }} dokumen akan diexport
            </span>
            <span v-else class="text-gray-400">
              Pilih dokumen untuk melanjutkan export
            </span>
          </div>
          <div class="flex items-center gap-3">
            <Button variant="outline" @click="closeExportDialog" class="px-6">
              Batal
            </Button>
            <Button
              @click="exportSelectedDocuments"
              :disabled="selectedDocumentsForExport.length === 0 || isExporting"
              class="flex items-center gap-2 px-6"
            >
              <Download v-if="!isExporting" class="w-4 h-4" />
              <Loader2 v-else class="w-4 h-4 animate-spin" />
              {{ isExporting ? 'Mengexport...' : 'Export ke ZIP' }}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

      <div v-if="isLoading" class="text-gray-600 mb-4">
        Memuat data project...
      </div>

      <div
        v-if="projects.length"
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6"
      >
        <div class="rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow class="bg-gray-50 hover:bg-gray-50">
                <TableHead class="font-medium text-left"
                  >Nama Project</TableHead
                >
                <TableHead class="font-medium text-left">Deskripsi</TableHead>
                <TableHead class="font-medium text-left"
                  >Admin yang Ditugaskan</TableHead
                >
                <TableHead class="font-medium text-left"
                  >Tanggal Dibuat</TableHead
                >
                <TableHead class="font-medium text-left"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="project in filteredProjects" :key="project.id" class="border-gray-200 hover:bg-gray-50">
                <TableCell class="font-semibold text-gray-900 text-left">{{ project.name }}</TableCell>
                <TableCell class="text-gray-700 text-left max-w-xs truncate">{{ project.description || '-' }}</TableCell>
                <TableCell class="text-left">
                  <div class="flex flex-wrap gap-1">
                    <Badge
                      v-for="adminId in project.assigned_admins"
                      :key="adminId"
                      variant="blue"
                      class="font-semibold"
                    >
                      {{ getAdminName(adminId) }}
                    </Badge>
                    <span
                      v-if="project.assigned_admins.length === 0"
                      class="text-gray-500 text-sm"
                      >Belum ada admin</span
                    >
                  </div>
                </TableCell>
                <TableCell class="text-gray-700 text-left">{{
                  formatDate(project.created_at)
                }}</TableCell>
                <TableCell class="flex w-full justify-end">
                  <div class="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      @click="showExportDialog(project)"
                      class="px-4 py-1 font-semibold"
                    >
                      <Download class="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      @click="editProject(project)"
                      class="px-4 py-1 font-semibold"
                    >
                      <Pencil class="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      @click="showDeleteDialog(project)"
                      class="px-4 py-1 font-semibold"
                    >
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
      <div v-if="projects.length" class="mt-4 flex justify-center">
        <Pagination
          :page="currentPage"
          :total="totalPages"
          :items-per-page="projects.length > 0 ? projects.length : 1"
          @update:page="fetchProjects"
        >
          <PaginationContent>
            <PaginationPrevious
              :disabled="currentPage === 1"
              @click="fetchProjects(currentPage - 1)"
            >
              <ArrowLeft class="w-4 h-4" />
            </PaginationPrevious>
            <template v-for="(page, idx) in paginationPages" :key="idx">
              <PaginationItem
                v-if="typeof page === 'number'"
                :value="page"
                :is-active="page === currentPage"
                @click="fetchProjects(page)"
                >{{ page }}</PaginationItem
              >
              <PaginationEllipsis v-else>
                <MoreHorizontal class="w-4 h-4" />
              </PaginationEllipsis>
            </template>
            <PaginationNext
              :disabled="currentPage === totalPages"
              @click="fetchProjects(currentPage + 1)"
            >
              <ArrowRight class="w-4 h-4" />
            </PaginationNext>
          </PaginationContent>
        </Pagination>
      </div>

      <div
        v-if="!projects.length && !isLoading"
        class="bg-white border border-gray-200 rounded-xl p-6 text-center"
      >
        <span class="text-gray-500">Tidak ada project ditemukan.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useProjectsApi } from "~/data/projects";
import { useUsersApi } from "~/data/users";
import { useDocumentsApi } from "~/data/documents";
import { useProjectContext } from "~/composables/project-context";
import type { ProjectResponse, ProjectRequest, UserResponse, DocumentResponse } from "~/types/api";
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
  TableRow,
} from "~/components/ui/table";
import {
  TagsInput,
  TagsInputItem,
  TagsInputInput,
  TagsInputItemDelete,
  TagsInputItemText,
} from "~/components/ui/tags-input";
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "~/components/ui/pagination";
import {
  Plus,
  Loader2,
  Check,
  Pencil,
  Trash2,
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  UserPlus,
  Download,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

const {
  getProjects,
  createProject: apiCreateProject,
  updateProject: apiUpdateProject,
  deleteProject: apiDeleteProject,
  assignAdmin: apiAssignAdmin,
  unassignAdmin: apiUnassignAdmin,
  getDocumentsInProject,
} = useProjectsApi();

const { getAllUsers } = useUsersApi();
const { exportDocument: exportDocumentApi } = useDocumentsApi();
const { selectedProject, clearSelectedProject, selectedProjectId, isAllProjects } = useProjectContext();

const projects = ref<ProjectResponse[]>([]);
const adminUsers = ref<UserResponse[]>([]);
const isLoading = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const isExportDialogOpen = ref(false);
const isExporting = ref(false);
const projectToExport = ref<ProjectResponse | null>(null);
const documentsInProject = ref<DocumentResponse[]>([]);
const selectedDocumentsForExport = ref<DocumentResponse[]>([]);
const exportFormat = ref<"parallel" | "m2">("parallel");
const isLoadingDocuments = ref(false);

const newProject = ref<ProjectRequest>({
  name: "",
  description: "",
});

const editingProject = ref<Partial<ProjectResponse>>({
  name: "",
  description: "",
});

const projectToDelete = ref<ProjectResponse | null>(null);

const newProjectAdminIds = ref<string[]>([]);
const openCreateAdmins = ref(false);
const searchTermCreateAdmin = ref("");

const editingProjectAdminIds = ref<string[]>([]);
const originalProjectAdminIds = ref<string[]>([]);
const openEditAdmins = ref(false);
const searchTermEditAdmin = ref("");

const currentPage = ref(1);
const totalPages = ref(1);

const availableAdmins = computed(() => {
  return adminUsers.value.filter((user) => user.roles.includes("Admin"));
});

// Filtered projects based on project context
const filteredProjects = computed(() => {
  if (isAllProjects.value) {
    return projects.value;
  } else if (selectedProjectId.value) {
    return projects.value.filter((project: ProjectResponse) => project.id === selectedProjectId.value);
  }
  return projects.value;
});

// Get admin IDs that are already assigned to other projects
const getAssignedAdminIds = (excludeProjectId?: number) => {
  const assignedAdminIds = new Set<string>();
  projects.value.forEach(project => {
    if (excludeProjectId && project.id === excludeProjectId) {
      return; // Skip the current editing project
    }
    project.assigned_admins.forEach(adminId => {
      assignedAdminIds.add(adminId);
    });
  });
  return assignedAdminIds;
};

const availableAdminsForNewProject = computed(() => {
    if (!availableAdmins.value || availableAdmins.value.length === 0) {
        return [];
    }

    const assignedAdminIds = getAssignedAdminIds();

    return availableAdmins.value.filter(admin =>
        (admin.full_name.toLowerCase().includes(searchTermCreateAdmin.value.toLowerCase()) ||
         admin.username.toLowerCase().includes(searchTermCreateAdmin.value.toLowerCase())) &&
        !newProjectAdminIds.value.includes(admin.id) &&
        !assignedAdminIds.has(admin.id) // Exclude admins already assigned to other projects
    );
});

const availableAdminsForEditingProject = computed(() => {
    if (!availableAdmins.value || availableAdmins.value.length === 0) {
        return [];
    }

    // Exclude admins assigned to other projects (but allow admins from current editing project)
    const assignedAdminIds = getAssignedAdminIds(editingProject.value.id);

    return availableAdmins.value.filter(admin =>
        (admin.full_name.toLowerCase().includes(searchTermEditAdmin.value.toLowerCase()) ||
         admin.username.toLowerCase().includes(searchTermEditAdmin.value.toLowerCase())) &&
        !editingProjectAdminIds.value.includes(admin.id) &&
        !assignedAdminIds.has(admin.id) // Exclude admins already assigned to other projects
    );
});

// Helper to get project name for an admin
const getAdminProjectAssignment = (adminId: string): string | null => {
  const assignedProject = projects.value.find(project =>
    project.assigned_admins.includes(adminId)
  );
  return assignedProject ? assignedProject.name : null;
};

// Helper to get admin assignment statistics
const adminAssignmentStats = computed(() => {
  const totalAdmins = availableAdmins.value.length;
  const assignedAdmins = getAssignedAdminIds().size;
  const freeAdmins = totalAdmins - assignedAdmins;
  return {
    total: totalAdmins,
    assigned: assignedAdmins,
    available: freeAdmins
  };
});

const paginationPages = computed(() => {
  const pages: (number | string)[] = [];
  if (totalPages.value <= 5) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i);
  } else if (currentPage.value <= 3) {
    pages.push(1, 2, 3, 4, 5, "ellipsis", totalPages.value);
  } else if (currentPage.value >= totalPages.value - 2) {
    pages.push(1, "ellipsis");
    for (let i = totalPages.value - 4; i <= totalPages.value; i++)
      pages.push(i);
  } else {
    pages.push(
      1,
      "ellipsis",
      currentPage.value - 1,
      currentPage.value,
      currentPage.value + 1,
      "ellipsis",
      totalPages.value
    );
  }
  return pages;
});

function getAdminName(adminId: string) {
  const admin = adminUsers.value.find((user) => user.id === adminId);
  return admin ? admin.full_name : "Unknown";
}

function removeAdminFromNewProject(adminId: string) {
  const index = newProjectAdminIds.value.indexOf(adminId);
  if (index > -1) {
    newProjectAdminIds.value.splice(index, 1);
  }
}

function removeAdminFromEditingProject(adminId: string) {
  const index = editingProjectAdminIds.value.indexOf(adminId);
  if (index > -1) {
    editingProjectAdminIds.value.splice(index, 1);
  }
}

async function fetchAdminUsers() {
  try {
    const response = await getAllUsers();
    adminUsers.value = response;
  } catch (error) {
    console.error("Error fetching admin users:", error);
    toast.error("Gagal memuat daftar admin");
  }
}

async function fetchProjects(page = 1) {
  isLoading.value = true;
  try {
    const response = await getProjects(page);
    projects.value = response.results;
    currentPage.value = page;
    totalPages.value = Math.max(1, Math.ceil(response.count / 20));
  } catch (error) {
    console.error("Error fetching projects:", error);
    toast.error("Gagal memuat data project");
  } finally {
    isLoading.value = false;
  }
}

async function createProject() {
  if (!newProject.value.name.trim()) {
    toast.error("Nama project harus diisi");
    return;
  }

  isCreating.value = true;
  try {
    toast.promise(
      (async () => {
        const projectResult = await apiCreateProject(newProject.value);

        for (const adminId of newProjectAdminIds.value) {
          await apiAssignAdmin(projectResult.id, { user_id: adminId });
        }

        return projectResult;
      })(),
      {
        loading: "Menambah project...",
        success: (result: ProjectResponse) => {
          resetForm();
          fetchProjects(currentPage.value);

          const adminCount = newProjectAdminIds.value.length;

          if (adminCount > 0) {
            return `Project ${result.name} berhasil dibuat dengan ${adminCount} admin.`;
          } else {
            return `Project ${result.name} berhasil dibuat.`;
          }
        },
        error: "Gagal membuat project baru",
      }
    );
  } catch (error) {
    console.error("Error creating project:", error);
  } finally {
    isCreating.value = false;
  }
}

async function updateProject() {
  if (!editingProject.value.id || !editingProject.value.name?.trim()) {
    toast.error("Nama project harus diisi");
    return;
  }

  isUpdating.value = true;
  try {
    toast.promise(
      (async () => {
        const updateData = {
          name: editingProject.value.name,
          description: editingProject.value.description,
        };
        const projectResult = await apiUpdateProject(
          editingProject.value.id!,
          updateData
        );

        const currentAdmins = originalProjectAdminIds.value;
        const toAdd = editingProjectAdminIds.value.filter(
          (id) => !currentAdmins.includes(id)
        );
        const toRemove = currentAdmins.filter(
          (id) => !editingProjectAdminIds.value.includes(id)
        );

        let assignSuccessCount = 0;
        let unassignSuccessCount = 0;
        let failCount = 0;

        for (const adminId of toAdd) {
          try {
            await apiAssignAdmin(editingProject.value.id!, { user_id: adminId });
            assignSuccessCount++;
          } catch (error) {
            console.error(`Error assigning admin ${adminId}:`, error);
            failCount++;
          }
        }

        for (const adminId of toRemove) {
          try {
            await apiUnassignAdmin(editingProject.value.id!, {
              user_id: adminId,
            });
            unassignSuccessCount++;
          } catch (error) {
            console.error(`Error unassigning admin ${adminId}:`, error);
            failCount++;
          }
        }

        return { projectResult, assignSuccessCount, unassignSuccessCount, failCount };
      })(),
      {
        loading: "Mengupdate project...",
        success: (result: { 
          projectResult: ProjectResponse; 
          assignSuccessCount: number; 
          unassignSuccessCount: number; 
          failCount: number 
        }) => {
          fetchProjects(currentPage.value);
          isEditDialogOpen.value = false;
          clearSelectedProject();
          
          const messages = [];
          if (result.assignSuccessCount > 0) {
            messages.push(`${result.assignSuccessCount} admin ditambahkan`);
          }
          if (result.unassignSuccessCount > 0) {
            messages.push(`${result.unassignSuccessCount} admin dihapus`);
          }

          let successMessage = `Project ${result.projectResult.name} berhasil diupdate`;
          if (messages.length > 0) {
            successMessage += `. ${messages.join(", ")}`;
          }

          if (result.failCount > 0) {
            successMessage += `. ${result.failCount} operasi admin gagal`;
          }

          return successMessage;
        },
        error: "Gagal mengupdate project",
      }
    );
  } catch (error) {
    console.error("Error updating project:", error);
  } finally {
    isUpdating.value = false;
  }
}

function editProject(project: ProjectResponse) {
  editingProject.value = {
    id: project.id,
    name: project.name,
    description: project.description,
  };
  editingProjectAdminIds.value = [...project.assigned_admins];
  originalProjectAdminIds.value = [...project.assigned_admins];
  isEditDialogOpen.value = true;
}

function cancelEdit() {
  editingProject.value = {
    name: "",
    description: "",
  };
  editingProjectAdminIds.value = [];
  originalProjectAdminIds.value = [];
  isEditDialogOpen.value = false;
}

function showDeleteDialog(project: ProjectResponse) {
  projectToDelete.value = project;
  isDeleteDialogOpen.value = true;
}

function cancelDelete() {
  projectToDelete.value = null;
  isDeleteDialogOpen.value = false;
}

async function confirmDelete() {
  if (!projectToDelete.value) return;

  isDeleting.value = true;
  try {
    await toast.promise(apiDeleteProject(projectToDelete.value.id), {
      loading: "Menghapus project...",
      success: "Project berhasil dihapus",
      error: "Gagal menghapus project",
    });

    const response = await getProjects(currentPage.value);
    if (response.results.length === 0 && currentPage.value > 1) {
      await fetchProjects(currentPage.value - 1);
    } else {
      await fetchProjects(currentPage.value);
    }

    isDeleteDialogOpen.value = false;
    projectToDelete.value = null;
  } catch (error) {
    console.error("Error deleting project:", error);
  } finally {
    isDeleting.value = false;
  }
}

function resetForm() {
  newProject.value = {
    name: "",
    description: "",
  };
  newProjectAdminIds.value = [];
  searchTermCreateAdmin.value = "";
  isCreateDialogOpen.value = false;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID");
}

async function showExportDialog(project: ProjectResponse) {
  projectToExport.value = project;
  isLoadingDocuments.value = true;
  isExportDialogOpen.value = true;
  selectedDocumentsForExport.value = [];

  try {
    const documents = await getDocumentsInProject(project.id);
    documentsInProject.value = documents || [];
  } catch (error) {
    console.error("Error fetching project documents:", error);
    toast.error("Gagal memuat dokumen project");
    isExportDialogOpen.value = false;
  } finally {
    isLoadingDocuments.value = false;
  }
}function closeExportDialog() {
  isExportDialogOpen.value = false;
  projectToExport.value = null;
  documentsInProject.value = [];
  selectedDocumentsForExport.value = [];
  exportFormat.value = "parallel";
}

function toggleDocumentSelection(document: DocumentResponse) {
  const index = selectedDocumentsForExport.value.findIndex(d => d.id === document.id);
  if (index > -1) {
    selectedDocumentsForExport.value.splice(index, 1);
  } else {
    selectedDocumentsForExport.value.push(document);
  }
}

function selectAllExportableDocuments() {
  selectedDocumentsForExport.value = [...exportableDocuments.value];
}

function deselectAllDocuments() {
  selectedDocumentsForExport.value = [];
}

async function exportSelectedDocuments() {
  if (selectedDocumentsForExport.value.length === 0) {
    if (exportableDocuments.value.length === 0) {
      toast.error("Tidak ada dokumen yang bisa diexport");
      return;
    }
    selectedDocumentsForExport.value = [...exportableDocuments.value];
  }

  isExporting.value = true;
  let successCount = 0;
  const totalDocuments = selectedDocumentsForExport.value.length;

  try {
    await toast.promise(
      (async () => {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        for (const document of selectedDocumentsForExport.value) {
          try {
            const blob = await exportDocumentApi(document.id, exportFormat.value);

            if (!blob) {
              continue;
            }

            const extension = exportFormat.value === "parallel" ? "txt" : "m2";
            const fileName = `${document.title.replace(/[^a-zA-Z0-9.-]/g, '_')}.${extension}`;
            
            const arrayBuffer = await blob.arrayBuffer();
            zip.file(fileName, arrayBuffer);
            
            successCount++;
          } catch (docError: any) {
            // Silent fail - continue processing other documents
          }
        }

        if (successCount === 0) {
          throw new Error("Tidak ada dokumen yang berhasil diexport");
        }

        const zipBlob = await zip.generateAsync({ 
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 6 }
        });

        const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '');
        const zipFileName = `${projectToExport.value?.name || 'documents'}_export_${exportFormat.value}_${timestamp}.zip`;
        
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = zipFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return { successCount, failCount: totalDocuments - successCount, totalDocuments };
      })(),
      {
        loading: `Mengexport ${totalDocuments} dokumen ke ZIP (${exportFormat.value.toUpperCase()})...`,
        success: (result: { successCount: number; failCount: number; totalDocuments: number }) => {
          if (result.failCount === 0) {
            closeExportDialog();
            return `Berhasil export ${result.totalDocuments} dokumen ke ZIP (${exportFormat.value.toUpperCase()})`;
          } else {
            closeExportDialog();
            return `Export ZIP selesai: ${result.successCount} berhasil, ${result.failCount} gagal`;
          }
        },
        error: (error: any) => {
          return `Gagal export ZIP ${exportFormat.value.toUpperCase()}: ${error.message || error}`;
        },
      }
    );
  } catch (error: any) {
    toast.error(`Gagal export: ${error.message}`);
  } finally {
    isExporting.value = false;
  }
}

// Watch for project context changes
watch(selectedProjectId, async () => {
  // No need to refetch projects, just let the computed filteredProjects handle the filtering
  currentPage.value = 1; // Reset to first page when context changes
}, { immediate: false });

// Filter documents that are annotated (ready for export)
const exportableDocuments = computed(() => {
  return documentsInProject.value.filter((doc: DocumentResponse) => {
    return ["sudah_dianotasi", "belum_direview", "sedang_direview", "sudah_direview"].includes(doc.status);
  });
});const nonExportableDocuments = computed(() => {
  return documentsInProject.value.filter((doc: DocumentResponse) => {
    // Documents that are not yet annotated
    return ["belum_dianotasi", "sedang_dianotasi"].includes(doc.status);
  });
});

// Get status display text and color
function getDocumentStatusInfo(status: string) {
  const statusMap: Record<string, { text: string; color: string }> = {
    "belum_dianotasi": { text: "Belum Dianotasi", color: "text-gray-500" },
    "sedang_dianotasi": { text: "Sedang Dianotasi", color: "text-yellow-500" },
    "sudah_dianotasi": { text: "Sudah Dianotasi", color: "text-green-500" },
    "belum_direview": { text: "Belum Direview", color: "text-blue-500" },
    "sedang_direview": { text: "Sedang Direview", color: "text-orange-500" },
    "sudah_direview": { text: "Sudah Direview", color: "text-purple-500" },
  };
  return statusMap[status] || { text: status, color: "text-gray-500" };
}

// Dynamic page title based on project context
const pageTitle = computed(() => {
  if (selectedProject.value) {/* Lines 836-837 omitted */}
  return "Kelola Project - Semua Project";
});

onMounted(async () => {
  await fetchAdminUsers();
  await fetchProjects(currentPage.value);
});

useHead({
  title: pageTitle.value + " - ANOTA",
  meta: [
    { name: "description", content: "Halaman kelola project aplikasi ANOTA." },
  ],
});
</script>
