import {
  Node,
  mergeAttributes
} from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ConditionNodeVue from '../../node/condition/ConditionNode.vue'
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
      setConditionRule: (attrs: { fac: string; tag: string; temp: string; unit: string; range: string, memo: string }) => ReturnType;
      toggleCondition: () => ReturnType;
      unsetCondition: () => ReturnType;
    };
  }
}

export const ConditionRule = Node.create<ConditionRuleOptions>({
  name: 'conditionRule',
  group: 'block',
  // content: 'text*',
  content: 'inline*',
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
        // fac: localStorage.getItem('fac'),

        // tag: localStorage.getItem('tag'),
        // temp: localStorage.getItem('temp'),
        // unit: localStorage.getItem('unit'),
        // range: localStorage.getItem('range'),
        // memo: localStorage.getItem('memo'),

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
      // styleCustom: {
      //   default: null,
      //   renderHTML: attributes => {
      //     return {

      //       class: `condition-tail cursor-pointer rounded-r-lg shadow-md bg-gray-400 hover:bg-gray-500 z-10 h-10 px-6 pl-7 my-2 text-sm text-white -ml-4 flex items-center min-w-max`,

      //       contenteditable: "false"
      //     }
      //   },
      // },
    };
  },

  parseHTML() {
    return [
      { tag: 'condition-node' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'condition-node', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(ConditionNodeVue)
  },

  addCommands() {
    return {

      setConditionRule: (attrs) => ({ chain }: { chain: any }) => {
        let str = "";
        if (attrs.tag === "Status") {
          str = `${attrs.unit} ${attrs.memo}`;
        } else {
          str = `${attrs.temp}${attrs.unit} ${attrs.range} ${attrs.memo}`;
        }
      
        return (
        chain()
          .setNode(this.name, attrs)
          .setFacility({ facility: attrs.fac })
          .insertContent(attrs.fac)
          .unsetFacility()
          .insertContent('의 ')
          .setTag({ tag: attrs.tag })
          .insertContent(attrs.tag )
          .unsetTag()
          .insertContent('를 ')
          .insertContent(str)
          // .run()
        );
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
