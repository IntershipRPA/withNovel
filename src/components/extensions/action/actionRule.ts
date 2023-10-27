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
      setActionRule: (attrs: { whelk: string; tag: string; temp: string; unit: string; range: string }) => ReturnType;
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
  marks: '_',
  defining: true,
  draggable: false,
  // draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      settingAttrs: {
        whelk: '',
        tag: '',
        temp: '',
        unit: '',
        range: '',
        memo: '',

      }
    }
  },

  // 'novel__content' 에 attrs로 저장됨
  addAttributes() {

    //    console.log("here3", this.options.settingAttrs);
   
       return {
         whelk: {
           default: this.options.settingAttrs.whelk,
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
      setActionRule: (attrs) => ({ commands }: { commands: any; }) => {
        // attrs 객체로부터 필요한 속성 값을 추출
        // const { whelk, tag, temp, unit, range } = attrs;
        // console.log(attrs);
        // toggleNode 메소드를 호출하여 새로운 노드를 생성
        // 이 때 attrs 객체를 전달하여 새로운 노드의 초기 상태를 설정
        
        // console.log(this.name);
        return commands.setNode(this.name, attrs);


      },
      
      toggleAction: () => ({ commands }) => {
        return commands.toggleWrap(this.name)
      },
      // 액션 삭제
      unsetAction: ({ text, editor }: { text: string, editor: any }) => ({ chain }) => {
        return (
          chain()
            .focus()
            // .deleteNode("actionRule")
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

  // addStorage() {
  //   return {
  //     zzzzztestzz: 'testetst',
  //   }
  // }
});
