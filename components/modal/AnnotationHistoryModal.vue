<template>
  <teleport to="body">
    <div
      v-if="modelValue && sentence"
      :style="popupStyle"
      class="fixed z-50 bg-white border border-gray-300 rounded-2xl p-6 shadow-xl min-w-[320px] max-w-[90vw] max-h-[80vh] overflow-y-auto cursor-move"
      @mousedown="startDrag"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold flex items-center gap-2 text-black">
          <UIcon name="i-heroicons-clock" class="w-5 h-5 text-purple-500" />
          Riwayat Kalimat #{{ sentence.id }}
        </h3>
        <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="$emit('update:modelValue', false)" class="bg-black text-white hover:bg-gray-900" />
      </div>

      <div v-if="annotations.length === 0" class="text-center py-8">
        <p class="text-gray-500">Belum ada anotasi</p>
      </div>
      <div v-else class="space-y-3">
        <div v-for="(ann, index) in annotations" :key="ann.id" class="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-semibold text-black">Anotasi #{{ index + 1 }}</span>
          </div>
          <div class="bg-gray-100 rounded p-2 text-sm mb-2 text-black">
             {{ ann.correction }}
          </div>
          <div class="flex gap-2">
            <UButton label="Edit" size="sm" @click="$emit('edit', ann)" class="bg-blue-100 text-blue-700" />
            <UButton label="Hapus" size="sm" color="error" @click="$emit('delete', ann)" />
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  sentence: any
  annotations: any[]
}>()

const emit = defineEmits(['update:modelValue', 'edit', 'delete'])

const popupPosition = ref({ x: 100, y: 100 })
const dragging = ref(false)
const offset = ref({ x: 0, y: 0 })

const popupStyle = computed(() => ({
  left: popupPosition.value.x + 'px',
  top: popupPosition.value.y + 'px',
  position: 'fixed' as const
}))

function startDrag(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('button')) return
  dragging.value = true
  offset.value = { x: e.clientX - popupPosition.value.x, y: e.clientY - popupPosition.value.y }
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent) {
  if (!dragging.value) return
  popupPosition.value = { x: e.clientX - offset.value.x, y: e.clientY - offset.value.y }
}

function stopDrag() {
  dragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}
</script>