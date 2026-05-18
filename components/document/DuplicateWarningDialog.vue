<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
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
            <strong>Judul:</strong> {{ pendingRequest?.title }}
          </p>
          <p class="text-sm text-blue-700 mt-1">
            <strong>Mode:</strong> {{ mode === 'single' ? 'Upload Tunggal' : 'Upload Massal' }}
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
            {{ pendingRequest?.text?.substring(0, 200) }}{{ (pendingRequest?.text?.length || 0) > 200 ? '...' : '' }}
          </p>
        </div>
      </div>

      <DialogFooter class="flex gap-2">
        <Button variant="outline" @click="$emit('cancel')">
          <X class="w-4 h-4 mr-2" />
          Batalkan
        </Button>
        <Button @click="$emit('proceed')" class="bg-orange-600 hover:bg-orange-700 text-white">
          <AlertTriangle class="w-4 h-4 mr-2" />
          Lanjutkan Tetap (Izinkan Duplikat)
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { AlertTriangle, X } from "lucide-vue-next";
import type { DocumentRequest, DuplicateDocumentError } from "~/types/api";

defineProps<{
  open: boolean;
  duplicateError: DuplicateDocumentError | null;
  pendingRequest: DocumentRequest | null;
  mode: "single" | "bulk";
}>();

defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'cancel'): void;
  (e: 'proceed'): void;
}>();
</script>