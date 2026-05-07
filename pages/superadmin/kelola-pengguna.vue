<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter bg-gray-50">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2 text-left">Kelola Pengguna Sistem</h1>
          <p class="text-gray-600 text-left">
            Manajemen akun pengguna global, reset password, dan kontrol akses infrastruktur.
          </p>
        </div>

        <Dialog v-model:open="isCreateDialogOpen">
          <DialogTrigger as-child>
            <Button class="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center gap-2 w-fit">
              <Plus class="w-4 h-4" />
              Tambah Pengguna Baru
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle class="text-left">Tambah Pengguna Baru</DialogTitle>
              <DialogDescription class="text-left">
                Informasi login akan dikirimkan ke email yang didaftarkan.
              </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
              <div class="grid gap-2">
                <label class="text-sm font-medium text-left">Username</label>
                <Input v-model="newUser.username" placeholder="cth: fiona_ratu" />
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium text-left">Email</label>
                <Input v-model="newUser.email" type="email" placeholder="email@ui.ac.id" />
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium text-left">Nama Lengkap</label>
                <Input v-model="newUser.full_name" placeholder="Nama Lengkap" />
              </div>
            </div>
            <div class="grid gap-2 text-left">
            <label for="institusi" class="text-sm font-medium">Institusi</label>
            <Input id="institusi" v-model="newUser.institusi" placeholder="Universitas Indonesia" />
            </div>

            <div class="grid gap-2 text-left">
            <label class="text-sm font-medium">Role Sistem</label>
            <Select v-model="newUser.role">
                <SelectTrigger>
                <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Kepala Riset">Kepala Riset</SelectItem>
                <SelectItem value="Annotator">Annotator</SelectItem>
                <SelectItem value="Reviewer">Reviewer</SelectItem>
                </SelectContent>
            </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" @click="isCreateDialogOpen = false">Batal</Button>
              <Button class="bg-blue-600 hover:bg-blue-700 text-white" :loading="isCreating" @click="handleCreateUser">Simpan & Kirim Email</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card class="border-none shadow-sm overflow-hidden bg-white">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 border-b text-gray-700 uppercase text-[11px] font-bold">
              <tr>
                <th class="px-6 py-4">Nama Lengkap</th>
                <th class="px-6 py-4">Username & Email</th>
                <th class="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="isLoading" class="animate-pulse">
                <td colspan="4" class="px-6 py-10 text-center text-gray-400">Memuat daftar pengguna...</td>
              </tr>
              <tr v-else-if="usersList.length === 0">
                <td colspan="4" class="px-6 py-10 text-center text-gray-400">Belum ada pengguna terdaftar.</td>
              </tr>
              <tr v-for="u in usersList" :key="u.id" class="hover:bg-gray-50/50 transition-colors">
                <td class="px-6 py-4 font-semibold text-gray-900">{{ u.full_name }}</td>
                <td class="px-6 py-4">
                  <div class="text-gray-900 font-medium">{{ u.username }}</div>
                  <div class="text-gray-400 text-xs">{{ u.email }}</div>
                </td>
                <td class="px-6 py-4 text-right flex justify-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                        <MoreVertical class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-48 bg-white border border-gray-200 shadow-lg">
                      <DropdownMenuItem @click="openEditDialog(u)" class="cursor-pointer">
                        <Pencil class="w-4 h-4 mr-2" /> Edit Profil
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="handleResetPassword(u)" class="cursor-pointer text-orange-600">
                        <Key class="w-4 h-4 mr-2" /> Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem @click="handleDeleteUser(u)" class="cursor-pointer text-red-600">
                        <Trash2 class="w-4 h-4 mr-2" /> Hapus Global
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>

    <Dialog v-model:open="isEditDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="text-left">Edit Pengguna</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4" v-if="editingUser">
          <div class="grid gap-2 text-left">
            <label class="text-sm font-medium">Ubah Role</label>
            <Select v-model="editingUser.role">
                <SelectTrigger>
                <SelectValue :placeholder="editingUser.role || 'Pilih Role'" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Kepala Riset">Kepala Riset</SelectItem>
                <SelectItem value="Annotator">Annotator</SelectItem>
                <SelectItem value="Reviewer">Reviewer</SelectItem>
                </SelectContent>
            </Select>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="isEditDialogOpen = false">Batal</Button>
          <Button :loading="isUpdating" @click="handleUpdateUser">Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Plus, MoreVertical, Pencil, Key, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useUsersApi } from "~/data/users";

// UI Components
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";

const { getUsers, createUser: createUserApi, updateUserGlobally, deleteUserGlobally, resetPasswordGlobally } = useUsersApi();

// States
const usersList = ref<any[]>([]);
const isLoading = ref(false);
const isCreateDialogOpen = ref(false);
const isCreating = ref(false);

const isEditDialogOpen = ref(false);
const isUpdating = ref(false);
const editingUser = ref<any>(null);

const newUser = ref({
  username: "",
  email: "",
  full_name: "",
  institusi: "",
  role: "Annotator", // Set default ke role yang paling umum atau kosongkan
});

// Actions
const fetchUsers = async () => {
  isLoading.value = true;
  try {
    const res = await getUsers(); // Mengambil data user global
    usersList.value = res.results || [];
  } catch (error) {
    toast.error("Gagal memuat daftar pengguna.");
  } finally {
    isLoading.value = false;
  }
};

const handleCreateUser = async () => {
  isCreating.value = true;
  try {
    await createUserApi(newUser.value); // Pastikan API create user tanpa project_id
    toast.success("Pengguna berhasil dibuat dan email dikirim.");
    isCreateDialogOpen.value = false;
    fetchUsers();
  } catch (error) {
    toast.error("Gagal membuat pengguna.");
  } finally {
    isCreating.value = false;
  }
};

const openEditDialog = (user: any) => {
  editingUser.value = { ...user };
  isEditDialogOpen.value = true;
};

const handleUpdateUser = async () => {
  isUpdating.value = true;
  try {
    // Gunakan fungsi update yang sudah kita buat/sesuaikan untuk global
    await updateUserGlobally(editingUser.value.id, {
      full_name: editingUser.value.full_name,
      email: editingUser.value.email,
      roles: [editingUser.value.role] // Pastikan ini ada
    });
    toast.success("Data pengguna dan role berhasil diperbarui.");
    isEditDialogOpen.value = false;
    fetchUsers();
  } catch (error) {
    toast.error("Gagal memperbarui pengguna.");
  } finally {
    isUpdating.value = false;
  }
};

const handleDeleteUser = async (user: any) => {
  if (!confirm(`Hapus pengguna ${user.full_name} secara permanen dari seluruh sistem?`)) return;
  
  try {
    await deleteUserGlobally(user.id); // Menghapus user secara global
    toast.success("Pengguna berhasil dihapus.");
    fetchUsers();
  } catch (error) {
    toast.error("Gagal menghapus pengguna.");
  }
};

const handleResetPassword = async (user: any) => {
  const newPassword = prompt(`Masukkan password baru untuk ${user.full_name}:`, "Anota123!");
  
  if (!newPassword) return;

  try {
    await resetPasswordGlobally(user.id, { new_password: newPassword });
    toast.success(`Password untuk ${user.username} berhasil diubah.`);
  } catch (error) {
    toast.error("Gagal mereset password.");
  }
};

onMounted(fetchUsers);
</script>