<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter bg-gray-50">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Kelola Dokumen</h1>
        <p class="text-gray-600">
          Upload dan kelola dokumen untuk proses anotasi dan review
        </p>
      </div>

      <div v-if="!selectedProject" class="mb-6">
        <div
          class="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center"
        >
          <h3 class="text-yellow-800 font-semibold mb-2">
            Project Belum Dipilih
          </h3>
          <p class="text-yellow-700">
            Silakan pilih project terlebih dahulu dari dropdown di header untuk
            mengelola dokumen.
          </p>
        </div>
      </div>

      <template v-if="selectedProject">
        <div class="mb-6 flex gap-3">
          <Dialog v-model:open="isCreateDialogOpen">
            <DialogTrigger as-child>
              <Button class="flex items-center gap-2">
                <Plus class="w-4 h-4 text-black-900" />
                Upload Dokumen
              </Button>
            </DialogTrigger>
            <DialogContent
              class="sm:max-w-4xl h-[85vh] overflow-hidden flex flex-col"
            >
              <DialogHeader>
                <DialogTitle class="text-black-900">Upload Dokumen</DialogTitle>
                <DialogDescription>
                  Pilih file TXT atau DOCX untuk diupload. Nama file akan
                  menjadi judul dokumen.
                </DialogDescription>
              </DialogHeader>
              <div class="flex-1 flex flex-col gap-4 py-4 overflow-hidden">
                <Input
                  type="file"
                  accept=".txt,.docx"
                  @change="handleSingleFile"
                  class="mb-2"
                />

                <div class="grid gap-2">
                  <label class="text-sm font-medium text-left">
                    Institusi (opsional)
                  </label>
                  <Input
                    v-model="documentInstitution"
                    placeholder="Contoh: Universitas Indonesia"
                    class="w-full"
                  />
                </div>

                <div
                  v-if="isLoadingPreview"
                  class="flex-1 bg-gray-50 border border-gray-200 rounded p-4 text-sm flex flex-col items-center justify-center"
                >
                  <Loader2 class="w-8 h-8 animate-spin text-blue-600 mb-2" />
                  <div class="text-gray-600">
                    Memproses file dan menganalisis kalimat...
                  </div>
                </div>

                <div
                  v-else-if="singleFilePreview"
                  class="flex-1 bg-gray-50 border border-gray-200 rounded p-4 text-sm flex flex-col overflow-hidden"
                >
                  <div class="font-semibold text-blue-600 mb-3">Preview:</div>
                  <div
                    class="flex-1 text-left space-y-3 flex flex-col overflow-hidden"
                  >
                    <div class="font-medium text-lg text-gray-900">
                      {{ singleFilePreview.title }}
                    </div>

                    <div
                      v-if="singleFilePreview.sentence_count !== undefined"
                      class="bg-blue-50 border border-blue-200 rounded p-3"
                    >
                      <div class="text-blue-800 font-medium">
                        Informasi Kalimat
                      </div>
                      <div class="text-blue-700 text-sm">
                        Jumlah kalimat: {{ singleFilePreview.sentence_count }}
                      </div>
                    </div>

                    <div
                      class="flex-1 text-gray-700 p-4 bg-white border border-gray-200 rounded overflow-y-auto whitespace-pre-wrap"
                    >
                      {{ singleFilePreview.text }}
                    </div>

                    <div
                      v-if="
                        singleFilePreview.sentences &&
                        singleFilePreview.sentences.length > 0
                      "
                      class="bg-green-50 border border-green-200 rounded p-3"
                    >
                      <div class="text-green-800 font-medium mb-2">
                        Preview Kalimat
                      </div>
                      <div class="max-h-32 overflow-y-auto space-y-1">
                        <div
                          v-for="(
                            sentence, index
                          ) in singleFilePreview.sentences.slice(0, 5)"
                          :key="index"
                          class="text-green-700 text-xs p-2 bg-white rounded border"
                        >
                          <span class="font-medium">{{ index + 1 }}:</span>
                          {{ sentence }}
                        </div>
                        <div
                          v-if="singleFilePreview.sentences.length > 5"
                          class="text-green-600 text-xs text-center py-1"
                        >
                          ... dan
                          {{ singleFilePreview.sentences.length - 5 }} kalimat
                          lainnya
                        </div>
                      </div>
                    </div>

                    <div class="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                      <Button
                        @click="confirmFile('single')"
                        variant="default"
                        size="sm"
                        class="flex items-center gap-2"
                      >
                        <Plus class="w-4 h-4" />
                        Konfirmasi File
                      </Button>
                      <Button
                        @click="deleteFile('single')"
                        variant="destructive"
                        size="sm"
                        class="flex items-center gap-2"
                      >
                        <Trash class="w-4 h-4" />
                        Hapus File
                      </Button>
                    </div>
                  </div>
                </div>
                <div v-if="fileError" class="text-red-600 text-sm">
                  {{ fileError }}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" @click="resetForm('single')"
                  >Reset</Button
                >
                <Button
                  @click="uploadFiles('single')"
                  :disabled="isUploading || !singleFileConfirmed"
                  class="flex items-center gap-2"
                >
                  <Plus v-if="!isUploading" class="w-4 h-4" />
                  <Loader2 v-else class="w-4 h-4 animate-spin" />
                  {{ isUploading ? "Mengupload..." : "Upload Dokumen" }}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog v-model:open="isBulkDialogOpen">
            <DialogTrigger as-child>
              <Button variant="outline" class="flex items-center gap-2">
                <Upload class="w-4 h-4" />
                Upload Folder
              </Button>
            </DialogTrigger>
            <DialogContent
              class="sm:max-w-4xl h-[85vh] overflow-hidden flex flex-col"
            >
              <DialogHeader>
                <DialogTitle>Bulk Upload Dokumen dari Folder</DialogTitle>
                <DialogDescription>
                  Pilih folder yang berisi file TXT atau DOCX. Setiap file akan
                  menjadi dokumen baru dengan nama file sebagai judul.
                </DialogDescription>
              </DialogHeader>
              <div class="flex-1 flex flex-col gap-4 py-4 overflow-hidden">
                <Input
                  type="file"
                  webkitdirectory
                  multiple
                  accept=".txt,.docx"
                  @change="handleBulkFiles"
                  class="mb-2"
                />

                <div class="grid gap-2">
                  <label class="text-sm font-medium text-left">
                    Institusi
                  </label>
                  <Input
                    v-model="bulkDocumentInstitution"
                    placeholder="Contoh: Universitas Indonesia"
                    class="w-full"
                  />
                  <p class="text-xs text-gray-500">
                    Institusi ini akan diterapkan ke semua dokumen yang diupload
                  </p>
                </div>

                <div
                  v-if="isLoadingBulkPreview"
                  class="flex-1 bg-gray-50 border border-gray-200 rounded p-6 flex flex-col items-center justify-center"
                >
                  <Loader2 class="w-8 h-8 animate-spin text-blue-600 mb-2" />
                  <div class="text-gray-600">
                    Memproses file dan menganalisis kalimat...
                  </div>
                </div>

                <div
                  v-else-if="bulkFilesPreview.length"
                  class="flex-1 flex flex-col gap-4 overflow-hidden"
                >
                  <div class="flex items-center justify-between">
                    <div class="font-semibold">
                      <template v-if="currentBulkFile">
                        File {{ currentBulkFileIndex + 1 }} dari
                        {{ bulkFilesPreview.length }}
                      </template>
                      <template v-else>
                        Semua {{ bulkFilesPreview.length }} file telah diproses
                      </template>
                      ({{ processedBulkFiles.length }} diproses)
                    </div>
                    <div
                      v-if="currentBulkFile"
                      class="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        id="applyToAll"
                        v-model="applyToAllFiles"
                        class="rounded border-gray-300"
                      />
                      <label for="applyToAll" class="text-sm text-gray-600"
                        >Terapkan ke semua file berikutnya</label
                      >
                    </div>
                  </div>

                  <div
                    v-if="currentBulkFile"
                    class="flex-1 bg-gray-50 border border-gray-200 rounded p-6 flex flex-col overflow-hidden"
                  >
                    <div class="space-y-4 flex-1 flex flex-col overflow-hidden">
                      <div class="font-medium text-blue-600 text-lg">
                        {{ currentBulkFile.title }}
                      </div>

                      <div
                        v-if="currentBulkFile.sentence_count !== undefined"
                        class="bg-blue-50 border border-blue-200 rounded p-3"
                      >
                        <div class="text-blue-800 font-medium">
                          Informasi Kalimat
                        </div>
                        <div class="text-blue-700 text-sm">
                          Jumlah kalimat: {{ currentBulkFile.sentence_count }}
                        </div>
                      </div>

                      <div
                        class="flex-1 text-gray-700 p-4 bg-white border border-gray-200 rounded overflow-y-auto whitespace-pre-wrap text-sm"
                      >
                        {{ currentBulkFile.text }}
                      </div>

                      <div
                        v-if="
                          currentBulkFile.sentences &&
                          currentBulkFile.sentences.length > 0
                        "
                        class="bg-green-50 border border-green-200 rounded p-3"
                      >
                        <div class="text-green-800 font-medium mb-2">
                          Preview Kalimat
                        </div>
                        <div class="max-h-24 overflow-y-auto space-y-1">
                          <div
                            v-for="(
                              sentence, index
                            ) in currentBulkFile.sentences.slice(0, 3)"
                            :key="index"
                            class="text-green-700 text-xs p-2 bg-white rounded border"
                          >
                            <span class="font-medium">{{ index + 1 }}:</span>
                            {{ sentence }}
                          </div>
                          <div
                            v-if="currentBulkFile.sentences.length > 3"
                            class="text-green-600 text-xs text-center py-1"
                          >
                            ... dan
                            {{ currentBulkFile.sentences.length - 3 }} kalimat
                            lainnya
                          </div>
                        </div>
                      </div>

                      <div class="flex gap-2 pt-4 border-t border-gray-200">
                        <Button
                          @click="confirmFile('bulk')"
                          variant="default"
                          size="sm"
                          class="flex items-center gap-2"
                        >
                          <Plus class="w-4 h-4" />
                          Konfirmasi File
                        </Button>
                        <Button
                          @click="deleteFile('bulk')"
                          variant="destructive"
                          size="sm"
                          class="flex items-center gap-2"
                        >
                          <Trash class="w-4 h-4" />
                          Hapus File
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div
                    v-else
                    class="flex-1 bg-slate-800 rounded p-6 flex flex-col items-center justify-center"
                  >
                    <div class="text-center space-y-4">
                      <div class="text-xl font-semibold text-green-400">
                        Semua File Telah Diproses
                      </div>
                      <div class="text-gray-300">
                        <div>
                          Dikonfirmasi: {{ confirmedBulkFiles.length }} file
                        </div>
                        <div>Dihapus: {{ deletedBulkFiles.length }} file</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="fileError" class="text-red-400 text-sm">
                  {{ fileError }}
                </div>
                <Progress
                  v-if="isUploading"
                  :model-value="uploadProgress"
                  class="mt-2"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" @click="resetForm('bulk')"
                  >Reset</Button
                >
                <Button
                  @click="uploadFiles('bulk')"
                  :disabled="isUploading || confirmedBulkFiles.length === 0"
                  class="flex items-center gap-2"
                >
                  <Upload v-if="!isUploading" class="w-4 h-4" />
                  <Loader2 v-else class="w-4 h-4 animate-spin" />
                  {{
                    isUploading
                      ? "Mengupload..."
                      : `Upload ${confirmedBulkFiles.length} File`
                  }}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>

        <div v-if="selectedDocuments.length > 0 && isAdmin" class="mb-6 flex gap-2 justify-end">
          <Button
            variant="outline"
            class="flex items-center gap-2"
            @click="openAssignmentDialog()"
          >
            <UserPlus class="w-4 h-4" />
            Kelola Assignment ({{ selectedDocuments.length }})
          </Button>
        </div>

        <Dialog v-model:open="isAssignmentDialogOpen">
          <DialogContent class="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Kelola Assignment Dokumen</DialogTitle>
              <DialogDescription>
                Kelola assignment untuk {{ selectedDocuments.length }} dokumen terpilih.
              </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
              <div class="grid gap-2">
                <label class="text-sm font-medium text-left"
                  >Deadline Assignment</label
                >
                <Popover>
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      :class="[
                        'w-full justify-start text-left font-normal',
                        !assignmentDeadline && 'text-muted-foreground',
                      ]"
                    >
                      <CalendarIcon class="mr-2 h-4 w-4" />
                      {{ formattedDeadline }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar
                      v-model="assignmentDeadline"
                      :initial-focus="true"
                      layout="month-and-year"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium text-left"
                  >User yang Ditugaskan</label
                >
                <Combobox
                  v-model="assignedUserIds"
                  v-model:open="openUsers"
                  :ignore-filter="true"
                >
                  <ComboboxAnchor as-child>
                    <TagsInput v-model="assignedUserIds" class="px-2 w-full">
                      <div class="flex flex-col">
                        <div
                          v-if="assignedUserIds.length"
                          class="flex gap-2 flex-wrap items-center p-1 font-semibold"
                        >
                          <TagsInputItem
                            v-for="userId in assignedUserIds"
                            :key="userId"
                            :value="getUserName(userId)"
                          >
                            <TagsInputItemText class="text-xs">{{
                              getUserName(userId)
                            }}</TagsInputItemText>
                            <TagsInputItemDelete
                              @click="removeUserFromAssignment(userId)"
                            />
                          </TagsInputItem>
                        </div>
                        <ComboboxInput v-model="searchTerm" as-child>
                          <TagsInputInput
                            placeholder="Tambah user assignment..."
                            class="w-full"
                            @keydown.enter.prevent
                          />
                        </ComboboxInput>
                      </div>
                    </TagsInput>
                    <ComboboxList
                      class="w-[--reka-popper-anchor-width]"
                      align="start"
                    >
                      <ComboboxEmpty />
                      <ComboboxGroup>
                        <ComboboxItem
                          v-for="user in availableUsers"
                          :key="user.id"
                          :value="user.id"
                          @select.prevent="addUserToAssignment"
                        >
                          {{ user.full_name }}
                        </ComboboxItem>
                      </ComboboxGroup>
                    </ComboboxList>
                  </ComboboxAnchor>
                </Combobox>
              </div>
              <div class="bg-slate-800 rounded p-3 text-sm">
                <div class="font-semibold text-blue-300 mb-2">
                  Dokumen Terpilih:
                </div>
                <div class="text-left max-h-32 overflow-y-auto">
                  <div
                    v-for="doc in selectedDocuments"
                    :key="doc.id"
                    class="text-gray-400 mb-1"
                  >
                    • {{ doc.title }}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" @click="closeAssignmentDialog"
                >Batal</Button
              >
              <Button
                @click="saveAssignmentChanges"
                :disabled="isManaging"
                class="flex items-center gap-2"
              >
                <UserPlus v-if="!isManaging" class="w-4 h-4" />
                <Loader2 v-else class="w-4 h-4 animate-spin" />
                {{ isManaging ? "Menyimpan..." : "Simpan Assignment" }}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog v-model:open="isReopenDialogOpen">
          <DialogContent class="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Reopen Dokumen</DialogTitle>
              <DialogDescription>
                Buka kembali pekerjaan
                {{ reopenMode === "annotator" ? "anotator" : "reviewer" }} pada
                dokumen "{{ documentToReopen?.title }}".
              </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
              <div class="grid gap-2">
                <label class="text-sm font-medium text-left">Tipe Reopen</label>
                <div class="flex gap-2">
                  <Button
                    :variant="
                      reopenMode === 'annotator' ? 'default' : 'outline'
                    "
                    @click="reopenMode = 'annotator'"
                    size="sm"
                    class="flex-1"
                  >
                    Anotator
                  </Button>
                  <Button
                    :variant="reopenMode === 'reviewer' ? 'default' : 'outline'"
                    @click="reopenMode = 'reviewer'"
                    size="sm"
                    class="flex-1"
                  >
                    Reviewer
                  </Button>
                </div>
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium text-left">
                  {{ reopenMode === "annotator" ? "Anotator" : "Reviewer" }} yang Akan Di-reopen
                </label>
                <Combobox
                  v-model="reopenUserIds"
                  v-model:open="openReopenUsers"
                  :ignore-filter="true"
                >
                  <ComboboxAnchor as-child>
                    <TagsInput v-model="reopenUserIds" class="px-2 w-full">
                      <div class="flex flex-col">
                        <div
                          v-if="reopenUserIds.length"
                          class="flex gap-2 flex-wrap items-center p-1 font-semibold"
                        >
                          <TagsInputItem
                            v-for="userId in reopenUserIds"
                            :key="userId"
                            :value="getUserName(userId)"
                          >
                            <TagsInputItemText class="text-xs">{{
                              getUserName(userId)
                            }}</TagsInputItemText>
                            <TagsInputItemDelete
                              @click="removeUserFromReopenList(userId)"
                            />
                          </TagsInputItem>
                        </div>
                        <ComboboxInput v-model="reopenSearchTerm" as-child>
                          <TagsInputInput
                            :placeholder="`Tambah ${reopenMode === 'annotator' ? 'anotator' : 'reviewer'}...`"
                            class="w-full"
                            @keydown.enter.prevent
                          />
                        </ComboboxInput>
                      </div>
                    </TagsInput>
                  </ComboboxAnchor>
                  <ComboboxList
                    class="w-[--reka-popper-anchor-width]"
                    align="start"
                  >
                    <ComboboxEmpty>
                      <div class="text-gray-500 text-sm p-2">
                        {{ documentToReopen?.assigned_to?.length === 0
                           ? `Tidak ada user yang ditugaskan pada dokumen ini`
                           : `Tidak ada ${reopenMode === 'annotator' ? 'anotator' : 'reviewer'} yang ditugaskan pada dokumen ini`
                        }}
                      </div>
                    </ComboboxEmpty>
                    <ComboboxGroup>
                      <ComboboxItem
                        v-for="user in availableReopenUsers"
                        :key="user.id"
                        :value="user.id"
                        @select.prevent="addUserToReopenList"
                      >
                        {{ user.full_name }} ({{ user.roles.join(", ") }})
                      </ComboboxItem>
                    </ComboboxGroup>
                  </ComboboxList>
                </Combobox>
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium text-left"
                  >Alasan (opsional)</label
                >
                <Textarea
                  v-model="reopenReason"
                  rows="3"
                  placeholder="Alasan reopening (opsional)"
                />
              </div>
              <div class="bg-slate-800 rounded p-3 text-sm">
                <div class="font-semibold text-blue-300 mb-2">Dokumen:</div>
                <div class="text-left">
                  <div class="font-medium text-white">
                    {{ documentToReopen?.title }}
                  </div>
                  <div class="text-gray-400 mt-1">
                    ID: {{ documentToReopen?.id }}
                  </div>
                  <div v-if="documentToReopen?.assigned_to?.length" class="text-gray-300 mt-2">
                    <div class="text-xs font-medium text-blue-300 mb-1">
                      User yang ditugaskan:
                    </div>
                    <div class="text-xs">
                      {{ documentToReopen.assigned_to.join(', ') }}
                    </div>
                  </div>
                  <div v-else class="text-yellow-400 mt-2 text-xs">
                    Belum ada user yang ditugaskan
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" @click="closeReopenDialog"
                >Batal</Button
              >
              <Button
                @click="submitReopen"
                :disabled="isReopening || reopenUserIds.length === 0"
                class="flex items-center gap-2"
              >
                <Loader2 v-if="isReopening" class="w-4 h-4 animate-spin" />
                {{ isReopening ? "Memproses..." : "Kirim Reopen" }}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div v-if="isLoading" class="text-gray-600 mb-4">
          Memuat data dokumen...
        </div>

        <div
          v-if="documents.length"
          class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6"
        >
          <DataTable
            :columns="documentColumns"
            :data="documents"
            @selection-change="handleSelectionChange"
            @delete-document="handleDeleteDocument"
          />
        </div>

        <div
          v-if="documents.length && totalPages > 1"
          class="mt-4 flex justify-center"
        >
          <Pagination
            :page="currentPage"
            :total="totalPages"
            :items-per-page="documents.length > 0 ? documents.length : 1"
            @update:page="fetchDocuments"
          >
            <PaginationContent>
              <PaginationPrevious
                :disabled="currentPage === 1"
                @click="fetchDocuments(currentPage - 1)"
              >
                <ArrowLeft class="w-4 h-4" />
              </PaginationPrevious>
              <template v-for="(page, idx) in paginationPages" :key="idx">
                <PaginationItem
                  v-if="typeof page === 'number'"
                  :value="page"
                  :is-active="page === currentPage"
                  @click="fetchDocuments(page)"
                  >{{ page }}</PaginationItem
                >
                <PaginationEllipsis v-else>
                  <MoreHorizontal class="w-4 h-4" />
                </PaginationEllipsis>
              </template>
              <PaginationNext
                :disabled="currentPage === totalPages"
                @click="fetchDocuments(currentPage + 1)"
              >
                <ArrowRight class="w-4 h-4" />
              </PaginationNext>
            </PaginationContent>
          </Pagination>
        </div>

        <div
          v-if="!documents.length && !isLoading"
          class="bg-white border border-gray-200 rounded-xl p-6 text-center"
        >
          <span class="text-gray-500">Tidak ada dokumen ditemukan.</span>
        </div>
      </template>
    </div>
  </div>

  <Dialog v-model:open="isDuplicateWarningOpen">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle class="text-orange-600 flex items-center gap-2">
          <AlertTriangle class="w-5 h-5" />
          Dokumen Duplikat Terdeteksi
        </DialogTitle>
        <DialogDescription>
          Dokumen dengan teks yang sama sudah ada dalam sistem. Anda dapat melanjutkan untuk menimpa atau membatalkan upload.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-semibold text-blue-800 mb-2">Dokumen yang akan diupload:</h4>
          <p class="text-sm text-blue-700">
            <strong>Judul:</strong> {{ pendingDocumentRequest?.title }}
          </p>
          <p class="text-sm text-blue-700 mt-1">
            <strong>Mode:</strong> {{ duplicateHandlingMode === 'single' ? 'Upload Tunggal' : 'Upload Massal' }}
          </p>
        </div>

        <div class="bg-orange-50 p-4 rounded-lg" v-if="duplicateError?.existing_document">
          <h4 class="font-semibold text-orange-800 mb-2">Dokumen yang sudah ada:</h4>
          <p class="text-sm text-orange-700">
            <strong>Judul:</strong> {{ duplicateError.existing_document.title }}
          </p>
          <p class="text-sm text-orange-700 mt-1">
            <strong>Dibuat:</strong> {{ new Date(duplicateError.existing_document.created_at).toLocaleDateString('id-ID') }}
          </p>
          <p class="text-sm text-orange-700 mt-1">
            <strong>ID:</strong> #{{ duplicateError.existing_document.id }}
          </p>
        </div>

        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-gray-800 mb-2">Preview Teks:</h4>
          <p class="text-sm text-gray-600 line-clamp-3">
            {{ pendingDocumentRequest?.text?.substring(0, 200) }}{{ (pendingDocumentRequest?.text?.length || 0) > 200 ? '...' : '' }}
          </p>
        </div>
      </div>

      <DialogFooter class="flex gap-2">
        <Button variant="outline" @click="cancelDuplicate">
          <X class="w-4 h-4 mr-2" />
          Batalkan
        </Button>
        <Button
          @click="proceedWithDuplicate"
          class="bg-orange-600 hover:bg-orange-700 text-white"
        >
          <AlertTriangle class="w-4 h-4 mr-2" />
          Lanjutkan Tetap (Izinkan Duplikat)
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { DateFormatter } from '@internationalized/date';

import { useAuth } from "~/data/auth";
import { useDocumentsApi } from "~/data/documents";
import { useUsersApi } from "~/data/users";
import { useProjectsApi } from "~/data/projects";
import { useAssignmentsApi } from "~/data/document-assignments";
import { useAnnotationsApi } from "~/data/annotations";
import { useReviewsApi } from "~/data/reviews";
import { useProjectContext } from "~/composables/project-context";

import type {
  DocumentResponse,
  DocumentRequest,
  UserResponse,
  DuplicateDocumentError,
} from "~/types/api";

import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "~/components/ui/pagination";
import {
  TagsInput,
  TagsInputItem,
  TagsInputInput,
  TagsInputItemDelete,
  TagsInputItemText,
} from "~/components/ui/tags-input";
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Progress } from "~/components/ui/progress";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import {
  Plus,
  Upload,
  Loader2,
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  UserPlus,
  Trash,
  AlertTriangle,
  X,
  CalendarIcon,
} from "lucide-vue-next";

import { toast } from "vue-sonner";
import DataTable from "~/components/ui/data-table/data-table.vue";
import { createColumns } from "~/components/documents/columns";
import { parseFile, isValidFileType } from "~/utils/file-parser";

interface DocumentPreview {
  title: string;
  text: string;
  sentence_count?: number;
  sentences?: string[];
}

const {
  getDocument,
  createDocument: apiCreateDocument,
  deleteDocument: apiDeleteDocument,
  previewDocumentSentences,
} = useDocumentsApi();
const { getDocumentsInProject } = useProjectsApi();
const { getAllUsersInProject } = useUsersApi();
const {
  assignDocument: apiAssignDocument,
  unassignDocument: apiUnassignDocument,
  bulkAssignDocument: apiBulkAssignDocument,
} = useAssignmentsApi();
const { adminReopenAnnotator } = useAnnotationsApi();
const { adminReopenReview } = useReviewsApi();
const { selectedProject, selectedProjectId } = useProjectContext();
const { userRoles } = useAuth();

const isAdmin = computed(() => userRoles.value.includes("Admin"));

const documents = ref<DocumentResponse[]>([]);
const users = ref<UserResponse[]>([]);
const selectedDocuments = ref<DocumentResponse[]>([]);
const isLoading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);

const isCreateDialogOpen = ref(false);
const isBulkDialogOpen = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const singleFilePreview = ref<DocumentPreview | null>(null);
const singleFileConfirmed = ref(false);
const isLoadingPreview = ref(false);
const isLoadingBulkPreview = ref(false);
const fileError = ref("");
const documentInstitution = ref("");
const bulkDocumentInstitution = ref("");
const applyToAllFiles = ref(false);

interface BulkFilePreview extends DocumentPreview {
  status?: "pending" | "confirmed" | "deleted";
}

const bulkFilesPreview = ref<BulkFilePreview[]>([]);
const currentBulkFileIndex = ref(0);
const processedBulkFiles = ref<BulkFilePreview[]>([]);

const isAssignmentDialogOpen = ref(false);
const isManaging = ref(false);
const assignedUserIds = ref<string[]>([]);
const originalAssignedUsers = ref<string[]>([]);
const openUsers = ref(false);
const searchTerm = ref("");
const assignmentDeadline = ref<Date>();

const formattedDeadline = computed(() => {
  if (!assignmentDeadline.value) return "Pilih tanggal deadline";
  
  try {
    // If it's a CalendarDate object from @internationalized/date
    if (assignmentDeadline.value && typeof assignmentDeadline.value === 'object' && 'toDate' in assignmentDeadline.value) {
      const jsDate = (assignmentDeadline.value as any).toDate('Asia/Jakarta');
      return jsDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    // If it's already a JavaScript Date
    if (assignmentDeadline.value instanceof Date) {
      return assignmentDeadline.value.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  } catch (e) {
    console.error('Error formatting date:', e);
  }
  
  return "Pilih tanggal deadline";
});

const isReopenDialogOpen = ref(false);
const isReopening = ref(false);
const reopenMode = ref<"annotator" | "reviewer">("annotator");
const documentToReopen = ref<DocumentResponse | null>(null);
const reopenUserIds = ref<string[]>([]);
const reopenReason = ref("");

const openReopenUsers = ref(false);
const reopenSearchTerm = ref("");

const isDuplicateWarningOpen = ref(false);
const duplicateError = ref<DuplicateDocumentError | null>(null);
const pendingDocumentRequest = ref<DocumentRequest | null>(null);
const duplicateHandlingMode = ref<"single" | "bulk">("single");
const currentDuplicateIndex = ref(0);

const confirmedBulkFiles = computed(() =>
  processedBulkFiles.value.filter((file) => file.status === "confirmed")
);
const deletedBulkFiles = computed(() =>
  processedBulkFiles.value.filter((file) => file.status === "deleted")
);
const currentBulkFile = computed(() => {
  if (currentBulkFileIndex.value >= bulkFilesPreview.value.length) return null;
  return bulkFilesPreview.value[currentBulkFileIndex.value];
});

const paginationPages = computed(() => {
  const pages: (number | string)[] = [];
  const total = totalPages.value || 1;
  const current = currentPage.value || 1;

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else if (current <= 3) {
    pages.push(1, 2, 3, 4, 5, "ellipsis", total);
  } else if (current >= total - 2) {
    pages.push(1, "ellipsis");
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    pages.push(
      1,
      "ellipsis",
      current - 1,
      current,
      current + 1,
      "ellipsis",
      total
    );
  }
  return pages;
});

const documentColumns = computed(() =>
  createColumns(
    getUserName,
    getUserFullNameFromUsername,
    handleDeleteDocument,
    handleReopenDocument
  )
);

const availableUsers = computed(() => {
  const assignedIds = assignedUserIds.value || [];
  return users.value
    .filter((user: UserResponse) => !assignedIds.includes(user.id))
    .filter((user: UserResponse) => {
      if (!searchTerm.value) return true;
      const searchLower = searchTerm.value.toLowerCase();
      return (
        user.full_name.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower)
      );
    });
});

const availableReopenUsers = computed(() => {
  const selectedIds = reopenUserIds.value || [];
  const documentAssignedUsers = documentToReopen.value?.assigned_to || [];
  console.log(documentAssignedUsers)

  return users.value
    .filter((user: UserResponse) => {
      console.log(user)
      // Only show users who are assigned to this document
      return documentAssignedUsers.includes(user.full_name);
    })
    .filter((user: UserResponse) => {
      // Filter based on reopen mode - only show users with appropriate roles
      if (reopenMode.value === "annotator") {
        return user.roles.includes("Annotator");
      } else {
        return user.roles.includes("Reviewer");
      }
    })
    .filter((user: UserResponse) => !selectedIds.includes(user.id))
    .filter((user: UserResponse) => {
      if (!reopenSearchTerm.value) return true;
      const searchLower = reopenSearchTerm.value.toLowerCase();
      return (
        user.full_name.toLowerCase().includes(searchLower) ||
        user.username.toLowerCase().includes(searchLower)
      );
    });
});

async function handleSingleFile(e: Event) {
  resetFileState();
  const files = (e.target as HTMLInputElement).files;
  if (!files || !files[0]) return;

  const file = files[0];
  if (!isValidFileType(file.name)) {
    fileError.value = "File harus berformat .txt atau .docx";
    return;
  }

  try {
    isLoadingPreview.value = true;
    const parsedFile = await parseFile(file);

    const previewResult = await previewDocumentSentences({
      text: parsedFile.text,
    });

    singleFilePreview.value = {
      title: parsedFile.title,
      text: parsedFile.text,
      sentence_count: previewResult.sentence_count,
      sentences: previewResult.sentences,
    };
  } catch (error) {
    fileError.value =
      error instanceof Error ? error.message : "Gagal membaca file";
  } finally {
    isLoadingPreview.value = false;
  }
}

async function handleBulkFiles(e: Event) {
  resetFileState();
  resetBulkState();

  const files = (e.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;

  const validFiles = Array.from(files).filter((file) =>
    isValidFileType(file.name)
  );
  if (validFiles.length === 0) {
    fileError.value =
      "Tidak ada file dengan format yang didukung (.txt, .docx) ditemukan dalam folder";
    return;
  }

  try {
    isLoadingBulkPreview.value = true;
    const documents: BulkFilePreview[] = [];

    for (const file of validFiles) {
      try {
        const parsed = await parseFile(file);

        const previewResult = await previewDocumentSentences({
          text: parsed.text,
        });

        documents.push({
          ...parsed,
          sentence_count: previewResult.sentence_count,
          sentences: previewResult.sentences,
          status: "pending",
        });
      } catch (error) {
        console.error(`Failed to parse ${file.name}:`, error);
      }
    }

    if (documents.length === 0) {
      fileError.value = "Tidak ada file dengan konten valid ditemukan";
    } else {
      bulkFilesPreview.value = documents;
    }
  } finally {
    isLoadingBulkPreview.value = false;
  }
}

function confirmFile(mode: "single" | "bulk") {
  if (mode === "single" && singleFilePreview.value) {
    singleFileConfirmed.value = true;
    toast.success("File dikonfirmasi dan siap untuk diupload");
  } else if (mode === "bulk" && currentBulkFile.value) {
    const currentFile = currentBulkFile.value;
    currentFile.status = "confirmed";
    processedBulkFiles.value.push(currentFile);

    if (applyToAllFiles.value) {
      const remainingFiles = bulkFilesPreview.value.slice(
        currentBulkFileIndex.value + 1
      );
      remainingFiles.forEach((file) => {
        file.status = "confirmed";
        processedBulkFiles.value.push(file);
      });
      currentBulkFileIndex.value = bulkFilesPreview.value.length;
      toast.success(
        `File saat ini dan ${remainingFiles.length} file lainnya dikonfirmasi`
      );
    } else {
      currentBulkFileIndex.value++;
      toast.success(`File "${currentFile.title}" dikonfirmasi`);
    }
  }
}

function deleteFile(mode: "single" | "bulk") {
  if (mode === "single") {
    singleFilePreview.value = null;
    singleFileConfirmed.value = false;
    const fileInput = document.querySelector(
      'input[type="file"][accept=".txt,.docx"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    toast.info("File dihapus");
  } else if (mode === "bulk" && currentBulkFile.value) {
    const currentFile = currentBulkFile.value;
    currentFile.status = "deleted";
    processedBulkFiles.value.push(currentFile);

    if (applyToAllFiles.value) {
      const remainingFiles = bulkFilesPreview.value.slice(
        currentBulkFileIndex.value + 1
      );
      remainingFiles.forEach((file) => {
        file.status = "deleted";
        processedBulkFiles.value.push(file);
      });
      currentBulkFileIndex.value = bulkFilesPreview.value.length;
      toast.info(
        `File saat ini dan ${remainingFiles.length} file lainnya dihapus`
      );
    } else {
      currentBulkFileIndex.value++;
      toast.info(`File "${currentFile.title}" dihapus`);
    }
  }
}

function resetFileState() {
  fileError.value = "";
  isLoadingPreview.value = false;
  isLoadingBulkPreview.value = false;
}

function resetBulkState() {
  bulkFilesPreview.value = [];
  processedBulkFiles.value = [];
  currentBulkFileIndex.value = 0;
  applyToAllFiles.value = false;
}

function resetForm(mode: "single" | "bulk") {
  if (mode === "single") {
    documentInstitution.value = "";
    singleFilePreview.value = null;
    singleFileConfirmed.value = false;
    isCreateDialogOpen.value = false;
    const fileInput = document.querySelector(
      'input[type="file"][accept=".txt,.docx"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  } else {
    bulkDocumentInstitution.value = "";
    resetBulkState();
    isBulkDialogOpen.value = false;
    const fileInput = document.querySelector(
      "input[webkitdirectory]"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }
  resetFileState();
}

async function uploadFiles(mode: "single" | "bulk") {
  if (!selectedProjectId.value) {
    toast.error("Pilih project terlebih dahulu untuk mengupload dokumen");
    return;
  }

  isUploading.value = true;
  uploadProgress.value = 0;

  try {
    if (mode === "single" && singleFilePreview.value) {
      await createAndAssignDocument(singleFilePreview.value);
      toast.success(
        `Dokumen "${singleFilePreview.value.title}" berhasil dibuat dan ditambahkan ke project`
      );
      resetForm("single");
    } else if (mode === "bulk") {
      await bulkCreateAndAssignDocuments();
      resetForm("bulk");
    }

    await fetchDocuments(currentPage.value);
  } catch (error: any) {
    console.error("Error uploading files:", error);
    if (error.message !== 'DUPLICATE_DETECTED') {
      toast.error("Gagal mengupload dokumen");
    }
  } finally {
    isUploading.value = false;
    uploadProgress.value = 0;
  }
}

async function createAndAssignDocument(docRequest: DocumentPreview, allowDuplicate = false) {
  const documentWithProject: DocumentRequest = {
    ...docRequest,
    project: selectedProjectId.value!,
    institution: documentInstitution.value || undefined,
    allow_duplicate: allowDuplicate,
  };

  try {
    const createdDocument = await apiCreateDocument(documentWithProject);
    return createdDocument;
  } catch (error: any) {
    if (error.status === 400 && error.data?.error?.includes('sudah ada')) {
      duplicateError.value = error.data as DuplicateDocumentError;
      pendingDocumentRequest.value = documentWithProject;
      duplicateHandlingMode.value = "single";
      isDuplicateWarningOpen.value = true;
      throw new Error('DUPLICATE_DETECTED');
    }
    throw error;
  }
}

async function bulkCreateAndAssignDocuments() {
  const filesToUpload = confirmedBulkFiles.value;
  if (!filesToUpload.length) return;

  let successCount = 0;
  let failCount = 0;
  let duplicateCount = 0;
  const total = filesToUpload.length;

  for (const [idx, doc] of filesToUpload.entries()) {
    try {
      const documentWithProject: DocumentRequest = {
        ...doc,
        project: selectedProjectId.value!,
        institution: bulkDocumentInstitution.value || undefined,
      };
      await apiCreateDocument(documentWithProject);
      successCount++;
    } catch (error: any) {
      if (error.status === 400 && error.data?.error?.includes('sudah ada')) {
        duplicateCount++;
        if (duplicateCount === 1) {
          const documentWithProject: DocumentRequest = {
            ...doc,
            project: selectedProjectId.value!,
            institution: bulkDocumentInstitution.value || undefined,
          };
          duplicateError.value = error.data as DuplicateDocumentError;
          pendingDocumentRequest.value = documentWithProject;
          duplicateHandlingMode.value = "bulk";
          currentDuplicateIndex.value = idx;
          isDuplicateWarningOpen.value = true;
          return;
        }
      } else {
        failCount++;
      }
    }
    uploadProgress.value = Math.round(((idx + 1) / total) * 100);
  }

  const duplicateMessage = duplicateCount > 0 ? `, Duplikat: ${duplicateCount}` : '';
  toast.warning("Bulk Upload Selesai", {
    description: `Berhasil: ${successCount}, Gagal: ${failCount}${duplicateMessage}`,
  });
}

async function openAssignmentDialog() {
  assignedUserIds.value = [];
  searchTerm.value = "";
  assignmentDeadline.value = undefined;

  try {
    const documentDetails = await Promise.all(
      selectedDocuments.value.map((doc: DocumentResponse) => getDocument(doc.id))
    );

    if (documentDetails.length > 0) {
      const allAssignedUsers = new Set<string>();

      documentDetails.forEach((doc: DocumentResponse) => {
        const assigned = doc.assigned_to || [];
        assigned.forEach((userId: string) => allAssignedUsers.add(userId));
      });

      const unionAssignedUsers = Array.from(allAssignedUsers);
      originalAssignedUsers.value = unionAssignedUsers;
      assignedUserIds.value = [...unionAssignedUsers];
    }
  } catch (error) {
    console.error("Error fetching documents details for bulk assignment:", error);
    toast.error("Gagal memuat detail dokumen untuk bulk assignment");
    originalAssignedUsers.value = [];
    assignedUserIds.value = [];
  }

  isAssignmentDialogOpen.value = true;
}

function closeAssignmentDialog() {
  assignedUserIds.value = [];
  originalAssignedUsers.value = [];
  searchTerm.value = "";
  assignmentDeadline.value = undefined;
  isAssignmentDialogOpen.value = false;
}

function addUserToAssignment(ev: any) {
  if (typeof ev.detail.value === "string") {
    const userId = ev.detail.value;
    if (!assignedUserIds.value.includes(userId)) {
      assignedUserIds.value.push(userId);
    }
    searchTerm.value = "";
  }
  if (availableUsers.value.length === 0) {
    openUsers.value = false;
  }
}

function removeUserFromAssignment(userId: string) {
  const index = assignedUserIds.value.indexOf(userId);
  if (index > -1) {
    assignedUserIds.value.splice(index, 1);
  }
}

function addUserToReopenList(ev: any) {
  if (typeof ev.detail.value === "string") {
    const userId = ev.detail.value;
    if (!reopenUserIds.value.includes(userId)) {
      reopenUserIds.value.push(userId);
    }
    reopenSearchTerm.value = "";
  }
  if (availableReopenUsers.value.length === 0) {
    openReopenUsers.value = false;
  }
}

function removeUserFromReopenList(userId: string) {
  const index = reopenUserIds.value.indexOf(userId);
  if (index > -1) {
    reopenUserIds.value.splice(index, 1);
  }
}

async function saveAssignmentChanges() {
  isManaging.value = true;
  try {
    await saveBulkAssignmentChanges();
  } finally {
    isManaging.value = false;
  }
}

async function saveBulkAssignmentChanges() {
  if (selectedDocuments.value.length === 0) {
    toast.error("Tidak ada dokumen yang dipilih");
    return;
  }

  toast.promise(
    (async () => {
      let assignSuccessCount = 0;
      let unassignSuccessCount = 0;
      let failCount = 0;

      for (const doc of selectedDocuments.value) {
        try {
          const documentDetails = await getDocument(doc.id);
          const currentAssigned = documentDetails.assigned_to || [];
          const targetAssigned = assignedUserIds.value;

          const usersToAssign = targetAssigned.filter((userId: string) => !currentAssigned.includes(userId));
          const usersToUnassign = currentAssigned.filter((userId: string) => !targetAssigned.includes(userId));

          for (const userId of usersToAssign) {
            try {
              const assignmentData: any = {
                document_id: doc.id,
                user_id: userId
              };
              
              if (assignmentDeadline.value) {
                let year, month, day;
                
                // Handle @internationalized/date CalendarDate format
                if (typeof assignmentDeadline.value === 'object' && 'year' in assignmentDeadline.value) {
                  year = (assignmentDeadline.value as any).year;
                  month = String((assignmentDeadline.value as any).month).padStart(2, '0');
                  day = String((assignmentDeadline.value as any).day).padStart(2, '0');
                } else if (assignmentDeadline.value instanceof Date) {
                  // Handle JavaScript Date format
                  year = assignmentDeadline.value.getFullYear();
                  month = String(assignmentDeadline.value.getMonth() + 1).padStart(2, '0');
                  day = String(assignmentDeadline.value.getDate()).padStart(2, '0');
                }
                
                if (year && month && day) {
                  assignmentData.deadline = `${year}-${month}-${day}`;
                }
              }
              
              await apiAssignDocument(assignmentData);
              assignSuccessCount++;
            } catch (error) {
              failCount++;
            }
          }

          for (const userId of usersToUnassign) {
            try {
              await apiUnassignDocument({
                document_id: doc.id,
                user_id: userId
              });
              unassignSuccessCount++;
            } catch (error) {
              failCount++;
            }
          }
        } catch (error) {
          console.error(`Error processing document ${doc.id}:`, error);
          failCount++;
        }
      }

      return { assignSuccessCount, unassignSuccessCount, failCount };
    })(),
    {
      loading: "Menyimpan assignment untuk dokumen terpilih...",
      success: (result: { assignSuccessCount: number; unassignSuccessCount: number; failCount: number }) => {
        fetchDocuments(currentPage.value);
        selectedDocuments.value = [];
        closeAssignmentDialog();

        const messages = [];
        if (result.assignSuccessCount > 0) {
          messages.push(`${result.assignSuccessCount} assignment baru ditambahkan`);
        }
        if (result.unassignSuccessCount > 0) {
          messages.push(`${result.unassignSuccessCount} assignment dihapus`);
        }

        let successMessage = "Assignment berhasil disimpan";
        if (messages.length > 0) {
          successMessage += `: ${messages.join(", ")}`;
        }

        if (result.failCount > 0) {
          successMessage += `. ${result.failCount} operasi gagal`;
        }

        return successMessage;
      },
      error: "Gagal menyimpan bulk assignment",
    }
  );
}

function handleSelectionChange(selection: DocumentResponse[]) {
  selectedDocuments.value = selection;
}

function handleDeleteDocument(documentId: string) {
  const numericId = parseInt(documentId);
  if (
    !confirm(
      "Apakah Anda yakin ingin menghapus dokumen ini? Semua annotations yang terkait akan ikut terhapus."
    )
  ) {
    return;
  }

  apiDeleteDocument(numericId)
    .then(() => {
      toast.success("Dokumen berhasil dihapus");
      fetchDocuments(currentPage.value);
    })
    .catch((error: any) => {
      console.error("Error deleting document:", error);
      toast.error("Gagal menghapus dokumen");
    });
}



function handleReopenDocument(document: DocumentResponse) {
  documentToReopen.value = document;
  reopenUserIds.value = [];
  reopenReason.value = "";
  reopenSearchTerm.value = "";
  reopenMode.value = "annotator";
  isReopenDialogOpen.value = true;
}

function closeReopenDialog() {
  documentToReopen.value = null;
  reopenUserIds.value = [];
  reopenReason.value = "";
  reopenSearchTerm.value = "";
  reopenMode.value = "annotator";
  isReopenDialogOpen.value = false;
}

async function submitReopen() {
  if (!documentToReopen.value) {
    toast.error("Dokumen harus dipilih");
    return;
  }

  const assignedUsers = documentToReopen.value.assigned_to || [];
  if (assignedUsers.length === 0) {
    toast.error("Dokumen ini belum memiliki user yang ditugaskan");
    return;
  }

  if (reopenUserIds.value.length === 0) {
    const userType = reopenMode.value === "annotator" ? "anotator" : "reviewer";
    toast.error(`Pilih minimal satu ${userType} yang akan di-reopen`);
    return;
  }

  isReopening.value = true;

  try {
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const userId of reopenUserIds.value) {
      try {
        const requestData = {
          document: documentToReopen.value.id,
          user_id: userId,
          reason: reopenReason.value || undefined,
        };

        if (reopenMode.value === "annotator") {
          await adminReopenAnnotator(requestData);
        } else {
          await adminReopenReview(requestData);
        }
        successCount++;
      } catch (error: any) {
        errorCount++;
        const userName = getUserName(userId);
        errors.push(`${userName}: ${error?.data?.detail || 'Gagal'}`);
      }
    }

    if (successCount > 0) {
      const userType = reopenMode.value === "annotator" ? "anotator" : "reviewer";
      toast.success(
        `Berhasil membuka kembali pekerjaan ${userType} untuk ${successCount} user`
      );
    }

    if (errorCount > 0) {
      toast.error(
        `Gagal untuk ${errorCount} user:\n${errors.join('\n')}`
      );
    }

    closeReopenDialog();
    await fetchDocuments(currentPage.value);
  } catch (error: any) {
    console.error("Reopen error:", error);
    const errorMessage =
      error?.data?.detail || `Gagal melakukan reopen ${reopenMode.value}`;
    toast.error(errorMessage);
  } finally {
    isReopening.value = false;
  }
}

function getUserName(userId: string) {
  const user = users.value.find((u: UserResponse) => u.id === userId);
  return user ? user.full_name : "Unknown User";
}

function getUserFullNameFromUsername(username: string) {
  const user = users.value.find((u: UserResponse) => u.username === username);
  return user ? user.full_name : username;
}

function getUserIdFromUsername(username: string): string | null {
  const user = users.value.find((u: UserResponse) => u.username === username);
  return user ? user.id : null;
}

async function fetchDocuments(page = 1) {
  isLoading.value = true;
  try {
    if (!selectedProjectId.value) {
      documents.value = [];
      totalPages.value = 1;
      return;
    }

    const projectDocuments = await getDocumentsInProject(selectedProjectId.value);
    documents.value = projectDocuments || [];
    currentPage.value = 1;
    totalPages.value = 1;
  } catch (error) {
    console.error("Error fetching documents:", error);
    toast.error("Gagal memuat data dokumen");
    documents.value = [];
    totalPages.value = 1;
  } finally {
    isLoading.value = false;
  }
}

async function fetchUsers() {
  try {
    // Admin users must have a selected project to fetch users
    if (selectedProjectId.value) {
      const response = await getAllUsersInProject(selectedProjectId.value);
      users.value = response || [];
    } else {
      // No project selected - cannot fetch users
      users.value = [];
      toast.error("Pilih project terlebih dahulu untuk melihat pengguna");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Gagal memuat daftar user");
  }
}

async function proceedWithDuplicate() {
  if (!pendingDocumentRequest.value) return;

  try {
    if (duplicateHandlingMode.value === "single") {
      const documentWithDuplicate = { ...pendingDocumentRequest.value, allow_duplicate: true };
      await apiCreateDocument(documentWithDuplicate);
      toast.success("Dokumen berhasil dibuat (duplikat diizinkan)");
      resetForm("single");
      await fetchDocuments(currentPage.value);
    } else if (duplicateHandlingMode.value === "bulk") {
      await continueBulkUploadWithDuplicates();
    }
  } catch (error) {
    console.error("Error creating document with duplicates allowed:", error);
    toast.error("Gagal membuat dokumen");
  } finally {
    closeDuplicateWarning();
  }
}

async function continueBulkUploadWithDuplicates() {
  const filesToUpload = confirmedBulkFiles.value;
  const startIndex = currentDuplicateIndex.value;

  let successCount = 0;
  let failCount = 0;
  const total = filesToUpload.length - startIndex;

  try {
    const duplicateDocument = { ...pendingDocumentRequest.value!, allow_duplicate: true };
    await apiCreateDocument(duplicateDocument);
    successCount++;
  } catch (error) {
    failCount++;
  }

  for (let idx = startIndex + 1; idx < filesToUpload.length; idx++) {
    try {
      const doc = filesToUpload[idx];
      const documentWithProject: DocumentRequest = {
        ...doc,
        project: selectedProjectId.value!,
        allow_duplicate: true,
      };
      await apiCreateDocument(documentWithProject);
      successCount++;
    } catch (error) {
      failCount++;
    }
    uploadProgress.value = Math.round(((idx + 1) / filesToUpload.length) * 100);
  }

  toast.success("Bulk Upload Selesai", {
    description: `Berhasil: ${successCount}, Gagal: ${failCount} (duplikat diizinkan)`,
  });

  resetForm("bulk");
  await fetchDocuments(currentPage.value);
}

function cancelDuplicate() {
  closeDuplicateWarning();
  isUploading.value = false;
  uploadProgress.value = 0;
}

function closeDuplicateWarning() {
  isDuplicateWarningOpen.value = false;
  duplicateError.value = null;
  pendingDocumentRequest.value = null;
  currentDuplicateIndex.value = 0;
}

onMounted(async () => {
  await fetchUsers();
  if (selectedProjectId.value) {
    await fetchDocuments(currentPage.value);
  }
});

watch(
  selectedProjectId,
  async () => {
    if (selectedProjectId.value) {
      await fetchUsers(); // Refetch users with project-specific roles
      await fetchDocuments(1);
      currentPage.value = 1;
    } else {
      documents.value = [];
      users.value = [];
      totalPages.value = 1;
      currentPage.value = 1;
    }
  },
  { immediate: false }
);

watch(currentPage, () => {
  selectedDocuments.value = [];
});
</script>
