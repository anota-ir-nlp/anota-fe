<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter bg-gray-50">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard Analytics</h1>
        <p class="text-gray-600">
          Monitor performance metrics, inter-annotator agreement, dan statistik sistem
        </p>
        <div v-if="selectedProject" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-800">
            <strong>Project terpilih:</strong> {{ selectedProject.name }}
          </p>
          <p class="text-xs text-blue-600 mt-1">
            Data yang ditampilkan hanya untuk project ini
          </p>
        </div>
        <div v-else class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p class="text-sm text-gray-600">
            Menampilkan data dari semua project
          </p>
        </div>
      </div>

      <!-- Filters -->
      <Card class="mb-8 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Filter Data</h2>
        <div class="space-y-6">
          <!-- Document Selection DataTable -->
          <div>
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
                  <template v-if="!isKepalaRiset && !selectedProjectId">
                    Pilih project terlebih dahulu untuk melihat dokumen
                  </template>
                  <template v-else>
                    Tidak ada dokumen tersedia
                  </template>
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
        <div class="mt-4">
          <Button @click="loadDashboardData" :loading="loading">
            Refresh Data
          </Button>
        </div>
      </Card>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 mb-1">Total Dokumen</p>
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
            </div>
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <BarChart3 class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      <!-- Charts and Analytics -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Annotations by Annotator -->
        <Card class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Distribusi Anotasi per Anotator
          </h3>
          <div v-if="dashboardData?.per_annotator?.length" class="space-y-3">
            <div 
              v-for="item in dashboardData.per_annotator" 
              :key="item.annotator_id"
              class="flex items-center justify-between"
            >
              <span class="text-sm text-gray-600">{{ item.annotator_name }}</span>
              <div class="flex items-center gap-2">
                <div class="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-blue-600 h-2 rounded-full" 
                    :style="{ width: `${(item.annotations / Math.max(...dashboardData.per_annotator.map(i => i.annotations))) * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 w-8">{{ item.annotations }}</span>
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
              :key="item.reviewer_id"
              class="flex items-center justify-between"
            >
              <span class="text-sm text-gray-600">{{ item.reviewer_name }}</span>
              <div class="flex items-center gap-2">
                <div class="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-purple-600 h-2 rounded-full" 
                    :style="{ width: `${(item.reviews / Math.max(...dashboardData.per_reviewer.map(i => i.reviews))) * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 w-8">{{ item.reviews }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-8">
            Tidak ada data review
          </div>
        </Card>
      </div>

      <!-- User Performance Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
      <Card class="p-6">
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
        
        <div v-if="iaaData" class="mt-6 space-y-4">
          <!-- Participants Info -->
          <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 class="font-medium text-blue-900 mb-2">Participants</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-blue-700"><strong>Annotator:</strong> {{ iaaData.participants.annotator_name }}</p>
                <p class="text-blue-600 text-xs">{{ iaaData.participants.annotator_id }}</p>
              </div>
              <div>
                <p class="text-blue-700"><strong>Reviewer:</strong> {{ iaaData.participants.reviewer_name }}</p>
                <p class="text-blue-600 text-xs">{{ iaaData.participants.reviewer_id }}</p>
              </div>
            </div>
          </div>

          <!-- Main Results -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-gray-600">Cohen's Kappa</p>
              <p class="text-2xl font-bold text-blue-600">
                {{ (iaaData.results.cohen_kappa * 100).toFixed(1) }}%
              </p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-gray-600">Accuracy</p>
              <p class="text-2xl font-bold text-green-600">
                {{ (iaaData.results.accuracy * 100).toFixed(1) }}%
              </p>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <p class="text-sm text-gray-600">Span Agreement</p>
              <p class="text-2xl font-bold text-purple-600">
                {{ (iaaData.results.span_agreement_ratio * 100).toFixed(1) }}%
              </p>
            </div>
            <div class="text-center p-4 bg-orange-50 rounded-lg">
              <p class="text-sm text-gray-600">Total Items</p>
              <p class="text-2xl font-bold text-orange-600">
                {{ iaaData.results.total_items }}
              </p>
            </div>
          </div>

          <!-- Additional Stats -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-600">Correct Items</p>
              <p class="text-xl font-bold text-gray-700">{{ iaaData.results.correct_items }}</p>
            </div>
            <div class="text-center p-4 bg-indigo-50 rounded-lg">
              <p class="text-sm text-gray-600">Total Unique Spans</p>
              <p class="text-xl font-bold text-indigo-600">{{ iaaData.results.total_unique_spans }}</p>
            </div>
            <div class="text-center p-4 bg-emerald-50 rounded-lg">
              <p class="text-sm text-gray-600">Matching Spans</p>
              <p class="text-xl font-bold text-emerald-600">{{ iaaData.results.matching_spans }}</p>
            </div>
          </div>

          <!-- Detailed Analysis -->
          <div class="mt-6">
            <h4 class="font-medium text-gray-900 mb-4">Detailed Analysis</h4>
            
            <!-- Confusion Matrix -->
            <div class="mb-4">
              <h5 class="text-sm font-medium text-gray-700 mb-2">Agreement Breakdown</h5>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div class="text-center p-3 bg-gray-50 rounded">
                  <p class="text-xs text-gray-600">Agree No Annotation</p>
                  <p class="text-lg font-bold text-gray-900">{{ iaaData.detailed_analysis.confusion_like.agree_no_annotation }}</p>
                </div>
                <div class="text-center p-3 bg-green-50 rounded">
                  <p class="text-xs text-gray-600">Agree Error Type</p>
                  <p class="text-lg font-bold text-green-600">{{ iaaData.detailed_analysis.confusion_like.agree_error_type }}</p>
                </div>
                <div class="text-center p-3 bg-yellow-50 rounded">
                  <p class="text-xs text-gray-600">Disagree Presence</p>
                  <p class="text-lg font-bold text-yellow-600">{{ iaaData.detailed_analysis.confusion_like.disagree_presence }}</p>
                </div>
                <div class="text-center p-3 bg-red-50 rounded">
                  <p class="text-xs text-gray-600">Disagree Error Type</p>
                  <p class="text-lg font-bold text-red-600">{{ iaaData.detailed_analysis.confusion_like.disagree_error_type }}</p>
                </div>
              </div>
            </div>

            <!-- Span Analysis -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="p-4 border rounded-lg">
                <h6 class="text-sm font-medium text-gray-700 mb-2">Perfect Agreement Spans</h6>
                <p class="text-2xl font-bold text-green-600">{{ iaaData.detailed_analysis.perfect_agreement_spans.length }}</p>
                <p class="text-xs text-gray-500">Both annotated same spans</p>
              </div>
              <div class="p-4 border rounded-lg">
                <h6 class="text-sm font-medium text-gray-700 mb-2">Annotator Only Spans</h6>
                <p class="text-2xl font-bold text-blue-600">{{ iaaData.detailed_analysis.annotator_only_spans.length }}</p>
                <p class="text-xs text-gray-500">Only annotator marked</p>
              </div>
              <div class="p-4 border rounded-lg">
                <h6 class="text-sm font-medium text-gray-700 mb-2">Reviewer Only Spans</h6>
                <p class="text-2xl font-bold text-purple-600">{{ iaaData.detailed_analysis.reviewer_only_spans.length }}</p>
                <p class="text-xs text-gray-500">Only reviewer marked</p>
              </div>
            </div>

            <!-- Metadata -->
            <div class="mt-4 p-4 bg-gray-50 rounded-lg">
              <h6 class="text-sm font-medium text-gray-700 mb-2">Calculation Metadata</h6>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">Execution Time:</span>
                  <span class="font-medium ml-2">{{ (iaaData.metadata.execution_time * 1000).toFixed(2) }}ms</span>
                </div>
                <div>
                  <span class="text-gray-600">Data Size:</span>
                  <span class="font-medium ml-2">{{ iaaData.metadata.data_size }} items</span>
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
import { FileText, Pencil, BarChart3, ClipboardList } from "lucide-vue-next";
import DataTable from "~/components/ui/data-table/data-table.vue";
import { createDocumentColumns } from "~/components/dashboard/columns";
import { useDashboardApi } from "~/data/dashboard";
import { useProjectsApi } from "~/data/projects";
import { useDocumentsApi } from "~/data/documents";
import { useUsersApi } from "~/data/users";
import { useProjectContext } from "~/composables/project-context";
import { useAuth } from "~/data/auth";
import { toast } from "vue-sonner";
import type {
  DashboardSummaryResponse,
  AnnotatorPerformanceResponse,
  ReviewerPerformanceResponse, 
  IAAResponse
} from "~/data/dashboard";
import type { ProjectResponse, DocumentResponse, UserResponse, DocumentStatus } from "~/types/api";

const { getDashboardSummary, getAnnotatorPerformance, getReviewerPerformance, getInterAnnotatorAgreement } = useDashboardApi();
const { getProjects } = useProjectsApi();
const { getDocuments, getDocumentsInProject } = useDocumentsApi();
const { getAllUsers } = useUsersApi();
const { selectedProject, selectedProjectId } = useProjectContext();
const { userRoles } = useAuth();

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

// Computed
const annotators = computed(() => users.value.filter(u => u.roles.includes("Annotator")));
const reviewers = computed(() => users.value.filter(u => u.roles.includes("Reviewer")));

// Role-based computed property
const isKepalaRiset = computed(() => userRoles.value.includes("Kepala Riset"));

// Document columns for DataTable with single selection
const documentColumns = computed(() => 
  createDocumentColumns(selectedDocument.value, handleDocumentSelect)
);

// Single document selection handler
function handleDocumentSelect(documentId: string) {
  selectedDocument.value = documentId;
  // Automatically refresh data when selection changes
  loadDashboardData();
}

// Clear selection handler
function clearDocumentSelection() {
  selectedDocument.value = "all";
  loadDashboardData();
}

// Get selected document details
const selectedDocumentDetails = computed(() => {
  if (selectedDocument.value === "all") return null;
  return documents.value.find(doc => doc.id.toString() === selectedDocument.value) || null;
});

// Methods
async function loadDashboardData() {
  loading.value = true;
  try {
    const params: any = {};
    if (selectedProjectId.value) {
      params.project_id = selectedProjectId.value;
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
    if (selectedProjectId.value) {
      params.project_id = selectedProjectId.value;
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
    if (selectedProjectId.value) {
      params.project_id = selectedProjectId.value;
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
  try {
    const params: any = {
      annotator_id: iaaAnnotator.value,
      reviewer_id: iaaReviewer.value
    };
    if (selectedProjectId.value) {
      params.project_id = selectedProjectId.value;
    }
    if (selectedDocument.value !== "all") {
      params.document_id = parseInt(selectedDocument.value);
    }
    
    iaaData.value = await getInterAnnotatorAgreement(params);
  } catch (error) {
    toast.error("Gagal menghitung Inter-Annotator Agreement");
    console.error(error);
  } finally {
    loadingIAA.value = false;
  }
}

async function loadInitialData() {
  try {
    const [projectsRes, usersRes] = await Promise.all([
      getProjects(),
      getAllUsers()
    ]);
    
    projects.value = projectsRes.results || [];
    users.value = usersRes || [];
    
    // Fetch documents based on role and project context (similar to kelola-dokumen)
    await fetchDocuments();
    
    await loadDashboardData();
  } catch (error) {
    toast.error("Gagal memuat data awal");
    console.error(error);
  }
}

// Document fetching logic similar to kelola-dokumen
async function fetchDocuments() {
  loadingDocuments.value = true;
  try {
    if (isKepalaRiset.value) {
      // Kepala Riset can see all documents across all projects
      const response = await getDocuments();
      documents.value = response.results || [];
    } else {
      // Other roles need project selection
      if (!selectedProjectId.value) {
        documents.value = [];
        return;
      }

      const projectDocuments = await getDocumentsInProject(selectedProjectId.value);
      documents.value = projectDocuments || [];
    }
  } catch (error) {
    console.error("Error fetching documents:", error);
    toast.error("Gagal memuat data dokumen");
    documents.value = [];
  } finally {
    loadingDocuments.value = false;
  }
}

onMounted(() => {
  loadInitialData();
});

// Watch for project context changes
watch(selectedProjectId, async () => {
  // For non-Kepala Riset users, refresh documents when project changes
  if (!isKepalaRiset.value) {
    await fetchDocuments();
    // Reset document selection when project changes
    selectedDocument.value = "all";
  }
  await loadDashboardData();
});

// Define layout
definePageMeta({
  layout: "default",
});
</script>
