<template>
  <div class="flex flex-col items-center justify-start text-center bg-slate-900 text-white p-8 min-h-screen">
    <h1 class="text-4xl font-bold mb-20 text-blue-400">Kelola Pengguna</h1>

    <!-- Add User Button -->
    <div class="mb-6 w-full">
      <Dialog v-model:open="isCreateDialogOpen">
        <div class="flex gap-3 items-start w-full max-w-6xl mx-auto">
          <DialogTrigger as-child>
            <Button class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Tambah Pengguna Baru
            </Button>
          </DialogTrigger>

          <Button variant="outline" class="flex items-center gap-2" @click="navigateTo('/beranda')">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Kembali ke Beranda
          </Button>
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
                      <div v-if="newUserRoles.length" class="flex gap-2 flex-wrap items-center p-1 font-medium uppercase">
                        <TagsInputItem v-for="item in newUserRoles" :key="item" :value="item">
                          <TagsInputItemText  class="text-xs"/>
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
                      <ComboboxItem class="uppercase"
                        v-for="role in availableRoles.filter(r => r.toLowerCase().includes(searchTermCreate?.toLowerCase() || '') && !newUserRoles.includes(r))"
                        :key="role" :value="role" @select.prevent="(ev) => {
                          if (typeof ev.detail.value === 'string') {
                            searchTermCreate = ''
                            newUserRoles.push(ev.detail.value)
                          }
                          if (availableRoles.filter(r => r.toLowerCase().includes(searchTermCreate?.toLowerCase() || '') && !newUserRoles.includes(r)).length === 0) {
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
              <svg v-if="!isCreating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
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
                    <div v-if="editingUserRoles.length" class="flex gap-2 flex-wrap items-center p-1 font-medium uppercase">
                      <TagsInputItem v-for="item in editingUserRoles" :key="item" :value="item">
                        <TagsInputItemText class="text-xs"/>
                        <TagsInputItemDelete @click="editingUserRoles.splice(editingUserRoles.indexOf(item), 1)" />
                      </TagsInputItem>
                    </div>
                    <ComboboxInput v-model="searchTermEdit" as-child>
                      <TagsInputInput placeholder="Tambah role..." class="w-full" @keydown.enter.prevent />
                    </ComboboxInput>
                  </div>
                </TagsInput>

                <ComboboxList class="w-[--reka-popper-anchor-width]">
                  <ComboboxEmpty />
                  <ComboboxGroup>
                    <ComboboxItem class="uppercase"
                      v-for="role in availableRoles.filter(r => r.toLowerCase().includes(searchTermEdit?.toLowerCase() || '') && !editingUserRoles.includes(r))"
                      :key="role" :value="role" @select.prevent="(ev) => {
                        if (typeof ev.detail.value === 'string') {
                          searchTermEdit = ''
                          editingUserRoles.push(ev.detail.value)
                        }
                        if (availableRoles.filter(r => r.toLowerCase().includes(searchTermEdit?.toLowerCase() || '') && !editingUserRoles.includes(r)).length === 0) {
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
            <svg v-if="!isUpdating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            {{ isUpdating ? 'Mengupdate...' : 'Update Pengguna' }}
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
                <div class="flex flex-wrap gap-1 font-medium uppercase">
                  <Badge v-for="role in user.roles" :key="role" variant="blue">
                    {{ role }}
                  </Badge>
                </div>
              </TableCell>
              <TableCell class="text-white text-left">{{ formatDate(user.date_joined) }}</TableCell>
              <TableCell class="flex w-full justify-end">
                <div class="flex gap-2">
                  <Button size="sm" variant="outline" @click="editUser(user)"
                    class="rounded-full px-4 py-1 font-semibold">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" @click="deleteUser(user.id)"
                    class="rounded-full px-4 py-1 font-semibold">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Hapus
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>

    <div v-if="!users.length && !isLoading"
      class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg p-6 text-center">
      <span class="text-gray-400">Tidak ada pengguna ditemukan.</span>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUsersApi } from "~/data/users";
import { navigateTo } from "#app";
import type { UsersListResponse, UserRegistrationRequest } from "~/types/api";
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
import { TagsInput, TagsInputItem, TagsInputInput, TagsInputItemDelete, TagsInputItemText } from "~/components/ui/tags-input";
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'

const {
  getUsers,
  createUser: apiCreateUser,
  deleteUser: apiDeleteUser,
  updateUser: apiUpdateUser,
  getAvailableRoles,
  manageUserRole,
} = useUsersApi();
const toast = useToast();

const users = ref<UsersListResponse[]>([]);
const isLoading = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isCreateDialogOpen = ref(false);
const isEditDialogOpen = ref(false);

const newUser = ref<UserRegistrationRequest>({
  username: "",
  email: "",
  full_name: "",
});

const editingUser = ref<{
  id?: string;
  username: string;
  email: string;
  full_name: string;
}>({
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

// Fetch available roles for dropdown
async function fetchAvailableRoles() {
  try {
    const res = await getAvailableRoles();
    availableRoles.value = res.roles;
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Gagal memuat daftar roles",
      color: "error",
    });
  }
}

async function fetchUsers() {
  isLoading.value = true;
  try {
    users.value = await getUsers();
  } catch (error) {
    console.error('Error fetching users:', error);
    toast.add({
      title: "Error",
      description: "Gagal memuat data pengguna",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}

async function createUser() {
  if (!newUser.value.username || !newUser.value.full_name) {
    toast.add({
      title: "Validasi Error",
      description: "Username dan nama lengkap harus diisi",
      color: "error",
    });
    return;
  }

  isCreating.value = true;
  try {
    const result = await apiCreateUser(newUser.value);
    for (const role of newUserRoles.value) {
      await manageUserRole({
        user_id: result.data.id,
        role,
        action: "add",
      });
    }
    toast.add({
      title: "Berhasil",
      description: `Pengguna ${result.data.username} berhasil dibuat. Password: ${result.data.password}`,
      color: "success",
    });
    resetForm();
    isCreateDialogOpen.value = false;
    await fetchUsers();
  } catch (error) {
    console.error('Error creating user:', error);
    toast.add({
      title: "Error",
      description: "Gagal membuat pengguna baru",
      color: "error",
    });
  } finally {
    isCreating.value = false;
  }
}

async function updateUser() {
  if (!editingUser.value.id || !editingUser.value.username || !editingUser.value.full_name) {
    toast.add({
      title: "Validasi Error",
      description: "Username dan nama lengkap harus diisi",
      color: "error",
    });
    return;
  }

  isUpdating.value = true;
  try {
    const updateData = {
      username: editingUser.value.username,
      email: editingUser.value.email,
      full_name: editingUser.value.full_name,
    };

    await apiUpdateUser(editingUser.value.id, updateData);

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

    toast.add({
      title: "Berhasil",
      description: `Pengguna ${editingUser.value.username} berhasil diupdate`,
      color: "success",
    });
    isEditDialogOpen.value = false;
    await fetchUsers();
  } catch (error) {
    console.error('Error updating user:', error);
    toast.add({
      title: "Error",
      description: "Gagal mengupdate pengguna",
      color: "error",
    });
  } finally {
    isUpdating.value = false;
  }
}

async function deleteUser(id: string) {
  if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
    return;
  }

  try {
    await apiDeleteUser(id);
    toast.add({
      title: "Berhasil",
      description: "Pengguna berhasil dihapus",
      color: "success",
    });
    await fetchUsers();
  } catch (error) {
    console.error('Error deleting user:', error);
    toast.add({
      title: "Error",
      description: "Gagal menghapus pengguna",
      color: "error",
    });
  }
}

function editUser(user: UsersListResponse) {
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
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID');
}

onMounted(async () => {
  await fetchAvailableRoles();
  await fetchUsers();
});

useHead({
  title: "Kelola Pengguna - ANOTA",
  meta: [
    { name: "description", content: "Halaman kelola pengguna aplikasi ANOTA." },
  ],
});
</script>
