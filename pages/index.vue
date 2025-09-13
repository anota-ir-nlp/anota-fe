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
            class="text-8xl md:text-8xl mb-6 tracking-tight text-gray-900 font-light"
          >
            Anota
          </h1>
          <div
            class="w-24 h-1 animated-gradient-pinkgreen mx-auto rounded-full mb-8"
          ></div>
          <p class="text-xl text-gray-600 mb-2 tracking-wide font-light">
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
            class="btn-rect btn-rect-primary text-base animated-gradient-btn-greenblue"
            @click="handleLogin"
          >
            Masuk ke Anota
            <ArrowRightFromLine class="ml-3 w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            class="btn-rect btn-rect-outline text-base"
          >
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

    <!-- Mengapa Memilih Anota Section -->
    <section class="py-16 bg-gradient-to-b from-white to-gray-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-12">
          <h2 class="text-3xl mb-2 text-gray-900 font-light">
            Mengapa Memilih Anota?
          </h2>
          <div
            class="w-16 h-1 animated-gradient-pinkgreen mx-auto rounded-full mb-4"
          ></div>
          <p class="text-base text-gray-600 max-w-3xl mx-auto font-light">
            Platform kami menggabungkan teknologi canggih dan desain intuitif
            untuk membuat anotasi dataset lebih cepat, akurat, dan menyenangkan.
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <div
            class="card-outline p-6 text-center hover:shadow-xl hover:scale-[1.03] transition-all duration-200 border-gray-200/50 backdrop-blur-sm group cursor-pointer"
            title="Proses lebih cepat dengan Anota"
          >
            <div
              class="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <Zap class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-base mb-2 text-gray-900 font-light">
              Proses Cepat
            </h3>
            <p class="text-base text-gray-600 leading-relaxed font-light">
              Anota membantu mempercepat proses anotasi dengan fitur-fitur yang
              memudahkan pengguna dalam menandai kesalahan tata bahasa.
            </p>
          </div>
          <div
            class="card-outline p-6 text-center hover:shadow-xl hover:scale-[1.03] transition-all duration-200 border-gray-200/50 backdrop-blur-sm group cursor-pointer"
            title="Akurasi tinggi untuk hasil terbaik"
          >
            <div
              class="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <Target class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-base mb-2 text-gray-900 font-light">
              Akurasi Tinggi
            </h3>
            <p class="text-base text-gray-600 leading-relaxed font-light">
              Skema anotasi yang tervalidasi memastikan kualitas data yang
              konsisten dan siap digunakan untuk penelitian.
            </p>
          </div>
          <div
            class="card-outline p-6 text-center hover:shadow-xl hover:scale-[1.03] transition-all duration-200 border-gray-200/50 backdrop-blur-sm group cursor-pointer"
            title="Kolaborasi mudah dengan tim"
          >
            <div
              class="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
            >
              <Users class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-base mb-2 text-gray-900 font-light">
              Kolaborasi Mudah
            </h3>
            <p class="text-base text-gray-600 leading-relaxed font-light">
              Bekerja bersama tim secara real-time dengan fitur review dan
              monitoring progres yang terintegrasi.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Cara Kerja Anota Section -->
    <section class="py-16 bg-white relative overflow-hidden">
      <div class="w-full p-6 md:p-10">
        <div
          class="rounded-2xl border border-gray-200 bg-white/80 w-full p-4 md:p-8"
        >
          <div class="text-center mb-12">
            <h2 class="text-3xl mb-2 text-gray-900 font-light">
              Cara Kerja Anota
            </h2>
            <div
              class="w-16 h-1 animated-gradient-pinkgreen mx-auto rounded-full mb-4"
            ></div>
            <p class="text-base text-gray-600 font-light">
              Mulai dengan proses tiga langkah mudah berikut
            </p>
          </div>
          <div class="grid md:grid-cols-3 gap-8">
            <div
              class="text-center group cursor-pointer hover:bg-green-50 hover:shadow-lg rounded-xl p-6 transition-all duration-200"
              title="Unggah data teks Anda"
            >
              <div
                class="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
              >
                <span class="text-base text-white font-bold">1</span>
              </div>
              <h3 class="text-base mb-2 text-gray-900 font-light">
                Unggah Teks Anda
              </h3>
              <p class="text-base text-gray-600 leading-relaxed font-light">
                Impor data teks mentah Anda dalam berbagai format. Anota
                mendukung banyak tipe file dan unggahan massal untuk dataset
                besar.
              </p>
            </div>
            <div
              class="text-center group cursor-pointer hover:bg-pink-50 hover:shadow-lg rounded-xl p-6 transition-all duration-200"
              title="Anotasi cerdas dan mudah"
            >
              <div
                class="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
              >
                <span class="text-base text-white font-bold">2</span>
              </div>
              <h3 class="text-base mb-2 text-gray-900 font-light">
                Anotasi Cerdas
              </h3>
              <p class="text-base text-gray-600 leading-relaxed font-light">
                Gunakan alat anotasi interaktif untuk menandai kesalahan tata
                bahasa, koreksi, dan kategori. Fitur-fitur Anota mempercepat
                proses anotasi Anda.
              </p>
            </div>
            <div
              class="text-center group cursor-pointer hover:bg-blue-50 hover:shadow-lg rounded-xl p-6 transition-all duration-200"
              title="Ekspor dataset siap pakai"
            >
              <div
                class="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
              >
                <span class="text-base text-white font-bold">3</span>
              </div>
              <h3 class="text-base mb-2 text-gray-900 font-light">
                Ekspor & Gunakan
              </h3>
              <p class="text-base text-gray-600 leading-relaxed font-light">
                Unduh dataset yang telah dianotasi dengan sempurna, siap
                digunakan untuk pelatihan model GEC atau penelitian linguistik.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Keunggulan Anota Section (Benefits) -->
    <section class="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl mb-2 text-gray-900 font-light">
              Keunggulan <span class="block text-green-600">Anota</span>
            </h2>
            <div
              class="w-16 h-1 animated-gradient-pinkgreen mb-4 rounded-full"
            ></div>
            <p class="text-base text-gray-600 mb-6 font-light">
              Bergabunglah bersama ribuan peneliti dan pengembang yang
              mempercayai Anota untuk proyek koreksi kesalahan tata bahasa
              mereka.
            </p>
            <div class="space-y-4">
              <div
                class="flex items-start gap-3 group cursor-pointer hover:bg-green-50 rounded-lg p-2 transition-all duration-200"
                title="Lebih cepat dengan Anota"
              >
                <CheckCircle
                  class="w-6 h-6 text-green-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform"
                />
                <div>
                  <h4 class="text-base text-gray-900 mb-1 font-light">
                    10x Lebih Cepat
                  </h4>
                  <p class="text-base text-gray-600 font-light">
                    Fitur Anota mempercepat proses anotasi hingga 10 kali lipat
                    dibandingkan cara manual.
                  </p>
                </div>
              </div>
              <div
                class="flex items-start gap-3 group cursor-pointer hover:bg-pink-50 rounded-lg p-2 transition-all duration-200"
                title="Akurasi penelitian"
              >
                <CheckCircle
                  class="w-6 h-6 text-green-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform"
                />
                <div>
                  <h4 class="text-base text-gray-900 mb-1 font-light">
                    Akurasi Penelitian
                  </h4>
                  <p class="text-base text-gray-600 font-light">
                    Skema anotasi yang tervalidasi memastikan kualitas data yang
                    konsisten dan siap untuk penelitian.
                  </p>
                </div>
              </div>
              <div
                class="flex items-start gap-3 group cursor-pointer hover:bg-blue-50 rounded-lg p-2 transition-all duration-200"
                title="Kolaborasi tim"
              >
                <CheckCircle
                  class="w-6 h-6 text-green-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform"
                />
                <div>
                  <h4 class="text-base text-gray-900 mb-1 font-light">
                    Kolaborasi Tim
                  </h4>
                  <p class="text-base text-gray-600 font-light">
                    Bekerja bersama tim secara real-time dengan fitur review dan
                    monitoring progres yang terintegrasi.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="relative">
            <!-- Decorative background -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-green-100 to-pink-100 rounded-3xl transform rotate-6"
            ></div>
            <div class="relative bg-white p-8 rounded-3xl shadow-xl">
              <div class="grid grid-cols-2 gap-6">
                <div
                  class="text-center p-4 group cursor-pointer hover:bg-green-50 rounded-xl transition-all duration-200"
                  title="Proses lebih cepat"
                >
                  <div class="text-3xl mb-2">⚡</div>
                  <div class="text-2xl text-green-600 mb-1">10x</div>
                  <div class="text-base text-gray-600">Proses Lebih Cepat</div>
                </div>
                <div
                  class="text-center p-4 group cursor-pointer hover:bg-pink-50 rounded-xl transition-all duration-200"
                  title="Akurasi tinggi"
                >
                  <div class="text-3xl mb-2">🎯</div>
                  <div class="text-2xl text-pink-600 mb-1">99%</div>
                  <div class="text-base text-gray-600">Tingkat Akurasi</div>
                </div>
                <div
                  class="text-center p-4 group cursor-pointer hover:bg-blue-50 rounded-xl transition-all duration-200"
                  title="Pengguna puas"
                >
                  <div class="text-3xl mb-2">👥</div>
                  <div class="text-2xl text-blue-600 mb-1">1000+</div>
                  <div class="text-base text-gray-600">Pengguna Puas</div>
                </div>
                <div
                  class="text-center p-4 group cursor-pointer hover:bg-purple-50 rounded-xl transition-all duration-200"
                  title="Jumlah anotasi"
                >
                  <div class="text-3xl mb-2">📚</div>
                  <div class="text-2xl text-purple-600 mb-1">50Jt+</div>
                  <div class="text-base text-gray-600">Anotasi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pertanyaan Umum Section -->
    <section class="py-16 bg-gradient-to-b from-white to-gray-50">
      <div class="max-w-7xl mx-auto px-6 relative">
        <div class="text-center mb-10 flex flex-col items-center">
          <div class="flex items-center justify-center gap-2 mb-2">
            <HelpCircle class="w-7 h-7 text-green-500" />
            <h2 class="text-3xl text-gray-900 font-light">Pertanyaan Umum</h2>
          </div>
          <div
            class="w-16 h-1 animated-gradient-pinkgreen mx-auto rounded-full mb-4"
          ></div>
        </div>
        <div class="card-outline max-w-4xl mx-auto p-8">
          <Accordion type="single" collapsible class="w-full">
            <AccordionItem
              v-for="(item, index) in faqItems"
              :key="index"
              :value="`item-${index}`"
            >
              <AccordionTrigger
                class="text-gray-900 hover:text-blue-600 font-light transition-colors text-base"
              >
                {{ item.label }}
              </AccordionTrigger>
              <AccordionContent class="text-base text-gray-600 font-light">
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
  Zap,
  Target,
  Users,
  Book,
  CheckCircle,
  HelpCircle,
} from "lucide-vue-next";

const handleLogin = () => {
  navigateTo("/login");
};

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

const faqItems = [
  {
    label: "Apa itu Anota?",
    content:
      "Anota adalah aplikasi anotasi dataset Grammatical Error Correction (GEC) yang dirancang khusus untuk Bahasa Indonesia. Tujuannya adalah membantu annotator menandai 25 tipe kesalahan, serta menghasilkan dataset dalam format paralel dan M2 secara otomatis.",
  },
  {
    label: "Siapa saja yang dapat menggunakan ANOTA?",
    content:
      "Pengguna ANOTA meliputi Admin (mengelola user dan dokumen dalam project tertentu), Annotator (menganotasi dokumen yang ditugaskan), Reviewer (meninjau anotasi yang dibuat), dan Kepala Riset (mengelola semua project dan menghasilkan dataset). Setiap peran memiliki akses terbatas sesuai dengan tanggung jawab mereka.",
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
      "Untuk peran Annotator dan Reviewer, pemahaman yang baik tentang tata bahasa Bahasa Indonesia sangat dianjurkan. ANOTA dirancang untuk mempermudah proses anotasi dengan kontrol akses yang ketat, namun keahlian linguistik akan sangat membantu dalam menghasilkan anotasi yang akurat.",
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

/* Animated gradient for pink-green elements (lines, text) */
.animated-gradient-pinkgreen {
  background: linear-gradient(270deg, #22c55e, #ec4899, #f472b6, #22c55e);
  background-size: 400% 400%;
  animation: gradientMovePinkGreen 6s ease-in-out infinite;
}
.animated-gradient-text-pinkgreen {
  background: linear-gradient(270deg, #22c55e, #ec4899, #f472b6, #22c55e);
  background-size: 400% 400%;
  animation: gradientMovePinkGreen 6s ease-in-out infinite;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
@keyframes gradientMovePinkGreen {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Animated gradient for green-blue buttons */
.animated-gradient-btn-greenblue {
  background: linear-gradient(270deg, #22c55e, #38bdf8, #2563eb, #22c55e);
  background-size: 400% 400%;
  animation: gradientMoveGreenBlue 6s ease-in-out infinite;
  color: #fff !important;
  border: none;
  transition: background 0.2s;
}
.animated-gradient-btn-greenblue:hover {
  filter: brightness(1.1);
}
@keyframes gradientMoveGreenBlue {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
