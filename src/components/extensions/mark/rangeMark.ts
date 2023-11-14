import {
    Mark,
    markInputRule,
    markPasteRule,
    mergeAttributes,
  } from '@tiptap/core'
  
  export interface RangeOptions {
    HTMLAttributes: Record<string, any>,
  }
  
  declare module '@tiptap/core' {
    interface Commands<ReturnType> {
      range: {
        /**
         * Set a range mark
         */
        setRange: (attributes?: { range: string }) => ReturnType,
        /**
         * Toggle a range mark
         */
        toggleRange: (attributes?: { range: string }) => ReturnType,
        /**
         * Unset a range mark
         */
        unsetRange: () => ReturnType,
      }
    }
  }
  
  export const inputRegex = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))$/
  export const pasteRegex = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))/g
  
  export const RangeMark = Mark.create<RangeOptions>({
    name: 'rangeMark',
  
    addOptions() {
      return {
        HTMLAttributes: {},
      }
    },
  
    addAttributes() {
        
      return {
        range: {
          default: null,
          parseHTML: element => element.getAttribute('data-range'),
          renderHTML: attributes => {
            if (!attributes.range) {
              return {}
            }
  
            return {
              'data-range': attributes.range,
            }
          },
        },
        title: {
          default: '범위',
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
        setRange: attributes => ({ commands }) => {
          return commands.setMark(this.name, attributes)
        },
        toggleRange: attributes => ({ commands }) => {
          return commands.toggleMark(this.name, attributes)
        },
        unsetRange: () => ({ commands }) => {
          return commands.unsetMark(this.name)
        },
      }
    },
  
    addKeyboardShortcuts() {
      return {
        'Mod-Shift-r': () => this.editor.commands.toggleRange(), // ctrl+shift+'F'키를 단축키로 지정
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