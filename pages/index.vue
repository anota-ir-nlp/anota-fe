<template>
  <div class="min-h-screen bg-white overflow-x-hidden text-gray-900 font-inter">
    <!-- Hero Section -->
    <section
      class="relative h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden"
    >
      <!-- Subtle Background Elements -->
      <div class="absolute inset-0">
        <div
          class="absolute top-1/4 right-1/4 opacity-5 transform rotate-12 scale-150"
        >
          <Lightbulb class="w-[400px] h-[400px] text-blue-200" />
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent opacity-30"
          ></div>
        </div>
        <div
          class="absolute top-1/3 left-1/4 w-2 h-2 bg-green-400 rounded-full opacity-60 animate-pulse"
        ></div>
        <div
          class="absolute bottom-1/3 right-1/3 w-3 h-3 bg-pink-400 rounded-full opacity-40 animate-pulse delay-1000"
        ></div>
        <div
          class="absolute top-1/2 left-1/6 w-1 h-1 bg-blue-400 rounded-full opacity-50 animate-pulse delay-500"
        ></div>
      </div>
      <!-- Hero Content -->
      <div
        class="relative z-10 text-center max-w-5xl mx-auto px-6 flex flex-col items-center"
      >
        <div class="mb-12">
          <h1
            class="text-5xl md:text-7xl mb-6 tracking-tight text-gray-900 font-light"
          >
            Anota
          </h1>
          <div
            class="w-24 h-1 bg-gradient-to-r from-green-500 to-pink-500 mx-auto rounded-full mb-8"
          ></div>
          <p class="text-xl text-gray-600 mb-4 tracking-wide font-light">
            Anotasi Cerdas. Dataset Sempurna.
          </p>
          <p
            class="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Platform inovatif untuk anotasi Grammatical Error Correction (GEC)
            Bahasa Indonesia. Mempermudah annotator, reviewer, dan kepala riset
            dalam menciptakan dataset berkualitas tinggi.
          </p>
        </div>
        <div class="flex gap-4 justify-center flex-wrap mb-8">
          <Button
            size="lg"
            class="btn-rect btn-rect-primary"
            @click="handleLogin"
          >
            Masuk ke Anota
            <ArrowRightFromLine class="ml-3 w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" class="btn-rect btn-rect-outline">
            Learn More
          </Button>
        </div>
        <div class="scroll-indicator" style="bottom: -8rem; margin-top: 0rem">
          <div
            class="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center"
          >
            <div
              class="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"
            ></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Built for Researchers, Loved by Linguists Section -->
    <section class="py-24 bg-gradient-to-b from-white to-gray-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl mb-2 text-gray-900 font-light">
            Built for Researchers,
          </h2>
          <h2 class="text-3xl mb-4 text-green-600 font-light">
            Loved by Linguists
          </h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Join thousands of researchers and developers who trust Anota for
            their grammatical error correction projects.
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <div class="card-outline p-8 text-center">
            <Zap class="w-8 h-8 text-green-500 mx-auto mb-4" />
            <div class="text-lg mb-2 text-gray-900 font-light">
              10x Faster Annotation
            </div>
            <div class="text-gray-600 font-light">
              AI-powered suggestions reduce manual work by 90%
            </div>
          </div>
          <div class="card-outline p-8 text-center">
            <Target class="w-8 h-8 text-pink-500 mx-auto mb-4" />
            <div class="text-lg mb-2 text-gray-900 font-light">
              Research-Grade Accuracy
            </div>
            <div class="text-gray-600 font-light">
              Validated annotation schemas ensure consistent quality
            </div>
          </div>
          <div class="card-outline p-8 text-center">
            <Users class="w-8 h-8 text-blue-500 mx-auto mb-4" />
            <div class="text-lg mb-2 text-gray-900 font-light">
              Collaborative Features
            </div>
            <div class="text-gray-600 font-light">
              Work with your team in real-time with built-in review tools
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div class="card-outline text-center p-6">
            <Zap class="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div class="text-2xl text-green-600 font-light">10x</div>
            <div class="text-xs text-gray-600 font-light">
              Faster Processing
            </div>
          </div>
          <div class="card-outline text-center p-6">
            <Target class="w-6 h-6 text-pink-500 mx-auto mb-2" />
            <div class="text-2xl text-pink-600 font-light">99%</div>
            <div class="text-xs text-gray-600 font-light">Accuracy Rate</div>
          </div>
          <div class="card-outline text-center p-6">
            <Users class="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div class="text-2xl text-blue-600 font-light">1000+</div>
            <div class="text-xs text-gray-600 font-light">Happy Users</div>
          </div>
          <div class="card-outline text-center p-6">
            <Book class="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div class="text-2xl text-purple-600 font-light">50M+</div>
            <div class="text-xs text-gray-600 font-light">Annotations</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      class="py-24 bg-gradient-to-r from-gray-900 to-black text-white relative overflow-hidden"
    >
      <div class="max-w-4xl mx-auto px-6 text-center relative">
        <h2 class="text-3xl mb-4 font-light">
          Ready to Transform Your
          <span class="block text-green-400">Dataset Annotation?</span>
        </h2>
        <p class="text-lg text-gray-300 mb-8 max-w-2xl mx-auto font-light">
          Join the revolution in grammatical error correction research. Start
          creating perfect datasets today.
        </p>
        <div class="flex gap-4 justify-center flex-wrap mb-4">
          <Button size="lg" class="btn-rect btn-rect-primary">
            <Zap class="mr-2 w-5 h-5" />
            Get Started Free
          </Button>
          <Button variant="outline" size="lg" class="btn-rect btn-rect-outline">
            <Users class="mr-2 w-5 h-5" />
            Contact Sales
          </Button>
        </div>
        <p class="text-gray-400 mt-6 font-light">
          No credit card required • Free trial available • Cancel anytime
        </p>
      </div>
    </section>

    <!-- FAQ Section (minimal, outlined, consistent style) -->
    <section class="py-24 bg-gradient-to-b from-white to-gray-50">
      <div class="max-w-7xl mx-auto px-6 relative">
        <div class="text-center mb-12">
          <h2 class="text-2xl mb-4 text-gray-900 font-light">
            Pertanyaan Umum (FAQ)
          </h2>
        </div>
        <div class="card-outline max-w-4xl mx-auto p-8">
          <Accordion type="single" collapsible class="w-full">
            <AccordionItem
              v-for="(item, index) in faqItems"
              :key="index"
              :value="`item-${index}`"
            >
              <AccordionTrigger
                class="text-gray-900 hover:text-gray-700 font-light"
              >
                {{ item.label }}
              </AccordionTrigger>
              <AccordionContent class="text-gray-600 font-light">
                {{ item.content }}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
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
  PenTool,
  FileCheck,
  Zap,
  Target,
  Users,
  Book,
} from "lucide-vue-next";

const handleLogin = () => {
  navigateTo("/login");
};

// GEC Example logic (from original index.vue)
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
    { type: "Orthography", wrong: "di mana", correct: "di mana" },
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

const selectedGecTypeValue = ref(gecErrorTypes[0].value);
const currentGecExampleIndex = ref(0);
const currentGecExample = computed(() => {
  const typeKey = selectedGecTypeValue.value;
  const examples = gecExamples[typeKey as keyof typeof gecExamples];
  if (examples && examples.length > 0) {
    return examples[currentGecExampleIndex.value];
  }
  return null;
});
watch(selectedGecTypeValue, () => {
  currentGecExampleIndex.value = 0;
});
const prevGecExample = () => {
  if (currentGecExampleIndex.value > 0) {
    currentGecExampleIndex.value--;
  }
};
const nextGecExample = () => {
  const examples =
    gecExamples[selectedGecTypeValue as keyof typeof gecExamples];
  if (examples && currentGecExampleIndex.value < examples.length - 1) {
    currentGecExampleIndex.value++;
  }
};

// FAQ (from original index.vue)
const faqItems = [
  {
    label: "Apa itu Anota?",
    content:
      "Anota adalah aplikasi anotasi dataset Grammatical Error Correction (GEC) yang dirancang khusus untuk Bahasa Indonesia. Tujuannya adalah membantu annotator menandai 25 tipe kesalahan, serta menghasilkan dataset dalam format paralel dan M2 secara otomatis.",
  },
  {
    label: "Siapa saja pengguna Anota?",
    content:
      "Pengguna Anota meliputi Admin (mengelola user dan dokumen), Annotator (menganotasi dokumen), Reviewer (meninjau anotasi), dan Kepala Riset (memantau progres dan menghasilkan dataset).",
  },
  {
    label: "Bagaimana cara kerja anotasi GEC di Anota?",
    content:
      "Anotator akan melihat dokumen teks dan menandai kesalahan tata bahasa sesuai dengan 25 tipe kesalahan GEC yang telah ditentukan. Setelah anotasi selesai, reviewer akan meninjau untuk memastikan kualitas, dan data dapat diekspor dalam format paralel atau M2.",
  },
  {
    label: "Apakah Anota mendukung berbagai jenis dokumen?",
    content:
      "Ya, Anota dirancang untuk menerima input berupa dokumen teks digital yang terdiri dari N kalimat. Setiap kalimat akan menjadi satuan data yang dapat diolah.",
  },
  {
    label:
      "Apakah saya perlu memiliki latar belakang linguistik untuk menggunakan Anota?",
    content:
      "Untuk peran Annotator dan Reviewer, pemahaman yang baik tentang tata bahasa Bahasa Indonesia sangat dianjurkan. Anota dirancang untuk mempermudah proses anotasi, namun keahlian linguistik akan sangat membantu dalam menghasilkan anotasi yang akurat.",
  },
];
</script>

<style scoped>
.scroll-indicator {
  /* existing styles */
  animation: scrollIdle 3s ease-in-out infinite;
}

@keyframes scrollIdle {
  0%,
  100% {
    bottom: -8rem;
  }
  50% {
    bottom: -7rem; /* Moves up by 1rem at the midpoint */
  }
}
</style>
