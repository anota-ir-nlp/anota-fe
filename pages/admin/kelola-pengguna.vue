<template>
  <div class="beranda-container">
    <h1 class="beranda-title">Kelola Pengguna</h1>
    
    <!-- Create User Form -->
    <div class="glassmorphism-card p-6 mb-6 max-w-2xl">
      <h2 class="text-xl font-semibold mb-4 text-blue-300">Tambah Pengguna Baru</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <UInput
          v-model="newUser.username"
          placeholder="Username"
          :ui="{ base: 'w-full' }"
        />
        <UInput
          v-model="newUser.email"
          type="email"
          placeholder="Email"
          :ui="{ base: 'w-full' }"
        />
        <UInput
          v-model="newUser.full_name"
          placeholder="Nama Lengkap"
          :ui="{ base: 'w-full md:col-span-2' }"
        />
      </div>
      <div class="flex gap-2">
        <UButton
          label="Tambah Pengguna"
          icon="i-heroicons-user-plus"
          @click="createUser"
          :loading="isCreating"
          color="primary"
        />
        <UButton
          label="Reset"
          variant="ghost"
          @click="resetForm"
        />
      </div>
    </div>

    <div v-if="isLoading" class="text-gray-300 mb-4">
      Memuat data pengguna...
    </div>
    
    <div v-if="users.length" class="glassmorphism-card p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4 text-blue-300">Daftar Pengguna</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm table-auto">
          <thead>
            <tr class="bg-gray-800/60 text-gray-300">
              <th class="px-4 py-2 text-left">Nama</th>
              <th class="px-4 py-2 text-left">Username</th>
              <th class="px-4 py-2 text-left">Email</th>
              <th class="px-4 py-2 text-left">Roles</th>
              <th class="px-4 py-2 text-left">Tanggal Bergabung</th>
              <th class="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
              class="border-b border-white/10"
            >
              <td class="px-4 py-2 font-semibold">{{ user.full_name }}</td>
              <td class="px-4 py-2">{{ user.username }}</td>
              <td class="px-4 py-2">{{ user.email }}</td>
              <td class="px-4 py-2">
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="role in user.roles" 
                    :key="role"
                    class="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs"
                  >
                    {{ role }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-2">{{ formatDate(user.date_joined) }}</td>
              <td class="px-4 py-2">
                <div class="flex gap-2">
                  <UButton
                    label="Edit"
                    color="blue"
                    size="sm"
                    icon="i-heroicons-pencil"
                    @click="editUser(user)"
                    :ui="{ base: 'rounded-full px-4 py-1 font-semibold' }"
                  />
                  <UButton
                    label="Hapus"
                    color="red"
                    size="sm"
                    icon="i-heroicons-trash"
                    @click="deleteUser(user.id)"
                    :ui="{ base: 'rounded-full px-4 py-1 font-semibold' }"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div v-if="!users.length && !isLoading" class="glassmorphism-card p-6 text-center">
      <span class="text-gray-400">Tidak ada pengguna ditemukan.</span>
    </div>
    
    <UButton
      label="Kembali ke Beranda"
      icon="i-heroicons-home"
      variant="outline"
      color="white"
      class="back-button"
      @click="navigateTo('/beranda')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUsersApi } from "~/data/users";
import { navigateTo } from "#app";
import type { UsersListResponse, UserRegistrationRequest } from "~/types/api";

const { getUsers, createUser: apiCreateUser, deleteUser: apiDeleteUser } = useUsersApi();
const toast = useToast();

const users = ref<UsersListResponse[]>([]);
const isLoading = ref(false);
const isCreating = ref(false);

const newUser = ref<UserRegistrationRequest>({
  username: "",
  email: "",
  full_name: "",
});

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
    toast.add({
      title: "Berhasil",
      description: `Pengguna ${result.data.username} berhasil dibuat. Password: ${result.data.password}`,
      color: "success",
    });
    resetForm();
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
  // TODO: Implement edit functionality
  toast.add({
    title: "Info",
    description: "Fitur edit akan segera tersedia",
    color: "warning",
  });
}

function resetForm() {
  newUser.value = {
    username: "",
    email: "",
    full_name: "",
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID');
}

onMounted(fetchUsers);

useHead({
  title: "Kelola Pengguna - ANOTA",
  meta: [
    { name: "description", content: "Halaman kelola pengguna aplikasi ANOTA." },
  ],
});
</script>

<style scoped>
.beranda-container {
  min-height: calc(100vh - 16rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  background-color: #0f172a;
  color: white;
  padding: 2rem;
}
.beranda-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #60a5fa;
}
.back-button {
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
  margin-top: 2rem;
}
.back-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.glassmorphism-card {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  border-radius: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18), 0 1.5px 8px rgba(0, 0, 0, 0.1);
}
</style>
