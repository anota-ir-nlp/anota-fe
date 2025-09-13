<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  variant?: 'default' | 'glassmorphism'
}>()
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'flex flex-col gap-6 rounded-xl py-6',
        {
          'bg-white/90 text-gray-900 border border-gray-200/60 shadow-lg backdrop-filter backdrop-blur-sm hover:shadow-xl transition-all duration-200': props.variant === 'default' || !props.variant,
          'bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl text-white': props.variant === 'glassmorphism'
        },
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
