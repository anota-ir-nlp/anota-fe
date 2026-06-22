<template>
  <div>
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
                <span class="font-bold text-white">{{ userData.name }}</span>
              </span>
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
        </div>
      </Card>

      <div v-if="hasRole('Superadmin')" class="space-y-6 animate-in fade-in duration-700">
        <div class="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-sm">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-600 rounded-xl text-white shadow-blue-200 shadow-lg">
              <ShieldCheck class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-blue-900">User Management</h3>
              <p class="text-sm text-blue-700/80">Akses penuh ke seluruh data pengguna sistem</p>
            </div>
          </div>
          <div class="flex gap-3">
            <Button 
              class="bg-blue-600 hover:bg-blue-700 text-white"
              @click="navigateTo('/superadmin/kelola-pengguna')"
            >
              <Users class="w-4 h-4 mr-2" />
              Kelola Pengguna
            </Button>
          </div>
        </div>
      </div>
      <div
        v-if="!isKepalaRiset && !hasRole('Superadmin')"
        class="mt-8 mb-8"
      >
        <!-- Project Assignment Header -->
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 rounded-lg bg-pink-500/10 border border-pink-200">
            <Building2 class="w-8 h-8 text-pink-500" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Project Assignment</h2>
            <p class="text-gray-500 text-lg">Your assigned project</p>
          </div>
        </div>

        <!-- Project Selection and Display -->
        <Card
          variant="glassmorphism"
          class="p-6 bg-white/90 border border-gray-200 w-full !shadow-none mb-4"
        >
          <div v-if="isLoadingProjects" class="flex items-center justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>

          <div v-else-if="userProjects.length === 0" class="text-center py-8">
            <Building2 class="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p class="text-gray-500">You are not assigned to any project yet.</p>
          </div>

          <div v-else class="space-y-4">
            <!-- Project Selector -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Select Your Working Project
              </label>
              <Select v-model="selectedProjectIdLocal" @update:model-value="onProjectChange">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Choose a project..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="project in userProjects"
                    :key="project.id"
                    :value="project.id.toString()"
                  >
                    {{ project.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Selected Project Details -->
            <div v-if="currentSelectedProject" class="mt-6 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
              <div class="flex items-start gap-4">
                <div class="p-2 rounded-lg bg-blue-500/10 border border-blue-200">
                  <Building2 class="w-5 h-5 text-blue-600" />
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ currentSelectedProject.name }}</h3>

                  <!-- Display user's roles in this project -->
                  <div v-if="userRolesInProject.length > 0" class="mt-3">
                    <p class="text-xs font-medium text-gray-700 mb-2">Your roles in this project:</p>
                    <div class="flex flex-wrap gap-2">
                      <Badge
                        v-for="role in userRolesInProject"
                        :key="role"
                        variant="blue"
                        class="text-xs"
                      >
                        {{ role }}
                      </Badge>
                    </div>
                  </div>
                  <div v-else-if="isLoadingRoles" class="mt-3">
                    <p class="text-xs text-gray-500">Loading roles...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>

        <section
      class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-12 flex-col space-y-20"
    >

      <div v-if="hasRole('Annotator')" class="space-y-8">
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 rounded-lg bg-green-500/10 border border-green-200">
            <Pencil class="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Dashboard Anotator</h2>
            <p class="text-gray-500 text-lg">Kelola tugas anotasi Anda</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            variant="glassmorphism"
            class="p-6 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none"
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
            class="p-6 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none"
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
            class="p-6 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none"
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
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card
              v-for="task in recentTasks"
              :key="task.id"
              variant="glassmorphism"
              class="flex flex-col items-start gap-4 p-6 hover:border-gray-400 transition-all duration-300 border border-gray-200 bg-white/80 w-full !shadow-none"
              @click="navigateTo(`/anotator/anotasi/${task.id}`)"
            >
              <div class="flex items-center gap-4 mb-2">
                <FileText class="w-8 h-8 text-blue-400" />
                <div>
                  <h4 class="font-semibold text-gray-900 text-lg">
                    {{ task.title }}
                  </h4>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ task.sentences }} kalimat
                  </p>
                </div>
              </div>
              <span
                class="text-xs font-semibold px-3 py-1 rounded border border-gray-300 text-gray-700 bg-gray-50"
                :class="{
                  'text-blue-700 border-blue-200 bg-blue-50':
                    getTaskStatusColor(task.status) === 'blue',
                  'text-yellow-700 border-yellow-200 bg-yellow-50':
                    getTaskStatusColor(task.status) === 'yellow',
                  'text-green-700 border-green-200 bg-green-50':
                    getTaskStatusColor(task.status) === 'green',
                  'text-purple-700 border-purple-200 bg-purple-50':
                    getTaskStatusColor(task.status) === 'purple',
                  'text-orange-700 border-orange-200 bg-orange-50':
                    getTaskStatusColor(task.status) === 'orange',
                }"
              >
                {{ formatStatus(task.status) }}
              </span>
            </Card>
          </div>
          <div class="mt-8 pt-6 border-t border-gray-200 text-center">
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

      <div v-if="hasRole('Reviewer')" class="space-y-8">
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 rounded-lg bg-purple-500/10 border border-purple-200">
            <Eye class="w-8 h-8 text-purple-500" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Dashboard Reviewer</h2>
            <p class="text-gray-500 text-lg">Kelola tugas review Anda</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            variant="glassmorphism"
            class="p-6 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none"
          >
            <div class="flex items-center justify-between mb-6">
              <FileText class="w-12 h-12 text-purple-500" />
              <span class="text-3xl font-bold text-gray-900">{{
                reviewerStats.pendingReviews || 0
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              Dokumen Ditugaskan
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Dokumen yang harus direview
            </p>
          </Card>

          <Card
            variant="glassmorphism"
            class="p-6 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none"
          >
            <div class="flex items-center justify-between mb-6">
              <CheckCircle class="w-12 h-12 text-green-500" />
              <span class="text-3xl font-bold text-gray-900">{{
                reviewerStats.completedReviews || 0
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              Dokumen Selesai
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Dokumen yang telah direview
            </p>
          </Card>

          <Card
            variant="glassmorphism"
            class="p-6 hover:border-gray-400 transition-all duration-300 bg-white/80 border border-gray-200 w-full !shadow-none"
          >
            <div class="flex items-center justify-between mb-6">
              <Clock class="w-12 h-12 text-yellow-500" />
              <span class="text-3xl font-bold text-gray-900">{{
                reviewerStats.inProgressDocuments || 0
              }}</span>
            </div>
            <h3 class="text-gray-800 font-semibold text-lg mb-2">
              Sedang Dikerjakan
            </h3>
            <p class="text-sm text-gray-500 leading-relaxed">
              Dokumen dalam proses review
            </p>
          </Card>
        </div>

        <Card
          variant="glassmorphism"
          class="p-8 bg-white/90 border border-gray-200 w-full !shadow-none"
        >
          <h3
            class="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900"
          >
            <ClipboardList class="w-7 h-7 text-purple-500" />
            Tugas Review Terbaru
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card
              v-for="task in recentReviewedDocs"
              :key="task.id"
              variant="glassmorphism"
              class="flex flex-col items-start gap-4 p-6 hover:border-gray-400 transition-all duration-300 border border-gray-200 bg-white/80 w-full !shadow-none"
              @click="navigateTo(`/reviewer/review/${task.id}`)"
            >
              <div class="flex items-center gap-4 mb-2">
                <FileText class="w-8 h-8 text-purple-400" />
                <div>
                  <h4 class="font-semibold text-gray-900 text-lg">
                    {{ task.title }}
                  </h4>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ formatDate(task.created_at) }}
                  </p>
                </div>
              </div>
              <span
                class="text-xs font-semibold px-3 py-1 rounded border border-gray-300 text-gray-700 bg-gray-50"
                :class="{
                  'text-blue-700 border-blue-200 bg-blue-50':
                    getTaskStatusColor(task.status) === 'blue',
                  'text-yellow-700 border-yellow-200 bg-yellow-50':
                    getTaskStatusColor(task.status) === 'yellow',
                  'text-green-700 border-green-200 bg-green-50':
                    getTaskStatusColor(task.status) === 'green',
                  'text-purple-700 border-purple-200 bg-purple-50':
                    getTaskStatusColor(task.status) === 'purple',
                  'text-orange-700 border-orange-200 bg-orange-50':
                    getTaskStatusColor(task.status) === 'orange',
                }"
              >
                {{ formatStatus(task.status) }}
              </span>
            </Card>
          </div>
          <div class="mt-8 pt-6 border-t border-gray-200 text-center">
            <Button
              variant="outline"
              size="lg"
              class="hover:bg-gray-900 hover:text-white transition"
              @click="navigateTo('/reviewer/review')"
            >
              Lihat Semua Tugas
              <ArrowRight class="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      <div v-if="hasRole('Kepala Riset')" class="space-y-8">
        <div class="flex items-center gap-4 mb-8">
          <div class="p-3 rounded-lg bg-yellow-500/10 border border-yellow-200">
            <BarChart3 class="w-8 h-8 text-yellow-500" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-gray-900">
              Dashboard Kepala Riset
            </h2>
            <p class="text-gray-500 text-lg">
              Pantau progress dan analytics lengkap proyek penelitian
            </p>
          </div>
        </div>

        <div class="flex gap-6">
          <aside class="w-[260px] bg-white/90 border border-gray-200 rounded-lg !shadow-none p-4 flex-shrink-0">
            <h3 class="text-sm font-semibold text-gray-700 mb-3">Pilih Proyek untuk Analisis</h3>
            <div class="space-y-2 overflow-auto max-h-[calc(100vh-280px)]">
              <button
                v-for="project in pagedProjects"
                :key="project.id"
                @click="onProjectChange(project.id.toString())"
                :class="{
                  'w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-center gap-3 hover:shadow-md':
                    true,
                  'bg-blue-50 border-blue-200 text-blue-700 shadow-sm': selectedProjectIdLocal === project.id.toString(),
                  'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100': selectedProjectIdLocal !== project.id.toString(),
                }"
              >
                <div class="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Building2 class="w-4 h-4 text-blue-600" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-medium truncate">{{ project.name }}</div>
                  <div class="text-xs text-gray-500 truncate">{{ project.description || 'Belum ada deskripsi' }}</div>
                </div>
              </button>
            </div>

            <div class="mt-4 flex items-center justify-between">
              <Button
                size="sm"
                variant="outline"
                :disabled="!canPreviousPage"
                @click="goToPreviousPage"
              >
                <ArrowLeft class="w-4 h-4" />
              </Button>
              <span class="text-sm text-gray-600">
                {{ projectPage + 1 }} / {{ totalProjectPages }}
              </span>
              <Button
                size="sm"
                variant="outline"
                :disabled="!canNextPage"
                @click="goToNextPage"
              >
                <ArrowRight class="w-4 h-4" />
              </Button>
            </div>
          </aside>

          <main class="flex-1 bg-white/90 border border-gray-200 rounded-lg !shadow-none p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Project terpilih</h3>
            <p class="text-sm text-gray-600 mb-4">{{ currentSelectedProject?.name || 'Pilih project dari sidebar sebelah kiri' }}</p>
            <div v-if="currentSelectedProject" class="space-y-2">
              <p><span class="font-semibold">Created:</span> {{ currentSelectedProject.created_at ? new Date(currentSelectedProject.created_at).toLocaleDateString('id-ID') : '-' }}</p>
              <p><span class="font-semibold">Status:</span> {{ projectStatus }}</p>
            </div>
            <div v-else class="text-sm text-gray-500">Tidak ada proyek terpilih.</div>
          </main>
        </div>

        <Card
          variant="glassmorphism"
          class="p-6 bg-white/90 border border-gray-200 w-full !shadow-none"
        >
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Status Dokumen
          </h3>
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
            v-if="dashboardAnalytics"
          >
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">
                {{ totalProjectDocuments || 0 }}
              </div>
              <div class="text-sm text-blue-600">Total Dokumen Proyek</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">
                {{ completionPercentage || 0 }}%
              </div>
              <div class="text-sm text-green-600">Persentase Dokumen telah Dianotasi</div>
            </div>
          </div>
        </Card>

        <div v-if="dashboardAnalytics" class="grid grid-cols-1 gap-8">
          <!-- Tabel List Performance & IAA -->
          <Card variant="glassmorphism" class="p-6 bg-white/90 border border-gray-200 w-full !shadow-none">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl font-bold text-gray-900">Statistik Performa & IAA per Person</h3>
                <p class="text-sm text-gray-500">Ringkasan aktivitas dan kesepakatan nilai Kappa setiap anggota tim.</p>
              </div>
              <Button variant="outline" size="sm" @click="fetchDashboardData" :loading="loadingIAASummary">
                Refresh Data
              </Button>
            </div>

            <div class="overflow-x-auto border rounded-lg bg-white">
              <table class="w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th class="px-6 py-3">Nama Anggota</th>
                    <th class="px-6 py-3 text-center">Progress</th>
                    <th class="px-6 py-3 text-center">IAA VS REVIEWER</th>
                    <th class="px-6 py-3 text-center">IAA VS PEERS (AVG)</th>
                    <th class="px-6 py-3 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="loadingIAASummary">
                    <td colspan="5" class="px-6 py-10 text-center">Memuat data...</td>
                  </tr>
                  <tr v-else-if="iaaPersonSummary.length === 0">
                    <td colspan="5" class="px-6 py-10 text-center text-gray-400">Tidak ada data tersedia</td>
                  </tr>
                  <tr v-for="person in iaaPersonSummary" :key="person.annotator_id" class="border-b hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="font-medium text-gray-900">{{ person.annotator_name }}</div>
                      <div class="text-[10px] text-gray-400 uppercase tracking-tighter">Annotator</div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <template v-if="person.completion_percentage !== null">
                          {{ person.completion_percentage.toFixed(1) }}%
                        </template>
                        <template v-else>
                          N/A
                        </template>
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span v-if="person.iaa_vs_reviewer !== null" :class="person.iaa_vs_reviewer < 0 ? 'text-red-500' : 'text-green-600'" class="font-bold">
                        {{ person.iaa_vs_reviewer.toFixed(2) }}
                      </span>
                      <span v-else class="text-gray-400">N/A</span>
                    </td>
                    <td class="px-6 py-4 text-center text-blue-600 font-bold">
                      <span v-if="person.iaa_vs_peers_avg !== null">
                        {{ person.iaa_vs_peers_avg.toFixed(2) }}
                      </span>
                      <span v-else class="text-gray-400">N/A</span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <Badge :variant="person.status === 'Sudah Direview' ? 'green' : 'gray'" class="text-[10px] uppercase font-bold">
                        {{ person.status }}
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import { ref, computed, onMounted, watch } from "vue";
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
  Building2,
  ShieldCheck,
} from "lucide-vue-next";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { useAuth } from "~/data/auth";
import { useDashboardApi } from "~/data/dashboard";
import { useUsersApi } from "~/data/users";

import { useUserDocumentsApi } from "~/data/user-documents";
import { useProjectsApi } from "~/data/projects";
import { useProjectContext } from "~/composables/project-context";
import type { DocumentStatus } from "~/types/api";

const { user } = useAuth();

// State baru untuk Superadmin
const recentUsersList = ref<any[]>([]);
const { getDashboardSummary, getAnnotatorPerformance, getReviewerPerformance, getInterAnnotatorAgreement, getIAAPersonSummary } =
  useDashboardApi();
const { getAvailableUsersInProject, getMyProjects, getUserRolesInProject } = useUsersApi();
const { getAssignedDocuments } = useUserDocumentsApi();
const { getProjects } = useProjectsApi();

// For project context (used by all users except Kepala Riset)
const { selectedProject, setSelectedProject, clearSelectedProject } = useProjectContext();

const pending = ref(false);

const iaaPersonSummary = ref<any[]>([]);
const loadingIAASummary = ref(false);

const selectedProjectIdLocal = ref<string>("");
const currentSelectedProject = computed(() => {
  if (!selectedProjectIdLocal.value) return null;
  return userProjects.value.find(p => p.id.toString() === selectedProjectIdLocal.value) || null;
});
const userRolesInProject = ref<string[]>([]);
const isLoadingRoles = ref(false);

const isKepalaRiset = computed(() => hasRole("Kepala Riset"));

const kepalaRisetMetrics = computed(() => dashboardAnalytics.value?.kepala_riset_metrics || null);

const totalProjectDocuments = computed(() =>
  kepalaRisetMetrics.value?.total_documents ??
  (dashboardAnalytics.value?.totals?.documents ?? dashboardAnalytics.value?.per_document?.length ?? 0)
);

const annotatedDocumentsCount = computed(() =>
  kepalaRisetMetrics.value?.annotated_documents ??
  (dashboardAnalytics.value?.per_document || []).filter(
    (doc: any) => doc.annotations_count > 0
  ).length
);

const reviewedDocumentsCount = computed(() =>
  kepalaRisetMetrics.value?.total_reviewed_annotations ??
  (dashboardAnalytics.value?.per_document || []).filter(
    (doc: any) => (doc as any).reviews_count > 0
  ).length
);

const completionPercentage = computed(() =>
  kepalaRisetMetrics.value?.completion_percentage ??
  (totalProjectDocuments.value > 0
    ? Math.round((reviewedDocumentsCount.value / totalProjectDocuments.value) * 100)
    : 0)
);

const annotationPercent = computed(() =>
  totalProjectDocuments.value > 0
    ? Math.round((annotatedDocumentsCount.value / totalProjectDocuments.value) * 100)
    : 0
);

const reviewPercent = computed(() =>
  totalProjectDocuments.value > 0
    ? Math.round((reviewedDocumentsCount.value / totalProjectDocuments.value) * 100)
    : 0
);

const cohenKappaPercentage = computed(() =>
  dashboardAnalytics.value?.inter_annotator_agreement?.cohen_kappa_avg != null
    ? ((dashboardAnalytics.value.inter_annotator_agreement.cohen_kappa_avg || 0) * 100).toFixed(1)
    : "0.0"
);

const agreementSpans = computed(() => ({
  matching: dashboardAnalytics.value?.inter_annotator_agreement?.matching_unique_span_count ?? 0,
  total: dashboardAnalytics.value?.inter_annotator_agreement?.total_unique_span_count ?? 0,
}));

const projectStatus = computed(() => {
  if (totalProjectDocuments.value === 0) return "Belum dikerjakan";
  if (completionPercentage.value === 100) return "Selesai";
  return "Masih dalam pengerjaan";
});

const fetchIAAPersonSummary = async () => {
  loadingIAASummary.value = true;
  try {
    const params: any = {};
    if (selectedProjectIdLocal.value) {
      params.project_id = selectedProjectIdLocal.value;
    }
    const res = await getIAAPersonSummary(params);
    iaaPersonSummary.value = res.summary || [];
  } catch (error) {
    console.error("Gagal memuat ringkasan IAA:", error);
  } finally {
    loadingIAASummary.value = false;
  }
};

const PROJECT_PAGE_SIZE = 3;
const projectPage = ref(0);

const totalProjectPages = computed(() =>
  Math.max(1, Math.ceil((userProjects.value?.length || 0) / PROJECT_PAGE_SIZE))
);

const pagedProjects = computed(() => {
  if (!userProjects.value) return [];
  const start = projectPage.value * PROJECT_PAGE_SIZE;
  return userProjects.value.slice(start, start + PROJECT_PAGE_SIZE);
});

const canPreviousPage = computed(() => projectPage.value > 0);
const canNextPage = computed(
  () => projectPage.value + 1 < totalProjectPages.value
);

const goToPreviousPage = () => {
  if (canPreviousPage.value) {
    projectPage.value -= 1;
  }
};

const goToNextPage = () => {
  if (canNextPage.value) {
    projectPage.value += 1;
  }
};

const dashboardAnalytics = ref<any>(null);

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

const hasRole = (role: string) => user.value?.roles?.includes(role) || false;

// Handle project change
const onProjectChange = async (projectId: string) => {
  if (!projectId) {
    clearSelectedProject();
    userRolesInProject.value = [];
    return;
  }

  const project = userProjects.value.find(p => p.id.toString() === projectId);
  if (project) {
    setSelectedProject(project);

    if (hasRole("Kepala Riset")) {
      selectedProjectIdLocal.value = projectId;
      // Keep selected project visible in paginated sidebar
      const selectedIndex = userProjects.value.findIndex((p: any) => p.id === project.id);
      if (selectedIndex >= 0) {
        projectPage.value = Math.floor(selectedIndex / PROJECT_PAGE_SIZE);
      }
      await fetchDashboardData();
      await loadUsersForPerformance();
      await fetchIAAPersonSummary();
    } else {
      await loadUserRolesInProject(projectId);
    }
  }
};

// Load user's roles in the selected project
const loadUserRolesInProject = async (projectId: string) => {
  if (!user.value?.id) return;

  isLoadingRoles.value = true;
  try {
    const response = await getUserRolesInProject(user.value.id, parseInt(projectId));
    userRolesInProject.value = response.roles || [];
  } catch (error) {
    console.error("Error loading user roles in project:", error);
    userRolesInProject.value = [];
  } finally {
    isLoadingRoles.value = false;
  }
};

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

const annotatorStats = ref({
  assignedDocuments: 0,
  completedDocuments: 0,
  inProgressDocuments: 0,
});

const reviewerStats = ref({
  pendingReviews: 0,
  completedReviews: 0,
  inProgressDocuments: 0,
  errorsFound: 0,
  todayReviewed: 0,
  accuracy: 0,
});

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
  status: DocumentStatus;
}

const recentTasks = ref<Task[]>([]);


const recentReviewedDocs = ref<any[]>([]);

// Dashboard analytics
const showPerformanceSection = ref(false);
const userProjects = ref<any[]>([]);
const isLoadingProjects = ref(false);

// Performance tracking
const selectedAnnotator = ref<string>("");
const selectedReviewer = ref<string>("");
const loadingAnnotator = ref(false);
const loadingReviewer = ref(false);
const loadingIAA = ref(false);
const annotators = ref<any[]>([]);
const reviewers = ref<any[]>([]);
const annotatorPerformance = ref<any>(null);
const reviewerPerformance = ref<any>(null);
const iaaResult = ref<any>(null);
const iaaError = ref<string>("");

// Helper functions
const getTaskStatusColor = (status: DocumentStatus | string) => {
  const colorMap: Record<
    string,
    "blue" | "yellow" | "green" | "purple" | "orange" | "gray"
  > = {
    // Document statuses
    belum_dianotasi: "gray",
    sedang_dianotasi: "yellow",
    sudah_dianotasi: "blue",
    belum_direview: "purple",
    sedang_direview: "orange",
    sudah_direview: "green",
  };
  return colorMap[status] || "gray";
};

const formatStatus = (status: DocumentStatus | string) => {
  const statusMap: Record<string, string> = {
    // Document statuses
    belum_dianotasi: "Belum Dianotasi",
    sedang_dianotasi: "Sedang Dianotasi",
    sudah_dianotasi: "Sudah Dianotasi",
    belum_direview: "Belum Direview",
    sedang_direview: "Sedang Direview",
    sudah_direview: "Sudah Direview",
  };
  return statusMap[status.toLowerCase()] || status;
};

const getContribution = (userId: string) => {
  if (!dashboardAnalytics.value?.per_annotator) return 0;
  const found = dashboardAnalytics.value.per_annotator.find(
    (a: any) => a.annotator__id === userId
  );
  return found ? found.num_annotations : 0;
};

// Date formatting function
const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Page meta
useHead({
  title: "Anota",
  meta: [{ name: "description", content: "Halaman beranda aplikasi ANOTA." }],
});

onMounted(async () => {
  pending.value = true;
  await fetchUserProjects();
  try {
    await fetchDashboardData();
    await loadUsersForPerformance();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    pending.value = false;
  }
});

const fetchDashboardData = async () => {
  try {
    // Admin: Use project-specific data only, no dashboard API
    if (hasRole("Admin")) {
      try {
        const assignedDocs = await getAssignedDocuments();
        adminStats.value = [
          {
            label: "Dokumen Ditugaskan",
            value: assignedDocs.count || 0,
            icon: "document-text",
            color: "text-blue-400",
            description: "Dokumen dalam project Anda",
          },
          {
            label: "Dokumen Upload",
            value: assignedDocs.results?.length || 0,
            icon: "document-text",
            color: "text-green-400",
            description: "Dokumen yang telah diupload",
          },
          {
            label: "Tugas Aktif",
            value: assignedDocs.results?.filter((doc: any) =>
              doc.status === "sedang_dianotasi" || doc.status === "sedang_direview"
            ).length || 0,
            icon: "clipboard-document-list",
            color: "text-orange-400",
            description: "Tugas sedang dikerjakan",
          },
          {
            label: "Total Selesai",
            value: assignedDocs.results?.filter((doc: any) =>
              doc.status === "sudah_direview"
            ).length || 0,
            icon: "check-circle",
            color: "text-green-400",
            description: "Dokumen yang telah selesai",
          },
        ];
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      };
    if (hasRole("Kepala Riset")) {
      await fetchIAAPersonSummary();
    }
    return;
    }

    // For other roles (Kepala Riset, Annotator, Reviewer), fetch dashboard data
    const params: any = {};
    if (hasRole("Kepala Riset") && selectedProjectIdLocal.value) {
      params.project_id = selectedProjectIdLocal.value;
    }
    const dashboardData = await getDashboardSummary(params);

    dashboardAnalytics.value = dashboardData;

    if (hasRole("Annotator") && user.value?.id) {
      const assignedDocs = await getAssignedDocuments();

      const docResults = assignedDocs.results || [];
      const completedDocs = docResults.filter(
        (doc: any) =>
          doc.status === "sudah_dianotasi" || doc.status === "sudah_direview"
      );
      const inProgressDocs = docResults.filter(
        (doc: any) =>
          doc.status === "sedang_dianotasi" || doc.status === "sedang_direview"
      );

      annotatorStats.value = {
        assignedDocuments: assignedDocs.count || 0,
        completedDocuments: completedDocs.length,
        inProgressDocuments: inProgressDocs.length,
      };

      recentTasks.value =
        assignedDocs.results?.slice(0, 3).map((doc: any, index: number) => ({
          id: doc.id.toString(),
          title: doc.title || `Dokumen ${doc.id}`,
          sentences: doc.jumlah_sentence || doc.sentence_count || 0,
          status: (doc.status as DocumentStatus) || "belum_dianotasi",
        })) || [];
    }

    if (hasRole("Reviewer") && user.value?.id) {
      const assignedDocs = await getAssignedDocuments();
      const docResults = assignedDocs.results || [];
      const completedDocs = docResults.filter(
        (doc: any) => doc.status === "sudah_direview"
      );
      const inProgressDocs = docResults.filter(
        (doc: any) => doc.status === "sedang_direview"
      );
      const pendingDocs = docResults.filter(
        (doc: any) => doc.status === "belum_direview"
      );

      reviewerStats.value = {
        pendingReviews: pendingDocs.length,
        completedReviews: completedDocs.length,
        inProgressDocuments: inProgressDocs.length,
        errorsFound: 0,
        todayReviewed: 0,
        accuracy: 0,
      };

      recentReviewedDocs.value =
        completedDocs.slice(0, 5).map((doc: any) => ({
          id: doc.id.toString(),
          title: doc.title || `Dokumen ${doc.id}`,
          created_at: doc.created_at,
          status: doc.status,
        })) || [];
    }

    if (hasRole("Kepala Riset")) {
      researchStats.value = [
        {
          label: "Dokumen Anotasi Selesai",
          value: annotatedDocumentsCount.value,
          icon: "pencil",
          color: "text-blue-400",
          description: `(${annotationPercent.value}% dari ${totalProjectDocuments.value})`,
        },
        {
          label: "Dokumen Review Selesai",
          value: reviewedDocumentsCount.value,
          icon: "check-circle",
          color: "text-green-400",
          description: `(${reviewPercent.value}% dari ${totalProjectDocuments.value})`,
        },
        {
          label: "Total Dokumen Proyek",
          value: totalProjectDocuments.value,
          icon: "arrow-down-tray",
          color: "text-purple-400",
          description: "Jumlah dokumen dalam proyek",
        },
        {
          label: "Tingkat Penyelesaian",
          value: `${completionPercentage.value}%`,
          icon: "user-group",
          color: "text-orange-400",
          description: "Persentase penyelesaian proyek saat ini",
        },
      ];
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
};

const loadUsersForPerformance = async () => {
  try {
    const allUsersMap = new Map<string, any>();

    for (const project of userProjects.value) {
      try {
        const response = await getAvailableUsersInProject(project.id);
        const projectUsers = response.users || [];
        projectUsers.forEach((user: any) => allUsersMap.set(user.username, user));
      } catch (error) {
        console.error(`Error fetching users for project ${project.id}:`, error);
      }
    }

    const allUsers = Array.from(allUsersMap.values());

    annotators.value = allUsers.filter((user: any) =>
      user.roles_in_project?.includes("Annotator")
    );
    reviewers.value = allUsers.filter((user: any) =>
      user.roles_in_project?.includes("Reviewer")
    );
  } catch (error) {
    console.error("Error loading users:", error);
  }
};


async function fetchUserProjects() {
  isLoadingProjects.value = true;
  try {
    if (hasRole("Kepala Riset")) {
      const response = await getProjects();
      userProjects.value = response.results || [];

      if (userProjects.value.length > 0) {
        projectPage.value = 0;
        const activeProject = userProjects.value[0];
        setSelectedProject(activeProject);
        selectedProjectIdLocal.value = activeProject.id.toString();
      }
    } else {
      const response = await getMyProjects();
      userProjects.value = response.projects || [];

      if (userProjects.value.length > 0) {
        if (selectedProject.value) {
          selectedProjectIdLocal.value = selectedProject.value.id.toString();
          await loadUserRolesInProject(selectedProject.value.id.toString());
        } else {
          const firstProject = userProjects.value[0];
          selectedProjectIdLocal.value = firstProject.id.toString();
          setSelectedProject(firstProject);
          await loadUserRolesInProject(firstProject.id.toString());
        }
      }
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
  } finally {
    isLoadingProjects.value = false;
  }
}

onMounted(async () => {
  pending.value = true;
  await fetchUserProjects();
  try {
    await fetchDashboardData();
    await loadUsersForPerformance();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    pending.value = false;
  }
});
</script>
