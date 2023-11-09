import {
  Node,
  mergeAttributes
} from '@tiptap/core';
// import { selectParentNode } from '@tiptap/pm/commands';
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ActionNodeVue from '../../nodeVue/action/ActionNode.vue'
export interface ActionRuleOptions {
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
    actionRule: {
      setActionRule: (attrs:  ActionRuleOptions["settingAttrs"] ) => ReturnType;
      toggleAction: () => ReturnType;
      unsetAction: () => ReturnType;
    };
  }
}

export const ActionRule = Node.create<ActionRuleOptions>({
  name: 'actionRule',
  group: 'block',
  // content: 'text*',
  content: 'inline*',
  // content: 'block+',
  marks: '_',
  defining: true,
  draggable: false,
  // draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      settingAttrs: {
        // whelk: '',
        // tag: '',
        // temp: '',
        // unit: '',
        // range: '',
        // memo: '',

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
        //  styleCustom: {
        //    default: null,
        //    renderHTML: attributes => {
        //      return {
   
        //        class: `condition-tail cursor-pointer rounded-r-lg shadow-md bg-gray-400 hover:bg-gray-500 z-10 h-10 px-6 pl-7 my-2 text-sm text-white -ml-4 flex items-center min-w-max`,
   
        //        contenteditable: "false"
        //      }
        //    },
        //  },
       };
     },

  parseHTML() {
    return [
      { tag: 'action-node' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'action-node', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(ActionNodeVue)
  },

  addCommands() {
    return {
      setActionRule: (attrs) => ({ chain }: { chain: any; }) => {
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
