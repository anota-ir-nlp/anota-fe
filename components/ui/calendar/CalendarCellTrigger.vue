<script lang="ts" setup>
import type { CalendarCellTriggerProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { CalendarCellTrigger, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"
import { buttonVariants } from '@/components/ui/button'

const props = defineProps<CalendarCellTriggerProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <CalendarCellTrigger
    :class="cn(
      buttonVariants({ variant: 'ghost' }),
      'h-8 w-8 p-0 font-normal rounded-md',
      // Today indicator
      '[&[data-today]:not([data-selected])]:bg-blue-50 [&[data-today]:not([data-selected])]:text-blue-700 [&[data-today]:not([data-selected])]:border [&[data-today]:not([data-selected])]:border-blue-300',
      // Selected state - matching primary button gradient
      'data-[selected]:bg-gradient-to-r data-[selected]:from-blue-600 data-[selected]:to-sky-500 data-[selected]:text-white data-[selected]:font-semibold data-[selected]:shadow-md',
      'data-[selected]:hover:from-blue-700 data-[selected]:hover:to-sky-600 data-[selected]:hover:shadow-lg',
      // Disabled
      'data-[disabled]:text-gray-400 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
      // Unavailable
      'data-[unavailable]:text-red-500 data-[unavailable]:line-through',
      // Outside months
      'data-[outside-view]:text-gray-400 data-[outside-view]:opacity-40',
      '[&[data-outside-view][data-selected]]:bg-gray-200 [&[data-outside-view][data-selected]]:text-gray-600 [&[data-outside-view][data-selected]]:opacity-50',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarCellTrigger>
</template>
