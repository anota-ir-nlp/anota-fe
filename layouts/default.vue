<script setup lang="ts">
import { useAuth } from "~/data/auth";
import { onMounted, onUnmounted, ref, computed } from "vue";
import { navigateTo } from "#app";

const toast = useToast();
const {
  user,
  isAuthenticated,
  availableRoles,
  activeRole,
  logout,
  initializeAuth,
} = useAuth();

const isProfileDropdownOpen = ref(false);
const isSubmenuOpen = ref(false);
const profileDropdownRef = ref<HTMLElement | null>(null);

const userAvatar = computed(() => user.value?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.value?.full_name || 'User')}&background=0ea5e9&color=fff`);
const userName = computed(() => user.value?.full_name || "Pengguna");
const userRole = computed(() => {
  const role = activeRole.value;
  if (!role) return "";
  
  // Convert API role names to display names
  const roleMap: Record<string, string> = {
    'Admin': 'Admin',
    'Annotators': 'Anotator', 
    'Reviewers': 'Peninjau',
    'Researcher': 'Peneliti',
    'Kepala Riset': 'Kepala Riset'
  };
  
  return roleMap[role] || role;
});

const filteredMenus = computed(() => {
  if (!isAuthenticated.value) {
    return [{ label: "Beranda", path: "/" }];
  }

  const role = activeRole.value;
  
  switch (role) {
    case "Admin":
      return [
        { label: "Beranda", path: "/beranda", icon: "i-heroicons-home" },
        { label: "Kelola Pengguna", path: "/admin/kelola-pengguna", icon: "i-heroicons-users" },
        { label: "Kelola Dokumen", path: "/admin/kelola-dokumen", icon: "i-heroicons-document-text" },
        { label: "Kelola Error", path: "/admin/kelola-error", icon: "i-heroicons-exclamation-triangle" },
      ];
    case "Annotators":
      return [
        { label: "Beranda", path: "/beranda", icon: "i-heroicons-home" },
        { label: "Anotasi", path: "/anotator/anotasi", icon: "i-heroicons-pencil" },
      ];
    case "Reviewers":
      return [
        { label: "Beranda", path: "/beranda", icon: "i-heroicons-home" },
        { label: "Tinjauan", path: "/peninjau/tinjauan", icon: "i-heroicons-eye" },
      ];
    case "Kepala Riset":
      return [
        { label: "Beranda", path: "/beranda", icon: "i-heroicons-home" },
        { label: "Rekap Kinerja", path: "/kepala-riset/rekap-kinerja", icon: "i-heroicons-chart-bar" },
        { label: "Rekap Dokumen", path: "/kepala-riset/rekap-dokumen", icon: "i-heroicons-clipboard-document-list" },
        { label: "Generate Dataset", path: "/kepala-riset/generate-dataset", icon: "i-heroicons-arrow-down-tray" },
      ];
    default:
      return [{ label: "Beranda", path: "/beranda", icon: "i-heroicons-home" }];
  }
});

const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
  if (!isProfileDropdownOpen.value) isSubmenuOpen.value = false;
};

const toggleSubmenu = (event: MouseEvent) => {
  event.stopPropagation();
  isSubmenuOpen.value = !isSubmenuOpen.value;
};

const closeProfileDropdown = () => {
  isProfileDropdownOpen.value = false;
  isSubmenuOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    profileDropdownRef.value &&
    !profileDropdownRef.value.contains(event.target as Node)
  ) {
    closeProfileDropdown();
  }
};

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);
  // Initialize auth state from cookies
  await initializeAuth();
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const handleLoginClick = () => {
  navigateTo("/login");
};

const viewProfile = () => {
  toast.add({
    title: "Lihat Profil",
    description: "Navigasi ke halaman profil.",
    color: "neutral",
  });
  closeProfileDropdown();
};

const handleLogout = async () => {
  await logout();
  toast.add({
    title: "Berhasil Keluar",
    description: "Anda telah keluar dari akun.",
    color: "success",
  });
  closeProfileDropdown();
  navigateTo("/");
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-slate-950">
    <!-- Header/Navbar -->
    <header class="sticky top-0 z-50 flex justify-between items-center px-4 md:px-8 py-4 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <NuxtLink to="/" class="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
        <UIcon name="i-heroicons-light-bulb" class="w-8 h-8 text-blue-400" />
        <span class="text-2xl font-bold">ANOTA</span>
      </NuxtLink>

      <nav v-if="isAuthenticated" class="flex items-center space-x-8">
        <!-- Navigation Menu -->
        <ul class="hidden md:flex items-center space-x-6">
          <li v-for="menu in filteredMenus" :key="menu.path">
            <NuxtLink 
              :to="menu.path" 
              class="flex items-center space-x-2 px-3 py-2 text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              active-class="text-blue-400 bg-blue-500/10"
            >
              <UIcon :name="menu.icon" class="w-4 h-4" />
              <span class="font-medium">{{ menu.label }}</span>
            </NuxtLink>
          </li>
        </ul>

        <!-- Profile Dropdown -->
        <div class="relative" ref="profileDropdownRef">
          <button 
            @click="toggleProfileDropdown"
            class="flex items-center space-x-3 px-3 py-2 text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
          >
            <UAvatar :src="userAvatar" :alt="userName" size="md" class="ring-2 ring-slate-700" />
            <div class="hidden md:block text-left">
              <div class="font-semibold text-sm">{{ userName }}</div>
              <div class="text-xs text-slate-400">{{ userRole }}</div>
            </div>
            <UIcon 
              name="i-heroicons-chevron-down-20-solid" 
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': isProfileDropdownOpen }"
            />
          </button>

          <!-- Dropdown Menu -->
          <div 
            v-if="isProfileDropdownOpen" 
            class="absolute right-0 top-full mt-2 w-56 bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl shadow-xl py-2"
          >
            <!-- Profile Info -->
            <div class="px-4 py-3 border-b border-slate-700">
              <div class="font-medium text-white">{{ userName }}</div>
              <div class="text-sm text-slate-400">{{ user?.email }}</div>
            </div>

            <!-- Menu Items -->
            <div class="py-1">
              <button 
                @click="viewProfile"
                class="w-full flex items-center space-x-3 px-4 py-2 text-slate-200 hover:text-white hover:bg-slate-700/50 transition-colors"
              >
                <UIcon name="i-heroicons-user" class="w-4 h-4" />
                <span>Lihat Profil</span>
              </button>
            </div>

            <div class="border-t border-slate-700 pt-1">
              <button 
                @click="handleLogout"
                class="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Public Navigation -->
      <nav v-else class="flex items-center">
        <UButton
          label="Masuk"
          icon="i-heroicons-arrow-right-on-rectangle"
          variant="solid"
          color="primary"
          class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          @click="handleLoginClick"
        />
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-800 bg-slate-900/50 px-8 py-6 text-center">
      <div class="max-w-5xl mx-auto flex flex-col items-center space-y-4">
        <p class="text-slate-300">
          &copy; {{ new Date().getFullYear() }} ANOTA. All rights reserved.
        </p>
        <div class="flex items-center space-x-2">
          <UButton
            icon="i-mdi-github"
            variant="ghost"
            color="neutral"
            to="https://github.com/your-org/anota"
            target="_blank"
            aria-label="GitHub"
            class="text-slate-400 hover:text-white transition-colors"
          />
          <UButton
            icon="i-mdi-twitter"
            variant="ghost"
            color="neutral"
            to="https://twitter.com"
            target="_blank"
            aria-label="Twitter"
            class="text-slate-400 hover:text-white transition-colors"
          />
        </div>
      </div>
    </footer>
  </div>
</template>

