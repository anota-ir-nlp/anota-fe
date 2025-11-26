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
                    :key="doc.document_id"
                    class="flex justify-between text-sm p-2 bg-gray-50 rounded"
                  >
                    <span class="text-gray-600">{{ doc.document_title }}</span>
                    <span class="font-medium text-green-600">{{ doc.reviews }} review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- Inter-Annotator Agreement -->
      <Card v-if="(isKepalaRiset && localSelectedProject) || (isAdmin && globalSelectedProject)" class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Inter-Annotator Agreement (IAA)
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Anotator
            </label>
            <Select v-model="iaaAnnotator">
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
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Reviewer
            </label>
            <Select v-model="iaaReviewer">
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
        </div>
        <Button
          @click="loadIAA"
          :loading="loadingIAA"
          :disabled="!iaaAnnotator || !iaaReviewer"
        >
          Calculate IAA
        </Button>

        <div v-if="iaaData && iaaData.participants && iaaData.results" class="mt-6 space-y-4">
          <!-- Participants Info -->
          <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 class="font-medium text-blue-900 mb-2">Participants</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-blue-700"><strong>Annotator:</strong> {{ iaaData.participants?.annotator_name || 'N/A' }}</p>
                <p class="text-blue-600 text-xs">{{ iaaData.participants?.annotator_id || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-blue-700"><strong>Reviewer:</strong> {{ iaaData.participants?.reviewer_name || 'N/A' }}</p>
                <p class="text-blue-600 text-xs">{{ iaaData.participants?.reviewer_id || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Main Results -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-gray-600">Cohen's Kappa</p>
              <p class="text-2xl font-bold text-blue-600">
                {{ ((iaaData.results?.cohen_kappa || 0) * 100).toFixed(1) }}%
              </p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-gray-600">Accuracy</p>
              <p class="text-2xl font-bold text-green-600">
                {{ ((iaaData.results?.accuracy || 0) * 100).toFixed(1) }}%
              </p>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <p class="text-sm text-gray-600">Span Agreement</p>
              <p class="text-2xl font-bold text-purple-600">
                {{ ((iaaData.results?.span_agreement_ratio || 0) * 100).toFixed(1) }}%
              </p>
            </div>
            <div class="text-center p-4 bg-orange-50 rounded-lg">
              <p class="text-sm text-gray-600">Total Items</p>
              <p class="text-2xl font-bold text-orange-600">
                {{ iaaData.results?.total_items || 0 }}
              </p>
            </div>
          </div>

          <!-- Additional Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">Correct Items</p>
              <p class="text-xl font-bold text-gray-700">{{ iaaData.results?.correct_items || 0 }}</p>
            </div>
            <div class="text-center p-4 bg-indigo-50 rounded-lg">
              <p class="text-sm text-gray-600">Total Unique Spans</p>
              <p class="text-xl font-bold text-indigo-600">{{ iaaData.results?.total_unique_spans || 0 }}</p>
            </div>
            <div class="text-center p-4 bg-emerald-50 rounded-lg">
              <p class="text-sm text-gray-600">Matching Spans</p>
              <p class="text-xl font-bold text-emerald-600">{{ iaaData.results?.matching_spans || 0 }}</p>
            </div>
          </div>

          <!-- Detailed Analysis -->
          <div class="mt-6">
            <h4 class="font-medium text-gray-900 mb-4">Detailed Analysis</h4>

            <!-- Confusion Matrix -->
            <div v-if="iaaData.detailed_analysis?.confusion_like" class="mb-4">
              <h5 class="text-sm font-medium text-gray-700 mb-2">Agreement Breakdown</h5>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div class="text-center p-3 bg-gray-50 rounded">
                  <p class="text-xs text-gray-600">Agree No Annotation</p>
                  <p class="text-lg font-bold text-gray-900">{{ iaaData.detailed_analysis?.confusion_like?.agree_no_annotation || 0 }}</p>
                </div>
                <div class="text-center p-3 bg-green-50 rounded">
                  <p class="text-xs text-gray-600">Agree Error Type</p>
                  <p class="text-lg font-bold text-green-600">{{ iaaData.detailed_analysis?.confusion_like?.agree_error_type || 0 }}</p>
                </div>
                <div class="text-center p-3 bg-yellow-50 rounded">
                  <p class="text-xs text-gray-600">Disagree Presence</p>
                  <p class="text-lg font-bold text-yellow-600">{{ iaaData.detailed_analysis?.confusion_like?.disagree_presence || 0 }}</p>
                </div>
                <div class="text-center p-3 bg-red-50 rounded">
                  <p class="text-xs text-gray-600">Disagree Error Type</p>
                  <p class="text-lg font-bold text-red-600">{{ iaaData.detailed_analysis?.confusion_like?.disagree_error_type || 0 }}</p>
                </div>
              </div>
            </div>

            <!-- Span Analysis -->
            <div v-if="iaaData.detailed_analysis" class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 border rounded-lg">
                <h6 class="text-sm font-medium text-gray-700 mb-2">Perfect Agreement Spans</h6>
                <p class="text-2xl font-bold text-green-600">{{ iaaData.detailed_analysis?.perfect_agreement_spans?.length || 0 }}</p>
                <p class="text-xs text-gray-500">Both annotated same spans</p>
              </div>
              <div class="p-4 border rounded-lg">
                <h6 class="text-sm font-medium text-gray-700 mb-2">Annotator Only Spans</h6>
                <p class="text-2xl font-bold text-blue-600">{{ iaaData.detailed_analysis?.annotator_only_spans?.length || 0 }}</p>
                <p class="text-xs text-gray-500">Only annotator marked</p>
              </div>
              <div class="p-4 border rounded-lg">
                <h6 class="text-sm font-medium text-gray-700 mb-2">Reviewer Only Spans</h6>
                <p class="text-2xl font-bold text-purple-600">{{ iaaData.detailed_analysis?.reviewer_only_spans?.length || 0 }}</p>
                <p class="text-xs text-gray-500">Only reviewer marked</p>
              </div>
            </div>

            <!-- Metadata -->
            <div v-if="iaaData.metadata" class="mt-4 p-4 bg-gray-50 rounded-lg">
              <h6 class="text-sm font-medium text-gray-700 mb-2">Calculation Metadata</h6>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">Execution Time:</span>
                  <span class="font-medium ml-2">{{ ((iaaData.metadata?.execution_time || 0) * 1000).toFixed(2) }}ms</span>
                </div>
                <div>
                  <span class="text-gray-600">Data Size:</span>
                  <span class="font-medium ml-2">{{ iaaData.metadata?.data_size || 0 }} items</span>
                </div>
              </div>
            </div>
          </div>
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

const { getDashboardSummary, getAnnotatorPerformance, getReviewerPerformance, getInterAnnotatorAgreement } = useDashboardApi();
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
  try {
    const params: any = {};

    if (activeProjectId.value) {
      params.project_id = activeProjectId.value;
    }

    if (selectedDocument.value !== "all") {
      params.document_id = parseInt(selectedDocument.value);
    }

    dashboardData.value = await getDashboardSummary(params);
  } catch (error) {
    toast.error("Gagal memuat data dashboard");
    console.error(error);
  } finally {
    loading.value = false;
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
