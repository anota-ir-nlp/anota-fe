<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { SearchIcon } from 'lucide-vue-next'
import { ComboboxInput, type ComboboxInputEmits, type ComboboxInputProps, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<ComboboxInputProps & {
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<ComboboxInputEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <div
    data-slot="command-input-wrapper"
    class="flex items-center gap-2 px-1"
  >
    <SearchIcon class="size-4 shrink-0 opacity-50 text-muted-foreground" />
    <ComboboxInput
      data-slot="command-input"
    :class="cn(
      'file:text-foreground placeholder:text-muted-foreground selection:text-primary-foreground flex py-1 w-full min-w-0 rounded-md bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
      props.class,
    )"
      v-bind="{ ...forwarded, ...$attrs }"
    >
      <slot />
    </ComboboxInput>
  </div>
</template>
