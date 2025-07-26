<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
    <!-- Welcome Section -->
    <section class="w-full px-4 pt-8 pb-4 md:pt-12 md:pb-8">
      <div class="max-w-7xl mx-auto">
        <div class="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div class="flex flex-col md:flex-row items-center gap-6">
            <UAvatar
              :src="userData.avatar"
              :alt="userData.name"
              size="2xl"
              class="ring-4 ring-blue-500/30 shadow-xl"
            />
            <div class="flex-1 text-center md:text-left">
              <div class="flex items-center gap-2 justify-center md:justify-start mb-2">
                <span class="text-lg text-slate-400">Hi,</span>
                <span class="text-2xl md:text-3xl font-bold text-white">{{ userData.name }}</span>
                <span class="ml-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-300 text-xs font-semibold uppercase tracking-wide border border-blue-500/30">
                  {{ userData.role }}
                </span>
              </div>
              <div class="text-slate-300 text-base md:text-lg mb-4">
                {{ getRoleGreeting() }}
              </div>
              <div class="flex flex-wrap gap-3 justify-center md:justify-start text-sm">
                <span class="flex items-center gap-1 text-slate-400">
                  <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
                  {{ userData.email }}
                </span>
                <span class="flex items-center gap-1 text-slate-400">
                  <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                  Bergabung {{ userData.memberSince }}
                </span>
              </div>
            </div>
            <div class="hidden md:block">
              <UButton
                icon="i-heroicons-arrow-left"
                label="Ke Halaman Utama"
                color="neutral"
                variant="ghost"
                class="border border-slate-600 hover:bg-slate-700/50 transition-all duration-200"
                @click="navigateTo('/')"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Role-specific Content -->
    <section class="w-full max-w-7xl mx-auto px-4 pb-8">
      <!-- Admin Dashboard -->
      <div v-if="isAdmin" class="space-y-8">
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div v-if="pending" v-for="i in 4" :key="i" class="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 animate-pulse">
            <div class="w-10 h-10 bg-slate-700 rounded-lg mb-4"></div>
            <div class="w-12 h-8 bg-slate-700 rounded mb-2"></div>
            <div class="w-24 h-4 bg-slate-700 rounded"></div>
          </div>
          
          <div v-else v-for="stat in adminStats" :key="stat.label" 
               class="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/40 transition-all duration-200 group">
            <div class="flex items-center justify-between mb-4">
              <UIcon :name="stat.icon" :class="`w-10 h-10 ${stat.color}`" />
              <span class="text-2xl font-bold text-white">{{ stat.value }}</span>
            </div>
            <h3 class="text-slate-300 font-medium">{{ stat.label }}</h3>
            <p class="text-sm text-slate-400 mt-1">{{ stat.description }}</p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <UIcon name="i-heroicons-bolt" class="w-6 h-6 text-yellow-400" />
            Aksi Cepat
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UButton
              label="Tambah Pengguna"
              icon="i-heroicons-user-plus"
              variant="outline"
              color="blue"
              class="justify-start h-12"
              @click="navigateTo('/admin/kelola-pengguna')"
            />
            <UButton
              label="Upload Dokumen"
              icon="i-heroicons-document-plus"
              variant="outline"
              color="green"
              class="justify-start h-12"
              @click="navigateTo('/admin/kelola-dokumen')"
            />
            <UButton
              label="Review Error"
              icon="i-heroicons-exclamation-triangle"
              variant="outline"
              color="red"
              class="justify-start h-12"
              @click="navigateTo('/admin/kelola-error')"
            />
          </div>
        </div>
      </div>

      <!-- Annotator Dashboard -->
      <div v-if="isAnnotator" class="space-y-8">
        <!-- Progress Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <UIcon name="i-heroicons-document-text" class="w-10 h-10 text-blue-400" />
              <span class="text-2xl font-bold text-white">{{ annotatorStats.assignedDocuments || 0 }}</span>
            </div>
            <h3 class="text-slate-300 font-medium">Dokumen Ditugaskan</h3>
            <p class="text-sm text-slate-400 mt-1">Dokumen yang harus dianotasi</p>
          </div>
          
          <div class="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <UIcon name="i-heroicons-check-circle" class="w-10 h-10 text-green-400" />
              <span class="text-2xl font-bold text-white">{{ annotatorStats.completedDocuments || 0 }}</span>
            </div>
            <h3 class="text-slate-300 font-medium">Dokumen Selesai</h3>
            <p class="text-sm text-slate-400 mt-1">Dokumen yang telah dianotasi</p>
          </div>
          
          <div class="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <UIcon name="i-heroicons-clock" class="w-10 h-10 text-orange-400" />
              <span class="text-2xl font-bold text-white">{{ annotatorStats.inProgressDocuments || 0 }}</span>
            </div>
            <h3 class="text-slate-300 font-medium">Sedang Dikerjakan</h3>
            <p class="text-sm text-slate-400 mt-1">Dokumen dalam proses</p>
          </div>
        </div>

        <!-- Recent Assignments -->
        <div class="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <UIcon name="i-heroicons-clipboard-document-list" class="w-6 h-6 text-blue-400" />
            Tugas Terbaru
          </h3>
          <div class="space-y-3">
            <div v-for="task in recentTasks" :key="task.id" 
                 class="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-slate-400" />
                <div>
                  <h4 class="font-medium text-white">{{ task.title }}</h4>
                  <p class="text-sm text-slate-400">{{ task.sentences }} kalimat</p>
                </div>
              </div>
              <UBadge :color="getTaskStatusColor(task.status)" variant="subtle">
                {{ task.status }}
              </UBadge>
            </div>
          </div>
          <div class="mt-4">
            <UButton
              label="Lihat Semua Tugas"
              icon="i-heroicons-arrow-right"
              variant="outline"
              @click="navigateTo('/anotator/anotasi')"
            />
          </div>
        </div>
      </div>

      <!-- Reviewer Dashboard -->
      <div v-if="isReviewer" class="space-y-8">
        <!-- Review Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <UIcon name="i-heroicons-eye" class="w-10 h-10 text-purple-400" />
              <span class="text-2xl font-bold text-white">{{ reviewerStats.pendingReviews || 0 }}</span>
            </div>
            <h3 class="text-slate-300 font-medium">Menunggu Review</h3>
            <p class="text-sm text-slate-400 mt-1">Dokumen yang perlu ditinjau</p>
          </div>
          
          <div class="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <UIcon name="i-heroicons-check-badge" class="w-10 h-10 text-green-400" />
              <span class="text-2xl font-bold text-white">{{ reviewerStats.completedReviews || 0 }}</span>
            </div>
            <h3 class="text-slate-300 font-medium">Review Selesai</h3>
            <p class="text-sm text-slate-400 mt-1">Dokumen yang telah direview</p>
          </div>
          
          <div class="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-10 h-10 text-red-400" />
              <span class="text-2xl font-bold text-white">{{ reviewerStats.errorsFound || 0 }}</span>
            </div>
            <h3 class="text-slate-300 font-medium">Error Ditemukan</h3>
            <p class="text-sm text-slate-400 mt-1">Total error yang ditemukan</p>
          </div>
        </div>

        <!-- Review Queue -->
        <div class="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <UIcon name="i-heroicons-queue-list" class="w-6 h-6 text-purple-400" />
            Antrian Review
          </h3>
          <div class="space-y-3">
            <div v-for="review in reviewQueue" :key="review.id" 
                 class="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-document-check" class="w-5 h-5 text-slate-400" />
                <div>
                  <h4 class="font-medium text-white">{{ review.title }}</h4>
                  <p class="text-sm text-slate-400">Oleh {{ review.annotator }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <UBadge color="yellow" variant="subtle">{{ review.priority }}</UBadge>
                <UButton size="xs" icon="i-heroicons-eye" @click="navigateTo(`/peninjau/tinjauan/${review.id}`)">
                  Review
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Kepala Riset Dashboard -->
      <div v-if="isKepalaRiset" class="space-y-8">
        <!-- Overview Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div v-for="stat in researchStats" :key="stat.label" 
               class="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
            <div class="flex items-center justify-between mb-4">
              <UIcon :name="stat.icon" :class="`w-10 h-10 ${stat.color}`" />
              <span class="text-2xl font-bold text-white">{{ stat.value }}</span>
            </div>
            <h3 class="text-slate-300 font-medium">{{ stat.label }}</h3>
            <p class="text-sm text-slate-400 mt-1">{{ stat.description }}</p>
          </div>
        </div>

        <!-- Progress Chart -->
        <div class="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
          <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <UIcon name="i-heroicons-chart-bar" class="w-6 h-6 text-green-400" />
            Progress Proyek
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Progress Bars -->
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-slate-300">Anotasi</span>
                  <span class="text-slate-400">{{ Math.round(((researchStats.find((stat: any) => stat.label === 'Total Anotasi')?.value || 0) / 1000) * 100) }}%</span>
                </div>
                <div class="w-full bg-slate-700 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                       :style="`width: ${Math.round(((researchStats.find((stat: any) => stat.label === 'Total Anotasi')?.value || 0) / 1000) * 100)}%`"></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-slate-300">Review</span>
                  <span class="text-slate-400">{{ Math.round(((researchStats.find((stat: any) => stat.label === 'Review Selesai')?.value || 0) / 800) * 100) }}%</span>
                </div>
                <div class="w-full bg-slate-700 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full transition-all duration-1000" 
                       :style="`width: ${Math.round(((researchStats.find((stat: any) => stat.label === 'Review Selesai')?.value || 0) / 800) * 100)}%`"></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-slate-300">Dataset Generation</span>
                  <span class="text-slate-400">75%</span>
                </div>
                <div class="w-full bg-slate-700 rounded-full h-2">
                  <div class="bg-purple-500 h-2 rounded-full transition-all duration-1000" style="width: 75%"></div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="space-y-3">
              <UButton
                label="Generate Dataset"
                icon="i-heroicons-arrow-down-tray"
                variant="outline"
                color="green"
                class="w-full justify-start"
                @click="navigateTo('/kepala-riset/generate-dataset')"
              />
              <UButton
                label="Rekap Kinerja"
                icon="i-heroicons-chart-bar"
                variant="outline"
                color="blue"
                class="w-full justify-start"
                @click="navigateTo('/kepala-riset/rekap-kinerja')"
              />
              <UButton
                label="Rekap Dokumen"
                icon="i-heroicons-clipboard-document-list"
                variant="outline"
                color="purple"
                class="w-full justify-start"
                @click="navigateTo('/kepala-riset/rekap-dokumen')"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Timeline (Common for all roles) -->
      <div class="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl p-6">
        <h3 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <UIcon name="i-heroicons-clock" class="w-6 h-6 text-blue-400" />
          Aktivitas Terbaru
        </h3>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" 
               class="flex items-start gap-3 p-4 bg-slate-700/20 rounded-lg border border-slate-600/20">
            <UIcon :name="activity.icon" :class="`w-5 h-5 mt-0.5 ${activity.color}`" />
            <div class="flex-1">
              <p class="text-white font-medium">{{ activity.title }}</p>
              <p class="text-sm text-slate-400">{{ activity.description }}</p>
              <p class="text-xs text-slate-500 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import { ref, computed } from "vue";
import { useAuth } from "~/data/auth";

const { user } = useAuth();

// Mock data - replace with actual API calls
const pending = ref(false);

// User data computed from auth
const userData = computed(() => ({
  name: user.value?.full_name || "Pengguna",
  email: user.value?.email || "pengguna@anota.com",
  role: user.value?.active_role || "Pengguna",
  memberSince: user.value?.date_joined ? new Date(user.value.date_joined).toLocaleDateString('id-ID') : "1 Januari 2024",
  avatar: user.value?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.value?.full_name || 'User')}&background=0ea5e9&color=fff`,
}));

// Role checks
const isAdmin = computed(() => user.value?.active_role === 'Admin');
const isAnnotator = computed(() => user.value?.active_role === 'Annotators');
const isReviewer = computed(() => user.value?.active_role === 'Reviewers');
const isKepalaRiset = computed(() => user.value?.active_role === 'Kepala Riset');

// Role-specific greetings
const getRoleGreeting = () => {
  const role = user.value?.active_role;
  const greetings = {
    'Admin': 'Kelola sistem dan pantau kinerja tim dengan mudah.',
    'Annotators': 'Lanjutkan anotasi dokumen untuk meningkatkan dataset.',
    'Reviewers': 'Tinjau hasil anotasi dan pastikan kualitas data terjaga.',
    'Kepala Riset': 'Pantau progress penelitian dan generate dataset berkualitas.'
  };
  return greetings[role as keyof typeof greetings] || 'Selamat datang kembali di platform ANOTA.';
};

// Admin stats
const adminStats = ref([
  {
    label: 'Total Pengguna',
    value: 0,
    icon: 'i-heroicons-users',
    color: 'text-blue-400',
    description: 'Pengguna aktif sistem'
  },
  {
    label: 'Dokumen Upload',
    value: 0,
    icon: 'i-heroicons-document-text',
    color: 'text-green-400',
    description: 'Dokumen dalam sistem'
  },
  {
    label: 'Tugas Aktif',
    value: 0,
    icon: 'i-heroicons-clipboard-document-list',
    color: 'text-orange-400',
    description: 'Tugas sedang dikerjakan'
  },
  {
    label: 'Error Terdeteksi',
    value: 0,
    icon: 'i-heroicons-exclamation-triangle',
    color: 'text-red-400',
    description: 'Error yang perlu ditangani'
  }
]);

// Annotator stats
const annotatorStats = ref({
  assignedDocuments: 0,
  completedDocuments: 0,
  inProgressDocuments: 0
});

// Reviewer stats  
const reviewerStats = ref({
  pendingReviews: 0,
  completedReviews: 0,
  errorsFound: 0
});

// Research stats
const researchStats = ref([
  {
    label: 'Total Anotasi',
    value: 0,
    icon: 'i-heroicons-pencil',
    color: 'text-blue-400',
    description: 'Anotasi yang telah dibuat'
  },
  {
    label: 'Review Selesai',
    value: 0,
    icon: 'i-heroicons-check-circle',
    color: 'text-green-400',
    description: 'Review yang telah selesai'
  },
  {
    label: 'Dataset Generated',
    value: 0,
    icon: 'i-heroicons-arrow-down-tray',
    color: 'text-purple-400',
    description: 'Dataset yang telah dibuat'
  },
  {
    label: 'Active Annotators',
    value: 0,
    icon: 'i-heroicons-user-group',
    color: 'text-orange-400',
    description: 'Anotator yang aktif'
  }
]);

// Recent tasks for annotator
const recentTasks = ref([]);

// Review queue for reviewer
const reviewQueue = ref([]);

// Recent activities (common for all roles)
const recentActivities = ref([]);

// Helper functions
const getTaskStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    'Assigned': 'blue',
    'In Progress': 'orange',
    'Completed': 'green',
    'Under Review': 'purple'
  };
  return colorMap[status] || 'gray';
};

// Page meta
useHead({
  title: "Beranda - ANOTA",
  meta: [{ name: "description", content: "Halaman beranda aplikasi ANOTA." }],
});
</script>