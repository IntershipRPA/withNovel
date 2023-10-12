<template>
  <div v-if="items.length > 0" ref="commandListContainer"
    class="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-stone-200 bg-white px-1 py-2 shadow-md transition-all">
    <button v-for="(item, index) in items"
      class="flex items-center w-full px-2 py-1 space-x-2 text-sm text-left rounded-md text-stone-900 hover:bg-stone-100"
      :class="index === selectedIndex ? 'bg-stone-100 text-stone-900' : ''" :key="index" @click="selectItem(index)">
      <div class="flex items-center justify-center w-10 h-10 bg-white border rounded-md border-stone-200">
        <LoadingCircle v-if="item.title === 'Continue writing' && isLoading" />
        <!-- 아이콘 -->
        <!-- <component v-else :is="item.icon" size="18" /> -->
        <p>태그</p>
      </div>
      <div>
        <!-- 이름 -->
        <p class="font-medium">{{ item.title }}</p>
        <!-- 설명 -->
        <p class="text-xs text-stone-500">{{ item.description }}</p>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from "vue";
import { Editor, Range } from "@tiptap/core";
import { SuggestionItem } from "./whelkExtension"; // type 지정
import LoadingCircle from "../icons/loadingCircle.vue";
import { useCompletion } from "ai/vue";
import { getPrevText } from "../../lib/editor";
import { useStorage } from "@vueuse/core";
// import axios from "axios";

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
console.log(`selectedIndex : ${JSON.stringify(selectedIndex.value)}`);
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
const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];

function onKeyDown(e: KeyboardEvent) {
  if (navigationKeys.includes(e.key)) {
    e.preventDefault();
    if (e.key === "ArrowUp") {
      selectedIndex.value =
        (selectedIndex.value + props.items.length - 1) % props.items.length;
      scrollToSelected();
      return true;
    }
    if (e.key === "ArrowDown") {
      selectedIndex.value = (selectedIndex.value + 1) % props.items.length;

      scrollToSelected();
      return true;
    }
    if (e.key === "Enter") {
      selectItem(selectedIndex.value);
      return true;
    }
    return false;
  }
}
console.log('tagComm Before watch');
watch(
  () => props.items,
  () => {
    console.log("watch");
    selectedIndex.value = 0;
  }
  
);
console.log('tagComm After watch');

defineExpose({
  onKeyDown,
});

function selectItem(index: number) {
  const item = props.items[index];
  console.log(`테그 : ${item.title}`);
  // 로컬스토리지에 테그 선택한거 저장
  useStorage('tag', item.title);

  if (item) {
    if (item.title === "Continue writing") {
      if (isLoading.value) return;
      complete(
        getPrevText(props.editor, {
          chars: 5000,
          offset: 1,
        })
      );
    } else {
      props.command(item);
    }
  }
}

function updateScrollView(container: HTMLElement, item: HTMLElement) {
  const containerHeight = container.offsetHeight;
  const itemHeight = item ? item.offsetHeight : 0;

  const top = item.offsetTop;
  const bottom = top + itemHeight;

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
}

function scrollToSelected() {
  const container = commandListContainer.value;
  const item = container?.children[selectedIndex.value] as HTMLElement;

  if (container && item) {
    updateScrollView(container, item);
  }
}
</script>
