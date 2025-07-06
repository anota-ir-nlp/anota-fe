<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { navigateTo } from "#app"; // Import navigateTo for programmatic navigation

const toast = useToast();

// Global state for authentication and role (using Nuxt's useState for simplicity)
const isAuthenticated = useState<boolean>("isAuthenticated", () => false);
const userRole = useState<string>("userRole", () => "Guest");
const userName = useState<string>("userName", () => "Pengguna");
const userAvatar = useState<string>(
  "userAvatar",
  () => "https://avatars.githubusercontent.com/u/739984?v=4"
); // Placeholder avatar

// State for custom dropdown visibility
const isProfileDropdownOpen = ref(false);
const isSubmenuOpen = ref(false); // New ref for submenu visibility
const profileDropdownRef = ref<HTMLElement | null>(null);

// Define all possible menu items with their roles
const allMenus = [
  { role: "Guest", label: "Beranda", path: "/" },
  { role: "Anotator", label: "Beranda", path: "/beranda" },
  { role: "Anotator", label: "Anotasi", path: "/anotator/anotasi" },
  { role: "Peninjau", label: "Beranda", path: "/beranda" },
  { role: "Peninjau", label: "Tinjauan", path: "/peninjau/tinjauan" },
  { role: "Admin", label: "Beranda", path: "/beranda" },
  { role: "Admin", label: "Kelola Pengguna", path: "/admin/kelola-pengguna" },
  { role: "Admin", label: "Kelola Dokumen", path: "/admin/kelola-dokumen" },
  { role: "Admin", label: "Kelola Error", path: "/admin/kelola-error" },
  { role: "Kepala Riset", label: "Beranda", path: "/beranda" },
  {
    role: "Kepala Riset",
    label: "Rekap Kinerja",
    path: "/kepala-riset/rekap-kinerja",
  },
  {
    role: "Kepala Riset",
    label: "Rekap Dokumen",
    path: "/kepala-riset/rekap-dokumen",
  },
  {
    role: "Kepala Riset",
    label: "Generate Dataset",
    path: "/generate-dataset",
  },
];

// Computed property to filter menus based on current user role
const filteredMenus = computed(() => {
  if (!isAuthenticated.value) {
    return allMenus.filter((menu) => menu.role === "Guest");
  }
  return allMenus.filter((menu) => menu.role === userRole.value);
});

// All possible roles for the "Ganti Peran" dropdown
const allRoles = ["Anotator", "Peninjau", "Admin", "Kepala Riset"];

// Function to toggle profile dropdown
const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value;
  // Close submenu if main dropdown is closing
  if (!isProfileDropdownOpen.value) {
    isSubmenuOpen.value = false;
  }
};

// Function to toggle submenu
const toggleSubmenu = (event: MouseEvent) => {
  event.stopPropagation(); // Prevent click from bubbling up to close main dropdown
  isSubmenuOpen.value = !isSubmenuOpen.value;
};

// Function to close profile dropdown (and submenu)
const closeProfileDropdown = () => {
  isProfileDropdownOpen.value = false;
  isSubmenuOpen.value = false;
};

// Handle clicks outside the dropdown to close it
const handleClickOutside = (event: MouseEvent) => {
  if (
    profileDropdownRef.value &&
    !profileDropdownRef.value.contains(event.target as Node)
  ) {
    closeProfileDropdown();
  }
};

// Lifecycle hooks for event listener
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Function to handle login navigation from homepage
const handleLoginClick = () => {
  navigateTo("/login");
};

// Profile action functions
const viewProfile = () => {
  toast.add({
    title: "Lihat Profil",
    description: "Navigasi ke halaman profil.",
    color: "neutral",
  });
  closeProfileDropdown(); // Close both dropdowns
  // navigateTo('/profile'); // Placeholder route
};

const changeRole = (role: string) => {
  userRole.value = role;
  toast.add({
    title: "Peran Diubah",
    description: `Anda sekarang adalah ${role}`,
    color: "success",
  });
  closeProfileDropdown(); // Close both dropdowns
};

const logout = () => {
  isAuthenticated.value = false;
  userRole.value = "Guest";
  userName.value = "Pengguna";
  toast.add({
    title: "Berhasil Keluar",
    description: "Anda telah keluar dari akun.",
    color: "success",
  });
  closeProfileDropdown(); // Close both dropdowns
  navigateTo("/"); // Redirect to homepage after logout
};
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header/Navbar -->
    <header class="header">
      <NuxtLink to="/" class="logo-link">
        <UIcon name="i-heroicons-light-bulb" class="logo-icon" />
        <span class="logo-text">ANOTA</span>
      </NuxtLink>

      <nav v-if="isAuthenticated" class="authenticated-nav">
        <ul class="menu-list">
          <li v-for="menu in filteredMenus" :key="menu.path">
            <NuxtLink :to="menu.path" class="menu-item">{{
              menu.label
            }}</NuxtLink>
          </li>
        </ul>

        <!-- Custom Profile Dropdown -->
        <div class="profile-dropdown-wrapper" ref="profileDropdownRef">
          <button class="profile-button" @click.stop="toggleProfileDropdown">
            <UAvatar :src="userAvatar" :alt="userName" size="md" />
            <span class="profile-name">{{ userName }} ({{ userRole }})</span>
            <UIcon
              name="i-heroicons-chevron-down-20-solid"
              class="profile-dropdown-icon"
              :class="{ 'rotate-180': isProfileDropdownOpen }"
            />
          </button>

          <div v-if="isProfileDropdownOpen" class="profile-dropdown-menu">
            <div class="dropdown-item" @click="viewProfile">
              <UIcon name="i-heroicons-user" class="dropdown-item-icon" />
              Lihat Profil
            </div>
            <div class="dropdown-submenu-parent">
              <div
                class="dropdown-item dropdown-submenu-toggle"
                @click.stop="toggleSubmenu"
              >
                <UIcon
                  name="i-heroicons-arrows-right-left"
                  class="dropdown-item-icon"
                />
                Ganti Peran
                <UIcon
                  name="i-heroicons-chevron-right-20-solid"
                  class="submenu-arrow"
                  :class="{ 'rotate-90': isSubmenuOpen }"
                />
              </div>
              <div v-if="isSubmenuOpen" class="dropdown-submenu">
                <div
                  v-for="role in allRoles"
                  :key="role"
                  class="dropdown-item"
                  @click="changeRole(role)"
                >
                  {{ role }}
                </div>
              </div>
            </div>
            <hr class="dropdown-divider" />
            <div class="dropdown-item" @click="logout">
              <UIcon
                name="i-heroicons-arrow-right-on-rectangle"
                class="dropdown-item-icon"
              />
              Keluar
            </div>
          </div>
        </div>
      </nav>
      <nav v-else class="public-nav">
        <UButton
          label="Masuk"
          icon="i-heroicons-arrow-right-on-rectangle"
          variant="solid"
          color="primary"
          class="public-login-button"
          @click="handleLoginClick"
        />
      </nav>
    </header>

    <!-- Main Content Slot -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; {{ new Date().getFullYear() }} ANOTA. All rights reserved.</p>
        <div class="social-links">
          <UButton
            icon="i-simple-icons-github"
            variant="ghost"
            color="neutral"
            to="https://github.com/your-org/anota"
            target="_blank"
            aria-label="GitHub"
          />
          <UButton
            icon="i-simple-icons-twitter"
            variant="ghost"
            color="neutral"
            to="https://twitter.com"
            target="_blank"
            aria-label="Twitter"
          />
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Header/Navbar Styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem; /* py-4 px-8 */
  background-color: rgba(
    31,
    41,
    55,
    0.9
  ); /* bg-gray-800 with some transparency */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700; /* font-bold */
  transition: color 0.2s ease-in-out;
}

.logo-link:hover {
  color: #9333ea; /* purple-600 */
}

.logo-icon {
  width: 2rem; /* w-8 */
  height: 2rem; /* h-8 */
  margin-right: 0.5rem; /* mr-2 */
  color: #60a5fa; /* blue-400 */
}

.authenticated-nav {
  display: flex;
  align-items: center;
  gap: 2rem; /* gap-8 */
}

.menu-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 1.5rem; /* gap-6 */
}

.menu-item {
  text-decoration: none;
  color: #e2e8f0; /* text-gray-200 */
  font-weight: 500; /* font-medium */
  padding: 0.5rem 0.75rem; /* px-3 py-2 */
  border-radius: 0.5rem; /* rounded-md */
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

/* Custom Profile Dropdown Styles */
.profile-dropdown-wrapper {
  position: relative;
  z-index: 1000; /* Ensure it's above other content */
}

.profile-button {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* gap-2 */
  padding: 0.5rem 0.75rem; /* px-3 py-2 */
  border-radius: 0.5rem; /* rounded-md */
  transition: background-color 0.2s ease-in-out;
  background-color: transparent;
  color: white;
  border: none;
  cursor: pointer;
}

.profile-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.profile-name {
  font-weight: 600; /* font-semibold */
}

.profile-dropdown-icon {
  width: 1.25rem; /* w-5 */
  height: 1.25rem; /* h-5 */
  margin-left: 0.25rem; /* ms-1 */
  transition: transform 0.2s ease-in-out;
}

.profile-dropdown-icon.rotate-180 {
  transform: rotate(180deg);
}

.profile-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem); /* Position below the button with some spacing */
  right: 0;
  background-color: rgba(31, 41, 55, 0.95); /* Darker background for menu */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.05);
  min-width: 12rem; /* Minimum width for the dropdown */
  padding: 0.5rem 0; /* Vertical padding */
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem; /* gap-3 */
  padding: 0.75rem 1rem; /* px-4 py-3 */
  color: #e2e8f0; /* text-gray-200 */
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.dropdown-item-icon {
  width: 1.25rem; /* w-5 */
  height: 1.25rem; /* h-5 */
}

.dropdown-submenu-parent {
  position: relative;
}

.dropdown-submenu-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-submenu {
  position: absolute;
  top: 0;
  left: -100%; /* Position to the left of the parent item */
  background-color: rgba(31, 41, 55, 0.98); /* Slightly darker for submenu */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.05);
  min-width: 10rem; /* Minimum width for submenu */
  padding: 0.5rem 0;
  /* Removed display: none; and hover rules, now controlled by v-if */
}

.submenu-arrow {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
  transition: transform 0.2s ease-in-out; /* Add transition for rotation */
}

.submenu-arrow.rotate-90 {
  transform: rotate(90deg);
}

.dropdown-divider {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin: 0.5rem 0;
}

.public-nav .public-login-button {
  font-weight: 600; /* font-semibold */
  padding: 0.75rem 1.5rem; /* px-6 py-3 */
  border-radius: 0.5rem; /* rounded-md */
  background: linear-gradient(to right, #3b82f6, #9333ea);
  border: none;
  color: white;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.public-nav .public-login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Footer Styles */
.footer {
  padding: 2rem; /* p-8 */
  background-color: #1a2b3c; /* custom-blue or a dark shade */
  color: #cbd5e1; /* text-gray-300 */
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-content {
  max-width: 80rem; /* max-w-5xl */
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem; /* gap-4 */
}

.social-links {
  display: flex;
  gap: 0.5rem; /* gap-2 */
}

.social-links .u-button {
  color: #cbd5e1; /* text-gray-300 */
}

.social-links .u-button:hover {
  color: white;
}
</style>
