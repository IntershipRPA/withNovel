import {
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes,
} from '@tiptap/core'

export interface MarkConditionOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    markCondition: {
      /**
       * Set a markCondition mark
       */
      setMarkCondition: (attributes?: { markCondition: string }) => ReturnType,
      /**
       * Toggle a markCondition mark
       */
      toggleMarkCondition: (attributes?: { markCondition: string }) => ReturnType,
      /**
       * Unset a markCondition mark
       */
      unsetMarkCondition: () => ReturnType,
    }
  }
}

export const inputRegex = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))$/
export const pasteRegex = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))/g

export const MarkCondition = Mark.create<MarkConditionOptions>({
  name: 'markCondition',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {

    return {
      markCondition: {
        default: null,
        parseHTML: element => element.getAttribute('data-markCondition'),
        renderHTML: attributes => {
          if (!attributes.markCondition) {
            return {}
          }

          return {
            'data-markCondition': attributes.markCondition,
          }
        },
      },
      color: {
        default: null,
        parseHTML: element => element.getAttribute('data-color') || element.style.backgroundColor,
        renderHTML: attributes => {
          if (!attributes.color) {
            return {}
          }

          return {
            'data-color': attributes.color,
            style: `background-color: ${attributes.color}; color: inherit`,
          }
        },
      },

    }
  },

  parseHTML() {
    return [
      {
        tag: 'span',
      },
    ]
  },

  // renderHTML({ HTMLAttributes }) {
  //   return [
  //     'span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  // },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      [
        'span', {
          class: 'condition-tail cursor-pointer rounded-r-lg shadow-md bg-gray-400 hover:bg-gray-500 z-10 h-10 px-6 pl-7 my-2 text-sm text-white -ml-4 flex items-center min-w-max',
          contenteditable: "false"
        },
        '조건-꼬리표'
      ]
    ];
  },  

  addCommands() {
    return {
      setMarkCondition: attributes => ({ commands }) => {
        console.log("setMarkCondition called", attributes);
        return commands.setMark(this.name, attributes)
      },
      toggleMarkCondition: attributes => ({ commands }) => {
        return commands.toggleMark(this.name, attributes)
      },
      unsetMarkCondition: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Alt-Shift-c': () => this.editor.commands.toggleMarkCondition(), // ctrl+shift+'F'키를 단축키로 지정
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