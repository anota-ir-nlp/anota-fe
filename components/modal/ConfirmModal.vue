<template>
  <UModal v-model:open="isOpen">
    <template #content>
        <div class="p-6 text-center">
          <img v-if="img" :src="img" :alt="heading" class="w-32 h-32 mx-auto mb-4 object-contain" />
          <h3 class="text-xl font-bold text-black mb-2">{{ heading }}</h3>
          <p class="text-gray-500 mb-6">{{ desc }}</p>
          <div class="flex gap-3 justify-center">
            <UButton
              :label="cancelText"
              color="secondary"
              variant="ghost"
              class="rounded-xl px-6"
              @click="onCancel"
            />
            <UButton
              :label="confirmText"
              color="primary"
              class="rounded-xl px-6 bg-black text-white hover:bg-gray-900"
              @click="onConfirm"
            />
          </div>
        </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
  img?: string
  heading: string
  desc: string
  cancelText: string
  confirmText: string
}>()

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const onCancel = () => {
  emit('cancel')
  isOpen.value = false
}

const onConfirm = () => {
  emit('confirm')
  isOpen.value = false
}
</script>