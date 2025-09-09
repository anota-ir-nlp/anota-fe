<script lang="ts" setup>
import { Toaster as Sonner, type ToasterProps } from 'vue-sonner'

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    class="toaster group"
    v-bind="props"
    :style="{
      '--normal-bg': 'rgba(255,255,255,0.08)',
      '--normal-text': 'white',
      '--normal-border': 'rgba(255,255,255,0.15)',
      'backdrop-filter': 'blur(12px)',
      'box-shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
    }"
  />
</template>