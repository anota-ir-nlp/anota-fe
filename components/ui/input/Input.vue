<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :class="cn(
      'file:text-foreground placeholder:text-gray-500 selection:bg-primary selection:text-primary-foreground bg-white/90 border-gray-200 text-gray-900 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow,background-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm backdrop-filter backdrop-blur-sm',
      'focus-visible:border-blue-500 focus-visible:ring-blue-500/20 focus-visible:ring-[3px] focus-visible:bg-white/95',
      'aria-invalid:ring-red-500/20 aria-invalid:border-red-500',
      'hover:bg-white/95 hover:border-gray-300',
      props.class,
    )"
  >
</template>
