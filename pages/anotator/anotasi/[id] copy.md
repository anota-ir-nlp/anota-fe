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
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all border border-gray-200 flex items-center"
            :class="
              currentViewMode === mode.id
                ? 'bg-black text-white'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            "
          >
            <UIcon
              :name="mode.icon"
              class="mr-2 align-middle flex-shrink-0"
              style="vertical-align: middle"
            />
            <span class="inline-block align-middle">{{ mode.label }}</span>
          </button>
          <!-- Debug Toggle -->
          <button
            @click="showDebug = !showDebug"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all border border-gray-200 flex items-center"
            :class="
              showDebug
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-black hover:bg-gray-200'
            "
          >
            <UIcon
              name="i-heroicons-bug-ant"
              class="w-4 h-4 mr-2 align-middle flex-shrink-0"
              style="vertical-align: middle"
            />
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
              <div class="flex gap-2 items-center">
                <UButton
                  label="Anotasi"
                  icon="i-heroicons-plus-circle"
                  color="primary"
                  size="sm"
                  class="shadow-none anotasi-btn"
                  :disabled="!canAnnotate"
                  @click="showAnnotationUI = true"
                />
                <UButton
                  icon="i-heroicons-x-mark"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  class="shadow-none"
                  @click="clearSelection"
                />
              </div>
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
              <span
                v-if="selectedText"
                class="text-xs text-gray-500 self-center ml-2"
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
          <!-- Section 2: Document Info (moved here, at the top, separated by a line) -->
          <div class="bg-white border border-gray-200 rounded-3xl p-6">
            <!-- Document Info at the top -->
            <div class="flex flex-wrap gap-4 items-center mb-4">
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
              <div class="flex flex-wrap gap-10">
                <div class="text-lg text-black">Teks & Anotasi</div>
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
            </div>
            <hr class="my-4 border-gray-200 bg-gray-200 text-gray-200" />

            <!-- Annotation controls: always shown, disabled if no sentence selected -->
            <div class="mb-4 flex flex-col gap-2">
              <div class="flex flex-wrap items-center gap-2 justify-between">
                <span
                  class="px-2 py-1 rounded-full"
                  :class="
                    selectedSentence
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  "
                >
                  {{
                    selectedSentence
                      ? `Kalimat Terpilih #${selectedSentence.id}`
                      : "Klik Kalimat"
                  }}
                </span>
                <div class="flex items-center gap-2 ml-auto">
                  <UButton
                    icon="i-heroicons-plus-circle"
                    size="sm"
                    class="rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 flex items-center"
                    :disabled="!selectedSentence || !canAnnotate"
                    @click="showAnnotationUI = true"
                    variant="ghost"
                  >
                    <span class="flex items-center">
                      Anotasi
                      <UKbd as="span" size="sm" class="ml-2">Enter</UKbd>
                    </span>
                  </UButton>
                  <UButton
                    icon="i-heroicons-clock"
                    size="sm"
                    class="rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200 flex items-center"
                    :disabled="!selectedSentence"
                    @click="showCombinedHistory = true"
                    variant="ghost"
                  >
                    <span class="flex items-center">
                      Riwayat Kalimat
                      <UKbd as="span" size="sm" class="ml-2">Shift+Enter</UKbd>
                    </span>
                  </UButton>
                  <UButton
                    icon="i-heroicons-x-mark"
                    size="sm"
                    class="rounded-2xl bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 flex items-center"
                    :disabled="!selectedSentence"
                    @click="clearSelection"
                    variant="ghost"
                  >
                    <span class="flex items-center">
                      Ganti Kalimat
                      <UKbd as="span" size="sm" class="ml-2">Shift+X</UKbd>
                    </span>
                  </UButton>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <UIcon
                  name="i-heroicons-cursor-arrow-rays"
                  class="w-4 h-4"
                  :class="selectedSentence ? 'text-blue-500' : 'text-gray-400'"
                />
                <span
                  :class="
                    selectedSentence
                      ? 'text-sm text-blue-700'
                      : 'text-sm text-gray-500'
                  "
                >
                  Pilih teks dalam kalimat untuk anotasi
                </span>
                <span
                  v-if="selectedText && selectedSentence"
                  class="text-xs text-gray-500 self-center ml-2"
                >
                  Terpilih: "<span class="font-mono">{{ selectedText }}</span
                  >"
                </span>
              </div>
            </div>
            <!-- Paragraph rendering, highlight selected sentence, others are disabled -->
            <div
              class="text-black leading-relaxed whitespace-pre-wrap paragraph-annotasi"
            >
              <template
                v-for="(sentence, idx) in document?.sentences"
                :key="sentence.id"
              >
                <div
                  v-if="selectedSentence && selectedSentence.id === sentence.id"
                  ref="combinedEditableArea"
                  :class="'sentence-in-paragraph px-1 py-0.5 rounded transition-colors active-sentence bg-blue-100 cursor-text'"
                  @mouseup="handleTextSelection"
                  style="user-select: auto; display: inline-block"
                  tabindex="0"
                  :aria-disabled="false"
                >
                  {{ sentence.text }}
                </div>
                <span
                  v-else
                  :class="
                    ('sentence-in-paragraph px-1 py-0.5 rounded transition-colors',
                    selectedSentence
                      ? 'disabled-sentence bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'hover:bg-blue-50 cursor-pointer')
                  "
                  @click="!selectedSentence && selectSentence(sentence.id)"
                  :tabindex="selectedSentence ? -1 : 0"
                  :aria-disabled="
                    selectedSentence && selectedSentence.id !== sentence.id
                  "
                  style="user-select: none"
                >
                  {{ sentence.text }}
                </span>
                <span v-if="idx < document.sentences.length - 1"> </span>
              </template>
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
            <p class="text-gray-500">Belum ada riwayat untuk kalimat ini</p>
          </div>

          <div v-else class="space-y-4">
            <!-- Annotation chips for the selected sentence -->
            <div class="flex flex-col gap-2">
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
            <div class="relative">
              <div
                class="max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 p-2"
              >
                <div
                  v-if="errorTypesLoading"
                  class="text-center text-gray-400 py-4"
                >
                  Memuat tipe error...
                </div>
                <div v-else>
                  <div
                    v-for="type in errorTypes"
                    :key="type.id"
                    class="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-50 transition cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :value="type.id"
                      v-model="selectedErrorTypes"
                      class="accent-blue-500"
                      :id="'errtype-' + type.id"
                    />
                    <label
                      :for="'errtype-' + type.id"
                      class="text-sm text-black font-medium cursor-pointer"
                    >
                      <span class="font-mono text-xs text-blue-700">{{
                        type.error_code
                      }}</span>
                      <span
                        v-if="type.description"
                        class="ml-1 text-gray-500"
                        >{{ type.description }}</span
                      >
                      <span
                        v-if="type.is_default"
                        class="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full"
                        >Default</span
                      >
                      <span
                        v-else
                        class="ml-2 text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full"
                        >Project</span
                      >
                    </label>
                  </div>
                  <div
                    v-if="!errorTypes.length && !errorTypesLoading"
                    class="text-gray-400 text-sm py-2 text-center"
                  >
                    Tidak ada tipe error ditemukan.
                  </div>
                </div>
              </div>
              <!-- Pagination Controls -->
              <div class="flex justify-between items-center mt-2">
                <button
                  class="px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs font-medium"
                  :disabled="errorTypesPage <= 1 || errorTypesLoading"
                  @click="fetchErrorTypes(errorTypesPage - 1)"
                >
                  Prev
                </button>
                <span class="text-xs text-gray-500">
                  Halaman {{ errorTypesPage }} /
                  {{
                    Math.max(1, Math.ceil(errorTypesCount / errorTypesPageSize))
                  }}
                </span>
                <button
                  class="px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs font-medium"
                  :disabled="
                    errorTypesPage >=
                      Math.ceil(errorTypesCount / errorTypesPageSize) ||
                    errorTypesLoading
                  "
                  @click="fetchErrorTypes(errorTypesPage + 1)"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <div class="flex gap-2 pt-4">
            <UButton
              label="Simpan"
              icon="i-heroicons-device-floppy"
              class="rounded-full px-4 py-2 bg-black text-white border border-gray-900 hover:bg-gray-900 focus:ring-2 focus:ring-black shadow-none anotasi-btn"
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
import { useErrorTypesApi } from "~/data/error-types";
import type { DocumentResponse, AnnotationResponse } from "~/types/api";
import type { ErrorTypeResponse } from "~/types/api";

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
const combinedEditableArea = ref<HTMLElement>(); // NEW
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

const showDebug = ref(false);

// Error Types API & State for Annotation Popup
const { getErrorTypes } = useErrorTypesApi();
const errorTypes = ref<ErrorTypeResponse[]>([]);
const errorTypesCount = ref(0);
const errorTypesPage = ref(1);
const errorTypesPageSize = 10; // Adjust if backend supports
const errorTypesLoading = ref(false);

async function fetchErrorTypes(page = 1, projectId?: number) {
  errorTypesLoading.value = true;
  try {
    const res = await getErrorTypes(page, projectId);
    // API may return { count, results } or just an array, handle both
    if (Array.isArray(res)) {
      errorTypes.value = res;
      errorTypesCount.value = res.length;
    } else {
      errorTypes.value = res.results;
      errorTypesCount.value = res.count;
    }
    errorTypesPage.value = page;
  } finally {
    errorTypesLoading.value = false;
  }
}

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

function handleTextSelection(event?: MouseEvent) {
  // Use the correct ref depending on the current view mode
  let area: HTMLElement | undefined | null;
  if (currentViewMode.value === "combined") {
    area = combinedEditableArea.value;
  } else {
    area = editableArea.value;
  }

  if (!area || !selectedSentence.value) {
    return;
  }
  // Defensive: sometimes Vue ref can be an array if used in v-for, check for array and pick first element
  if (Array.isArray(area)) {
    area = area[0];
  }
  if (!area || typeof area.contains !== "function") {
    return;
  }

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  if (!area.contains(range.commonAncestorContainer)) {
    return;
  }

  selectedText.value = selection.toString();

  // Use original sentence text for selection indexing
  const originalSentenceText = getOriginalSentenceText(
    selectedSentence.value.id
  );

  // Find the selected text in the original sentence text
  const startIndex = originalSentenceText.indexOf(selectedText.value);

  if (startIndex === -1) {
    return;
  }

  const endIndex = startIndex + selectedText.value.length;

  selectedRange.value = {
    start: startIndex,
    end: endIndex,
  };
}

function saveAnnotation() {
  if (
    !selectedText.value ||
    !correctionInput.value ||
    selectedErrorTypes.value.length === 0 ||
    !selectedRange.value ||
    !selectedSentence.value
  )
    return;

  const trimmedCorrection = correctionInput.value.trim();

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

function generateM2ForAnnotation(annotation: Annotation) {
  const m2Format = `A ${annotation.start} ${
    annotation.end
  }|||${annotation.errorTypes.join(";")}|||${
    annotation.correction
  }|||REQUIRED|||-NONE-|||0`;
  return m2Format;
}
function getCurrentSentenceText(sentenceId: number): string {
  if (!document.value) return "";

  const sentence = document.value.sentences.find((s) => s.id === sentenceId);
  if (!sentence) return "";

  const sentenceAnnotations = getSentenceAnnotations(sentenceId);
  if (sentenceAnnotations.length === 0) return sentence.text;

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

  for (const annotation of sortedAnnotations) {
    const beforeText = currentText.substring(0, annotation.start);
    const afterText = currentText.substring(annotation.end);
    currentText = beforeText + annotation.correction + afterText;

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
      }
    }
  }

  return currentText;
}

function getSentenceAnnotations(sentenceId: number): Annotation[] {
  return annotations.value.filter((a) => a.sentenceId === sentenceId);
}

function getLatestAnnotation(sentenceId: number): Annotation | null {
  const sentenceAnnotations = getSentenceAnnotations(sentenceId);
  if (sentenceAnnotations.length === 0) return null;

  return sentenceAnnotations.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
}

const documentSegments = computed(() => {
  if (!document.value || !selectedSentence.value) return [];

  const sentenceText = getCurrentSentenceText(selectedSentence.value.id);
  const segments = [];

  const latestAnnotation = getLatestAnnotation(selectedSentence.value.id);

  if (latestAnnotation) {
    const correctionIndex = sentenceText.indexOf(latestAnnotation.correction);

    if (correctionIndex !== -1) {
      if (correctionIndex > 0) {
        segments.push({
          type: "text",
          text: sentenceText.slice(0, correctionIndex),
        });
      }

      segments.push({
        type: "annotation",
        annotation: latestAnnotation,
        start: correctionIndex,
        end: correctionIndex + latestAnnotation.correction.length,
      });

      const afterIndex = correctionIndex + latestAnnotation.correction.length;
      if (afterIndex < sentenceText.length) {
        segments.push({
          type: "text",
          text: sentenceText.slice(afterIndex),
        });
      }
    } else {
      segments.push({
        type: "text",
        text: sentenceText,
      });
    }
  } else {
    segments.push({
      type: "text",
      text: sentenceText,
    });
  }

  return segments;
});

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
    selectedText.value = "";
    selectedRange.value = null;
  }
}

function clearSelection() {
  selectedSentence.value = null;
  selectedText.value = "";
  selectedRange.value = null;
}

function clearAllAnnotations() {
  if (selectedSentence.value) {
    annotations.value = annotations.value.filter(
      (a) => a.sentenceId !== selectedSentence.value!.id
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
        text: "Artikel ketiga dengan konten yang lebih panjang.",
        created_at: "2024-01-17T09:15:00Z",
        updated_at: "2024-01-17T09:15:00Z",
        assigned_to: [1],
        agency_name: getInstitutionName(1),
        assigned_by_name: getAdminName(1),
        sentences: [
          {
            id: 9,
            text: "Artikel ketiga dengan konten yang lebih panjang. ",
            m2_text: "",
            corrected_text:
              "Artikel ketiga dengan konten yang lebih panjang. Artikel ketiga dengan konten yang lebih panjang.  ",
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
  // Set popup position to center of window (client-side only)
  if (typeof window !== "undefined") {
    popupPosition.value = {
      x: window.innerWidth / 2 - 200,
      y: window.innerHeight / 2 - 200,
    };
  }
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
// SSR-safe default values
const popupPosition = ref({
  x: 100,
  y: 100,
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
function globalKeyHandler(e: KeyboardEvent) {
  // Check if we are in a state where we can use shortcuts
  if (showAnnotationUI.value || !selectedSentence.value) {
    return;
  }

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
  // Enter (without Shift): Open annotation UI
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    if (canAnnotate.value) {
      showAnnotationUI.value = true;
    }
  }
  // Shift+Enter: Show history popup
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault();
    showCombinedHistory.value = true;
  }
  // Shift+X: Clear selection
  if (e.key.toLowerCase() === "x" && e.shiftKey) {
    e.preventDefault();
    clearSelection();
  }
}

// Global keyboard shortcuts for save/submit
onMounted(() => {
  window.addEventListener("keydown", globalKeyHandler);
});

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

/* Anotasi button custom style for better feedback */
.anotasi-btn {
  transition: background 0.2s, color 0.2s, border 0.2s, opacity 0.2s;
  background-color: #2563eb !important; /* blue-600 */
  color: #fff !important;
  border: 1.5px solid #2563eb !important;
  opacity: 1;
}
.anotasi-btn:hover:not(:disabled) {
  background-color: #1d4ed8 !important; /* blue-700 */
  color: #fff !important;
  border-color: #1d4ed8 !important;
  box-shadow: 0 2px 8px 0 #2563eb22;
}
.anotasi-btn:disabled,
.anotasi-btn[disabled] {
  background-color: #e5e7eb !important; /* gray-200 */
  color: #9ca3af !important; /* gray-400 */
  border-color: #e5e7eb !important;
  cursor: not-allowed !important;
  opacity: 0.7;
  box-shadow: none !important;
}

/* New styles for combined tab sentence rendering */
.sentence-in-paragraph {
  display: inline-block;
}
.active-sentence {
  background-color: #d6e8ff !important; /* blue-200 */
}
.disabled-sentence {
  background-color: #f3f4f6 !important; /* gray-100 */
  color: #9ca3af !important; /* gray-400 */
  cursor: not-allowed;
  user-select: none !important;
}
</style>
