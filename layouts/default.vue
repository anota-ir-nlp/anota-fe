<script setup lang="ts">
import { useAuth } from "~/data/auth";
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import { useRoute, navigateTo } from "#app";
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
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import type { AvailableRole } from "~/types/api";

const { user, isAuthenticated, userRoles, logout, initializeAuth } = useAuth();
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

// --- Menu groups: Beranda is now a direct link with Home icon ---
const menuGroups = computed<MenuGroup[]>(() => {
  if (!isAuthenticated.value) {
    return [];
  }

  const groups: MenuGroup[] = [];

  groups.push({
    type: "link",
    label: "Beranda",
    path: "/beranda",
    icon: Home,
  });

  if (hasRole("Admin")) {
    groups.push({
      type: "dropdown",
      label: "Administrator",
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

  if (hasRole("Reviewer")) {
    groups.push({
      type: "dropdown",
      label: "Reviewer",
      icon: FileCheck,
      items: [
        {
          label: "Daftar Dokumen",
          path: "/reviewer/review",
          icon: FileCheck,
          description: "Documents to review",
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
        {
          label: "Rekap Kinerja",
          path: "/kepala-riset/rekap-kinerja",
          icon: BarChart3,
          description: "Performance summary",
        },
        {
          label: "Rekap Dokumen",
          path: "/kepala-riset/rekap-dokumen",
          icon: ClipboardList,
          description: "Document summary",
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

// Public navbar behaviors (landing style)
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 12;
};

onMounted(async () => {
  await initializeAuth();
  if (!isAuthenticated.value) {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll as EventListener);
});

// --- Mobile menu toggle for authenticated navbar ---
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
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
    <header class="sticky top-0 z-50">
      <div v-if="isAuthenticated" class="w-full flex justify-center">
        <div
          :class="[
            'relative w-full transition-all duration-200',
            isScrolled
              ? 'mx-12 mt-4 rounded-2xl border border-gray-200 px-4 py-2 shadow-sm'
              : 'mx-4 mt-0 rounded-2xl border-gray-200 px-4 py-2 md:px-6',
          ]"
        >
          <div class="navbar-glass-effect"></div>
          <div class="navbar-glass-tint"></div>
          <div class="navbar-glass-shine"></div>
          <div class="relative z-10 w-full">
            <!-- Responsive Navbar -->
            <div class="flex items-center justify-between w-full">
              <!-- Left: Brand + Menubar -->
              <div class="flex items-center gap-6">
                <NuxtLink
                  to="/"
                  class="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <Lightbulb class="w-5 h-5 text-blue-500" />
                  <span class="text-xl font-medium">Anota</span>
                </NuxtLink>
                <!-- Hamburger for mobile -->
                <button
                  class="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition"
                  @click="toggleMobileMenu"
                  aria-label="Toggle menu"
                >
                  <MenuIcon v-if="!isMobileMenuOpen" class="w-6 h-6" />
                  <CloseIcon v-else class="w-6 h-6" />
                </button>
                <!-- Desktop Menubar -->
                <Menubar
                  class="hidden md:flex bg-transparent border-none shadow-none space-x-4 my-auto"
                >
                  <template v-for="group in menuGroups" :key="group.label">
                    <MenubarMenu v-if="group.type === 'link'">
                      <MenubarTrigger as-child>
                        <NuxtLink
                          :to="group.path"
                          class="flex items-center space-x-2 px-3 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-100/50 transition-all duration-200 relative"
                          :class="{
                            'font-semibold text-blue-600':
                              route.path === group.path,
                          }"
                        >
                          <component :is="group.icon" class="w-4 h-4" />
                          <span class="font-medium">{{ group.label }}</span>
                          <!-- indicator removed -->
                        </NuxtLink>
                      </MenubarTrigger>
                    </MenubarMenu>
                    <MenubarMenu v-else-if="group.type === 'dropdown'">
                      <MenubarTrigger
                        class="flex items-center space-x-2 px-3 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-100/50 data-[state=open]:bg-blue-100/50 data-[state=open]:text-blue-600 relative"
                      >
                        <component :is="group.icon" class="w-4 h-4" />
                        <span class="font-medium">{{ group.label }}</span>
                        <!-- indicator removed -->
                      </MenubarTrigger>
                      <MenubarContent
                        class="bg-white border border-gray-200 shadow-lg"
                      >
                        <MenubarItem
                          v-for="item in group.items"
                          :key="item.path"
                          as-child
                          class="flex items-start space-x-3 p-3 cursor-pointer hover:bg-blue-100/50 transition-colors group focus:bg-blue-100/50"
                        >
                          <NuxtLink
                            :to="item.path"
                            class="flex items-start space-x-3 w-full"
                            :class="{
                              'text-blue-600 font-semibold bg-blue-100/50':
                                route.path.startsWith(item.path),
                            }"
                          >
                            <component
                              :is="item.icon"
                              class="w-5 h-5 text-slate-400 group-hover:text-blue-500 mt-0.5 flex-shrink-0"
                            />
                            <div class="flex-1">
                              <div
                                class="text-sm font-medium text-slate-700 group-hover:text-blue-600"
                              >
                                {{ item.label }}
                              </div>
                              <div
                                class="text-xs text-slate-400 mt-1 leading-relaxed"
                              >
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
              <!-- Right: Profile Dropdown -->
              <div class="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <Button
                      variant="ghost"
                      class="flex items-center space-x-3 px-3 py-3 text-slate-700 hover:bg-blue-100/50 rounded-lg h-auto"
                    >
                      <Avatar class="ring-2 ring-blue-200">
                        <AvatarImage :src="userAvatar" :alt="userName" />
                        <AvatarFallback>{{
                          userName.charAt(0).toUpperCase()
                        }}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    class="w-56 bg-white border border-gray-200 shadow-lg"
                    align="end"
                  >
                    <div class="px-3 py-2">
                      <div class="font-medium text-slate-800">
                        {{ userName }}
                      </div>
                      <div class="text-sm text-slate-500">
                        {{ user?.email }}
                      </div>
                    </div>
                    <DropdownMenuSeparator
                      class="bg-gray-200"
                    ></DropdownMenuSeparator>
                    <DropdownMenuItem
                      @click="handleLogout"
                      variant="destructive"
                      class="cursor-pointer hover:bg-red-100 focus:bg-red-100 text-red-600"
                    >
                      <LogOut class="w-4 h-4 mr-3" />
                      <span>Keluar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <!-- Mobile Menu (slide down) -->
            <transition name="fade">
              <div
                v-if="isMobileMenuOpen"
                class="md:hidden absolute left-0 right-0 top-full bg-white border-t border-gray-200 shadow-lg rounded-b-2xl z-20"
              >
                <nav class="flex flex-col py-2">
                  <template v-for="group in menuGroups" :key="group.label">
                    <NuxtLink
                      v-if="group.type === 'link'"
                      :to="group.path"
                      @click="closeMobileMenu"
                      class="flex items-center gap-2 px-6 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-100/50 transition-all duration-200 relative"
                      :class="{
                        'font-semibold text-blue-600':
                          route.path === group.path,
                      }"
                    >
                      <component :is="group.icon" class="w-5 h-5" />
                      <span class="font-medium">{{ group.label }}</span>
                      <!-- indicator removed -->
                    </NuxtLink>
                    <div v-else-if="group.type === 'dropdown'">
                      <div
                        class="px-6 pt-3 pb-1 text-xs text-gray-400 font-semibold uppercase"
                      >
                        {{ group.label }}
                      </div>
                      <NuxtLink
                        v-for="item in group.items"
                        :key="item.path"
                        :to="item.path"
                        @click="closeMobileMenu"
                        class="flex items-center gap-2 px-8 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-100/50 transition-all duration-200 relative"
                        :class="{
                          'font-semibold text-blue-600 bg-blue-100/50':
                            route.path.startsWith(item.path),
                        }"
                      >
                        <component :is="item.icon" class="w-5 h-5" />
                        <span class="font-medium">{{ item.label }}</span>
                        <!-- indicator removed -->
                      </NuxtLink>
                    </div>
                  </template>
                </nav>
              </div>
            </transition>
          </div>
        </div>
      </div>

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
