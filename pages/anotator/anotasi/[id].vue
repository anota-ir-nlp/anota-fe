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
            class="rounded-2xl bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 flex items-center px-4 py-2 font-semibold shadow-none"
            @click="router.push('/anotator/anotasi')"
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
              class="rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 flex items-center px-3 py-2 shadow-none"
              title="Dokumen Sebelumnya"
              @click="navigateDocument(-1)"
            />
            <UButton
              icon="i-heroicons-chevron-right"
              class="rounded-2xl bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 flex items-center px-3 py-2 shadow-none"
              title="Dokumen Selanjutnya"
              @click="navigateDocument(1)"
            />
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="grid gap-6 grid-cols-1">
        <!-- Only show the combined tab content -->
        <div class="space-y-6">
          <!-- Section 2: Document Info (at the top, separated by a line) -->
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
                    {{ document?.assigned_by?.institusi || "-" }}
                  </span>
                  <span
                    class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gray-200"
                  >
                    <UIcon name="i-heroicons-user" class="w-3 h-3" />
                    {{ document?.assigned_by?.full_name || "-" }}
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
                      Riwayat Anotasi
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
                v-if="document?.sentences && document.sentences.length > 0"
              >
                <template
                  v-for="(sentence, idx) in document.sentences"
                  :key="sentence.id"
                >
                  <div
                    v-if="
                      selectedSentence && selectedSentence.id === sentence.id
                    "
                    ref="combinedEditableArea"
                    :class="[
                      'sentence-in-paragraph px-1 py-0.5 rounded transition-colors active-sentence bg-blue-100 cursor-text',
                      hasAnnotations(sentence.id)
                        ? 'annotated-sentence-indicator'
                        : '',
                    ]"
                    @mouseup="handleTextSelection"
                    style="user-select: auto; display: inline-block"
                    tabindex="0"
                    :aria-disabled="false"
                  >
                    {{ sentence.text }}
                  </div>
                  <span
                    v-else
                    :class="[
                      'sentence-in-paragraph px-1 py-0.5 rounded transition-colors',
                      selectedSentence
                        ? 'disabled-sentence bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-blue-50 cursor-pointer',
                      hasAnnotations(sentence.id)
                        ? 'annotated-sentence-indicator'
                        : '',
                    ]"
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
              </template>
              <template v-else>
                <div class="text-gray-400 italic py-8 text-center">
                  Tidak ada kalimat pada dokumen ini.
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Riwayat Kalimat Popup for Combined Tab -->
      <teleport to="body">
        <div
          v-if="showCombinedHistory && selectedSentence"
          :style="popupStyle"
          class="fixed z-50 bg-white border border-gray-300 rounded-2xl p-6 shadow-xl min-w-[320px] max-w-[90vw] max-h-[80vh] my-4 overflow-y-auto cursor-move"
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
              class="bg-black text-white hover:bg-gray-900"
            />
          </div>
          <div>
            <div
              v-if="
                getApiAnnotationsForSentence(selectedSentence.id).length === 0
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
                v-for="(annotation, index) in getApiAnnotationsForSentence(
                  selectedSentence.id
                )"
                :key="annotation.id"
                class="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-semibold text-black">
                    Anotasi #{{ index + 1 }}
                  </span>
                  <span class="text-xs text-gray-500">
                    {{ formatDate(annotation.created_at) }}
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
                    <span
                      v-else
                      class="annotation-chip annotation-chip-colored"
                      >{{ seg.text }}</span
                    >
                  </template>
                </div>
                <div class="flex flex-wrap gap-1 mt-2">
                  <span
                    class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs"
                  >
                    {{
                      annotation.error_type_details?.error_code ||
                      annotation.error_type
                    }}
                  </span>
                </div>
                <div class="flex gap-2 mt-2">
                  <UButton
                    label="Edit"
                    size="sm"
                    @click="editAnnotation(annotation)"
                    class="bg-blue-100 text-blue-700 border border-blue-200"
                  />
                  <UButton
                    label="Hapus"
                    size="sm"
                    color="error"
                    @click="handleDeleteAnnotation(annotation)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </teleport>

      <!-- Edit Annotation Modal -->
      <div
        v-if="showEditAnnotationModal && editingAnnotation"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click="showEditAnnotationModal = false"
      >
        <div
          class="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md mx-4"
          @click.stop
        >
          <h3
            class="text-lg font-semibold mb-4 flex items-center gap-2 text-black"
          >
            <UIcon
              name="i-heroicons-pencil-square"
              class="w-5 h-5 text-blue-400"
            />
            Edit Anotasi
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2 text-black"
                >Koreksi:</label
              >
              <UInput
                v-model="editCorrectionInput"
                placeholder="Masukkan koreksi"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2 text-black"
                >Tipe Error:</label
              >
              <select
                v-model="editSelectedErrorTypes[0]"
                class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              >
                <option
                  v-for="type in errorTypes"
                  :key="type.id"
                  :value="type.id"
                >
                  {{ type.error_code }} - {{ type.description }}
                </option>
              </select>
            </div>
            <div class="flex gap-2 pt-4">
              <UButton
                label="Simpan"
                icon="i-heroicons-paper-airplane"
                class="rounded-full px-4 py-2 bg-black text-white border border-gray-900 hover:bg-gray-900 focus:ring-2 focus:ring-black shadow-none"
                @click="saveEditAnnotation"
                variant="ghost"
              />
              <UButton
                label="Simpan Parsial"
                icon="i-heroicons-pencil"
                class="rounded-full px-4 py-2 bg-blue-500 text-white border border-blue-700 hover:bg-blue-700 focus:ring-2 focus:ring-blue-700 shadow-none"
                @click="savePartialEditAnnotation"
              />
              <UButton
                label="Hapus"
                color="error"
                @click="handleDeleteAnnotation(editingAnnotation)"
              />
              <UButton
                label="Batal"
                color="neutral"
                variant="ghost"
                @click="showEditAnnotationModal = false"
                class="hover:bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="sticky bottom-0 mt-6">
        <div
          class="bg-black border border-gray-900 rounded-2xl px-4 py-3 flex items-center justify-between"
        >
          <div class="text-xs text-white">
            Submit untuk kirim final seluruh anotasi pada dokumen ini. Semua
            anotasi yang dibuat otomatis tersimpan.
          </div>
          <div class="flex gap-2">
            <!-- Removed Simpan button -->
            <UButton
              icon="i-heroicons-paper-airplane"
              class="rounded-2xl bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 flex items-center px-4 py-2 shadow-none"
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
                  :disabled="!errorTypesNext || errorTypesLoading"
                  @click="fetchErrorTypes(errorTypesPage + 1)"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2 text-black"
              >Wajib/Optional:</label
            >
            <select
              v-model="isRequiredInput"
              class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900"
            >
              <option :value="true">Wajib</option>
              <option :value="false">Optional</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2 text-black"
              >Komentar (opsional):</label
            >
            <UInput
              v-model="commentsInput"
              placeholder="Komentar tambahan"
              class="w-full"
            />
          </div>
          <div v-if="annotationError" class="text-red-500 text-sm py-2">
            {{ annotationError }}
          </div>
          <div class="flex gap-2 pt-4">
            <UButton
              label="Simpan"
              class="rounded-2xl px-4 py-2 bg-blue-100 text-blue-700 border border-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-700 shadow-none anotasi-btn flex items-center gap-2"
              @click="saveAnnotation"
              :disabled="
                !correctionInput ||
                selectedErrorTypes.length === 0 ||
                annotationCreating
              "
              :loading="annotationCreating"
              variant="ghost"
            >
              <UIcon name="i-heroicons-paper-airplane" class="w-4 h-4 mr-1" />
              Simpan
            </UButton>
            <UButton
              label="Batal"
              color="neutral"
              variant="ghost"
              @click="showAnnotationUI = false"
              class="rounded-2xl bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 flex items-center px-4 py-2 shadow-none"
            >
              <UIcon name="i-heroicons-x-mark" class="w-4 h-4 mr-1" /> Batal
            </UButton>
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
                @click="deleteLocalAnnotation(selectedAnnotation)"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTextSelection } from "@vueuse/core";
import { useDocumentsApi } from "~/data/documents";
import { useErrorTypesApi } from "~/data/error-types";
import { useUserDocumentsApi } from "~/data/user-documents";
import { useAnnotationsApi } from "~/data/annotations";
import type { DocumentResponse, AnnotationResponse } from "~/types/api";
import type { ErrorTypeResponse } from "~/types/api";
import type { DocumentAssignedDetailResponse } from "~/types/api";
import { toast } from "vue-sonner";

const route = useRoute();
const router = useRouter();

// Get the documents API
const { getDocument } = useDocumentsApi();
const { getAssignedDocument, getAssignedDocuments } = useUserDocumentsApi();
const {
  getAnnotations,
  getAnnotation,
  createAnnotation,
  updateAnnotation,
  partialUpdateAnnotation,
  deleteAnnotation,
  submitAnnotation,
} = useAnnotationsApi();

// Document data
const document = ref<DocumentAssignedDetailResponse | null>(null);
const isLoading = ref(true);
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

// State for API annotations
const apiAnnotations = ref<AnnotationResponse[]>([]);
const apiAnnotationsLoading = ref(false);

// State for editing annotation
const editingAnnotation = ref<AnnotationResponse | null>(null);
const showEditAnnotationModal = ref(false);
const editCorrectionInput = ref("");
const editSelectedErrorTypes = ref<number[]>([]);

const showDebug = ref(false);

// Error Types API & State for Annotation Popup
const { getErrorTypes } = useErrorTypesApi();
const errorTypes = ref<ErrorTypeResponse[]>([]);
const errorTypesCount = ref(0);
const errorTypesPage = ref(1);
const errorTypesPageSize = 10; // Adjust if backend supports
const errorTypesLoading = ref(false);
const errorTypesNext = ref<string | null>(null);
const errorTypesPrevious = ref<string | null>(null);

async function fetchErrorTypes(page = 1) {
  errorTypesLoading.value = true;
  try {
    // Get projectId from document response
    const projectId = document.value?.project;
    const res = await getErrorTypes(page, projectId);
    // Store next/previous for pagination control
    errorTypesNext.value = res.next;
    errorTypesPrevious.value = res.previous;
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

// Fetch all annotations for this document
async function fetchApiAnnotations() {
  apiAnnotationsLoading.value = true;
  try {
    const all = await getAnnotations();
    const docId = Number(route.params.id);
    let annotationsArr: AnnotationResponse[] = [];
    if (Array.isArray(all)) {
      annotationsArr = all as AnnotationResponse[];
    } else if (all && Array.isArray(all.results)) {
      annotationsArr = all.results as AnnotationResponse[];
    }
    apiAnnotations.value = annotationsArr.filter((a) => a.document === docId);
  } finally {
    apiAnnotationsLoading.value = false;
  }
}

// Fetch a single annotation by id (API)
async function fetchApiAnnotation(id: number) {
  return await getAnnotation(id);
}

// Create a new annotation via API
async function createApiAnnotation() {
  if (
    !selectedSentence.value ||
    !selectedText.value ||
    !correctionInput.value ||
    !selectedErrorTypes.value.length ||
    !selectedRange.value
  )
    return;

  await createAnnotation({
    document: Number(route.params.id),
    sentence: selectedSentence.value.id,
    start_index: selectedRange.value.start,
    end_index: selectedRange.value.end,
    error_type: Number(selectedErrorTypes.value[0]),
    correction: correctionInput.value,
  });
  showAnnotationUI.value = false;
  selectedText.value = "";
  correctionInput.value = "";
  selectedErrorTypes.value = [];
  selectedRange.value = null;
  await fetchApiAnnotations();
}

// Update annotation (full)
async function saveEditAnnotation() {
  if (!editingAnnotation.value) return;
  await updateAnnotation(editingAnnotation.value.id, {
    correction: editCorrectionInput.value,
    error_type: editSelectedErrorTypes.value[0],
  });
  showEditAnnotationModal.value = false;
  await fetchApiAnnotations();
}

// Partial update annotation (PATCH)
async function savePartialEditAnnotation() {
  if (!editingAnnotation.value) return;
  await partialUpdateAnnotation(editingAnnotation.value.id, {
    correction: editCorrectionInput.value,
  });
  showEditAnnotationModal.value = false;
  await fetchApiAnnotations();
}

// Delete annotation (API)
async function handleDeleteAnnotation(annotation: AnnotationResponse) {
  await deleteAnnotation(annotation.id);
  showEditAnnotationModal.value = false;
  await fetchApiAnnotations();
}

// Document fetching and setup
async function fetchDocument() {
  try {
    isLoading.value = true;
    const docId = Number(route.params.id);
    const result = await getAssignedDocument(docId);
    // Ensure sentences is always an array
    document.value = {
      ...result,
      sentences: Array.isArray(result.sentences) ? result.sentences : [],
    };
    // Optionally, you can map/transform result to match your UI needs
  } catch (error) {
    console.error("Error fetching document:", error);
    document.value = null;
    // Optionally redirect or show error
  } finally {
    isLoading.value = false;
  }
}

// Store all assigned document IDs for navigation
const assignedDocumentIds = ref<number[]>([]);

async function fetchAssignedDocumentIds() {
  try {
    const response = await getAssignedDocuments();
    // Sort by id ascending
    assignedDocumentIds.value =
      response?.results
        ?.map((doc: any) => Number(doc.id))
        .sort((a, b) => a - b) || [];
  } catch (e) {
    assignedDocumentIds.value = [];
  }
}

onMounted(async () => {
  await fetchDocument();
  await fetchErrorTypes();
  await fetchApiAnnotations();
  await fetchAssignedDocumentIds(); // <-- fetch all assigned document IDs
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
  async () => {
    await fetchDocument();
    await fetchApiAnnotations();
    await fetchAssignedDocumentIds(); // <-- update IDs on document change
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

// Navigation for next/prev document
function navigateDocument(direction: number) {
  const currentId = Number(route.params.id);
  const ids = assignedDocumentIds.value;
  if (!ids.length) return;
  const idx = ids.indexOf(currentId);
  if (idx === -1) return;
  let newIdx = idx + direction;
  if (newIdx < 0 || newIdx >= ids.length) return; // Out of bounds
  const nextId = ids[newIdx];
  if (nextId !== undefined) {
    router.push(`/anotator/anotasi/${nextId}`);
  }
}

// Submit all annotations for this document (PATCH each with is_submitted: true)
async function submitAllAnnotations() {
  const docId = Number(route.params.id);
  if (!docId) return;
  try {
    await submitAnnotation({ document: docId });
    await fetchApiAnnotations();
    toast.success("Berhasil submit anotasi dokumen!");
  } catch (e) {
    // Optionally show error message
  }
}

// Keyboard shortcuts for annotation actions
function globalKeyHandler(e: KeyboardEvent) {
  // Check if we are in a state where we can use shortcuts

  // Shift+S: Submit
  if (e.shiftKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
    submitAllAnnotations();
  }
  // Enter (without Shift): Open annotation UI

  if (showAnnotationUI.value || !selectedSentence.value) {
    return;
  }

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

// Date formatting function
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Replace:

// With:
const selectSentence = (sentenceId: number) => {
  const sentence = document.value?.sentences.find((s) => s.id === sentenceId);
  if (sentence) {
    selectedSentence.value = { id: sentenceId, text: sentence.text };
    selectedText.value = "";
    selectedRange.value = null;
  }
};

const clearSelection = () => {
  selectedSentence.value = null;
  selectedText.value = "";
  selectedRange.value = null;
};

const handleTextSelection = (event?: MouseEvent) => {
  // Use the correct ref depending on the current view mode
  let area: HTMLElement | undefined | null;
  if (currentViewMode.value === "combined") {
    area = combinedEditableArea.value;
  } else {
    area = editableArea.value;
  }

  if (!area || !selectedSentence.value) {
    selectedRange.value = null;
    return;
  }
  if (Array.isArray(area)) {
    area = area[0];
  }
  if (!area || typeof area.contains !== "function") {
    selectedRange.value = null;
    return;
  }

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    selectedRange.value = null;
    return;
  }

  const range = selection.getRangeAt(0);
  if (!area.contains(range.commonAncestorContainer)) {
    selectedRange.value = null;
    return;
  }

  selectedText.value = selection.toString();

  // Use original sentence text for selection indexing
  const originalSentenceText = getOriginalSentenceText(
    selectedSentence.value.id
  );

  // Find the selected text in the original sentence text
  const startIndex = originalSentenceText.indexOf(selectedText.value);

  if (
    !selectedText.value ||
    startIndex === -1 ||
    selectedText.value.trim().length === 0
  ) {
    selectedRange.value = null;
    return;
  }

  const endIndex = startIndex + selectedText.value.length;

  selectedRange.value = {
    start: startIndex,
    end: endIndex,
  };
};

function getOriginalSentenceText(sentenceId: number): string {
  if (!document.value || !document.value.sentences) return "";
  const sentence = document.value.sentences.find((s) => s.id === sentenceId);
  return sentence ? sentence.text : "";
}

// Annotation UI state
const isRequiredInput = ref(true);
const commentsInput = ref("");
const annotationCreating = ref(false);
const annotationError = ref("");

const saveAnnotation = async () => {
  if (
    !selectedSentence.value ||
    !selectedText.value ||
    !correctionInput.value ||
    !selectedErrorTypes.value.length ||
    !selectedRange.value
  ) {
    annotationError.value = "Lengkapi semua data anotasi.";
    console.log("DEBUG: Missing required field for annotation.");
    return;
  }

  annotationCreating.value = true;
  annotationError.value = "";

  try {
    if (isEditingAnnotation.value && editingAnnotation.value) {
      // Update annotation
      await updateAnnotation(editingAnnotation.value.id, {
        document: Number(route.params.id),
        sentence: selectedSentence.value.id,
        start_index: selectedRange.value.start,
        end_index: selectedRange.value.end,
        error_type: Number(selectedErrorTypes.value[0]),
        correction: correctionInput.value,
        is_required: isRequiredInput.value,
        comments: commentsInput.value || undefined,
      });
    } else {
      // Create annotation
      await createAnnotation({
        document: Number(route.params.id),
        sentence: selectedSentence.value.id,
        start_index: selectedRange.value.start,
        end_index: selectedRange.value.end,
        error_type: Number(selectedErrorTypes.value[0]),
        correction: correctionInput.value,
        is_required: isRequiredInput.value,
        comments: commentsInput.value || undefined,
      });
    }
    showAnnotationUI.value = false;
    selectedText.value = "";
    correctionInput.value = "";
    selectedErrorTypes.value = [];
    selectedRange.value = null;
    isRequiredInput.value = true;
    commentsInput.value = "";
    isEditingAnnotation.value = false;
    editingAnnotation.value = null;
    await fetchApiAnnotations();
  } catch (err) {
    annotationError.value =
      "Gagal membuat atau mengedit anotasi. Pastikan data valid.";
    console.log("DEBUG: Annotation API error", err);
  } finally {
    annotationCreating.value = false;
  }
};

// Add editing state
const isEditingAnnotation = ref(false);

// Edit annotation: fill UI fields and show popup
function editAnnotation(annotation: AnnotationResponse) {
  showAnnotationUI.value = true;
  isEditingAnnotation.value = true;
  editingAnnotation.value = annotation;
  selectedSentence.value = {
    id: annotation.sentence,
    text: getOriginalSentenceText(annotation.sentence),
  };
  selectedText.value = getOriginalSentenceText(annotation.sentence).slice(
    annotation.start_index,
    annotation.end_index
  );
  selectedRange.value = {
    start: annotation.start_index,
    end: annotation.end_index,
  };
  correctionInput.value = annotation.correction;
  selectedErrorTypes.value = [String(annotation.error_type)];
  isRequiredInput.value = annotation.is_required;
  commentsInput.value = annotation.comments || "";
}

function getApiAnnotationsForSentence(sentenceId: number) {
  return apiAnnotations.value.filter((a) => a.sentence === sentenceId);
}

// Helper to build segments for annotation preview (full sentence, chip for correction)
function buildSegmentsForAnnotation(
  sentenceId: number,
  annotation: AnnotationResponse
) {
  const sentenceText = getOriginalSentenceText(sentenceId);
  const start = annotation.start_index;
  const end = annotation.end_index;
  const segments = [];

  // Guard invalid ranges
  if (start < 0 || end > sentenceText.length || start >= end) {
    return [{ type: "text", text: sentenceText }];
  }

  // Before
  if (start > 0) {
    segments.push({ type: "text", text: sentenceText.slice(0, start) });
  }
  // Chip (correction)
  segments.push({
    type: "chip",
    text: annotation.correction,
  });
  // After
  const afterText = sentenceText.slice(end);
  if (afterText.length > 0) {
    segments.push({ type: "text", text: afterText });
  }

  return segments;
}

// Helper to check if a sentence has annotations
function hasAnnotations(sentenceId: number) {
  return apiAnnotations.value.some((a) => a.sentence === sentenceId);
}
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
  /* Remove black background, use blue for enabled, gray for disabled */
  opacity: 1;
  transition: background 0.2s, color 0.2s, border 0.2s, opacity 0.2s;
}
.anotasi-btn:hover:not(:disabled) {
  box-shadow: 0 2px 8px 0 #2563eb22;
}
.anotasi-btn:disabled,
.anotasi-btn[disabled] {
  background-color: #686a6d !important; /* gray-200 */
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

/* Colored annotation chip for Riwayat Kalimat */
.annotation-chip-colored {
  background: #dbeafe !important; /* blue-100 */
  color: #2563eb !important; /* blue-600 */
  border: 1.5px solid #2563eb33 !important;
  font-weight: 600;
}

/* Faint underline indicator for sentences with annotation */
.annotated-sentence-indicator {
  border-bottom: 2px dashed #93c5fd !important; /* blue-300 */
  /* Optionally, add a little padding for visibility */
  padding-bottom: 2px;
}
</style>
