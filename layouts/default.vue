<script setup lang="ts">
import { useAuth } from "~/data/auth";
import { useProjectsApi } from "~/data/projects";
import { useProjectContext } from "~/composables/project-context";
import { onMounted, ref, computed, onBeforeUnmount, watch } from "vue";
import { navigateTo, useRoute, useRoute } from "#app";
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
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import type { AvailableRole, ProjectResponse } from "~/types/api";
import type { AcceptableValue } from "reka-ui";

const { user, isAuthenticated, userRoles, logout, initializeAuth } = useAuth();
const { getProjects } = useProjectsApi();
const { selectedProject, setSelectedProject, clearSelectedProject } =
  useProjectContext();
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
    console.error("Error fetching projects:", error);
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
    const project = userProjects.value.find(
      (p) => p.id.toString() === projectId
    );
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

  // Always add Beranda as first group
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

const route = useRoute();

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 12;
};

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
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll as EventListener);
});

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

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
  <div
    :class="[
      'flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100',
    ]"
  >
    <!-- SVG Glass Distortion Filter -->
    <svg style="display: none">
      <filter
        id="glass-distortion"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.01 0.01"
          numOctaves="1"
          seed="5"
          result="turbulence"
        />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feSpecularLighting
          in="softMap"
          surfaceScale="5"
          specularConstant="1"
          specularExponent="100"
          lighting-color="white"
          result="specLight"
        >
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite
          in="specLight"
          operator="arithmetic"
          k1="0"
          k2="1"
          k3="1"
          k4="0"
          result="litImage"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softMap"
          scale="150"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
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

      <!-- Public Navigation (landing style, light, rounded on scroll) -->
      <div v-else>
        <div class="w-full flex justify-center">
          <div
            :class="[
              'relative w-full transition-all duration-200',
              isScrolled
                ? 'mx-12 mt-4 rounded-2xl border border-gray-200 px-4 py-2 shadow-sm'
                : 'mx-4 mt-0 rounded-2xl border-gray-200 px-4 py-2 md:px-6',
            ]"
          >
            <!-- Glass background layers only when scrolled -->
            <div class="navbar-glass-effect"></div>
            <div class="navbar-glass-tint"></div>
            <div class="navbar-glass-shine"></div>
            <!-- Content -->
            <div class="relative z-10 w-full">
              <div class="flex items-center justify-between w-full">
                <!-- Left: Brand -->
                <NuxtLink
                  to="/"
                  class="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <Lightbulb class="w-5 h-5 text-blue-500" />
                  <span class="text-xl font-medium">Anota</span>
                </NuxtLink>

                <!-- Right: Actions -->
                <div class="flex items-center gap-3">
                  <Button
                    class="hidden md:inline-flex btn-rect btn-rect-outline animated-gradient-btn-greenblue"
                    @click="handleLoginClick"
                  >
                    Masuk
                  </Button>

                  <!-- Mobile primary CTA -->
                  <Button
                    class="md:hidden btn-rect btn-rect-primary animated-gradient-btn-greenblue"
                    @click="handleLoginClick"
                  >
                    Masuk
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <!-- Authenticated: keep dark footer -->

    <!-- Public: light, minimal footer matching landing style -->
    <footer class="py-12 bg-gray-50 border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <div class="mb-6">
          <div class="text-2xl text-gray-800 mb-2 font-light">Anota</div>
          <p class="text-gray-600 font-light">
            Anotasi Cerdas. Dataset Sempurna.
          </p>
        </div>
        <div class="flex justify-center gap-8 text-sm text-gray-500">
          <a href="#" class="hover:text-gray-700 transition-colors"
            >Privacy Policy</a
          >
          <a href="#" class="hover:text-gray-700 transition-colors"
            >Terms of Service</a
          >
          <a href="#" class="hover:text-gray-700 transition-colors"
            >Documentation</a
          >
          <a href="#" class="hover:text-gray-700 transition-colors">Support</a>
        </div>
        <p class="text-gray-400 mt-6 font-light">
          © {{ new Date().getFullYear() }} Anota. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Custom styles for better dark theme compatibility */
.animated-gradient-btn-greenblue {
  background: linear-gradient(270deg, #22c55e, #38bdf8, #2563eb, #22c55e);
  background-size: 400% 400%;
  animation: gradientMoveGreenBlue 6s ease-in-out infinite;
  color: #fff !important;
  border: none;
  transition: background 0.2s;
}
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

/* Glassmorphism background for public navbar (matching akreditasi) */
.navbar-glass-effect {
  position: absolute;
  z-index: 0;
  inset: 0;
  backdrop-filter: blur(3px);
  filter: url(#glass-distortion);
  overflow: hidden;
  border-radius: inherit;
}
.navbar-glass-tint {
  z-index: 1;
  position: absolute;
  inset: 0;
  background: #ffffff80;
  border-radius: inherit;
}
.navbar-glass-shine {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  border-radius: inherit;
  /* box-shadow: inset 2px 2px 1px 0 #ffffff80, inset -1px -1px 1px 1px #ffffff80; */
}

/* Fade transition for mobile menu */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
