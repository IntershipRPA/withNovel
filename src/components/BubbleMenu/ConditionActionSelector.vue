<template>
  <Popover>
    <div class="relative">
      <PopoverButton
        class="flex items-center h-full gap-1 p-2 text-sm font-medium whitespace-nowrap text-stone-600 hover:bg-stone-100 active:bg-stone-200 focus:outline-none"
      >
      <span>{{ activeHighlightItem?.name }}</span>
      <!-- <span>조건</span> -->
        <ChevronDown class="w-4 h-4" />
      </PopoverButton>

      <PopoverPanel
        align="start"
        class="z-[99999] absolute my-1 flex max-h-80 w-48 flex-col overflow-hidden overflow-y-auto rounded border border-stone-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1"
        v-slot="{ close }"
      >
        <button
          v-for="(highlightColor, index) in ConditionActionItems"
          :key="index"
          @click="
            () => {
              editor.commands.unsetHighlight();
              highlightColor.name !== 'Default' &&
                editor.commands.setHighlight({ color: highlightColor.color });
              highlightColor.command();
              close();
            }
          "
          class="flex items-center justify-between px-2 py-1 text-sm rounded-sm text-stone-600 hover:bg-stone-100"
          type="button"
        >
          <div class="flex items-center space-x-2">
            <div
              class="px-1 py-px font-medium border rounded-sm border-stone-200"
              :style="{ backgroundColor: highlightColor.color }"
            >
            <component :is="highlightColor.icon" class="w-3 h-3" />
            </div>
            <span>{{ highlightColor.name }}</span>
          </div>

          <Check
            v-if="editor.isActive('highlight', { color: highlightColor.color })"
            class="w-4 h-4"
          />
        </button>
      </PopoverPanel>
    </div>
  </Popover>
</template>

<script setup lang="ts">
import { Editor } from "@tiptap/core";
import { Check, ChevronDown } from "lucide-vue-next";
import { PropType, computed } from "vue";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { TextIcon } from "lucide-vue-next";

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});
const ConditionActionItems = [
  {
    name: "Default",
    icon: TextIcon,
    color: "var(--novel-highlight-default)",
    isActive: () => props.editor.isActive("default"),
    command: () =>
      props.editor.chain().focus().unsetMarkCondition().run(),
  },
  {
    name: "조건",
    icon: TextIcon,
    color: "var(--novel-highlight-gray)",
    isActive: () => props.editor.isActive("conditionMark"),
    command: () =>
      props.editor.chain().focus().setMarkCondition({markCondition:'조건', color:'#ebebee'}).run(),
  },
  {
    name: "액션",
    icon: TextIcon,
    color: "var(--novel-highlight-yellow)",
    isActive: () => props.editor.isActive("actionMark"),
  },
];

// const activeColorItem = computed(() =>
//   TEXT_COLORS.find(({ color }) => props.editor.isActive("textStyle", { color }))
// );

const activeHighlightItem = computed(() =>
ConditionActionItems.filter((item) => item.isActive()).pop() ?? {
      name: "Multiple",
    }
);
</script>

<style scoped></style>
