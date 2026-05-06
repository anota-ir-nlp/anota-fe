<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
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
                      <TagsInputItemDelete @click="removeUserFromAssignment(userId)" />
                    </TagsInputItem>
                  </div>
                  <ComboboxInput v-model="searchTerm" as-child>
                    <TagsInputInput placeholder="Tambah user assignment..." class="w-full" @keydown.enter.prevent />
                  </ComboboxInput>
                </div>
              </TagsInput>
              <ComboboxList class="w-[--reka-popper-anchor-width]" align="start">
                <ComboboxEmpty />
                <ComboboxGroup>
                  <ComboboxItem v-for="user in availableUsers" :key="user.id" :value="user.id" @select.prevent="addUserToAssignment">
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
            <div v-for="doc in selectedDocuments" :key="doc.id" class="text-gray-400 mb-1">
              • {{ doc.title }}
            </div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" @click="closeDialog">Batal</Button>
        <Button @click="saveAssignmentChanges" :disabled="isManaging" class="flex items-center gap-2">
          <UserPlus v-if="!isManaging" class="w-4 h-4" />
          <Loader2 v-else class="w-4 h-4 animate-spin" />
          {{ isManaging ? "Menyimpan..." : "Simpan Assignment" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { TagsInput, TagsInputItem, TagsInputInput, TagsInputItemDelete, TagsInputItemText } from "~/components/ui/tags-input";
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { UserPlus, Loader2, CalendarIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";
import { useDocumentsApi } from "~/data/documents";
import { useAssignmentsApi } from "~/data/document-assignments";
import type { DocumentResponse, UserResponse } from "~/types/api";

const props = defineProps<{ open: boolean; selectedDocuments: DocumentResponse[]; users: UserResponse[] }>();
const emit = defineEmits<{ (e: 'update:open', value: boolean): void; (e: 'success'): void }>();

const { getDocument } = useDocumentsApi();
const { assignDocument: apiAssignDocument, unassignDocument: apiUnassignDocument } = useAssignmentsApi();

const isManaging = ref(false);
const assignedUserIds = ref<string[]>([]);
const originalAssignedUsers = ref<string[]>([]);
const openUsers = ref(false);
const searchTerm = ref("");
const assignmentDeadline = ref<Date>();

const formattedDeadline = computed(() => {
  if (!assignmentDeadline.value) return "Pilih tanggal deadline";
  try {
    if (assignmentDeadline.value && typeof assignmentDeadline.value === 'object' && 'toDate' in assignmentDeadline.value) {
      const jsDate = (assignmentDeadline.value as any).toDate('Asia/Jakarta');
      return jsDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    if (assignmentDeadline.value instanceof Date) {
      return assignmentDeadline.value.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  } catch (e) {}
  return "Pilih tanggal deadline";
});

const availableUsers = computed(() => {
  const assignedIds = assignedUserIds.value || [];
  return props.users
    .filter((user) => !assignedIds.includes(user.id))
    .filter((user) => {
      if (!searchTerm.value) return true;
      const searchLower = searchTerm.value.toLowerCase();
      return user.full_name.toLowerCase().includes(searchLower) || user.username.toLowerCase().includes(searchLower);
    });
});

watch(() => props.open, async (newVal) => {
  if (newVal) {
    assignedUserIds.value = [];
    searchTerm.value = "";
    assignmentDeadline.value = undefined;
    try {
      const documentDetails = await Promise.all(props.selectedDocuments.map((doc) => getDocument(doc.id)));
      if (documentDetails.length > 0) {
        const allAssignedUsers = new Set<string>();
        documentDetails.forEach((doc) => {
          const assigned = doc.assigned_to || [];
          assigned.forEach((userId: string) => allAssignedUsers.add(userId));
        });
        const unionAssignedUsers = Array.from(allAssignedUsers);
        originalAssignedUsers.value = unionAssignedUsers;
        assignedUserIds.value = [...unionAssignedUsers];
      }
    } catch (error) {
      toast.error("Gagal memuat detail dokumen untuk bulk assignment");
      originalAssignedUsers.value = [];
      assignedUserIds.value = [];
    }
  }
});

function closeDialog() {
  assignedUserIds.value = [];
  originalAssignedUsers.value = [];
  searchTerm.value = "";
  assignmentDeadline.value = undefined;
  emit('update:open', false);
}

function getUserName(userId: string) {
  const user = props.users.find((u) => u.id === userId);
  return user ? user.full_name : "Unknown User";
}

function addUserToAssignment(ev: any) {
  if (typeof ev.detail.value === "string") {
    const userId = ev.detail.value;
    if (!assignedUserIds.value.includes(userId)) assignedUserIds.value.push(userId);
    searchTerm.value = "";
  }
  if (availableUsers.value.length === 0) openUsers.value = false;
}

function removeUserFromAssignment(userId: string) {
  const index = assignedUserIds.value.indexOf(userId);
  if (index > -1) assignedUserIds.value.splice(index, 1);
}

async function saveAssignmentChanges() {
  if (props.selectedDocuments.length === 0) {
    toast.error("Tidak ada dokumen yang dipilih");
    return;
  }
  isManaging.value = true;
  toast.promise(
    (async () => {
      let assignSuccessCount = 0;
      let unassignSuccessCount = 0;
      let failCount = 0;
      let lastError: any = null;

      for (const doc of props.selectedDocuments) {
        try {
          const documentDetails = await getDocument(doc.id);
          const currentAssigned = documentDetails.assigned_to || [];
          const targetAssigned = assignedUserIds.value;
          const usersToAssign = targetAssigned.filter((userId) => !currentAssigned.includes(userId));
          const usersToUnassign = currentAssigned.filter((userId) => !targetAssigned.includes(userId));

          for (const userId of usersToAssign) {
            try {
              const assignmentData: any = { document_id: doc.id, user_id: userId };
              if (assignmentDeadline.value) {
                let year, month, day;
                if (typeof assignmentDeadline.value === 'object' && 'year' in assignmentDeadline.value) {
                  year = (assignmentDeadline.value as any).year;
                  month = String((assignmentDeadline.value as any).month).padStart(2, '0');
                  day = String((assignmentDeadline.value as any).day).padStart(2, '0');
                } else if (assignmentDeadline.value instanceof Date) {
                  year = assignmentDeadline.value.getFullYear();
                  month = String(assignmentDeadline.value.getMonth() + 1).padStart(2, '0');
                  day = String(assignmentDeadline.value.getDate()).padStart(2, '0');
                }
                if (year && month && day) {
                  assignmentData.deadline = `${year}-${month}-${day}`;
                } else {
                  throw new Error("Tanggal deadline tidak valid");
                }
              }
              await apiAssignDocument(assignmentData);
              assignSuccessCount++;
            } catch (error: any) {
              failCount++;
              lastError = error;
            }
          }

          for (const userId of usersToUnassign) {
            try {
              await apiUnassignDocument({ document_id: doc.id, user_id: userId });
              unassignSuccessCount++;
            } catch (error: any) {
              failCount++;
              lastError = error;
            }
          }
        } catch (error: any) {
          failCount++;
          lastError = error;
        }
      }

      if (failCount > 0) {
        const errorMessage = lastError?.data?.error || lastError?.message || "Terjadi kesalahan";
        const error = new Error(errorMessage);
        (error as any).assignSuccessCount = assignSuccessCount;
        (error as any).unassignSuccessCount = unassignSuccessCount;
        (error as any).failCount = failCount;
        throw error;
      }
      return { assignSuccessCount, unassignSuccessCount, failCount };
    })(),
    {
      loading: "Menyimpan assignment untuk dokumen terpilih...",
      success: (result: any) => {
        emit('success');
        closeDialog();
        const messages = [];
        if (result.assignSuccessCount > 0) messages.push(`${result.assignSuccessCount} assignment baru ditambahkan`);
        if (result.unassignSuccessCount > 0) messages.push(`${result.unassignSuccessCount} assignment dihapus`);
        let successMessage = "Assignment berhasil disimpan";
        if (messages.length > 0) successMessage += `: ${messages.join(", ")}`;
        return successMessage;
      },
      error: (error: any) => {
        const successCount = (error.assignSuccessCount || 0) + (error.unassignSuccessCount || 0);
        if (successCount > 0) {
          emit('success');
          closeDialog();
          return `${error.message}. ${successCount} operasi berhasil, ${error.failCount} operasi gagal`;
        }
        return error.message || "Gagal menyimpan bulk assignment";
      },
    }
  );
  isManaging.value = false;
}
</script>