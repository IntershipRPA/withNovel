<template>
  <editor-content :editor="editor" class="text-gray-950 max-h-20 overflow-y-auto hover:overscroll-contain"/>
</template>

<script>
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { Editor, EditorContent } from '@tiptap/vue-3'
import Placeholder from '@tiptap/extension-placeholder'

export default {
  components: {
    EditorContent,
  },

  data() {
    return {
      editor: null,
    }
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        Placeholder.configure({
          // Use a placeholder:
          placeholder: '추가 메모를 작성하세요 …',
          // Use different placeholders depending on the node type:
          // placeholder: ({ node }) => {
          //   if (node.type.name === 'heading') {
          //     return 'What’s the title?'
          //   }

          //   return 'Can you add some further context?'
          // },
        }),
      ],
      // content: `
      //   <p text-gray-400>
      //     메모를 작성하세요.
      //   </p>
      // `,
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>

<style lang="scss">
/* Basic editor styles */
.tiptap {
  > * + * {
    margin-top: 0.75em;
  }
}
</style>