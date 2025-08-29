<template>
  <div>
    <!-- Welcome Section -->
    <section
      class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16 pt-10 flex flex-col gap-8"
    >
      <Card
        variant="glassmorphism"
        class="p-0 border border-gray-200 bg-gradient-to-r from-green-500 to-green-600 text-white w-full !shadow-none"
      >
        <div class="flex flex-col md:flex-row items-center gap-8 p-8 w-full">
          <Avatar class="w-24 h-24 ring-4 ring-green-400/30">
            <AvatarImage :src="userData.avatar" :alt="userData.name" />
            <AvatarFallback class="text-xl font-semibold">{{
              userData.name.charAt(0)
            }}</AvatarFallback>
          </Avatar>
          <div class="flex-1 text-center md:text-left">
            <div
              class="flex items-center gap-3 justify-center md:justify-start mb-3 text-3xl"
            >
              <span
                class="font-medium text-white bg-white/10 px-4 py-2 rounded-lg"
              >
                Hi,
              </span>
              <span class="font-bold text-white">{{ userData.name }}</span>
            </div>
            <div class="flex gap-2 mt-2 mb-8">
              <Badge
                v-for="role in userData.roles"
                :key="role"
                variant="green"
                class="text-xs uppercase tracking-wider font-semibold px-3 py-1 bg-white/20 text-white border border-white/30"
              >
                {{ role }}
              </Badge>
            </div>
            <div
              class="flex flex-wrap gap-4 justify-center md:justify-start text-sm"
            >
              <span class="flex items-center gap-2 text-white/80 font-medium">
                <Mail class="w-4 h-4" />
                {{ userData.email }}
              </span>
              <span class="flex items-center gap-2 text-white/80 font-medium">
                <Calendar class="w-4 h-4" />
                Bergabung {{ userData.memberSince }}
              </span>
            </div>
          </div>
          <div class="hidden md:block">
            <Button
              variant="outline"
              size="lg"
              class="bg-transparent text-white border border-gray-300 hover:bg-gray-100/10 hover:text-gray-900"
              @click="navigateTo('/')"
            >
              <ArrowLeft class="w-4 h-4" />
              Ke Halaman Utama
            </Button>
          </div>
        </div>
      </Card>

      <!-- Activity Timeline -->
      <Card
        variant="glassmorphism"
        class="p-8 bg-white/90 border border-gray-200 w-full !shadow-none"
      >
        <h3
          class="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900"
        >
          <Clock class="w-7 h-7 text-blue-400" />
          Aktivitas Terbaru
        </h3>
        <div class="space-y-4">
          <Card
            v-for="activity in recentActivities"
            :key="activity.id"
            variant="glassmorphism"
            class="flex items-start gap-4 p-6 hover:bg-green-50 transition-colors duration-200 border border-gray-100 bg-white/80 w-full !shadow-none"
          >
            <component
              :is="getIcon(activity.icon)"
              :class="`w-6 h-6 mt-1 ${activity.color}`"
            />
            <div class="flex-1">
              <p class="text-gray-900 font-semibold text-lg">
                {{ activity.title }}
              </p>
              <p class="text-sm text-gray-500 mt-1 leading-relaxed">
                {{ activity.description }}
              </p>
              <p class="text-xs text-gray-400 mt-2 font-medium">
                {{ activity.time }}
              </p>
            </div>
          </Card>
        </div>
      </Card>
    </section>

    <!-- Role-specific Content -->
    <section
      class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-12 flex-col space-y-20"
    >
      <!-- Admin Dashboard -->
      <div v-if="hasRole('Admin')" class="space-y-8">
        <!-- Admin Role Header -->
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 rounded-lg bg-blue-500/10 border border-blue-200">
            <Users class="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Dashboard Admin</h2>
            <p class="text-gray-500 text-lg">Kelola sistem dan pengguna</p>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card
            v-if="pending"
            v-for="i in 4"
            :key="i"
            variant="glassmorphism"
            class="p-6 animate-pulse bg-white/80 border border-gray-200 w-full !shadow-none"
          >
            <div class="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
            <div class="w-16 h-8 bg-gray-200 rounded mb-3"></div>
            <div class="w-28 h-4 bg-gray-200 rounded"></div>
          </Card>

          <Card
            v-else
            v-for="stat in adminStats"
            :key="stat.label"
            variant="glassmorphism"
            class="p-6 hover:scale-105 hover:border-gray-400 transition-all duration-300 group cursor-pointer bg-white/80 border border-gray-200 w-full !shadow-none"
          >
            <div class="flex items-center justify-between mb-6">
              <component
                :is="getIcon(stat.icon)"
                :class="`w-12 h-12 ${stat.color} group-hover:scale-110 transition-transform duration-300`"
              />
              <span class="text-3xl font-bold text-gray-900">{{
                stat.value
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              {{ stat.label }}
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              {{ stat.description }}
            </p>
          </Card>
        </div>

        <!-- Quick Actions -->
        <Card
          variant="glassmorphism"
          class="p-8 bg-white/90 border border-gray-200 w-full !shadow-none"
        >
          <h3
            class="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900"
          >
            <Zap class="w-7 h-7 text-yellow-500" />
            Aksi Cepat
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button
              variant="outline"
              size="lg"
              class="justify-start h-14 text-base font-medium"
              @click="navigateTo('/admin/pengguna')"
            >
              <UserPlus class="w-5 h-5" />
              Kelola Pengguna
            </Button>
            <Button
              variant="outline"
              size="lg"
              class="justify-start h-14 text-base font-medium"
              @click="navigateTo('/admin/dokumen')"
            >
              <FilePlus class="w-5 h-5" />
              Kelola Dokumen
            </Button>
            <Button
              variant="outline"
              size="lg"
              class="justify-start h-14 text-base font-medium"
              @click="navigateTo('/admin/error')"
            >
              <AlertTriangle class="w-5 h-5" />
              Kelola Error
            </Button>
          </div>
        </Card>
      </div>

      <!-- Annotator Dashboard -->
      <div v-if="hasRole('Annotator')" class="space-y-8">
        <!-- Annotator Role Header -->
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 rounded-lg bg-green-500/10 border border-green-200">
            <Pencil class="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Dashboard Anotator</h2>
            <p class="text-gray-500 text-lg">Kelola tugas anotasi Anda</p>
          </div>
        </div>

        <!-- Progress Overview -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            variant="glassmorphism"
            class="p-6 hover:scale-105 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none cursor-pointer"
          >
            <div class="flex items-center justify-between mb-6">
              <FileText class="w-12 h-12 text-blue-500" />
              <span class="text-3xl font-bold text-gray-900">{{
                annotatorStats.assignedDocuments || 0
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              Dokumen Ditugaskan
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Dokumen yang harus dianotasi
            </p>
          </Card>

          <Card
            variant="glassmorphism"
            class="p-6 hover:scale-105 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none cursor-pointer"
          >
            <div class="flex items-center justify-between mb-6">
              <CheckCircle class="w-12 h-12 text-green-500" />
              <span class="text-3xl font-bold text-gray-900">{{
                annotatorStats.completedDocuments || 0
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              Dokumen Selesai
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Dokumen yang telah dianotasi
            </p>
          </Card>

          <Card
            variant="glassmorphism"
            class="p-6 hover:scale-105 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none cursor-pointer"
          >
            <div class="flex items-center justify-between mb-6">
              <Clock class="w-12 h-12 text-yellow-500" />
              <span class="text-3xl font-bold text-gray-900">{{
                annotatorStats.inProgressDocuments || 0
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              Sedang Dikerjakan
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Dokumen dalam proses
            </p>
          </Card>
        </div>

        <!-- Recent Assignments -->
        <Card
          variant="glassmorphism"
          class="p-8 bg-white/90 border border-gray-200 w-full !shadow-none"
        >
          <h3
            class="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900"
          >
            <ClipboardList class="w-7 h-7 text-blue-500" />
            Tugas Terbaru
          </h3>
          <div class="space-y-4">
            <Card
              v-for="task in recentTasks"
              :key="task.id"
              variant="glassmorphism"
              class="flex items-center justify-between p-6 hover:bg-white/5 transition-colors duration-200 cursor-pointer"
              @click="navigateTo(`/anotator/anotasi/${task.id}`)"
            >
              <div class="flex items-center gap-4">
                <FileText class="w-6 h-6 text-gray-400" />
                <div>
                  <h4 class="font-semibold text-gray-900 text-lg">
                    {{ task.title }}
                  </h4>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ task.sentences }} kalimat
                  </p>
                </div>
              </div>
              <Badge
                :variant="getTaskStatusColor(task.status)"
                class="text-sm font-medium px-3 py-1"
              >
                {{ task.status }}
              </Badge>
            </Card>
          </div>
          <div class="mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              size="lg"
              class="hover:bg-gray-900 hover:text-white transition"
              @click="navigateTo('/anotator/anotasi')"
            >
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
          <div class="p-3 rounded-lg bg-purple-500/10 border border-purple-200">
            <Eye class="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Dashboard Reviewer</h2>
            <p class="text-gray-500 text-lg">Tinjau dan validasi anotasi</p>
          </div>
        </div>

        <!-- Review Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            variant="glassmorphism"
            class="p-6 hover:scale-105 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none cursor-pointer"
          >
            <div class="flex items-center justify-between mb-6">
              <Eye class="w-12 h-12 text-purple-500" />
              <span class="text-3xl font-bold text-gray-900">{{
                reviewerStats.pendingReviews || 0
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              Menunggu Review
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Dokumen yang perlu ditinjau
            </p>
          </Card>

          <Card
            variant="glassmorphism"
            class="p-6 hover:scale-105 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none cursor-pointer"
          >
            <div class="flex items-center justify-between mb-6">
              <CheckCircle2 class="w-12 h-12 text-green-500" />
              <span class="text-3xl font-bold text-gray-900">{{
                reviewerStats.completedReviews || 0
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              Review Selesai
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Dokumen yang telah direview
            </p>
          </Card>

          <Card
            variant="glassmorphism"
            class="p-6 hover:scale-105 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none cursor-pointer"
          >
            <div class="flex items-center justify-between mb-6">
              <AlertTriangle class="w-12 h-12 text-yellow-500" />
              <span class="text-3xl font-bold text-gray-900">{{
                reviewerStats.errorsFound || 0
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              Error Ditemukan
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Total error yang ditemukan
            </p>
          </Card>
        </div>

        <!-- Review Queue -->
        <Card
          variant="glassmorphism"
          class="p-8 bg-white/90 border border-gray-200 w-full !shadow-none"
        >
          <h3
            class="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900"
          >
            <List class="w-7 h-7 text-purple-500" />
            Antrian Review
          </h3>
          <div class="space-y-4">
            <div
              v-for="review in reviewQueue"
              :key="review.id"
              class="flex items-center justify-between p-6 bg-gray-100 rounded-lg border border-gray-200 hover:bg-purple-600 hover:text-white transition-colors duration-200 w-full cursor-pointer"
            >
              <div class="flex items-center gap-4">
                <FileCheck class="w-6 h-6 text-gray-400" />
                <div>
                  <h4 class="font-semibold text-gray-900 text-lg">
                    {{ review.title }}
                  </h4>
                  <p class="text-sm text-gray-500 mt-1">
                    Oleh {{ review.annotator }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Badge variant="yellow" class="text-sm font-medium px-3 py-1">{{
                  review.priority
                }}</Badge>
                <Button
                  size="sm"
                  @click="navigateTo(`/peninjau/tinjauan/${review.id}`)"
                >
                  <Eye class="w-4 h-4" />
                  Review
                </Button>
              </div>
            </div>
          </div>
          <div class="mt-8 pt-6 border-t border-slate-700/50">
            <Button
              variant="outline"
              size="lg"
              @click="navigateTo('/peninjau/tinjauan')"
            >
              Lihat Semua Review
              <ArrowRight class="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      <!-- Kepala Riset Dashboard -->
      <div v-if="hasRole('Kepala Riset')" class="space-y-8">
        <!-- Research Head Role Header -->
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 rounded-lg bg-yellow-500/10 border border-yellow-200">
            <BarChart3 class="w-8 h-8 text-yellow-500" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">
              Dashboard Kepala Riset
            </h2>
            <p class="text-gray-500 text-lg">
              Pantau progress dan generate dataset
            </p>
          </div>
        </div>

        <!-- Overview Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card
            v-for="stat in researchStats"
            :key="stat.label"
            variant="glassmorphism"
            class="p-6 hover:scale-105 hover:border-gray-400 transition-all duration-300 cursor-pointer bg-white/80 border border-gray-200 w-full !shadow-none"
          >
            <div class="flex items-center justify-between mb-6">
              <component
                :is="getIcon(stat.icon)"
                :class="`w-12 h-12 ${stat.color}`"
              />
              <span class="text-3xl font-bold text-gray-900">{{
                stat.value
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              {{ stat.label }}
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              {{ stat.description }}
            </p>
          </Card>
        </div>

        <!-- Progress Chart -->
        <Card
          variant="glassmorphism"
          class="p-8 bg-white/90 border border-gray-200 w-full !shadow-none"
        >
          <h3
            class="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900"
          >
            <BarChart3 class="w-7 h-7 text-green-500" />
            Progress Proyek
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Progress Bars -->
            <div class="space-y-6">
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-500">Anotasi</span>
                  <span class="text-gray-400"
                    >{{
                      Math.round(
                        ((researchStats.find(
                          (stat: any) => stat.label === "Total Anotasi"
                        )?.value || 0) /
                          1000) *
                          100
                      )
                    }}%</span
                  >
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                    :style="`width: ${Math.round(((researchStats.find((stat: any) => stat.label === 'Total Anotasi')?.value || 0) / 1000) * 100)}%`"
                  ></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-500">Review</span>
                  <span class="text-gray-400"
                    >{{
                      Math.round(
                        ((researchStats.find(
                          (stat: any) => stat.label === "Review Selesai"
                        )?.value || 0) /
                          800) *
                          100
                      )
                    }}%</span
                  >
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-green-500 h-2 rounded-full transition-all duration-1000"
                    :style="`width: ${Math.round(((researchStats.find((stat: any) => stat.label === 'Review Selesai')?.value || 0) / 800) * 100)}%`"
                  ></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-gray-500">Dataset Generation</span>
                  <span class="text-gray-400">75%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                    style="width: 75%"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="space-y-4">
              <Button
                variant="outline"
                size="lg"
                class="w-full justify-start h-14 text-base font-medium"
                @click="navigateTo('/kepala-riset/dataset')"
              >
                <Download class="w-5 h-5" />
                Generate Dataset
              </Button>
              <Button
                variant="outline"
                size="lg"
                class="w-full justify-start h-14 text-base font-medium"
                @click="navigateTo('/kepala-riset/kinerja')"
              >
                <BarChart3 class="w-5 h-5" />
                Rekap Kinerja
              </Button>
              <Button
                variant="outline"
                size="lg"
                class="w-full justify-start h-14 text-base font-medium"
                @click="navigateTo('/kepala-riset/dokumen')"
              >
                <ClipboardList class="w-5 h-5" />
                Rekap Dokumen
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import { ref, computed, onMounted } from "vue";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Calendar,
  Zap,
  UserPlus,
  FilePlus,
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  ClipboardList,
  Eye,
  CheckCircle2,
  List,
  FileCheck,
  BarChart3,
  Download,
  Users,
  Pencil,
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
    users: Users,
    "document-text": FileText,
    "clipboard-document-list": ClipboardList,
    "exclamation-triangle": AlertTriangle,
    pencil: Pencil,
    "check-circle": CheckCircle,
    "arrow-down-tray": Download,
    "user-group": Users,
    "chart-bar": BarChart3,
    clock: Clock,
    envelope: Mail,
    calendar: Calendar,
    bolt: Zap,
    "user-plus": UserPlus,
    "document-plus": FilePlus,
    eye: Eye,
    "check-badge": CheckCircle2,
    "queue-list": List,
    "document-check": FileCheck,
  };
  return iconMap[iconName] || FileText;
};

// User data computed from auth
const userData = computed(() => ({
  name: user.value?.full_name || "Pengguna",
  email: user.value?.email || "pengguna@anota.com",
  roles: user.value?.roles || ["Pengguna"],
  memberSince: user.value?.date_joined
    ? new Date(user.value.date_joined).toLocaleDateString("id-ID")
    : "1 Januari 2024",
  avatar:
    user.value?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.value?.full_name || "User"
    )}&background=0ea5e9&color=fff`,
}));

// Role checks
const hasRole = (role: string) => user.value?.roles?.includes(role) || false;

// Admin stats
const adminStats = ref([
  {
    label: "Total Pengguna",
    value: 0,
    icon: "users",
    color: "text-blue-400",
    description: "Pengguna aktif sistem",
  },
  {
    label: "Dokumen Upload",
    value: 0,
    icon: "document-text",
    color: "text-green-400",
    description: "Dokumen dalam sistem",
  },
  {
    label: "Tugas Aktif",
    value: 0,
    icon: "clipboard-document-list",
    color: "text-orange-400",
    description: "Tugas sedang dikerjakan",
  },
  {
    label: "Error Terdeteksi",
    value: 0,
    icon: "exclamation-triangle",
    color: "text-red-400",
    description: "Error yang perlu ditangani",
  },
]);

// Annotator stats
const annotatorStats = ref({
  assignedDocuments: 0,
  completedDocuments: 0,
  inProgressDocuments: 0,
});

// Reviewer stats
const reviewerStats = ref({
  pendingReviews: 0,
  completedReviews: 0,
  errorsFound: 0,
});

// Research stats
const researchStats = ref([
  {
    label: "Total Anotasi",
    value: 0,
    icon: "pencil",
    color: "text-blue-400",
    description: "Anotasi yang telah dibuat",
  },
  {
    label: "Review Selesai",
    value: 0,
    icon: "check-circle",
    color: "text-green-400",
    description: "Review yang telah selesai",
  },
  {
    label: "Dataset Generated",
    value: 0,
    icon: "arrow-down-tray",
    color: "text-purple-400",
    description: "Dataset yang telah dibuat",
  },
  {
    label: "Active Annotators",
    value: 0,
    icon: "user-group",
    color: "text-orange-400",
    description: "Anotator yang aktif",
  },
]);

interface Task {
  id: string;
  title: string;
  sentences: number;
  status: string;
}

const recentTasks = ref<Task[]>([]);

// Review queue for reviewer
const reviewQueue = ref<
  Array<{
    id: string;
    title: string;
    annotator: string;
    priority: string;
  }>
>([]);

// Recent activities (common for all roles)
const recentActivities = ref<
  Array<{
    id: string;
    title: string;
    description: string;
    time: string;
    icon: string;
    color: string;
  }>
>([]);

// Helper functions
const getTaskStatusColor = (status: string) => {
  const colorMap: Record<
    string,
    "blue" | "yellow" | "green" | "purple" | "gray"
  > = {
    Assigned: "blue",
    "In Progress": "yellow",
    Completed: "green",
    "Under Review": "purple",
  };
  return colorMap[status] || "gray";
};

// Page meta
useHead({
  title: "Beranda - ANOTA",
  meta: [{ name: "description", content: "Halaman beranda aplikasi ANOTA." }],
});

onMounted(async () => {
  pending.value = true;
  try {
    await fetchDashboardData();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    pending.value = false;
  }
});

const fetchDashboardData = async () => {
  if (hasRole("Admin")) {
    adminStats.value = [
      {
        label: "Total Pengguna",
        value: 42,
        icon: "users",
        color: "text-blue-400",
        description: "Pengguna aktif sistem",
      },
      {
        label: "Dokumen Upload",
        value: 128,
        icon: "document-text",
        color: "text-green-400",
        description: "Dokumen dalam sistem",
      },
      {
        label: "Tugas Aktif",
        value: 23,
        icon: "clipboard-document-list",
        color: "text-orange-400",
        description: "Tugas sedang dikerjakan",
      },
      {
        label: "Error Terdeteksi",
        value: 5,
        icon: "exclamation-triangle",
        color: "text-red-400",
        description: "Error yang perlu ditangani",
      },
    ];
  }

  if (hasRole("Annotator")) {
    annotatorStats.value = {
      assignedDocuments: 15,
      completedDocuments: 8,
      inProgressDocuments: 7,
    };
    recentTasks.value = [
      {
        id: "1",
        title: "Dokumen Berita 001",
        sentences: 120,
        status: "In Progress",
      },
      {
        id: "2",
        title: "Dokumen Berita 002",
        sentences: 85,
        status: "Assigned",
      },
      {
        id: "3",
        title: "Dokumen Berita 003",
        sentences: 95,
        status: "Completed",
      },
    ];
  }

  if (hasRole("Reviewer")) {
    reviewerStats.value = {
      pendingReviews: 12,
      completedReviews: 45,
      errorsFound: 8,
    };
    reviewQueue.value = [
      {
        id: "1",
        title: "Review Anotasi Batch 001",
        annotator: "John Doe",
        priority: "High",
      },
      {
        id: "2",
        title: "Review Anotasi Batch 002",
        annotator: "Jane Smith",
        priority: "Medium",
      },
      {
        id: "3",
        title: "Review Anotasi Batch 003",
        annotator: "Bob Wilson",
        priority: "Low",
      },
    ];
  }

  if (hasRole("Kepala Riset")) {
    researchStats.value = [
      {
        label: "Total Anotasi",
        value: 750,
        icon: "pencil",
        color: "text-blue-400",
        description: "Anotasi yang telah dibuat",
      },
      {
        label: "Review Selesai",
        value: 580,
        icon: "check-circle",
        color: "text-green-400",
        description: "Review yang telah selesai",
      },
      {
        label: "Dataset Generated",
        value: 12,
        icon: "arrow-down-tray",
        color: "text-purple-400",
        description: "Dataset yang telah dibuat",
      },
      {
        label: "Active Annotators",
        value: 8,
        icon: "user-group",
        color: "text-orange-400",
        description: "Anotator yang aktif",
      },
    ];
  }

  recentActivities.value = [
    {
      id: "1",
      title: "Login ke sistem",
      description: "Anda berhasil masuk ke dalam sistem ANOTA",
      time: "2 menit yang lalu",
      icon: "check-circle",
      color: "text-green-400",
    },
    {
      id: "2",
      title: "Tugas baru tersedia",
      description: "Ada tugas anotasi baru yang dapat Anda kerjakan",
      time: "1 jam yang lalu",
      icon: "clipboard-document-list",
      color: "text-blue-400",
    },
  ];
};
</script>
