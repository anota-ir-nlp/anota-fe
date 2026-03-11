<script setup lang="ts">
import { AlertTriangle, X } from "lucide-vue-next";
import type { DocumentRequest, DuplicateDocumentError } from "~/types/api";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

defineProps<{
  open: boolean;
  pendingRequest: DocumentRequest | null;
  duplicateError: DuplicateDocumentError | null;
  mode: "single" | "bulk";
}>();

const emit = defineEmits(["update:open", "cancel", "proceed"]);
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle class="text-orange-600 flex items-center gap-2">
          <AlertTriangle class="w-5 h-5" />
          Dokumen Duplikat Terdeteksi
        </DialogTitle>
        <DialogDescription>
          Dokumen dengan teks yang sama sudah ada dalam sistem.
        </DialogDescription>
      </DialogHeader>
      <div class="space-y-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-semibold text-blue-800 mb-2">Akan diupload:</h4>
          <p class="text-sm text-blue-700"><strong>Judul:</strong> {{ pendingRequest?.title }}</p>
          <p class="text-sm text-blue-700 mt-1"><strong>Mode:</strong> {{ mode === 'single' ? 'Upload Tunggal' : 'Upload Massal' }}</p>
        </div>
        <div class="bg-orange-50 p-4 rounded-lg" v-if="duplicateError?.existing_document">
          <h4 class="font-semibold text-orange-800 mb-2">Sudah ada:</h4>
          <p class="text-sm text-orange-700"><strong>Judul:</strong> {{ duplicateError.existing_document.title }}</p>
          <p class="text-sm text-orange-700 mt-1"><strong>ID:</strong> #{{ duplicateError.existing_document.id }}</p>
        </div>
      </div>
      <DialogFooter class="flex gap-2">
        <Button variant="outline" @click="emit('cancel')">
          <X class="w-4 h-4 mr-2" />
          Batalkan
        </Button>
        <Button @click="emit('proceed')" class="bg-orange-600 hover:bg-orange-700 text-white">
          <AlertTriangle class="w-4 h-4 mr-2" />
          Lanjutkan Tetap
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>