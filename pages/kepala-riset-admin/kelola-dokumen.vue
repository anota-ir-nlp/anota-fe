<template>
  <div class="min-h-screen px-2 sm:px-4 py-10 font-inter bg-gray-50">
    <div class="w-full max-w-[95vw] mx-auto px-2 sm:px-4 pb-16">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Kelola Dokumen</h1>
        <p class="text-gray-600">
          Upload dan kelola dokumen untuk proses anotasi dan review
        </p>
      </div>

      <!-- Project Selection Required Notice (Only for Admin) -->
      <div v-if="!selectedProject && !isKepalaRiset" class="mb-6">
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

      <!-- Information Notice for Kepala Riset -->
      <div v-if="isKepalaRiset" class="mb-6">
        <div
          class="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center"
        >
          <h3 class="text-blue-800 font-semibold mb-2">
            Mode Kepala Riset
          </h3>
          <p class="text-blue-700">
            Anda dapat melihat semua dokumen dari seluruh project.
          </p>
        </div>
      </div>

      <template v-if="selectedProject || isKepalaRiset">
        <!-- Upload Controls (Only show for admin users when project selected) -->
        <div v-if="selectedProject && !isKepalaRiset" class="mb-6 flex gap-3">
          <!-- Single Upload Dialog -->
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

                <!-- Loading State -->
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

                    <!-- Sentence Count Info -->
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

                    <!-- Text Content -->
                    <div
                      class="flex-1 text-gray-700 p-4 bg-white border border-gray-200 rounded overflow-y-auto whitespace-pre-wrap"
                    >
                      {{ singleFilePreview.text }}
                    </div>

                    <!-- Sentences Preview -->
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

          <!-- Bulk Upload Dialog -->
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

                <!-- Loading State -->
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

                  <!-- Current File Preview -->
                  <div
                    v-if="currentBulkFile"
                    class="flex-1 bg-gray-50 border border-gray-200 rounded p-6 flex flex-col overflow-hidden"
                  >
                    <div class="space-y-4 flex-1 flex flex-col overflow-hidden">
                      <div class="font-medium text-blue-600 text-lg">
                        {{ currentBulkFile.title }}
                      </div>

                      <!-- Sentence Count Info -->
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

                      <!-- Sentences Preview -->
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

                  <!-- Summary when all files processed -->
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

        <!-- Bulk Actions (Available for both Admin and Kepala Riset) -->
        <div v-if="selectedDocuments.length > 0" class="mb-6 flex gap-2 justify-end">
          <!-- Bulk Export Button -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" class="flex items-center gap-2">
                <Download class="w-4 h-4" />
                Bulk Export ({{ selectedDocuments.length }})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="handleBulkExport('parallel')">
                Export All Parallel TSV
              </DropdownMenuItem>
              <DropdownMenuItem @click="handleBulkExport('m2')">
                Export All M2 Format
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- Bulk Assignment Button (Only for Admin users) -->
          <Button
            v-if="!isKepalaRiset"
            variant="outline"
            class="flex items-center gap-2"
            @click="openAssignmentDialog('bulk')"
          >
            <UserPlus class="w-4 h-4" />
            Kelola Assignment ({{ selectedDocuments.length }})
          </Button>
        </div>

        <!-- Assignment Dialog -->
        <Dialog v-model:open="isAssignmentDialogOpen">
          <DialogContent class="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Kelola Assignment Dokumen</DialogTitle>
              <DialogDescription>
                {{
                  assignmentMode === "bulk"
                    ? `Kelola assignment untuk ${selectedDocuments.length} dokumen terpilih.`
                    : `Kelola user yang di-assign untuk dokumen "${documentToManage?.title}".`
                }}
              </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 py-4">
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
                          v-for="user in users"
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
                  {{
                    assignmentMode === "bulk" ? "Dokumen Terpilih:" : "Dokumen:"
                  }}
                </div>
                <div class="text-left max-h-32 overflow-y-auto">
                  <div v-if="assignmentMode === 'bulk'">
                    <div
                      v-for="doc in selectedDocuments"
                      :key="doc.id"
                      class="text-gray-400 mb-1"
                    >
                      • {{ doc.title }}
                    </div>
                  </div>
                  <div v-else-if="documentToManage">
                    <div class="font-medium">{{ documentToManage.title }}</div>
                    <div class="text-gray-400 mt-1">
                      Previously assigned to:
                      <span
                        v-if="originalAssignedUsers.length === 0"
                        class="text-gray-500"
                        >No one</span
                      >
                      <span v-else
                        >{{ originalAssignedUsers.length }} user(s)</span
                      >
                    </div>
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

        <!-- Reopen Dialog -->
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
                <label class="text-sm font-medium text-left">User ID</label>
                <Input
                  v-model="reopenUserId"
                  type="text"
                  placeholder="Masukkan UUID user"
                  required
                />
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
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" @click="closeReopenDialog"
                >Batal</Button
              >
              <Button
                @click="submitReopen"
                :disabled="isReopening || !reopenUserId"
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

        <!-- Pagination Controls -->
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
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useAuth } from "~/data/auth";
import { useDocumentsApi } from "~/data/documents";
import { useUsersApi } from "~/data/users";
import { useAssignmentsApi } from "~/data/document-assignments";
import { useAnnotationsApi } from "~/data/annotations";
import { useReviewsApi } from "~/data/reviews";
import { useProjectContext } from "~/composables/project-context";
import type {
  DocumentResponse,
  DocumentRequest,
  UserResponse,
} from "~/types/api";
import { Input } from "~/components/ui/input";

// Local interface for file parsing (without project)
interface DocumentPreview {
  title: string;
  text: string;
  sentence_count?: number;
  sentences?: string[];
}
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "~/components/ui/pagination";
import {
  Plus,
  Upload,
  Loader2,
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  UserPlus,
  Trash,
  Download,
} from "lucide-vue-next";
import { toast } from "vue-sonner";
import { Progress } from "~/components/ui/progress";
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
import DataTable from "~/components/ui/data-table/data-table.vue";
import { createColumns } from "~/components/documents/columns";
import { parseFile, isValidFileType } from "~/utils/file-parser";

const {
  getDocuments,
  getDocumentsInProject,
  createDocument: apiCreateDocument,
  deleteDocument: apiDeleteDocument,
  exportDocument: exportDocumentApi,
  previewDocumentSentences,
} = useDocumentsApi();
const { getAllUsers } = useUsersApi();
const {
  assignDocument: apiAssignDocument,
  unassignDocument: apiUnassignDocument,
  bulkAssignDocument: apiBulkAssignDocument,
} = useAssignmentsApi();
const { adminReopenAnnotator } = useAnnotationsApi();
const { adminReopenReview } = useReviewsApi();
const { selectedProject, selectedProjectId } = useProjectContext();
const { userRoles } = useAuth();

// Role-based computed properties
const isKepalaRiset = computed(() => userRoles.value.includes("Kepala Riset"));
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
const applyToAllFiles = ref(false);

interface BulkFilePreview extends DocumentPreview {
  status?: "pending" | "confirmed" | "deleted";
}

const bulkFilesPreview = ref<BulkFilePreview[]>([]);
const currentBulkFileIndex = ref(0);
const processedBulkFiles = ref<BulkFilePreview[]>([]);

const isAssignmentDialogOpen = ref(false);
const isManaging = ref(false);
const assignmentMode = ref<"single" | "bulk">("single");
const documentToManage = ref<DocumentResponse | null>(null);
const assignedUserIds = ref<string[]>([]);
const originalAssignedUsers = ref<string[]>([]);
const openUsers = ref(false);
const searchTerm = ref("");

const isReopenDialogOpen = ref(false);
const isReopening = ref(false);
const reopenMode = ref<"annotator" | "reviewer">("annotator");
const documentToReopen = ref<DocumentResponse | null>(null);
const reopenUserId = ref("");
const reopenReason = ref("");

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
    handleDeleteDocument,
    handleExportDocument,
    handleReopenDocument
  )
);

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
    // Parse the file first to get title and text
    const parsedFile = await parseFile(file);

    // Get sentence preview from API
    const previewResult = await previewDocumentSentences({
      text: parsedFile.text,
    });

    // Combine the results
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
        // Parse the file first to get title and text
        const parsed = await parseFile(file);

        // Get sentence preview from API
        const previewResult = await previewDocumentSentences({
          text: parsed.text,
        });

        // Combine the results
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
    singleFilePreview.value = null;
    singleFileConfirmed.value = false;
    isCreateDialogOpen.value = false;
    const fileInput = document.querySelector(
      'input[type="file"][accept=".txt,.docx"]'
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  } else {
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
  // For upload, both roles need to have a project selected
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
  } catch (error) {
    console.error("Error uploading files:", error);
    toast.error("Gagal mengupload dokumen");
  } finally {
    isUploading.value = false;
    uploadProgress.value = 0;
  }
}

async function createAndAssignDocument(docRequest: DocumentPreview) {
  // Add project ID to the document request
  const documentWithProject: DocumentRequest = {
    ...docRequest,
    project: selectedProjectId.value!,
  };
  const createdDocument = await apiCreateDocument(documentWithProject);
  return createdDocument;
}

async function bulkCreateAndAssignDocuments() {
  const filesToUpload = confirmedBulkFiles.value;
  if (!filesToUpload.length) return;

  let successCount = 0;
  let failCount = 0;
  const total = filesToUpload.length;

  for (const [idx, doc] of filesToUpload.entries()) {
    try {
      // Add project ID to each document request
      const documentWithProject: DocumentRequest = {
        ...doc,
        project: selectedProjectId.value!,
      };
      await apiCreateDocument(documentWithProject);
      successCount++;
    } catch (error) {
      failCount++;
    }
    uploadProgress.value = Math.round(((idx + 1) / total) * 100);
  }

  toast.warning("Bulk Upload Selesai", {
    description: `Berhasil: ${successCount}, Gagal: ${failCount}`,
  });
}

// Consolidated assignment functions
function openAssignmentDialog(
  mode: "single" | "bulk",
  document?: DocumentResponse
) {
  assignmentMode.value = mode;
  assignedUserIds.value = [];
  searchTerm.value = "";

  if (mode === "single" && document) {
    documentToManage.value = document;
    originalAssignedUsers.value =
      document.assigned_to?.map((id) => id.toString()) || [];
    assignedUserIds.value = [...originalAssignedUsers.value];
  }

  isAssignmentDialogOpen.value = true;
}

function closeAssignmentDialog() {
  documentToManage.value = null;
  assignedUserIds.value = [];
  originalAssignedUsers.value = [];
  searchTerm.value = "";
  isAssignmentDialogOpen.value = false;
}

function addUserToAssignment(ev: any) {
  if (typeof ev.detail.value === "string") {
    searchTerm.value = "";
    assignedUserIds.value.push(ev.detail.value);
  }
  if (users.value.length === 0) {
    openUsers.value = false;
  }
}

function removeUserFromAssignment(userId: string) {
  const index = assignedUserIds.value.indexOf(userId);
  if (index > -1) {
    assignedUserIds.value.splice(index, 1);
  }
}

async function saveAssignmentChanges() {
  isManaging.value = true;
  try {
    if (assignmentMode.value === "single") {
      await saveSingleAssignmentChanges();
    } else {
      await saveBulkAssignmentChanges();
    }
  } finally {
    isManaging.value = false;
  }
}

async function saveSingleAssignmentChanges() {
  if (!documentToManage.value) {
    toast.error("Tidak ada dokumen yang dipilih");
    return;
  }

  toast.promise(
    (async () => {
      const currentAssigned = originalAssignedUsers.value;
      const newAssigned = assignedUserIds.value;
      const toAssign = newAssigned.filter(
        (id) => !currentAssigned.includes(id)
      );
      const toUnassign = currentAssigned.filter(
        (id) => !newAssigned.includes(id)
      );

      let successCount = 0;
      let failCount = 0;

      for (const userId of toAssign) {
        try {
          await apiAssignDocument({
            document_id: documentToManage.value!.id,
            user_id: userId,
          });
          successCount++;
        } catch (error) {
          failCount++;
        }
      }

      for (const userId of toUnassign) {
        try {
          await apiUnassignDocument({
            document_id: documentToManage.value!.id,
            user_id: userId,
          });
          successCount++;
        } catch (error) {
          failCount++;
        }
      }

      return {
        successCount,
        failCount,
        totalChanges: toAssign.length + toUnassign.length,
        assigned: toAssign.length,
        unassigned: toUnassign.length,
      };
    })(),
    {
      loading: "Menyimpan perubahan assignment...",
      success: (result: {
        successCount: number;
        failCount: number;
        totalChanges: number;
        assigned: number;
        unassigned: number;
      }) => {
        fetchDocuments(currentPage.value);
        closeAssignmentDialog();

        if (result.failCount === 0) {
          if (result.totalChanges === 0)
            return "Tidak ada perubahan assignment.";
          return `Assignment berhasil diperbarui: ${result.assigned} user ditambah, ${result.unassigned} user dihapus.`;
        } else {
          return `Assignment diperbarui: ${result.successCount} berhasil, ${result.failCount} gagal.`;
        }
      },
      error: "Gagal menyimpan perubahan assignment",
    }
  );
}

async function saveBulkAssignmentChanges() {
  if (selectedDocuments.value.length === 0) {
    toast.error("Tidak ada dokumen yang dipilih");
    return;
  }

  toast.promise(
    (async () => {
      let successCount = 0;
      let failCount = 0;

      for (const doc of selectedDocuments.value) {
        const usersToAssign = assignedUserIds.value.filter(
          (userId) => !doc.assigned_to?.includes(userId)
        );
        if (usersToAssign.length > 0) {
          try {
            await apiBulkAssignDocument(doc.id, usersToAssign);
            successCount += usersToAssign.length;
          } catch (error) {
            failCount += usersToAssign.length;
          }
        }
      }

      return { successCount, failCount };
    })(),
    {
      loading: "Menyimpan assignment untuk dokumen terpilih...",
      success: (result: { successCount: number; failCount: number }) => {
        fetchDocuments(currentPage.value);
        selectedDocuments.value = [];
        closeAssignmentDialog();

        if (result.failCount === 0) {
          return `Assignment berhasil disimpan: ${result.successCount} assignment baru ditambahkan.`;
        } else {
          return `Assignment disimpan: ${result.successCount} berhasil, ${result.failCount} gagal.`;
        }
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
    .catch((error) => {
      console.error("Error deleting document:", error);
      toast.error("Gagal menghapus dokumen");
    });
}

async function handleExportDocument(
  document: DocumentResponse,
  format: "parallel" | "m2"
) {
  try {
    toast.promise(
      (async () => {
        const blob = await exportDocumentApi(document.id, format);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = window.document.createElement("a");
        link.href = url;
        link.download = `${document.title}_${format}.${
          format === "parallel" ? "tsv" : "m2"
        }`;
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return document;
      })(),
      {
        loading: `Mengexport ${format.toUpperCase()}...`,
        success: `Export ${format.toUpperCase()} berhasil untuk "${
          document.title
        }"`,
        error: `Gagal export ${format.toUpperCase()}`,
      }
    );
  } catch (error: any) {
    console.error("Export error:", error);
    toast.error(`Gagal export ${format.toUpperCase()}: ${error.message}`);
  }
}

async function handleBulkExport(format: "parallel" | "m2") {
  if (selectedDocuments.value.length === 0) {
    toast.error("Tidak ada dokumen yang dipilih");
    return;
  }

  const totalDocuments = selectedDocuments.value.length;
  let successCount = 0;
  let failCount = 0;

  toast.promise(
    (async () => {
      for (const document of selectedDocuments.value) {
        try {
          const blob = await exportDocumentApi(document.id, format);

          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = window.document.createElement("a");
          link.href = url;
          link.download = `${document.title}_${format}.${
            format === "parallel" ? "tsv" : "m2"
          }`;
          window.document.body.appendChild(link);
          link.click();
          window.document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          successCount++;
        } catch (error) {
          console.error(`Export failed for document ${document.id}:`, error);
          failCount++;
        }
      }

      return { successCount, failCount, totalDocuments };
    })(),
    {
      loading: `Mengexport ${totalDocuments} dokumen (${format.toUpperCase()})...`,
      success: (result: {
        successCount: number;
        failCount: number;
        totalDocuments: number;
      }) => {
        if (result.failCount === 0) {
          return `Berhasil export semua ${
            result.totalDocuments
          } dokumen (${format.toUpperCase()})`;
        } else {
          return `Export selesai: ${result.successCount} berhasil, ${result.failCount} gagal`;
        }
      },
      error: `Gagal bulk export ${format.toUpperCase()}`,
    }
  );

  // Clear selection after export
  selectedDocuments.value = [];
}

// Reopen functionality
function handleReopenDocument(document: DocumentResponse) {
  documentToReopen.value = document;
  reopenUserId.value = "";
  reopenReason.value = "";
  reopenMode.value = "annotator";
  isReopenDialogOpen.value = true;
}

function closeReopenDialog() {
  documentToReopen.value = null;
  reopenUserId.value = "";
  reopenReason.value = "";
  isReopenDialogOpen.value = false;
}

async function submitReopen() {
  if (!documentToReopen.value || !reopenUserId.value) {
    toast.error("Dokumen dan User ID harus diisi");
    return;
  }

  isReopening.value = true;

  try {
    const requestData = {
      document: documentToReopen.value.id,
      user_id: reopenUserId.value,
      reason: reopenReason.value || undefined,
    };

    if (reopenMode.value === "annotator") {
      await adminReopenAnnotator(requestData);
      toast.success("Berhasil membuka kembali pekerjaan anotator");
    } else {
      await adminReopenReview(requestData);
      toast.success("Berhasil membuka kembali pekerjaan reviewer");
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
  const user = users.value.find((u) => u.id === userId);
  return user ? user.full_name : "Unknown User";
}

async function fetchDocuments(page = 1) {
  isLoading.value = true;
  try {
    if (isKepalaRiset.value) {
      // Kepala Riset can see all documents across all projects
      const response = await getDocuments(page);
      documents.value = response.results || [];

      // Calculate pagination based on response
      const itemsPerPage = 20; // Assuming default page size
      totalPages.value = Math.ceil((response.count || 0) / itemsPerPage);
      currentPage.value = page;
    } else {
      // Admin users need project selection
      if (!selectedProjectId.value) {
        documents.value = [];
        totalPages.value = 1;
        return;
      }

      const projectDocuments = await getDocumentsInProject(selectedProjectId.value);
      documents.value = projectDocuments || [];
      currentPage.value = 1;
      totalPages.value = 1;
    }
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
    const response = await getAllUsers();
    users.value = response || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    toast.error("Gagal memuat daftar user");
  }
}

onMounted(async () => {
  await fetchUsers();
  // For Kepala Riset, always fetch documents. For Admin, only if project is selected
  if (isKepalaRiset.value || selectedProjectId.value) {
    await fetchDocuments(currentPage.value);
  }
});

watch(
  selectedProjectId,
  async () => {
    // For Admin users, fetch documents only when project is selected
    // For Kepala Riset, this doesn't affect document fetching since they see all documents
    if (!isKepalaRiset.value) {
      if (selectedProjectId.value) {
        await fetchDocuments(1);
        currentPage.value = 1;
      } else {
        documents.value = [];
        totalPages.value = 1;
        currentPage.value = 1;
      }
    }
  },
  { immediate: false }
);

watch(currentPage, () => {
  selectedDocuments.value = [];
});
</script>
