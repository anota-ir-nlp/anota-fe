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
        'flex flex-col gap-6 rounded-xl py-6 shadow-sm',
        {
          'bg-card text-card-foreground border': props.variant === 'default' || !props.variant,
          'bg-white/8 backdrop-blur-md border border-white/15 shadow-2xl text-white': props.variant === 'glassmorphism'
        },
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
