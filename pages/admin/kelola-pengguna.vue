<template>
  <div class="beranda-container">
    <h1 class="beranda-title">Kelola Pengguna</h1>
    <div v-if="isLoading" class="text-gray-300 mb-4">
      Memuat data pengguna...
    </div>
    <table v-if="users.length" class="min-w-full text-sm table-auto mb-6">
      <thead>
        <tr class="bg-gray-800/60 text-gray-300">
          <th class="px-4 py-2 text-left">Nama</th>
          <th class="px-4 py-2 text-left">Email</th>
          <th class="px-4 py-2 text-left">Role Aktif</th>
          <th class="px-4 py-2 text-left">Roles</th>
          <th class="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          class="border-b border-white/10"
        >
          <td class="px-4 py-2 font-semibold">{{ user.name }}</td>
          <td class="px-4 py-2">{{ user.email }}</td>
          <td class="px-4 py-2">{{ user.active_role }}</td>
          <td class="px-4 py-2">{{ user.roles.join(", ") }}</td>
          <td class="px-4 py-2">
            <UButton
              label="Hapus"
              color="red"
              size="sm"
              icon="i-heroicons-trash"
              @click="deleteUser(user.id)"
              :ui="{ base: 'rounded-full px-4 py-1 font-semibold' }"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!users.length && !isLoading" class="text-gray-400 py-8">
      Tidak ada pengguna ditemukan.
    </div>
    <UButton
      label="Kembali ke Halaman Utama"
      icon="i-heroicons-home"
      variant="outline"
      color="white"
      class="back-button"
      @click="navigateTo('/')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUsersApi } from "~/data/users";
import { navigateTo } from "#app";

const { getUsers, deleteUser: apiDeleteUser } = useUsersApi();
const users = ref([]);
const isLoading = ref(false);

async function fetchUsers() {
  isLoading.value = true;
  try {
    users.value = await getUsers();
  } finally {
    isLoading.value = false;
  }
}
async function deleteUser(id: string) {
  await apiDeleteUser(id);
  fetchUsers();
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
</style>
