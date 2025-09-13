<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter bg-gray-50">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard Analytics</h1>
        <p class="text-gray-600">
          Monitor performance metrics, inter-annotator agreement, dan statistik sistem
        </p>
      </div>

      <!-- Filters -->
      <Card class="mb-8 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Filter Data</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Project
            </label>
            <Select v-model="selectedProject">
              <SelectTrigger>
                <SelectValue placeholder="Pilih project..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Project</SelectItem>
                <SelectItem 
                  v-for="project in projects" 
                  :key="project.id" 
                  :value="project.id.toString()"
                >
                  {{ project.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Document
            </label>
            <Select v-model="selectedDocument">
              <SelectTrigger>
                <SelectValue placeholder="Pilih document..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Dokumen</SelectItem>
                <SelectItem 
                  v-for="doc in documents" 
                  :key="doc.id" 
                  :value="doc.id.toString()"
                >
                  {{ doc.title }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div class="mt-4">
          <Button @click="loadDashboardData" :loading="loading">
            Update Data
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
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Cohen's Kappa Avg:</span>
                <span class="font-medium">{{ (annotatorPerformance.agreement_with_others.cohen_kappa_avg * 100).toFixed(1) }}%</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Agreement Ratio:</span>
                <span class="font-medium">{{ (annotatorPerformance.agreement_with_others.approx_ratio * 100).toFixed(1) }}%</span>
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
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-gray-600">Cohen's Kappa</p>
              <p class="text-2xl font-bold text-blue-600">
                {{ (iaaData.kappa * 100).toFixed(1) }}%
              </p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-gray-600">Accuracy</p>
              <p class="text-2xl font-bold text-green-600">
                {{ (iaaData.totals.accuracy * 100).toFixed(1) }}%
              </p>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <p class="text-sm text-gray-600">Total Items</p>
              <p class="text-2xl font-bold text-purple-600">
                {{ iaaData.totals.items }}
              </p>
            </div>
            <div class="text-center p-4 bg-orange-50 rounded-lg">
              <p class="text-sm text-gray-600">Correct</p>
              <p class="text-2xl font-bold text-orange-600">
                {{ iaaData.totals.correct }}
              </p>
            </div>
          </div>

          <div class="mt-4">
            <h4 class="font-medium text-gray-900 mb-2">Confusion Matrix</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div class="text-center p-3 bg-gray-50 rounded">
                <p class="text-xs text-gray-600">Agree No Annotation</p>
                <p class="text-lg font-bold text-gray-900">{{ iaaData.confusion_like.agree_no_annotation }}</p>
              </div>
              <div class="text-center p-3 bg-green-50 rounded">
                <p class="text-xs text-gray-600">Agree Error Type</p>
                <p class="text-lg font-bold text-green-600">{{ iaaData.confusion_like.agree_error_type }}</p>
              </div>
              <div class="text-center p-3 bg-yellow-50 rounded">
                <p class="text-xs text-gray-600">Disagree Presence</p>
                <p class="text-lg font-bold text-yellow-600">{{ iaaData.confusion_like.disagree_presence }}</p>
              </div>
              <div class="text-center p-3 bg-red-50 rounded">
                <p class="text-xs text-gray-600">Disagree Error Type</p>
                <p class="text-lg font-bold text-red-600">{{ iaaData.confusion_like.disagree_error_type }}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { FileText, Pencil, BarChart3, ClipboardList } from "lucide-vue-next";
import { useDashboardApi } from "~/data/dashboard";
import { useProjectsApi } from "~/data/projects";
import { useDocumentsApi } from "~/data/documents";
import { useUsersApi } from "~/data/users";
import { toast } from "vue-sonner";
import type {
  DashboardSummaryResponse,
  AnnotatorPerformanceResponse,
  ReviewerPerformanceResponse, 
  IAAResponse
} from "~/data/dashboard";
import type { ProjectResponse, DocumentResponse, UserResponse, DocumentStatus } from "~/types/api";

// APIs
const { getDashboardSummary, getAnnotatorPerformance, getReviewerPerformance, getInterAnnotatorAgreement } = useDashboardApi();
const { getProjects } = useProjectsApi();
const { getDocuments } = useDocumentsApi();
const { getAllUsers } = useUsersApi();

// State
const loading = ref(false);
const loadingAnnotator = ref(false);
const loadingReviewer = ref(false);
const loadingIAA = ref(false);

const selectedProject = ref<string>("all");
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

// Methods
async function loadDashboardData() {
  loading.value = true;
  try {
    const params: any = {};
    if (selectedProject.value !== "all") {
      params.project_id = parseInt(selectedProject.value);
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
    if (selectedProject.value !== "all") {
      params.project_id = parseInt(selectedProject.value);
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
    if (selectedProject.value !== "all") {
      params.project_id = parseInt(selectedProject.value);
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
    if (selectedProject.value !== "all") {
      params.project_id = parseInt(selectedProject.value);
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
    const [projectsRes, documentsRes, usersRes] = await Promise.all([
      getProjects(),
      getDocuments(),
      getAllUsers()
    ]);
    
    projects.value = projectsRes.results || [];
    documents.value = documentsRes.results || [];
    users.value = usersRes || [];
    
    await loadDashboardData();
  } catch (error) {
    toast.error("Gagal memuat data awal");
    console.error(error);
  }
}

onMounted(() => {
  loadInitialData();
});

// Define layout
definePageMeta({
  layout: "default",
});
</script>
