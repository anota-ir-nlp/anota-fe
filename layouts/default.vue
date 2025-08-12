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
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "~/components/ui/menubar";
import {
  Home,
  Users,
  FileText,
  AlertTriangle,
  Pencil,
  BarChart3,
  ClipboardList,
  Download,
  LogOut,
  Lightbulb,
  FileCheck,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import type { AvailableRole } from "~/types/api";

const { user, isAuthenticated, userRoles, logout, initializeAuth } = useAuth();

const userAvatar = computed(
  () =>
    user.value?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.value?.full_name || "User"
    )}&background=0ea5e9&color=fff`
);
const userName = computed(() => user.value?.full_name || "Pengguna");

const hasRole = (role: AvailableRole) => userRoles.value.includes(role);

type MenuGroup =
  | { type: "link"; label: string; path: string; icon: any }
  | {
      type: "dropdown";
      label: string;
      icon: any;
      items: Array<{
        label: string;
        path: string;
        icon: any;
        description: string;
      }>;
    };

const menuGroups = computed<MenuGroup[]>(() => {
  if (!isAuthenticated.value) {
    return [];
  }

  const groups: MenuGroup[] = [];

  groups.push({ type: "link", label: "Beranda", path: "/beranda", icon: Home });

  if (hasRole("Kepala Riset")) {
    groups.push({
      type: "dropdown",
      label: "Kepala Riset",
      icon: BarChart3,
      items: [
        {
          label: "Kelola Project",
          path: "/kepala-riset/kelola-project",
          icon: BarChart3,
          description: "Manage research projects",
        },
        {
          label: "Kelola Pengguna",
          path: "/admin/kelola-pengguna",
          icon: Users,
          description: "Manage system users",
        },
        {
          label: "Rekap Kinerja",
          path: "/kepala-riset/rekap-kinerja",
          icon: BarChart3,
          description: "Performance summary",
        },
        {
          label: "Generate Dataset",
          path: "/kepala-riset/generate-dataset",
          icon: Download,
          description: "Generate dataset files",
        },
      ],
    });
  }

  if (hasRole("Admin")) {
    groups.push({
      type: "dropdown",
      label: "Administrator Project",
      icon: Users,
      items: [
        {
          label: "Kelola Pengguna",
          path: "/admin/kelola-pengguna",
          icon: Users,
          description: "Manage system users",
        },
        {
          label: "Kelola Dokumen",
          path: "/admin/kelola-dokumen",
          icon: FileText,
          description: "Manage documents",
        },
        {
          label: "Kelola Error",
          path: "/admin/kelola-error",
          icon: AlertTriangle,
          description: "Manage system errors",
        },
      ],
    });
  }

  if (hasRole("Reviewer")) {
    groups.push({
      type: "dropdown",
      label: "Reviewer",
      icon: FileCheck,
      items: [
        {
          label: "Daftar Dokumen",
          path: "/peninjau/tinjauan",
          icon: FileCheck,
          description: "Documents to review",
        },
      ],
    });
  }

  if (hasRole("Annotator")) {
    groups.push({
      type: "dropdown",
      label: "Anotator",
      icon: Pencil,
      items: [
        {
          label: "Daftar Dokumen",
          path: "/anotator/anotasi",
          icon: FileText,
          description: "List of documents to annotate",
        },
      ],
    });
  }

  return groups;
});

onMounted(async () => {
  await initializeAuth();
});

const handleLoginClick = () => {
  navigateTo("/login");
};

const handleLogout = async () => {
  await logout();
  toast.success("Anda telah keluar dari akun.");
  navigateTo("/");
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-slate-950">
    <!-- Header/Navbar -->
    <header
      class="sticky top-0 z-50 flex justify-start gap-8 items-center px-4 md:px-8 py-4 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800"
    >
      <NuxtLink
        to="/"
        class="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
      >
        <Lightbulb class="text-blue-400" />
        <span class="text-2xl font-bold">ANOTA</span>
      </NuxtLink>

      <nav v-if="isAuthenticated" class="w-full justify-between flex my-auto">
        <!-- Menubar -->
        <Menubar
          class="hidden md:flex bg-transparent border-none shadow-none space-x-4 my-auto"
        >
          <template v-for="group in menuGroups" :key="group.label">
            <!-- Simple Link Menu Item -->
            <MenubarMenu v-if="group.type === 'link'">
              <MenubarTrigger as-child>
                <NuxtLink
                  :to="group.path"
                  class="flex items-center space-x-2 px-3 py-3 text-slate-200 hover:text-white hover:bg-slate-800/50 data-[state=open]:bg-slate-800/50 data-[state=open]:text-white transition-all duration-200"
                  active-class="text-blue-400 bg-blue-500/10"
                >
                  <component :is="group.icon" class="w-4 h-4" />
                  <span class="font-medium">{{ group.label }}</span>
                </NuxtLink>
              </MenubarTrigger>
            </MenubarMenu>

            <!-- Dropdown Menu Item -->
            <MenubarMenu v-else-if="group.type === 'dropdown'">
              <MenubarTrigger
                class="flex items-center space-x-2 px-3 py-3 text-slate-200 hover:text-white hover:bg-slate-800/50 data-[state=open]:bg-slate-800/50 data-[state=open]:text-white"
              >
                <component :is="group.icon" class="w-4 h-4" />
                <span class="font-medium">{{ group.label }}</span>
              </MenubarTrigger>
              <MenubarContent
                class="bg-slate-800 border border-slate-700 shadow-lg"
              >
                <MenubarItem
                  v-for="item in group.items"
                  :key="item.path"
                  as-child
                  class="flex items-start space-x-3 p-3 cursor-pointer hover:bg-slate-700/50 transition-colors group focus:bg-slate-700/50"
                >
                  <NuxtLink
                    :to="item.path"
                    class="flex items-start space-x-3 w-full"
                    active-class="bg-blue-500/10 text-blue-400"
                  >
                    <component
                      :is="item.icon"
                      class="w-5 h-5 text-slate-400 group-hover:text-slate-300 mt-0.5 flex-shrink-0"
                    />
                    <div class="flex-1">
                      <div
                        class="text-sm font-medium text-slate-200 group-hover:text-white"
                      >
                        {{ item.label }}
                      </div>
                      <div class="text-xs text-slate-400 mt-1 leading-relaxed">
                        {{ item.description }}
                      </div>
                    </div>
                  </NuxtLink>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </template>
        </Menubar>

        <!-- Profile Dropdown -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              class="flex items-center space-x-3 px-3 py-3 text-white hover:bg-slate-800/50 rounded-lg h-auto"
            >
              <Avatar class="ring-2 ring-slate-700">
                <AvatarImage :src="userAvatar" :alt="userName" />
                <AvatarFallback>{{
                  userName.charAt(0).toUpperCase()
                }}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            class="w-56 bg-slate-800 border border-slate-700 shadow-lg"
            align="end"
          >
            <!-- Profile Info -->
            <div class="px-3 py-2">
              <div class="font-medium text-white">{{ userName }}</div>
              <div class="text-sm text-slate-400">{{ user?.email }}</div>
            </div>

            <DropdownMenuSeparator class="bg-slate-700"></DropdownMenuSeparator>

            <!-- Menu Items -->
            <DropdownMenuItem
              @click="handleLogout"
              variant="destructive"
              class="cursor-pointer hover:bg-red-600/20 focus:bg-red-600/20"
            >
              <LogOut class="w-4 h-4 mr-3" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      <!-- Public Navigation -->
      <nav v-else class="flex items-end w-full justify-end">
        <Button variant="gradient" @click="handleLoginClick">
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
    <footer
      class="border-t border-slate-800 bg-slate-900/50 px-8 py-6 text-center"
    >
      <div class="max-w-5xl mx-auto flex flex-col items-center space-y-4">
        <p class="text-slate-300">
          &copy; {{ new Date().getFullYear() }} ANOTA. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Custom styles for better dark theme compatibility */
:deep(.menubar-content) {
  background-color: #1f2937 !important;
  border-color: #374151 !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

:deep(.dropdown-menu-content) {
  background-color: #1f2937 !important;
  border-color: #374151 !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}

:deep(.menubar-item) {
  color: #e5e7eb !important;
}

:deep(.menubar-item:hover) {
  background-color: #374151 !important;
}

:deep(.dropdown-menu-item) {
  color: #e5e7eb !important;
}

:deep(.dropdown-menu-item:hover) {
  background-color: #374151 !important;
}
</style>
