<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
    <!-- Welcome Section -->
    <section class="w-full max-w-7xl mx-auto px-4 pb-20 pt-20">
      <Card variant="glassmorphism" class="p-8">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <Avatar class="w-24 h-24 ring-4 ring-blue-500/30 shadow-xl">
            <AvatarImage :src="userData.avatar" :alt="userData.name" />
            <AvatarFallback class="text-xl font-semibold">{{ userData.name.charAt(0) }}</AvatarFallback>
          </Avatar>
          <div class="flex-1 text-center md:text-left">
            <div class="flex items-center gap-3 justify-center md:justify-start mb-3 text-3xl">
              <span class=" text-slate-400 font-medium">Hi,</span>
              <span class="font-bold text-white">{{ userData.name }}</span>
            </div>
            <div class="flex gap-2 mt-2 mb-8">
              <Badge v-for="role in userData.roles" :key="role" variant="blue"
                class="text-xs uppercase tracking-wider font-semibold px-3 py-1">
                {{ role }}
              </Badge>
            </div>
            <div class="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
              <span class="flex items-center gap-2 text-slate-400 font-medium">
                <Mail class="w-4 h-4" />
                {{ userData.email }}
              </span>
              <span class="flex items-center gap-2 text-slate-400 font-medium">
                <Calendar class="w-4 h-4" />
                Bergabung {{ userData.memberSince }}
              </span>
            </div>
          </div>
          <div class="hidden md:block">
            <Button variant="outline" size="lg" @click="navigateTo('/')">
              <ArrowLeft class="w-4 h-4" />
              Ke Halaman Utama
            </Button>
          </div>
        </div>
      </Card>
    </section>

    <!-- Role-specific Content -->
    <section class="w-full max-w-7xl mx-auto px-4 pb-12 flex-col space-y-20">
      <!-- Admin Dashboard -->
      <div v-if="hasRole('Admin')" class="space-y-8">
        <!-- Admin Role Header -->
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
            <Users class="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-white">Dashboard Admin</h2>
            <p class="text-slate-400 text-lg">Kelola sistem dan pengguna</p>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card v-if="pending" v-for="i in 4" :key="i" variant="glassmorphism" class="p-6 animate-pulse">
            <div class="w-12 h-12 bg-slate-700 rounded-lg mb-4"></div>
            <div class="w-16 h-8 bg-slate-700 rounded mb-3"></div>
            <div class="w-28 h-4 bg-slate-700 rounded"></div>
          </Card>

          <Card v-else v-for="stat in adminStats" :key="stat.label" variant="glassmorphism"
            class="p-6 hover:scale-105 transition-all duration-300 group cursor-pointer">
            <div class="flex items-center justify-between mb-6">
              <component :is="getIcon(stat.icon)"
                :class="`w-12 h-12 ${stat.color} group-hover:scale-110 transition-transform duration-300`" />
              <span class="text-3xl font-bold text-white">{{ stat.value }}</span>
            </div>
            <h3 class="text-slate-200 font-semibold text-lg mb-2">{{ stat.label }}</h3>
            <p class="text-sm text-slate-400 leading-relaxed">{{ stat.description }}</p>
          </Card>
        </div>

        <!-- Quick Actions -->
        <Card variant="glassmorphism" class="p-8">
          <h3 class="text-2xl font-bold mb-6 flex items-center gap-3">
            <Zap class="w-7 h-7 text-yellow-400" />
            Aksi Cepat
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button variant="outline" size="lg" class="justify-start h-14 text-base font-medium"
              @click="navigateTo('/admin/kelola-pengguna')">
              <UserPlus class="w-5 h-5" />
              Tambah Pengguna
            </Button>
            <Button variant="outline" size="lg" class="justify-start h-14 text-base font-medium"
              @click="navigateTo('/admin/kelola-dokumen')">
              <FilePlus class="w-5 h-5" />
              Upload Dokumen
            </Button>
            <Button variant="outline" size="lg" class="justify-start h-14 text-base font-medium"
              @click="navigateTo('/admin/kelola-error')">
              <AlertTriangle class="w-5 h-5" />
              Review Error
            </Button>
          </div>
        </Card>
      </div>

      <!-- Annotator Dashboard -->
      <div v-if="hasRole('Annotator')" class="space-y-8">
        <!-- Annotator Role Header -->
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 rounded-lg bg-green-500/20 border border-green-500/30">
            <Pencil class="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-white">Dashboard Anotator</h2>
            <p class="text-slate-400 text-lg">Kelola tugas anotasi Anda</p>
          </div>
        </div>

        <!-- Progress Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="glassmorphism" class="p-6 hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <FileText class="w-12 h-12 text-blue-400" />
              <span class="text-3xl font-bold text-white">{{ annotatorStats.assignedDocuments || 0 }}</span>
            </div>
            <h3 class="text-slate-200 font-semibold text-lg mb-2">Dokumen Ditugaskan</h3>
            <p class="text-sm text-slate-400 leading-relaxed">Dokumen yang harus dianotasi</p>
          </Card>

          <Card variant="glassmorphism" class="p-6 hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <CheckCircle class="w-12 h-12 text-green-400" />
              <span class="text-3xl font-bold text-white">{{ annotatorStats.completedDocuments || 0 }}</span>
            </div>
            <h3 class="text-slate-200 font-semibold text-lg mb-2">Dokumen Selesai</h3>
            <p class="text-sm text-slate-400 leading-relaxed">Dokumen yang telah dianotasi</p>
          </Card>

          <Card variant="glassmorphism" class="p-6 hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <Clock class="w-12 h-12 text-orange-400" />
              <span class="text-3xl font-bold text-white">{{ annotatorStats.inProgressDocuments || 0 }}</span>
            </div>
            <h3 class="text-slate-200 font-semibold text-lg mb-2">Sedang Dikerjakan</h3>
            <p class="text-sm text-slate-400 leading-relaxed">Dokumen dalam proses</p>
          </Card>
        </div>

        <!-- Recent Assignments -->
        <Card variant="glassmorphism" class="p-8">
          <h3 class="text-2xl font-bold mb-6 flex items-center gap-3">
            <ClipboardList class="w-7 h-7 text-blue-400" />
            Tugas Terbaru
          </h3>
          <div class="space-y-4">
            <Card v-for="task in recentTasks" :key="task.id" variant="glassmorphism"
              class="flex items-center justify-between p-6 hover:bg-white/5 transition-colors duration-200">
              <div class="flex items-center gap-4">
                <FileText class="w-6 h-6 text-slate-400" />
                <div>
                  <h4 class="font-semibold text-white text-lg">{{ task.title }}</h4>
                  <p class="text-sm text-slate-400 mt-1">{{ task.sentences }} kalimat</p>
                </div>
              </div>
              <Badge :variant="getTaskStatusColor(task.status)" class="text-sm font-medium px-3 py-1">
                {{ task.status }}
              </Badge>
            </Card>
          </div>
          <div class="mt-8 pt-6 border-t border-slate-700/50">
            <Button variant="outline" size="lg" @click="navigateTo('/anotator/anotasi')">
              Lihat Semua Tugas
              <ArrowRight class="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      <!-- Reviewer Dashboard -->
      <div v-if="hasRole('Reviewer')" class="space-y-8">
        <!-- Reviewer Role Header -->
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
            <Eye class="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-white">Dashboard Peninjau</h2>
            <p class="text-slate-400 text-lg">Tinjau dan validasi anotasi</p>
          </div>
        </div>

        <!-- Review Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="glassmorphism" class="p-6 hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <Eye class="w-12 h-12 text-purple-400" />
              <span class="text-3xl font-bold text-white">{{ reviewerStats.pendingReviews || 0 }}</span>
            </div>
            <h3 class="text-slate-200 font-semibold text-lg mb-2">Menunggu Review</h3>
            <p class="text-sm text-slate-400 leading-relaxed">Dokumen yang perlu ditinjau</p>
          </Card>

          <Card variant="glassmorphism" class="p-6 hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <CheckCircle2 class="w-12 h-12 text-green-400" />
              <span class="text-3xl font-bold text-white">{{ reviewerStats.completedReviews || 0 }}</span>
            </div>
            <h3 class="text-slate-200 font-semibold text-lg mb-2">Review Selesai</h3>
            <p class="text-sm text-slate-400 leading-relaxed">Dokumen yang telah direview</p>
          </Card>

          <Card variant="glassmorphism" class="p-6 hover:scale-105 transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <AlertTriangle class="w-12 h-12 text-red-400" />
              <span class="text-3xl font-bold text-white">{{ reviewerStats.errorsFound || 0 }}</span>
            </div>
            <h3 class="text-slate-200 font-semibold text-lg mb-2">Error Ditemukan</h3>
            <p class="text-sm text-slate-400 leading-relaxed">Total error yang ditemukan</p>
          </Card>
        </div>

        <!-- Review Queue -->
        <Card variant="glassmorphism" class="p-8">
          <h3 class="text-2xl font-bold mb-6 flex items-center gap-3">
            <List class="w-7 h-7 text-purple-400" />
            Antrian Review
          </h3>
          <div class="space-y-4">
            <div v-for="review in reviewQueue" :key="review.id"
              class="flex items-center justify-between p-6 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-colors duration-200">
              <div class="flex items-center gap-4">
                <FileCheck class="w-6 h-6 text-slate-400" />
                <div>
                  <h4 class="font-semibold text-white text-lg">{{ review.title }}</h4>
                  <p class="text-sm text-slate-400 mt-1">Oleh {{ review.annotator }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Badge variant="yellow" class="text-sm font-medium px-3 py-1">{{ review.priority }}</Badge>
                <Button size="sm" @click="navigateTo(`/peninjau/tinjauan/${review.id}`)">
                  <Eye class="w-4 h-4" />
                  Review
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Kepala Riset Dashboard -->
      <div v-if="hasRole('Kepala Riset')" class="space-y-8">
        <!-- Research Head Role Header -->
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 rounded-lg bg-orange-500/20 border border-orange-500/30">
            <BarChart3 class="w-8 h-8 text-orange-400" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-white">Dashboard Kepala Riset</h2>
            <p class="text-slate-400 text-lg">Pantau progress dan generate dataset</p>
          </div>
        </div>

        <!-- Overview Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card v-for="stat in researchStats" :key="stat.label" variant="glassmorphism"
            class="p-6 hover:scale-105 transition-all duration-300 cursor-pointer">
            <div class="flex items-center justify-between mb-6">
              <component :is="getIcon(stat.icon)" :class="`w-12 h-12 ${stat.color}`" />
              <span class="text-3xl font-bold text-white">{{ stat.value }}</span>
            </div>
            <h3 class="text-slate-200 font-semibold text-lg mb-2">{{ stat.label }}</h3>
            <p class="text-sm text-slate-400 leading-relaxed">{{ stat.description }}</p>
          </Card>
        </div>

        <!-- Progress Chart -->
        <Card variant="glassmorphism" class="p-8">
          <h3 class="text-2xl font-bold mb-8 flex items-center gap-3">
            <BarChart3 class="w-7 h-7 text-green-400" />
            Progress Proyek
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Progress Bars -->
            <div class="space-y-6">
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-slate-300">Anotasi</span>
                  <span class="text-slate-400">{{Math.round(((researchStats.find((stat: any) => stat.label === 'Total Anotasi')?.value || 0) / 1000) * 100) }}%</span>
                </div>
                <div class="w-full bg-slate-700 rounded-full h-2">
                  <div class="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                    :style="`width: ${Math.round(((researchStats.find((stat: any) => stat.label === 'Total Anotasi')?.value || 0) / 1000) * 100)}%`">
                  </div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-slate-300">Review</span>
                  <span class="text-slate-400">{{Math.round(((researchStats.find((stat: any) => stat.label === 'Review Selesai')?.value || 0) / 800) * 100) }}%</span>
                </div>
                <div class="w-full bg-slate-700 rounded-full h-2">
                  <div class="bg-green-500 h-2 rounded-full transition-all duration-1000"
                    :style="`width: ${Math.round(((researchStats.find((stat: any) => stat.label === 'Review Selesai')?.value || 0) / 800) * 100)}%`">
                  </div>
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
            <div class="space-y-4">
              <Button variant="outline" size="lg" class="w-full justify-start h-14 text-base font-medium"
                @click="navigateTo('/kepala-riset/generate-dataset')">
                <Download class="w-5 h-5" />
                Generate Dataset
              </Button>
              <Button variant="outline" size="lg" class="w-full justify-start h-14 text-base font-medium"
                @click="navigateTo('/kepala-riset/rekap-kinerja')">
                <BarChart3 class="w-5 h-5" />
                Rekap Kinerja
              </Button>
              <Button variant="outline" size="lg" class="w-full justify-start h-14 text-base font-medium"
                @click="navigateTo('/kepala-riset/rekap-dokumen')">
                <ClipboardList class="w-5 h-5" />
                Rekap Dokumen
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <!-- Activity Timeline -->
      <Card variant="glassmorphism" class="p-8">
        <h3 class="text-2xl font-bold mb-6 flex items-center gap-3">
          <Clock class="w-7 h-7 text-blue-400" />
          Aktivitas Terbaru
        </h3>
        <div class="space-y-4">
          <Card v-for="activity in recentActivities" :key="activity.id" variant="glassmorphism"
            class="flex items-start gap-4 p-6 hover:bg-white/5 transition-colors duration-200">
            <component :is="getIcon(activity.icon)" :class="`w-6 h-6 mt-1 ${activity.color}`" />
            <div class="flex-1">
              <p class="text-white font-semibold text-lg">{{ activity.title }}</p>
              <p class="text-sm text-slate-400 mt-1 leading-relaxed">{{ activity.description }}</p>
              <p class="text-xs text-slate-500 mt-2 font-medium">{{ activity.time }}</p>
            </div>
          </Card>
        </div>
      </Card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import { ref, computed } from "vue";
import {
  ArrowLeft, ArrowRight, Mail, Calendar, Zap, UserPlus, FilePlus, AlertTriangle,
  FileText, CheckCircle, Clock, ClipboardList, Eye, CheckCircle2, List, FileCheck,
  BarChart3, Download, Users, Pencil
} from "lucide-vue-next";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { useAuth } from "~/data/auth";

const { user } = useAuth();

// Loading state
const pending = ref(false);

// Helper function to get icon component
const getIcon = (iconName: string) => {
  const iconMap: Record<string, any> = {
    'users': Users,
    'document-text': FileText,
    'clipboard-document-list': ClipboardList,
    'exclamation-triangle': AlertTriangle,
    'pencil': Pencil,
    'check-circle': CheckCircle,
    'arrow-down-tray': Download,
    'user-group': Users,
    'chart-bar': BarChart3,
    'clock': Clock,
    'envelope': Mail,
    'calendar': Calendar,
    'bolt': Zap,
    'user-plus': UserPlus,
    'document-plus': FilePlus,
    'eye': Eye,
    'check-badge': CheckCircle2,
    'queue-list': List,
    'document-check': FileCheck,
  };
  return iconMap[iconName] || FileText;
};

// User data computed from auth
const userData = computed(() => ({
  name: user.value?.full_name || "Pengguna",
  email: user.value?.email || "pengguna@anota.com",
  roles: user.value?.roles || ["Pengguna"],
  memberSince: user.value?.date_joined ? new Date(user.value.date_joined).toLocaleDateString('id-ID') : "1 Januari 2024",
  avatar: user.value?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.value?.full_name || 'User')}&background=0ea5e9&color=fff`,
}));

// Role checks
const hasRole = (role: string) => user.value?.roles?.includes(role) || false;

// Admin stats
const adminStats = ref([
  {
    label: 'Total Pengguna',
    value: 0,
    icon: 'users',
    color: 'text-blue-400',
    description: 'Pengguna aktif sistem'
  },
  {
    label: 'Dokumen Upload',
    value: 0,
    icon: 'document-text',
    color: 'text-green-400',
    description: 'Dokumen dalam sistem'
  },
  {
    label: 'Tugas Aktif',
    value: 0,
    icon: 'clipboard-document-list',
    color: 'text-orange-400',
    description: 'Tugas sedang dikerjakan'
  },
  {
    label: 'Error Terdeteksi',
    value: 0,
    icon: 'exclamation-triangle',
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
    icon: 'pencil',
    color: 'text-blue-400',
    description: 'Anotasi yang telah dibuat'
  },
  {
    label: 'Review Selesai',
    value: 0,
    icon: 'check-circle',
    color: 'text-green-400',
    description: 'Review yang telah selesai'
  },
  {
    label: 'Dataset Generated',
    value: 0,
    icon: 'arrow-down-tray',
    color: 'text-purple-400',
    description: 'Dataset yang telah dibuat'
  },
  {
    label: 'Active Annotators',
    value: 0,
    icon: 'user-group',
    color: 'text-orange-400',
    description: 'Anotator yang aktif'
  }
]);

// Recent tasks for annotator
interface Task {
  id: string;
  title: string;
  sentences: number;
  status: string;
}

const recentTasks = ref<Task[]>([]);

// Review queue for reviewer
const reviewQueue = ref<Array<{
  id: string;
  title: string;
  annotator: string;
  priority: string;
}>>([]);

// Recent activities (common for all roles)
const recentActivities = ref<Array<{
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}>>([]);

// Helper functions
const getTaskStatusColor = (status: string) => {
  const colorMap: Record<string, 'blue' | 'yellow' | 'green' | 'purple' | 'gray'> = {
    'Assigned': 'blue',
    'In Progress': 'yellow',
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