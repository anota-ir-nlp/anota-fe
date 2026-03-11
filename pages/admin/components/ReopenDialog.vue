<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Loader2 } from "lucide-vue-next";
import type { DocumentResponse, UserResponse } from "~/types/api";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
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

const props = defineProps<{
  open: boolean;
  document: DocumentResponse | null;
  users: UserResponse[];
  isReopening: boolean;
}>();

const emit = defineEmits(["update:open", "submit"]);

const reopenMode = ref<"annotator" | "reviewer">("annotator");
const reopenUserIds = ref<string[]>([]);
const reopenReason = ref("");
const openReopenUsers = ref(false);
const reopenSearchTerm = ref("");

watch(() => props.open, (newVal) => {
  if (newVal) {
    reopenUserIds.value = [];
    reopenReason.value = "";
    reopenMode.value = "annotator";
  }
});

const availableReopenUsers = computed(() => {
  if (!props.document) return [];
  const assignedNames = props.document.assigned_to || [];
  return props.users
    .filter((user) => assignedNames.includes(user.full_name))
    .filter((user) => reopenMode.value === "annotator" ? user.roles.includes("Annotator") : user.roles.includes("Reviewer"))
    .filter((user) => !reopenUserIds.value.includes(user.id))
    .filter((user) => {
      if (!reopenSearchTerm.value) return true;
      const s = reopenSearchTerm.value.toLowerCase();
      return user.full_name.toLowerCase().includes(s) || user.username.toLowerCase().includes(s);
    });
});

function getUserName(id: string) {
  return props.users.find(u => u.id === id)?.full_name || "Unknown";
}

function addUser(ev: any) {
  if (typeof ev.detail.value === "string") {
    reopenUserIds.value.push(ev.detail.value);
    reopenSearchTerm.value = "";
  }
  if (availableReopenUsers.value.length === 0) openReopenUsers.value = false;
}

function removeUser(id: string) {
  reopenUserIds.value = reopenUserIds.value.filter(uid => uid !== id);
}

function handleSubmit() {
  emit("submit", {
    mode: reopenMode.value,
    userIds: reopenUserIds.value,
    reason: reopenReason.value,
  });
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
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
            <Button :variant="reopenMode === 'annotator' ? 'default' : 'outline'" @click="reopenMode = 'annotator'" size="sm" class="flex-1">Anotator</Button>
            <Button :variant="reopenMode === 'reviewer' ? 'default' : 'outline'" @click="reopenMode = 'reviewer'" size="sm" class="flex-1">Reviewer</Button>
          </div>
        </div>
        <div class="grid gap-2">
          <label class="text-sm font-medium text-left">User yang Akan Di-reopen</label>
          <Combobox v-model="reopenUserIds" v-model:open="openReopenUsers" :ignore-filter="true">
            <ComboboxAnchor as-child>
              <TagsInput v-model="reopenUserIds" class="px-2 w-full">
                <div class="flex flex-col">
                  <div v-if="reopenUserIds.length" class="flex gap-2 flex-wrap items-center p-1 font-semibold">
                    <TagsInputItem v-for="userId in reopenUserIds" :key="userId" :value="getUserName(userId)">
                      <TagsInputItemText class="text-xs">{{ getUserName(userId) }}</TagsInputItemText>
                      <TagsInputItemDelete @click="removeUser(userId)" />
                    </TagsInputItem>
                  </div>
                  <ComboboxInput v-model="reopenSearchTerm" as-child>
                    <TagsInputInput :placeholder="`Tambah ${reopenMode === 'annotator' ? 'anotator' : 'reviewer'}...`" class="w-full" @keydown.enter.prevent />
                  </ComboboxInput>
                </div>
              </TagsInput>
            </ComboboxAnchor>
            <ComboboxList class="w-[--reka-popper-anchor-width]" align="start">
              <ComboboxEmpty />
              <ComboboxGroup>
                <ComboboxItem v-for="user in availableReopenUsers" :key="user.id" :value="user.id" @select.prevent="addUser">
                  {{ user.full_name }}
                </ComboboxItem>
              </ComboboxGroup>
            </ComboboxList>
          </Combobox>
        </div>
        <div class="grid gap-2">
          <label class="text-sm font-medium text-left">Alasan (opsional)</label>
          <Textarea v-model="reopenReason" rows="3" placeholder="Alasan reopening" />
        </div>
        <div class="bg-slate-800 rounded p-3 text-sm text-left">
          <div class="font-semibold text-blue-300 mb-2">Dokumen:</div>
          <div class="font-medium text-white">{{ document?.title }}</div>
          <div v-if="document?.assigned_to?.length" class="text-gray-300 mt-2">
            <div class="text-xs font-medium text-blue-300">User yang ditugaskan:</div>
            <div class="text-xs">{{ document.assigned_to.join(', ') }}</div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">Batal</Button>
        <Button @click="handleSubmit" :disabled="isReopening || reopenUserIds.length === 0" class="flex items-center gap-2">
          <Loader2 v-if="isReopening" class="w-4 h-4 animate-spin" />
          {{ isReopening ? "Memproses..." : "Kirim Reopen" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>