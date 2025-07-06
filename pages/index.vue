<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white font-inter relative overflow-hidden"
  >
    <!-- Subtle background circles for modern feel -->
    <div
      class="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"
    ></div>
    <div
      class="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"
    ></div>
    <div
      class="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"
    ></div>

    <!-- Main content container -->
    <div class="main-container">
      <!-- Login Section -->
      <section class="login-section animate-fade-in">
        <!-- Giant background text for techy vibe -->
        <div class="absolute-center-text">ANOTA</div>

        <div class="login-content-wrapper relative z-10">
          <h1 class="title-text flex items-center justify-center gap-4">
            <UIcon
              name="i-heroicons-light-bulb"
              class="w-12 h-12 text-blue-400"
            />
            ANOTA
          </h1>
          <p class="tagline-text">Anotasi Cerdas. Dataset Sempurna.</p>
          <p class="description-text">
            Platform inovatif untuk anotasi Grammatical Error Correction (GEC)
            Bahasa Indonesia. Mempermudah annotator, reviewer, dan kepala riset
            dalam menciptakan dataset berkualitas tinggi.
          </p>
          <UButton
            variant="solid"
            size="xl"
            icon="i-heroicons-arrow-right-on-rectangle"
            label="Masuk ke ANOTA"
            class="login-button"
            @click="handleLogin"
          />
        </div>
      </section>

      <!-- Informasi Utama -->
      <section class="info-section animate-fade-in-up">
        <h2 class="section-title">Informasi Penting</h2>

        <!-- GEC Examples Card (Zig-zag 1) -->
        <div class="zig-zag-row">
          <div class="glassmorphism-card gec-card">
            <h3 class="card-title">Contoh Tipe Kesalahan GEC</h3>
            <div class="dropdown-wrapper">
              <USelectMenu
                v-model="selectedGecType"
                :options="gecErrorTypes"
                placeholder="Pilih Tipe Kesalahan"
                class="w-full z-50"
                value-attribute="value"
                option-attribute="label"
                color="neutral"
                variant="outline"
                size="lg"
                :ui="{
                  wrapper: 'relative',
                  base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0',
                  rounded: 'rounded-lg',
                  padding: 'px-4 py-3',
                  shadow: 'shadow-sm',
                  variant: {
                    outline:
                      'bg-gray-800/70 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400',
                  },
                  option: {
                    base: 'cursor-pointer select-none relative flex items-center justify-between gap-2 px-4 py-2.5 text-base',
                    active: 'bg-blue-600/20',
                    selected: 'font-semibold text-white bg-blue-600/30',
                    disabled: 'cursor-not-allowed opacity-50',
                    empty: 'text-base text-gray-400 px-4 py-2.5',
                    icon: {
                      base: 'h-5 w-5 flex-shrink-0 text-gray-400',
                      active: 'text-white',
                      selected: 'text-white',
                    },
                    selectedIcon: {
                      wrapper: 'flex-shrink-0 inline-flex items-center',
                      base: 'h-5 w-5 text-white',
                    },
                  },
                  container:
                    'z-20 bg-gray-900/90 backdrop-blur-md rounded-lg shadow-xl ring-1 ring-white/20',
                  background: 'bg-gray-900/90',
                  ring: 'ring-1 ring-white/20',
                  optionGroup: {
                    container: 'space-y-0.5',
                    label: 'text-sm font-semibold text-gray-300 px-4 py-1.5',
                  },
                }"
              />
            </div>

            <div v-if="currentGecExample" class="gec-example-display">
              <p class="text-base text-gray-300 mb-3">
                Tipe:
                <span class="font-bold text-white">{{
                  currentGecExample.type
                }}</span>
              </p>
              <p class="text-red-300 mb-3 text-xl font-mono leading-relaxed">
                Salah:
                <span class="font-mono text-red-100">{{
                  currentGecExample.wrong
                }}</span>
              </p>
              <p class="text-green-300 text-xl font-mono leading-relaxed">
                Benar:
                <span class="font-mono text-green-100">{{
                  currentGecExample.correct
                }}</span>
              </p>
            </div>
            <div v-else class="gec-placeholder-text">
              <p class="text-lg">Pilih tipe kesalahan untuk melihat contoh.</p>
            </div>

            <div class="navigation-buttons">
              <UButton
                icon="i-heroicons-arrow-left"
                variant="outline"
                color="neutral"
                label="Sebelumnya"
                :disabled="currentGecExampleIndex === 0"
                @click="prevGecExample"
                class="nav-button"
              />
              <UButton
                icon="i-heroicons-arrow-right"
                variant="outline"
                color="neutral"
                label="Berikutnya"
                :disabled="
                  currentGecExampleIndex >=
                  (gecExamples[selectedGecType.value]?.length || 0) - 1
                "
                @click="nextGecExample"
                class="nav-button"
              />
            </div>
          </div>
          <div class="lg:w-1/2 w-full flex justify-center items-center">
            <UIcon
              name="i-heroicons-document-text"
              class="w-48 h-48 text-blue-400 opacity-70"
            />
          </div>
        </div>

        <!-- Alur Penggunaan Card (Zig-zag 2) -->
        <div class="zig-zag-row-reverse">
          <div class="glassmorphism-card alur-card">
            <h3 class="card-title">Alur Penggunaan Aplikasi</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
              <div class="alur-item">
                <UIcon
                  name="i-heroicons-user-group"
                  class="w-16 h-16 text-blue-400 mb-4"
                />
                <p class="font-bold text-white text-xl mb-1">Admin</p>
                <p class="text-gray-200 text-base leading-relaxed">
                  Mengelola pengguna, menetapkan dokumen untuk anotasi dan
                  review.
                </p>
              </div>
              <div class="alur-item">
                <UIcon
                  name="i-heroicons-pencil-square"
                  class="w-16 h-16 text-green-400 mb-4"
                />
                <p class="font-bold text-white text-xl mb-1">Annotator</p>
                <p class="text-gray-200 text-base leading-relaxed">
                  Menganotasi dokumen teks untuk mengidentifikasi dan mengoreksi
                  kesalahan GEC.
                </p>
              </div>
              <div class="alur-item">
                <UIcon
                  name="i-heroicons-document-check"
                  class="w-16 h-16 text-purple-400 mb-4"
                />
                <p class="font-bold text-white text-xl mb-1">Reviewer</p>
                <p class="text-gray-200 text-base leading-relaxed">
                  Meninjau anotasi yang telah dibuat, memastikan kualitas dan
                  konsistensi.
                </p>
              </div>
              <div class="alur-item">
                <UIcon
                  name="i-heroicons-chart-bar"
                  class="w-16 h-16 text-pink-400 mb-4"
                />
                <p class="font-bold text-white text-xl mb-1">Kepala Riset</p>
                <p class="text-gray-200 text-base leading-relaxed">
                  Memantau progres, melihat rekap kinerja, dan menghasilkan
                  dataset GEC dalam format paralel atau M2.
                </p>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2 w-full flex justify-center items-center">
            <UIcon
              name="i-heroicons-arrows-right-left"
              class="w-48 h-48 text-purple-400 opacity-70"
            />
          </div>
        </div>
      </section>

      <!-- FAQ Section (Centered Accordion) -->
      <section class="faq-section animate-fade-in-up">
        <h2 class="section-title">Pertanyaan Umum (FAQ)</h2>
        <div class="max-w-4xl mx-auto glassmorphism-card faq-card">
          <UAccordion
            :items="faqItems"
            color="white"
            variant="outline"
            size="lg"
            class="text-white"
            :ui="{
              wrapper: 'flex flex-col w-full',
              item: {
                base: 'py-4',
                size: 'text-xl',
                color: 'text-white',
                // Removed the default icon property here to prevent duplication
                active: 'rotate-180',
                inactive: '',
                container: 'space-y-3',
                body: 'text-gray-200 mt-3 text-lg leading-relaxed faq-body-padding', // Class for padding
              },
              transition: {
                enterFromClass: 'overflow-hidden max-h-0',
                enterActiveClass:
                  'transition-[max-height] duration-500 ease-in-out',
                enterToClass: 'max-h-[300px]', // Increased max-height for more content
                leaveFromClass: 'overflow-hidden max-h-[300px]',
                leaveActiveClass:
                  'transition-[max-height] duration-500 ease-in-out',
                leaveToClass: 'max-h-0',
              },
            }"
          >
            <template #default="{ item, index, open }">
              <UButton
                color="white"
                variant="ghost"
                class="accordion-button"
                :ui="{ rounded: 'rounded-none' }"
              >
                <span class="truncate text-white font-semibold">{{
                  item.label
                }}</span>
                <template #trailing>
                  <UIcon
                    name="i-heroicons-chevron-down-20-solid"
                    class="w-6 h-6 ms-auto transform transition-transform duration-200"
                    :class="[open && 'rotate-180']"
                  />
                </template>
              </UButton>
            </template>
          </UAccordion>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { navigateTo } from "#app"; // Import navigateTo for programmatic navigation

const handleLogin = () => {
  navigateTo("/login"); // Navigate to the login page
};
// Define GEC Error Types based on your PDF
const gecErrorTypes = [
  { label: "Adjective", value: "Adjective" },
  { label: "Noun Number", value: "Noun Number" },
  { label: "Spelling", value: "Spelling" },
  { label: "Adjective Form", value: "Adjective Form" },
  { label: "Adverb", value: "Adverb" },
  { label: "Conjunction", value: "Conjunction" },
  { label: "Contraction", value: "Contraction" },
  { label: "Determiner", value: "Determiner" },
  { label: "Morphology", value: "Morphology" },
  { label: "Noun", value: "Noun" },
  { label: "Noun Inflection", value: "Noun Inflection" },
  { label: "Noun Possessive", value: "Noun Possessive" },
  { label: "Orthography", value: "Orthography" },
  { label: "Other", value: "Other" },
  { label: "Particle", value: "Particle" },
  { label: "Preposition", value: "Preposition" },
  { label: "Pronoun", value: "Pronoun" },
  { label: "Punctuation", value: "Punctuation" },
  { label: "Subject Verb Agreement", value: "Subject Verb Agreement" },
  { label: "Unknown", value: "Unknown" },
  { label: "Verb", value: "Verb" },
  { label: "Verb Form", value: "Verb Form" },
  { label: "Verb Inflection", value: "Verb Inflection" },
  { label: "Verb Tense", value: "Verb Tense" },
  { label: "Word Order", value: "Word Order" },
];

// Mock GEC Examples (in Bahasa Indonesia)
// In a real app, this data would likely come from an API
const gecExamples = {
  Adjective: [
    {
      type: "Adjective",
      wrong: "Dia adalah seorang gadis cantik sekali.",
      correct: "Dia adalah seorang gadis yang sangat cantik.",
    },
    {
      type: "Adjective",
      wrong: "Rumah itu besar sekali.",
      correct: "Rumah itu sangat besar.",
    },
  ],
  "Noun Number": [
    {
      type: "Noun Number",
      wrong: "Banyak buku-buku di meja.",
      correct: "Banyak buku di meja.",
    },
    {
      type: "Noun Number",
      wrong: "Dia membeli dua apel.",
      correct: "Dia membeli dua buah apel.",
    },
  ],
  Spelling: [
    {
      type: "Spelling",
      wrong: "Saya suka makan mie instan.",
      correct: "Saya suka makan mi instan.",
    },
    {
      type: "Spelling",
      wrong: "Dia sedang belajar bahasa inggris.",
      correct: "Dia sedang belajar bahasa Inggris.",
    },
  ],
  "Adjective Form": [
    {
      type: "Adjective Form",
      wrong: "Dia merasa sangat senang sekali.",
      correct: "Dia merasa sangat senang.",
    },
    {
      type: "Adjective Form",
      wrong: "Pemandangan itu indah sekali.",
      correct: "Pemandangan itu sangat indah.",
    },
  ],
  Adverb: [
    {
      type: "Adverb",
      wrong: "Dia berbicara cepat.",
      correct: "Dia berbicara dengan cepat.",
    },
    {
      type: "Adverb",
      wrong: "Mereka bekerja keras.",
      correct: "Mereka bekerja dengan keras.",
    },
  ],
  Conjunction: [
    {
      type: "Conjunction",
      wrong: "Saya ingin pergi, tetapi saya lelah.",
      correct: "Saya ingin pergi, tapi saya lelah.",
    },
    {
      type: "Conjunction",
      wrong: "Dia pintar, namun dia malas.",
      correct: "Dia pintar, tetapi dia malas.",
    },
  ],
  Contraction: [
    {
      type: "Contraction",
      wrong: "Dia tak bisa datang.",
      correct: "Dia tidak bisa datang.",
    },
    { type: "Contraction", wrong: "Aku ngga mau.", correct: "Aku tidak mau." },
  ],
  Determiner: [
    {
      type: "Determiner",
      wrong: "Setiap anak-anak bermain.",
      correct: "Setiap anak bermain.",
    },
    {
      type: "Determiner",
      wrong: "Semua orang-orang setuju.",
      correct: "Semua orang setuju.",
    },
  ],
  Morphology: [
    {
      type: "Morphology",
      wrong: "Dia sedang menari-nari.",
      correct: "Dia sedang menari.",
    },
    {
      type: "Morphology",
      wrong: "Mereka saling tolong-menolong.",
      correct: "Mereka saling menolong.",
    },
  ],
  Noun: [
    {
      type: "Noun",
      wrong: "Saya pergi ke pasar membeli sayur.",
      correct: "Saya pergi ke pasar untuk membeli sayuran.",
    },
    {
      type: "Noun",
      wrong: "Dia adalah seorang guru yang baik.",
      correct: "Dia adalah guru yang baik.",
    },
  ],
  "Noun Inflection": [
    {
      type: "Noun Inflection",
      wrong: "Para siswa-siswi sedang belajar.",
      correct: "Para siswa sedang belajar.",
    },
    {
      type: "Noun Inflection",
      wrong: "Bunga-bunga itu indah.",
      correct: "Bunga itu indah.",
    },
  ],
  "Noun Possessive": [
    {
      type: "Noun Possessive",
      wrong: "Ini buku saya punya.",
      correct: "Ini buku saya.",
    },
    { type: "Noun Possessive", wrong: "Rumah dia.", correct: "Rumahnya." },
  ],
  Orthography: [
    { type: "Orthography", wrong: "di mana", correct: "di mana" }, // Example where wrong might be contextually okay, but showing common errors
    { type: "Orthography", wrong: "ke luar", correct: "keluar" },
  ],
  Other: [
    {
      type: "Other",
      wrong: "Saya tidak tahu apa-apa.",
      correct: "Saya tidak tahu.",
    },
    {
      type: "Other",
      wrong: "Dia sangat sangat bahagia.",
      correct: "Dia sangat bahagia.",
    },
  ],
  Particle: [
    {
      type: "Particle",
      wrong: "Apakah kamu sudah makan?",
      correct: "Apakah kamu sudah makan?",
    },
    {
      type: "Particle",
      wrong: "Dia pun tidak datang.",
      correct: "Dia tidak datang pun.",
    },
  ],
  Preposition: [
    {
      type: "Preposition",
      wrong: "Saya pergi di sekolah.",
      correct: "Saya pergi ke sekolah.",
    },
    {
      type: "Preposition",
      wrong: "Buku itu ada di atas meja.",
      correct: "Buku itu ada di atas meja.",
    },
  ],
  Pronoun: [
    { type: "Pronoun", wrong: "Saya dan dia pergi.", correct: "Kami pergi." },
    {
      type: "Pronoun",
      wrong: "Buku itu punya saya.",
      correct: "Buku itu milik saya.",
    },
  ],
  Punctuation: [
    {
      type: "Punctuation",
      wrong: "Apakah kamu sudah makan",
      correct: "Apakah kamu sudah makan?",
    },
    {
      type: "Punctuation",
      wrong: "Saya senang sekali",
      correct: "Saya senang sekali.",
    },
  ],
  "Subject Verb Agreement": [
    {
      type: "Subject Verb Agreement",
      wrong: "Mereka sedang makan.",
      correct: "Mereka sedang makan.",
    },
    {
      type: "Subject Verb Agreement",
      wrong: "Dia dan saya adalah teman.",
      correct: "Dia dan saya teman.",
    },
  ],
  Unknown: [
    {
      type: "Unknown",
      wrong: "Ini adalah hal yang aneh.",
      correct: "Ini hal aneh.",
    },
    {
      type: "Unknown",
      wrong: "Dia sangat sekali baik.",
      correct: "Dia sangat baik.",
    },
  ],
  Verb: [
    {
      type: "Verb",
      wrong: "Dia akan pergi kemarin.",
      correct: "Dia pergi kemarin.",
    },
    { type: "Verb", wrong: "Saya sudah makan.", correct: "Saya sudah makan." },
  ],
  "Verb Form": [
    {
      type: "Verb Form",
      wrong: "Mereka sedang makan.",
      correct: "Mereka sedang makan.",
    },
    {
      type: "Verb Form",
      wrong: "Dia akan pergi kemarin.",
      correct: "Dia pergi kemarin.",
    },
  ],
  "Verb Inflection": [
    {
      type: "Verb Inflection",
      wrong: "Dia sedang menari-nari.",
      correct: "Dia sedang menari.",
    },
    {
      type: "Verb Inflection",
      wrong: "Mereka saling tolong-menolong.",
      correct: "Mereka saling menolong.",
    },
  ],
  "Verb Tense": [
    {
      type: "Verb Tense",
      wrong: "Saya akan makan kemarin.",
      correct: "Saya makan kemarin.",
    },
    {
      type: "Verb Tense",
      wrong: "Dia sudah pergi besok.",
      correct: "Dia akan pergi besok.",
    },
  ],
  "Word Order": [
    {
      type: "Word Order",
      wrong: "Saya makan nasi sudah.",
      correct: "Saya sudah makan nasi.",
    },
    {
      type: "Word Order",
      wrong: "Buku itu baca saya.",
      correct: "Buku itu saya baca.",
    },
  ],
};

const selectedGecType = ref(gecErrorTypes[0]); // Default to the first type
const currentGecExampleIndex = ref(0);

const currentGecExample = computed(() => {
  const examples = gecExamples[selectedGecType.value.value];
  if (examples && examples.length > 0) {
    return examples[currentGecExampleIndex.value];
  }
  return null;
});

// Watch for changes in selectedGecType to reset the example index
watch(selectedGecType, () => {
  currentGecExampleIndex.value = 0;
});

const prevGecExample = () => {
  if (currentGecExampleIndex.value > 0) {
    currentGecExampleIndex.value--;
  }
};

const nextGecExample = () => {
  const examples = gecExamples[selectedGecType.value.value];
  if (examples && currentGecExampleIndex.value < examples.length - 1) {
    currentGecExampleIndex.value++;
  }
};

// FAQ Items
const faqItems = [
  {
    label: "Apa itu ANOTA?",
    content:
      "ANOTA adalah aplikasi anotasi dataset Grammatical Error Correction (GEC) yang dirancang khusus untuk Bahasa Indonesia. Tujuannya adalah membantu annotator menandai 25 tipe kesalahan, serta menghasilkan dataset dalam format paralel dan M2 secara otomatis.",
  },
  {
    label: "Siapa saja pengguna ANOTA?",
    content:
      "Pengguna ANOTA meliputi Admin (mengelola user dan dokumen), Annotator (menganotasi dokumen), Reviewer (meninjau anotasi), dan Kepala Riset (memantau progres dan menghasilkan dataset).",
  },
  {
    label: "Bagaimana cara kerja anotasi GEC di ANOTA?",
    content:
      "Anotator akan melihat dokumen teks dan menandai kesalahan tata bahasa sesuai dengan 25 tipe kesalahan GEC yang telah ditentukan. Setelah anotasi selesai, reviewer akan meninjau untuk memastikan kualitas, dan data dapat diekspor dalam format paralel atau M2.",
  },
  {
    label: "Apakah ANOTA mendukung berbagai jenis dokumen?",
    content:
      "Ya, ANOTA dirancang untuk menerima input berupa dokumen teks digital yang terdiri dari N kalimat. Setiap kalimat akan menjadi satuan data yang dapat diolah.",
  },
  {
    label:
      "Apakah saya perlu memiliki latar belakang linguistik untuk menggunakan ANOTA?",
    content:
      "Untuk peran Annotator dan Reviewer, pemahaman yang baik tentang tata bahasa Bahasa Indonesia sangat dianjurkan. ANOTA dirancang untuk mempermudah proses anotasi, namun keahlian linguistik akan sangat membantu dalam menghasilkan anotasi yang akurat.",
  },
];

// Set meta tags for the page
useHead({
  title: "ANOTA - Aplikasi Anotasi GEC Bahasa Indonesia",
  meta: [
    {
      name: "description",
      content:
        "Platform inovatif untuk anotasi Grammatical Error Correction (GEC) Bahasa Indonesia.",
    },
  ],
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap",
    },
  ],
});
</script>

<style scoped>
/*
  WARNING: This section uses direct CSS properties for spacing (padding/margin)
  as a workaround because Tailwind CSS utility classes for spacing
  are not visually applying as expected in your environment.

  The ideal solution is to properly configure Tailwind CSS
  so its utility classes work as intended.
  Please refer to the troubleshooting steps in the chat for potential fixes.
*/

/* Main content container */
.main-container {
  margin-left: auto;
  margin-right: auto;
  padding: 2rem 1rem; /* px-4 py-8 */
  position: relative; /* Needed for z-index of children */
  z-index: 10;
}

@media (min-width: 1024px) {
  /* lg breakpoint */
  .main-container {
    padding: 3rem 3rem; /* lg:px-12 lg:py-16 */
  }
}

/* Login Section */
.login-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 10rem); /* min-h-[calc(100vh-10rem)] */
  text-align: center;
  position: relative; /* For absolute-center-text */
  overflow: hidden; /* To contain moving text */
}

.absolute-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 15rem; /* Adjust as needed */
  font-weight: 900; /* Extra bold */
  color: rgba(255, 255, 255, 0.03); /* Very subtle white */
  pointer-events: none; /* Allows clicks to pass through */
  user-select: none; /* Prevents text selection */
  white-space: nowrap; /* Keep text on one line */
  animation: moveText 20s linear infinite alternate; /* Subtle horizontal movement */
  z-index: 0;
}

@media (max-width: 768px) {
  .absolute-center-text {
    font-size: 8rem; /* Smaller on mobile */
  }
}

@keyframes moveText {
  0% {
    transform: translate(-55%, -50%);
  }
  100% {
    transform: translate(-45%, -50%);
  }
}

.login-content-wrapper {
  padding: 2rem; /* p-8 */
  max-width: 48rem; /* max-w-4xl */
  width: 100%;
}

@media (min-width: 768px) {
  /* md breakpoint */
  .login-content-wrapper {
    padding: 3rem; /* md:p-12 */
  }
}

.title-text {
  font-size: 2.25rem; /* text-4xl */
  line-height: 2.5rem; /* leading-tight */
  font-weight: 800; /* font-extrabold */
  margin-bottom: 1rem; /* mb-4 */
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* drop-shadow-lg */
}

@media (min-width: 768px) {
  /* md breakpoint */
  .title-text {
    font-size: 3.75rem; /* md:text-6xl */
  }
}

.tagline-text {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 600; /* font-semibold */
  margin-bottom: 2rem; /* mb-8 */
  color: #a78bfa; /* purple-400 */
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

@media (min-width: 768px) {
  .tagline-text {
    font-size: 2rem; /* md:text-3xl */
  }
}

.description-text {
  font-size: 1.125rem; /* text-lg */
  line-height: 1.75rem; /* leading-relaxed */
  margin-bottom: 2.5rem; /* mb-10 */
  color: #e2e8f0; /* text-gray-200 */
  font-weight: 300; /* font-light */
  max-width: 42rem; /* max-w-2xl */
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 768px) {
  /* md breakpoint */
  .description-text {
    font-size: 1.5rem; /* md:text-2xl */
  }
}

.login-button {
  font-size: 1.125rem; /* text-lg */
  font-weight: 700; /* font-bold */
  padding: 1.25rem 2.5rem; /* px-10 py-5 */
  border-radius: 9999px; /* rounded-full */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.05); /* shadow-lg */
  transition: all 0.3s ease-in-out;
  background: linear-gradient(
    to right,
    #3b82f6,
    #9333ea
  ); /* bg-gradient-to-r from-blue-600 to-purple-600 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* border border-white/20 */
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.login-button::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300%;
  height: 300%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.7s ease-in-out;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  z-index: -1;
}

.login-button:hover::before {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

.login-button:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3), 0 20px 25px rgba(0, 0, 0, 0.1); /* hover:shadow-xl */
  transform: scale(1.05); /* hover:scale-105 */
  background: linear-gradient(
    to right,
    #2563eb,
    #7e22ce
  ); /* hover:from-blue-700 hover:to-purple-700 */
}

@media (min-width: 768px) {
  /* md breakpoint */
  .login-button {
    font-size: 1.25rem; /* md:text-xl */
  }
}

/* Information Sections */
.info-section,
.faq-section {
  padding-top: 6rem; /* py-24 */
  padding-bottom: 6rem; /* py-24 */
}

.section-title {
  font-size: 1.875rem; /* text-3xl */
  line-height: 2.25rem; /* leading-normal */
  font-weight: 700; /* font-bold */
  text-align: center;
  margin-bottom: 4rem; /* mb-16 */
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); /* drop-shadow-md */
}

@media (min-width: 768px) {
  /* md breakpoint */
  .section-title {
    font-size: 3rem; /* md:text-5xl */
    line-height: 1; /* md:leading-none */
  }
}

.zig-zag-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem; /* gap-16 */
  margin-bottom: 8rem; /* mb-32 */
}

@media (min-width: 1024px) {
  /* lg breakpoint */
  .zig-zag-row {
    flex-direction: row;
  }
}

.zig-zag-row-reverse {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem; /* gap-16 */
  margin-bottom: 8rem; /* mb-32 */
}

@media (min-width: 1024px) {
  /* lg breakpoint */
  .zig-zag-row-reverse {
    flex-direction: row-reverse;
  }
}

/* Glassmorphism Card */
.glassmorphism-card {
  background-color: rgba(255, 255, 255, 0.08); /* White with 8% opacity */
  backdrop-filter: blur(12px); /* Blurs the background behind the element */
  -webkit-backdrop-filter: blur(12px); /* For Safari support */
  border: 1px solid rgba(255, 255, 255, 0.15); /* Subtle white border */
  border-radius: 1.25rem; /* Rounded corners */
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15), 0 12px 20px rgba(0, 0, 0, 0.1); /* Soft shadow */
  transition: all 0.3s ease-in-out;
  width: 100%;
}

.glassmorphism-card:hover {
  background-color: rgba(
    255,
    255,
    255,
    0.12
  ); /* Slightly less transparent on hover */
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2), 0 15px 25px rgba(0, 0, 0, 0.15);
}

.gec-card,
.alur-card {
  padding: 2.5rem; /* p-10 */
}

@media (min-width: 768px) {
  /* md breakpoint */
  .gec-card,
  .alur-card {
    padding: 3rem; /* md:p-12 */
  }
}

.card-title {
  font-size: 1.5rem; /* text-2xl */
  line-height: 2rem; /* leading-normal */
  font-weight: 600; /* font-semibold */
  margin-bottom: 2rem; /* mb-8 */
  color: white;
}

@media (min-width: 768px) {
  /* md breakpoint */
  .card-title {
    font-size: 2.25rem; /* md:text-4xl */
  }
}

.dropdown-wrapper {
  margin-bottom: 1.5rem; /* mb-6 */
}

.gec-example-display {
  background-color: rgba(31, 41, 55, 0.4); /* bg-gray-800/40 */
  border-radius: 0.5rem; /* rounded-lg */
  padding: 1.5rem; /* p-6 */
  margin-bottom: 1.5rem; /* mb-6 */
  border: 1px solid rgba(255, 255, 255, 0.15); /* border border-white/15 */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); /* shadow-inner */
}

.gec-placeholder-text {
  text-align: center;
  color: #9ca3af; /* text-gray-400 */
  padding: 2rem; /* p-8 */
}

.navigation-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem; /* gap-6 */
  margin-top: 2rem; /* mt-8 */
}

.nav-button {
  padding: 1rem 2rem; /* px-8 py-4 */
  border-radius: 9999px; /* rounded-full */
  font-weight: 600; /* font-semibold */
  transition: background-color 0.2s ease-in-out; /* transition-colors duration-200 */
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15); /* border border-white/20 */
  color: white;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.1); /* hover:bg-white/10 */
}

/* Alur Penggunaan Card Items */
.alur-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem; /* p-6 */
  background-color: rgba(31, 41, 55, 0.5); /* bg-gray-800/50 */
  border-radius: 0.75rem; /* rounded-xl */
  border: 1px solid rgba(255, 255, 255, 0.1); /* border border-white/10 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.05); /* shadow-lg */
  transition: all 0.3s ease-in-out;
}

.alur-item:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15), 0 12px 20px rgba(0, 0, 0, 0.1); /* hover:shadow-xl */
  transform: translateY(-5px); /* subtle lift */
}

/* FAQ Section */
.faq-card {
  padding: 2.5rem; /* p-10 */
}

@media (min-width: 768px) {
  /* md breakpoint */
  .faq-card {
    padding: 3rem; /* md:p-12 */
  }
}

.faq-body-padding {
  padding-bottom: 1rem; /* pb-4 */
  padding-top: 0.5rem; /* pt-2 */
  padding-left: 1.5rem; /* px-6 */
  padding-right: 1.5rem; /* px-6 */
}

.accordion-button {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2); /* border-b border-white/20 */
  transition: background-color 0.2s ease-in-out; /* transition-colors duration-200 */
  padding: 1rem 1.5rem; /* px-6 py-4 */
  color: white;
}

.accordion-button:hover {
  background-color: rgba(255, 255, 255, 0.1); /* hover:bg-white/10 */
}

/* Background blob animations */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}

/* Fade-in animations for sections */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeIn 1s ease-out forwards;
  animation-delay: 0.5s; /* Delay for subsequent sections */
  opacity: 0; /* Hide initially */
}
</style>
