import {
  Mark,
  markInputRule,
  markPasteRule,
  mergeAttributes,
} from '@tiptap/core'

export interface FacilityOptions {
  HTMLAttributes: Record<string, any>,
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    facility: {
      /**
       * Set a facility mark
       */
      setFacility: (attributes?: { facility: string }) => ReturnType,
      /**
       * Toggle a facility mark
       */
      toggleFacility: (attributes?: { facility: string }) => ReturnType,
      /**
       * Unset a facility mark
       */
      unsetFacility: () => ReturnType,
    }
  }
}

export const inputRegex = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))$/
export const pasteRegex = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))/g

export const FacilityMark = Mark.create<FacilityOptions>({
  name: 'facilityMark',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {

    return {
      facility: {
        default: null,
        parseHTML: element => element.getAttribute('data-facility'),
        renderHTML: attributes => {
          if (!attributes.facility) {
            return {}
          }

          return {
            'data-facility': attributes.facility,
          }
        },
      },
      title: {
        default: '설비',
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
      setFacility: attributes => ({ commands }) => {
        console.log("setFacility called", attributes);
        return commands.setMark(this.name, attributes)
      },
      toggleFacility: attributes => ({ commands }) => {
        return commands.toggleMark(this.name, attributes)
      },
      unsetFacility: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-f': () => this.editor.commands.toggleFacility(), // ctrl+shift+'F'키를 단축키로 지정
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