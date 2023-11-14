import {
    Mark,
    markInputRule,
    markPasteRule,
    mergeAttributes,
  } from '@tiptap/core'
  
  export interface UnitOptions {
    HTMLAttributes: Record<string, any>,
  }
  
  declare module '@tiptap/core' {
    interface Commands<ReturnType> {
      unit: {
        /**
         * Set a range mark
         */
        setUnit: (attributes?: { unit: string }) => ReturnType,
        /**
         * Toggle a range mark
         */
        toggleUnit: (attributes?: { unit: string }) => ReturnType,
        /**
         * Unset a range mark
         */
        unsetUnit: () => ReturnType,
      }
    }
  }
  
  export const inputRegex = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))$/
  export const pasteRegex = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))/g
  
  export const UnitMark = Mark.create<UnitOptions>({
    name: 'unitMark',
  
    addOptions() {
      return {
        HTMLAttributes: {},
      }
    },
  
    addAttributes() {
  
      return {
        unit: {
          default: null,
          parseHTML: element => element.getAttribute('data-unit'),
          renderHTML: attributes => {
            if (!attributes.unit) {
              return {}
            }
  
            return {
              'data-unit': attributes.unit,
            }
          },
        },
        title: {
          default: '단위',
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
        setUnit: attributes => ({ commands }) => {
  //        console.log("setFacility called", attributes);
          return commands.setMark(this.name, attributes)
        },
        toggleUnit: attributes => ({ commands }) => {
          return commands.toggleMark(this.name, attributes)
        },
        unsetUnit: () => ({ commands }) => {
          return commands.unsetMark(this.name)
        },
      }
    },
  
    addKeyboardShortcuts() {
      return {
        'Mod-Shift-u': () => this.editor.commands.toggleUnit(), // ctrl+shift+'u'키를 단축키로 지정
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