import {
  Node,
  mergeAttributes
} from '@tiptap/core';
import { selectParentNode } from '@tiptap/pm/commands';
export interface ActionRuleOptions {
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
    actionRule: {
      setActionRule: () => ReturnType;
      toggleAction: () => ReturnType;
      unsetAction: () => ReturnType;
    };
  }
}

export const ActionRule = Node.create<ActionRuleOptions>({
  name: 'actionRule',
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
  //           class: `action-tail cursor-pointer rounded-r-lg shadow-md bg-gray-400 hover:bg-gray-500 -z-4 h-10 px-6 pl-7 my-2 text-sm text-white -ml-4 flex items-center`,
  //         }
  //       },
  //     },
  //   };
  // },

  parseHTML() {
    return [
      { tag: 'action' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    // console.trace();
    return [
      'action',
      { class: 'block flex items-center	' },
      // mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ['p', {
        class: `inline-block rounded-lg shadow-md bg-amber-100 hover:bg-amber-200 z-20 h-10 px-8 mb-2 mt-2 flex items-center `,
        // contenteditable: "false"
      }, 0],
      ['span',
        {
          class: `action-tail cursor-pointer rounded-r-lg shadow-md bg-amber-400 hover:bg-amber-500 z-10 h-10 px-6 pl-7 my-2 text-sm text-white -ml-4 flex items-center`,
          contenteditable: "false"
        },
        // mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        '액션',
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
      setActionRule: () => ({ commands }: { commands: any; }) => {
        return commands.toggleNode(this.name)
      },
      // setActionRule: ({ attrs }: { attrs: any; }) => ({ commands }: { commands: any; }) => {
      //   // attrs 객체로부터 필요한 속성 값을 추출
      //   const { whelk, tag, temp, unit, range, memo } = attrs;
      //   this.options.settingAttrs.whelk = whelk;
      //   this.options.settingAttrs.tag = tag;
      //   this.options.settingAttrs.temp = temp;
      //   this.options.settingAttrs.unit = unit;
      //   this.options.settingAttrs.range = range;
      //   this.options.settingAttrs.memo = memo;
      //   commands.insertContent(`${whelk} ${tag} ${temp}${unit} ${range} ${memo} `)

      //   return commands.toggleNode(this.name)
      // },
      toggleAction: () => ({ commands }) => {
        return commands.toggleWrap(this.name)
      },
      // 액션 삭제
      unsetAction: ({ text, editor }: { text: string, editor: any }) => ({ chain }) => {
        console.log("액션삭제 요청함")
        return (
          chain()
            .focus()
            .deleteNode("actionRule")
            .insertContentAt({
              from: editor.state.selection.$from.before(1),
              to: editor.state.selection.$from.before(1)
            }, text)
            .run()
        );
      },

    }
  },

  // addStorage() {
  //   return {
  //     zzzzztestzz: 'testetst',
  //   }
  // }
});
