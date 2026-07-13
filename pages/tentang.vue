<script setup lang="ts">
import { Lightbulb, Pencil, FileCheck, BarChart3, Users, FileText, CheckCircle2, GraduationCap } from "lucide-vue-next";
import { Button } from "~/components/ui/button";

const roles = [
  {
    icon: Pencil,
    title: "Anotator",
    description: "Membuat dan mengedit anotasi pada dokumen sesuai pedoman GEC (Grammatical Error Correction) untuk Bahasa Indonesia.",
  },
  {
    icon: FileCheck,
    title: "Reviewer",
    description: "Meninjau dan memvalidasi hasil anotasi sebelum dokumen dinyatakan selesai dan siap digunakan sebagai dataset.",
  },
  {
    icon: BarChart3,
    title: "Kepala Proyek",
    description: "Memantau progres proyek riset, analitik anotasi, dan mengelola alur kerja tim secara keseluruhan.",
  },
  {
    icon: Users,
    title: "Admin Proyek",
    description: "Mengelola pengguna, dokumen, dan penugasan dokumen pada proyek.",
  },
];

const features = [
  "Anotasi kesalahan gramatikal berbasis dokumen",
  "Alur kerja multi-peran (Annotator, Reviewer, Admin Proyek, Kepala Proyek)",
  "Riwayat anotasi yang dapat ditelusuri",
  "Ekspor dokumen dan laporan progres",
];

const timeline = [
  {
    period: "TA Sebelumnya",
    label: "Frontend",
    members: [
      { name: "Alden Luthfi Arrahman", npm: "2206028932", major: "Ilmu Komputer" },
      { name: "Samuel Taniel Mulyadi", npm: "2206081805", major: "Ilmu Komputer" },
    ],
  },
  {
    period: "TA Sebelumnya",
    label: "Backend",
    members: [
      { name: "Juan Dharmananda Khusuma", npm: "2206081521", major: "Ilmu Komputer" },
      { name: "Lim Bodhi Wijaya", npm: "2206082410", major: "Sistem Informasi" },
    ],
  },
  {
    period: "Anota v1.0",
    label: "Evaluasi dan Pengembangan Lanjut Website Anotasi Dataset Grammatical Error Correction",
    members: [
      { name: "Fernando Valentino Sitinjak", npm: "2206081332", major: "Ilmu Komputer" },
      { name: "Fiona Ratu Maheswari", npm: "2206024575", major: "Sistem Informasi" },
    ],
  },
];

const advisors = [
  { name: "Dr. Ika Alfina, S.Kom., M.Kom.", role: "Pembimbing 1" },
  { name: "Syifa Nurhayati, S.Kom., M.Kom.", role: "Pembimbing 2" },
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
          Anota membantu tim riset membangun, mengelola, dan meninjau dataset anotasi GEC
          Bahasa Indonesia secara kolaboratif dan terstruktur.
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
              Dibangun untuk mendukung proses anotasi yang konsisten, terlacak, dan
              mudah diaudit dari awal hingga akhir.
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
          Perjalanan Pengembangan Anota
        </h2>
        <p class="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Anota dikembangkan secara berkelanjutan lintas angkatan Tugas Akhir,
          hingga mencapai versi Anota v1.0 saat ini.
        </p>
      </div>

      <div class="relative">
        <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 md:-translate-x-1/2"></div>

        <div class="space-y-10">
          <div
            v-for="(entry, index) in timeline"
            :key="entry.period + entry.label"
            class="relative flex flex-col md:flex-row items-start gap-6"
            :class="index % 2 === 1 ? 'md:flex-row-reverse' : ''"
          >
            <div class="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-100 -translate-x-1/2 mt-2"></div>

            <div class="w-full md:w-1/2 pl-10 md:pl-0" :class="index % 2 === 1 ? 'md:pl-10' : 'md:pr-10 md:text-right'">
              <span class="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
                {{ entry.period }}
              </span>
              <div class="p-6 rounded-2xl border border-gray-200 bg-white hover:shadow-sm transition-all">
                <h3 class="font-semibold text-gray-900 mb-4">{{ entry.label }}</h3>
                <div class="space-y-3">
                  <div v-for="member in entry.members" :key="member.npm" class="flex items-start gap-3" :class="index % 2 === 1 ? '' : 'md:flex-row-reverse md:text-right'">
                    <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Users class="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ member.name }}</div>
                      <div class="text-xs text-gray-400">{{ member.npm }} · {{ member.major }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="hidden md:block md:w-1/2"></div>
          </div>
        </div>
      </div>

      <div class="mt-14 p-6 rounded-2xl border border-gray-200 bg-gray-50">
        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 text-center">
          Dosen Pembimbing
        </h3>
        <div class="flex flex-col sm:flex-row justify-center gap-6">
          <div v-for="advisor in advisors" :key="advisor.name" class="flex items-center gap-3 justify-center">
            <div class="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
              <GraduationCap class="w-4 h-4 text-white" />
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900">{{ advisor.name }}</div>
              <div class="text-xs text-gray-400">{{ advisor.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>