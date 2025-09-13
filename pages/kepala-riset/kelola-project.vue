<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter bg-gray-50">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Kelola Project</h1>
        <p class="text-gray-600">
          Buat dan kelola project penelitian untuk proses anotasi
        </p>
      </div>

      <!-- Add Project Button -->
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
              Masukkan informasi project baru. Admin dapat ditugaskan sekarang atau nanti.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-6 py-4">
            <!-- Basic Project Info -->
            <div class="grid gap-4">
              <h3 class="text-lg font-medium text-left">Informasi Dasar Project</h3>
              <div class="grid gap-2">
                <label for="name" class="text-sm font-medium text-left">Nama Project <span class="text-red-400">*</span></label>
                <Input id="name" v-model="newProject.name" placeholder="Nama Project" class="w-full" />
              </div>
              <div class="grid gap-2">
                <label for="description" class="text-sm font-medium text-left">Deskripsi</label>
                <Textarea id="description" v-model="newProject.description" placeholder="Deskripsi project..." class="w-full min-h-[100px]" />
              </div>
            </div>

            <!-- Admin Assignment (Optional) -->
            <div class="grid gap-4">
              <h3 class="text-lg font-medium text-left">Assign Admin <span class="text-sm text-gray-400 font-normal">(Opsional)</span></h3>
              <div class="grid gap-2">
                <label for="admin_select" class="text-sm font-medium text-left">Admin yang Ditugaskan</label>
                <Combobox v-model="newProjectAdminIds" v-model:open="openCreateAdmins" :ignore-filter="true">
                  <ComboboxAnchor as-child>
                    <TagsInput v-model="newProjectAdminIds" class="px-2 w-full">
                      <div class="flex flex-col">
                        <div v-if="newProjectAdminIds.length" class="flex gap-2 flex-wrap items-center p-1 font-semibold">
                          <TagsInputItem v-for="adminId in newProjectAdminIds" :key="adminId" :value="getAdminName(adminId)">
                            <TagsInputItemText class="text-xs">{{ getAdminName(adminId) }}</TagsInputItemText>
                            <TagsInputItemDelete @click="removeAdminFromNewProject(adminId)" />
                          </TagsInputItem>
                        </div>
                        <ComboboxInput v-model="searchTermCreateAdmin" as-child>
                          <TagsInputInput placeholder="Pilih admin (opsional)..." class="w-full" @keydown.enter.prevent />
                        </ComboboxInput>
                      </div>
                    </TagsInput>
                    <ComboboxList class="w-[--reka-popper-anchor-width]" align="start">
                      <ComboboxEmpty />
                      <ComboboxGroup>
                        <ComboboxItem
                          v-for="admin in availableAdminsForNewProject"
                          :key="admin.id"
                          :value="admin.id"
                          @select.prevent="(ev) => {
                            if (typeof ev.detail.value === 'string') {
                              searchTermCreateAdmin = ''
                              newProjectAdminIds.push(ev.detail.value)
                            }
                            if (availableAdminsForNewProject.length === 0) {
                              openCreateAdmins = false
                            }
                          }">
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
            <Button variant="outline" @click="resetForm">
              Reset
            </Button>
            <Button @click="createProject" :disabled="isCreating" class="flex items-center gap-2">
              <Plus v-if="!isCreating" class="w-4 h-4" />
              <Loader2 v-else class="w-4 h-4 animate-spin" />
              {{ isCreating ? 'Menambah...' : 'Tambah Project' }}
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
          <!-- Basic Project Info -->
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

          <!-- Admin Assignment (Optional) -->
          <div class="grid gap-4">
            <h3 class="text-lg font-medium text-left">Admin yang Ditugaskan <span class="text-sm text-gray-400 font-normal">(Opsional)</span></h3>
            <div class="grid gap-2">
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

    <!-- Delete Confirmation Dialog -->
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

      <div v-if="isLoading" class="text-gray-600 mb-4">
        Memuat data project...
      </div>

      <div v-if="projects.length"
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <div class="rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow class="bg-gray-50 hover:bg-gray-50">
                <TableHead class="text-gray-700 font-medium text-left">Nama Project</TableHead>
                <TableHead class="text-gray-700 font-medium text-left">Deskripsi</TableHead>
                <TableHead class="text-gray-700 font-medium text-left">Admin yang Ditugaskan</TableHead>
                <TableHead class="text-gray-700 font-medium text-left">Tanggal Dibuat</TableHead>
                <TableHead class="text-gray-700 font-medium text-left"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="project in projects" :key="project.id" class="border-gray-200 hover:bg-gray-50">
                <TableCell class="font-semibold text-gray-900 text-left">{{ project.name }}</TableCell>
                <TableCell class="text-gray-700 text-left max-w-xs truncate">{{ project.description || '-' }}</TableCell>
                <TableCell class="text-left">
                  <div class="flex flex-wrap gap-1">
                    <Badge v-for="adminId in project.assigned_admins" :key="adminId" variant="blue" class="font-semibold">
                      {{ getAdminName(adminId) }}
                    </Badge>
                    <span v-if="project.assigned_admins.length === 0" class="text-gray-500 text-sm">Belum ada admin</span>
                  </div>
                </TableCell>
                <TableCell class="text-gray-700 text-left">{{ formatDate(project.created_at) }}</TableCell>
              <TableCell class="flex w-full justify-end">
                <div class="flex gap-2">
                  <Button size="sm" variant="outline" @click="editProject(project)"
                    class="rounded-full px-4 py-1 font-semibold">
                    <Pencil class="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" @click="showDeleteDialog(project)"
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
      <div v-if="projects.length" class="mt-4 flex justify-center">
      <Pagination :page="currentPage" :total="totalPages" :items-per-page="projects.length > 0 ? projects.length : 1"
        @update:page="fetchProjects">
        <PaginationContent>
          <PaginationPrevious :disabled="currentPage === 1" @click="fetchProjects(currentPage - 1)">
            <ArrowLeft class="w-4 h-4" />
          </PaginationPrevious>
          <template v-for="(page, idx) in paginationPages" :key="idx">
            <PaginationItem v-if="typeof page === 'number'" :value="page" :is-active="page === currentPage"
              @click="fetchProjects(page)">{{ page }}</PaginationItem>
            <PaginationEllipsis v-else>
              <MoreHorizontal class="w-4 h-4" />
            </PaginationEllipsis>
          </template>
          <PaginationNext :disabled="currentPage === totalPages" @click="fetchProjects(currentPage + 1)">
            <ArrowRight class="w-4 h-4" />
          </PaginationNext>
        </PaginationContent>
      </Pagination>
    </div>

      <div v-if="!projects.length && !isLoading"
        class="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <span class="text-gray-500">Tidak ada project ditemukan.</span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useProjectsApi } from "~/data/projects";
import { useUsersApi } from "~/data/users";
import type { ProjectResponse, ProjectRequest, UserResponse } from "~/types/api";
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
import { TagsInput, TagsInputItem, TagsInputInput, TagsInputItemDelete, TagsInputItemText } from "~/components/ui/tags-input";
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from "~/components/ui/pagination";
import {
  Plus, Loader2, Check, Pencil, Trash2, ArrowLeft, ArrowRight, MoreHorizontal, UserPlus
} from "lucide-vue-next";
import { toast } from "vue-sonner";

const {
  getProjects,
  createProject: apiCreateProject,
  updateProject: apiUpdateProject,
  deleteProject: apiDeleteProject,
  assignAdmin: apiAssignAdmin,
  unassignAdmin: apiUnassignAdmin,
} = useProjectsApi();

const { getAllUsers } = useUsersApi();

const projects = ref<ProjectResponse[]>([]);
const adminUsers = ref<UserResponse[]>([]);
const isLoading = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);

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
const searchTermCreateAdmin = ref('');

const editingProjectAdminIds = ref<string[]>([]);
const openEditAdmins = ref(false);
const searchTermEditAdmin = ref('');

const selectedProject = ref<ProjectResponse | null>(null);

const currentPage = ref(1);
const totalPages = ref(1);

const availableAdmins = computed(() => {
  return adminUsers.value.filter(user => user.roles.includes("Admin"));
});

const availableAdminsForNewProject = computed(() => {
    if (!availableAdmins.value || availableAdmins.value.length === 0) {
        return [];
    }
    return availableAdmins.value.filter(admin =>
        (admin.full_name.toLowerCase().includes(searchTermCreateAdmin.value.toLowerCase()) ||
         admin.username.toLowerCase().includes(searchTermCreateAdmin.value.toLowerCase())) &&
        !newProjectAdminIds.value.includes(admin.id)
    );
});

const availableAdminsForEditingProject = computed(() => {
    if (!availableAdmins.value || availableAdmins.value.length === 0) {
        return [];
    }
    return availableAdmins.value.filter(admin =>
        (admin.full_name.toLowerCase().includes(searchTermEditAdmin.value.toLowerCase()) ||
         admin.username.toLowerCase().includes(searchTermEditAdmin.value.toLowerCase())) &&
        !editingProjectAdminIds.value.includes(admin.id)
    );
});

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

function getAdminName(adminId: string) {
  const admin = adminUsers.value.find(user => user.id === adminId);
  return admin ? admin.full_name : 'Unknown';
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
    console.error('Error fetching admin users:', error);
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
    console.error('Error fetching projects:', error);
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
    console.error('Error creating project:', error);
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
        const projectResult = await apiUpdateProject(editingProject.value.id!, updateData);

        const currentAdmins = selectedProject.value?.assigned_admins || [];
        const toAdd = editingProjectAdminIds.value.filter(id => !currentAdmins.includes(id));
        const toRemove = currentAdmins.filter(id => !editingProjectAdminIds.value.includes(id));

        for (const adminId of toAdd) {
          await apiAssignAdmin(editingProject.value.id!, { user_id: adminId });
        }

        for (const adminId of toRemove) {
          await apiUnassignAdmin(editingProject.value.id!, { user_id: adminId });
        }

        return projectResult;
      })(),
      {
        loading: "Mengupdate project...",
        success: (result: ProjectResponse) => {
          fetchProjects(currentPage.value);
          isEditDialogOpen.value = false;
          selectedProject.value = null;
          return `Project ${result.name} berhasil diupdate.`;
        },
        error: "Gagal mengupdate project",
      }
    );
  } catch (error) {
    console.error('Error updating project:', error);
  } finally {
    isUpdating.value = false;
  }
}

function editProject(project: ProjectResponse) {
  selectedProject.value = project;
  editingProject.value = {
    id: project.id,
    name: project.name,
    description: project.description,
  };
  editingProjectAdminIds.value = [...project.assigned_admins];
  isEditDialogOpen.value = true;
}

function cancelEdit() {
  editingProject.value = {
    name: "",
    description: "",
  };
  editingProjectAdminIds.value = [];
  selectedProject.value = null;
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
    await toast.promise(
      apiDeleteProject(projectToDelete.value.id),
      {
        loading: "Menghapus project...",
        success: "Project berhasil dihapus",
        error: "Gagal menghapus project",
      }
    );

    const response = await getProjects(currentPage.value);
    if (response.results.length === 0 && currentPage.value > 1) {
      await fetchProjects(currentPage.value - 1);
    } else {
      await fetchProjects(currentPage.value);
    }

    isDeleteDialogOpen.value = false;
    projectToDelete.value = null;
  } catch (error) {
    console.error('Error deleting project:', error);
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
  return new Date(dateString).toLocaleDateString('id-ID');
}

onMounted(async () => {
  await fetchAdminUsers();
  await fetchProjects(currentPage.value);
});

useHead({
  title: "Kelola Project - ANOTA",
  meta: [
    { name: "description", content: "Halaman kelola project aplikasi ANOTA." },
  ],
});
</script>