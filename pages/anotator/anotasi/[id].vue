<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white font-inter px-2 py-6 flex justify-center"
  >
    <div class="max-w-6xl w-full flex flex-col md:flex-row gap-8">
      <!-- Left: Document View & Navigation -->
      <div class="flex-1 min-w-[320px]">
        <div
          class="custom-glassmorphism p-6 mb-6 flex items-center justify-between"
        >
          <UButton
            icon="i-heroicons-arrow-left"
            color="neutral"
            variant="ghost"
            :ui="{ base: 'rounded-full px-4 py-2 font-semibold' }"
            @click="router.back()"
            title="Kembali"
          />
          <div class="text-center flex-1">
            <h1
              class="text-xl font-bold flex items-center gap-2 justify-center"
            >
              <UIcon
                name="i-heroicons-document-text"
                class="w-6 h-6 text-blue-400"
              />
              Anotasi Dokumen
            </h1>
            <div class="text-gray-400 text-xs mt-1" v-if="document">
              Dokumen
              <span class="font-semibold text-white">#{{ document.id }}</span>
              &mdash; {{ document.title }}
            </div>
          </div>
          <div class="w-[120px]"></div> <!-- Spacer for alignment -->
        </div>
        
        <div v-if="isLoading" class="custom-glassmorphism p-6 text-center">
          <span class="text-gray-400">Memuat dokumen...</span>
        </div>
        
        <div v-else-if="document" class="custom-glassmorphism p-6">
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="badge badge-blue">
              <UIcon name="i-heroicons-document" class="w-4 h-4" />
              Dokumen
            </span>
            <span class="badge badge-gray">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
              {{ formatDate(document.created_at) }}
            </span>
            <span class="badge badge-purple">
              <UIcon name="i-heroicons-list-bullet" class="w-4 h-4" />
              {{ document.sentences.length }} kalimat
            </span>
          </div>
          <h2 class="font-semibold text-lg mb-2 text-blue-200">Isi Dokumen</h2>
          <div class="paragraph-view">
            <template v-for="(sentence, idx) in document.sentences" :key="sentence.id">
              <span
                class="sentence-inline"
                :class="{
                  annotated: sentenceAnnotations[sentence.id]?.length > 0,
                  selected: selectedSentence === sentence.id,
                }"
                @click="editSentence(sentence)"
                tabindex="0"
              >
                {{ sentence.text }}
                <span
                  v-if="sentenceAnnotations[sentence.id]?.length > 0"
                  class="inline-flex gap-1 ml-1"
                >
                  <span
                    v-for="annotation in sentenceAnnotations[sentence.id]"
                    :key="annotation.id"
                    class="tagged-type"
                  >
                    {{ getErrorTypeName(annotation.error_type) }}
                  </span>
                </span>
              </span>
              <span v-if="idx !== document.sentences.length - 1"> </span>
            </template>
          </div>
        </div>
        
        <div v-else class="custom-glassmorphism p-6 text-center">
          <span class="text-red-400">Dokumen tidak ditemukan</span>
        </div>
      </div>

      <!-- Right: Annotation Input -->
      <div class="flex-1 min-w-[340px]">
        <div class="custom-glassmorphism p-6 sticky top-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="font-semibold text-lg flex items-center gap-2">
              <UIcon
                name="i-heroicons-pencil-square"
                class="w-6 h-6 text-blue-400"
              />
              Anotasi Kalimat
            </h2>
            <UButton
              label="Kembali"
              icon="i-heroicons-arrow-left"
              color="neutral"
              variant="outline"
              :ui="{ base: 'rounded-full px-4 py-2 font-semibold' }"
              @click="router.back()"
            />
          </div>
          <div v-if="selectedSentenceData" class="space-y-4">
            <div class="mb-2">
              <span class="text-blue-300 font-mono text-xs">
                Kalimat ID: {{ selectedSentenceData.id }}
              </span>
              <p class="font-semibold text-white">{{ selectedSentenceData.text }}</p>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">
                Tipe Kesalahan:
              </label>
              <USelectMenu
                v-model="selectedErrorType"
                :options="errorTypeOptions"
                placeholder="Pilih tipe kesalahan"
                :ui="{ base: 'w-full' }"
                option-attribute="label"
                value-attribute="value"
                size="md"
                icon="i-heroicons-tag"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">
                Koreksi Benar:
              </label>
              <UInput
                v-model="correctionInput"
                placeholder="Masukkan koreksi kalimat yang benar"
                :ui="{
                  base: 'w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 rounded-md',
                }"
                size="md"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1">
                Komentar (opsional):
              </label>
              <UTextarea
                v-model="commentsInput"
                placeholder="Tambahkan komentar..."
                :ui="{
                  base: 'w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-400 rounded-md',
                }"
                size="md"
              />
            </div>
            <div class="flex gap-2 mt-4">
              <UButton
                label="Simpan Anotasi"
                color="primary"
                icon="i-heroicons-check-circle"
                :ui="{
                  base: 'rounded-full px-6 py-2 font-bold shadow hover:scale-105 transition',
                }"
                @click="saveAnnotation"
                :loading="isSaving"
              />
              <UButton
                label="Batal"
                color="neutral"
                variant="ghost"
                :ui="{ base: 'rounded-full px-6 py-2 font-semibold' }"
                @click="cancelAnnotation"
              />
            </div>
          </div>
          <div v-else class="text-gray-400 text-center py-12">
            <span>Klik kalimat pada dokumen untuk melakukan anotasi.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDocumentsApi } from "~/data/documents";
import { useAnnotationsApi } from "~/data/annotations";
import { useErrorTypesApi } from "~/data/error-types";
import type { DocumentResponse, SentenceResponse, AnnotationResponse, ErrorTypeResponse } from "~/types/api";
import { toast } from "vue-sonner";

const route = useRoute();
const router = useRouter();

const { getDocument } = useDocumentsApi();
const { getAnnotations, createAnnotation } = useAnnotationsApi();
const { getErrorTypes } = useErrorTypesApi();

// State
const document = ref<DocumentResponse | null>(null);
const annotations = ref<AnnotationResponse[]>([]);
const errorTypes = ref<ErrorTypeResponse[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);

const selectedSentence = ref<number | null>(null);
const selectedSentenceData = ref<SentenceResponse | null>(null);
const selectedErrorType = ref<number | null>(null);
const correctionInput = ref("");
const commentsInput = ref("");

// Computed
const sentenceAnnotations = computed(() => {
  const grouped: Record<number, AnnotationResponse[]> = {};
  annotations.value.forEach(annotation => {
    if (!grouped[annotation.sentence]) {
      grouped[annotation.sentence] = [];
    }
    grouped[annotation.sentence].push(annotation);
  });
  return grouped;
});

const errorTypeOptions = computed(() => 
  errorTypes.value.map(type => ({
    label: type.error_code,
    value: type.id,
    description: type.description
  }))
);

// Methods
function editSentence(sentence: SentenceResponse) {
  selectedSentence.value = sentence.id;
  selectedSentenceData.value = sentence;
  
  // Load existing annotation if any
  const existingAnnotation = sentenceAnnotations.value[sentence.id]?.[0];
  if (existingAnnotation) {
    selectedErrorType.value = existingAnnotation.error_type;
    correctionInput.value = existingAnnotation.correction;
    commentsInput.value = existingAnnotation.comments || "";
  } else {
    selectedErrorType.value = null;
    correctionInput.value = "";
    commentsInput.value = "";
  }
}

async function saveAnnotation() {
  if (!selectedSentenceData.value || !selectedErrorType.value || !correctionInput.value.trim()) {
    toast.message("Validasi Error", {
      description: "Mohon lengkapi semua field yang diperlukan",
    });
    return;
  }

  isSaving.value = true;
  try {
    const annotationData = {
      document: Number(route.params.id),
      sentence: selectedSentenceData.value.id,
      start_index: 0, // For now, we'll annotate the whole sentence
      end_index: selectedSentenceData.value.text.length,
      error_type: selectedErrorType.value,
      correction: correctionInput.value.trim(),
      comments: commentsInput.value.trim() || undefined,
      is_required: true,
      is_submitted: false,
    };

    await createAnnotation(annotationData);
    
    toast.success("Anotasi berhasil disimpan");

    // Refresh annotations
    await fetchAnnotations();
    cancelAnnotation();
  } catch (error) {
    console.error('Error saving annotation:', error);
    toast.error("Gagal menyimpan anotasi");
  } finally {
    isSaving.value = false;
  }
}

function cancelAnnotation() {
  selectedSentence.value = null;
  selectedSentenceData.value = null;
  selectedErrorType.value = null;
  correctionInput.value = "";
  commentsInput.value = "";
}

function getErrorTypeName(errorTypeId: number) {
  return errorTypes.value.find(type => type.id === errorTypeId)?.error_code || 'Unknown';
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID');
}

// Fetch data
async function fetchDocument() {
  try {
    const docId = Number(route.params.id);
    document.value = await getDocument(docId);
  } catch (error) {
    console.error('Error fetching document:', error);
    document.value = null;
    toast.error("Gagal memuat dokumen");
  }
}

async function fetchAnnotations() {
  try {
    const allAnnotations = await getAnnotations();
    // Filter annotations for current document
    annotations.value = allAnnotations.filter(
      annotation => annotation.document === Number(route.params.id)
    );
  } catch (error) {
    console.error('Error fetching annotations:', error);
    annotations.value = [];
    toast.error("Gagal memuat anotasi");
  }
}

async function fetchErrorTypes() {
  try {
    errorTypes.value = await getErrorTypes();
  } catch (error) {
    console.error('Error fetching error types:', error);
    errorTypes.value = [];
    toast.error("Gagal memuat tipe kesalahan");
  }
}

onMounted(async () => {
  isLoading.value = true;
  try {
    await Promise.all([
      fetchDocument(),
      fetchAnnotations(),
      fetchErrorTypes(),
    ]);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Use a custom class instead of glassmorphism-card for Tailwind compatibility */
.custom-glassmorphism {
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1.25rem;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15), 0 12px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.custom-glassmorphism:hover {
  background-color: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2), 0 15px 25px rgba(0, 0, 0, 0.15);
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.15rem 0.6rem;
  border-radius: 0.5rem;
  border-width: 1px;
  border-style: solid;
}
.badge-blue {
  background: #1e40af33;
  color: #60a5fa;
  border-color: #60a5fa44;
}
.badge-gray {
  background: #33415566;
  color: #cbd5e1;
  border-color: #cbd5e144;
}
.badge-green {
  background: #16653433;
  color: #4ade80;
  border-color: #4ade8044;
}
.badge-yellow {
  background: #ca8a0433;
  color: #fde68a;
  border-color: #fde68a44;
}
.badge-purple {
  background: #7c3aed33;
  color: #c4b5fd;
  border-color: #c4b5fd44;
}
.paragraph-view {
  font-size: 1.1rem;
  color: #e0e7ef;
  line-height: 2.1;
  word-break: break-word;
  user-select: text;
}
.sentence-inline {
  display: inline-block;
  padding: 0.15em 0.4em;
  margin: 0.1em 0;
  border-radius: 0.45em;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
  position: relative;
}
.sentence-inline.selected {
  background: #2563eb33;
  box-shadow: 0 0 0 2px #60a5fa;
}
.sentence-inline.annotated {
  background: #22d3ee22;
  color: #38bdf8;
  font-weight: 600;
}
.sentence-inline:hover {
  background: #2563eb22;
}
.tagged-type {
  background: #0ea5e933;
  color: #38bdf8;
  border-radius: 0.3em;
  padding: 0.1em 0.5em;
  font-size: 0.8em;
  margin-left: 0.2em;
  border: 1px solid #38bdf8;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>