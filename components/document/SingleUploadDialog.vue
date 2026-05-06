<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogTrigger as-child>
      <Button class="flex items-center gap-2">
        <Plus class="w-4 h-4 text-black-900" />
        Upload Dokumen
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-4xl h-[85vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle class="text-black-900">Upload Dokumen</DialogTitle>
        <DialogDescription>
          Pilih file TXT atau DOCX untuk diupload. Nama file akan menjadi judul dokumen.
        </DialogDescription>
      </DialogHeader>
      <div class="flex-1 flex flex-col gap-4 py-4 overflow-hidden">
        <Input type="file" accept=".txt,.docx" @change="handleSingleFile" class="mb-2" />

        <div class="grid gap-2">
          <label class="text-sm font-medium text-left">Institusi (opsional)</label>
          <Input v-model="documentInstitution" placeholder="Contoh: Universitas Indonesia" class="w-full" />
        </div>

        <div v-if="isLoadingPreview" class="flex-1 bg-gray-50 border border-gray-200 rounded p-4 text-sm flex flex-col items-center justify-center">
          <Loader2 class="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <div class="text-gray-600">Memproses file dan menganalisis kalimat...</div>
        </div>

        <div v-else-if="singleFilePreview" class="flex-1 bg-gray-50 border border-gray-200 rounded p-4 text-sm flex flex-col overflow-hidden">
          <div class="font-semibold text-blue-600 mb-3">Preview:</div>
          <div class="flex-1 text-left space-y-3 flex flex-col overflow-y-auto min-h-0">
            <div class="font-medium text-lg text-gray-900">{{ singleFilePreview.title }}</div>

            <div v-if="singleFilePreview.sentence_count !== undefined" class="bg-blue-50 border border-blue-200 rounded p-3">
              <div class="text-blue-800 font-medium">Informasi Kalimat</div>
              <div class="text-blue-700 text-sm">Jumlah kalimat: {{ singleFilePreview.sentence_count }}</div>
            </div>

            <div class="flex-1 text-gray-700 p-4 bg-white border border-gray-200 rounded overflow-y-auto whitespace-pre-wrap">
              {{ singleFilePreview.text }}
            </div>

            <div v-if="singleFilePreview.sentences && singleFilePreview.sentences.length > 0" class="bg-green-50 border border-green-200 rounded p-3">
              <div class="text-green-800 font-medium mb-2">Preview Kalimat</div>
              <div class="max-h-32 overflow-y-auto space-y-1">
                <div v-for="(sentence, index) in singleFilePreview.sentences.slice(0, 5)" :key="index" class="text-green-700 text-xs p-2 bg-white rounded border">
                  <span class="font-medium">{{ index + 1 }}:</span> {{ sentence }}
                </div>
                <div v-if="singleFilePreview.sentences.length > 5" class="text-green-600 text-xs text-center py-1">
                  ... dan {{ singleFilePreview.sentences.length - 5 }} kalimat lainnya
                </div>
              </div>
            </div>

            <div class="flex gap-2 mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
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
        <div v-if="fileError" class="text-red-600 text-sm">{{ fileError }}</div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="resetForm">Reset</Button>
        <Button @click="uploadFile" :disabled="isUploading || !singleFileConfirmed" class="flex items-center gap-2">
          <Plus v-if="!isUploading" class="w-4 h-4" />
          <Loader2 v-else class="w-4 h-4 animate-spin" />
          {{ isUploading ? "Mengupload..." : "Upload Dokumen" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <DuplicateWarningDialog
    v-model:open="isDuplicateWarningOpen"
    :duplicate-error="duplicateError"
    :pending-request="pendingDocumentRequest"
    mode="single"
    @proceed="proceedWithDuplicate"
    @cancel="cancelDuplicate"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Plus, Trash, Loader2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useDocumentsApi } from "~/data/documents";
import { parseFile, isValidFileType } from "~/utils/file-parser";
import DuplicateWarningDialog from "./DuplicateWarningDialog.vue";
import type { DocumentRequest, DuplicateDocumentError } from "~/types/api";

const props = defineProps<{ open: boolean; projectId: number | null }>();
const emit = defineEmits<{ (e: 'update:open', value: boolean): void; (e: 'success'): void }>();

const { createDocument: apiCreateDocument, previewDocumentSentences } = useDocumentsApi();

interface DocumentPreview {
  title: string;
  text: string;
  sentence_count?: number;
  sentences?: string[];
}

const isUploading = ref(false);
const singleFilePreview = ref<DocumentPreview | null>(null);
const singleFileConfirmed = ref(false);
const isLoadingPreview = ref(false);
const fileError = ref("");
const documentInstitution = ref("");

const isDuplicateWarningOpen = ref(false);
const duplicateError = ref<DuplicateDocumentError | null>(null);
const pendingDocumentRequest = ref<DocumentRequest | null>(null);

async function handleSingleFile(e: Event) {
  fileError.value = "";
  isLoadingPreview.value = false;
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
    const previewResult = await previewDocumentSentences({ text: parsedFile.text });
    singleFilePreview.value = {
      title: parsedFile.title,
      text: parsedFile.text,
      sentence_count: previewResult.sentence_count,
      sentences: previewResult.sentences,
    };
  } catch (error) {
    fileError.value = error instanceof Error ? error.message : "Gagal membaca file";
  } finally {
    isLoadingPreview.value = false;
  }
}

function confirmFile() {
  if (singleFilePreview.value) {
    singleFileConfirmed.value = true;
    toast.success("File dikonfirmasi dan siap untuk diupload");
  }
}

function deleteFile() {
  singleFilePreview.value = null;
  singleFileConfirmed.value = false;
  const fileInput = document.querySelector('input[type="file"][accept=".txt,.docx"]') as HTMLInputElement;
  if (fileInput) fileInput.value = "";
  toast.info("File dihapus");
}

function resetForm() {
  documentInstitution.value = "";
  singleFilePreview.value = null;
  singleFileConfirmed.value = false;
  fileError.value = "";
  isLoadingPreview.value = false;
  const fileInput = document.querySelector('input[type="file"][accept=".txt,.docx"]') as HTMLInputElement;
  if (fileInput) fileInput.value = "";
}

async function uploadFile() {
  if (!props.projectId) {
    toast.error("Pilih project terlebih dahulu untuk mengupload dokumen");
    return;
  }
  isUploading.value = true;
  try {
    if (singleFilePreview.value) {
      await createAndAssignDocument(singleFilePreview.value);
      toast.success(`Dokumen "${singleFilePreview.value.title}" berhasil dibuat dan ditambahkan ke project`);
      resetForm();
      emit('success');
    }
  } catch (error: any) {
    if (error.message !== 'DUPLICATE_DETECTED') toast.error("Gagal mengupload dokumen");
  } finally {
    isUploading.value = false;
  }
}

async function createAndAssignDocument(docRequest: DocumentPreview, allowDuplicate = false) {
  const documentWithProject: DocumentRequest = {
    ...docRequest,
    project: props.projectId!,
    institution: documentInstitution.value || undefined,
    allow_duplicate: allowDuplicate,
  };
  try {
    return await apiCreateDocument(documentWithProject);
  } catch (error: any) {
    if (error.status === 400 && error.data?.error?.includes('sudah ada')) {
      duplicateError.value = error.data as DuplicateDocumentError;
      pendingDocumentRequest.value = documentWithProject;
      isDuplicateWarningOpen.value = true;
      throw new Error('DUPLICATE_DETECTED');
    }
    throw error;
  }
}

async function proceedWithDuplicate() {
  if (!pendingDocumentRequest.value) return;
  try {
    const documentWithDuplicate = { ...pendingDocumentRequest.value, allow_duplicate: true };
    await apiCreateDocument(documentWithDuplicate);
    toast.success("Dokumen berhasil dibuat (duplikat diizinkan)");
    resetForm();
    emit('success');
  } catch (error) {
    toast.error("Gagal membuat dokumen");
  } finally {
    isDuplicateWarningOpen.value = false;
    duplicateError.value = null;
    pendingDocumentRequest.value = null;
  }
}

function cancelDuplicate() {
  isDuplicateWarningOpen.value = false;
  duplicateError.value = null;
  pendingDocumentRequest.value = null;
  isUploading.value = false;
}
</script>