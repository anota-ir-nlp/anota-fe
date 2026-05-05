<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter bg-white text-black">
    <div class="w-full max-w-[98vw] mx-auto px-2 sm:px-4 pb-16">
      <div class="bg-white border border-gray-200 rounded-3xl p-6 mb-6">
        <div class="flex items-center justify-between">
          <UButton
            label="Kembali"
            icon="i-heroicons-arrow-left"
            class="rounded-2xl bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 flex items-center px-4 py-2 font-semibold shadow-none"
            @click="router.push('/reviewer/review')"
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
              Review Dokumen
            </h1>
            <div class="text-gray-500 text-sm mt-1" v-if="document">
              Dokumen <span class="font-semibold text-black">#{{ document.id }}</span> &mdash; {{ document.title }}
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <UButton
              icon="i-heroicons-chevron-left"
              class="rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 flex items-center px-3 py-2 shadow-none"
              @click="navigateDocument(-1)"
            />
            <UButton
              icon="i-heroicons-chevron-right"
              class="rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 flex items-center px-3 py-2 shadow-none"
              @click="navigateDocument(1)"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <div class="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm w-full">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-blue-50">
                <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-blue-500" />
              </span>
              <div class="text-lg font-semibold text-black">Raw Dokumen (Acuan)</div>
            </div>
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1 mr-2">
                <UKbd>Shift</UKbd>
                <UKbd>Enter</UKbd>
              </div>
              <UButton
                icon="i-heroicons-clock"
                size="sm"
                class="rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200"
                :disabled="!selectedSentence"
                @click="showCombinedHistory = true"
                variant="ghost"
                label="Riwayat"
              />
              <div class="flex items-center gap-1 ml-2 mr-1">
                <UKbd>Shift</UKbd>
                <UKbd>X</UKbd>
              </div>
              <UButton
                icon="i-heroicons-x-mark"
                size="sm"
                class="rounded-2xl bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"
                :disabled="!selectedSentence"
                @click="clearSelection"
                variant="ghost"
              />
            </div>
          </div>
          
          <hr class="my-4 border-gray-200" />

          <div class="text-black leading-relaxed whitespace-pre-wrap max-h-[35vh] overflow-y-auto text-lg p-2">
            <template v-if="document?.sentences">
              <template v-for="(sentence, idx) in document.sentences" :key="sentence.id">
                <span
                  class="px-1 py-0.5 rounded transition-colors cursor-pointer inline"
                  :class="[
                    selectedSentence?.id === sentence.id ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-blue-50',
                    hasReviewerAnnotations(sentence.id) ? 'border-b-2 border-dashed border-blue-500' : '',
                    selectedSentence && selectedSentence.id !== sentence.id ? 'opacity-40 pointer-events-none' : ''
                  ]"
                  @click="selectSentence(sentence.id)"
                >
                  {{ sentence.text }}
                </span>
                <span v-if="idx as number < (document?.sentences?.length || 0) - 1"> </span>
              </template>
            </template>
          </div>

          <div v-if="selectedSentence" class="mt-6 pt-4 border-t border-gray-200 animate-fade-in bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-3xl">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-base font-bold text-gray-800 flex items-center gap-2">
                <UIcon name="i-heroicons-check-badge" class="w-6 h-6 text-green-500" />
                Validasi Kalimat #{{ selectedSentence.id }}
              </h4>
            </div>

            <div v-if="getAnnotatorAnnotationsForSentence(selectedSentence.id).length === 0" class="text-center py-6 bg-white rounded-xl border border-gray-200">
              <p class="text-gray-500 text-sm italic">Kalimat ini tidak dianotasi oleh siapapun.</p>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[35vh] overflow-y-auto">
              <div v-for="ann in getAnnotatorAnnotationsForSentence(selectedSentence.id)" :key="ann.id" class="p-4 bg-white border rounded-2xl shadow-sm transition-all flex flex-col justify-between" :class="isAnnotationAccepted(ann) ? 'border-green-400 bg-green-50' : 'border-gray-200'">
                <div class="flex flex-col gap-3 mb-4">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="text-xs font-bold text-blue-600 uppercase mb-2 flex items-center gap-1">
                        <UIcon name="i-heroicons-user" class="w-3 h-3" />
                        {{ getAnnotatorName(ann) }}
                      </div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-sm line-through text-red-400">{{ getOriginalTextFromRange(ann) }}</span>
                        <UIcon name="i-heroicons-arrow-long-right" class="text-gray-400" />
                        <span class="text-sm font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">{{ ann.correction }}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span class="text-[10px] text-orange-600 font-mono bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                      {{ ann.error_type_details?.error_code }}
                    </span>
                  </div>
                </div>
                <div class="flex gap-2">
                  <UButton
                    v-if="!isAnnotationAccepted(ann)"
                    icon="i-heroicons-check"
                    label="Terima"
                    class="flex-1 justify-center bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold"
                    @click="toggleAcceptAnnotation(ann)"
                    :loading="actionLoading === ann.id"
                  />
                  <UButton
                    v-else
                    icon="i-heroicons-x-mark"
                    label="Batalkan"
                    class="flex-1 justify-center bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 rounded-xl font-bold"
                    @click="toggleAcceptAnnotation(ann)"
                    :loading="actionLoading === ann.id"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div :class="['grid gap-6 items-start', annotators.length > 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1']">
          <div v-for="(annotator, index) in annotators" :key="annotator.id" class="bg-gray-50 border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col h-full">
            <div class="flex items-center gap-4 mb-4">
              <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-orange-200 bg-orange-50">
                <UIcon name="i-heroicons-user" class="w-5 h-5 text-orange-500" />
              </span>
              <div class="text-lg font-semibold text-black">Hasil Anotasi - {{ annotator.name }}</div>
            </div>
            <hr class="my-4 border-gray-200" />

            <div class="rounded-2xl p-6 flex-1 max-h-[50vh] overflow-y-auto text-lg text-black bg-white border border-gray-100 shadow-inner leading-relaxed">
              <template v-if="document?.sentences">
                <template v-for="(sentence, idx) in document.sentences" :key="'preview-' + annotator.id + '-' + sentence.id">
                  <span class="inline">
                    <template v-for="(seg, i) in buildSegmentsForAnnotator(sentence.id, annotator.id)" :key="i">
                      <span v-if="seg.type === 'annotation'" class="inline-flex flex-col-reverse items-center align-baseline leading-snug mx-px">
                        <span class="text-[1em] text-green-600 font-semibold bg-green-100 rounded px-1 leading-snug whitespace-nowrap">
                          {{ seg.correction }}
                        </span>
                        <span class="text-[1em] text-gray-500 line-through leading-snug whitespace-nowrap">
                          {{ seg.original }}
                        </span>
                      </span>
                      <span v-else>{{ seg.text }}</span>
                    </template>
                  </span>
                  <span v-if="idx as number < (document?.sentences?.length || 0) - 1"> </span>
                </template>
              </template>
            </div>
          </div>

          <div v-if="annotators.length === 0" class="bg-gray-50 border border-gray-200 rounded-3xl p-10 shadow-sm text-center flex flex-col items-center justify-center">
            <UIcon name="i-heroicons-document-magnifying-glass" class="w-12 h-12 text-gray-300 mb-3" />
            <p class="text-gray-500 font-medium">Belum ada anotasi dari annotator pada dokumen ini.</p>
          </div>
        </div>
      </div>

      <div class="sticky bottom-0 mt-6 z-40">
        <div class="bg-black border border-gray-900 rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl">
          <div class="text-sm text-gray-300">
            Review Diterima: <span class="text-white font-bold text-lg bg-gray-800 px-3 py-1 rounded-lg ml-2">{{ apiAnnotations.length }}</span>
          </div>
          <UButton
            icon="i-heroicons-paper-airplane"
            class="rounded-2xl bg-green-500 text-white hover:bg-green-600 flex items-center px-8 py-2.5 shadow-none font-bold text-base"
            @click="submitAllAnnotations"
          >
            Submit Review Final
          </UButton>
        </div>
      </div>
    </div>

    <teleport to="body">
      <div
        v-if="showCombinedHistory"
        :style="popupStyle"
        class="fixed z-50 bg-white border border-gray-300 rounded-2xl p-6 shadow-xl min-w-[360px] max-w-[90vw] max-h-[80vh] my-4 overflow-y-auto cursor-move"
        @mousedown="startDrag"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold flex items-center gap-2 text-black">
            <UIcon name="i-heroicons-clock" class="w-5 h-5 text-blue-500" />
            Ringkasan Review
          </h3>
          <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="showCombinedHistory = false" class="bg-black text-white" />
        </div>
        <div class="space-y-3">
          <div v-if="apiAnnotations.length === 0" class="text-center py-8">
            <p class="text-gray-500 italic">Belum ada review yang disimpan</p>
          </div>
          <div v-for="ann in apiAnnotations" :key="ann.id" class="p-3 bg-blue-50 rounded-lg border border-blue-100">
             <div class="flex items-center justify-between mb-2 text-xs">
                <span class="font-bold text-blue-800">Kalimat #{{ ann.sentence }}</span>
             </div>
             <div class="text-sm text-black px-2 py-1 bg-white rounded border">{{ ann.correction }}</div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserDocumentsApi } from "~/data/user-documents";
import { useReviewsApi } from "~/data/reviews";
import { toast } from "vue-sonner";

const route = useRoute();
const router = useRouter();

const { getAssignedDocument, getAssignedDocuments } = useUserDocumentsApi();
const { getReviews, createReview, deleteReview, submitReview, getReviewQueue } = useReviewsApi();

const document = ref<any>(null);
const apiAnnotations = ref<any[]>([]);
const annotatorInitialData = ref<any[]>([]);
const assignedDocumentIds = ref<number[]>([]);

const selectedSentence = ref<any>(null);
const showCombinedHistory = ref(false);
const actionLoading = ref<number | null>(null);

const annotators = computed(() => {
  const map = new Map();
  annotatorInitialData.value.forEach(a => {
    const id = a.annotator?.id || a.annotator_id || a.created_by?.id || 1;
    const name = a.annotator?.full_name || a.annotator?.username || a.created_by?.full_name || `Annotator ${id}`;
    if (!map.has(id)) {
      map.set(id, { id, name });
    }
  });
  
  const list = Array.from(map.values());

  while (list.length < 2) {
    const fallbackId = list.length + 1;
    list.push({ id: fallbackId, name: `Annotator ${fallbackId}` });
  }

  return list;
});

async function fetchDocument() {
  const result = await getAssignedDocument(Number(route.params.id));
  document.value = result;
}

async function fetchApiAnnotations() {
  const all = await getReviews();
  const docId = Number(route.params.id);
  const arr = Array.isArray(all) ? all : (all?.results || []);
  apiAnnotations.value = arr.filter((a: any) => Number(a.document) === docId);
}

async function fetchAnnotatorQueue() {
  const docId = Number(route.params.id);
  const queue: any = await getReviewQueue(docId);
  if (queue?.sentences) {
    annotatorInitialData.value = queue.sentences.flatMap((s: any) => 
      s.annotations.map((a: any) => ({ ...a, sentence: s.sentence_id }))
    );
  } else {
    annotatorInitialData.value = [];
  }
}

function selectSentence(sentenceId: number) {
  const sentence = document.value?.sentences.find((s: any) => s.id === sentenceId);
  if (sentence) {
    selectedSentence.value = { id: sentenceId, text: sentence.text };
  }
}

function clearSelection() {
  selectedSentence.value = null;
}

function isAnnotationAccepted(ann: any) {
  return apiAnnotations.value.some(a => 
    Number(a.sentence) === Number(ann.sentence) && 
    Number(a.start_index) === Number(ann.start_index) && 
    Number(a.end_index) === Number(ann.end_index)
  );
}

function getAnnotatorName(ann: any) {
  const id = ann.annotator?.id || ann.annotator_id || ann.created_by?.id || 1;
  const name = ann.annotator?.full_name || ann.annotator?.username || ann.created_by?.full_name || `Annotator ${id}`;
  return name;
}

async function toggleAcceptAnnotation(ann: any) {
  actionLoading.value = ann.id;
  try {
    const existing = apiAnnotations.value.find(a => 
      Number(a.sentence) === Number(ann.sentence) && 
      Number(a.start_index) === Number(ann.start_index) && 
      Number(a.end_index) === Number(ann.end_index)
    );

    if (existing) {
      await deleteReview(existing.id);
      toast.success("Review dibatalkan");
    } else {
      await createReview({
        document: Number(route.params.id),
        sentence: Number(ann.sentence),
        start_index: Number(ann.start_index),
        end_index: Number(ann.end_index),
        error_type: Number(ann.error_type || ann.error_type_details?.id),
        correction: ann.correction,
        is_required: true,
        annotation: ann.id
      });
      toast.success("Review diterima");
    }
    await fetchApiAnnotations();
  } catch (err) {
    toast.error("Gagal memproses review");
  } finally {
    actionLoading.value = null;
  }
}

function buildSegmentsForAnnotator(sentenceId: number, annotatorId: number): any[] {
  const sentence = document.value?.sentences.find((s: any) => s.id === sentenceId);
  if (!sentence) return [];
  const text = sentence.text;
  
  const annotations = annotatorInitialData.value
    .filter((a) => {
      const aId = a.annotator?.id || a.annotator_id || a.created_by?.id || 1;
      return a.sentence === sentenceId && aId === annotatorId;
    })
    .sort((a, b) => a.start_index - b.start_index);

  if (!annotations.length) return [{ type: 'text', text }];

  const segments = [];
  let lastIdx = 0;
  annotations.forEach(ann => {
    if (ann.start_index > lastIdx) {
      segments.push({ type: 'text', text: text.slice(lastIdx, ann.start_index) });
    }
    segments.push({ 
      type: 'annotation', 
      original: text.slice(ann.start_index, ann.end_index), 
      correction: ann.correction 
    });
    lastIdx = ann.end_index;
  });
  if (lastIdx < text.length) segments.push({ type: 'text', text: text.slice(lastIdx) });
  return segments;
}

function getOriginalTextFromRange(ann: any) {
  const sentence = document.value?.sentences.find((s: any) => s.id === ann.sentence);
  return sentence ? sentence.text.slice(ann.start_index, ann.end_index) : '';
}

function hasReviewerAnnotations(id: number) {
  return apiAnnotations.value.some(a => Number(a.sentence) === id);
}

function getAnnotatorAnnotationsForSentence(id: number) {
  return annotatorInitialData.value.filter(a => a.sentence === id);
}

async function submitAllAnnotations() {
  await submitReview({ document: Number(route.params.id) });
  toast.success("Review final berhasil disubmit");
  router.push('/reviewer/review');
}

async function navigateDocument(dir: number) {
  const currentId = Number(route.params.id);
  const idx = assignedDocumentIds.value.indexOf(currentId);
  const nextId = assignedDocumentIds.value[idx + dir];
  if (nextId) router.push(`/reviewer/review/${nextId}`);
}

const handleKeyboard = (e: KeyboardEvent) => {
  if (e.shiftKey && e.key === 'Enter') {
    e.preventDefault();
    if (selectedSentence.value) showCombinedHistory.value = true;
  }
  if (e.shiftKey && (e.key === 'X' || e.key === 'x')) {
    e.preventDefault();
    clearSelection();
  }
};

const popupPosition = ref({ x: 100, y: 100 });
const popupStyle = computed(() => ({ 
  left: `${popupPosition.value.x}px`, 
  top: `${popupPosition.value.y}px`, 
  position: 'fixed' as const 
}));

function startDrag(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('button')) return;
  const offX = e.clientX - popupPosition.value.x;
  const offY = e.clientY - popupPosition.value.y;
  const onMove = (me: MouseEvent) => { 
    popupPosition.value = { x: me.clientX - offX, y: me.clientY - offY }; 
  };
  const onUp = () => { 
    window.removeEventListener('mousemove', onMove); 
    window.removeEventListener('mouseup', onUp); 
  };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeyboard);
  await fetchDocument();
  await fetchApiAnnotations();
  await fetchAnnotatorQueue();
  const docs = await getAssignedDocuments();
  assignedDocumentIds.value = docs?.results?.map((d: any) => Number(d.id)).sort((a: any, b: any) => a - b) || [];
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard);
});

watch(() => route.params.id, async () => {
  await fetchDocument();
  await fetchApiAnnotations();
  await fetchAnnotatorQueue();
});
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>