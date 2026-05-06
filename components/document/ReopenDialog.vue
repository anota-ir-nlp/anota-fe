<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Reopen Dokumen</DialogTitle>
        <DialogDescription>
          Buka kembali pekerjaan {{ reopenMode === "annotator" ? "anotator" : "reviewer" }} pada dokumen "{{ document?.title }}".
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <label class="text-sm font-medium text-left">Tipe Reopen</label>
          <div class="flex gap-2">
            <Button :variant="reopenMode === 'annotator' ? 'default' : 'outline'" @click="reopenMode = 'annotator'" size="sm" class="flex-1">
              Anotator
            </Button>
            <Button :variant="reopenMode === 'reviewer' ? 'default' : 'outline'" @click="reopenMode = 'reviewer'" size="sm" class="flex-1">
              Reviewer
            </Button>
          </div>
        </div>
        <div class="grid gap-2">
          <label class="text-sm font-medium text-left">
            {{ reopenMode === "annotator" ? "Anotator" : "Reviewer" }} yang Akan Di-reopen
          </label>
          <Combobox v-model="reopenUserIds" v-model:open="openReopenUsers" :ignore-filter="true">
            <ComboboxAnchor as-child>
              <TagsInput v-model="reopenUserIds" class="px-2 w-full">
                <div class="flex flex-col">
                  <div v-if="reopenUserIds.length" class="flex gap-2 flex-wrap items-center p-1 font-semibold">
                    <TagsInputItem v-for="userId in reopenUserIds" :key="userId" :value="getUserName(userId)">
                      <TagsInputItemText class="text-xs">{{ getUserName(userId) }}</TagsInputItemText>
                      <TagsInputItemDelete @click="removeUserFromReopenList(userId)" />
                    </TagsInputItem>
                  </div>
                  <ComboboxInput v-model="reopenSearchTerm" as-child>
                    <TagsInputInput :placeholder="`Tambah ${reopenMode === 'annotator' ? 'anotator' : 'reviewer'}...`" class="w-full" @keydown.enter.prevent />
                  </ComboboxInput>
                </div>
              </TagsInput>
            </ComboboxAnchor>
            <ComboboxList class="w-[--reka-popper-anchor-width]" align="start">
              <ComboboxEmpty>
                <div class="text-gray-500 text-sm p-2">
                  {{ document?.assigned_to?.length === 0 ? `Tidak ada user yang ditugaskan pada dokumen ini` : `Tidak ada ${reopenMode === 'annotator' ? 'anotator' : 'reviewer'} yang ditugaskan pada dokumen ini` }}
                </div>
              </ComboboxEmpty>
              <ComboboxGroup>
                <ComboboxItem v-for="user in availableReopenUsers" :key="user.id" :value="user.id" @select.prevent="addUserToReopenList">
                  {{ user.full_name }} ({{ user.roles.join(", ") }})
                </ComboboxItem>
              </ComboboxGroup>
            </ComboboxList>
          </Combobox>
        </div>
        <div class="grid gap-2">
          <label class="text-sm font-medium text-left">Alasan (opsional)</label>
          <Textarea v-model="reopenReason" rows="3" placeholder="Alasan reopening (opsional)" />
        </div>
        <div class="bg-slate-800 rounded p-3 text-sm">
          <div class="font-semibold text-blue-300 mb-2">Dokumen:</div>
          <div class="text-left">
            <div class="font-medium text-white">{{ document?.title }}</div>
            <div class="text-gray-400 mt-1">ID: {{ document?.id }}</div>
            <div v-if="document?.assigned_to?.length" class="text-gray-300 mt-2">
              <div class="text-xs font-medium text-blue-300 mb-1">User yang ditugaskan:</div>
              <div class="text-xs">{{ document.assigned_to.join(', ') }}</div>
            </div>
            <div v-else class="text-yellow-400 mt-2 text-xs">Belum ada user yang ditugaskan</div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="closeDialog">Batal</Button>
        <Button @click="submitReopen" :disabled="isReopening || reopenUserIds.length === 0" class="flex items-center gap-2">
          <Loader2 v-if="isReopening" class="w-4 h-4 animate-spin" />
          {{ isReopening ? "Memproses..." : "Kirim Reopen" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { TagsInput, TagsInputItem, TagsInputInput, TagsInputItemDelete, TagsInputItemText } from "~/components/ui/tags-input";
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Loader2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useAnnotationsApi } from "~/data/annotations";
import { useReviewsApi } from "~/data/reviews";
import type { DocumentResponse, UserResponse } from "~/types/api";

const props = defineProps<{ open: boolean; document: DocumentResponse | null; users: UserResponse[]; projectId: number | null }>();
const emit = defineEmits<{ (e: 'update:open', value: boolean): void; (e: 'success'): void }>();

const { adminReopenAnnotator } = useAnnotationsApi();
const { adminReopenReview } = useReviewsApi();

const isReopening = ref(false);
const reopenMode = ref<"annotator" | "reviewer">("annotator");
const reopenUserIds = ref<string[]>([]);
const reopenReason = ref("");
const openReopenUsers = ref(false);
const reopenSearchTerm = ref("");

watch(() => props.open, (newVal) => {
  if (newVal) {
    reopenUserIds.value = [];
    reopenReason.value = "";
    reopenSearchTerm.value = "";
    reopenMode.value = "annotator";
  }
});

const availableReopenUsers = computed(() => {
  const selectedIds = reopenUserIds.value || [];
  const documentAssignedUsers = props.document?.assigned_to || [];
  return props.users
    .filter((user) => documentAssignedUsers.includes(user.full_name))
    .filter((user) => reopenMode.value === "annotator" ? user.roles.includes("Annotator") : user.roles.includes("Reviewer"))
    .filter((user) => !selectedIds.includes(user.id))
    .filter((user) => {
      if (!reopenSearchTerm.value) return true;
      const searchLower = reopenSearchTerm.value.toLowerCase();
      return user.full_name.toLowerCase().includes(searchLower) || user.username.toLowerCase().includes(searchLower);
    });
});

function getUserName(userId: string) {
  const user = props.users.find((u) => u.id === userId);
  return user ? user.full_name : "Unknown User";
}

function addUserToReopenList(ev: any) {
  if (typeof ev.detail.value === "string") {
    const userId = ev.detail.value;
    if (!reopenUserIds.value.includes(userId)) reopenUserIds.value.push(userId);
    reopenSearchTerm.value = "";
  }
  if (availableReopenUsers.value.length === 0) openReopenUsers.value = false;
}

function removeUserFromReopenList(userId: string) {
  const index = reopenUserIds.value.indexOf(userId);
  if (index > -1) reopenUserIds.value.splice(index, 1);
}

function closeDialog() {
  emit('update:open', false);
}

async function submitReopen() {
  if (!props.document) {
    toast.error("Dokumen harus dipilih");
    return;
  }
  const assignedUsers = props.document.assigned_to || [];
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
          document: props.document.id,
          user_id: userId,
          reason: reopenReason.value || undefined,
        };
        if (reopenMode.value === "annotator") {
          await adminReopenAnnotator(props.projectId!, requestData);
        } else {
          await adminReopenReview(props.projectId!, requestData);
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
      toast.success(`Berhasil membuka kembali pekerjaan ${userType} untuk ${successCount} user`);
    }
    if (errorCount > 0) {
      toast.error(`Gagal untuk ${errorCount} user:\n${errors.join('\n')}`);
    }
    closeDialog();
    emit('success');
  } catch (error: any) {
    const errorMessage = error?.data?.detail || `Gagal melakukan reopen ${reopenMode.value}`;
    toast.error(errorMessage);
  } finally {
    isReopening.value = false;
  }
}
</script>