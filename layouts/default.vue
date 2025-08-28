<script setup lang="ts">
import { useAuth } from "~/data/auth";
import { useProjectsApi } from "~/data/projects";
import { useProjectContext } from "~/composables/project-context";
import { onMounted, ref, computed, watch } from "vue";
import { navigateTo, useRoute } from "#app";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
  Building2,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import type { AvailableRole, ProjectResponse } from "~/types/api";
import type { AcceptableValue } from "reka-ui";

const { user, isAuthenticated, userRoles, logout, initializeAuth } = useAuth();
const { getProjects } = useProjectsApi();
const { selectedProject, setSelectedProject, clearSelectedProject } = useProjectContext();
const route = useRoute();

const userAvatar = computed(
  () =>
    user.value?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.value?.full_name || "User"
    )}&background=0ea5e9&color=fff`
);
const userName = computed(() => user.value?.full_name || "Pengguna");

const hasRole = (role: AvailableRole) => userRoles.value.includes(role);

const userProjects = ref<ProjectResponse[]>([]);
const isLoadingProjects = ref(false);

async function fetchUserProjects() {
  if (!isAuthenticated.value || (!hasRole("Admin") && !hasRole("Kepala Riset"))) {
    userProjects.value = [];
    return;
  }

  isLoadingProjects.value = true;
  try {
    const response = await getProjects();
    userProjects.value = response.results;
  } catch (error) {
    console.error('Error fetching projects:', error);
    toast.error("Gagal memuat daftar project");
    userProjects.value = [];
  } finally {
    isLoadingProjects.value = false;
  }
}

const isKelolaSemuaProjects = computed(() => {
  return route.path === '/admin/kelola-dokumen';
});

function handleProjectChange(value: AcceptableValue) {
  const projectId = value?.toString() || null;
  if (!projectId || (projectId === "all" && !isKelolaSemuaProjects.value)) {
    clearSelectedProject();
  } else if (projectId === "all" && isKelolaSemuaProjects.value) {
    return;
  } else {
    const project = userProjects.value.find(p => p.id.toString() === projectId);
    if (project) {
      setSelectedProject(project);
    }
  }
}

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

// Add route access checking function
function canAccessRoute(route: string): boolean {
  if (!isAuthenticated.value) return false;
  
  const roleBasedRoutes = {
    'Admin': [
      '/admin/kelola-dokumen',
      '/admin/kelola-error',
      '/kepala-riset-admin/kelola-pengguna'
    ],
    'Annotator': [
      '/anotator/anotasi'
    ],
    'Reviewer': [
      '/peninjau/tinjauan'
    ],
    'Kepala Riset': [
      '/kepala-riset/kelola-project',
      '/kepala-riset-admin/kelola-pengguna',
      '/admin/kelola-dokumen',
      '/admin/kelola-error'
    ]
  };

  const userRoleList = userRoles.value || [];
  
  for (const role of userRoleList) {
    const allowedRoutes = roleBasedRoutes[role as keyof typeof roleBasedRoutes] || [];
    if (allowedRoutes.some(allowedRoute => route.startsWith(allowedRoute))) {
      return true;
    }
  }

  return false;
}

const menuGroups = computed<MenuGroup[]>(() => {
  if (!isAuthenticated.value) {
    return [];
  }

  const groups: MenuGroup[] = [];

  groups.push({ type: "link", label: "Beranda", path: "/beranda", icon: Home });

  if (hasRole("Kepala Riset")) {
    const items = [
      {
        label: "Kelola Project",
        path: "/kepala-riset/kelola-project",
        icon: BarChart3,
        description: "Manage research projects",
      },
      {
        label: "Kelola Pengguna",
        path: "/kepala-riset-admin/kelola-pengguna",
        icon: Users,
        description: "Manage system users",
      },
    ].filter(item => canAccessRoute(item.path));

    if (items.length > 0) {
      groups.push({
        type: "dropdown",
        label: "Kepala Riset",
        icon: BarChart3,
        items,
      });
    }
  }

  if (hasRole("Admin")) {
    const items = [
      {
        label: "Kelola Pengguna",
        path: "/kepala-riset-admin/kelola-pengguna",
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
    ].filter(item => canAccessRoute(item.path));

    if (items.length > 0) {
      groups.push({
        type: "dropdown",
        label: "Administrator Project",
        icon: Users,
        items,
      });
    }
  }

  if (hasRole("Reviewer")) {
    const items = [
      {
        label: "Daftar Dokumen",
        path: "/peninjau/tinjauan",
        icon: FileCheck,
        description: "Documents to review",
      },
    ].filter(item => canAccessRoute(item.path));

    if (items.length > 0) {
      groups.push({
        type: "dropdown",
        label: "Reviewer",
        icon: FileCheck,
        items,
      });
    }
  }

  if (hasRole("Annotator")) {
    const items = [
      {
        label: "Daftar Dokumen",
        path: "/anotator/anotasi",
        icon: FileText,
        description: "List of documents to annotate",
      },
    ].filter(item => canAccessRoute(item.path));

    if (items.length > 0) {
      groups.push({
        type: "dropdown",
        label: "Anotator",
        icon: Pencil,
        items,
      });
    }
  }

  return groups;
});

// Watch for authentication state changes
watch(isAuthenticated, async (newValue) => {
  if (newValue) {
    // User just logged in, fetch projects
    await fetchUserProjects();
  } else {
    // User logged out, clear projects and selected project
    userProjects.value = [];
    clearSelectedProject();
  }
}, { immediate: false });

// Watch for user roles changes (in case roles are updated after login)
watch(userRoles, async () => {
  if (isAuthenticated.value) {
    await fetchUserProjects();
  }
}, { immediate: false });

onMounted(async () => {
  await initializeAuth();
  // Only fetch projects after auth is initialized and user is authenticated
  if (isAuthenticated.value) {
    await fetchUserProjects();
  }
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
      class="sticky top-0 z-50 flex justify-start gap-8 items-center px-4 md:px-8 py-4 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <NuxtLink to="/" class="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors">
        <Lightbulb class="text-blue-400" />
        <span class="text-2xl font-bold">ANOTA</span>
      </NuxtLink>

      <nav v-if="isAuthenticated" class="w-full justify-between flex my-auto">
        <div class="flex items-center gap-4">
          <!-- Menubar -->
          <Menubar class="hidden md:flex bg-transparent border-none shadow-none space-x-4 my-auto">
            <template v-for="group in menuGroups" :key="group.label">
              <!-- Simple Link Menu Item -->
              <MenubarMenu v-if="group.type === 'link'">
                <MenubarTrigger as-child>
                  <NuxtLink :to="group.path"
                    class="flex items-center space-x-2 px-3 py-3 text-slate-200 hover:text-white hover:bg-slate-800/50 data-[state=open]:bg-slate-800/50 data-[state=open]:text-white transition-all duration-200"
                    active-class="text-blue-400 bg-blue-500/10">
                    <component :is="group.icon" class="w-4 h-4" />
                    <span class="font-medium">{{ group.label }}</span>
                  </NuxtLink>
                </MenubarTrigger>
              </MenubarMenu>

              <!-- Dropdown Menu Item -->
              <MenubarMenu v-else-if="group.type === 'dropdown'">
                <MenubarTrigger
                  class="flex items-center space-x-2 px-3 py-3 text-slate-200 hover:text-white hover:bg-slate-800/50 data-[state=open]:bg-slate-800/50 data-[state=open]:text-white">
                  <component :is="group.icon" class="w-4 h-4" />
                  <span class="font-medium">{{ group.label }}</span>
                </MenubarTrigger>
                <MenubarContent class="bg-slate-800 border border-slate-700 shadow-lg">
                  <MenubarItem v-for="item in group.items" :key="item.path" as-child
                    class="flex items-start space-x-3 p-3 cursor-pointer hover:bg-slate-700/50 transition-colors group focus:bg-slate-700/50">
                    <NuxtLink :to="item.path" class="flex items-start space-x-3 w-full"
                      active-class="bg-blue-500/10 text-blue-400">
                      <component :is="item.icon"
                        class="w-5 h-5 text-slate-400 group-hover:text-slate-300 mt-0.5 flex-shrink-0" />
                      <div class="flex-1">
                        <div class="text-sm font-medium text-slate-200 group-hover:text-white">
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

        </div>


        <div class="flex items-center gap-4">
          <!-- Project Selector for Admin/Kepala Riset -->
          <div v-if="(hasRole('Admin')) && userProjects.length > 0"
            class="flex items-center gap-2 ml-4">
            <Select :model-value="selectedProject?.id?.toString() || (isKelolaSemuaProjects ? '' : 'all')"
              @update:model-value="handleProjectChange">
              <SelectTrigger class="w-[200px] bg-slate-800 border-slate-700 text-slate-200">
                <SelectValue :placeholder="isKelolaSemuaProjects ? 'Pilih Project' : 'Pilih Project'" />
              </SelectTrigger>
              <SelectContent class="bg-slate-800 border-slate-700">
                <SelectItem v-if="!isKelolaSemuaProjects" value="all" class="text-slate-200">
                  <div class="flex items-center gap-2">
                    Semua Project
                  </div>
                </SelectItem>
                <SelectItem v-for="project in userProjects" :key="project.id" :value="project.id.toString()"
                  class="text-slate-200">
                  {{ project.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Profile Dropdown -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost"
                class="flex items-center space-x-3 px-3 py-3 text-white hover:bg-slate-800/50 rounded-lg h-auto">
                <Avatar class="ring-2 ring-slate-700">
                  <AvatarImage :src="userAvatar" :alt="userName" />
                  <AvatarFallback>{{
                    userName.charAt(0).toUpperCase()
                    }}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent class="w-56 bg-slate-800 border border-slate-700 shadow-lg" align="end">
              <!-- Profile Info -->
              <div class="px-3 py-2">
                <div class="font-medium text-white">{{ userName }}</div>
                <div class="text-sm text-slate-400">{{ user?.email }}</div>
              </div>

              <DropdownMenuSeparator class="bg-slate-700"></DropdownMenuSeparator>

              <!-- Menu Items -->
              <DropdownMenuItem @click="handleLogout" variant="destructive"
                class="cursor-pointer hover:bg-red-600/20 focus:bg-red-600/20">
                <LogOut class="w-4 h-4 mr-3" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
    <footer class="border-t border-slate-800 bg-slate-900/50 px-8 py-6 text-center">
      <div class="max-w-5xl mx-auto flex flex-col items-center space-y-4">
        <p class="text-slate-300">
          &copy; {{ new Date().getFullYear() }} ANOTA. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>
