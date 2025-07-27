<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white font-inter px-2 py-6 flex justify-center"
  >
    <div class="max-w-6xl w-full flex flex-col gap-8">
      <!-- Header Row: Kembali | Centered Title & Info | Prev/Next -->
      <div
        class="custom-glassmorphism p-6 flex flex-row items-center justify-between mb-2 gap-2"
      >
        <!-- Left: Kembali Button -->
        <div class="flex-shrink-0">
          <UButton
            label="Kembali"
            icon="i-heroicons-arrow-left"
            color="primary"
            variant="solid"
            :ui="{
              base: 'rounded-full px-4 py-2 font-semibold bg-blue-900 text-white border border-blue-700 hover:bg-blue-800 transition',
            }"
            @click="goToList"
          />
        </div>
        <!-- Center: Title & Document Info -->
        <div class="flex flex-col items-center flex-1 min-w-0">
          <h1
            class="text-2xl font-bold flex items-center gap-2 text-blue-200 mb-1 justify-center"
          >
            <UIcon
              name="i-heroicons-document-text"
              class="w-7 h-7 text-blue-400"
            />
            Anotasi Dokumen
          </h1>
          <div
            class="text-gray-300 text-xs flex items-center gap-2 justify-center flex-wrap"
          >
            Dokumen
            <span class="font-semibold text-white">#{{ doc.id }}</span>
            &mdash;
            <span class="font-semibold text-blue-200">{{ doc.judul }}</span>
          </div>
        </div>
        <!-- Right: Prev/Next Buttons -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <UButton
            icon="i-heroicons-arrow-left"
            color="primary"
            variant="solid"
            :ui="{
              base: 'rounded-full px-4 py-2 font-semibold bg-blue-900 text-white border border-blue-700 hover:bg-blue-800 transition',
            }"
            @click="goToPrev"
            :disabled="!hasPrev"
            title="Dokumen Sebelumnya"
          >
            <template #icon>
              <UIcon name="i-heroicons-arrow-left" />
            </template>
          </UButton>
          <UButton
            icon="i-heroicons-arrow-right"
            color="primary"
            variant="solid"
            :ui="{
              base: 'rounded-full px-4 py-2 font-semibold bg-blue-900 text-white border border-blue-700 hover:bg-blue-800 transition',
            }"
            @click="goToNext"
            :disabled="!hasNext"
            title="Dokumen Berikutnya"
          >
            <template #icon>
              <UIcon name="i-heroicons-arrow-right" />
            </template>
          </UButton>
        </div>
      </div>
      <!-- Main Content: Isi Dokumen & Anotasi Kalimat side by side -->
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Left: Original Document (read-only) -->
        <div class="flex-1 min-w-[320px]">
          <div class="custom-glassmorphism p-6">
            <h2 class="font-semibold text-lg mb-2 text-blue-200">
              Isi Dokumen
            </h2>
            <div class="paragraph-view">
              <template v-for="(para, pIdx) in originalParagraphs" :key="pIdx">
                <div class="mb-4 whitespace-pre-line">{{ para }}</div>
              </template>
            </div>
          </div>
        </div>
        <!-- Right: Editable Document -->
        <div class="flex-1 min-w-[340px]">
          <div class="custom-glassmorphism p-6">
            <div class="flex items-center mb-2 gap-2">
              <h2 class="font-semibold text-lg text-blue-200 flex-1">
                Anotasi Kalimat
              </h2>
              <button
                class="rounded bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!canAnnotate"
                @click="showAnnotationUIFromButton"
              >
                Anotasi
              </button>
            </div>
            <div
              ref="editableArea"
              class="paragraph-view"
              @mousedown="clearSelection"
            >
              <template
                v-for="(segment, idx) in getDocumentSegments()"
                :key="idx"
              >
                <span
                  v-if="segment.type === 'chip-stack'"
                  class="chip-stack-group"
                >
                  <template
                    v-for="(chip, cidx) in segment.chips"
                    :key="chip.id"
                  >
                    <span
                      :class="['chip-highlight', chip.color, 'chip-stack-item']"
                      :style="{
                        marginLeft: `${cidx * 8}px`,
                        marginTop: `${cidx * 2}px`,
                        opacity:
                          0.7 +
                          0.3 * (cidx === segment.chips.length - 1 ? 1 : 0),
                      }"
                      @mouseenter="showChipTooltip(chip, $event)"
                      @mouseleave="hideChipTooltip"
                      @click.stop="editChip(chip, $event)"
                    >
                      {{ chip.correction }}
                    </span>
                  </template>
                </span>
                <span v-else-if="segment.type === 'text'">{{
                  segment.text
                }}</span>
                <br v-else-if="segment.type === 'br'" />
              </template>
              <!-- Floating annotation UI -->
              <div
                v-if="showAnnotationUI"
                :style="annotationUIStyle"
                class="fixed z-50 bg-gray-900 border border-blue-700 rounded-lg shadow-lg p-4 min-w-[260px]"
                @mousedown.stop
                @click.stop
              >
                <div class="mb-2 text-xs text-blue-200">
                  <span class="font-semibold">Teks Asli:</span>
                  <span class="ml-1">{{ selectedText }}</span>
                </div>
                <div class="mb-2">
                  <label class="block text-sm font-semibold mb-1"
                    >Koreksi</label
                  >
                  <input
                    v-model="correctionInput"
                    class="w-full bg-gray-800 text-white border border-gray-700 rounded px-2 py-1"
                    placeholder="Masukkan koreksi"
                    @mousedown.stop
                    @click.stop
                  />
                </div>
                <div class="mb-2">
                  <label class="block text-sm font-semibold mb-1"
                    >Tipe Kesalahan</label
                  >
                  <select
                    v-model="selectedErrorTypes"
                    multiple
                    class="w-full bg-gray-800 text-white border border-gray-700 rounded px-2 py-1"
                    @mousedown.stop
                    @click.stop
                  >
                    <option
                      v-for="type in gecTypes"
                      :key="type.value"
                      :value="type.value"
                    >
                      {{ type.label }}
                    </option>
                  </select>
                </div>
                <div class="flex gap-2 mt-2">
                  <button
                    class="rounded bg-blue-700 hover:bg-blue-800 text-white px-4 py-1 font-semibold"
                    @click.stop="saveChip"
                  >
                    Simpan
                  </button>
                  <button
                    class="rounded bg-gray-700 hover:bg-gray-800 text-white px-4 py-1 font-semibold"
                    @click.stop="cancelChip"
                  >
                    Batal
                  </button>
                </div>
              </div>
              <!-- Chip Tooltip -->
              <div
                v-if="chipTooltip.visible"
                :style="chipTooltip.style"
                class="fixed z-50 bg-gray-900 border border-blue-700 rounded-lg shadow-lg p-3 text-xs text-white min-w-[180px]"
              >
                <div class="mb-1 font-semibold">Tipe Kesalahan:</div>
                <ul class="mb-1">
                  <li v-for="type in chipTooltip.chip?.errorTypes" :key="type">
                    - {{ type }}
                  </li>
                </ul>
                <div class="mb-1">
                  <span class="font-semibold">M2:</span>
                  <span class="font-mono">{{ chipTooltip.m2 }}</span>
                </div>
              </div>
              <!-- Chip Edit Modal -->
              <div
                v-if="chipEditModal.visible"
                :style="chipEditModal.style"
                class="fixed z-50 bg-gray-900 border border-blue-700 rounded-lg shadow-lg p-4 min-w-[260px]"
              >
                <div class="mb-2 text-xs text-blue-200">
                  <span class="font-semibold">Teks Asli:</span>
                  <span class="ml-1">{{ chipEditModal.chip?.original }}</span>
                </div>
                <div class="mb-2">
                  <label class="block text-sm font-semibold mb-1"
                    >Koreksi</label
                  >
                  <input
                    v-model="chipEditModal.correction"
                    class="w-full bg-gray-800 text-white border border-gray-700 rounded px-2 py-1"
                    placeholder="Masukkan koreksi"
                  />
                </div>
                <div class="mb-2">
                  <label class="block text-sm font-semibold mb-1"
                    >Tipe Kesalahan</label
                  >
                  <select
                    v-model="chipEditModal.errorTypes"
                    multiple
                    class="w-full bg-gray-800 text-white border border-gray-700 rounded px-2 py-1"
                  >
                    <option
                      v-for="type in gecTypes"
                      :key="type.value"
                      :value="type.value"
                    >
                      {{ type.label }}
                    </option>
                  </select>
                </div>
                <div class="flex gap-2 mt-2">
                  <button
                    class="rounded bg-blue-700 hover:bg-blue-800 text-white px-4 py-1 font-semibold"
                    @click="saveChipEdit"
                  >
                    Simpan
                  </button>
                  <button
                    class="rounded bg-red-700 hover:bg-red-800 text-white px-4 py-1 font-semibold"
                    @click="deleteChip"
                  >
                    Hapus
                  </button>
                  <button
                    class="rounded bg-gray-700 hover:bg-gray-800 text-white px-4 py-1 font-semibold"
                    @click="closeChipEdit"
                  >
                    Batal
                  </button>
                </div>
              </div>
              <!-- Add/Remove paragraph controls will go here -->
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-row gap-4 mb-4">
        <button
          class="rounded bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 font-semibold"
          @click="undo"
          :disabled="historyIndex <= 0"
        >
          Undo
        </button>
        <button
          class="rounded bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 font-semibold"
          @click="redo"
          :disabled="historyIndex >= history.length - 1"
        >
          Redo
        </button>
        <button
          class="rounded bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 font-semibold"
          @click="exportAllM2"
        >
          Export M2
        </button>
        <span class="text-xs text-gray-400 ml-2"
          >History: {{ historyIndex + 1 }}/{{ history.length }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { nextTick } from "vue";
import { useTextSelection } from "@vueuse/core";

interface AnnotationChip {
  id: string;
  original: string;
  correction: string;
  errorTypes: string[];
  color: string;
  absStart: number;
  absEnd: number;
}

// Dummy document data (should be fetched from API in real app)
const docs = [
  {
    id: 1,
    judul: "Artikel Bahasa Indonesia 1",
    tipe: "Artikel",
    tanggal: "2024-06-01",
    reviewed: true,
    assignedBy: "Admin",
    content:
      "Ini adalah isi dokumen artikel Bahasa Indonesia 1.\nSilakan lakukan anotasi pada bagian yang diperlukan.",
  },
  {
    id: 2,
    judul: "Laporan Penelitian",
    tipe: "Laporan",
    tanggal: "2024-06-02",
    reviewed: false,
    assignedBy: "Kepala Riset",
    content: "Isi laporan penelitian yang perlu dianotasi oleh Anda.",
  },
  {
    id: 3,
    judul: "Berita Harian",
    tipe: "Berita",
    tanggal: "2024-06-03",
    reviewed: false,
    assignedBy: "Admin",
    content: "Berita harian terbaru untuk proses anotasi.",
  },
  {
    id: 4,
    judul: "Makalah Akademik",
    tipe: "Makalah",
    tanggal: "2024-06-04",
    reviewed: true,
    assignedBy: "Admin",
    content: "Makalah akademik yang telah ditugaskan untuk anotasi.",
  },
];

// GEC error types (with info)
const gecTypes = [
  {
    label: "Adjective",
    value: "Adjective",
    info: "Kesalahan pada penggunaan kata sifat.",
  },
  {
    label: "Noun Number",
    value: "Noun Number",
    info: "Kesalahan pada jumlah kata benda (jamak/tunggal).",
  },
  {
    label: "Spelling",
    value: "Spelling",
    info: "Kesalahan ejaan atau penulisan kata.",
  },
  {
    label: "Adjective Form",
    value: "Adjective Form",
    info: "Bentuk kata sifat yang tidak tepat.",
  },
  {
    label: "Adverb",
    value: "Adverb",
    info: "Kesalahan pada penggunaan kata keterangan.",
  },
  {
    label: "Conjunction",
    value: "Conjunction",
    info: "Kesalahan pada penggunaan kata penghubung.",
  },
  {
    label: "Contraction",
    value: "Contraction",
    info: "Penggunaan bentuk singkat yang salah.",
  },
  {
    label: "Determiner",
    value: "Determiner",
    info: "Kesalahan pada kata penentu (seperti 'sebuah', 'setiap').",
  },
  {
    label: "Morphology",
    value: "Morphology",
    info: "Kesalahan morfologi atau bentuk kata.",
  },
  {
    label: "Noun",
    value: "Noun",
    info: "Kesalahan pada penggunaan kata benda.",
  },
  {
    label: "Noun Inflection",
    value: "Noun Inflection",
    info: "Infleksi kata benda yang salah.",
  },
  {
    label: "Noun Possessive",
    value: "Noun Possessive",
    info: "Kepemilikan kata benda yang tidak tepat.",
  },
  {
    label: "Orthography",
    value: "Orthography",
    info: "Kesalahan ortografi atau tata tulis.",
  },
  {
    label: "Other",
    value: "Other",
    info: "Kesalahan lain yang tidak termasuk kategori di atas.",
  },
  {
    label: "Particle",
    value: "Particle",
    info: "Kesalahan pada penggunaan partikel.",
  },
  {
    label: "Preposition",
    value: "Preposition",
    info: "Kesalahan pada penggunaan preposisi.",
  },
  {
    label: "Pronoun",
    value: "Pronoun",
    info: "Kesalahan pada penggunaan kata ganti.",
  },
  { label: "Punctuation", value: "Punctuation", info: "Kesalahan tanda baca." },
  {
    label: "Subject Verb Agreement",
    value: "Subject Verb Agreement",
    info: "Ketidaksesuaian subjek dan predikat.",
  },
  {
    label: "Unknown",
    value: "Unknown",
    info: "Kesalahan yang tidak diketahui jenisnya.",
  },
  {
    label: "Verb",
    value: "Verb",
    info: "Kesalahan pada penggunaan kata kerja.",
  },
  {
    label: "Verb Form",
    value: "Verb Form",
    info: "Bentuk kata kerja yang salah.",
  },
  {
    label: "Verb Inflection",
    value: "Verb Inflection",
    info: "Infleksi kata kerja yang salah.",
  },
  {
    label: "Verb Tense",
    value: "Verb Tense",
    info: "Kesalahan waktu kata kerja (tense).",
  },
  {
    label: "Word Order",
    value: "Word Order",
    info: "Urutan kata yang tidak tepat.",
  },
];

const route = useRoute();
const router = useRouter();
const currentId = Number(route.params.id);
const docIndex = docs.findIndex((d) => d.id === currentId);
const doc = docs[docIndex] || docs[0];

const hasPrev = docIndex > 0;
const hasNext = docIndex < docs.length - 1;

function goToPrev() {
  if (hasPrev) router.push(`/anotator/anotasi/${docs[docIndex - 1].id}`);
}
function goToNext() {
  if (hasNext) router.push(`/anotator/anotasi/${docs[docIndex + 1].id}`);
}
function goToList() {
  router.push("/anotator/anotasi");
}

// Split document into paragraphs for both original and editable
const originalParagraphs = ref(doc.content.split(/\n+/));
const editableParagraphs = ref([...originalParagraphs.value]);
const annotationChips = ref<AnnotationChip[]>([]);

// Selection and annotation UI state
const showAnnotationUI = ref(false);
const selectedText = ref("");
const correctionInput = ref("");
const selectedErrorTypes = ref([]);
const annotationUIStyle = ref({});
let selectionRange: Range | null = null;

const editableArea = ref<HTMLElement | null>(null);
const { text: selectedTextVueuse, selection: vueuseSelection } =
  useTextSelection();

function isSelectionInsideEditable() {
  if (!editableArea.value || !vueuseSelection.value) return false;
  const area = editableArea.value;
  const { anchorNode, focusNode } = vueuseSelection.value;
  return area.contains(anchorNode) && area.contains(focusNode);
}

const canAnnotate = computed(() => {
  return !!selectedTextVueuse.value && isSelectionInsideEditable();
});

function showAnnotationUIFromButton() {
  if (!vueuseSelection.value || vueuseSelection.value.isCollapsed) return;
  selectedText.value = vueuseSelection.value.toString();
  correctionInput.value = selectedText.value;
  selectedErrorTypes.value = [];
  showAnnotationUI.value = true;
  selectionRange = vueuseSelection.value.getRangeAt(0);
  // Position the UI at a fixed place (or you can use the selection rect)
  annotationUIStyle.value = {
    top: "120px",
    left: "60%",
    transform: "translateX(-50%)",
  };
}
function clearSelection() {
  const sel = window.getSelection();
  if (sel) sel.removeAllRanges();
  showAnnotationUI.value = false;
}
function handleTextSelection(e: MouseEvent) {
  // Only trigger if selection is in editableParagraphs
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return;
  const text = selection.toString();
  if (!text.trim()) return;
  // Ensure selection is within editableParagraphs
  let found = false;
  for (let i = 0; i < editableParagraphs.value.length; i++) {
    const paraEl = document.querySelectorAll(".paragraph-view .mb-4")[i];
    if (
      paraEl &&
      selection.anchorNode &&
      paraEl.contains(selection.anchorNode)
    ) {
      found = true;
      break;
    }
  }
  if (!found) return;
  selectedText.value = text;
  correctionInput.value = text;
  selectedErrorTypes.value = [];
  showAnnotationUI.value = true;
  selectionRange = selection.getRangeAt(0);
  // Position the UI near the selection
  if (selectionRange) {
    const rect = selectionRange.getBoundingClientRect();
    annotationUIStyle.value = {
      top: `${rect.bottom + window.scrollY + 8}px`,
      left: `${rect.left + window.scrollX}px`,
    };
  }
}
function saveChip() {
  if (!selectionRange || !selectedText.value.trim()) {
    showAnnotationUI.value = false;
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
    return;
  }
  // Multi-paragraph chip logic
  const { absStart, absEnd } = getAbsoluteSelectionIndices(selectionRange);
  console.log(
    "saveChip absStart:",
    absStart,
    "absEnd:",
    absEnd,
    "selectedText:",
    selectedText.value,
    "correction:",
    correctionInput.value
  );
  if (absStart === null || absEnd === null) {
    showAnnotationUI.value = false;
    const sel = window.getSelection();
    if (sel) sel.removeAllRanges();
    return;
  }
  annotationChips.value.push({
    id: `${Date.now()}-${Math.random()}`,
    absStart,
    absEnd,
    original: selectedText.value,
    correction: correctionInput.value,
    errorTypes: [...selectedErrorTypes.value],
    color: getRandomChipColor(),
  });
  console.log("annotationChips after push:", annotationChips.value);
  // DO NOT mutate editableParagraphs here!
  showAnnotationUI.value = false;
  const sel = window.getSelection();
  if (sel) sel.removeAllRanges();
}
function cancelChip() {
  showAnnotationUI.value = false;
  const sel = window.getSelection();
  if (sel) sel.removeAllRanges();
}
// Helper: get absolute start/end indices in the full document
function getAbsoluteSelectionIndices(range: Range) {
  let absStart = null,
    absEnd = null;
  let charCount = 0;
  const area = editableArea.value;
  if (!area) return { absStart, absEnd };
  const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT, null);
  let node;
  while ((node = walker.nextNode())) {
    if (node === range.startContainer) {
      absStart = charCount + range.startOffset;
    }
    if (node === range.endContainer) {
      absEnd = charCount + range.endOffset;
      break;
    }
    charCount += node.textContent?.length || 0;
  }
  return { absStart, absEnd };
}
// Helper: replace text across paragraphs
function replaceTextAcrossParagraphs(
  absStart: number,
  absEnd: number,
  replacement: string
) {
  let charCount = 0;
  let foundStart = false,
    foundEnd = false;
  for (let i = 0; i < editableParagraphs.value.length; i++) {
    const para = editableParagraphs.value[i];
    const paraStart = charCount;
    const paraEnd = charCount + para.length;
    if (!foundStart && absStart >= paraStart && absStart <= paraEnd) {
      foundStart = true;
    }
    if (foundStart && !foundEnd) {
      if (absEnd <= paraEnd) {
        // Replace in this paragraph
        const before = editableParagraphs.value[i].slice(
          0,
          absStart - paraStart
        );
        const after = editableParagraphs.value[i].slice(absEnd - paraStart);
        editableParagraphs.value[i] = before + replacement + after;
        foundEnd = true;
      } else {
        // Remove from absStart to end of this paragraph
        editableParagraphs.value[i] = editableParagraphs.value[i].slice(
          0,
          absStart - paraStart
        );
        absStart = paraEnd + 1; // +1 for newline
      }
    } else if (foundStart && !foundEnd) {
      if (absEnd <= paraEnd) {
        // Remove up to absEnd in this paragraph
        editableParagraphs.value[i] = editableParagraphs.value[i].slice(
          absEnd - paraStart
        );
        foundEnd = true;
      } else {
        // Remove whole paragraph
        editableParagraphs.value[i] = "";
      }
    }
    charCount = paraEnd + 1; // +1 for newline
    if (foundEnd) break;
  }
  // Remove empty paragraphs
  for (let i = editableParagraphs.value.length - 1; i >= 0; i--) {
    if (editableParagraphs.value[i] === "") {
      editableParagraphs.value.splice(i, 1);
    }
  }
}
// Helper: get start/end indices and paragraph index for the selection
function getSelectionIndices(range: Range) {
  // Find which paragraph the selection is in
  let paraIdx: number | null = null;
  let start = null;
  let end = null;
  for (let i = 0; i < editableParagraphs.value.length; i++) {
    const paraEl = document.querySelectorAll(".paragraph-view .mb-4")[i];
    if (paraEl && paraEl.contains(range.startContainer)) {
      paraIdx = i;
      // Compute start/end relative to paragraph text
      const preText = paraEl.textContent || "";
      const selText = range.toString();
      const anchorOffset = range.startOffset;
      const focusOffset = anchorOffset + selText.length;
      start = anchorOffset;
      end = focusOffset;
      break;
    }
  }
  return { start, end, paraIdx };
}
// Helper: random chip color
function getRandomChipColor() {
  const colors = [
    "bg-blue-700",
    "bg-green-700",
    "bg-purple-700",
    "bg-pink-700",
    "bg-yellow-700",
    "bg-red-700",
    "bg-indigo-700",
    "bg-teal-700",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
function chipsForParagraph(pIdx: number) {
  return annotationChips.value.filter(
    (chip) => chip.absStart >= pIdx * 1000 && chip.absEnd <= (pIdx + 1) * 1000
  ); // Placeholder for paragraph-based chips
}

// 2. Flat segment array for the whole document
function getDocumentSegments() {
  // 1. Compute the final displayed text by applying all chips in order
  const originalText = editableParagraphs.value.join("\n");
  const chipsSorted = [...annotationChips.value].sort(
    (a, b) => a.absStart - b.absStart
  );
  let displayedText = originalText;
  let offset = 0;
  for (const chip of chipsSorted) {
    const start = chip.absStart + offset;
    const end = chip.absEnd + offset;
    displayedText =
      displayedText.slice(0, start) +
      chip.correction +
      displayedText.slice(end);
    offset += chip.correction.length - (chip.absEnd - chip.absStart);
  }

  // 2. For each character in the final displayed text, determine which chips cover it
  //    (by mapping chip ranges to the final displayed text)
  //    We'll build a map of chip coverages in the final displayed text
  //    For this, we need to map each chip's range to the final displayed text
  //    We'll do this by replaying the chip applications and tracking the mapping

  // Build a mapping from original indices to displayed indices
  // For each chip, track its start/end in the final displayed text
  let mapping = [];
  let currText = originalText;
  let currOffset = 0;
  let chipRanges = chipsSorted.map((chip) => ({ ...chip })); // clone
  for (let i = 0; i < chipsSorted.length; i++) {
    const chip = chipsSorted[i];
    const start = chip.absStart + currOffset;
    const end = chip.absEnd + currOffset;
    chipRanges[i].finalStart = start;
    chipRanges[i].finalEnd = start + chip.correction.length;
    currText = currText.slice(0, start) + chip.correction + currText.slice(end);
    currOffset += chip.correction.length - (chip.absEnd - chip.absStart);
  }

  // Now walk the final displayed text, grouping by chip stack
  let segments = [];
  let i = 0;
  while (i < displayedText.length) {
    // Find all chips covering this index
    const chipsHere = chipRanges
      .filter((chip) => chip.finalStart <= i && chip.finalEnd > i)
      .sort((a, b) => a.finalStart - b.finalStart);
    let segEnd = i + 1;
    // Find the end of this segment (where chip stack changes)
    while (
      segEnd < displayedText.length &&
      JSON.stringify(
        chipRanges
          .filter((chip) => chip.finalStart <= segEnd && chip.finalEnd > segEnd)
          .map((c) => c.id)
      ) === JSON.stringify(chipsHere.map((c) => c.id))
    ) {
      segEnd++;
    }
    if (chipsHere.length) {
      segments.push({
        type: "chip-stack",
        chips: chipsHere,
        text: displayedText.slice(i, segEnd),
        start: i,
        end: segEnd,
      });
    } else {
      segments.push({
        type: "text",
        text: displayedText.slice(i, segEnd),
      });
    }
    i = segEnd;
  }
  // Split by \n for rendering with <br>
  const finalSegments = [];
  for (const seg of segments) {
    if (seg.text && seg.text.includes("\n")) {
      const parts = seg.text.split("\n");
      for (let i = 0; i < parts.length; i++) {
        if (parts[i]) finalSegments.push({ ...seg, text: parts[i] });
        if (i < parts.length - 1) finalSegments.push({ type: "br" });
      }
    } else {
      finalSegments.push(seg);
    }
  }
  console.log("getDocumentSegments:", finalSegments);
  return finalSegments;
}

// Helper: get all chips covering a given absolute index
function chipsAtIndex(idx: number) {
  // Return chips sorted by absStart (innermost/most recent last)
  return annotationChips.value
    .filter((chip) => chip.absStart <= idx && chip.absEnd > idx)
    .sort((a, b) => a.absStart - b.absStart);
}
// Render the document as a flat sequence of segments with stacked chips

// Tooltip state
const chipTooltip = reactive({
  visible: false,
  chip: null as AnnotationChip | null,
  style: {},
  m2: "",
});
function showChipTooltip(chip: AnnotationChip, event: MouseEvent) {
  chipTooltip.visible = true;
  chipTooltip.chip = chip;
  chipTooltip.m2 = generateM2ForChip(chip);
  chipTooltip.style = {
    top: `${event.clientY + 12}px`,
    left: `${event.clientX + 12}px`,
  };
}
function hideChipTooltip() {
  chipTooltip.visible = false;
  chipTooltip.chip = null;
  chipTooltip.m2 = "";
}
// Chip edit modal state
const chipEditModal = reactive({
  visible: false,
  chip: null as AnnotationChip | null,
  correction: "",
  errorTypes: [] as string[],
  style: {},
});
function editChip(chip: AnnotationChip, event: MouseEvent) {
  chipEditModal.visible = true;
  chipEditModal.chip = chip;
  chipEditModal.correction = chip.correction;
  chipEditModal.errorTypes = [...chip.errorTypes];
  chipEditModal.style = {
    top: `${event.clientY + 12}px`,
    left: `${event.clientX + 12}px`,
  };
}
function closeChipEdit() {
  chipEditModal.visible = false;
  chipEditModal.chip = null;
}
function saveChipEdit() {
  if (!chipEditModal.chip) return;
  const chipIdx = annotationChips.value.findIndex(
    (c) => c.id === chipEditModal.chip!.id
  );
  if (chipIdx === -1) return;
  // Only allow editing correction and errorTypes
  annotationChips.value[chipIdx].correction = chipEditModal.correction;
  annotationChips.value[chipIdx].errorTypes = [...chipEditModal.errorTypes];
  chipEditModal.visible = false;
  chipEditModal.chip = null;
  // Recalculate indices for all chips after this one
  recalculateChipIndices(chipIdx + 1);
}
function deleteChip() {
  if (!chipEditModal.chip) return;
  const idx = annotationChips.value.findIndex(
    (c) => c.id === chipEditModal.chip!.id
  );
  if (idx !== -1) {
    annotationChips.value.splice(idx, 1);
    // Recalculate indices for all chips after the deleted one
    recalculateChipIndices(idx);
  }
  chipEditModal.visible = false;
  chipEditModal.chip = null;
}
// --- Chip index recalculation logic ---
function recalculateChipIndices(startIdx: number) {
  // Defensive: sort chips by absStart
  const chips = annotationChips.value;
  // 1. Recompute displayed text up to startIdx
  let displayed = editableParagraphs.value.join("\n");
  for (let i = 0; i < startIdx; i++) {
    const chip = chips[i];
    displayed =
      displayed.slice(0, chip.absStart) +
      chip.correction +
      displayed.slice(chip.absEnd);
  }
  // 2. For each chip after startIdx, find new indices in displayed text
  for (let i = startIdx; i < chips.length; i++) {
    const chip = chips[i];
    // Find the first occurrence of chip.original in displayed text after previous chip
    const prevEnd = i > 0 ? chips[i - 1].absEnd : 0;
    // Try to find the original text in the current displayed text
    // (If not found, skip updating this chip)
    const searchStart = Math.max(0, prevEnd - chip.original.length);
    const idx = displayed.indexOf(chip.original, searchStart);
    if (idx !== -1) {
      chip.absStart = idx;
      chip.absEnd = idx + chip.original.length;
      // Apply this chip's correction to displayed text for next iteration
      displayed =
        displayed.slice(0, chip.absStart) +
        chip.correction +
        displayed.slice(chip.absEnd);
    } else {
      // If not found, leave indices as-is (or optionally mark as invalid)
      // Optionally: chip.absStart = chip.absEnd = -1;
    }
  }
}
// M2 format generator
function generateM2ForChip(chip: AnnotationChip) {
  // For demo: S <original>\nA <start> <end>|||<errorType>|||<correction>|||REQUIRED|||-NONE-|||0
  // We'll use char indices for now
  return `A ${chip.absStart} ${chip.absEnd}|||${chip.errorTypes.join(",")}|||${
    chip.correction
  }|||REQUIRED|||-NONE-|||0`;
}

// --- Undo/Redo/History ---
interface HistoryState {
  chips: AnnotationChip[];
  paragraphs: string[];
}
const history = ref<HistoryState[]>([]);
const historyIndex = ref(-1);

function pushHistory() {
  // Truncate redo history if needed
  if (historyIndex.value < history.value.length - 1) {
    history.value.splice(historyIndex.value + 1);
  }
  history.value.push({
    chips: JSON.parse(JSON.stringify(annotationChips.value)),
    paragraphs: JSON.parse(JSON.stringify(editableParagraphs.value)),
  });
  historyIndex.value = history.value.length - 1;
}
function undo() {
  if (historyIndex.value > 0) {
    historyIndex.value--;
    restoreHistory();
  }
}
function redo() {
  if (historyIndex.value < history.value.length - 1) {
    historyIndex.value++;
    restoreHistory();
  }
}
function restoreHistory() {
  const state = history.value[historyIndex.value];
  annotationChips.value = JSON.parse(JSON.stringify(state.chips));
  editableParagraphs.value = JSON.parse(JSON.stringify(state.paragraphs));
}
// Watch for changes and push to history
watch(
  [annotationChips, editableParagraphs],
  () => {
    pushHistory();
  },
  { deep: true, immediate: true }
);

// --- M2 Export ---
function exportAllM2() {
  const m2Lines = annotationChips.value.map(generateM2ForChip);
  const blob = new Blob([m2Lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `annotations-${doc.id}.m2`;
  a.click();
  URL.revokeObjectURL(url);
}
function addParagraphBelow(idx: number) {
  editableParagraphs.value.splice(idx + 1, 0, "");
}
function removeParagraph(idx: number) {
  if (editableParagraphs.value.length === 1) return;
  editableParagraphs.value.splice(idx, 1);
}
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
.chip-stack {
  position: relative;
  display: inline-block;
}
.chip-nested {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0.7;
  z-index: 1;
  pointer-events: none;
}
.chip-nested-top {
  opacity: 1;
  z-index: 2;
  pointer-events: auto;
  box-shadow: 0 0 0 2px #fff3, 0 2px 8px #0002;
  transition: box-shadow 0.15s;
}
.chip-nested-top:hover {
  box-shadow: 0 0 0 3px #38bdf8, 0 2px 12px #38bdf888;
}
.chip-highlight {
  background: linear-gradient(90deg, #2563eb55 0%, #38bdf855 100%);
  border: 1.5px solid #38bdf8;
  box-shadow: 0 2px 8px #38bdf822;
  color: #fff;
  padding: 0.1em 0.5em;
  border-radius: 0.4em;
  cursor: pointer;
  transition: box-shadow 0.15s;
}
.chip-highlight:hover {
  box-shadow: 0 0 0 3px #38bdf8, 0 2px 12px #38bdf888;
}
.chip-stack-group {
  display: inline-block;
  position: relative;
}
.chip-stack-item {
  position: relative;
  z-index: 1;
  cursor: pointer;
  border-radius: 0.4em;
  padding: 0.1em 0.5em;
  box-shadow: 0 2px 8px #38bdf822;
  border: 1.5px solid #38bdf8;
  background: linear-gradient(90deg, #2563eb55 0%, #38bdf855 100%);
  transition: box-shadow 0.15s;
  margin-bottom: 2px;
}
.chip-stack-item:hover {
  z-index: 2;
  box-shadow: 0 0 0 3px #38bdf8, 0 2px 12px #38bdf888;
}
</style>
