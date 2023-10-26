<template>
  <EditorContent
  :editor="editor" class="text-gray-950 max-h-24 overflow-y-auto hover:overscroll-contain "/>
</template>

<script setup lang="ts">
import { Editor, EditorContent, useEditor } from '@tiptap/vue-3'
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from "@tiptap/starter-kit";
import { useStorage } from '@vueuse/core';
import { ref } from "vue";


const props = defineProps({
  placeholder: {
    type: String,
    default: '추가 메모를 작성하세요 …',
    // required: true,
  },
  storageKey: {
    type: String,
    required: true,
  },
})
// const memo = ref<string | null>(localStorage.getItem(props.storageKey)) ?? ''; // 메모

const editor = useEditor({
  // content: memo.value,
  extensions: [
    StarterKit.configure({
      bulletList: false,
      orderedList: false,
      listItem: false,
      blockquote: false,
      codeBlock: false,
      code: false,
      horizontalRule: false,
      dropcursor: false,
      gapcursor: false,
      heading: false,
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
  ],

  onUpdate: (e) => {
    const selection = e.editor.state.selection;

    // 기존 값 삭제
    localStorage.removeItem(props.storageKey);
      // 커서가 있는 줄을 찾기
      const lineStart = selection.$from.before(1) // 현재 블록(줄) 시작 위치
      const lineEnd = selection.$from.after(1)   // 현재 블록(줄) 종료 위치

      // 해당 범위에 있는 텍스트를 가져옴
      let lineText = '';
      e.editor.state.doc.nodesBetween(lineStart, lineEnd, node => {
        if (node.isText) {
          lineText += node.text
        }
        return true;
      })

      // memo.value = lineText;
      // emits('contentChanged', memo.value);
      useStorage(props.storageKey, lineText);
  },
});

// const emits = defineEmits(['contentChanged']);


// const onContentChanged = () => {
//   emits('contentChanged', memo.value);
// };
</script>

<style lang="scss">
/* Basic editor styles */
.tiptap {
  >*+* {
    margin-top: 0.75em;
  }
}
</style>