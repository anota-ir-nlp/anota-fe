<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { CalendarIcon, UserPlus, Loader2, X } from "lucide-vue-next";
import type { DocumentResponse, UserResponse } from "~/types/api";
import { Button } from "~/components/ui/button";
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
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

const props = defineProps<{
  open: boolean;
  selectedDocuments: DocumentResponse[];
  users: UserResponse[];
  isManaging: boolean;
  initialUserIds?: string[];
}>();

const emit = defineEmits(["update:open", "save"]);

const assignedUserIds = ref<string[]>([]);
const openUsers = ref(false);
const searchTerm = ref("");
const assignmentDeadline = ref<Date>();

watch(() => props.open, (newVal) => {
  if (newVal) {
    assignedUserIds.value = [...(props.initialUserIds || [])];
    assignmentDeadline.value = undefined;
  }
});

const formattedDeadline = computed(() => {
  if (!assignmentDeadline.value) return "Pilih tanggal deadline";
  try {
    const date = assignmentDeadline.value instanceof Date 
      ? assignmentDeadline.value 
      : (assignmentDeadline.value as any).toDate?.('Asia/Jakarta') || new Date();
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    return "Pilih tanggal deadline";
  }
});

const availableUsers = computed(() => {
  return props.users
    .filter((user) => !assignedUserIds.value.includes(user.id))
    .filter((user) => {
      if (!searchTerm.value) return true;
      const s = searchTerm.value.toLowerCase();
      return user.full_name.toLowerCase().includes(s) || user.username.toLowerCase().includes(s);
    });
});

function getUserName(userId: string) {
  return props.users.find((u) => u.id === userId)?.full_name || "Unknown User";
}

function addUser(ev: any) {
  if (typeof ev.detail.value === "string") {
    assignedUserIds.value.push(ev.detail.value);
    searchTerm.value = "";
  }
  if (availableUsers.value.length === 0) openUsers.value = false;
}

function removeUser(userId: string) {
  assignedUserIds.value = assignedUserIds.value.filter(id => id !== userId);
}

function handleSave() {
  emit("save", {
    userIds: assignedUserIds.value,
    deadline: assignmentDeadline.value,
  });
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Kelola Assignment Dokumen</DialogTitle>
        <DialogDescription>
          Kelola assignment untuk {{ selectedDocuments.length }} dokumen terpilih.
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <label class="text-sm font-medium text-left">Deadline Assignment</label>
          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline" :class="['w-full justify-start text-left font-normal', !assignmentDeadline && 'text-muted-foreground']">
                <CalendarIcon class="mr-2 h-4 w-4" />
                {{ formattedDeadline }}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar v-model="assignmentDeadline" :initial-focus="true" layout="month-and-year" />
            </PopoverContent>
          </Popover>
        </div>
        <div class="grid gap-2">
          <label class="text-sm font-medium text-left">User yang Ditugaskan</label>
          <Combobox v-model="assignedUserIds" v-model:open="openUsers" :ignore-filter="true">
            <ComboboxAnchor as-child>
              <TagsInput v-model="assignedUserIds" class="px-2 w-full">
                <div class="flex flex-col">
                  <div v-if="assignedUserIds.length" class="flex gap-2 flex-wrap items-center p-1 font-semibold">
                    <TagsInputItem v-for="userId in assignedUserIds" :key="userId" :value="getUserName(userId)">
                      <TagsInputItemText class="text-xs">{{ getUserName(userId) }}</TagsInputItemText>
                      <TagsInputItemDelete @click="removeUser(userId)" />
                    </TagsInputItem>
                  </div>
                  <ComboboxInput v-model="searchTerm" as-child>
                    <TagsInputInput placeholder="Tambah user..." class="w-full" @keydown.enter.prevent />
                  </ComboboxInput>
                </div>
              </TagsInput>
              <ComboboxList class="w-[--reka-popper-anchor-width]" align="start">
                <ComboboxEmpty />
                <ComboboxGroup>
                  <ComboboxItem v-for="user in availableUsers" :key="user.id" :value="user.id" @select.prevent="addUser">
                    {{ user.full_name }}
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxList>
            </ComboboxAnchor>
          </Combobox>
        </div>
        <div class="bg-slate-800 rounded p-3 text-sm">
          <div class="font-semibold text-blue-300 mb-2">Dokumen Terpilih:</div>
          <div class="text-left max-h-32 overflow-y-auto">
            <div v-for="doc in selectedDocuments" :key="doc.id" class="text-gray-400 mb-1">• {{ doc.title }}</div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">Batal</Button>
        <Button @click="handleSave" :disabled="isManaging" class="flex items-center gap-2">
          <UserPlus v-if="!isManaging" class="w-4 h-4" />
          <Loader2 v-else class="w-4 h-4 animate-spin" />
          {{ isManaging ? "Menyimpan..." : "Simpan Assignment" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>