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
  marks: '_',
  // defining: true,
  draggable: false,
  // draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      settingAttrs: {
        // whelk: 'defaultWhelk',
        whelk: localStorage.getItem('whelk'),
        tag: 'defaultTag',
        temp: 'defaultTemp',
        unit: 'defaultUnit',
        range: 'defaultRange',
        memo: 'defaultMemo',
      }
    }
  },

  // 'novel__content' 에 attrs로 저장됨
  addAttributes() {
    // console.log("here3", this.options.settingAttrs);
    return {
      whelk: {
        default: this.options.settingAttrs.whelk,
      },
      tag: {
        default: 'testTag',
      },
      temp: {
        default: this.options.settingAttrs.temp,
      },
      unit: {
        default: this.options.settingAttrs.unit,
      },
      range: {
        default: this.options.settingAttrs.range,
      },
      memo: {
        default: this.options.settingAttrs.memo,
      },
      styleCustom: {
        default: null,
        renderHTML: attributes => {
          return {
            class: `condition-tail cursor-pointer rounded-r-lg shadow-md bg-gray-400 hover:bg-gray-500 z-10 h-10 px-6 pl-7 my-2 text-sm text-white -ml-4 flex items-center min-w-max`,
            contenteditable: "false"
          }
        },
      },
    };
  },

  parseHTML() {
    return [
      { tag: 'condition' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    // console.trace();
    // console.log("here2", this.options.settingAttrs);
    return [
      'condition',
      { class: 'block flex items-end	' },
      // mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ['p', { class: `inline-block rounded-lg shadow-md bg-zinc-100 hover:bg-zinc-200 z-20 py-1 px-8 mb-2 mt-2 flex items-center`, contenteditable: "false" }, 0],
      ['span',
        {
          class: `condition-tail cursor-pointer rounded-r-lg shadow-md bg-gray-400 hover:bg-gray-500 z-10 h-10 px-6 pl-7 my-2 text-sm text-white -ml-4 flex items-center min-w-max`,
          contenteditable: "false"
        },
        // mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        '조건',
      ],
    ]
  },

  addCommands() {
    return {
      // setConditionRule: () => ({ commands }: { commands: any; }) => {
      //   return commands.toggleNode(this.name)
      // },
      setConditionRule: ({ attrs }: { attrs: any; }) => ({ commands }: { commands: any; }) => {
        // attrs 객체로부터 필요한 속성 값을 추출
        const { whelk, tag, temp, unit, range, memo } = attrs;
        this.options.settingAttrs.whelk = whelk;
        this.options.settingAttrs.tag = tag;
        this.options.settingAttrs.temp = temp;
        this.options.settingAttrs.unit = unit;
        this.options.settingAttrs.range = range;
        this.options.settingAttrs.memo = memo;
        // commands.insertContent(`${whelk} ${tag} ${temp}${unit} ${range} ${memo} `)
        // console.log("here1", this.options.settingAttrs);
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
