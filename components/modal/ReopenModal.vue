<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <div class="p-6">
        <h3 class="text-xl font-bold text-black mb-4 flex items-center gap-2">
          <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 text-purple-500" />
          Reopen Dokumen
        </h3>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Alasan Reopen (opsional)</label>
          <textarea
            v-model="reason"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none text-gray-900"
            placeholder="Tulis alasan mengapa dokumen perlu dibuka kembali..."
          ></textarea>
          <div v-if="error" class="mt-2 text-red-500 text-sm">
            {{ error }}
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <UButton
            label="Batal"
            color="secondary"
            variant="ghost"
            class="rounded-xl px-6"
            @click="onCancel"
          />
          <UButton
            label="Kirim"
            :loading="loading"
            class="rounded-xl px-6 bg-purple-500 text-white hover:bg-purple-600"
            @click="onConfirm"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  modelValue: boolean
  loading?: boolean
  error?: string
}>()

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const reason = ref('')

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

watch(isOpen, (newVal) => {
  if (!newVal) {
    reason.value = ''
  }
})

const onCancel = () => {
  emit('cancel')
  isOpen.value = false
}

const onConfirm = () => {
  emit('confirm', reason.value)
}
</script>