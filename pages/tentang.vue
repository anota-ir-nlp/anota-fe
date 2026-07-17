<script setup lang="ts">
import { Lightbulb, Pencil, FileCheck, BarChart3, Users, FileText, CheckCircle2, GraduationCap, Globe, Linkedin } from "lucide-vue-next";

const roles = [
  {
    icon: Pencil,
    title: "Anotator",
    description: "Melakukan anotasi terhadap dokumen yang ditugaskan sesuai skema anotasi Grammatical Error Correction (GEC).",
  },
  {
    icon: FileCheck,
    title: "Reviewer",
    description: "Melakukan pemeriksaan dan validasi hasil anotasi untuk menjaga konsistensi dan kualitas dataset.",
  },
  {
    icon: BarChart3,
    title: "Kepala Proyek",
    description: "Memantau pelaksanaan proyek melalui informasi statistik dan kemajuan anotasi.",
  },
  {
    icon: Users,
    title: "Admin Proyek",
    description: "Mengelola proyek, dokumen, pengguna, dan penugasan anotasi.",
  },
];

const features = [
  "Pengelolaan proyek dan dokumen anotasi",
  "Manajemen pengguna berbasis peran (RBAC)",
  "Proses anotasi dan review yang terstruktur",
  "Ekspor dataset dalam format teks paralel dan format M2",
];

const contributors = [
  { name: "Ika Alfina", role: "Ketua", type: "dosen", url: "https://cs.ui.ac.id/personnel/ika-alfina/" },
  { name: "Syifa Nurhayati", role: "Anggota", type: "dosen", url: "https://cs.ui.ac.id/personnel/syifa-nurhayati-m-kom/" },
  { name: "Juan Dharmananda Khusuma", role: "Anggota", type: "dev", url: "https://www.linkedin.com/in/juandk89" },
  { name: "Lim Bodhi Wijaya", role: "Anggota", type: "dev", url: "https://www.linkedin.com/in/limbodhiwijaya/" },
  { name: "Samuel Taniel Mulyadi", role: "Anggota", type: "dev", url: "https://www.linkedin.com/in/samuel-taniel-mulyadi" },
  { name: "Alden Luthfi Arrahman", role: "Anggota", type: "dev", url: "https://www.linkedin.com/in/aldenluthfi" },
  { name: "Fernando Valentino Sitinjak", role: "Anggota", type: "dev", url: "https://www.linkedin.com/in/fernando-valentino-sitinjak" },
  { name: "Fiona Ratu Maheswari", role: "Anggota", type: "dev", url: "https://www.linkedin.com/in/fiona-ratu-maheswari-52399a245" },
];
</script>

<template>
  <div class="min-h-screen bg-white">
    <section class="relative overflow-hidden">
      <div class="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
          <Lightbulb class="w-4 h-4" />
          <span>Tentang Anota</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-4">
          Platform Anotasi untuk<br class="hidden md:block" />
          Koreksi Kesalahan Gramatikal
        </h1>
        <p class="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
          Anota membantu tim riset membangun dataset Natural Language Processing melalui proses
          anotasi yang terstruktur, kolaboratif, dan terdokumentasi, dengan implementasi awal
          pada Modul Grammatical Error Correction (GEC).
        </p>
      </div>
    </section>

    <section class="max-w-5xl mx-auto px-6 pb-20">
      <div class="grid md:grid-cols-2 gap-6">
        <div v-for="role in roles" :key="role.title" class="p-6 rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all">
          <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
            <component :is="role.icon" class="w-5 h-5 text-blue-500" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ role.title }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ role.description }}</p>
        </div>
      </div>
    </section>

    <section class="bg-gray-50 border-y border-gray-100">
      <div class="max-w-5xl mx-auto px-6 py-16">
        <div class="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 class="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
              Fitur Utama
            </h2>
            <p class="text-gray-500 leading-relaxed mb-6">
              Dibangun di atas Core Platform dan Annotation Framework yang modular, mendukung
              alur kerja anotasi dari pembentukan proyek hingga ekspor dataset.
            </p>
            <ul class="space-y-3">
              <li v-for="feature in features" :key="feature" class="flex items-start gap-3">
                <CheckCircle2 class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span class="text-gray-700 text-sm">{{ feature }}</span>
              </li>
            </ul>
          </div>
          <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
                <FileText class="w-4 h-4 text-white" />
              </div>
              <span class="font-medium text-gray-900">Dokumen Anotasi</span>
            </div>
            <div class="space-y-3">
              <div class="h-3 rounded-full bg-gray-100 w-full"></div>
              <div class="h-3 rounded-full bg-gray-100 w-5/6"></div>
              <div class="h-3 rounded-full bg-blue-100 w-2/3"></div>
              <div class="h-3 rounded-full bg-gray-100 w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="max-w-5xl mx-auto px-6 py-20">
      <div class="text-center mb-14">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-6">
          <GraduationCap class="w-4 h-4" />
          <span>Kontributor</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
          Kontributor Anota v1.0
        </h2>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="contributor in contributors"
          :key="contributor.name"
          class="p-6 rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/60 to-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col items-center text-center"
        >
          <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mb-4 shadow-sm">
            <Users class="w-5 h-5 text-white" />
          </div>
          <div class="min-h-[2.5rem] flex items-center justify-center mb-1">
            <div class="text-sm font-medium text-gray-900 leading-snug">{{ contributor.name }}</div>
          </div>
          <span class="inline-block text-xs font-semibold text-white bg-blue-500 px-3 py-1 rounded-full mb-4">
            {{ contributor.role }}
          </span>
          <a
            :href="contributor.url"
            target="_blank"
            rel="noopener noreferrer"
            class="w-8 h-8 rounded-lg bg-white border border-blue-200 flex items-center justify-center hover:bg-blue-500 hover:border-blue-500 group transition-all"
          >
            <Globe v-if="contributor.type === 'dosen'" class="w-4 h-4 text-blue-500 group-hover:text-white transition-all" />
            <Linkedin v-else class="w-4 h-4 text-blue-500 group-hover:text-white transition-all" />
          </a>
        </div>
      </div>
    </section>

  </div>
</template>