<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { navigateTo, useRoute } from "#app";
import { useAuth } from "~/data/auth";
import { useProjectContext } from "~/composables/project-context";
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
  LogOut,
  Lightbulb,
  FileCheck,
  Building2,
  Menu as MenuIcon,
  X as CloseIcon,
  Key,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import type { AvailableRole } from "~/types/api";
import MobileMenu from "./MobileMenu.vue";

const { user, isAuthenticated, userRoles, logout } = useAuth();
const { selectedProject } = useProjectContext();
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

const menuGroups = computed(() => {
  if (!isAuthenticated.value) return [];

  const groups: any[] = [];
  groups.push({ type: "link", label: "Beranda", path: "/beranda", icon: Home });

  if (hasRole("Superadmin")) {
    groups.push({
      type: "dropdown",
      label: "Superadmin",
      icon: Users,
      items: [
        {
          label: "Kelola Pengguna",
          path: "/superadmin/kelola-pengguna",
          icon: Users,
          description: "Manage system users and create Kepala Riset accounts",
        },
      ],
    });
  }

  if (hasRole("Kepala Riset")) {
    groups.push({
      type: "dropdown",
      label: "Kepala Riset",
      icon: BarChart3,
      items: [
        { label: "Dashboard Analytics", path: "/kepala-riset-admin/dashboard", icon: BarChart3, description: "View system analytics and performance metrics" },
        { label: "Kelola Project", path: "/kepala-riset/kelola-project", icon: BarChart3, description: "Manage research projects" },
      ],
    });
  }

  if (hasRole("Admin")) {
    groups.push({
      type: "dropdown",
      label: "Administrator Project",
      icon: Users,
      items: [
        { label: "Kelola Dokumen", path: "/admin/kelola-dokumen", icon: FileText, description: "Manage and export documents" },
        { label: "Kelola Error", path: "/admin/kelola-error", icon: AlertTriangle, description: "Manage system errors" },
        { label: "Kelola Pengguna", path: "/kepala-riset-admin/kelola-pengguna", icon: Users, description: "Manage system users and reset passwords" },
      ],
    });
  }

  if (hasRole("Reviewer")) {
    groups.push({
      type: "dropdown",
      label: "Reviewer",
      icon: FileCheck,
      items: [{ label: "Daftar Dokumen", path: "/reviewer/review", icon: FileCheck, description: "Documents to review" }],
    });
  }

  if (hasRole("Annotator")) {
    groups.push({
      type: "dropdown",
      label: "Anotator",
      icon: Pencil,
      items: [{ label: "Daftar Dokumen", path: "/anotator/anotasi", icon: FileText, description: "List of documents to annotate" }],
    });
  }

  return groups;
});

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 12;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = async () => {
  await logout();
  toast.success("Anda telah keluar dari akun.");
  navigateTo("/");
};
</script>

<template>
  <header class="sticky top-0 z-50">
    <div class="w-full flex justify-center">
      <div
        :class="[
          'relative w-full transition-all duration-200',
          isScrolled
            ? 'mx-12 mt-6 rounded-2xl border border-gray-200 px-4 py-2 shadow-sm'
            : 'mx-4 mt-2 rounded-2xl border-gray-200 px-4 py-2 md:px-6',
        ]"
      >
        <div v-if="isScrolled" class="navbar-glass-effect"></div>
        <div v-if="isScrolled" class="navbar-glass-tint"></div>
        <div v-if="isScrolled" class="navbar-glass-shine"></div>
        
        <div class="relative z-10 w-full">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center gap-6">
              <NuxtLink to="/" class="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors">
                <Lightbulb class="w-5 h-5 text-blue-500" />
                <span class="text-xl font-medium">Anota</span>
              </NuxtLink>

              <template v-if="isAuthenticated">
                <button
                  class="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition"
                  @click="toggleMobileMenu"
                >
                  <MenuIcon v-if="!isMobileMenuOpen" class="w-6 h-6" />
                  <CloseIcon v-else class="w-6 h-6" />
                </button>
                <Menubar class="hidden md:flex bg-transparent border-none shadow-none space-x-4 my-auto">
                  <template v-for="group in menuGroups" :key="group.label">
                    <MenubarMenu v-if="group.type === 'link'">
                      <MenubarTrigger as-child>
                        <NuxtLink
                          :to="group.path"
                          class="flex items-center space-x-2 px-3 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-100/50 transition-all duration-200 relative"
                          :class="{ 'font-semibold text-blue-600': route.path === group.path }"
                        >
                          <component :is="group.icon" class="w-4 h-4" />
                          <span class="font-medium">{{ group.label }}</span>
                        </NuxtLink>
                      </MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu v-else-if="group.type === 'dropdown'">
                      <MenubarTrigger class="flex items-center space-x-2 px-3 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-100/50 data-[state=open]:bg-blue-100/50 data-[state=open]:text-blue-600 relative">
                        <component :is="group.icon" class="w-4 h-4" />
                        <span class="font-medium">{{ group.label }}</span>
                      </MenubarTrigger>
                      <MenubarContent class="bg-white border border-gray-200 shadow-lg flex gap-1 p-1 flex-col">
                        <MenubarItem
                          v-for="item in group.items"
                          :key="item.path"
                          as-child
                          class="flex items-start space-x-3 p-3 cursor-pointer hover:bg-blue-100/50 transition-colors group"
                        >
                          <NuxtLink
                            :to="item.path"
                            class="flex items-start space-x-3 w-full"
                            :class="{ 'text-blue-600 font-semibold bg-blue-100/50': route.path.startsWith(item.path) }"
                          >
                            <component :is="item.icon" class="w-5 h-5 text-slate-400 group-hover:text-blue-500 mt-0.5 flex-shrink-0" />
                            <div class="flex-1">
                              <div class="text-sm font-medium text-slate-700 group-hover:text-blue-600">{{ item.label }}</div>
                              <div class="text-xs text-slate-400 mt-1 leading-relaxed">{{ item.description }}</div>
                            </div>
                          </NuxtLink>
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  </template>
                </Menubar>
              </template>
            </div>

            <div v-if="isAuthenticated" class="flex items-center gap-2">
              <div v-if="hasRole('Admin') && selectedProject" class="flex items-center px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <Building2 class="w-4 h-4 text-blue-600 mr-2" />
                <span class="text-sm font-medium text-blue-900">{{ selectedProject.name }}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <Button variant="ghost" class="flex items-center space-x-3 px-3 py-3 text-gray-900 hover:bg-gray-100 rounded-lg h-auto">
                    <Avatar class="ring-2 ring-gray-200">
                      <AvatarImage :src="userAvatar" :alt="userName" />
                      <AvatarFallback>{{ userName.charAt(0).toUpperCase() }}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-56 bg-white border border-gray-200 shadow-lg" align="end">
                  <div class="px-3 py-2">
                    <div class="font-medium text-gray-900">{{ userName }}</div>
                    <div class="text-sm text-gray-500">{{ user?.email }}</div>
                  </div>
                  <DropdownMenuSeparator class="bg-gray-200" />
                  <DropdownMenuItem @click="navigateTo('/change-password')" as="div" class="flex items-center space-x-2 px-3 py-3 text-blue-700 hover:text-blue-600 hover:bg-blue-100/50 transition-all font-medium cursor-pointer">
                    <Key class="w-4 h-4" />
                    <span>Ganti Password</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator class="bg-gray-200" />
                  <DropdownMenuItem @click="handleLogout" variant="destructive" as="div" class="flex items-center space-x-2 px-3 py-3 text-red-700 hover:text-red-600 hover:bg-red-100/50 transition-all font-medium cursor-pointer">
                    <LogOut class="w-4 h-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <MobileMenu v-if="isAuthenticated" :is-open="isMobileMenuOpen" :menu-groups="menuGroups" @close="closeMobileMenu" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
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
}
:deep(.menubar-content), :deep(.dropdown-menu-content) {
  background-color: #fff !important;
  border-color: #e5e7eb !important;
  color: #222 !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
}
:deep(.dropdown-menu-item) {
  color: #222 !important;
  background-color: transparent !important;
}
:deep(.dropdown-menu-item:hover) {
  background-color: #f3f4f6 !important;
  color: #2563eb !important;
}
</style>