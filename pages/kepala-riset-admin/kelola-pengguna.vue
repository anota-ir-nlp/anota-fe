<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter bg-gray-50">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Kelola Pengguna</h1>
        <p class="text-gray-600">
          Buat dan kelola pengguna sistem anotasi
        </p>
      </div>
      <div class="mb-6">
        <Dialog v-model:open="isCreateDialogOpen">
          <div class="flex gap-3 items-start">
          <DialogTrigger as-child>
            <Button class="flex items-center gap-2">
              <Plus class="w-4 h-4" />
              Tambah Pengguna Baru
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent class="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Pengguna Baru</DialogTitle>
            <DialogDescription>
              Masukkan informasi pengguna baru. Password akan di-generate otomatis.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <div class="grid gap-2">
              <label for="username" class="text-sm font-medium text-left">Username</label>
              <Input id="username" v-model="newUser.username" placeholder="Username" class="w-full" />
            </div>
            <div class="grid gap-2">
              <label for="email" class="text-sm font-medium text-left">Email</label>
              <Input id="email" v-model="newUser.email" type="email" placeholder="Email" class="w-full" />
            </div>
            <div class="grid gap-2">
              <label for="full_name" class="text-sm font-medium text-left">Nama Lengkap</label>
              <Input id="full_name" v-model="newUser.full_name" placeholder="Nama Lengkap" class="w-full" />
            </div>
            <div class="grid gap-2">
              <label for="institution" class="text-sm font-medium text-left">Institusi (Opsional)</label>
              <Input id="institution" v-model="newUser.institusi" placeholder="Institusi" class="w-full" />
            </div>
            <!-- Project selection for Kepala Riset -->
            <div v-if="isKepalaRiset" class="grid gap-2">
              <label for="project_select" class="text-sm font-medium text-left">Pilih Project</label>
              <Select v-model="selectedProjectForRole">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Pilih project untuk assign role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="project in projects" :key="project.id" :value="project.id.toString()">
                    {{ project.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-xs text-gray-500">
                Pilih project untuk menambahkan role ke pengguna
              </p>
            </div>

            <!-- Role selection for Admin users with project context, and Kepala Riset -->
            <div v-if="(isAdmin && selectedProjectId) || (isKepalaRiset && selectedProjectForRole)" class="grid gap-2">
              <label for="roles" class="text-sm font-medium text-left">Roles untuk Project Ini</label>
              <Combobox v-model="newUserRoles" v-model:open="openCreateRoles" :ignore-filter="true">
                <ComboboxAnchor as-child>
                  <TagsInput v-model="newUserRoles" class="px-2 w-full">
                    <div class="flex flex-col">
                      <div v-if="newUserRoles.length" class="flex gap-2 flex-wrap items-center p-1 font-semibold">
                        <TagsInputItem v-for="item in newUserRoles" :key="item" :value="item">
                          <TagsInputItemText class="text-xs" />
                          <TagsInputItemDelete @click="newUserRoles.splice(newUserRoles.indexOf(item), 1)" />
                        </TagsInputItem>
                      </div>
                      <ComboboxInput v-model="searchTermCreate" as-child>
                        <TagsInputInput placeholder="Tambah role..." class="w-full" @keydown.enter.prevent />
                      </ComboboxInput>
                    </div>
                  </TagsInput>
                  <ComboboxList class="w-[--reka-popper-anchor-width]" align="start">
                    <ComboboxEmpty />
                    <ComboboxGroup>
                      <ComboboxItem
                        v-for="role in availableProjectRoles.filter((r: string) => r.includes(searchTermCreate || '') && !newUserRoles.includes(r))"
                        :key="role" :value="role" @select.prevent="(ev: any) => {
                          if (typeof ev.detail.value === 'string') {
                            searchTermCreate = ''
                            newUserRoles.push(ev.detail.value)
                          }
                          if (availableProjectRoles.filter((r: string) => r.includes(searchTermCreate || '') && !newUserRoles.includes(r)).length === 0) {
                            openCreateRoles = false
                          }
                        }">
                        {{ role }}
                      </ComboboxItem>
                    </ComboboxGroup>
                  </ComboboxList>
                </ComboboxAnchor>
              </Combobox>
              <p v-if="isAdmin && selectedProject" class="text-xs text-gray-500">
                Role akan diterapkan untuk project "{{ selectedProject.name }}"
              </p>
              <p v-else-if="isKepalaRiset && selectedProjectForRole" class="text-xs text-gray-500">
                Role akan diterapkan untuk project "{{ projects.find((p: ProjectResponse) => p.id.toString() === selectedProjectForRole?.toString())?.name }}"
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" @click="resetForm">
              Reset
            </Button>
            <Button @click="createUser" :disabled="isCreating" class="flex items-center gap-2">
              <Plus v-if="!isCreating" class="w-4 h-4" />
              <Loader2 v-else class="w-4 h-4 animate-spin" />
              {{ isCreating ? 'Menambah...' : 'Tambah Pengguna' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <Dialog v-model:open="isEditDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Pengguna</DialogTitle>
          <DialogDescription>
            Update informasi pengguna yang dipilih.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <label for="edit_username" class="text-sm font-medium text-left">Username</label>
            <Input id="edit_username" v-model="editingUser.username" placeholder="Username" class="w-full" />
          </div>
          <div class="grid gap-2">
            <label for="edit_email" class="text-sm font-medium text-left">Email</label>
            <Input id="edit_email" v-model="editingUser.email" type="email" placeholder="Email" class="w-full" />
          </div>
          <div class="grid gap-2">
            <label for="edit_full_name" class="text-sm font-medium text-left">Nama Lengkap</label>
            <Input id="edit_full_name" v-model="editingUser.full_name" placeholder="Nama Lengkap" class="w-full" />
          </div>
          <div class="grid gap-2">
            <label for="edit_institution" class="text-sm font-medium text-left">Institusi (Opsional)</label>
            <Input id="edit_institution" v-model="editingUser.institusi" placeholder="Institusi" class="w-full" />
          </div>
          <!-- Project selection for Kepala Riset -->
          <div v-if="isKepalaRiset" class="grid gap-2">
            <label for="edit_project_select" class="text-sm font-medium text-left">Pilih Project</label>
            <Select v-model="editingProjectForRole">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Pilih project untuk manage role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="project in projects" :key="project.id" :value="project.id.toString()">
                  {{ project.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p class="text-xs text-gray-500">
              Pilih project untuk mengelola role pengguna
            </p>
          </div>

          <!-- Role management for Admin with project context or Kepala Riset -->
          <div v-if="(isAdmin && selectedProjectId) || (isKepalaRiset && editingProjectForRole)" class="grid gap-2">
            <label for="edit_roles" class="text-sm font-medium text-left">Roles dalam Project Ini</label>
            <Combobox v-model="editingUserRoles" v-model:open="openEditRoles" :ignore-filter="true">
              <ComboboxAnchor as-child>
                <TagsInput v-model="editingUserRoles" class="px-2 w-full">
                  <div class="flex flex-col">
                    <div v-if="editingUserRoles.length" class="flex gap-2 flex-wrap items-center p-1 font-semibold">
                      <TagsInputItem v-for="item in editingUserRoles" :key="item" :value="item">
                        <TagsInputItemText class="text-xs" />
                        <TagsInputItemDelete @click="editingUserRoles.splice(editingUserRoles.indexOf(item), 1)" />
                      </TagsInputItem>
                    </div>
                    <ComboboxInput v-model="searchTermEdit" as-child>
                      <TagsInputInput placeholder="Tambah role..." class="w-full" @keydown.enter.prevent />
                    </ComboboxInput>
                  </div>
                </TagsInput>
                <ComboboxList class="w-[--reka-popper-anchor-width]" align="start">
                  <ComboboxEmpty />
                  <ComboboxGroup>
                    <ComboboxItem
                      v-for="role in availableProjectRoles.filter((r: string) => r.includes(searchTermEdit || '') && !editingUserRoles.includes(r))"
                      :key="role" :value="role" @select.prevent="(ev: any) => {
                        if (typeof ev.detail.value === 'string') {
                          searchTermEdit = ''
                          editingUserRoles.push(ev.detail.value)
                        }
                        if (availableProjectRoles.filter((r: string) => r.includes(searchTermEdit || '') && !editingUserRoles.includes(r)).length === 0) {
                          openEditRoles = false
                        }
                      }">
                      {{ role }}
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxList>
              </ComboboxAnchor>
            </Combobox>
            <p v-if="isAdmin && selectedProject" class="text-xs text-gray-500">
              Mengelola role untuk project "{{ selectedProject.name }}"
            </p>
            <p v-else-if="isKepalaRiset && editingProjectForRole" class="text-xs text-gray-500">
              Mengelola role untuk project "{{ projects.find((p: ProjectResponse) => p.id.toString() === editingProjectForRole?.toString())?.name }}"
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="cancelEdit">
            Batal
          </Button>
          <Button @click="updateUser" :disabled="isUpdating" class="flex items-center gap-2">
            <Check v-if="!isUpdating" class="w-4 h-4" />
            <Loader2 v-else class="w-4 h-4 animate-spin" />
            {{ isUpdating ? 'Mengupdate...' : 'Update Pengguna' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="isDeleteDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus pengguna "{{ userToDelete?.full_name }}"?
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

    <Dialog v-model:open="isResetPasswordDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password Pengguna</DialogTitle>
          <DialogDescription>
            Reset password untuk "{{ userToResetPassword?.full_name }}". Sistem akan generate password baru otomatis dan mengirimkannya via email.
          </DialogDescription>
        </DialogHeader>

        <div class="py-4">
          <div class="flex items-center space-x-2">
            <input
              id="send-email-reset"
              v-model="sendEmailOnReset"
              type="checkbox"
              class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label for="send-email-reset" class="text-sm font-medium text-gray-700">
              Kirim password baru via email
            </label>
          </div>

          <div v-if="resetPasswordSuccess" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div class="text-green-800">
              <strong>{{ resetPasswordSuccess.message }}</strong>
            </div>
            <div v-if="resetPasswordSuccess.new_password" class="mt-2 text-sm text-green-700">
              <strong>Password Baru:</strong>
              <code class="bg-green-100 px-2 py-1 rounded font-mono">{{ resetPasswordSuccess.new_password }}</code>
            </div>
            <div v-if="resetPasswordSuccess.email_message" class="mt-1 text-sm text-green-600">
              {{ resetPasswordSuccess.email_message }}
            </div>
          </div>

          <div v-if="resetPasswordError" class="mt-4 text-red-500 text-sm">
            {{ resetPasswordError }}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="cancelResetPassword">
            Batal
          </Button>
          <Button @click="confirmResetPassword" :disabled="isResettingPassword" class="flex items-center gap-2">
            <KeyRound v-if="!isResettingPassword" class="w-4 h-4" />
            <Loader2 v-else class="w-4 h-4 animate-spin" />
            {{ isResettingPassword ? 'Mereset...' : 'Reset Password' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

      <div v-if="isLoading" class="text-gray-600 mb-4">
        Memuat data pengguna...
      </div>

      <div v-if="users && users.length > 0"
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <DataTable
          :columns="userColumns"
          :data="users"
          @selection-change="handleSelectionChange"
          @edit-user="editUser"
          @delete-user="showDeleteDialog"
        />
      </div>

      <div v-if="users && users.length > 0 && totalPages > 1" class="mt-4 flex justify-center">
      <Pagination :page="currentPage" :total="totalPages" :items-per-page="Math.max(users?.length || 1, 1)"
        @update:page="fetchUsers">
        <PaginationContent>
          <PaginationPrevious :disabled="currentPage === 1" @click="fetchUsers(currentPage - 1)">
            <ArrowLeft class="w-4 h-4" />
          </PaginationPrevious>
          <template v-for="(page, idx) in paginationPages" :key="idx">
            <PaginationItem v-if="typeof page === 'number'" :value="page" :is-active="page === currentPage"
              @click="fetchUsers(page)">{{ page }}</PaginationItem>
            <PaginationEllipsis v-else>
              <MoreHorizontal class="w-4 h-4" />
            </PaginationEllipsis>
          </template>
          <PaginationNext :disabled="currentPage === totalPages" @click="fetchUsers(currentPage + 1)">
            <ArrowRight class="w-4 h-4" />
          </PaginationNext>
        </PaginationContent>
      </Pagination>
    </div>

      <div v-if="(!users || users.length === 0) && !isLoading"
        class="bg-white border border-gray-200 rounded-xl p-6 text-center">
        <div class="text-gray-500">
          <div v-if="isKepalaRiset && selectedProject && !isAllProjects" class="space-y-2">
            <p class="font-medium">Tidak ada pengguna ditemukan untuk project ini.</p>
            <p class="text-sm text-gray-400">
              Project "{{ selectedProject.name }}" belum memiliki pengguna yang di-assign.
            </p>
          </div>
          <div v-else-if="isKepalaRiset && isAllProjects" class="space-y-2">
            <p class="font-medium">Tidak ada admin ditemukan.</p>
            <p class="text-sm text-gray-400">
              Belum ada admin yang terdaftar di sistem.
            </p>
          </div>
          <div v-else>
            <p>Tidak ada pengguna ditemukan.</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useAuth } from "~/data/auth";
import { useUsersApi } from "~/data/users";
import { useProjectsApi } from "~/data/projects";
import { useProjectContext } from "~/composables/project-context";
import type { UserResponse, UserRegistrationRequest, UserRegistrationResponse, ProjectResponse } from "~/types/api";
import { Input } from "~/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from "~/components/ui/pagination";
import { TagsInput, TagsInputItem, TagsInputInput, TagsInputItemDelete, TagsInputItemText } from "~/components/ui/tags-input";
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import {
  Plus, Loader2, Check, Pencil, Trash2, ArrowLeft, ArrowRight, MoreHorizontal, KeyRound
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import DataTable from "~/components/ui/data-table/data-table.vue";
import { createUserColumns } from "~/components/users/columns";

const {
  getUsersInProject,
  getAvailableUsersInProject,
  getAllUsersInProject,
  createUserInProject,
  deleteUserFromProject,
  deleteUserGlobally,
  updateUserInProject,
  partialUpdateUserInProject,
  getAvailableRoles,
  manageUserRoleInProject,
  getUserRolesInProject,
  resetPasswordInProject,
} = useUsersApi();

const { getProjects, getAssignedUsers, assignAdmin, unassignAdmin } = useProjectsApi();

const { userRoles } = useAuth();
// Admin uses project context, but Kepala Riset always sees all users
const { selectedProject, selectedProjectId, isAllProjects } = useProjectContext();

const isKepalaRiset = computed(() => userRoles.value.includes("Kepala Riset"));
const isAdmin = computed(() => userRoles.value.includes("Admin"));

const users = ref<UserResponse[]>([]);
const selectedUsers = ref<UserResponse[]>([]);
const isLoading = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const isResetPasswordDialogOpen = ref(false);

const newUser = ref<UserRegistrationRequest>({
  username: "",
  email: "",
  full_name: "",
  institusi: "",
});

const editingUser = ref<Partial<UserResponse>>({
  username: "",
  email: "",
  full_name: "",
  institusi: "",
});

const availableRoles = ref<string[]>([]);
const availableProjectRoles = ref<string[]>(["Admin", "Annotator", "Reviewer"]); // Project-specific roles
const newUserRoles = ref<string[]>([]);
const editingUserRoles = ref<string[]>([]);
const editingUserOriginalRoles = ref<string[]>([]); // Store original roles when editing starts
const openCreateRoles = ref(false);
const openEditRoles = ref(false);
const searchTermCreate = ref('');
const searchTermEdit = ref('');

// Project selection for Kepala Riset when assigning roles
const selectedProjectForRole = ref<number | null>(null);
const editingProjectForRole = ref<number | null>(null);

const currentPage = ref(1);
const totalPages = ref(1);

// Projects data for admin assignment display
const projects = ref<ProjectResponse[]>([]);
const projectUserMappings = ref<Record<number, Set<string>>>({});

// Map to store aggregated user roles and projects across all projects
const userProjectData = ref<Map<string, {
  roles: Set<string>;
  projects: Set<string>;
}>>(new Map());

// Function to get all project assignments for any user (used by Kepala Riset)
function getProjectAssignments(userId: string, userRoles: string[]): string[] {
  const userData = userProjectData.value.get(userId);
  if (userData) {
    return Array.from(userData.projects);
  }

  // Fallback to old logic if userProjectData is not populated
  const projectNames: string[] = [];

  // For Admin users, check assigned_admins in projects
  if (userRoles.includes('Admin')) {
    const adminProjects = projects.value.filter((p: ProjectResponse) => p.assigned_admins?.includes(userId));
    projectNames.push(...adminProjects.map((p: ProjectResponse) => p.name));
  }

  // For Annotator and Reviewer users, check project user mappings
  if (userRoles.includes('Annotator') || userRoles.includes('Reviewer')) {
    for (const [projectId, assignedUserIds] of Object.entries(projectUserMappings.value)) {
      if (assignedUserIds.has(userId)) {
        const project = projects.value.find((p: ProjectResponse) => p.id === parseInt(projectId));
        if (project && !projectNames.includes(project.name)) {
          projectNames.push(project.name);
        }
      }
    }
  }

  return projectNames;
}

// Function to get all aggregated roles for a user across all projects
// Only used by Kepala Riset view - Admin sees roles from their project context directly
function getAllUserRoles(userId: string): string[] {
  if (isAdmin.value) {
    // Admin: roles are already in the user object from getUsersInProject
    const user = users.value.find((u: UserResponse) => u.id === userId);
    return user?.roles || [];
  }

  // Kepala Riset: aggregate roles from userProjectData
  const userData = userProjectData.value.get(userId);
  if (userData) {
    return Array.from(userData.roles);
  }
  return [];
}

const userToDelete = ref<UserResponse | null>(null);

const userToResetPassword = ref<UserResponse | null>(null);
const isResettingPassword = ref(false);
const sendEmailOnReset = ref(true);
const resetPasswordSuccess = ref<{
  message: string;
  new_password?: string;
  email_message?: string;
  user_id?: string;
  username?: string;
} | null>(null);
const resetPasswordError = ref("");

async function fetchAvailableRoles() {
  try {
    const res = await getAvailableRoles();

    if (isKepalaRiset.value) {
      availableRoles.value = res.roles.filter((role: string) => role === "Admin");
    } else {
      availableRoles.value = res.roles;
    }
  } catch (error) {
    toast.error("Gagal memuat daftar roles");
  }
}

async function fetchProjects() {
  if (!isKepalaRiset.value) {
    return;
  }

  try {
    const response = await getProjects();
    projects.value = response?.results || [];

    await fetchProjectUserMappings();
  } catch (error) {
    console.error('Error fetching projects:', error);
    toast.error("Gagal memuat data projects");
    projects.value = [];
  }
}

async function fetchProjectUserMappings() {
  const mappings: Record<number, Set<string>> = {};

  for (const project of projects.value) {
    try {
      const response = await getUsersInProject(project.id);
      const users = response?.results || [];

      const annotatorReviewerUsers = users.filter((user: UserResponse) =>
        user.roles.some((role: string) => ['Annotator', 'Reviewer'].includes(role))
      );

      mappings[project.id] = new Set(annotatorReviewerUsers.map((user: UserResponse) => user.id));
    } catch (error) {
      console.error(`Error fetching users for project ${project.id}:`, error);
      mappings[project.id] = new Set();
    }
  }

  projectUserMappings.value = mappings;
}

async function fetchUsers(page = 1) {
  isLoading.value = true;
  try {
    let response;

    if (isAdmin.value && selectedProjectId.value) {
      response = await getUsersInProject(selectedProjectId.value, page);
      users.value = response?.results || [];
      currentPage.value = page;
      totalPages.value = Math.max(1, Math.ceil((response?.count || 0) / 20));
    } else if (isKepalaRiset.value) {

      const projectsResponse = await getProjects();
      const allProjects = projectsResponse?.results || [];

      const userMap = new Map<string, any>();
      const newUserProjectData = new Map<string, { roles: Set<string>; projects: Set<string> }>();

      for (const project of allProjects) {
        try {
          const availableUsersResponse = await getAvailableUsersInProject(project.id);

          for (const user of availableUsersResponse.users) {
            if (userMap.has(user.id)) {
              const existingUser = userMap.get(user.id);
              const combinedRoles = [...new Set([...existingUser.roles, ...(user.roles_in_project || [])])];
              existingUser.roles = combinedRoles;

              if (user.roles_in_project && user.roles_in_project.length > 0) {
                if (newUserProjectData.has(user.id)) {
                  const userData = newUserProjectData.get(user.id)!;
                  user.roles_in_project.forEach((role: string) => userData.roles.add(role));
                  userData.projects.add(project.name);
                } else {
                  newUserProjectData.set(user.id, {
                    roles: new Set(user.roles_in_project),
                    projects: new Set([project.name])
                  });
                }
              }
            } else {
              // New user, add to map
              userMap.set(user.id, {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                roles: user.roles_in_project || [],
                is_kepala_riset: false,
                date_joined: '',
                is_deleted: false,
                deleted_at: null,
                institusi: '',
              });

              // Initialize project data only if user has roles
              if (user.roles_in_project && user.roles_in_project.length > 0) {
                newUserProjectData.set(user.id, {
                  roles: new Set(user.roles_in_project),
                  projects: new Set([project.name])
                });
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching users for project ${project.id}:`, error);
        }
      }

      // Update userProjectData
      userProjectData.value = newUserProjectData;

      // Convert map to array
      users.value = Array.from(userMap.values()) as UserResponse[];
      currentPage.value = 1;
      totalPages.value = 1; // No pagination for combined results
    } else {
      // No other role should reach here - only Admin with project or Kepala Riset
      toast.error("Tidak dapat memuat pengguna. Pilih project terlebih dahulu.");
      users.value = [];
      currentPage.value = 1;
      totalPages.value = 1;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    toast.error("Gagal memuat data pengguna");
    users.value = [];
    totalPages.value = 1;
  } finally {
    isLoading.value = false;
  }
}

// Helper function to build userProjectData for Kepala Riset view
// Admin doesn't need this - they work within a single project context
async function buildUserProjectData() {
  // This function should only be called by Kepala Riset
  if (!isKepalaRiset.value) {
    return;
  }

  const newUserProjectData = new Map<string, { roles: Set<string>; projects: Set<string> }>();

  try {
    // Fetch all projects to get comprehensive data
    const projectsResponse = await getProjects();
    const allProjects = projectsResponse?.results || [];

    for (const project of allProjects) {
      try {
        const availableUsersResponse = await getAvailableUsersInProject(project.id);

        for (const user of availableUsersResponse.users) {
          // Include all users, track roles and projects only if they have roles
          if (user.roles_in_project && user.roles_in_project.length > 0) {
            if (newUserProjectData.has(user.id)) {
              const userData = newUserProjectData.get(user.id)!;
              user.roles_in_project.forEach((role: string) => userData.roles.add(role));
              userData.projects.add(project.name);
            } else {
              newUserProjectData.set(user.id, {
                roles: new Set(user.roles_in_project),
                projects: new Set([project.name])
              });
            }
          }
          // Note: Users without roles are tracked in the main users list but not in userProjectData
        }
      } catch (error) {
        console.error(`Error fetching users for project ${project.id}:`, error);
      }
    }

    userProjectData.value = newUserProjectData;
  } catch (error) {
    console.error('Error building user project data:', error);
  }
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

const userColumns = computed(() => createUserColumns(
  (user: UserResponse) => editUser(user),
  (user: UserResponse) => showDeleteDialog(user),
  (user: UserResponse) => showResetPasswordDialog(user),
  getAllUserRoles,
  {
    // Show project assignment column only for Kepala Riset
    showProjectAssignment: isKepalaRiset.value,
    getProjectAssignments: isKepalaRiset.value ? getProjectAssignments : undefined
  }
));

function handleSelectionChange(selection: UserResponse[]) {
  selectedUsers.value = selection || [];
}

async function createUser() {
  if (!newUser.value.username || !newUser.value.full_name || !newUser.value.email) {
    toast.error("Username, email, dan nama lengkap harus diisi");
    return;
  }

  // Determine which project ID to use
  const projectIdToUse = isKepalaRiset.value
    ? (selectedProjectForRole.value ? parseInt(selectedProjectForRole.value.toString()) : null)
    : selectedProjectId.value;

  if (!projectIdToUse) {
    toast.error("Pilih project terlebih dahulu");
    return;
  }

  // Admin must select at least one role, but Kepala Riset can create users without roles
  if (isAdmin.value && newUserRoles.value.length === 0) {
    toast.error("Pilih minimal satu role untuk pengguna");
    return;
  }

  isCreating.value = true;
  try {
    toast.promise(
      (async () => {
        // Create user in project context
        const result = await createUserInProject(projectIdToUse, newUser.value);

        // If admin/kepala riset and roles are selected, assign roles to project
        if (newUserRoles.value.length > 0) {
          for (const role of newUserRoles.value) {
            await manageUserRoleInProject(projectIdToUse, {
              user_id: result.data.id,
              role,
              action: "add",
            });

            // If Admin role is added, auto-assign user as admin of the project
            if (role === "Admin") {
              await assignAdmin(projectIdToUse, { user_id: result.data.id });
            }
          }
        }

        return result;
      })(),
      {
        loading: "Menambah pengguna...",
        success: (result: UserRegistrationResponse) => {
          resetForm();
          fetchUsers(currentPage.value);
          console.log('Created user:', result);
          if (newUserRoles.value.length > 0) {
            return `Pengguna ${result.data.username} berhasil dibuat dan ditambahkan ke project`;
          }
          return `Pengguna ${result.data.username} berhasil dibuat`;
        },
        error: "Gagal membuat pengguna baru",
      }
    );
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    isCreating.value = false;
  }
}

async function updateUser() {
  if (!editingUser.value.id || !editingUser.value.username || !editingUser.value.full_name) {
    toast.error("Username dan nama lengkap harus diisi");
    return;
  }

  // Determine which project ID to use
  const projectIdToUse = isKepalaRiset.value
    ? (editingProjectForRole.value ? parseInt(editingProjectForRole.value.toString()) : null)
    : selectedProjectId.value;

  if (!projectIdToUse) {
    toast.error("Pilih project terlebih dahulu");
    return;
  }

  isUpdating.value = true;
  try {
    toast.promise(
      (async () => {
        const updateData = {
          username: editingUser.value.username,
          email: editingUser.value.email,
          full_name: editingUser.value.full_name,
        };

        await partialUpdateUserInProject(projectIdToUse, editingUser.value.id!, updateData);

        // Update project-specific roles using the original roles as baseline
        const toAdd = editingUserRoles.value.filter((r: string) => !editingUserOriginalRoles.value.includes(r));
        const toRemove = editingUserOriginalRoles.value.filter((r: string) => !editingUserRoles.value.includes(r));

        for (const role of toAdd) {
          await manageUserRoleInProject(projectIdToUse, {
            user_id: editingUser.value.id!,
            role,
            action: "add",
          });

          // If Admin role is added, auto-assign user as admin of the project
          if (role === "Admin") {
            await assignAdmin(projectIdToUse, { user_id: editingUser.value.id! });
          }
        }
        for (const role of toRemove) {
          await manageUserRoleInProject(projectIdToUse, {
            user_id: editingUser.value.id!,
            role,
            action: "remove",
          });

          // If Admin role is removed, auto-unassign user as admin of the project
          if (role === "Admin") {
            await unassignAdmin(projectIdToUse, { user_id: editingUser.value.id! });
          }
        }

        return editingUser.value;
      })(),
      {
        loading: "Mengupdate pengguna...",
        success: (user: typeof editingUser.value) => {
          fetchUsers(currentPage.value);
          isEditDialogOpen.value = false;
          return `Pengguna ${user.username} berhasil diupdate.`;
        },
        error: "Gagal mengupdate pengguna",
      }
    );
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    isUpdating.value = false;
  }
}

function showDeleteDialog(user: UserResponse) {
  userToDelete.value = user;
  isDeleteDialogOpen.value = true;
}

function cancelDelete() {
  userToDelete.value = null;
  isDeleteDialogOpen.value = false;
}

async function confirmDelete() {
  if (!userToDelete.value) return;

  // Determine which project ID to use
  const projectIdToUse = isKepalaRiset.value
    ? (selectedProjectForRole.value ? parseInt(selectedProjectForRole.value.toString()) : null)
    : selectedProjectId.value;

  isDeleting.value = true;
  try {
    if (isKepalaRiset.value && !projectIdToUse) {
      // Kepala Riset deletes user globally if no project context
      await toast.promise(
        deleteUserGlobally(userToDelete.value.id),
        {
          loading: "Menghapus pengguna dari semua project...",
          success: "Pengguna berhasil dihapus dari semua project",
          error: "Gagal menghapus pengguna",
        }
      );
    } else if (projectIdToUse) {
      // Delete user from specific project
      await toast.promise(
        deleteUserFromProject(projectIdToUse, userToDelete.value.id),
        {
          loading: "Menghapus pengguna dari project...",
          success: "Pengguna berhasil dihapus dari project",
          error: "Gagal menghapus pengguna",
        }
      );
    } else {
      toast.error("Pilih project terlebih dahulu");
      return;
    }

    // Refresh user list
    await fetchUsers(currentPage.value);

    isDeleteDialogOpen.value = false;
    userToDelete.value = null;
  } catch (error) {
    console.error('Error deleting user:', error);
  } finally {
    isDeleting.value = false;
  }
}

function showResetPasswordDialog(user: UserResponse) {
  userToResetPassword.value = user;
  sendEmailOnReset.value = true;
  resetPasswordSuccess.value = null;
  resetPasswordError.value = "";
  isResetPasswordDialogOpen.value = true;
}

function cancelResetPassword() {
  userToResetPassword.value = null;
  sendEmailOnReset.value = true;
  resetPasswordSuccess.value = null;
  resetPasswordError.value = "";
  isResetPasswordDialogOpen.value = false;
}

async function confirmResetPassword() {
  if (!userToResetPassword.value) return;

  // Determine which project ID to use
  const projectIdToUse = isKepalaRiset.value
    ? (selectedProjectForRole.value ? parseInt(selectedProjectForRole.value.toString()) : null)
    : selectedProjectId.value;

  if (!projectIdToUse) {
    toast.error("Pilih project terlebih dahulu");
    return;
  }

  isResettingPassword.value = true;
  resetPasswordError.value = "";
  resetPasswordSuccess.value = null;

  try {
    const response = await resetPasswordInProject(projectIdToUse, userToResetPassword.value.id, {
      user_id: userToResetPassword.value.id,
      send_email: sendEmailOnReset.value,
    });

    resetPasswordSuccess.value = {
      message: response.message || `Password berhasil direset untuk ${response.username || 'pengguna'}`,
      new_password: response.new_password,
      email_message: response.email_status === 'sent' ? 'Email berhasil dikirim' : 'Email gagal dikirim',
      user_id: response.user_id,
      username: response.username,
    };

    toast.success("Password berhasil direset dan dikirim via email");

    // Auto close dialog after showing success for a few seconds
    setTimeout(() => {
      cancelResetPassword();
    }, 5000);
  } catch (error: any) {
    resetPasswordError.value = error.message || "Gagal mereset password";
    toast.error("Gagal mereset password");
    console.error(error);
  } finally {
    isResettingPassword.value = false;
  }
}

async function editUser(user: {
  id: string;
  username: string;
  email: string;
  full_name: string;
  institusi?: string;
  roles: string[];
  date_joined: string;
}) {
  editingUser.value = {
    id: user.id,
    username: user.username,
    email: user.email,
    full_name: user.full_name,
    institusi: user.institusi || "",
  };

  // Load project-specific roles if project context exists
  if (selectedProjectId.value) {
    try {
      const rolesData = await getUserRolesInProject(user.id, selectedProjectId.value);
      editingUserRoles.value = [...(rolesData.roles || [])];
      editingUserOriginalRoles.value = [...(rolesData.roles || [])];
    } catch (error) {
      console.error('Error fetching user roles in project:', error);
      editingUserRoles.value = [...user.roles];
      editingUserOriginalRoles.value = [...user.roles];
    }
  } else if (isKepalaRiset.value) {
    editingProjectForRole.value = null;
    editingUserRoles.value = [];
    editingUserOriginalRoles.value = [];
  } else {
    editingUserRoles.value = [...user.roles];
    editingUserOriginalRoles.value = [...user.roles];
  }

  isEditDialogOpen.value = true;
}

// Watch for editing project changes and load user's existing roles in that project
watch(editingProjectForRole, async (newProjectId) => {
  if (newProjectId && editingUser.value.id) {
    try {
      const rolesData = await getUserRolesInProject(editingUser.value.id, parseInt(newProjectId.toString()));
      editingUserRoles.value = [...(rolesData.roles || [])];
      editingUserOriginalRoles.value = [...(rolesData.roles || [])];
    } catch (error) {
      console.error('Error fetching user roles in project:', error);
      editingUserRoles.value = [];
      editingUserOriginalRoles.value = [];
    }
  } else {
    editingUserRoles.value = [];
    editingUserOriginalRoles.value = [];
  }
});

function cancelEdit() {
  editingUser.value = {
    username: "",
    email: "",
    full_name: "",
    institusi: "",
  };
  editingUserRoles.value = [];
  editingUserOriginalRoles.value = [];
  editingProjectForRole.value = null;
  isEditDialogOpen.value = false;
}

function resetForm() {
  newUser.value = {
    username: "",
    email: "",
    full_name: "",
    institusi: "",
  };

  newUserRoles.value = [];
  selectedProjectForRole.value = null;

  isCreateDialogOpen.value = false;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID');
}

const pageTitle = computed(() => {
  if (isKepalaRiset.value && selectedProject.value && !isAllProjects.value) {
    return `Kelola Pengguna - ${selectedProject.value.name}`;
  }
  return "Kelola Pengguna";
});

onMounted(async () => {
  await fetchAvailableRoles();
  await fetchProjects();
  await fetchUsers(currentPage.value);
});

// Watch for project context changes and refetch users
watch(selectedProjectId, async (newProjectId, oldProjectId) => {
  if (newProjectId !== oldProjectId && isKepalaRiset.value) {
    currentPage.value = 1; // Reset to first page
    await fetchUsers(currentPage.value);
  }
});

useHead({
  title: pageTitle.value + " - ANOTA",
  meta: [
    { name: "description", content: "Halaman kelola pengguna aplikasi ANOTA." },
  ],
});
</script>