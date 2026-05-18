<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-xl mt-4 rounded-b-2xl overflow-hidden z-50"
    >
      <div class="flex flex-col p-4 max-h-[75vh] overflow-y-auto space-y-2">
        <template v-for="group in menuGroups" :key="group.label">
          <NuxtLink
            v-if="group.type === 'link'"
            :to="group.path"
            @click="emit('close')"
            class="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors font-medium"
          >
            <component :is="group.icon" class="w-5 h-5" />
            <span>{{ group.label }}</span>
          </NuxtLink>

          <div v-else-if="group.type === 'dropdown'" class="flex flex-col">
            <button
              @click="toggleGroup(group.label)"
              class="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition-colors w-full font-medium"
            >
              <div class="flex items-center space-x-3">
                <component :is="group.icon" class="w-5 h-5" />
                <span>{{ group.label }}</span>
              </div>
              <ChevronDown
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': expandedGroups[group.label] }"
              />
            </button>
            <div
              v-show="expandedGroups[group.label]"
              class="flex flex-col pl-11 pr-2 pb-2 pt-1 space-y-1"
            >
              <NuxtLink
                v-for="item in group.items"
                :key="item.path"
                :to="item.path"
                @click="emit('close')"
                class="flex items-start space-x-3 p-2 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <component
                  :is="item.icon"
                  class="w-4 h-4 text-slate-400 group-hover:text-blue-500 mt-0.5"
                />
                <div>
                  <div
                    class="text-sm font-medium text-slate-700 group-hover:text-blue-600"
                  >
                    {{ item.label }}
                  </div>
                  <div class="text-xs text-slate-400 mt-0.5 line-clamp-2">
                    {{ item.description }}
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </template>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown } from "lucide-vue-next";

const props = defineProps<{
  isOpen: boolean;
  menuGroups: any[];
}>();

const emit = defineEmits(["close"]);

const expandedGroups = ref<Record<string, boolean>>({});

const toggleGroup = (label: string) => {
  expandedGroups.value[label] = !expandedGroups.value[label];
};
</script>