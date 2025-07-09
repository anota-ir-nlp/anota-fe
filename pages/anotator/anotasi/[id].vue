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
            @click="goToPrev"
            :disabled="!hasPrev"
            title="Dokumen Sebelumnya"
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
            <div class="text-gray-400 text-xs mt-1">
              Dokumen
              <span class="font-semibold text-white">#{{ doc.id }}</span>
              &mdash; {{ doc.judul }}
            </div>
          </div>
          <UButton
            icon="i-heroicons-arrow-right"
            color="neutral"
            variant="ghost"
            :ui="{ base: 'rounded-full px-4 py-2 font-semibold' }"
            @click="goToNext"
            :disabled="!hasNext"
            title="Dokumen Berikutnya"
          />
        </div>
        <div class="custom-glassmorphism p-6">
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="badge badge-blue">
              <UIcon name="i-heroicons-document" class="w-4 h-4" />
              {{ doc.tipe }}
            </span>
            <span class="badge badge-gray">
              <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
              {{ doc.tanggal }}
            </span>
            <span v-if="doc.reviewed" class="badge badge-green">
              <UIcon name="i-heroicons-check-badge" class="w-4 h-4" /> Ditinjau
            </span>
            <span v-else class="badge badge-yellow">
              <UIcon name="i-heroicons-clock" class="w-4 h-4" /> Belum Ditinjau
            </span>
            <span class="badge badge-purple">
              <UIcon name="i-heroicons-user" class="w-4 h-4" />
              {{ doc.assignedBy }}
            </span>
          </div>
          <h2 class="font-semibold text-lg mb-2 text-blue-200">Isi Dokumen</h2>
          <div class="paragraph-view">
            <template v-for="(sentence, idx) in sentences" :key="idx">
              <span
                class="sentence-inline"
                :class="{
                  annotated: annotations[idx] && annotations[idx].length,
                  selected: selectedSentence === idx,
                }"
                @click="editSentence(idx)"
                tabindex="0"
              >
                {{ sentence }}
                <span
                  v-if="annotations[idx] && annotations[idx].length"
                  class="inline-flex gap-1 ml-1"
                >
                  <span
                    v-for="tag in annotations[idx]"
                    :key="tag.type"
                    class="tagged-type"
                  >
                    {{ tag.type }}
                  </span>
                </span>
              </span>
              <span v-if="idx !== sentences.length - 1"> </span>
            </template>
          </div>
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
          <div v-if="selectedSentence !== null" class="space-y-4">
            <div class="mb-2">
              <span class="text-blue-300 font-mono text-xs"
                >{{ selectedSentence + 1 }}.</span
              >
              <span class="font-semibold text-white">{{
                sentences[selectedSentence]
              }}</span>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1"
                >Tipe Kesalahan (bisa lebih dari satu):</label
              >
              <USelectMenu
                v-model="selectedTypes"
                :options="gecTypes"
                multiple
                placeholder="Pilih tipe kesalahan"
                :ui="{ base: 'w-full' }"
                option-attribute="label"
                value-attribute="value"
                size="md"
                icon="i-heroicons-tag"
              >
                <template #option="{ option }">
                  <div class="flex items-center gap-2">
                    <span>{{ option.label }}</span>
                    <UButton
                      icon="i-heroicons-information-circle"
                      color="neutral"
                      variant="ghost"
                      size="xs"
                      :ui="{
                        base: 'rounded-full p-0.5 text-blue-300 hover:bg-blue-900/40',
                      }"
                      @mouseover.stop="showInfo(option.value)"
                      @mouseleave.stop="hideInfo(option.value)"
                      tabindex="-1"
                    />
                  </div>
                </template>
              </USelectMenu>
              <transition name="fade">
                <div
                  v-if="infoVisible && gecTypeInfo(infoVisible)"
                  class="mt-2 bg-gray-900/90 text-white text-xs rounded px-3 py-2 shadow-lg"
                >
                  {{ gecTypeInfo(infoVisible) }}
                </div>
              </transition>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-1"
                >Koreksi Benar:</label
              >
              <UInput
                v-model="correctionInput"
                placeholder="Masukkan koreksi kalimat yang benar"
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
import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

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

// Split document into sentences (simple split for demo)
const sentences = doc.content.split(/\n|(?<=[.!?])\s+/);

// Annotation state: { [sentenceIdx]: [{ type, correction }] }
const annotations = reactive({});
const selectedSentence = ref(null);
const selectedTypes = ref([]);
const correctionInput = ref("");
const infoVisible = ref(null);

function editSentence(idx) {
  selectedSentence.value = idx;
  // Load previous annotation if exists
  if (annotations[idx] && annotations[idx].length) {
    selectedTypes.value = annotations[idx].map((a) => a.type);
    correctionInput.value = annotations[idx][0]?.correction || "";
  } else {
    selectedTypes.value = [];
    correctionInput.value = "";
  }
}
function saveAnnotation() {
  if (selectedSentence.value === null) return;
  annotations[selectedSentence.value] = selectedTypes.value.map((type) => ({
    type,
    correction: correctionInput.value,
  }));
  selectedSentence.value = null;
  selectedTypes.value = [];
  correctionInput.value = "";
}
function cancelAnnotation() {
  selectedSentence.value = null;
  selectedTypes.value = [];
  correctionInput.value = "";
}
function showInfo(type) {
  infoVisible.value = type;
}
function hideInfo(type) {
  if (infoVisible.value === type) infoVisible.value = null;
}
function gecTypeInfo(type) {
  return gecTypes.find((t) => t.value === type)?.info || "";
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
</style>
