<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter bg-white text-black">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <div class="bg-white border border-gray-200 rounded-3xl p-6 mb-6">
        <div class="flex items-center justify-between">
          <UButton
            label="Kembali"
            icon="i-heroicons-arrow-left"
            class="rounded-2xl bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 flex items-center px-4 py-2 font-semibold shadow-none"
            @click="router.push('/anotator/anotasi')"
            title="Kembali"
          />

          <div class="text-center flex-1">
            <h1 class="text-2xl font-bold flex items-center gap-2 justify-center text-black">
              <span class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-blue-50">
                <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <line x1="8" y1="8" x2="16" y2="8" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="8" y1="16" x2="12" y2="16" />
                </svg>
              </span>
              Anotasi Dokumen
            </h1>
            <div class="text-gray-500 text-sm mt-1" v-if="document">
              Dokumen
              <span class="font-semibold text-black">#{{ document.id }}</span>
              &mdash; {{ document.title }}
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <UButton
              icon="i-heroicons-chevron-left"
              class="rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 flex items-center px-3 py-2 shadow-none"
              title="Dokumen Sebelumnya"
              @click="navigateDocument(-1)"
            />
            <UButton
              icon="i-heroicons-chevron-right"
              class="rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 flex items-center px-3 py-2 shadow-none"
              title="Dokumen Selanjutnya"
              @click="navigateDocument(1)"
            />
          </div>
        </div>
      </div>

      <div class="grid gap-6 grid-cols-1">
        <div class="space-y-6">
          <div class="bg-white border border-gray-200 rounded-3xl p-6">
            <div class="flex flex-wrap gap-4 items-center mb-4">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-blue-50">
                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <line x1="8" y1="8" x2="16" y2="8" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="8" y1="16" x2="12" y2="16" />
                </svg>
              </span>
              <div class="flex flex-wrap gap-10">
                <div class="text-lg text-black">Teks & Anotasi</div>
                <div class="flex flex-wrap gap-2">
                  <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200">
                    <UIcon name="i-heroicons-document" class="w-3 h-3" />
                    Dokumen
                  </span>
                  <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200">
                    <UIcon name="i-heroicons-calendar" class="w-3 h-3" />
                    {{ document ? formatDate(document.created_at) : "" }}
                  </span>
                  <span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200">
                    <UIcon name="i-heroicons-list-bullet" class="w-3 h-3" />
                    {{ document?.sentences.length || 0 }} kalimat
                  </span>
                  <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200">
                    <UIcon name="i-heroicons-building-office" class="w-3 h-3" />
                    {{ document?.assigned_by?.institusi || "-" }}
                  </span>
                  <span class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200">
                    <UIcon name="i-heroicons-user" class="w-3 h-3" />
                    {{ document?.assigned_by?.full_name || "-" }}
                  </span>
                </div>
              </div>
            </div>
            <hr class="my-4 border-gray-200" />

            <div class="mb-4 flex flex-col gap-2">
              <div class="flex flex-wrap items-center gap-2 justify-between">
                <span
                  class="px-2 py-1 rounded-full transition-colors"
                  :class="selectedSentence ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'"
                >
                  {{ selectedSentence ? `Kalimat Terpilih #${selectedSentence.id}` : "Klik Kalimat" }}
                </span>
                <div class="flex items-center gap-2 ml-auto">
                  <UButton
                    icon="i-heroicons-plus-circle"
                    size="md"
                    class="rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 flex items-center cursor-pointer"
                    :disabled="!selectedSentence || !canAnnotate"
                    @click="showAnnotationUI = true"
                    variant="ghost"
                  >
                    <span class="flex items-center">
                      Anotasi
                      <UKbd as="span" size="sm" class="ml-2">Enter</UKbd>
                    </span>
                  </UButton>
                  <UButton
                    icon="i-heroicons-clock"
                    size="md"
                    class="rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200 flex items-center cursor-pointer"
                    :disabled="!selectedSentence"
                    @click="showCombinedHistory = true"
                    variant="ghost"
                  >
                    <span class="flex items-center">
                      Riwayat Anotasi
                      <UKbd as="span" size="sm" class="ml-2">Shift+Enter</UKbd>
                    </span>
                  </UButton>
                  <UButton
                    icon="i-heroicons-x-mark"
                    size="md"
                    class="rounded-2xl bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 flex items-center cursor-pointer"
                    :disabled="!selectedSentence"
                    @click="clearSelection"
                    variant="ghost"
                  >
                    <span class="flex items-center">
                      Ganti Kalimat
                      <UKbd as="span" size="sm" class="ml-2">Shift+X</UKbd>
                    </span>
                  </UButton>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-cursor-arrow-rays"
                  class="w-4 h-4"
                  :class="selectedSentence ? 'text-blue-500' : 'text-gray-400'"
                />
                <span :class="selectedSentence ? 'text-sm text-blue-700' : 'text-sm text-gray-500'">
                  Pilih teks dalam kalimat untuk anotasi
                </span>
                <span v-if="selectedText && selectedSentence" class="text-xs text-gray-500 self-center ml-2">
                  Terpilih: "<span class="font-mono">{{ selectedText }}</span>"
                </span>
              </div>
            </div>

            <div class="text-black leading-relaxed">
              <template v-if="document?.sentences && document.sentences.length > 0">
                <template v-for="(sentence, idx) in document.sentences" :key="sentence.id">
                  
                  <span
                    v-if="selectedSentence && selectedSentence.id === sentence.id"
                    :ref="(el) => { if (el) combinedEditableArea = el }"
                    :class="[
                      'inline px-1 py-0.5 rounded transition-colors cursor-text bg-blue-100',
                      hasAnnotations(sentence.id) ? 'border-b-2 border-dashed border-blue-300 pb-px' : '',
                    ]"
                    @mouseup="handleTextSelection"
                    style="user-select: auto;"
                  >
                    <template v-for="(seg, i) in buildSegmentsForSentence(sentence.id)" :key="i">
                      <span v-if="seg.type === 'annotated'" class="inline-flex flex-col items-center align-bottom leading-snug mx-px">
                        <span class="text-[1em] text-green-600 font-semibold bg-green-100 rounded px-1 leading-snug whitespace-nowrap">
                          {{ seg.correction }}
                        </span>
                        <span class="text-[1em] text-gray-500 line-through leading-snug whitespace-nowrap">
                          {{ seg.text }}
                        </span>
                      </span>
                      <span v-else>{{ seg.text }}</span>
                    </template>
                  </span>

                  <span
                    v-else
                    :class="[
                      'inline px-1 py-0.5 rounded transition-colors',
                      selectedSentence
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-blue-50 cursor-pointer',
                      hasAnnotations(sentence.id) ? 'border-b-2 border-dashed border-blue-300 pb-px' : '',
                    ]"
                    @click="!selectedSentence && selectSentence(sentence.id)"
                    :tabindex="selectedSentence ? -1 : 0"
                    style="user-select: none;"
                  >
                    <template v-for="(seg, i) in buildSegmentsForSentence(sentence.id)" :key="i">
                      <span v-if="seg.type === 'annotated'" class="inline-flex flex-col items-center align-bottom leading-snug mx-px">
                        <span class="text-[1em] text-green-600 font-semibold bg-green-100 rounded px-1 leading-snug whitespace-nowrap">
                          {{ seg.correction }}
                        </span>
                        <span class="text-[1em] text-gray-500 line-through leading-snug whitespace-nowrap">
                          {{ seg.text }}
                        </span>
                      </span>
                      <span v-else>{{ seg.text }}</span>
                    </template>
                  </span>

                  <span v-if="idx < document.sentences.length - 1"> </span>
                </template>
              </template>
              <template v-else>
                <div class="text-gray-400 italic py-8 text-center">
                  Tidak ada kalimat pada dokumen ini.
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="sticky bottom-0 mt-6">
        <div class="bg-black border border-gray-900 rounded-2xl px-4 py-3 flex items-center justify-between">
          <div class="text-xs text-white">
            Submit untuk kirim final seluruh anotasi pada dokumen ini. Semua anotasi yang dibuat otomatis tersimpan.
          </div>
          <div class="flex gap-2">
            <UButton
              icon="i-heroicons-paper-airplane"
              class="rounded-2xl bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 flex items-center px-4 py-2 shadow-none"
              @click="showSubmitConfirm = true"
            >
              <span class="flex items-center">
                Submit
                <UKbd as="span" size="sm" class="ml-2">Shift+S</UKbd>
              </span>
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <ModalAnnotationFormModal
      v-model="showAnnotationUI"
      :is-editing="isEditingAnnotation"
      :selected-text="selectedText"
      :correction="correctionInput"
      :error-types="errorTypes"
      :selected-error-types="selectedErrorTypes"
      :is-required="isRequiredInput"
      :comments="commentsInput"
      :loading="annotationCreating"
      :error-types-loading="errorTypesLoading"
      :error-types-page="errorTypesPage"
      :error-types-count="errorTypesCount"
      :error-types-next="!!errorTypesNext"
      @save="handleSaveAnnotation"
      @change-page="fetchErrorTypes"
    />

    <ModalAnnotationHistoryModal
      v-model="showCombinedHistory"
      :sentence="selectedSentence"
      :annotations="selectedSentence ? getApiAnnotationsForSentence(selectedSentence.id) : []"
      :get-original-text="getOriginalSentenceText"
      @edit="editAnnotation"
      @delete="handleDeleteAnnotation"
    />

    <ModalConfirmModal
      v-model="showSubmitConfirm"
      heading="Kirim Anotasi"
      desc="Apakah Anda yakin ingin menyelesaikan anotasi untuk dokumen ini? Data yang sudah dikirim tidak dapat diubah kembali."
      cancel-text="Batal"
      confirm-text="Ya, Kirim Sekarang"
      @confirm="submitAllAnnotations"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useTextSelection } from "@vueuse/core";
import { useDocumentsApi } from "~/data/documents";
import { useErrorTypesApi } from "~/data/error-types";
import { useUserDocumentsApi } from "~/data/user-documents";
import { useAnnotationsApi } from "~/data/annotations";
import type { AnnotationResponse, ErrorTypeResponse, DocumentAssignedDetailResponse } from "~/types/api";
import { toast } from "vue-sonner";

const route = useRoute();
const router = useRouter();

const { getAssignedDocument, getAssignedDocuments } = useUserDocumentsApi();
const {
  getAnnotations,
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
  submitAnnotation,
} = useAnnotationsApi();
const { getErrorTypes } = useErrorTypesApi();

const document = ref<DocumentAssignedDetailResponse | null>(null);
const isLoading = ref(true);
const assignedDocumentIds = ref<number[]>([]);

const selectedSentence = ref<{ id: number; text: string } | null>(null);
const combinedEditableArea = ref<HTMLElement>();
const selectedText = ref("");
const selectedRange = ref<{ start: number; end: number } | null>(null);
const canAnnotate = computed(() => selectedText.value && selectedText.value.trim().length > 0);

const showAnnotationUI = ref(false);
const isEditingAnnotation = ref(false);
const editingAnnotation = ref<AnnotationResponse | null>(null);
const correctionInput = ref("");
const selectedErrorTypes = ref<string[]>([]);
const isRequiredInput = ref(true);
const commentsInput = ref("");
const annotationCreating = ref(false);

const apiAnnotations = ref<AnnotationResponse[]>([]);
const showCombinedHistory = ref(false);
const showSubmitConfirm = ref(false);

const errorTypes = ref<ErrorTypeResponse[]>([]);
const errorTypesCount = ref(0);
const errorTypesPage = ref(1);
const errorTypesLoading = ref(false);
const errorTypesNext = ref<string | null>(null);

async function fetchErrorTypes(page = 1) {
  errorTypesLoading.value = true;
  try {
    const projectId = document.value?.project;
    const res = await getErrorTypes(page, projectId);
    errorTypesNext.value = res.next;
    if (Array.isArray(res)) {
      errorTypes.value = res;
      errorTypesCount.value = res.length;
    } else {
      errorTypes.value = res.results;
      errorTypesCount.value = res.count;
    }
    errorTypesPage.value = page;
  } finally {
    errorTypesLoading.value = false;
  }
}

async function fetchApiAnnotations() {
  try {
    const all = await getAnnotations();
    const docId = Number(route.params.id);
    let annotationsArr: AnnotationResponse[] = [];
    if (Array.isArray(all)) {
      annotationsArr = all as AnnotationResponse[];
    } else if (all && Array.isArray(all.results)) {
      annotationsArr = all.results as AnnotationResponse[];
    }
    apiAnnotations.value = annotationsArr.filter((a) => a.document === docId);
  } catch (e) {}
}

async function handleSaveAnnotation(payload: any) {
  if (!selectedSentence.value || !selectedRange.value) return;

  annotationCreating.value = true;
  try {
    const data = {
      document: Number(route.params.id),
      sentence: selectedSentence.value.id,
      start_index: selectedRange.value.start,
      end_index: selectedRange.value.end,
      error_type: Number(payload.errorTypes[0]),
      correction: payload.correction,
      is_required: payload.isRequired,
      comments: payload.comments || undefined,
    };

    if (isEditingAnnotation.value && editingAnnotation.value) {
      await updateAnnotation(editingAnnotation.value.id, data);
    } else {
      await createAnnotation(data);
    }

    showAnnotationUI.value = false;
    resetAnnotationForm();
    await fetchApiAnnotations();
    toast.success("Anotasi berhasil disimpan");
  } catch (err) {
    toast.error("Gagal menyimpan anotasi");
  } finally {
    annotationCreating.value = false;
  }
}

function resetAnnotationForm() {
  selectedText.value = "";
  correctionInput.value = "";
  selectedErrorTypes.value = [];
  selectedRange.value = null;
  isRequiredInput.value = true;
  commentsInput.value = "";
  isEditingAnnotation.value = false;
  editingAnnotation.value = null;
}

async function handleDeleteAnnotation(annotation: AnnotationResponse) {
  try {
    await deleteAnnotation(annotation.id);
    await fetchApiAnnotations();
    toast.success("Anotasi berhasil dihapus");
  } catch (e) {
    toast.error("Gagal menghapus anotasi");
  }
}

async function fetchDocument() {
  try {
    isLoading.value = true;
    const docId = Number(route.params.id);
    const result = await getAssignedDocument(docId);
    document.value = {
      ...result,
      sentences: Array.isArray(result.sentences) ? result.sentences : [],
    };
  } finally {
    isLoading.value = false;
  }
}

async function fetchAssignedDocumentIds() {
  try {
    const response = await getAssignedDocuments();
    assignedDocumentIds.value =
      response?.results
        ?.map((doc: any) => Number(doc.id))
        .sort((a, b) => a - b) || [];
  } catch (e) {}
}

function buildSegmentsForSentence(sentenceId: number) {
  const text = getOriginalSentenceText(sentenceId);
  const annotations = getApiAnnotationsForSentence(sentenceId);

  if (!annotations.length) return [{ type: 'text', text }];

  const sorted = [...annotations]
    .filter(a => a.start_index >= 0 && a.end_index <= text.length && a.start_index < a.end_index)
    .sort((a, b) => a.start_index - b.start_index);

  const segments: { type: string; text: string; correction?: string }[] = [];
  let cursor = 0;

  for (const ann of sorted) {
    if (ann.start_index < cursor) continue;
    if (ann.start_index > cursor) segments.push({ type: 'text', text: text.slice(cursor, ann.start_index) });
    segments.push({
      type: 'annotated',
      text: text.slice(ann.start_index, ann.end_index),
      correction: ann.correction,
    });
    cursor = ann.end_index;
  }
  if (cursor < text.length) segments.push({ type: 'text', text: text.slice(cursor) });
  return segments;
}

function navigateDocument(direction: number) {
  const currentId = Number(route.params.id);
  const ids = assignedDocumentIds.value;
  if (!ids.length) return;
  const idx = ids.indexOf(currentId);
  if (idx === -1) return;
  let newIdx = idx + direction;
  if (newIdx >= 0 && newIdx < ids.length) {
    router.push(`/anotator/anotasi/${ids[newIdx]}`);
  }
}

async function submitAllAnnotations() {
  const docId = Number(route.params.id);
  try {
    await submitAnnotation({ document: docId });
    toast.success("Dokumen berhasil disubmit");
    router.push('/anotator/anotasi');
  } catch (e) {
    toast.error("Gagal melakukan submit");
  }
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const selectSentence = (sentenceId: number) => {
  const sentence = document.value?.sentences.find((s) => s.id === sentenceId);
  if (sentence) {
    selectedSentence.value = { id: sentenceId, text: sentence.text };
    selectedText.value = "";
    selectedRange.value = null;
  }
};

const clearSelection = () => {
  selectedSentence.value = null;
  selectedText.value = "";
  selectedRange.value = null;
};

const handleTextSelection = () => {
  const area = combinedEditableArea.value;
  if (!area || !selectedSentence.value) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

  const range = selection.getRangeAt(0);
  const targetArea = Array.isArray(area) ? area[0] : area;
  if (!targetArea.contains(range.commonAncestorContainer)) return;

  const selectedStr = selection.toString().trim();
  if (!selectedStr) return;

  const preSelectionRange = range.cloneRange();
  preSelectionRange.selectNodeContents(targetArea);
  preSelectionRange.setEnd(range.startContainer, range.startOffset);

  const startIndex = getOriginalTextLength(preSelectionRange);
  const endIndex = startIndex + selectedStr.length;

  selectedText.value = selectedStr;
  selectedRange.value = { start: startIndex, end: endIndex };
};

function getOriginalTextLength(range: Range): number {
  const fragment = range.cloneContents();
  let length = 0;

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parentEl = node.parentElement;
      const isCorrection = parentEl?.classList.contains('text-green-600');
      if (!isCorrection) {
        length += node.textContent?.length ?? 0;
      }
    } else {
      node.childNodes.forEach(walk);
    }
  };

  walk(fragment);
  return length;
}

function getOriginalSentenceText(sentenceId: number): string {
  return document.value?.sentences.find((s) => s.id === sentenceId)?.text || "";
}

function editAnnotation(annotation: AnnotationResponse) {
  showAnnotationUI.value = true;
  isEditingAnnotation.value = true;
  editingAnnotation.value = annotation;
  selectedSentence.value = {
    id: annotation.sentence,
    text: getOriginalSentenceText(annotation.sentence),
  };
  selectedText.value = getOriginalSentenceText(annotation.sentence).slice(
    annotation.start_index,
    annotation.end_index
  );
  selectedRange.value = {
    start: annotation.start_index,
    end: annotation.end_index,
  };
  correctionInput.value = annotation.correction;
  selectedErrorTypes.value = [String(annotation.error_type)];
  isRequiredInput.value = annotation.is_required;
  commentsInput.value = annotation.comments || "";
}

function getApiAnnotationsForSentence(sentenceId: number) {
  return apiAnnotations.value.filter((a) => a.sentence === sentenceId);
}

function hasAnnotations(sentenceId: number) {
  return apiAnnotations.value.some((a) => a.sentence === sentenceId);
}

function globalKeyHandler(e: KeyboardEvent) {
  if (e.shiftKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
    showSubmitConfirm.value = true;
  }
  if (showAnnotationUI.value || !selectedSentence.value) return;
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    if (canAnnotate.value) showAnnotationUI.value = true;
  }
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault();
    showCombinedHistory.value = true;
  }
  if (e.key.toLowerCase() === "x" && e.shiftKey) {
    e.preventDefault();
    clearSelection();
  }
}

onMounted(async () => {
  await fetchDocument();
  await fetchErrorTypes();
  await fetchApiAnnotations();
  await fetchAssignedDocumentIds();
  window.addEventListener("keydown", globalKeyHandler);
});

onUnmounted(() => {
  window.removeEventListener("keydown", globalKeyHandler);
});

watch(() => route.params.id, async () => {
  await fetchDocument();
  await fetchApiAnnotations();
  await fetchAssignedDocumentIds();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>