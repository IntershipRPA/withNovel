import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import Component from './Component.vue'

export default Node.create({
  name: 'vueComponent',

  group: 'block',

  // atom: true,

  content: 'inline*',

  addAttributes() {
    return {
      count: {
        default: 0,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'vue-componen',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['vue-component', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(Component)
  },
})