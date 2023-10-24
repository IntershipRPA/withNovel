import {
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes,
} from '@tiptap/core'

export interface TagOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    tag: {
      /**
       * Set a tag mark
       */
      setTag: (attributes?: { tag: string }) => ReturnType,
      /**
       * Toggle a tag mark
       */
      toggleTag: (attributes?: { tag: string }) => ReturnType,
      /**
       * Unset a tag mark
       */
      unsetTag: () => ReturnType,
    }
  }
}

export const inputRegex = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))$/
export const pasteRegex = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))/g

export const TagMark = Mark.create<TagOptions>({
  name: 'tagMark',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {

    return {
      tag: {
        default: null,
        parseHTML: element => element.getAttribute('data-tag'),
        renderHTML: attributes => {
          if (!attributes.tag) {
            return {}
          }

          return {
            'data-tag': attributes.tag,
          }
        },
      },
      title: {
        default: '태그',
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'abbr',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['abbr', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setTag: attributes => ({ commands }) => {
        return commands.setMark(this.name, attributes)
      },
      toggleTag: attributes => ({ commands }) => {
        return commands.toggleMark(this.name, attributes)
      },
      unsetTag: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-t': () => this.editor.commands.toggleTag(), // ctrl+shift+'T'키를 단축키로 지정
    }
  },

  addInputRules() {
    return [
      markInputRule({
        find: inputRegex,
        type: this.type,
      }),
    ]
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: pasteRegex,
        type: this.type,
      }),
    ]
  },
})