<template>
  <div class="flex flex-col items-center justify-start text-center bg-slate-900 text-white p-8 min-h-screen">
    <h1 class="text-4xl font-bold mb-20 text-blue-400">Kelola Pengguna</h1>

    <!-- Add User Button -->
    <div class="mb-6 w-full">
      <Dialog v-model:open="isCreateDialogOpen">
        <div class="flex gap-3 items-start w-full max-w-6xl mx-auto">
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
              <label for="roles" class="text-sm font-medium text-left">Roles</label>
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
                        v-for="role in availableRoles.filter((r: string) => r.includes(searchTermCreate || '') && !newUserRoles.includes(r))"
                        :key="role" :value="role" @select.prevent="(ev: { detail: { value: string | unknown } }) => {
                          if (typeof ev.detail.value === 'string') {
                            searchTermCreate = ''
                            newUserRoles.push(ev.detail.value)
                          }
                          if (availableRoles.filter((r: string) => r.includes(searchTermCreate || '') && !newUserRoles.includes(r)).length === 0) {
                            openCreateRoles = false
                          }
                        }">
                        {{ role }}
                      </ComboboxItem>
                    </ComboboxGroup>
                  </ComboboxList>
                </ComboboxAnchor>
              </Combobox>
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

    <!-- Edit User Dialog -->
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
            <label for="edit_roles" class="text-sm font-medium text-left">Roles</label>
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
                      v-for="role in availableRoles.filter((r: string) => r.includes(searchTermEdit || '') && !editingUserRoles.includes(r))"
                      :key="role" :value="role" @select.prevent="(ev: { detail: { value: string | unknown } }) => {
                        if (typeof ev.detail.value === 'string') {
                          searchTermEdit = ''
                          editingUserRoles.push(ev.detail.value)
                        }
                        if (availableRoles.filter((r: string) => r.includes(searchTermEdit || '') && !editingUserRoles.includes(r)).length === 0) {
                          openEditRoles = false
                        }
                      }">
                      {{ role }}
                    </ComboboxItem>
                  </ComboboxGroup>
                </ComboboxList>
              </ComboboxAnchor>
            </Combobox>
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

    <!-- Delete Confirmation Dialog -->
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

    <div v-if="isLoading" class="text-gray-300 mb-4">
      Memuat data pengguna...
    </div>

    <div v-if="users.length"
      class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg p-6 mb-6 w-full max-w-6xl">
      <div class="rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow class="bg-gray-800/60 hover:bg-gray-800/60">
              <TableHead class="text-gray-300 font-medium text-left">Nama</TableHead>
              <TableHead class="text-gray-300 font-medium text-left">Username</TableHead>
              <TableHead class="text-gray-300 font-medium text-left">Email</TableHead>
              <TableHead class="text-gray-300 font-medium text-left">Roles</TableHead>
              <TableHead class="text-gray-300 font-medium text-left">Tanggal Bergabung</TableHead>
              <TableHead class="text-gray-300 font-medium text-left"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in users" :key="user.id" class="border-white/10 hover:bg-white/5">
              <TableCell class="font-semibold text-white text-left">{{ user.full_name }}</TableCell>
              <TableCell class="text-white text-left">{{ user.username }}</TableCell>
              <TableCell class="text-white text-left">{{ user.email }}</TableCell>
              <TableCell class="text-left">
                <div class="flex flex-wrap gap-1">
                  <Badge v-for="role in user.roles" :key="role" variant="blue" class="font-semibold">
                    {{ role }}
                  </Badge>
                </div>
              </TableCell>
              <TableCell class="text-white text-left">{{ formatDate(user.date_joined) }}</TableCell>
              <TableCell class="flex w-full justify-end">
                <div class="flex gap-2">
                  <Button size="sm" variant="outline" @click="editUser(user)"
                    class="rounded-full px-4 py-1 font-semibold">
                    <Pencil class="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" @click="showDeleteDialog(user)"
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

    <!-- Pagination Controls: moved outside the card -->
    <div v-if="users.length" class="mt-4 flex justify-center w-full max-w-6xl">
      <Pagination :page="currentPage" :total="totalPages" :items-per-page="users.length > 0 ? users.length : 1"
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

    <div v-if="!users.length && !isLoading"
      class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg p-6 text-center w-full max-w-6xl mx-auto">
      <span class="text-gray-400">Tidak ada pengguna ditemukan.</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useUsersApi } from "~/data/users";
import type { UserResponse, UserRegistrationRequest, UserRegistrationResponse } from "~/types/api";
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
import { TagsInput, TagsInputItem, TagsInputInput, TagsInputItemDelete, TagsInputItemText } from "~/components/ui/tags-input";
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import {
  Plus, Loader2, Check, Pencil, Trash2, ArrowLeft, ArrowRight, MoreHorizontal
} from "lucide-vue-next";
import { toast } from "vue-sonner";

const {
  getUsers,
  createUser: apiCreateUser,
  deleteUser: apiDeleteUser,
  updateUser: apiUpdateUser,
  getAvailableRoles,
  manageUserRole,
} = useUsersApi();

const users = ref<UserResponse[]>([]);
const isLoading = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);

const newUser = ref<UserRegistrationRequest>({
  username: "",
  email: "",
  full_name: "",
});

const editingUser = ref<Partial<UserResponse>>({
  username: "",
  email: "",
  full_name: "",
});

const availableRoles = ref<string[]>([]);
const newUserRoles = ref<string[]>([]);
const editingUserRoles = ref<string[]>([]);
const openCreateRoles = ref(false);
const openEditRoles = ref(false);
const searchTermCreate = ref('');
const searchTermEdit = ref('');

const currentPage = ref(1);
const totalPages = ref(1);

const userToDelete = ref<UserResponse | null>(null);

async function fetchAvailableRoles() {
  try {
    const res = await getAvailableRoles();
    availableRoles.value = res.roles;
  } catch (error) {
    toast.error("Gagal memuat daftar roles");
  }
}

async function fetchUsers(page = 1) {
  isLoading.value = true;
  try {
    const response = await getUsers(page);
    users.value = response.results;
    currentPage.value = page;
    totalPages.value = Math.max(1, Math.ceil(response.count / 20));
  } catch (error) {
    console.error('Error fetching users:', error);
    toast.error("Gagal memuat data pengguna");
  } finally {
    isLoading.value = false;
  }
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

async function createUser() {
  if (!newUser.value.username || !newUser.value.full_name) {
    toast.error("Username dan nama lengkap harus diisi");
    return;
  }

  isCreating.value = true;
  try {
    toast.promise(
      (async () => {
        const result = await apiCreateUser(newUser.value);
        for (const role of newUserRoles.value) {
          await manageUserRole({
            user_id: result.data.id,
            role,
            action: "add",
          });
        }
        return result;
      })(),
      {
        loading: "Menambah pengguna...",
        success: (result: UserRegistrationResponse) => {
          resetForm();
          fetchUsers(currentPage.value);
          return `Pengguna ${result.data.username} berhasil dibuat. Password: ${result.data.password}`;
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

  isUpdating.value = true;
  try {
    toast.promise(
      (async () => {
        const updateData = {
          username: editingUser.value.username,
          email: editingUser.value.email,
          full_name: editingUser.value.full_name,
        };

        await apiUpdateUser(editingUser.value.id!, updateData);

        const currentRoles = users.value.find(u => u.id === editingUser.value.id)?.roles || [];
        const toAdd = editingUserRoles.value.filter(r => !currentRoles.includes(r));
        const toRemove = currentRoles.filter(r => !editingUserRoles.value.includes(r));
        for (const role of toAdd) {
          await manageUserRole({
            user_id: editingUser.value.id!,
            role,
            action: "add",
          });
        }
        for (const role of toRemove) {
          await manageUserRole({
            user_id: editingUser.value.id!,
            role,
            action: "remove",
          });
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

  isDeleting.value = true;
  try {
    await toast.promise(
      apiDeleteUser(userToDelete.value.id),
      {
        loading: "Menghapus pengguna...",
        success: "Pengguna berhasil dihapus",
        error: "Gagal menghapus pengguna",
      }
    );

    const response = await getUsers(currentPage.value);
    if (response.results.length === 0 && currentPage.value > 1) {
      await fetchUsers(currentPage.value - 1);
    } else {
      await fetchUsers(currentPage.value);
    }

    isDeleteDialogOpen.value = false;
    userToDelete.value = null;
  } catch (error) {
    console.error('Error deleting user:', error);
  } finally {
    isDeleting.value = false;
  }
}

function editUser(user: {
  id: string;
  username: string;
  email: string;
  full_name: string;
  roles: string[];
  date_joined: string;
}) {
  editingUser.value = {
    id: user.id,
    username: user.username,
    email: user.email,
    full_name: user.full_name,
  };
  editingUserRoles.value = [...user.roles];
  isEditDialogOpen.value = true;
}

function cancelEdit() {
  editingUser.value = {
    username: "",
    email: "",
    full_name: "",
  };
  editingUserRoles.value = [];
  isEditDialogOpen.value = false;
}

function resetForm() {
  newUser.value = {
    username: "",
    email: "",
    full_name: "",
  };
  newUserRoles.value = [];
  isCreateDialogOpen.value = false;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID');
}

onMounted(async () => {
  await fetchAvailableRoles();
  await fetchUsers(currentPage.value);
});

useHead({
  title: "Kelola Pengguna - ANOTA",
  meta: [
    { name: "description", content: "Halaman kelola pengguna aplikasi ANOTA." },
  ],
});
</script>