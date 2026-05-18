<script setup lang="ts">
import { useAuth } from "~/data/auth";
import { useUsersApi } from "~/data/users";
import { useProjectContext } from "~/composables/project-context";
import { toast } from "vue-sonner";

useHead({
  title: "Anota",
  meta: [{ name: "description", content: "Halaman aplikasi ANOTA." }],
});

const { user, isAuthenticated, userRoles, initializeAuth } = useAuth();
const { getMyProjects } = useUsersApi();
const { selectedProject, setSelectedProject, clearSelectedProject } = useProjectContext();

const hasRole = (role: string) => userRoles.value.includes(role);

async function fetchUserProjects() {
  if (!hasRole("Admin")) return;

  try {
    const response = await getMyProjects();
    const userProjects = response.results;

    if (hasRole("Admin") && userProjects?.length > 0) {
      if (!selectedProject.value || !userProjects.some((p: any) => p.id === selectedProject.value?.id)) {
        setSelectedProject(userProjects[0]);
      }
    } else {
      clearSelectedProject();
    }
  } catch (error) {
    toast.error("Gagal memuat daftar project");
  }
}

watch(isAuthenticated, async (newValue) => {
  if (newValue) await fetchUserProjects();
  else clearSelectedProject();
});

watch(userRoles, async () => {
  if (isAuthenticated.value) await fetchUserProjects();
});

watch(user, async () => {
  if (isAuthenticated.value && hasRole("Admin")) await fetchUserProjects();
});

onMounted(async () => {
  await initializeAuth();
  if (isAuthenticated.value) await fetchUserProjects();
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
    <GlassFilter />
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
:deep([data-sonner-toaster][data-theme="light"]),
:deep([data-sonner-toast][data-theme="light"]) {
  --normal-bg: #fff !important;
  --normal-text: #222 !important;
  --normal-border: #e5e7eb !important;
  background: #fff !important;
  color: #222 !important;
}
:deep([data-sonner-toast][data-theme="light"] .sonner-title),
:deep([data-sonner-toast][data-theme="light"] .sonner-description) {
  color: #222 !important;
}
</style>