<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogTrigger as-child>
      <Button variant="outline" class="flex items-center gap-2">
        <Upload class="w-4 h-4" />
        Upload Folder
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-4xl h-[85vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle>Bulk Upload Dokumen dari Folder</DialogTitle>
        <DialogDescription>
          Pilih folder yang berisi file TXT atau DOCX. Setiap file akan menjadi dokumen baru dengan nama file sebagai judul.
        </DialogDescription>
      </DialogHeader>
      <div class="flex-1 flex flex-col gap-4 py-4 overflow-hidden">
        <Input type="file" webkitdirectory multiple accept=".txt,.docx" @change="handleBulkFiles" class="mb-2" />

        <div class="grid gap-2">
          <label class="text-sm font-medium text-left">Institusi (opsional)</label>
          <Input v-model="bulkDocumentInstitution" placeholder="Contoh: Universitas Indonesia" class="w-full" />
          <p class="text-xs text-gray-500">Institusi ini akan diterapkan ke semua dokumen yang diupload</p>
        </div>

        <div v-if="isLoadingBulkPreview" class="flex-1 bg-gray-50 border border-gray-200 rounded p-6 flex flex-col items-center justify-center">
          <Loader2 class="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <div class="text-gray-600">Memproses file dan menganalisis kalimat...</div>
        </div>

        <div v-else-if="bulkFilesPreview.length" class="flex-1 flex flex-col gap-4 overflow-hidden">
          <div class="flex items-center justify-between">
            <div class="font-semibold">
              <template v-if="currentBulkFile">
                File {{ currentBulkFileIndex + 1 }} dari {{ bulkFilesPreview.length }}
              </template>
              <template v-else>
                Semua {{ bulkFilesPreview.length }} file telah diproses
              </template>
              ({{ processedBulkFiles.length }} diproses)
            </div>
            <div v-if="currentBulkFile" class="flex items-center space-x-2">
              <input type="checkbox" id="applyToAll" v-model="applyToAllFiles" class="rounded border-gray-300" />
              <label for="applyToAll" class="text-sm text-gray-600">Terapkan ke semua file berikutnya</label>
            </div>
          </div>

          <div v-if="currentBulkFile" class="flex-1 bg-gray-50 border border-gray-200 rounded p-6 flex flex-col overflow-hidden">
            <div class="space-y-4 flex-1 flex flex-col overflow-y-auto min-h-0">
              <div class="font-medium text-blue-600 text-lg flex-shrink-0">{{ currentBulkFile.title }}</div>

              <div v-if="currentBulkFile.sentence_count !== undefined" class="bg-blue-50 border border-blue-200 rounded p-3 flex-shrink-0">
                <div class="text-blue-800 font-medium">Informasi Kalimat</div>
                <div class="text-blue-700 text-sm">Jumlah kalimat: {{ currentBulkFile.sentence_count }}</div>
              </div>

              <div class="flex-1 text-gray-700 p-4 bg-white border border-gray-200 rounded overflow-y-auto whitespace-pre-wrap text-sm min-h-0">
                {{ currentBulkFile.text }}
              </div>

              <div v-if="currentBulkFile.sentences && currentBulkFile.sentences.length > 0" class="bg-green-50 border border-green-200 rounded p-3 flex-shrink-0">
                <div class="text-green-800 font-medium mb-2">Preview Kalimat</div>
                <div class="max-h-24 overflow-y-auto space-y-1">
                  <div v-for="(sentence, index) in currentBulkFile.sentences.slice(0, 3)" :key="index" class="text-green-700 text-xs p-2 bg-white rounded border">
                    <span class="font-medium">{{ index + 1 }}:</span> {{ sentence }}
                  </div>
                  <div v-if="currentBulkFile.sentences.length > 3" class="text-green-600 text-xs text-center py-1">
                    ... dan {{ currentBulkFile.sentences.length - 3 }} kalimat lainnya
                  </div>
                </div>
              </div>

              <div class="flex gap-2 pt-4 border-t border-gray-200 flex-shrink-0">
                <Button @click="confirmFile" variant="default" size="sm" class="flex items-center gap-2">
                  <Plus class="w-4 h-4" />
                  Konfirmasi File
                </Button>
                <Button @click="deleteFile" variant="destructive" size="sm" class="flex items-center gap-2">
                  <Trash class="w-4 h-4" />
                  Hapus File
                </Button>
              </div>
            </div>
          </div>

          <div v-else class="flex-1 bg-slate-800 rounded p-6 flex flex-col items-center justify-center">
            <div class="text-center space-y-4">
              <div class="text-xl font-semibold text-green-400">Semua File Telah Diproses</div>
              <div class="text-gray-300">
                <div>Dikonfirmasi: {{ confirmedBulkFiles.length }} file</div>
                <div>Dihapus: {{ deletedBulkFiles.length }} file</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="fileError" class="text-red-400 text-sm">{{ fileError }}</div>
        <Progress v-if="isUploading" :model-value="uploadProgress" class="mt-2" />
      </div>
      <DialogFooter>
        <Button variant="outline" @click="resetForm">Reset</Button>
        <Button @click="uploadFiles" :disabled="isUploading || confirmedBulkFiles.length === 0" class="flex items-center gap-2">
          <Upload v-if="!isUploading" class="w-4 h-4" />
          <Loader2 v-else class="w-4 h-4 animate-spin" />
          {{ isUploading ? "Mengupload..." : `Upload ${confirmedBulkFiles.length} File` }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <DuplicateWarningDialog
    v-model:open="isDuplicateWarningOpen"
    :duplicate-error="duplicateError"
    :pending-request="pendingDocumentRequest"
    mode="bulk"
    @proceed="continueBulkUploadWithDuplicates"
    @cancel="cancelDuplicate"
  />
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Progress } from "~/components/ui/progress";
import { Plus, Trash, Upload, Loader2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useDocumentsApi } from "~/data/documents";
import { parseFile, isValidFileType } from "~/utils/file-parser";
import DuplicateWarningDialog from "./DuplicateWarningDialog.vue";
import type { DocumentRequest, DuplicateDocumentError } from "~/types/api";

const props = defineProps<{ open: boolean; projectId: number | null }>();
const emit = defineEmits<{ (e: 'update:open', value: boolean): void; (e: 'success'): void }>();

const { createDocument: apiCreateDocument, previewDocumentSentences } = useDocumentsApi();

interface BulkFilePreview {
  title: string;
  text: string;
  sentence_count?: number;
  sentences?: string[];
  status?: "pending" | "confirmed" | "deleted";
}

const isUploading = ref(false);
const uploadProgress = ref(0);
const isLoadingBulkPreview = ref(false);
const fileError = ref("");
const bulkDocumentInstitution = ref("");
const applyToAllFiles = ref(false);
const bulkFilesPreview = ref<BulkFilePreview[]>([]);
const currentBulkFileIndex = ref(0);
const processedBulkFiles = ref<BulkFilePreview[]>([]);

const isDuplicateWarningOpen = ref(false);
const duplicateError = ref<DuplicateDocumentError | null>(null);
const pendingDocumentRequest = ref<DocumentRequest | null>(null);
const currentDuplicateIndex = ref(0);

const confirmedBulkFiles = computed(() => processedBulkFiles.value.filter((file) => file.status === "confirmed"));
const deletedBulkFiles = computed(() => processedBulkFiles.value.filter((file) => file.status === "deleted"));
const currentBulkFile = computed(() => {
  if (currentBulkFileIndex.value >= bulkFilesPreview.value.length) return null;
  return bulkFilesPreview.value[currentBulkFileIndex.value];
});

async function handleBulkFiles(e: Event) {
  fileError.value = "";
  bulkFilesPreview.value = [];
  processedBulkFiles.value = [];
  currentBulkFileIndex.value = 0;
  applyToAllFiles.value = false;

  const files = (e.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;

  const validFiles = Array.from(files).filter((file) => isValidFileType(file.name));
  if (validFiles.length === 0) {
    fileError.value = "Tidak ada file dengan format yang didukung (.txt, .docx) ditemukan dalam folder";
    return;
  }

  try {
    isLoadingBulkPreview.value = true;
    const documents: BulkFilePreview[] = [];
    for (const file of validFiles) {
      try {
        const parsed = await parseFile(file);
        const previewResult = await previewDocumentSentences({ text: parsed.text });
        documents.push({
          ...parsed,
          sentence_count: previewResult.sentence_count,
          sentences: previewResult.sentences,
          status: "pending",
        });
      } catch (error) {}
    }
    if (documents.length === 0) fileError.value = "Tidak ada file dengan konten valid ditemukan";
    else bulkFilesPreview.value = documents;
  } finally {
    isLoadingBulkPreview.value = false;
  }
}

function confirmFile() {
  if (currentBulkFile.value) {
    const currentFile = currentBulkFile.value;
    currentFile.status = "confirmed";
    processedBulkFiles.value.push(currentFile);
    if (applyToAllFiles.value) {
      const remainingFiles = bulkFilesPreview.value.slice(currentBulkFileIndex.value + 1);
      remainingFiles.forEach((file) => {
        file.status = "confirmed";
        processedBulkFiles.value.push(file);
      });
      currentBulkFileIndex.value = bulkFilesPreview.value.length;
      toast.success(`File saat ini dan ${remainingFiles.length} file lainnya dikonfirmasi`);
    } else {
      currentBulkFileIndex.value++;
      toast.success(`File "${currentFile.title}" dikonfirmasi`);
    }
  }
}

function deleteFile() {
  if (currentBulkFile.value) {
    const currentFile = currentBulkFile.value;
    currentFile.status = "deleted";
    processedBulkFiles.value.push(currentFile);
    if (applyToAllFiles.value) {
      const remainingFiles = bulkFilesPreview.value.slice(currentBulkFileIndex.value + 1);
      remainingFiles.forEach((file) => {
        file.status = "deleted";
        processedBulkFiles.value.push(file);
      });
      currentBulkFileIndex.value = bulkFilesPreview.value.length;
      toast.info(`File saat ini dan ${remainingFiles.length} file lainnya dihapus`);
    } else {
      currentBulkFileIndex.value++;
      toast.info(`File "${currentFile.title}" dihapus`);
    }
  }
}

function resetForm() {
  bulkDocumentInstitution.value = "";
  bulkFilesPreview.value = [];
  processedBulkFiles.value = [];
  currentBulkFileIndex.value = 0;
  applyToAllFiles.value = false;
  fileError.value = "";
  isLoadingBulkPreview.value = false;
  emit('update:open', false);
  const fileInput = document.querySelector("input[webkitdirectory]") as HTMLInputElement;
  if (fileInput) fileInput.value = "";
}

async function uploadFiles() {
  if (!props.projectId) {
    toast.error("Pilih project terlebih dahulu untuk mengupload dokumen");
    return;
  }
  isUploading.value = true;
  uploadProgress.value = 0;
  const filesToUpload = confirmedBulkFiles.value;
  if (!filesToUpload.length) {
    isUploading.value = false;
    return;
  }

  let successCount = 0;
  let failCount = 0;
  let duplicateCount = 0;
  const total = filesToUpload.length;

  for (const [idx, doc] of filesToUpload.entries()) {
    try {
      const documentWithProject: DocumentRequest = {
        ...doc,
        project: props.projectId!,
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
            project: props.projectId!,
            institution: bulkDocumentInstitution.value || undefined,
          };
          duplicateError.value = error.data as DuplicateDocumentError;
          pendingDocumentRequest.value = documentWithProject;
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
  resetForm();
  emit('success');
  isUploading.value = false;
  uploadProgress.value = 0;
}

async function continueBulkUploadWithDuplicates() {
  const filesToUpload = confirmedBulkFiles.value;
  const startIndex = currentDuplicateIndex.value;
  let successCount = 0;
  let failCount = 0;

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
        project: props.projectId!,
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
  
  isDuplicateWarningOpen.value = false;
  duplicateError.value = null;
  pendingDocumentRequest.value = null;
  resetForm();
  emit('success');
  isUploading.value = false;
  uploadProgress.value = 0;
}

function cancelDuplicate() {
  isDuplicateWarningOpen.value = false;
  duplicateError.value = null;
  pendingDocumentRequest.value = null;
  isUploading.value = false;
  uploadProgress.value = 0;
}
</script>