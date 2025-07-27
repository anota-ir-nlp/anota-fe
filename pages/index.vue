<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white font-inter relative overflow-hidden">
    <!-- Subtle background circles for modern feel -->
    <div class="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply blur-2xl opacity-20 animate-pulse"></div>
    <div class="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply blur-2xl opacity-20 animate-pulse"></div>
    <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply blur-2xl opacity-20 animate-pulse"></div>

    <!-- Main content container -->
    <div class="mx-auto p-4 py-8 lg:p-12 relative z-10 max-w-7xl">
      <!-- Login Section -->
      <section class="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center relative overflow-hidden">
        <!-- Giant background text for techy vibe -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] md:text-[8rem] font-black text-white/3 opacity-5 pointer-events-none select-none whitespace-nowrap z-0">
          ANOTA
        </div>

        <Card variant="glassmorphism" class="p-8 md:p-12 max-w-4xl w-full relative z-10 bg-white/10 backdrop-blur-[14px] border border-white/18 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.18),0_1.5px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out hover:bg-white/16 hover:border-white/28 hover:shadow-[0_12px_32px_rgba(0,0,0,0.22),0_2px_12px_rgba(0,0,0,0.13)]">
          <h1 class="text-4xl md:text-6xl font-extrabold mb-4 text-white leading-tight drop-shadow-lg flex items-center justify-center gap-4">
            <Lightbulb class="w-12 h-12 text-blue-400" />
            ANOTA
          </h1>
          <p class="text-2xl md:text-3xl font-semibold mb-8 text-purple-400 drop-shadow-sm">
            Anotasi Cerdas. Dataset Sempurna.
          </p>
          <p class="text-lg md:text-2xl mb-10 text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
            Platform inovatif untuk anotasi Grammatical Error Correction (GEC)
            Bahasa Indonesia. Mempermudah annotator, reviewer, dan kepala riset
            dalam menciptakan dataset berkualitas tinggi.
          </p>
          <Button
            variant="gradient"
            size="xl"
            @click="handleLogin"
          >
            <ArrowRightFromLine class="w-5 h-5" />
            Masuk ke ANOTA
          </Button>
        </Card>
      </section>

      <!-- Informasi Utama -->
      <section class="py-16 delay-300">
        <h2 class="text-3xl md:text-5xl font-bold text-center mb-12 text-white drop-shadow-md leading-none">
          Informasi Penting
        </h2>

        <!-- GEC Examples Card (Zig-zag 1) -->
        <div class="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <Card variant="glassmorphism" class="p-6 md:p-8 w-full bg-white/10 backdrop-blur-[14px] border border-white/18 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.18),0_1.5px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out hover:bg-white/16 hover:border-white/28 hover:shadow-[0_12px_32px_rgba(0,0,0,0.22),0_2px_12px_rgba(0,0,0,0.13)]">
            <h3 class="text-2xl md:text-4xl font-semibold mb-8 text-white">
              Contoh Tipe Kesalahan GEC
            </h3>
            <div class="mb-6">
              <Select v-model="selectedGecType">
                <SelectTrigger class="w-full text-white bg-white/10 border-white/20 hover:bg-white/20" size="default">
                  <SelectValue placeholder="Pilih Tipe Kesalahan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="option in gecErrorTypes"
                    :key="option.value"
                    :value="option"
                  >
                    {{ option.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <transition name="fade" enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-300" enter-from-class="opacity-0" leave-to-class="opacity-0">
              <Card v-if="currentGecExample" variant="glassmorphism" class="p-6 mb-6 bg-white/10 backdrop-blur-[14px] border border-white/18 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.18),0_1.5px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-white/16 hover:border-white/28 hover:shadow-[0_12px_32px_rgba(0,0,0,0.22),0_2px_12px_rgba(0,0,0,0.13)]">
                <p class="text-base text-gray-300 mb-3">
                  Tipe: <span class="font-bold text-white">{{ currentGecExample.type }}</span>
                </p>
                <p class="text-red-300 mb-3 text-xl font-mono leading-relaxed">
                  Salah: <span class="font-mono text-red-100">{{ currentGecExample.wrong }}</span>
                </p>
                <p class="text-green-300 text-xl font-mono leading-relaxed">
                  Benar: <span class="font-mono text-green-100">{{ currentGecExample.correct }}</span>
                </p>
              </Card>
              <div v-else class="text-center text-gray-400 p-8 text-lg">
                <p>Pilih tipe kesalahan untuk melihat contoh.</p>
              </div>
            </transition>

            <div class="flex justify-center gap-6 mt-8">
              <Button
                variant="outline"
                :disabled="currentGecExampleIndex === 0"
                @click="prevGecExample"
              >
                <ArrowLeft class="w-4 h-4" />
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                :disabled="currentGecExampleIndex >= (gecExamples[selectedGecType.value as keyof typeof gecExamples]?.length || 0) - 1"
                @click="nextGecExample"
              >
                Berikutnya
                <ArrowRight class="w-4 h-4" />
              </Button>
            </div>
          </Card>
          <div class="lg:w-1/2 w-full flex justify-center items-center">
            <FileText class="w-48 h-48 text-blue-400 opacity-70 drop-shadow-2xl" />
          </div>
        </div>

        <!-- Alur Penggunaan Card (Zig-zag 2) -->
        <div class="flex flex-col lg:flex-row-reverse items-center gap-16 mb-24">
          <Card variant="glassmorphism" class="p-6 md:p-8 w-full bg-white/10 backdrop-blur-[14px] border border-white/18 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.18),0_1.5px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out hover:bg-white/16 hover:border-white/28 hover:shadow-[0_12px_32px_rgba(0,0,0,0.22),0_2px_12px_rgba(0,0,0,0.13)]">
            <h3 class="text-2xl md:text-4xl font-semibold mb-8 text-white">
              Alur Penggunaan Aplikasi
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
              <Card v-for="role in appRoles" :key="role.name" variant="glassmorphism" class="flex flex-col items-center p-6 hover:scale-105 transition-transform duration-300 bg-white/10 backdrop-blur-[14px] border border-white/18 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.18),0_1.5px_8px_rgba(0,0,0,0.1)] hover:bg-white/16 hover:border-white/28 hover:shadow-[0_12px_32px_rgba(0,0,0,0.22),0_2px_12px_rgba(0,0,0,0.13)]">
                <component :is="role.iconComponent" class="w-16 h-16 mb-4" :class="role.color" />
                <p class="font-bold text-white text-xl mb-1">{{ role.name }}</p>
                <p class="text-gray-200 text-base leading-relaxed">{{ role.description }}</p>
              </Card>
            </div>
          </Card>
          <div class="lg:w-1/2 w-full flex justify-center items-center">
            <ArrowLeftRight class="w-48 h-48 text-purple-400 opacity-70 drop-shadow-2xl" />
          </div>
        </div>
      </section>

      <!-- FAQ Section (Centered Accordion) -->
      <section class="py-16 delay-300">
        <h2 class="text-3xl md:text-5xl font-bold text-center mb-12 text-white drop-shadow-md leading-none">
          Pertanyaan Umum (FAQ)
        </h2>
        <Card variant="glassmorphism" class="max-w-4xl mx-auto p-6 md:p-8 bg-white/10 backdrop-blur-[14px] border border-white/18 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.18),0_1.5px_8px_rgba(0,0,0,0.1)] transition-all duration-300 ease-out hover:bg-white/16 hover:border-white/28 hover:shadow-[0_12px_32px_rgba(0,0,0,0.22),0_2px_12px_rgba(0,0,0,0.13)]">
          <Accordion type="single" collapsible class="w-full">
            <AccordionItem v-for="(item, index) in faqItems" :key="index" :value="`item-${index}`">
              <AccordionTrigger class="text-white hover:text-gray-200">
                {{ item.label }}
              </AccordionTrigger>
              <AccordionContent class="text-gray-200">
                {{ item.content }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { navigateTo } from "#app";
import {
  Lightbulb,
  ArrowRightFromLine,
  ArrowLeft,
  ArrowRight,
  FileText,
  ArrowLeftRight,
  Users,
  PenTool,
  FileCheck,
  BarChart3
} from "lucide-vue-next";

const handleLogin = () => {
  navigateTo("/login");
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
  const examples = gecExamples[selectedGecType.value.value as keyof typeof gecExamples];
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
  const examples = gecExamples[selectedGecType.value.value as keyof typeof gecExamples];
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

const appRoles = [
  {
    name: "Admin",
    iconComponent: Users,
    color: "text-blue-400",
    description: "Mengelola pengguna, menetapkan dokumen untuk anotasi dan review.",
  },
  {
    name: "Annotator",
    iconComponent: PenTool,
    color: "text-green-400",
    description: "Menganotasi dokumen teks untuk mengidentifikasi dan mengoreksi kesalahan GEC.",
  },
  {
    name: "Reviewer",
    iconComponent: FileCheck,
    color: "text-purple-400",
    description: "Meninjau anotasi yang telah dibuat, memastikan kualitas dan konsistensi.",
  },
  {
    name: "Kepala Riset",
    iconComponent: BarChart3,
    color: "text-pink-400",
    description: "Memantau progres, melihat rekap kinerja, dan menghasilkan dataset GEC dalam format paralel atau M2.",
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