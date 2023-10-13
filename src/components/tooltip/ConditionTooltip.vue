<template>
  <div class="condition-tooltip">
    <div ref="commandListContainer"
      class="z-50 h-auto max-h-[330px] w-42 overflow-y-auto rounded-md border border-stone-200 bg-white px-4 py-2 shadow-md transition-all text-xs text-stone-500">
      <p>Enter ↲</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from "vue";
import { Editor, Range } from "@tiptap/core";
import { SuggestionItem } from "./slashExtension";
import LoadingCircle from "../icons/loadingCircle.vue";
import { useCompletion } from "ai/vue";
import { getPrevText } from "../../lib/editor";

const modalToggle = ref(false);

// const modalToggle = inject<string>('modalToggle')

const props = defineProps({
  items: {
    type: Array as PropType<SuggestionItem[]>,
    required: true,
  },
  command: {
    type: Function,
    required: true,
  },
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
  range: {
    type: Object as PropType<Range>,
    required: true,
  },
});

const selectedIndex = ref(0);

const { complete, isLoading } = useCompletion({
  id: "novel",
  api: "/api/generate",
  onResponse: (_) => {
    props.editor.chain().focus().deleteRange(props.range).run();
  },
  onFinish: (_prompt, completion) => {
    // highlight the generated text
    props.editor.commands.setTextSelection({
      from: props.range.from,
      to: props.range.from + completion.length,
    });
  },
  onError: (e) => {
    console.error(e);
  },
});

const commandListContainer = ref<HTMLDivElement>();

const navigationKeys = ["Space", "Enter"];
function onKeyDown(e: KeyboardEvent) {
  const editor = props.editor;
  const range = props.range;
  if (navigationKeys.includes(e.key)) {
    e.preventDefault();
    if (e.key === "Enter") {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .run();
      modalToggle.value = true;
      return true;
    }
    // if (e.key === "Space") {
    //   editor
    //     .chain()
    //     .focus()
    //     .deleteRange(range)
    //     .run();
    //   modalToggle.value = true;
    //   return true;
    // }
    return false;
  }
}

defineExpose({
  onKeyDown,
  modalToggle
});
</script>
