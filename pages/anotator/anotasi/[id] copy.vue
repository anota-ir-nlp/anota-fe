<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white font-inter px-4 py-6"
  >
    <div class="max-w-7xl mx-auto">
      <!-- Header Row: Full Width -->
      <div
        class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg p-6 mb-6"
      >
        <div class="flex items-center justify-between">
          <!-- Left: Kembali Button -->
          <UButton
            label="Kembali"
            icon="i-heroicons-arrow-left"
            color="neutral"
            variant="ghost"
            class="rounded-full px-4 py-2 font-semibold"
            @click="router.back()"
            title="Kembali"
          />

          <!-- Center: Title and Document Info -->
          <div class="text-center flex-1">
            <h1
              class="text-2xl font-bold flex items-center gap-2 justify-center"
            >
              <UIcon
                name="i-heroicons-document-text"
                class="w-6 h-6 text-blue-400"
              />
              Anotasi Dokumen
            </h1>
            <div class="text-gray-400 text-sm mt-1" v-if="document">
              Dokumen
              <span class="font-semibold text-white">#{{ document.id }}</span>
              &mdash; {{ document.title }}
            </div>
          </div>

          <!-- Right: Navigation Buttons -->
          <div class="flex gap-2">
            <UButton
              icon="i-heroicons-chevron-left"
              color="neutral"
              variant="ghost"
              class="rounded-full px-3 py-2"
              title="Dokumen Sebelumnya"
              @click="navigateDocument(-1)"
            />
            <UButton
              icon="i-heroicons-chevron-right"
              color="neutral"
              variant="ghost"
              class="rounded-full px-3 py-2"
              title="Dokumen Selanjutnya"
              @click="navigateDocument(1)"
            />
          </div>
        </div>
      </div>

      <!-- View Mode Tabs -->
      <div
        class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg p-4 mb-6"
      >
        <div class="flex gap-2">
          <button
            v-for="mode in viewModes"
            :key="mode.id"
            @click="currentViewMode = mode.id"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="
              currentViewMode === mode.id
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            "
          >
            <UIcon :name="mode.icon" class="w-4 h-4 mr-2" />
            {{ mode.label }}
          </button>

          <!-- Debug Toggle -->
          <button
            @click="showDebug = !showDebug"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            :class="
              showDebug
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            "
          >
            <UIcon name="i-heroicons-bug-ant" class="w-4 h-4 mr-2" />
            Debug
          </button>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="grid gap-6" :class="getGridLayout()">
        <!-- Teks Asli Column -->
        <div
          v-if="showTeksAsli"
          class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg p-6"
        >
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-heroicons-document" class="w-5 h-5 text-blue-400" />
            <h2 class="text-lg font-semibold">Teks Asli</h2>
          </div>

          <div v-if="isLoading" class="text-center py-8">
            <span class="text-gray-400">Memuat dokumen...</span>
          </div>

          <div v-else-if="document" class="space-y-4">
            <!-- Document Info Badges -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                class="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
              >
                <UIcon name="i-heroicons-document" class="w-3 h-3" />
                Dokumen
              </span>
              <span
                class="bg-gray-500/20 text-gray-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
              >
                <UIcon name="i-heroicons-calendar" class="w-3 h-3" />
                {{ formatDate(document.created_at) }}
              </span>
              <span
                class="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
              >
                <UIcon name="i-heroicons-list-bullet" class="w-3 h-3" />
                {{ document.sentences.length }} kalimat
              </span>
            </div>

            <!-- Original Text Content -->
            <div class="bg-gray-900/30 rounded-lg p-4 border border-gray-700">
              <div class="text-white leading-relaxed whitespace-pre-wrap">
                <template
                  v-for="(sentence, index) in document?.sentences"
                  :key="sentence.id"
                >
                  <span
                    class="sentence-selector cursor-pointer hover:bg-blue-500/20 px-1 py-0.5 rounded transition-colors"
                    :class="{
                      'bg-blue-500/20': selectedSentence?.id === sentence.id,
                    }"
                    @click="selectSentence(sentence.id)"
                    :title="`Klik untuk memilih kalimat #${sentence.id}`"
                  >
                    {{ sentence.text }}
                  </span>
                  <span
                    v-if="index < document.sentences.length - 1"
                    class="text-gray-400"
                  >
                  </span>
                </template>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <span class="text-red-400">Dokumen tidak ditemukan</span>
          </div>
        </div>

        <!-- Anotasi Kalimat Column -->
        <div
          v-if="showAnotasiKalimat"
          class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg p-6"
        >
          <div class="flex items-center gap-2 mb-4">
            <UIcon
              name="i-heroicons-pencil-square"
              class="w-5 h-5 text-blue-400"
            />
            <h2 class="text-lg font-semibold">Anotasi Kalimat</h2>
          </div>

          <!-- Selected Sentence Info -->
          <div
            v-if="selectedSentence"
            class="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-blue-300 font-medium">
                Kalimat Terpilih #{{ selectedSentence.id }}
              </span>
              <UButton
                icon="i-heroicons-x-mark"
                color="neutral"
                variant="ghost"
                size="sm"
                @click="clearSelection"
              />
            </div>
            <div class="text-white text-sm mb-3">
              {{ getCurrentSentenceText(selectedSentence.id) }}
            </div>

            <!-- Annotation Controls -->
            <div class="flex items-center gap-2 mb-2">
              <UIcon
                name="i-heroicons-cursor-arrow-rays"
                class="w-4 h-4 text-blue-400"
              />
              <span class="text-sm text-blue-300"
                >Pilih teks dalam kalimat untuk anotasi</span
              >
            </div>
            <div class="flex gap-2">
              <UButton
                label="Anotasi"
                icon="i-heroicons-plus-circle"
                color="primary"
                size="sm"
                :disabled="!canAnnotate"
                @click="showAnnotationUI = true"
              />
              <span
                v-if="selectedText"
                class="text-xs text-gray-400 self-center"
              >
                Terpilih: "{{ selectedText }}"
              </span>
            </div>
          </div>

          <!-- Sentence Selection Instructions -->
          <div
            v-else
            class="mb-4 p-4 bg-gray-500/10 border border-gray-500/30 rounded-lg"
          >
            <div class="flex items-center gap-2 mb-2">
              <UIcon
                name="i-heroicons-cursor-arrow-rays"
                class="w-4 h-4 text-gray-400"
              />
              <span class="text-sm text-gray-300"
                >Klik kalimat untuk memulai anotasi</span
              >
            </div>
          </div>

          <!-- Annotated Text Content -->
          <div class="bg-gray-900/30 rounded-lg p-4 border border-gray-700">
            <div
              ref="editableArea"
              class="text-white leading-relaxed whitespace-pre-wrap select-text relative"
              @mouseup="handleTextSelection"
            >
              <template
                v-for="(segment, index) in documentSegments"
                :key="index"
              >
                <!-- Text segment -->
                <span v-if="segment.type === 'text'" class="relative">
                  {{ segment.text }}
                </span>

                <!-- Annotation chip -->
                <span
                  v-else-if="
                    segment.type === 'annotation' && segment.annotation
                  "
                  class="relative inline-block"
                >
                  <span
                    class="annotation-chip"
                    :class="getChipColor(segment.annotation.color)"
                    @click="viewAnnotation(segment.annotation)"
                    @mouseenter="hoveredAnnotation = segment.annotation"
                    @mouseleave="hoveredAnnotation = null"
                  >
                    {{ segment.annotation.correction }}
                    <div
                      v-if="hoveredAnnotation === segment.annotation"
                      class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-sm z-50 whitespace-nowrap"
                    >
                      <div class="flex flex-wrap gap-1 mb-1">
                        <span
                          v-for="errorType in segment.annotation.errorTypes"
                          :key="errorType"
                          class="bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded text-xs"
                        >
                          {{ errorType }}
                        </span>
                      </div>
                      <div class="text-xs text-gray-400">
                        "{{ segment.annotation.original }}"
                      </div>
                      <div
                        class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
                      ></div>
                    </div>
                  </span>
                </span>

                <!-- Line break -->
                <br v-else-if="segment.type === 'br'" />
              </template>
            </div>
          </div>
        </div>

        <!-- History Column -->
        <div
          v-if="showHistory"
          class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-lg p-6"
        >
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-heroicons-clock" class="w-5 h-5 text-blue-400" />
            <h2 class="text-lg font-semibold">
              {{
                selectedSentence
                  ? `Riwayat Kalimat #${selectedSentence.id}`
                  : "Riwayat Anotasi"
              }}
            </h2>
          </div>

          <div v-if="!selectedSentence" class="text-center py-8">
            <UIcon
              name="i-heroicons-cursor-arrow-rays"
              class="w-12 h-12 text-gray-500 mx-auto mb-4"
            />
            <p class="text-gray-400">Pilih kalimat untuk melihat riwayat</p>
          </div>

          <div
            v-else-if="getSentenceAnnotations(selectedSentence.id).length === 0"
            class="text-center py-8"
          >
            <UIcon
              name="i-heroicons-clock"
              class="w-12 h-12 text-gray-500 mx-auto mb-4"
            />
            <p class="text-gray-400">Belum ada anotasi untuk kalimat ini</p>
          </div>

          <div v-else class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="(annotation, index) in getSentenceAnnotations(
                selectedSentence.id
              )"
              :key="annotation.id"
              class="p-3 bg-gray-800/50 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700/50 transition-colors"
              @click="viewAnnotation(annotation)"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-blue-400 font-medium">
                  Anotasi #{{ index + 1 }}
                </span>
                <span class="text-xs text-gray-400">
                  {{ formatDate(annotation.timestamp) }}
                </span>
              </div>
              <div class="text-sm">
                <div class="text-gray-400 mb-1">Sebelum:</div>
                <div class="text-white mb-2">{{ annotation.original }}</div>
                <div class="text-gray-400 mb-1">Sesudah:</div>
                <div class="text-green-400">{{ annotation.correction }}</div>
              </div>
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="errorType in annotation.errorTypes"
                  :key="errorType"
                  class="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs"
                >
                  {{ errorType }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Debug Panel -->
        <div
          v-if="showDebug"
          class="bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-3xl shadow-lg p-6"
        >
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-heroicons-bug-ant" class="w-5 h-5 text-red-400" />
            <h2 class="text-lg font-semibold text-red-300">Debug Panel</h2>
            <UButton
              icon="i-heroicons-x-mark"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="showDebug = false"
            />
          </div>

          <div class="space-y-4 text-sm">
            <!-- Selected Sentence Info -->
            <div class="bg-red-900/30 p-3 rounded border border-red-500/50">
              <h3 class="font-semibold text-red-300 mb-2">
                Selected Sentence:
              </h3>
              <div v-if="selectedSentence" class="space-y-1">
                <div>
                  <span class="text-red-400">ID:</span>
                  {{ selectedSentence.id }}
                </div>
                <div>
                  <span class="text-red-400">Original:</span> "{{
                    selectedSentence.text
                  }}"
                </div>
                <div>
                  <span class="text-red-400">Current:</span> "{{
                    getCurrentSentenceText(selectedSentence.id)
                  }}"
                </div>
              </div>
              <div v-else class="text-red-400">No sentence selected</div>
            </div>

            <!-- Text Selection Info -->
            <div class="bg-red-900/30 p-3 rounded border border-red-500/50">
              <h3 class="font-semibold text-red-300 mb-2">Text Selection:</h3>
              <div class="space-y-1">
                <div>
                  <span class="text-red-400">Selected Text:</span> "{{
                    selectedText
                  }}"
                </div>
                <div>
                  <span class="text-red-400">Range:</span>
                  {{
                    selectedRange
                      ? `${selectedRange.start}-${selectedRange.end}`
                      : "None"
                  }}
                </div>
                <div>
                  <span class="text-red-400">Can Annotate:</span>
                  {{ canAnnotate }}
                </div>
              </div>
            </div>

            <!-- Annotations Info -->
            <div class="bg-red-900/30 p-3 rounded border border-red-500/50">
              <h3 class="font-semibold text-red-300 mb-2">Annotations:</h3>
              <div v-if="selectedSentence" class="space-y-2">
                <div
                  v-for="(annotation, index) in getSentenceAnnotations(
                    selectedSentence.id
                  )"
                  :key="annotation.id"
                  class="bg-red-800/30 p-2 rounded"
                >
                  <div class="font-medium text-red-300">
                    Annotation #{{ index + 1 }}:
                  </div>
                  <div class="text-xs space-y-1">
                    <div>
                      <span class="text-red-400">Original:</span> "{{
                        annotation.original
                      }}"
                    </div>
                    <div>
                      <span class="text-red-400">Correction:</span> "{{
                        annotation.correction
                      }}"
                    </div>
                    <div>
                      <span class="text-red-400">Positions:</span>
                      {{ annotation.start }}-{{ annotation.end }}
                    </div>
                    <div>
                      <span class="text-red-400">Error Types:</span>
                      {{ annotation.errorTypes.join(", ") }}
                    </div>
                    <div>
                      <span class="text-red-400">M2:</span>
                      {{ generateM2ForAnnotation(annotation) }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-red-400">No sentence selected</div>
            </div>

            <!-- Latest Annotation Info -->
            <div class="bg-red-900/30 p-3 rounded border border-red-500/50">
              <h3 class="font-semibold text-red-300 mb-2">
                Latest Annotation:
              </h3>
              <div
                v-if="
                  selectedSentence && getLatestAnnotation(selectedSentence.id)
                "
                class="space-y-1"
              >
                <div>
                  <span class="text-red-400">Original:</span> "{{
                    getLatestAnnotation(selectedSentence.id)?.original
                  }}"
                </div>
                <div>
                  <span class="text-red-400">Correction:</span> "{{
                    getLatestAnnotation(selectedSentence.id)?.correction
                  }}"
                </div>
                <div>
                  <span class="text-red-400">Positions:</span>
                  {{ getLatestAnnotation(selectedSentence.id)?.start }}-{{
                    getLatestAnnotation(selectedSentence.id)?.end
                  }}
                </div>
                <div>
                  <span class="text-red-400">Found in current text at:</span>
                  {{
                    getCurrentSentenceText(selectedSentence.id).indexOf(
                      getLatestAnnotation(selectedSentence.id)?.correction || ""
                    )
                  }}
                </div>
              </div>
              <div v-else class="text-red-400">No latest annotation</div>
            </div>

            <!-- Debug Actions -->
            <div class="bg-red-900/30 p-3 rounded border border-red-500/50">
              <h3 class="font-semibold text-red-300 mb-2">Debug Actions:</h3>
              <div class="flex gap-2">
                <UButton
                  label="Clear All Annotations"
                  color="error"
                  size="sm"
                  @click="clearAllAnnotations"
                />
                <UButton
                  label="Log Current State"
                  color="neutral"
                  size="sm"
                  @click="logCurrentState"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Annotation UI -->
    <div
      v-if="showAnnotationUI"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="showAnnotationUI = false"
    >
      <div
        class="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md mx-4"
        @click.stop
      >
        <h3 class="text-lg font-semibold mb-4">Buat Anotasi</h3>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Teks Terpilih:</label>
            <div class="bg-gray-800 p-3 rounded border border-gray-600 text-sm">
              "{{ selectedText }}"
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Koreksi:</label>
            <UInput
              v-model="correctionInput"
              placeholder="Masukkan koreksi"
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Tipe Error:</label>
            <select
              v-model="selectedErrorTypes"
              multiple
              class="w-full bg-gray-800 border border-gray-600 rounded p-2 text-sm"
            >
              <option value="Spelling">Spelling</option>
              <option value="Grammar">Grammar</option>
              <option value="Punctuation">Punctuation</option>
              <option value="Word Choice">Word Choice</option>
              <option value="Sentence Structure">Sentence Structure</option>
            </select>
          </div>

          <div class="flex gap-2 pt-4">
            <UButton
              label="Simpan"
              color="primary"
              @click="saveAnnotation"
              :disabled="!correctionInput || selectedErrorTypes.length === 0"
            />
            <UButton
              label="Batal"
              color="neutral"
              variant="ghost"
              @click="showAnnotationUI = false"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Annotation Detail Modal -->
    <div
      v-if="showAnnotationModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click="showAnnotationModal = false"
    >
      <div
        class="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Detail Anotasi</h3>
          <UButton
            icon="i-heroicons-x-mark"
            color="neutral"
            variant="ghost"
            @click="showAnnotationModal = false"
          />
        </div>

        <div v-if="selectedAnnotation" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium mb-2 text-red-400">Sebelum:</h4>
              <div class="bg-gray-800 p-3 rounded border border-gray-600">
                {{ selectedAnnotation.original }}
              </div>
            </div>
            <div>
              <h4 class="font-medium mb-2 text-green-400">Sesudah:</h4>
              <div class="bg-gray-800 p-3 rounded border border-gray-600">
                {{ selectedAnnotation.correction }}
              </div>
            </div>
          </div>

          <div>
            <h4 class="font-medium mb-2">Tipe Error:</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="errorType in selectedAnnotation.errorTypes"
                :key="errorType"
                class="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm"
              >
                {{ errorType }}
              </span>
            </div>
          </div>

          <div>
            <h4 class="font-medium mb-2">M2 Format:</h4>
            <div
              class="bg-gray-800 p-3 rounded border border-gray-600 font-mono text-sm"
            >
              {{ generateM2ForAnnotation(selectedAnnotation) }}
            </div>
          </div>

          <div class="flex gap-2 pt-4">
            <UButton
              label="Hapus Anotasi"
              color="error"
              @click="deleteAnnotation(selectedAnnotation)"
            />
            <UButton
              label="Tutup"
              color="neutral"
              variant="ghost"
              @click="showAnnotationModal = false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
<<<<<<< HEAD
import { ref, computed, onMounted, watch } from "vue";
=======
import { ref, computed, onMounted } from "vue";
>>>>>>> d817870a3b8460585aa07cf2b2cc5ce52b2a2533
import { useRoute, useRouter } from "vue-router";
import { useTextSelection } from "@vueuse/core";
import { useDocumentsApi } from "~/data/documents";
<<<<<<< HEAD
import type { DocumentResponse, AnnotationResponse } from "~/types/api";
=======
import { useAnnotationsApi } from "~/data/annotations";
import { useErrorTypesApi } from "~/data/error-types";
import type { DocumentResponse, SentenceResponse, AnnotationResponse, ErrorTypeResponse } from "~/types/api";
import { toast } from "vue-sonner";
>>>>>>> d817870a3b8460585aa07cf2b2cc5ce52b2a2533

const route = useRoute();
const router = useRouter();

// Get the documents API
const { getDocument } = useDocumentsApi();

// Document data
const document = ref<DocumentResponse | null>(null);
const isLoading = ref(true);

// View modes
const viewModes = [
  { id: "split", label: "Split Screen", icon: "i-heroicons-squares-2x2" },
  { id: "original", label: "Teks Asli", icon: "i-heroicons-document" },
  {
    id: "annotation",
    label: "Anotasi + History",
    icon: "i-heroicons-pencil-square",
  },
  { id: "history", label: "History", icon: "i-heroicons-clock" },
];
const currentViewMode = ref("split");

// Sentence selection
const selectedSentence = ref<{ id: number; text: string } | null>(null);

// Text selection within sentence
const { text: selectedTextVueuse } = useTextSelection();
const editableArea = ref<HTMLElement>();
const selectedText = ref("");
const selectedRange = ref<{ start: number; end: number } | null>(null);
const canAnnotate = computed(
  () => selectedText.value && selectedText.value.trim().length > 0
);

// Annotation state
const showAnnotationUI = ref(false);
const correctionInput = ref("");
const selectedErrorTypes = ref<string[]>([]);
const annotations = ref<Annotation[]>([]);
const hoveredAnnotation = ref<Annotation | null>(null);
const showAnnotationModal = ref(false);
const selectedAnnotation = ref<Annotation | null>(null);

// Debug state
const showDebug = ref(false);

// Computed properties for view modes
const showTeksAsli = computed(
  () =>
    currentViewMode.value === "split" || currentViewMode.value === "original"
);
const showAnotasiKalimat = computed(
  () =>
    currentViewMode.value === "split" || currentViewMode.value === "annotation"
);
const showHistory = computed(
  () =>
    currentViewMode.value === "split" ||
    currentViewMode.value === "annotation" ||
    currentViewMode.value === "history"
);

// Types
interface Annotation {
  id: string;
  sentenceId: number;
  original: string;
  correction: string;
  errorTypes: string[];
  color: string;
  start: number;
  end: number;
  timestamp: Date;
}

// Grid layout based on view mode
function getGridLayout() {
  if (showDebug.value) {
    return "grid-cols-1 lg:grid-cols-4";
  }

  switch (currentViewMode.value) {
    case "split":
      return "grid-cols-1 lg:grid-cols-3";
    case "original":
      return "grid-cols-1";
    case "annotation":
      return "grid-cols-1 lg:grid-cols-2";
    case "history":
      return "grid-cols-1";
    default:
      return "grid-cols-1 lg:grid-cols-3";
  }
}

<<<<<<< HEAD
//FIX: TEXT SELECTION - Gets selected text and calculates current positions
function handleTextSelection() {
  if (!editableArea.value || !selectedSentence.value) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  if (!editableArea.value.contains(range.commonAncestorContainer)) return;

  //FIX: Get the selected text including spaces
  selectedText.value = selection.toString();

  //FIX: Get the current modified text (with previous annotations applied)
  const currentSentenceText = getCurrentSentenceText(selectedSentence.value.id);

  //FIX: Find the selected text in the current modified text
  const startIndex = currentSentenceText.indexOf(selectedText.value);

  if (startIndex === -1) {
    console.error("Selected text not found in current sentence");
=======
async function saveAnnotation() {
  if (!selectedSentenceData.value || !selectedErrorType.value || !correctionInput.value.trim()) {
    toast.message("Validasi Error", {
      description: "Mohon lengkapi semua field yang diperlukan",
    });
>>>>>>> d817870a3b8460585aa07cf2b2cc5ce52b2a2533
    return;
  }

  //FIX: Use current positions (not original positions)
  const endIndex = startIndex + selectedText.value.length;

<<<<<<< HEAD
  selectedRange.value = {
    start: startIndex,
    end: endIndex,
  };

  console.log(
    `//FIX: Selected "${selectedText.value}" at positions ${startIndex}-${endIndex} in current text`
  );
  console.log(`//FIX: Selected text length: ${selectedText.value.length}`);
  console.log(`//FIX: Selected text includes spaces: "${selectedText.value}"`);
}

//FIX: ANNOTATION SAVING - Creates new annotation with current positions
function saveAnnotation() {
  if (
    !selectedText.value ||
    !correctionInput.value ||
    selectedErrorTypes.value.length === 0 ||
    !selectedRange.value ||
    !selectedSentence.value
  )
    return;

  //FIX: Trim the correction to prevent extra spaces
  const trimmedCorrection = correctionInput.value.trim();

  //FIX: Create new annotation with current positions
  const annotation: Annotation = {
    id: Date.now().toString(),
    sentenceId: selectedSentence.value.id,
    original: selectedText.value,
    correction: trimmedCorrection,
    errorTypes: [...selectedErrorTypes.value],
    color: getRandomColor(),
    start: selectedRange.value.start,
    end: selectedRange.value.end,
    timestamp: new Date(),
  };

  console.log(
    `//FIX: Creating annotation "${annotation.original}" -> "${annotation.correction}" at positions ${annotation.start}-${annotation.end}`
  );
  console.log(
    `//FIX: Original length: ${annotation.original.length}, Correction length: ${annotation.correction.length}`
  );

  annotations.value.push(annotation);

  // Reset form
  selectedText.value = "";
  correctionInput.value = "";
  selectedErrorTypes.value = [];
  selectedRange.value = null;
  showAnnotationUI.value = false;
}

function viewAnnotation(annotation: Annotation) {
  selectedAnnotation.value = annotation;
  showAnnotationModal.value = true;
}

function deleteAnnotation(annotation: Annotation) {
  const index = annotations.value.findIndex((a) => a.id === annotation.id);
  if (index !== -1) {
    annotations.value.splice(index, 1);
  }
  showAnnotationModal.value = false;
  selectedAnnotation.value = null;
}

function getRandomColor() {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-pink-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getChipColor(color: string) {
  return color;
}

//FIX: M2 FORMAT GENERATION - Uses current annotation positions
function generateM2ForAnnotation(annotation: Annotation) {
  //FIX: M2 format: A start end|||error_types|||correction|||REQUIRED|||-NONE-|||0
  //FIX: Uses current positions from the annotation object
  const m2Format = `A ${annotation.start} ${
    annotation.end
  }|||${annotation.errorTypes.join(";")}|||${
    annotation.correction
  }|||REQUIRED|||-NONE-|||0`;
  console.log(`//FIX: Generated M2 format: ${m2Format}`);
  return m2Format;
}

//FIX: TEXT REPLACEMENT - Applies all annotations to get current text with updated positions
function getCurrentSentenceText(sentenceId: number): string {
  if (!document.value) return "";

  const sentence = document.value.sentences.find((s) => s.id === sentenceId);
  if (!sentence) return "";

  const sentenceAnnotations = getSentenceAnnotations(sentenceId);
  if (sentenceAnnotations.length === 0) return sentence.text;

  //FIX: Apply annotations to get current text
  let currentText = sentence.text;

  //FIX: Sort annotations by start position (apply them in order)
  const sortedAnnotations = [...sentenceAnnotations].sort(
    (a, b) => a.start - b.start
  );

  console.log(
    `//FIX: Applying ${sortedAnnotations.length} annotations to sentence ${sentenceId}`
  );

  //FIX: Apply each annotation sequentially
  for (const annotation of sortedAnnotations) {
    console.log(
      `//FIX: Applying annotation "${annotation.original}" -> "${annotation.correction}" at ${annotation.start}-${annotation.end}`
    );
    console.log(`//FIX: Before replacement: "${currentText}"`);

    //FIX: Replace the text at the specified position
    const beforeText = currentText.substring(0, annotation.start);
    const afterText = currentText.substring(annotation.end);
    currentText = beforeText + annotation.correction + afterText;

    console.log(`//FIX: After replacement: "${currentText}"`);
    console.log(
      `//FIX: Replaced "${annotation.original}" (${annotation.original.length} chars) with "${annotation.correction}" (${annotation.correction.length} chars)`
    );

    //FIX: Update positions of subsequent annotations
    const lengthDiff =
      annotation.correction.length - annotation.original.length;
    for (
      let i = sortedAnnotations.indexOf(annotation) + 1;
      i < sortedAnnotations.length;
      i++
    ) {
      const nextAnnotation = sortedAnnotations[i];
      if (nextAnnotation.start > annotation.start) {
        const oldStart = nextAnnotation.start;
        const oldEnd = nextAnnotation.end;
        nextAnnotation.start += lengthDiff;
        nextAnnotation.end += lengthDiff;
        console.log(
          `//FIX: Updated annotation "${nextAnnotation.original}" from ${oldStart}-${oldEnd} to ${nextAnnotation.start}-${nextAnnotation.end}`
        );
      }
    }
  }

  console.log(`//FIX: Final text: "${currentText}"`);
  return currentText;
}

//FIX: Get annotations for a specific sentence
function getSentenceAnnotations(sentenceId: number): Annotation[] {
  return annotations.value.filter((a) => a.sentenceId === sentenceId);
}

//FIX: Get the latest annotation for a sentence (for display purposes)
function getLatestAnnotation(sentenceId: number): Annotation | null {
  const sentenceAnnotations = getSentenceAnnotations(sentenceId);
  if (sentenceAnnotations.length === 0) return null;

  //FIX: Return the most recent annotation (by timestamp)
  return sentenceAnnotations.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
}

//FIX: CHIP RENDERING - Creates segments for displaying chips in the right positions
const documentSegments = computed(() => {
  if (!document.value || !selectedSentence.value) return [];

  //FIX: Get current text with all annotations applied
  const sentenceText = getCurrentSentenceText(selectedSentence.value.id);
  const segments = [];

  //FIX: Get the latest annotation for this sentence (only show the most recent one)
  const latestAnnotation = getLatestAnnotation(selectedSentence.value.id);

  if (latestAnnotation) {
    //FIX: Find the correction text in the current sentence text
    const correctionIndex = sentenceText.indexOf(latestAnnotation.correction);

    console.log(
      `//FIX: Rendering chip for "${latestAnnotation.correction}" at position ${correctionIndex}`
    );

    if (correctionIndex !== -1) {
      //FIX: Add text before annotation
      if (correctionIndex > 0) {
        segments.push({
          type: "text",
          text: sentenceText.slice(0, correctionIndex),
        });
      }

      //FIX: Add annotation chip
      segments.push({
        type: "annotation",
        annotation: latestAnnotation,
        start: correctionIndex,
        end: correctionIndex + latestAnnotation.correction.length,
      });

      //FIX: Add text after annotation
      const afterIndex = correctionIndex + latestAnnotation.correction.length;
      if (afterIndex < sentenceText.length) {
        segments.push({
          type: "text",
          text: sentenceText.slice(afterIndex),
        });
      }
    } else {
      //FIX: Fallback: just show the text as-is
      segments.push({
        type: "text",
        text: sentenceText,
      });
    }
  } else {
    //FIX: No annotations, just show the text
    segments.push({
      type: "text",
      text: sentenceText,
    });
  }

  return segments;
});

//FIX: Methods
function getOriginalText() {
  if (!document.value) return "";
  return document.value.text;
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function selectSentence(sentenceId: number) {
  const sentence = document.value?.sentences.find((s) => s.id === sentenceId);
  if (sentence) {
    selectedSentence.value = { id: sentenceId, text: sentence.text };
    //FIX: Clear any existing text selection
    selectedText.value = "";
    selectedRange.value = null;
=======
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
>>>>>>> d817870a3b8460585aa07cf2b2cc5ce52b2a2533
  }
}

function clearSelection() {
  selectedSentence.value = null;
  selectedText.value = "";
  selectedRange.value = null;
}

//FIX: DEBUG FUNCTIONS
function clearAllAnnotations() {
  if (selectedSentence.value) {
    annotations.value = annotations.value.filter(
      (a) => a.sentenceId !== selectedSentence.value!.id
    );
    console.log(
      `//FIX: Cleared all annotations for sentence ${selectedSentence.value.id}`
    );
  }
}

function logCurrentState() {
  console.log("=== DEBUG: CURRENT STATE ===");
  console.log("Selected Sentence:", selectedSentence.value);
  console.log("Selected Text:", selectedText.value);
  console.log("Selected Range:", selectedRange.value);
  console.log("All Annotations:", annotations.value);

  if (selectedSentence.value) {
    console.log(
      "Sentence Annotations:",
      getSentenceAnnotations(selectedSentence.value.id)
    );
    console.log(
      "Current Sentence Text:",
      getCurrentSentenceText(selectedSentence.value.id)
    );
    console.log(
      "Latest Annotation:",
      getLatestAnnotation(selectedSentence.value.id)
    );
  }
  console.log("=== END DEBUG ===");
}

function navigateDocument(direction: number) {
  const currentId = Number(route.params.id);
  const nextId = currentId + direction;

  // Only allow navigation to existing documents (1, 2, 3)
  if (nextId >= 1 && nextId <= 3) {
    router.push(`/anotator/anotasi/${nextId}`);
  }
}

// Load data
async function fetchDocument() {
  try {
    const docId = Number(route.params.id);
<<<<<<< HEAD

    // For now, use dummy data that matches the index.vue structure
    const dummyDocuments = [
      {
        id: 1,
        title: "Artikel Bahasa Indonesia 1",
        text: "Ini adalah isi dokumen artikel Bahasa Indonesia 1. Silakan lakukan anotasi pada bagian yang diperlukan. Dokumen ini berisi beberapa paragraf untuk testing anotasi. Setiap paragraf dapat dianotasi secara terpisah.",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        assigned_to: [1, 2],
        sentences: [
          {
            id: 1,
            text: "Ini adalah isi dokumen artikel Bahasa Indonesia 1.",
            m2_text: "",
            corrected_text: "",
            has_error: false,
            created_at: "2024-01-15T10:30:00Z",
            updated_at: "2024-01-15T10:30:00Z",
            document: 1,
          },
          {
            id: 2,
            text: "Silakan lakukan anotasi pada bagian yang diperlukan.",
            m2_text: "",
            corrected_text: "",
            has_error: false,
            created_at: "2024-01-15T10:30:00Z",
            updated_at: "2024-01-15T10:30:00Z",
            document: 1,
          },
          {
            id: 3,
            text: "Dokumen ini berisi beberapa paragraf untuk testing anotasi.",
            m2_text: "",
            corrected_text: "",
            has_error: false,
            created_at: "2024-01-15T10:30:00Z",
            updated_at: "2024-01-15T10:30:00Z",
            document: 1,
          },
          {
            id: 4,
            text: "Setiap paragraf dapat dianotasi secara terpisah.",
            m2_text: "",
            corrected_text: "",
            has_error: false,
            created_at: "2024-01-15T10:30:00Z",
            updated_at: "2024-01-15T10:30:00Z",
            document: 1,
          },
        ],
      },
      {
        id: 2,
        title: "Artikel Bahasa Indonesia 2",
        text: "Artikel kedua untuk testing anotasi. Paragraf pertama berisi beberapa kalimat. Paragraf kedua juga dapat dianotasi. Ini adalah paragraf terakhir.",
        created_at: "2024-01-16T14:20:00Z",
        updated_at: "2024-01-16T14:20:00Z",
        assigned_to: [2, 3],
        sentences: [
          {
            id: 5,
            text: "Artikel kedua untuk testing anotasi.",
            m2_text: "",
            corrected_text: "",
            has_error: true,
            created_at: "2024-01-16T14:20:00Z",
            updated_at: "2024-01-16T14:20:00Z",
            document: 2,
          },
          {
            id: 6,
            text: "Paragraf pertama berisi beberapa kalimat.",
            m2_text: "",
            corrected_text: "",
            has_error: false,
            created_at: "2024-01-16T14:20:00Z",
            updated_at: "2024-01-16T14:20:00Z",
            document: 2,
          },
          {
            id: 7,
            text: "Paragraf kedua juga dapat dianotasi.",
            m2_text: "",
            corrected_text: "",
            has_error: false,
            created_at: "2024-01-16T14:20:00Z",
            updated_at: "2024-01-16T14:20:00Z",
            document: 2,
          },
          {
            id: 8,
            text: "Ini adalah paragraf terakhir.",
            m2_text: "",
            corrected_text: "",
            has_error: false,
            created_at: "2024-01-16T14:20:00Z",
            updated_at: "2024-01-16T14:20:00Z",
            document: 2,
          },
        ],
      },
      {
        id: 3,
        title: "Artikel Bahasa Indonesia 3",
        text: "Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda.",
        created_at: "2024-01-17T09:15:00Z",
        updated_at: "2024-01-17T09:15:00Z",
        assigned_to: [1],
        sentences: [
          {
            id: 9,
            text: "Artikel ketiga dengan konten yang lebih panjang.",
            m2_text: "",
            corrected_text: "Artikel ketiga dengan konten yang lebih panjang.",
            has_error: true,
            created_at: "2024-01-17T09:15:00Z",
            updated_at: "2024-01-17T09:15:00Z",
            document: 3,
          },
          {
            id: 10,
            text: "Paragraf ini berisi beberapa kalimat yang dapat dianotasi.",
            m2_text: "",
            corrected_text:
              "Paragraf ini berisi beberapa kalimat yang dapat dianotasi.",
            has_error: true,
            created_at: "2024-01-17T09:15:00Z",
            updated_at: "2024-01-17T09:15:00Z",
            document: 3,
          },
          {
            id: 11,
            text: "Kami dapat menambahkan lebih banyak paragraf jika diperlukan.",
            m2_text: "",
            corrected_text:
              "Kami dapat menambahkan lebih banyak paragraf jika diperlukan.",
            has_error: true,
            created_at: "2024-01-17T09:15:00Z",
            updated_at: "2024-01-17T09:15:00Z",
            document: 3,
          },
          {
            id: 12,
            text: "Setiap kalimat dapat memiliki anotasi yang berbeda.",
            m2_text: "",
            corrected_text:
              "Setiap kalimat dapat memiliki anotasi yang berbeda.",
            has_error: true,
            created_at: "2024-01-17T09:15:00Z",
            updated_at: "2024-01-17T09:15:00Z",
            document: 3,
          },
        ],
      },
    ];
=======
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
>>>>>>> d817870a3b8460585aa07cf2b2cc5ce52b2a2533

    const foundDocument = dummyDocuments.find((doc) => doc.id === docId);
    if (foundDocument) {
      document.value = foundDocument as DocumentResponse;
    } else {
      console.error("Document not found");
      // Redirect to index if document not found
      router.push("/anotator/anotasi");
    }
  } catch (error) {
<<<<<<< HEAD
    console.error("Error fetching document:", error);
=======
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
>>>>>>> d817870a3b8460585aa07cf2b2cc5ce52b2a2533
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchDocument();
});

// Watch for route changes
watch(
  () => route.params.id,
  () => {
    fetchDocument();
  }
);
</script>

<style scoped>
.annotation-chip {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: 500;
}

.annotation-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.bg-blue-500 {
  background-color: rgba(59, 130, 246, 0.8);
}

.bg-green-500 {
  background-color: rgba(34, 197, 94, 0.8);
}

.bg-purple-500 {
  background-color: rgba(168, 85, 247, 0.8);
}

.bg-indigo-500 {
  background-color: rgba(99, 102, 241, 0.8);
}

.bg-pink-500 {
  background-color: rgba(236, 72, 153, 0.8);
}
</style>