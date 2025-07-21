<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white font-inter"
  >
    <!-- Header / Welcome Card -->
    <section
      class="w-full px-4 pt-8 pb-4 md:pt-12 md:pb-8 flex flex-col md:flex-row items-center md:items-start gap-6 max-w-7xl mx-auto"
    >
      <div
        class="glassmorphism-card flex-1 flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 shadow-xl"
      >
        <UAvatar
          :src="userData.avatar"
          :alt="userData.name"
          size="2xl"
          class="border-4 border-blue-500/50 shadow-lg"
        />
        <div class="flex-1 text-center md:text-left">
          <div
            class="flex items-center gap-2 justify-center md:justify-start mb-2"
          >
            <span class="text-lg text-gray-400">Hi,</span>
            <span class="text-2xl md:text-3xl font-bold text-white">
              {{ userData.name }}
            </span>
            <span
              class="ml-2 px-2 py-0.5 rounded bg-blue-700/30 text-blue-300 text-xs font-semibold uppercase tracking-wide"
            >
              {{ userData.role }}
            </span>
          </div>
          <div class="text-gray-400 text-base md:text-lg mb-2">
            <span class="hidden md:inline">Selamat datang kembali.</span>
            <span class="inline md:hidden">Selamat datang.</span>
          </div>
          <div
            class="flex flex-wrap gap-3 justify-center md:justify-start text-sm mt-2"
          >
            <span class="flex items-center gap-1">
              <UIcon
                name="i-heroicons-envelope"
                class="w-4 h-4 text-gray-400"
              />
              {{ userData.email }}
            </span>
            <span class="flex items-center gap-1">
              <UIcon
                name="i-heroicons-calendar"
                class="w-4 h-4 text-gray-400"
              />
              Bergabung {{ userData.memberSince }}
            </span>
          </div>
        </div>
        <div class="hidden md:flex flex-col gap-2 items-end">
          <UButton
            icon="i-heroicons-arrow-left"
            label="Ke Halaman Utama"
            color="neutral"
            variant="ghost"
            :ui="{
              base: 'rounded-full px-6 py-2 font-semibold border border-white/10 hover:bg-white/10',
            }"
            @click="navigateTo('/')"
          />
        </div>
      </div>
    </section>

    <!-- Statistics Grid -->
    <section class="w-full max-w-7xl mx-auto px-4 pb-8 flex-1">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        <div
          class="glassmorphism-card p-6 flex flex-col items-center shadow group hover:scale-[1.03] transition"
        >
          <UIcon
            name="i-lucide-file-text"
            class="w-10 h-10 text-green-400 mb-2"
          />
          <span class="text-3xl font-bold text-white">
            {{ statsData.documentsAnnotated }}
          </span>
          <span class="text-gray-400 mt-1 text-sm">Dokumen Dianotasi</span>
        </div>
        <div
          class="glassmorphism-card p-6 flex flex-col items-center shadow group hover:scale-[1.03] transition"
        >
          <UIcon
            name="i-lucide-check-circle"
            class="w-10 h-10 text-blue-400 mb-2"
          />
          <span class="text-3xl font-bold text-white">
            {{ userData.totalReviews }}
          </span>
          <span class="text-gray-400 mt-1 text-sm">Total Tinjauan</span>
        </div>
        <div
          class="glassmorphism-card p-6 flex flex-col items-center shadow group hover:scale-[1.03] transition"
        >
          <UIcon
            name="i-lucide-alert-triangle"
            class="w-10 h-10 text-red-400 mb-2"
          />
          <span class="text-3xl font-bold text-white">
            {{ statsData.annotationErrorsReviewed }}
          </span>
          <span class="text-gray-400 mt-1 text-sm">Kesalahan Direview</span>
        </div>
        <div
          class="glassmorphism-card p-6 flex flex-col items-center shadow group hover:scale-[1.03] transition"
        >
          <UIcon
            name="i-lucide-bar-chart-2"
            class="w-10 h-10 text-purple-400 mb-2"
          />
          <span class="text-3xl font-bold text-white">
            {{ userData.totalAnnotations }}
          </span>
          <span class="text-gray-400 mt-1 text-sm">Total Anotasi</span>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <!-- Bar Chart -->
        <div class="glassmorphism-card p-6 shadow">
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <UIcon
              name="i-lucide-folder-open"
              class="w-6 h-6 text-yellow-400"
            />
            Dokumen per Kategori
          </h3>
          <div class="chart-container">
            <div
              v-for="(category, i) in categoryData"
              :key="i"
              class="bar-chart-item"
            >
              <span class="bar-label">{{ category.name }}</span>
              <div class="bar-wrapper">
                <div
                  class="bar"
                  :style="{
                    width: (category.count / maxCategoryCount) * 100 + '%',
                  }"
                ></div>
                <span class="bar-value">{{ category.count }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Line Chart -->
        <div class="glassmorphism-card p-6 shadow">
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-trending-up" class="w-6 h-6 text-green-400" />
            Trend Anotasi Bulanan
          </h3>
          <div class="line-chart-container">
            <svg
              class="line-chart"
              viewBox="0 0 400 150"
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="#818cf8"
                stroke-width="2"
                :points="monthlyDataPoints"
                class="chart-line"
              />
              <polyline
                fill="rgba(129, 140, 248, 0.2)"
                stroke="none"
                :points="monthlyDataAreaPoints"
                class="chart-area"
              />
              <g class="chart-labels">
                <text
                  v-for="(point, i) in monthlyDataPointsArray"
                  :key="i"
                  :x="point.x"
                  :y="point.y - 5"
                  text-anchor="middle"
                  font-size="10"
                  fill="#cbd5e1"
                >
                  {{ point.value }}
                </text>
                <text
                  v-for="(month, i) in monthlyData"
                  :key="i"
                  :x="(i / (monthlyData.length - 1)) * 380 + 10"
                  y="145"
                  text-anchor="middle"
                  font-size="10"
                  fill="#94a3b8"
                >
                  {{ month.month.substring(0, 3) }}
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      <!-- Contribution Graph -->
      <div class="glassmorphism-card mt-10 p-6 shadow">
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <UIcon name="i-lucide-calendar-days" class="w-6 h-6 text-blue-400" />
          Performa Anotasi Harian
        </h3>
        <div class="flex flex-col items-center">
          <div class="flex items-center justify-between w-full mb-2">
            <span class="text-xs text-gray-400 font-mono">
              {{ graphStartDate }}
            </span>
            <span class="text-xs text-gray-400 font-mono">
              {{ graphEndDate }}
            </span>
          </div>
          <div class="overflow-x-auto w-full">
            <div class="flex">
              <!-- Day of week labels -->
              <div class="flex flex-col justify-between mr-2 h-[112px] pt-[18px]">
                <span class="text-xs text-gray-500 block h-[16px]">Sen</span>
                <span class="text-xs text-gray-500 block h-[16px]">Rab</span>
                <span class="text-xs text-gray-500 block h-[16px]">Jum</span>
                <span class="text-xs text-gray-500 block h-[16px]">Min</span>
              </div>
              <div>
                <!-- Month labels -->
                <div class="flex mb-1 ml-[18px]">
                  <span
                    v-for="(label, i) in monthLabels"
                    :key="i"
                    class="text-xs text-gray-400 w-[15px] text-center font-semibold"
                  >
                    {{ label }}
                  </span>
                </div>
                <!-- Contribution grid -->
                <div class="flex">
                  <div
                    class="flex flex-col"
                    v-for="(week, wIdx) in contributionWeeks"
                    :key="wIdx"
                  >
                    <div
                      v-for="(day, dIdx) in week"
                      :key="dIdx"
                      class="relative group"
                    >
                      <div
                        :class="['grid-cell', `level-${day.level}`]"
                        style="width: 15px; height: 15px; margin-bottom: 3px; border-radius: 4px;"
                      ></div>
                      <!-- Tooltip -->
                      <div
                        v-if="day.count > 0"
                        class="absolute z-20 left-1/2 -translate-x-1/2 -top-8 bg-gray-900/90 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap"
                      >
                        <span class="font-bold">{{ day.count }}</span> anotasi<br />
                        <span class="font-mono">{{ day.date }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="flex justify-between text-xs text-gray-400 mt-3 w-full px-2"
          >
            <span>Kurang</span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded-sm bg-level-1"></span>
              <span class="w-3 h-3 rounded-sm bg-level-2"></span>
              <span class="w-3 h-3 rounded-sm bg-level-3"></span>
              <span class="w-3 h-3 rounded-sm bg-level-4"></span>
              <span>Banyak</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import { ref, computed } from "vue";

const toast = useToast(); // Initialize useToast

const userRole = useState<string>("userRole", () => "Pengguna"); // Default to 'Pengguna' if not set
const userName = useState<string>("userName", () => "Pengguna Anonim"); // Default to 'Pengguna Anonim' if not set

// Dummy User Data
const userData = ref({
  name: userName.value,
  email: "pengguna@anota.com",
  role: userRole.value,
  memberSince: "1 Januari 2024",
  totalAnnotations: 1250,
  totalReviews: 875,
  avatar: "https://avatars.githubusercontent.com/u/739984?v=4", // Example avatar
});

// Dummy Statistics Data
const statsData = ref({
  documentsAnnotated: 150,
  documentsReviewed: 120,
  documentsPendingAnnotation: 30, // Not directly used in new overview cards, but kept for context
  annotationErrorsReviewed: 45,
});

// Dummy Data for Bar Chart (Jumlah Dokumen per Kategori)
const categoryData = ref([
  { name: "Teks", count: 80 },
  { name: "Gambar", count: 40 },
  { name: "Video", count: 20 },
  { name: "Audio", count: 10 },
]);
const maxCategoryCount = computed(() =>
  Math.max(...categoryData.value.map((c) => c.count))
);

// Dummy Data for Line Chart (Trend Anotasi Bulanan)
const monthlyData = ref([
  { month: "Jan", count: 20 },
  { month: "Feb", count: 35 },
  { month: "Mar", count: 50 },
  { month: "Apr", count: 45 },
  { month: "Mei", count: 60 },
  { month: "Jun", count: 75 },
  { month: "Jul", count: 80 },
]);

// Computed properties for Line Chart SVG points
const monthlyDataPoints = computed(() => {
  if (monthlyData.value.length === 0) return "";
  const maxCount = Math.max(...monthlyData.value.map((d) => d.count));
  const minCount = Math.min(...monthlyData.value.map((d) => d.count));
  const range = maxCount - minCount === 0 ? 1 : maxCount - minCount; // Avoid division by zero

  return monthlyData.value
    .map((d, i) => {
      const x = (i / (monthlyData.value.length - 1)) * 380 + 10; // Scale x to 10-390 (400 width - 2*10 padding)
      const y = 130 - ((d.count - minCount) / range) * 100; // Scale y to 30-130 (150 height - 20 top/bottom padding)
      return `${x},${y}`;
    })
    .join(" ");
});

const monthlyDataPointsArray = computed(() => {
  if (monthlyData.value.length === 0) return [];
  const maxCount = Math.max(...monthlyData.value.map((d) => d.count));
  const minCount = Math.min(...monthlyData.value.map((d) => d.count));
  const range = maxCount - minCount === 0 ? 1 : maxCount - minCount;

  return monthlyData.value.map((d, i) => {
    const x = (i / (monthlyData.value.length - 1)) * 380 + 10;
    const y = 130 - ((d.count - minCount) / range) * 100;
    return { x, y, value: d.count };
  });
});

const monthlyDataAreaPoints = computed(() => {
  if (monthlyData.value.length === 0) return "";
  const points = monthlyDataPoints.value;
  const lastX =
    monthlyDataPointsArray.value[monthlyDataPointsArray.value.length - 1]?.x ||
    0;
  const firstX = monthlyDataPointsArray.value[0]?.x || 0;
  return `${points} ${lastX},130 ${firstX},130`; // Close the area to the bottom
});

// Dummy Daily Performance Data (GitHub-like contribution graph)
const generateDailyPerformance = (days: number) => {
  const data = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - i)); // Go back in time
    const count = Math.floor(Math.random() * 11); // 0 to 10 annotations per day
    let level = 0;
    if (count > 0 && count <= 2) level = 1;
    else if (count > 2 && count <= 5) level = 2;
    else if (count > 5 && count <= 8) level = 3;
    else if (count > 8) level = 4;

    data.push({
      date: date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      count,
      level,
    });
  }
  return data;
};

const dailyPerformance = ref(generateDailyPerformance(90)); // Last 90 days

// Tabs for statistics section
const tabItems = [
  {
    label: "Ringkasan Statistik",
    icon: "i-heroicons-chart-pie",
    slot: "ringkasan",
  },
  {
    label: "Performa Harian",
    icon: "i-heroicons-calendar-days",
    slot: "performa",
  },
];
const selectedTab = ref(tabItems[0].slot); // Default to the first tab

// Helper: get the start of the week (Monday) for a given date
function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

// Prepare 90 days of data, fill into 13 weeks (columns) × 7 days (rows)
const contributionWeeks = computed(() => {
  const days = 91;
  const today = new Date();
  const startDate = getMonday(
    new Date(today.getTime() - (days - 1) * 24 * 60 * 60 * 1000)
  );
  const grid: any[][] = [];
  let dayCursor = new Date(startDate);

  for (let w = 0; w < 13; w++) {
    const week: any[] = [];
    for (let d = 0; d < 7; d++) {
      const perf = dailyPerformance.value.find(
        (p) =>
          new Date(p.date).toLocaleDateString("id-ID") ===
          dayCursor.toLocaleDateString("id-ID")
      );
      week.push(
        perf
          ? perf
          : {
              date: dayCursor.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              count: 0,
              level: 0,
            }
      );
      dayCursor.setDate(dayCursor.getDate() + 1);
    }
    grid.push(week);
  }
  return grid;
});

// Month labels above the grid
const monthLabels = computed(() => {
  const labels: string[] = [];
  let lastMonth = "";
  for (let w = 0; w < 13; w++) {
    const week = contributionWeeks.value[w];
    if (!week) {
      labels.push("");
      continue;
    }
    const firstDay = week[0];
    const date = new Date(firstDay.date);
    const month = date.toLocaleString("id-ID", { month: "short" });
    if (month !== lastMonth) {
      labels.push(month);
      lastMonth = month;
    } else {
      labels.push("");
    }
  }
  return labels;
});

// Date range for the graph
const graphStartDate = computed(() => {
  const first = contributionWeeks.value[0]?.[0];
  if (!first) return "";
  const date = new Date(first.date);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
});
const graphEndDate = computed(() => {
  const lastWeek = contributionWeeks.value[contributionWeeks.value.length - 1];
  const last = lastWeek?.[lastWeek.length - 1];
  if (!last) return "";
  const date = new Date(last.date);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
});

useHead({
  title: "Beranda - ANOTA",
  meta: [{ name: "description", content: "Halaman beranda aplikasi ANOTA." }],
});
</script>

<style scoped>
/* Main container background */
.min-h-screen {
  background-color: #0f172a;
}

/* Glassmorphism card effect */
.glassmorphism-card {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1.5px solid rgba(255, 255, 255, 0.18);
  border-radius: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18), 0 1.5px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.glassmorphism-card:hover {
  background-color: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.28);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22), 0 2px 12px rgba(0, 0, 0, 0.13);
}
.glassmorphism-card-inner {
  background-color: rgba(31, 41, 55, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
}

/* Animations */
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
  animation-delay: 0.3s;
  opacity: 0;
}

/* Statistics Minimal Cards */
.stat-minimal-card {
  background-color: rgba(31, 41, 55, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
}
.stat-minimal-card:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.22);
  border-color: rgba(255, 255, 255, 0.22);
}
.stat-minimal-icon {
  width: 2.5rem;
  height: 2.5rem;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.18));
}
.stat-minimal-label {
  font-size: 0.9rem;
  color: #a0aec0;
}
.stat-minimal-value {
  font-size: 1.75rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}

/* Bar Chart Styles */
.chart-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}
.bar-chart-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.bar-label {
  flex-shrink: 0;
  width: 60px;
  font-size: 0.9rem;
  color: #a0aec0;
}
.bar-wrapper {
  flex-grow: 1;
  background-color: rgba(255, 255, 255, 0.07);
  border-radius: 0.25rem;
  height: 20px;
  position: relative;
  overflow: hidden;
}
.bar {
  height: 100%;
  background: linear-gradient(to right, #60a5fa, #9333ea);
  border-radius: 0.25rem;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  animation: barFill 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.bar-value {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
@keyframes barFill {
  from {
    width: 0%;
  }
  to {
    width: var(--bar-width);
  }
}

/* Line Chart Styles */
.line-chart-container {
  width: 100%;
  height: 180px;
  padding: 10px;
  box-sizing: border-box;
}
.line-chart {
  width: 100%;
  height: 100%;
  overflow: visible;
}
.chart-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.chart-area {
  animation: fadeInArea 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}
@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes fadeInArea {
  to {
    opacity: 1;
  }
}
.chart-labels text {
  font-family: "Inter", sans-serif;
  transition: fill 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* GitHub-like Contribution Graph */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15px, 1fr));
  gap: 3px;
  padding: 10px;
  background-color: rgba(31, 41, 55, 0.7);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  overflow-x: auto;
  min-height: 100px;
}
.grid-cell {
  width: 15px;
  height: 15px;
  background-color: #161b22;
  border-radius: 2px;
  transition: background 0.2s, box-shadow 0.2s;
  cursor: pointer;
  border-radius: 4px;
  position: relative;
}
.grid-cell.level-0 {
  background-color: #161b22;
}
.grid-cell.level-1 {
  background-color: #0e4429;
}
.grid-cell.level-2 {
  background-color: #006d32;
}
.grid-cell.level-3 {
  background-color: #26a641;
}
.grid-cell.level-4 {
  background-color: #39d353;
}
.grid-cell:hover,
.grid-cell:focus {
  box-shadow: 0 0 0 2px #60a5fa, 0 2px 8px rgba(0, 0, 0, 0.18);
  z-index: 10;
}
.bg-level-1 {
  background-color: #0e4429;
}
.bg-level-2 {
  background-color: #006d32;
}
.bg-level-3 {
  background-color: #26a641;
}
.bg-level-4 {
  background-color: #39d353;
}

/* Override Nuxt UI Tabs styling for dark theme */
:deep(.u-tabs) {
  .u-tabs-list {
    background-color: rgba(31, 41, 55, 0.8);
    border-color: rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
  }
  .u-tabs-item {
    color: #e2e8f0;
    &.u-tabs-item-active {
      color: white;
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}
/* Darkest green/blue */
.grid-cell.level-2 {
  background-color: #006d32;
} /* Darker green/blue */
.grid-cell.level-3 {
  background-color: #26a641;
} /* Medium green/blue */
.grid-cell.level-4 {
  background-color: #39d353;
} /* Lightest green/blue */

/* Tailwind colors for the legend */
.bg-level-1 {
  background-color: #0e4429;
}
.bg-level-2 {
  background-color: #006d32;
}
.bg-level-3 {
  background-color: #26a641;
}
.bg-level-4 {
  background-color: #39d353;
}

/* Override Nuxt UI Tabs styling for dark theme */
:deep(.u-tabs) {
  .u-tabs-list {
    background-color: rgba(31, 41, 55, 0.8); /* Darker tab background */
    border-color: rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
  }
  .u-tabs-item {
    color: #e2e8f0; /* Light gray text */
    &.u-tabs-item-active {
      color: white; /* White text for active tab */
      background-color: rgba(255, 255, 255, 0.1); /* Subtle active background */
    }
  }
}
</style>
