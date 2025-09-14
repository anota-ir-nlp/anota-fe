<script lang="ts" setup>
import { Toaster as Sonner, type ToasterProps } from 'vue-sonner'

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    class="toaster group"
    v-bind="props"
    :style="{
      '--normal-bg': 'rgba(255,255,255,0.95)',
      '--normal-text': '#1f2937',
      '--normal-border': 'rgba(0,0,0,0.1)',
      '--success-bg': 'rgba(34,197,94,0.95)',
      '--success-text': 'white',
      '--error-bg': 'rgba(239,68,68,0.95)',
      '--error-text': 'white',
      '--warning-bg': 'rgba(245,158,11,0.95)',
      '--warning-text': 'white',
      'backdrop-filter': 'blur(12px)',
      'box-shadow': '0 10px 25px rgba(0,0,0,0.15)'
    }"
  />
</template>