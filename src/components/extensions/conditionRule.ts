import {
  Node,
  mergeAttributes
} from '@tiptap/core';
import { selectParentNode } from '@tiptap/pm/commands';
export interface ConditionRuleOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    conditionRule: {
      setConditionRule: () => ReturnType;
      toggleCondition: () => ReturnType;
      unsetCondition: () => ReturnType;
      setCondition: () => ReturnType;
    };
  }
}

export const ConditionRule = Node.create<ConditionRuleOptions>({
  name: 'conditionRule',
  group: 'block',
  content: 'text*',
  // content: 'block+',
  marks: '',
  defining: true,
  draggable: false,
  // draggable: true,

  // addAttributes() {
  //   return {
  //     styleCustom: {
  //       default: null,
  //       renderHTML: attributes => {
  //         return {
  //           class: `inline-block rounded-lg shadow-md bg-gray-100 hover:bg-gray-200 p-2 px-8 mb-2 mt-2`,
  //         }
  //       },
  //     },
  //   }
  // },

  parseHTML() {
    return [
      { tag: 'condition' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    // return ['condition', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
    return [
      'condition',
      { class: 'block flex items-center	' },
      ['p', { class: `inline-block rounded-lg shadow-md bg-zinc-100 hover:bg-zinc-200 z-10 h-10 px-8 mb-2 mt-2 flex items-center`}, 0],
      ['span', 
        {class: `cursor-pointer rounded-r-lg shadow-md bg-gray-400 hover:bg-gray-500 -z-4 h-10 px-5 pl-7 my-2 text-sm text-white -ml-4 flex items-center`,
         tag: `condition-tail`}, 
        '조건',
      ],
    ]
  },

  // 사용 예시
  // renderHTML({ HTMLAttributes }) {
  //   return [
  //     'pre', 
  //     ['code', HTMLAttributes, 'This is some content inside the code.'], 
  //     'This is some content after the code.', 
  //     ['p', 'This is a paragraph after the code.', 'More content between the paragraphs.'], 
  //     ['div', 'This is a div after the paragraphs.']
  //   ]
  // },

  addCommands() {
    return {
      setConditionRule: () => ({ commands }: { commands: any; }) => {
        return commands.toggleNode(this.name)
      },
      toggleCondition: () => ({ commands }) => {
        return commands.toggleWrap(this.name)
      },
      unsetCondition: () => ({ commands }) => {
        return commands.lift(this.name)
      },

      setCondition: () => ({ commands }: { commands: any; }) => {
        // commands.toggleNode(this.name)
        return commands.wrapIn(this.name)
      },
    }
  },
});
