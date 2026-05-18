<template>
  <UModal v-model:open="isOpen">
    <template #content>
        <div class="bg-white p-6 rounded-2xl">
          <h3 class="text-lg font-semibold mb-4 flex items-center gap-2 text-black">
            <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-blue-400" />
            {{ isEditing ? 'Edit Anotasi' : 'Buat Anotasi' }}
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2 text-black">Teks Terpilih:</label>
              <div class="bg-gray-100 p-3 rounded border border-gray-200 text-sm font-mono text-black">
                "{{ selectedText }}"
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2 text-black">Koreksi:</label>
              <UInput v-model="localCorrection" placeholder="Masukkan koreksi" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2 text-black">Tipe Error:</label>
              <div class="max-h-48 overflow-y-auto border border-gray-200 rounded-lg bg-gray-50 p-2">
                <div
                  v-for="type in errorTypes"
                  :key="type.id"
                  class="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-50 transition cursor-pointer"
                >
                  <input type="checkbox" :value="String(type.id)" v-model="localErrorTypes" class="accent-blue-500" :id="'errtype-' + type.id" />
                  <label :for="'errtype-' + type.id" class="text-sm text-black font-medium cursor-pointer">
                    <span class="font-mono text-xs text-blue-700">{{ type.error_code }}</span>
                    <span class="ml-1 text-gray-500">{{ type.description }}</span>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2 text-black">Wajib/Optional:</label>
              <select v-model="localIsRequired" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900">
                <option :value="true">Wajib</option>
                <option :value="false">Optional</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2 text-black">Komentar (Opsional):</label>
              <UTextarea v-model="localComments" placeholder="Tambahkan catatan atau komentar" class="w-full" />
            </div>

            <div class="flex gap-2 pt-4">
              <UButton
                label="Simpan"
                class="rounded-2xl px-4 py-2 bg-blue-100 text-blue-700 border border-blue-700 hover:bg-blue-200 disabled:bg-gray-200 disabled:border-none disabled:text-gray-500"
                @click="handleSave"
                :disabled="localErrorTypes.length === 0 || loading"
                :loading="loading"
              />
              <UButton label="Batal" color="neutral" variant="ghost" @click="isOpen = false" />
            </div>
          </div>
        </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  isEditing: boolean
  selectedText: string
  correction: string
  errorTypes: any[]
  selectedErrorTypes: string[]
  isRequired: boolean
  comments?: string
  loading: boolean
}>()

const emit = defineEmits(['update:modelValue', 'save'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const localCorrection = ref(props.correction)
const localErrorTypes = ref(props.selectedErrorTypes)
const localIsRequired = ref(props.isRequired)
const localComments = ref(props.comments || '')

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    localCorrection.value = props.correction
    localErrorTypes.value = [...props.selectedErrorTypes]
    localIsRequired.value = props.isRequired
    localComments.value = props.comments || ''
  }
})

const handleSave = () => {
  emit('save', {
    correction: localCorrection.value,
    errorTypes: localErrorTypes.value,
    isRequired: localIsRequired.value,
    comments: localComments.value
  })
}
</script>