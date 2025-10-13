<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <tr
    data-slot="table-row"
    :class="cn('hover:bg-gray-50 data-[state=selected]:bg-gray-100 border-b border-gray-200 transition-colors', props.class)"
  >
    <slot />
  </tr>
</template>
