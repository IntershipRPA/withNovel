import {
  Node,
  mergeAttributes
} from '@tiptap/core';
import { selectParentNode } from '@tiptap/pm/commands';
export interface ConditionRuleOptions {
  HTMLAttributes: Record<string, any>;
  settingAttrs: {
    whelk: string;
    tag: string;
    temp: string;
    unit: string;
    range: string;
    memo: string;
  };
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    conditionRule: {
      setConditionRule: () => ReturnType;
      toggleCondition: () => ReturnType;
      unsetCondition: () => ReturnType;
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

  // addOptions() {
  //   return {
  //     HTMLAttributes: {},
  //     settingAttrs: {
  //       whelk: 'defaultWhelk',
  //       tag: 'defaultTag',
  //       temp: 'defaultTemp',
  //       unit: 'defaultUnit',
  //       range: 'defaultRange',
  //       memo: 'defaultMemo',
  //     }
  //   }
  // },

  // addAttributes() {
  //   return {
  //     whelk: {
  //       default: this.options.settingAttrs.whelk,
  //     },
  //     tag: {
  //       default: this.options.settingAttrs.tag,
  //     },
  //     temp: {
  //       default: this.options.settingAttrs.temp,
  //     },
  //     unit: {
  //       default: this.options.settingAttrs.unit,
  //     },
  //     range: {
  //       default: this.options.settingAttrs.range,
  //     },
  //     memo: {
  //       default: this.options.settingAttrs.memo,
  //     },
  //     styleCustom: {
  //       default: null,
  //       renderHTML: attributes => {
  //         return {
  //           class: `condition-tail cursor-pointer rounded-r-lg shadow-md bg-gray-400 hover:bg-gray-500 -z-4 h-10 px-6 pl-7 my-2 text-sm text-white -ml-4 flex items-center`,
  //         }
  //       },
  //     },
  //   };
  // },

  parseHTML() {
    return [
      { tag: 'condition' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    // console.trace();
    return [
      'condition',
      { class: 'block flex items-end	' },
      // mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ['p', { class: `inline-block rounded-lg shadow-md bg-zinc-100 hover:bg-zinc-200 z-10 py-1 px-8 mb-2 mt-2 flex items-center` }, 0],
      ['span',
        {
          class: `condition-tail cursor-pointer rounded-r-lg shadow-md bg-gray-400 hover:bg-gray-500 -z-4 h-10 px-6 pl-7 my-2 text-sm text-white -ml-4 flex items-center min-w-max`,
          contenteditable: "false"
        },
        // mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
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
    }
  },

});
