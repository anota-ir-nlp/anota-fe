<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter bg-gray-50">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard Analytics</h1>
        <p class="text-gray-600">
          Monitor performance metrics, inter-annotator agreement, dan statistik sistem
        </p>
      </div>

      <!-- Filters -->
      <Card class="mb-8 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Filter Data</h2>
        <div class="space-y-6">
          <!-- Project Selection (Kepala Riset Only) -->
          <div v-if="isKepalaRiset">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              <Building2 class="w-4 h-4 inline mr-1" />
              Pilih Project Context
            </label>
            <Select :model-value="localSelectedProject?.id?.toString() || ''" @update:model-value="handleProjectChange">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Pilih project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="project in projects"
                  :key="project.id"
                  :value="project.id.toString()"
                >
                  {{ project.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <p class="text-xs text-gray-500 mt-2">
              Pilih project untuk memfilter data dashboard.
            </p>
          </div>

          <!-- Project Indicator (Admin Only) -->
          <div v-if="isAdmin && globalSelectedProject" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-blue-800">
              <Building2 class="w-4 h-4 inline mr-1" />
              <strong>Project Context:</strong>
              <span class="text-blue-600">{{ globalSelectedProject.name }}</span>
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Data dashboard menampilkan informasi dari project Anda.
            </p>
          </div>

          <!-- Warning when Kepala Riset has no project selected -->
          <div v-if="isKepalaRiset && !localSelectedProject" class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-sm text-yellow-800 font-medium">
              ⚠️ Silakan pilih project terlebih dahulu untuk melihat data dashboard.
            </p>
          </div>

          <!-- Document Selection DataTable -->
          <div v-if="(isKepalaRiset && localSelectedProject) || (isAdmin && globalSelectedProject)">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Pilih Dokumen untuk Analisis
            </label>

            <!-- Selection Summary -->
            <div v-if="selectedDocumentDetails" class="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-sm text-blue-800">
                <strong>Dokumen dipilih:</strong>
                <span class="text-blue-600">{{ selectedDocumentDetails.title }}</span>
              </p>
              <button
                @click="clearDocumentSelection"
                class="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
              >
                Batalkan pilihan (tampilkan semua)
              </button>
            </div>
            <div v-else class="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p class="text-sm text-gray-600">
                Tidak ada dokumen dipilih - menampilkan data dari semua dokumen
              </p>
            </div>

            <div class="border rounded-lg p-4 bg-white">
              <div v-if="loadingDocuments" class="flex justify-center items-center py-8">
                <div class="text-gray-500">Memuat dokumen...</div>
              </div>
              <div v-else-if="documents.length === 0" class="text-center py-8">
                <div class="text-gray-500">
                  Tidak ada dokumen tersedia
                </div>
              </div>
              <DataTable
                v-else
                :columns="documentColumns"
                :data="documents"
              />
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Pilih satu dokumen untuk memfilter analisis. Gunakan tombol radio untuk memilih.
            </p>
          </div>
        </div>
        <div class="mt-4" v-if="(isKepalaRiset && localSelectedProject) || (isAdmin && globalSelectedProject)">
          <Button @click="loadDashboardData" :loading="loading">
            Refresh Data
          </Button>
        </div>
      </Card>

      <!-- Summary Stats -->
      <div v-if="(isKepalaRiset && localSelectedProject) || (isAdmin && globalSelectedProject)" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Dokumen Beranotasi</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ dashboardData?.per_document?.length || 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Total Anotasi</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ dashboardData?.totals?.annotations || 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Pencil class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Total Review</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ dashboardData?.totals?.reviews || 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Inter-Annotator Agreement</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ ((dashboardData?.inter_annotator_agreement?.cohen_kappa_avg || 0) * 100).toFixed(1) }}%
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ dashboardData?.inter_annotator_agreement?.matching_unique_span_count || 0 }}/{{ dashboardData?.inter_annotator_agreement?.total_unique_span_count || 0 }} spans match
              </p>
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <BarChart3 class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      <!-- Charts and Analytics -->
      <div v-if="(isKepalaRiset && localSelectedProject) || (isAdmin && globalSelectedProject)" class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Annotations by Annotator -->
        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Distribusi Anotasi per Anotator
          </h3>
          <div v-if="dashboardData?.per_annotator?.length" class="space-y-3">
            <div
              v-for="item in dashboardData.per_annotator"
              :key="item.annotator__id"
              class="flex items-center justify-between"
            >
              <span class="text-sm text-gray-600">{{ item.annotator__username }}</span>
              <div class="flex items-center gap-2">
                <div class="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-blue-600 h-2 rounded-full"
                    :style="{ width: `${(item.num_annotations / Math.max(...dashboardData.per_annotator.map(i => i.num_annotations))) * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 w-8">{{ item.num_annotations }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-8">
            Tidak ada data anotasi
          </div>
        </Card>

        <!-- Reviews by Reviewer -->
        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Distribusi Review per Reviewer
          </h3>
          <div v-if="dashboardData?.per_reviewer?.length" class="space-y-3">
            <div
              v-for="item in dashboardData.per_reviewer"
              :key="item.reviewer__id"
              class="flex items-center justify-between"
            >
              <span class="text-sm text-gray-600">{{ item.reviewer__username }}</span>
              <div class="flex items-center gap-2">
                <div class="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-purple-600 h-2 rounded-full"
                    :style="{ width: `${(item.num_reviews / Math.max(...dashboardData.per_reviewer.map(i => i.num_reviews))) * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 w-8">{{ item.num_reviews }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-8">
            Tidak ada data review
          </div>
        </Card>
      </div>

      <!-- User Performance Section -->
      <div v-if="(isKepalaRiset && localSelectedProject) || (isAdmin && globalSelectedProject)" class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Annotator Performance -->
        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Performance Anotator
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Pilih Anotator
              </label>
              <Select v-model="selectedAnnotator">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih anotator..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="user in annotators"
                    :key="user.id"
                    :value="user.id"
                  >
                    {{ user.full_name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              @click="loadAnnotatorPerformance"
              :loading="loadingAnnotator"
              :disabled="!selectedAnnotator"
            >
              Load Performance
            </Button>
            <div v-if="annotatorPerformance" class="space-y-2 pt-4 border-t">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Total Anotasi:</span>
                <span class="font-medium">{{ annotatorPerformance.totals.annotations }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Dokumen yang Dikerjakan:</span>
                <span class="font-medium">{{ annotatorPerformance.per_document.length }}</span>
              </div>
              <div v-if="annotatorPerformance.per_document.length > 0" class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Per Dokumen:</h4>
                <div class="space-y-2 max-h-32 overflow-y-auto">
                  <div
                    v-for="doc in annotatorPerformance.per_document"
                    :key="doc.document__id"
                    class="flex justify-between text-sm p-2 bg-gray-50 rounded"
                  >
                    <span class="text-gray-600">{{ doc.document__title }}</span>
                    <span class="font-medium text-blue-600">{{ doc.annotations_count }} anotasi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <!-- Reviewer Performance -->
        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Performance Reviewer
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Pilih Reviewer
              </label>
              <Select v-model="selectedReviewer">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih reviewer..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="user in reviewers"
                    :key="user.id"
                    :value="user.id"
                  >
                    {{ user.full_name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              @click="loadReviewerPerformance"
              :loading="loadingReviewer"
              :disabled="!selectedReviewer"
            >
              Load Performance
            </Button>
            <div v-if="reviewerPerformance" class="space-y-2 pt-4 border-t">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Total Review:</span>
                <span class="font-medium">{{ reviewerPerformance.totals.reviews }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Dokumen yang Dikerjakan:</span>
                <span class="font-medium">{{ reviewerPerformance.per_document.length }}</span>
              </div>
              <div v-if="reviewerPerformance.per_document.length > 0" class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Per Dokumen:</h4>
                <div class="space-y-2 max-h-32 overflow-y-auto">
                  <div
                    v-for="doc in reviewerPerformance.per_document"
                    :key="doc.document__id"
                    class="flex justify-between text-sm p-2 bg-gray-50 rounded"
                  >
                    <span class="text-gray-600">{{ doc.document__title }}</span>
                    <span class="font-medium text-green-600">{{ doc.reviews_count }} review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Inter-Annotator Agreement -->
      <!-- Inter-Annotator Agreement Table (Automated List) -->
      <Card v-if="(isKepalaRiset && localSelectedProject) || (isAdmin && globalSelectedProject)" class="p-6">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              Inter-Annotator Agreement (IAA) per Person
            </h3>
            <p class="text-sm text-gray-500">
              Ringkasan kesepakatan nilai Kappa secara otomatis untuk setiap annotator.
            </p>
          </div>
          <Button variant="outline" size="sm" @click="loadDashboardData" :loading="loadingIAASummary">
            Reload IAA
          </Button>
        </div>

        <div class="overflow-x-auto border rounded-lg">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th class="px-6 py-3">Nama Annotator</th>
                <th class="px-6 py-3 text-center">IAA vs Reviewer</th>
                <th class="px-6 py-3 text-center">IAA vs Peers (Avg)</th>
                <th class="px-6 py-3 text-center">Status</th>
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
        
        <div class="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-700 flex gap-2">
          <ClipboardList class="w-4 h-4" />
          <p>
            <strong>Note:</strong> Nilai yang ditampilkan adalah <i>Cohen's Kappa</i>. 
            N/A muncul jika annotator belum memiliki pasangan reviewer atau tidak ada annotator lain di dokumen yang sama.
          </p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { FileText, Pencil, BarChart3, ClipboardList, Building2 } from "lucide-vue-next";
import DataTable from "~/components/ui/data-table/data-table.vue";
import { createDocumentColumns } from "~/components/dashboard/columns";
import { useDashboardApi } from "~/data/dashboard";
import { useProjectsApi } from "~/data/projects";
import { useDocumentsApi } from "~/data/documents";
import { useUsersApi } from "~/data/users";
import { useAuth } from "~/data/auth";
import { useProjectContext } from "~/composables/project-context";
import { toast } from "vue-sonner";
import type {
  DashboardSummaryResponse,
  AnnotatorPerformanceResponse,
  ReviewerPerformanceResponse,
  IAAResponse
} from "~/data/dashboard";
import type { ProjectResponse, DocumentResponse, UserResponse, DocumentStatus } from "~/types/api";

const { getDashboardSummary, getAnnotatorPerformance, getReviewerPerformance, getInterAnnotatorAgreement, getIAAPersonSummary } = useDashboardApi();
const { getProjects, getDocumentsInProject } = useProjectsApi();
const { getDocuments } = useDocumentsApi();
const { getAvailableUsersInProject, getMyProjects } = useUsersApi();
const { userRoles } = useAuth();

// For Kepala Riset: local project context (dashboard-only)
const localSelectedProject = ref<ProjectResponse | null>(null);
const localSelectedProjectId = computed(() => localSelectedProject.value?.id || null);

// For Admin: use global project context
const { selectedProject: globalSelectedProject, selectedProjectId: globalSelectedProjectId } = useProjectContext();

const loading = ref(false);
const loadingAnnotator = ref(false);
const loadingReviewer = ref(false);
const loadingIAA = ref(false);
const loadingDocuments = ref(false);

const selectedDocument = ref<string>("all");
const selectedAnnotator = ref<string>("");
const selectedReviewer = ref<string>("");
const iaaAnnotator = ref<string>("");
const iaaReviewer = ref<string>("");

const projects = ref<ProjectResponse[]>([]);
const documents = ref<DocumentResponse[]>([]);
const users = ref<UserResponse[]>([]);

const dashboardData = ref<DashboardSummaryResponse | null>(null);
const annotatorPerformance = ref<AnnotatorPerformanceResponse | null>(null);
const reviewerPerformance = ref<ReviewerPerformanceResponse | null>(null);
const iaaData = ref<IAAResponse | null>(null);
const iaaPersonSummary = ref<IAAPersonSummary[]>([]);
const loadingIAASummary = ref(false);

const annotators = computed(() => users.value.filter((u: UserResponse) => u.roles.includes("Annotator")));
const reviewers = computed(() => users.value.filter((u: UserResponse) => u.roles.includes("Reviewer")));

const isKepalaRiset = computed(() => userRoles.value.includes("Kepala Riset"));
const isAdmin = computed(() => userRoles.value.includes("Admin"));

const activeProjectId = computed(() => {
  if (isKepalaRiset.value) {
    return localSelectedProjectId.value;
  } else if (isAdmin.value) {
    return globalSelectedProjectId.value;
  }
  return null;
});

const documentColumns = computed(() =>
  createDocumentColumns(selectedDocument.value, handleDocumentSelect)
);

function handleDocumentSelect(documentId: string) {
  selectedDocument.value = documentId;
  loadDashboardData();
}

function clearDocumentSelection() {
  selectedDocument.value = "all";
  loadDashboardData();
}

const selectedDocumentDetails = computed(() => {
  if (selectedDocument.value === "all") return null;
  return documents.value.find((doc: DocumentResponse) => doc.id.toString() === selectedDocument.value) || null;
});

async function loadDashboardData() {
  loading.value = true;
  loadingIAASummary.value = true; // Set loading table
  try {
    const params: any = {};
    if (activeProjectId.value) params.project_id = activeProjectId.value;
    if (selectedDocument.value !== "all") params.document_id = parseInt(selectedDocument.value);

    // Load data summary utama
    dashboardData.value = await getDashboardSummary(params);
    
    // Load data IAA per orang secara otomatis
    const res = await getIAAPersonSummary(params);
    iaaPersonSummary.value = res.summary;
  } catch (error) {
    toast.error("Gagal memuat data dashboard");
  } finally {
    loading.value = false;
    loadingIAASummary.value = false;
  }
}

async function loadAnnotatorPerformance() {
  if (!selectedAnnotator.value) return;

  loadingAnnotator.value = true;
  try {
    const params: any = { user_id: selectedAnnotator.value };

    if (activeProjectId.value) {
      params.project_id = activeProjectId.value;
    }

    if (selectedDocument.value !== "all") {
      params.document_id = parseInt(selectedDocument.value);
    }

    annotatorPerformance.value = await getAnnotatorPerformance(params);
  } catch (error) {
    toast.error("Gagal memuat performance anotator");
    console.error(error);
  } finally {
    loadingAnnotator.value = false;
  }
}

async function loadReviewerPerformance() {
  if (!selectedReviewer.value) return;

  loadingReviewer.value = true;
  try {
    const params: any = { user_id: selectedReviewer.value };

    if (activeProjectId.value) {
      params.project_id = activeProjectId.value;
    }

    if (selectedDocument.value !== "all") {
      params.document_id = parseInt(selectedDocument.value);
    }

    reviewerPerformance.value = await getReviewerPerformance(params);
  } catch (error) {
    toast.error("Gagal memuat performance reviewer");
    console.error(error);
  } finally {
    loadingReviewer.value = false;
  }
}

async function loadIAA() {
  if (!iaaAnnotator.value || !iaaReviewer.value) return;

  loadingIAA.value = true;
  iaaData.value = null;

  try {
    const params: any = {
      annotator_id: iaaAnnotator.value,
      reviewer_id: iaaReviewer.value
    };

    if (activeProjectId.value) {
      params.project_id = activeProjectId.value;
    }

    if (selectedDocument.value !== "all") {
      params.document_id = parseInt(selectedDocument.value);
    }

    iaaData.value = await getInterAnnotatorAgreement(params);

    if (iaaData?.value?.error_code === "NO_DATA_AVAILABLE" || iaaData?.value?.detail?.includes("Tidak ada data")) {
      toast.warning("Tidak ada data anotasi atau review untuk perbandingan antara anotator dan reviewer yang dipilih.", {
        duration: 5000,
      });
    } else {
      toast.success("Inter-Annotator Agreement berhasil dihitung");
    }
  } catch (error: any) {
    console.error("IAA Error:", error);
    console.error("IAA Error Response:", error?.response || error?.data);
  } finally {
    loadingIAA.value = false;
  }
}

async function loadInitialData() {
  try {
    if (isKepalaRiset.value) {
      const projectsRes = await getProjects();
      projects.value = projectsRes.results || [];

      if (projects.value.length > 0) {
        localSelectedProject.value = projects.value[0];
      }
    } else if (isAdmin.value) {
      const myProjectsRes = await getMyProjects();
      projects.value = myProjectsRes.results || [];
    }
    await fetchDocuments();
    await fetchUsers();

    await loadDashboardData();
  } catch (error) {
    toast.error("Gagal memuat data awal");
    console.error(error);
  }
}

async function fetchUsers() {
  try {
    const allUsers: UserResponse[] = [];

    if (isKepalaRiset.value && localSelectedProject.value) {
      // Kepala Riset with project selected: fetch users from that project
      const projectUsers = await getAvailableUsersInProject(localSelectedProject.value.id);
      // Map the users to include roles from roles_in_project
      projectUsers.users.forEach((user: any) => {
        if (user.is_in_project) {
          allUsers.push({
            id: user.id,
            username: user.username,
            email: user.email || `${user.username}@example.com`, // fallback email
            full_name: user.full_name,
            roles: user.roles_in_project || [],
            is_active: true,
            date_joined: '',
            last_login: null,
          } as UserResponse);
        }
      });
    } else if (isAdmin.value && globalSelectedProject.value) {
      // Admin: fetch users from their assigned project
      const projectUsers = await getAvailableUsersInProject(globalSelectedProject.value.id);
      // Map the users to include roles from roles_in_project
      projectUsers.users.forEach((user: any) => {
        if (user.is_in_project) {
          allUsers.push({
            id: user.id,
            username: user.username,
            email: user.email || `${user.username}@example.com`, // fallback email
            full_name: user.full_name,
            roles: user.roles_in_project || [],
            is_active: true,
            date_joined: '',
            last_login: null,
          } as UserResponse);
        }
      });
    }

    users.value = allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Gagal memuat data pengguna");
  }
}

// Document fetching logic based on role and project context
async function fetchDocuments() {
  loadingDocuments.value = true;
  try {
    if (isKepalaRiset.value && localSelectedProject.value) {
      // Kepala Riset with project selected: fetch documents from that project
      const response = await getDocumentsInProject(localSelectedProject.value.id);
      documents.value = response || [];
    } else if (isAdmin.value && globalSelectedProject.value) {
      // Admin: fetch documents from their assigned project
      const response = await getDocumentsInProject(globalSelectedProject.value.id);
      documents.value = response || [];
    }
  } catch (error) {
    console.error("Error fetching documents:", error);
    toast.error("Gagal memuat data dokumen");
    documents.value = [];
  } finally {
    loadingDocuments.value = false;
  }
}

// Handle local project selection for Kepala Riset
async function handleProjectChange(projectId: string) {
  const project = projects.value.find((p: ProjectResponse) => p.id.toString() === projectId);
  localSelectedProject.value = project || null;

  // Clear selected users and performance data when project changes
  selectedAnnotator.value = "";
  selectedReviewer.value = "";
  iaaAnnotator.value = "";
  iaaReviewer.value = "";
  annotatorPerformance.value = null;
  reviewerPerformance.value = null;
  iaaData.value = null;

  // Reload data when project changes
  await fetchDocuments();
  await fetchUsers();
  await loadDashboardData();
}

onMounted(() => {
  loadInitialData();
});

// Watch for project context changes (only for Admin using global context)
watch(globalSelectedProject, async () => {
  if (isAdmin.value) {
    // Clear selected users and performance data when project changes
    selectedAnnotator.value = "";
    selectedReviewer.value = "";
    iaaAnnotator.value = "";
    iaaReviewer.value = "";
    annotatorPerformance.value = null;
    reviewerPerformance.value = null;
    iaaData.value = null;

    await fetchDocuments();
    await fetchUsers();
    await loadDashboardData();
  }
});

// Define layout
definePageMeta({
  layout: "default",
});
</script>
