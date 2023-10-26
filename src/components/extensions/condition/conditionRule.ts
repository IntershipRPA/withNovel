import {
  Node,
  mergeAttributes
} from '@tiptap/core';
import { selectParentNode } from '@tiptap/pm/commands';
export interface ConditionRuleOptions {
  HTMLAttributes: Record<string, any>;
  settingAttrs: {
    fac: string;
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
      setConditionRule: (attrs: { fac: string; tag: string; temp: string; unit: string; range: string }) => ReturnType;
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
        // fac: 'defaultWhelk',
        fac: localStorage.getItem('fac'),

        tag: localStorage.getItem('tag'),
        temp: localStorage.getItem('temp'),
        unit: localStorage.getItem('unit'),
        range: localStorage.getItem('range'),
        memo: localStorage.getItem('memo'),

      }
    }
  },

  // 'novel__content' 에 attrs로 저장됨
  addAttributes() {

 //    console.log("here3", this.options.settingAttrs);

    return {
      fac: {
        default: this.options.settingAttrs.fac,
      },
      tag: {

        default: this.options.settingAttrs.tag,

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

      ['p', {
        class: `inline-block rounded-lg shadow-md bg-zinc-100 hover:bg-zinc-200 z-20 py-1 px-8 mb-2 mt-2 flex items-center `,
        // contenteditable: "false"
      }, 0],
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

      setConditionRule: (attrs) => ( { commands }: { commands: any } ) => {
        // attrs 객체로부터 필요한 속성 값을 추출
        // const { whelk, tag, temp, unit, range } = attrs;
        // console.log(whelk + "  " + tag + " " + temp + " " + unit + " " + range);
        // toggleNode 메소드를 호출하여 새로운 노드를 생성
        // 이 때 attrs 객체를 전달하여 새로운 노드의 초기 상태를 설정
        
        // console.log(this.name);
        return commands.setNode(this.name, attrs);


      },

      toggleCondition: () => ({ commands }) => {
        return commands.toggleWrap(this.name)
      },
      // 조건 삭제
      unsetCondition: ({ text, editor }: { text: string, editor: any }) => ({ chain }) => {
        return (
          chain()
            .focus()
            // .deleteNode("conditionRule")
            .toggleNode(this.name, 'paragraph')
            // .insertContentAt({
            //   from: editor.state.selection.$from.before(1),
            //   to: editor.state.selection.$from.before(1)
            // }, text)
            .run()
        );
      },
    }
  },

});
