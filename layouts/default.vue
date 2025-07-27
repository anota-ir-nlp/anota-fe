<script setup lang="ts">
import { useAuth } from "~/data/auth";
import { onMounted, ref, computed } from "vue";
import { navigateTo } from "#app";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { ChevronDown, Home, Users, FileText, AlertTriangle, Pencil, Eye, BarChart3, ClipboardList, Download, User, LogOut, Lightbulb } from "lucide-vue-next";

const toast = useToast();
const {
  user,
  isAuthenticated,
  userRoles,
  logout,
  initializeAuth,
} = useAuth();

const userAvatar = computed(() => user.value?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.value?.full_name || 'User')}&background=0ea5e9&color=fff`);
const userName = computed(() => user.value?.full_name || "Pengguna");

const hasRole = (role: string) => userRoles.value.includes(role);

const filteredMenus = computed(() => {
  if (!isAuthenticated.value) {
    return [{ label: "Beranda", path: "/", icon: Home }];
  }

  const menus = [{ label: "Beranda", path: "/beranda", icon: Home }];

  // Add role-specific menus based on user's roles
  if (hasRole("Admin")) {
    menus.push(
      { label: "Kelola Pengguna", path: "/admin/kelola-pengguna", icon: Users },
      { label: "Kelola Dokumen", path: "/admin/kelola-dokumen", icon: FileText },
      { label: "Kelola Error", path: "/admin/kelola-error", icon: AlertTriangle }
    );
  }

  if (hasRole("Annotators")) {
    menus.push({ label: "Anotasi", path: "/anotator/anotasi", icon: Pencil });
  }

  if (hasRole("Reviewers")) {
    menus.push({ label: "Tinjauan", path: "/peninjau/tinjauan", icon: Eye });
  }

  if (hasRole("Kepala Riset")) {
    menus.push(
      { label: "Rekap Kinerja", path: "/kepala-riset/rekap-kinerja", icon: BarChart3 },
      { label: "Rekap Dokumen", path: "/kepala-riset/rekap-dokumen", icon: ClipboardList },
      { label: "Generate Dataset", path: "/kepala-riset/generate-dataset", icon: Download }
    );
  }

  return menus;
});

onMounted(async () => {
  // Initialize auth state from cookies
  await initializeAuth();
});

const handleLoginClick = () => {
  navigateTo("/login");
};

const handleLogout = async () => {
  await logout();
  toast.add({
    title: "Berhasil Keluar",
    description: "Anda telah keluar dari akun.",
    color: "success",
  });
  navigateTo("/");
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-slate-950">
    <!-- Header/Navbar -->
    <header class="sticky top-0 z-50 flex justify-between items-center px-4 md:px-8 py-4 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <NuxtLink to="/" class="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
        <Lightbulb class="text-blue-400" />
        <span class="text-2xl font-bold">ANOTA</span>
      </NuxtLink>

      <nav v-if="isAuthenticated" class="flex items-center space-x-8">
        <!-- Navigation Menu -->
        <ul class="hidden md:flex items-center space-x-6">
          <li v-for="menu in filteredMenus" :key="menu.path">
            <NuxtLink
              :to="menu.path"
              class="flex items-center space-x-2 py-3 px-3 text-slate-200 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              active-class="text-blue-400 bg-blue-500/10"
            >
              <component :is="menu.icon" class="w-3 h-3" />
              <span class="font-medium text-sm">{{ menu.label }}</span>
            </NuxtLink>
          </li>
        </ul>

        <!-- Profile Dropdown -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              class="flex items-center space-x-3 px-3 py-3 text-white hover:bg-slate-800/50 rounded-lg h-auto"
            >
              <Avatar class="ring-2 ring-slate-700">
                <AvatarImage :src="userAvatar" :alt="userName" />
                <AvatarFallback>{{ userName.charAt(0).toUpperCase() }}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent class="w-56">
            <!-- Profile Info -->
            <div class="px-3 py-2">
              <div class="font-medium text-white">{{ userName }}</div>
              <div class="text-sm text-slate-400">{{ user?.email }}</div>
            </div>

            <DropdownMenuSeparator></DropdownMenuSeparator>

            <!-- Menu Items -->
            <DropdownMenuItem @click="handleLogout" variant="destructive" class="cursor-pointer">
              <LogOut class="w-4 h-4 mr-3" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      <!-- Public Navigation -->
      <nav v-else class="flex items-center">
        <Button
          variant="gradient"
          @click="handleLoginClick"
        >
          <LogOut class="w-4 h-4" />
          Masuk
        </Button>
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
      </div>
    </footer>
  </div>
</template>