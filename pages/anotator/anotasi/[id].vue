<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter bg-white text-black">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <!-- Header Row: Full Width -->
      <div class="bg-white border border-gray-200 rounded-3xl p-6 mb-6">
        <div class="flex items-center justify-between">
          <!-- Left: Kembali Button -->
          <UButton
            label="Kembali"
            icon="i-heroicons-arrow-left"
            class="rounded-full px-4 py-2 font-semibold bg-black text-white border border-gray-200 hover:bg-gray-900 focus:ring-2 focus:ring-black shadow-none"
            @click="router.back()"
            title="Kembali"
          />

          <!-- Center: Title and Document Info -->
          <div class="text-center flex-1">
            <h1
              class="text-2xl font-bold flex items-center gap-2 justify-center text-black"
            >
              <span
                class="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-blue-50"
              >
                <svg
                  class="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <line x1="8" y1="8" x2="16" y2="8" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="8" y1="16" x2="12" y2="16" />
                </svg>
              </span>
              Anotasi Dokumen
            </h1>
            <div class="text-gray-500 text-sm mt-1" v-if="document">
              Dokumen
              <span class="font-semibold text-black">#{{ document.id }}</span>
              &mdash; {{ document.title }}
            </div>
          </div>

          <!-- Right: Navigation Buttons -->
          <div class="flex items-center gap-2 flex-wrap">
            <UButton
              icon="i-heroicons-chevron-left"
              class="rounded-full px-3 py-2 bg-black text-white border border-gray-200 hover:bg-gray-900 focus:ring-2 focus:ring-black shadow-none"
              title="Dokumen Sebelumnya"
              @click="navigateDocument(-1)"
            />
            <UButton
              icon="i-heroicons-chevron-right"
              class="rounded-full px-3 py-2 bg-black text-white border border-gray-200 hover:bg-gray-900 focus:ring-2 focus:ring-black shadow-none"
              title="Dokumen Selanjutnya"
              @click="navigateDocument(1)"
            />
          </div>
        </div>
      </div>

      <!-- View Mode Tabs -->
      <div class="bg-white border border-gray-200 rounded-3xl p-4 mb-6">
        <div class="flex gap-2">
          <button
            v-for="mode in viewModes"
            :key="mode.id"
            @click="currentViewMode = mode.id"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all border border-gray-200"
            :class="
              currentViewMode === mode.id
                ? 'bg-black text-white'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            "
          >
            <UIcon :name="mode.icon" class="w-4 h-4 mr-2" />
            {{ mode.label }}
          </button>
          <!-- Debug Toggle -->
          <button
            @click="showDebug = !showDebug"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all border border-gray-200"
            :class="
              showDebug
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            "
          >
            <UIcon name="i-heroicons-bug-ant" class="w-4 h-4 mr-2" />
            Debug
          </button>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="grid gap-6" :class="getGridLayout()">
        <!-- Teks Asli Column (Split/Original) -->
        <div
          v-if="showTeksAsli"
          class="bg-white border border-gray-200 rounded-3xl p-6"
        >
          <div class="flex items-center gap-2 mb-4">
            <span
              class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-blue-50"
            >
              <svg
                class="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <line x1="8" y1="8" x2="16" y2="8" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="8" y1="16" x2="12" y2="16" />
              </svg>
            </span>
            <h2 class="text-lg font-semibold text-black">Teks Asli</h2>
            <div class="ml-auto" />
          </div>

          <div v-if="isLoading" class="text-center py-8">
            <span class="text-gray-400">Memuat dokumen...</span>
          </div>

          <div v-else-if="document" class="space-y-4">
            <!-- Document Info Badges -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span
                class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200"
              >
                <UIcon name="i-heroicons-document" class="w-3 h-3" />
                Dokumen
              </span>
              <span
                class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200"
              >
                <UIcon name="i-heroicons-calendar" class="w-3 h-3" />
                {{ formatDate(document.created_at) }}
              </span>
              <span
                class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200"
              >
                <UIcon name="i-heroicons-list-bullet" class="w-3 h-3" />
                {{ document.sentences.length }} kalimat
              </span>
              <span
                class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200"
              >
                <UIcon name="i-heroicons-building-office" class="w-3 h-3" />
                {{ document.agency_name }}
              </span>
              <span
                class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200"
              >
                <UIcon name="i-heroicons-user" class="w-3 h-3" />
                {{ document.assigned_by_name }}
              </span>
            </div>

            <!-- Original Text Content -->
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div class="text-black leading-relaxed whitespace-pre-wrap">
                <template
                  v-for="(sentence, index) in document?.sentences"
                  :key="sentence.id"
                >
                  <span
                    class="sentence-selector cursor-pointer hover:bg-blue-100 px-1 py-0.5 rounded transition-colors"
                    :class="{
                      'bg-blue-100': selectedSentence?.id === sentence.id,
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

        <!-- Anotasi Kalimat Column (Split/Annotation) -->
        <div
          v-if="showAnotasiKalimat"
          class="bg-white border border-gray-200 rounded-3xl p-6"
        >
          <div class="flex items-center gap-2 mb-4">
            <span
              class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-green-50"
            >
              <svg
                class="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                />
                <path d="M15 2v4a1 1 0 0 0 1 1h4" />
              </svg>
            </span>
            <h2 class="text-lg font-semibold text-black">Anotasi Kalimat</h2>
          </div>

          <!-- Selected Sentence Info -->
          <div
            v-if="selectedSentence"
            class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-blue-700 font-medium">
                Kalimat Terpilih #{{ selectedSentence.id }}
              </span>
              <UButton
                icon="i-heroicons-x-mark"
                color="neutral"
                variant="ghost"
                size="sm"
                class="shadow-none"
                @click="clearSelection"
              />
            </div>
            <div class="text-black text-sm mb-3">
              {{ getOriginalSentenceText(selectedSentence.id) }}
            </div>
            <div class="flex items-center gap-2 mb-2">
              <UIcon
                name="i-heroicons-cursor-arrow-rays"
                class="w-4 h-4 text-blue-500"
              />
              <span class="text-sm text-blue-700"
                >Pilih teks dalam kalimat untuk anotasi</span
              >
            </div>
            <div class="flex gap-2">
              <UButton
                label="Anotasi"
                icon="i-heroicons-plus-circle"
                color="primary"
                size="sm"
                class="shadow-none"
                :disabled="!canAnnotate"
                @click="showAnnotationUI = true"
              />
              <span
                v-if="selectedText"
                class="text-xs text-gray-500 self-center"
              >
                Terpilih: "{{ selectedText }}"
              </span>
            </div>
          </div>

          <!-- Sentence Selection Instructions -->
          <div
            v-else
            class="mb-4 p-4 bg-gray-100 border border-gray-200 rounded-lg"
          >
            <div class="flex items-center gap-2 mb-2">
              <UIcon
                name="i-heroicons-cursor-arrow-rays"
                class="w-4 h-4 text-gray-400"
              />
              <span class="text-sm text-gray-700"
                >Klik kalimat untuk memulai anotasi</span
              >
            </div>
          </div>

          <!-- Selection Area (no chips) -->
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div
              ref="editableArea"
              class="text-black leading-relaxed whitespace-pre-wrap select-text relative"
              @mouseup="handleTextSelection"
            >
              <span>
                {{
                  selectedSentence
                    ? getOriginalSentenceText(selectedSentence.id)
                    : ""
                }}
              </span>
            </div>
          </div>
        </div>

        <!-- Combined Tab: Teks Asli + Anotasi Kalimat -->
        <div v-if="currentViewMode === 'combined'" class="space-y-6">
          <!-- Section 1: Header Info -->
          <div
            class="bg-white border border-gray-200 rounded-3xl p-6 flex flex-wrap gap-4 items-center"
          >
            <span
              class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-blue-50"
            >
              <svg
                class="w-5 h-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <line x1="8" y1="8" x2="16" y2="8" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="8" y1="16" x2="12" y2="16" />
              </svg>
            </span>
            <h2 class="text-lg font-semibold text-black mr-4">
              Teks & Anotasi
            </h2>
            <div class="flex flex-wrap gap-2">
              <span
                class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200"
              >
                <UIcon name="i-heroicons-document" class="w-3 h-3" />
                Dokumen
              </span>
              <span
                class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200"
              >
                <UIcon name="i-heroicons-calendar" class="w-3 h-3" />
                {{ document ? formatDate(document.created_at) : "" }}
              </span>
              <span
                class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200"
              >
                <UIcon name="i-heroicons-list-bullet" class="w-3 h-3" />
                {{ document?.sentences.length || 0 }} kalimat
              </span>
              <span
                class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200"
              >
                <UIcon name="i-heroicons-building-office" class="w-3 h-3" />
                {{ document?.agency_name }}
              </span>
              <span
                class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200"
              >
                <UIcon name="i-heroicons-user" class="w-3 h-3" />
                {{ document?.assigned_by_name }}
              </span>
            </div>
          </div>

          <!-- Section 2: Anotasi Navbar -->
          <transition name="fade">
            <div v-if="selectedSentence" class="z-40">
              <div
                class="bg-white border border-gray-200 rounded-3xl p-6 flex flex-col gap-3 items-stretch mx-auto"
              >
                <div
                  class="flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                >
                  <div class="flex items-center gap-3 flex-wrap">
                    <span
                      class="inline-flex items-center gap-2 px-2 py-1 bg-blue-50 border border-gray-200 rounded-lg"
                    >
                      <UIcon
                        name="i-heroicons-pencil-square"
                        class="w-5 h-5 text-blue-500"
                      />
                      <span class="text-base text-blue-700"
                        >Kalimat Terpilih #{{ selectedSentence.id }}</span
                      >
                    </span>
                    <UButton
                      icon="i-heroicons-x-mark"
                      color="neutral"
                      variant="ghost"
                      size="sm"
                      class="shadow-none"
                      @click="clearSelection"
                    />
                  </div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <!-- Anotasi Button with Enter shortcut next to label -->
                    <UButton
                      icon="i-heroicons-plus-circle"
                      color="primary"
                      size="sm"
                      class="rounded-2xl flex items-center"
                      :disabled="!canAnnotate"
                      @click="showAnnotationUI = true"
                      title="(Enter)"
                    >
                      <span class="flex items-center">
                        Anotasi
                        <UKbd as="span" size="sm" class="ml-2">Enter</UKbd>
                      </span>
                    </UButton>
                    <!-- Riwayat Kalimat Button with Shift+Enter shortcut next to label -->
                    <UButton
                      icon="i-heroicons-clock"
                      size="sm"
                      class="rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200 flex items-center"
                      @click="showCombinedHistory = true"
                      title="(Shift+Enter)"
                    >
                      <span class="flex items-center">
                        Riwayat Kalimat
                        <UKbd as="span" size="sm" class="ml-2"
                          >Shift+Enter</UKbd
                        >
                      </span>
                    </UButton>
                  </div>
                </div>
                <div
                  class="flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                >
                  <div class="flex-1">
                    <span class="text-sm text-gray-700"
                      >Pilih teks dalam kalimat untuk anotasi</span
                    >
                    <span
                      v-if="selectedText"
                      class="ml-2 text-xs text-gray-500"
                    >
                      Terpilih: "
                      <span class="font-mono">{{ selectedText }}</span
                      >"
                    </span>
                  </div>
                </div>
                <div class="w-full">
                  <div
                    class="bg-gray-50 rounded-2xl p-4 border border-gray-200"
                  >
                    <div
                      ref="editableArea"
                      class="text-black leading-relaxed whitespace-pre-wrap select-text relative"
                      @mouseup="handleTextSelection"
                      tabindex="0"
                      @keydown="handleSentenceKeydown"
                    >
                      <span>
                        {{
                          selectedSentence
                            ? getOriginalSentenceText(selectedSentence.id)
                            : ""
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- Section 3: Teks Asli for Selecting Sentences -->
          <div
            class="bg-white border border-gray-200 rounded-3xl p-6 flex flex-wrap gap-4 items-center"
          >
            <div class="text-black leading-relaxed whitespace-pre-wrap">
              <template
                v-for="(sentence, index) in document?.sentences"
                :key="sentence.id"
              >
                <span
                  class="sentence-selector cursor-pointer hover:bg-blue-100 px-1 py-0.5 rounded transition-colors"
                  :class="{
                    'bg-blue-100': selectedSentence?.id === sentence.id,
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
            <!-- Quick shortcut bar for selected text -->
            <div
              v-if="selectedSentence && selectedText"
              class="flex gap-2 mt-4 items-center"
            >
              <!-- Anotasi Button with Enter shortcut next to label -->
              <UButton
                icon="i-heroicons-plus-circle"
                color="primary"
                size="sm"
                class="rounded-2xl flex items-center"
                :disabled="!canAnnotate"
                @click="showAnnotationUI = true"
              >
                <span class="flex items-center">
                  Anotasi
                  <UKbd as="span" size="sm" class="ml-2">Enter</UKbd>
                </span>
              </UButton>
              <!-- Riwayat Kalimat Button with Shift+Enter shortcut next to label -->
              <UButton
                icon="i-heroicons-clock"
                size="sm"
                class="rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200 flex items-center"
                @click="showCombinedHistory = true"
              >
                <span class="flex items-center">
                  Riwayat Kalimat
                  <UKbd as="span" size="sm" class="ml-2">Shift+Enter</UKbd>
                </span>
              </UButton>
            </div>
          </div>
        </div>

        <!-- History Column (Split/Annotation/History) -->
        <div
          v-if="showHistory"
          class="bg-white border border-gray-200 rounded-3xl p-6"
        >
          <div class="flex items-center gap-2 mb-4">
            <span
              class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 bg-purple-50"
            >
              <svg
                class="w-5 h-5 text-purple-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </span>
            <h2 class="text-lg font-semibold text-black">
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
              class="w-12 h-12 text-gray-400 mx-auto mb-4"
            />
            <p class="text-gray-500">Pilih kalimat untuk melihat riwayat</p>
          </div>

          <div
            v-else-if="
              getSentenceAnnotationsSortedDesc(selectedSentence.id).length === 0
            "
            class="text-center py-8"
          >
            <UIcon
              name="i-heroicons-clock"
              class="w-12 h-12 text-gray-400 mx-auto mb-4"
            />
            <p class="text-gray-500">Belum ada anotasi untuk kalimat ini</p>
          </div>

          <div v-else class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="(annotation, index) in getSentenceAnnotationsSortedDesc(
                selectedSentence.id
              )"
              :key="annotation.id"
              class="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
              @click="viewAnnotation(annotation)"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-black">
                  Anotasi #{{
                    getDescendingIndexLabel(index, selectedSentence.id)
                  }}
                </span>
                <span class="text-xs text-gray-500">
                  {{ formatDate(annotation.timestamp) }}
                </span>
              </div>
              <!-- Full sentence preview with this annotation chipped -->
              <div
                class="bg-gray-100 rounded border border-gray-200 p-2 text-sm mb-2 text-black"
              >
                <template
                  v-for="(seg, i) in buildSegmentsForAnnotation(
                    selectedSentence.id,
                    annotation
                  )"
                  :key="i"
                >
                  <span v-if="seg.type === 'text'">{{ seg.text }}</span>
                  <span v-else class="relative inline-block">
                    <span
                      class="annotation-chip"
                      :class="getChipColor(annotation.color)"
                      @mouseenter="hoveredAnnotation = annotation"
                      @mouseleave="hoveredAnnotation = null"
                    >
                      {{ annotation.correction }}
                    </span>
                  </span>
                </template>
              </div>

              <!-- Detail sebelum/sesudah dipindahkan ke modal saat chip diklik -->
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="errorType in annotation.errorTypes"
                  :key="errorType"
                  class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs"
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
          class="bg-red-50 border border-red-200 rounded-3xl p-6"
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

      <!-- Riwayat Kalimat Popup for Combined Tab -->
      <teleport to="body">
        <div
          v-if="showCombinedHistory && selectedSentence"
          :style="popupStyle"
          class="fixed z-50 bg-white border border-gray-300 rounded-2xl p-6 shadow-xl min-w-[320px] max-w-[90vw] max-h-[80vh] overflow-y-auto cursor-move"
          @mousedown="startDrag"
        >
          <div class="flex items-center justify-between mb-4">
            <h3
              class="text-lg font-semibold flex items-center gap-2 text-black"
            >
              <UIcon name="i-heroicons-clock" class="w-5 h-5 text-purple-500" />
              Riwayat Kalimat #{{ selectedSentence?.id }}
            </h3>
            <UButton
              icon="i-heroicons-x-mark"
              color="neutral"
              variant="ghost"
              @click="showCombinedHistory = false"
            />
          </div>
          <div>
            <div
              v-if="
                getSentenceAnnotationsSortedDesc(selectedSentence.id).length ===
                0
              "
              class="text-center py-8"
            >
              <UIcon
                name="i-heroicons-clock"
                class="w-12 h-12 text-gray-400 mx-auto mb-4"
              />
              <p class="text-gray-500">Belum ada anotasi untuk kalimat ini</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="(annotation, index) in getSentenceAnnotationsSortedDesc(
                  selectedSentence.id
                )"
                :key="annotation.id"
                class="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                @click="viewAnnotation(annotation)"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-black">
                    Anotasi #{{
                      getDescendingIndexLabel(index, selectedSentence.id)
                    }}
                  </span>
                  <span class="text-xs text-gray-500">
                    {{ formatDate(annotation.timestamp) }}
                  </span>
                </div>
                <div
                  class="bg-gray-100 rounded border border-gray-200 p-2 text-sm mb-2 text-black"
                >
                  <template
                    v-for="(seg, i) in buildSegmentsForAnnotation(
                      selectedSentence.id,
                      annotation
                    )"
                    :key="i"
                  >
                    <span v-if="seg.type === 'text'">{{ seg.text }}</span>
                    <span v-else class="relative inline-block">
                      <span
                        class="annotation-chip"
                        :class="getChipColor(annotation.color)"
                      >
                        {{ annotation.correction }}
                      </span>
                    </span>
                  </template>
                </div>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span
                    v-for="errorType in annotation.errorTypes"
                    :key="errorType"
                    class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs"
                  >
                    {{ errorType }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </teleport>

      <!-- Footer Actions -->
      <div class="sticky bottom-0 mt-6">
        <div
          class="bg-black border border-gray-900 rounded-2xl px-4 py-3 flex items-center justify-between"
        >
          <div class="text-xs text-white">
            Gunakan Simpan untuk menyimpan sementara. Submit untuk kirim final.
          </div>
          <div class="flex gap-2">
            <UButton
              icon="mdi-floppy"
              class="rounded-full px-4 py-2 bg-black text-white border border-gray-900 hover:bg-gray-900 focus:ring-2 focus:ring-black shadow-none"
              @click="saveAllAnnotations"
            >
              <span class="flex items-center">
                Simpan
                <UKbd as="span" size="sm" class="ml-2">Ctrl+S</UKbd>
              </span>
            </UButton>
            <UButton
              icon="i-heroicons-paper-airplane"
              class="rounded-full px-4 py-2 bg-black text-white border border-gray-900 hover:bg-gray-900 focus:ring-2 focus:ring-black shadow-none"
              @click="submitAllAnnotations"
            >
              <span class="flex items-center">
                Submit
                <UKbd as="span" size="sm" class="ml-2">Shift+S</UKbd>
              </span>
            </UButton>
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
        class="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md mx-4"
        @click.stop
      >
        <h3
          class="text-lg font-semibold mb-4 flex items-center gap-2 text-black"
        >
          <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-blue-400" />
          Buat Anotasi
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2 text-black"
              >Teks Terpilih:</label
            >
            <div
              class="bg-gray-100 p-3 rounded border border-gray-200 text-sm font-mono text-black"
            >
              "{{ selectedText }}"
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2 text-black"
              >Koreksi:</label
            >
            <UInput
              v-model="correctionInput"
              placeholder="Masukkan koreksi"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2 text-black"
              >Tipe Error:</label
            >
            <div class="flex flex-wrap gap-2">
              <label
                v-for="type in grammarTypes"
                :key="type.value"
                class="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="type.value"
                  v-model="selectedErrorTypes"
                  class="accent-blue-500"
                />
                <span class="text-sm text-black">{{ type.label }}</span>
              </label>
            </div>
          </div>
          <div class="flex gap-2 pt-4">
            <UButton
              label="Simpan"
              icon="i-heroicons-device-floppy"
              class="rounded-full px-4 py-2 bg-black text-white border border-gray-900 hover:bg-gray-900 focus:ring-2 focus:ring-black shadow-none"
              @click="saveAnnotation"
              :disabled="!correctionInput || selectedErrorTypes.length === 0"
            />
            <UButton
              label="Batal"
              color="neutral"
              variant="ghost"
              @click="showAnnotationUI = false"
              class="hover:bg-gray-100"
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
        class="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto shadow-2xl"
        @click.stop
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <UIcon
              name="i-heroicons-information-circle"
              class="w-5 h-5 text-blue-400"
            />
            Detail Anotasi
          </h3>
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
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTextSelection } from "@vueuse/core";
import { useDocumentsApi } from "~/data/documents";
import type { DocumentResponse, AnnotationResponse } from "~/types/api";

const route = useRoute();
const router = useRouter();

// Get the documents API
const { getDocument } = useDocumentsApi();

// Document data
const document = ref<DocumentResponse | null>(null);
const isLoading = ref(true);

// Add new tab for combined mode
const viewModes = [
  {
    id: "combined",
    label: "Teks + Anotasi",
    icon: "i-heroicons-pencil-square",
  },
  { id: "split", label: "Split Screen", icon: "i-heroicons-squares-2x2" },
  { id: "original", label: "Teks Asli", icon: "i-heroicons-document" },
  {
    id: "annotation",
    label: "Anotasi + History",
    icon: "i-heroicons-pencil",
  },
  { id: "history", label: "History", icon: "i-heroicons-clock" },
];
const currentViewMode = ref("combined");

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
    case "combined":
      return "grid-cols-1";
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

//FIX: TEXT SELECTION - Gets selected text and calculates current positions
function handleTextSelection() {
  if (!editableArea.value || !selectedSentence.value) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  if (!editableArea.value.contains(range.commonAncestorContainer)) return;

  //FIX: Get the selected text including spaces
  selectedText.value = selection.toString();

  // Use original sentence text for selection indexing
  const originalSentenceText = getOriginalSentenceText(
    selectedSentence.value.id
  );

  // Find the selected text in the original sentence text
  const startIndex = originalSentenceText.indexOf(selectedText.value);

  if (startIndex === -1) {
    console.error("Selected text not found in current sentence");
    return;
  }

  //FIX: Use current positions (not original positions)
  const endIndex = startIndex + selectedText.value.length;

  selectedRange.value = {
    start: startIndex,
    end: endIndex,
  };

  console.log(
    `Selected "${selectedText.value}" at positions ${startIndex}-${endIndex} in original text`
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

  // Work on a local copy of positions so we don't mutate stored annotations
  const sortedAnnotations = [...sentenceAnnotations]
    .sort((a, b) => a.start - b.start)
    .map((a) => ({
      id: a.id,
      original: a.original,
      correction: a.correction,
      errorTypes: a.errorTypes,
      color: a.color,
      start: a.start,
      end: a.end,
      timestamp: a.timestamp,
    }));

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

    // Update positions of subsequent annotations (local copy only)
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

function getOriginalSentenceText(sentenceId: number): string {
  if (!document.value) return "";
  const sentence = document.value.sentences.find((s) => s.id === sentenceId);
  return sentence ? sentence.text : "";
}

// Build segments for a specific annotation to preview in history (chip in full sentence)
function buildSegmentsForAnnotation(
  sentenceId: number,
  annotation: Annotation
) {
  // Build preview from ORIGINAL sentence + ONLY this annotation
  const original = getOriginalSentenceText(sentenceId);
  const segments: Array<any> = [];

  const start = annotation.start;
  const end = annotation.end;

  // Guard invalid ranges
  if (start < 0 || end > original.length || start >= end) {
    return [{ type: "text", text: original }];
  }

  // Before
  if (start > 0) {
    segments.push({ type: "text", text: original.slice(0, start) });
  }
  // Chip (correction)
  segments.push({
    type: "annotation",
    annotation,
    start,
    end: start + annotation.correction.length,
  });
  // After
  const afterText = original.slice(end);
  if (afterText.length > 0) {
    segments.push({ type: "text", text: afterText });
  }

  return segments;
}

// Sorted (DESC) annotations for a sentence by timestamp
function getSentenceAnnotationsSortedDesc(sentenceId: number): Annotation[] {
  return getSentenceAnnotations(sentenceId).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// Label numbering: newest should have highest number (1..N ascending overall)
function getDescendingIndexLabel(idxDesc: number, sentenceId: number): number {
  const total = getSentenceAnnotations(sentenceId).length;
  // idxDesc is 0-based for sorted DESC; label should be total - idxDesc
  return total - idxDesc;
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

// Actions
function saveAllAnnotations() {
  // TODO: Integrate with API when ready
  console.log("Saving annotations:", annotations.value);
}

function submitAllAnnotations() {
  // TODO: Integrate with API when ready
  console.log("Submitting annotations:", annotations.value);
}

// Grammar types for friendly checkboxes
const grammarTypes = [
  { value: "Spelling", label: "Ejaan (Spelling)" },
  { value: "Grammar", label: "Tata Bahasa (Grammar)" },
  { value: "Punctuation", label: "Tanda Baca (Punctuation)" },
  { value: "Word Choice", label: "Pilihan Kata (Word Choice)" },
  {
    value: "Sentence Structure",
    label: "Struktur Kalimat (Sentence Structure)",
  },
];

// Helper functions for generating realistic data
function getInstitutionName(id: number): string {
  const institutions = [
    "Universitas Indonesia",
    "Institut Teknologi Bandung",
    "Universitas Gadjah Mada",
    "Universitas Padjadjaran",
    "Universitas Diponegoro",
    "Universitas Airlangga",
    "Universitas Brawijaya",
    "Universitas Hasanuddin",
  ];
  return institutions[id % institutions.length];
}

function getAdminName(id: number): string {
  const admins = [
    "Dr. Ahmad Supriyadi",
    "Prof. Siti Nurhaliza",
    "Dr. Bambang Sutejo",
    "Prof. Rina Marlina",
    "Dr. Hendra Gunawan",
    "Prof. Dewi Sartika",
    "Dr. Agus Setiawan",
    "Prof. Maya Indah",
  ];
  return admins[id % admins.length];
}

// Load data
async function fetchDocument() {
  try {
    const docId = Number(route.params.id);

    // For now, use dummy data that matches the index.vue structure
    const dummyDocuments: DocumentResponse[] = [
      {
        id: 1,
        title: "Artikel Bahasa Indonesia 1",
        text: "Ini adalah isi dokumen artikel Bahasa Indonesia 1. Silakan lakukan anotasi pada bagian yang diperlukan. Dokumen ini berisi beberapa paragraf untuk testing anotasi. Setiap paragraf dapat dianotasi secara terpisah.",
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z",
        assigned_to: [1, 2],
        agency_name: getInstitutionName(1),
        assigned_by_name: getAdminName(1),
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
        agency_name: getInstitutionName(2),
        assigned_by_name: getAdminName(2),
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
        text: "Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda.",
        created_at: "2024-01-17T09:15:00Z",
        updated_at: "2024-01-17T09:15:00Z",
        assigned_to: [1],
        agency_name: getInstitutionName(1),
        assigned_by_name: getAdminName(1),
        sentences: [
          {
            id: 9,
            text: "Artikel ketiga dengan konten yang lebih panjang. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. ",
            m2_text: "",
            corrected_text:
              "Artikel ketiga dengan konten yang lebih panjang. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. Artikel ketiga dengan konten yang lebih panjang. Paragraf ini berisi beberapa kalimat yang dapat dianotasi. Kami dapat menambahkan lebih banyak paragraf jika diperlukan. Setiap kalimat dapat memiliki anotasi yang berbeda. ",
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

    const foundDocument = dummyDocuments.find((doc) => doc.id === docId);
    if (foundDocument) {
      document.value = foundDocument;
    } else {
      console.error("Document not found");
      // Redirect to index if document not found
      router.push("/anotator/anotasi");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
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

// Movable popup logic for Riwayat Kalimat
const showCombinedHistory = ref(false);
const popupPosition = ref({
  x: window.innerWidth / 2 - 200,
  y: window.innerHeight / 2 - 200,
});
const popupDragging = ref(false);
const popupOffset = ref({ x: 0, y: 0 });

const popupStyle = computed(() => ({
  left: popupPosition.value.x + "px",
  top: popupPosition.value.y + "px",
  position: "fixed",
  resize: "both",
  "user-select": popupDragging.value ? "none" : "auto",
}));

function startDrag(e: MouseEvent) {
  if ((e.target as HTMLElement).closest("button")) return; // Don't drag on close button
  popupDragging.value = true;
  popupOffset.value = {
    x: e.clientX - popupPosition.value.x,
    y: e.clientY - popupPosition.value.y,
  };
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
}
function onDrag(e: MouseEvent) {
  if (!popupDragging.value) return;
  popupPosition.value = {
    x: e.clientX - popupOffset.value.x,
    y: e.clientY - popupOffset.value.y,
  };
}
function stopDrag() {
  popupDragging.value = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
}

// Keyboard shortcuts for annotation actions
function handleSentenceKeydown(e: KeyboardEvent) {
  if (!selectedText.value) return;

  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    if (canAnnotate.value) showAnnotationUI.value = true;
  }
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault();
    showCombinedHistory.value = true;
  }
}

// Global keyboard shortcuts for save/submit
onMounted(() => {
  window.addEventListener("keydown", globalKeyHandler);
});
function globalKeyHandler(e: KeyboardEvent) {
  // Ctrl+S: Save
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s" && !e.shiftKey) {
    e.preventDefault();
    saveAllAnnotations();
  }
  // Shift+S: Submit
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s" && e.shiftKey) {
    e.preventDefault();
    submitAllAnnotations();
  }
}
onUnmounted(() => {
  window.removeEventListener("keydown", globalKeyHandler);
});
</script>

<style scoped>
.annotation-chip {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(0, 0, 0, 0.12);
  font-weight: 500;
  background: #f3f4f6;
  color: #111;
}
.annotation-chip:hover {
  transform: translateY(-1px);
  background: #e5e7eb;
}
.bg-blue-500 {
  background-color: #3b82f6 !important;
  color: #fff !important;
}
.bg-green-500 {
  background-color: #22c55e !important;
  color: #fff !important;
}
.bg-purple-500 {
  background-color: #a855f7 !important;
  color: #fff !important;
}
.bg-indigo-500 {
  background-color: #6366f1 !important;
  color: #fff !important;
}
.bg-pink-500 {
  background-color: #ec4899 !important;
  color: #fff !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.bg-blue-50,
.bg-purple-50 {
  border-radius: 10px !important;
}
.rounded-2xl,
.rounded-3xl,
.rounded-xl,
.rounded-lg {
  border-radius: 18px !important;
}
.bg-gray-50 {
  border-radius: 18px !important;
}
</style>
