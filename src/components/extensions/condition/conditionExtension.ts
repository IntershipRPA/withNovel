import { Editor, Range, Extension } from "@tiptap/core";
import { VueRenderer } from "@tiptap/vue-3";
import tippy from "tippy.js";
import Suggestion from "@tiptap/suggestion";
import {
  Cog,
} from "lucide-vue-next";
import { PluginKey } from '@tiptap/pm/state'
import { ref } from 'vue';
import ConditionTooltip from "../../tooltip/ConditionTooltip.vue";
import SlashCommandList from "./slashCommandList.vue";

const Command = Extension.create({
  name: "condition-command",
  addOptions() {
    return {
      suggestion: {
        pluginKey: new PluginKey('condition-command'),
        char: "/조건",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
});

// interface CommandProps {
//   editor: Editor;
//   range: Range;
// }

// export interface SuggestionItem {
//   title: string;
//   description: string;
//   icon: any;
// }

const renderItems = () => {
  let component: VueRenderer | null = null;
  let popup: any | null = null;
  // const editor = Command.options.editor;
  // const range = Command.options.range;
  // console.log("33", component?.ref.modalToggle);
  return {
    
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      localStorage.removeItem('temp');
      localStorage.removeItem('memo');
      
      localStorage.setItem('memo', '');
      component = new VueRenderer(ConditionTooltip, {
        props,
        editor: props.editor,
      });

      if (!props.clientRect) {
        return;
      }

      // @ts-ignore
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "right",
      });
    },

    onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
      component?.updateProps(props);

      popup &&
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === "Escape") {
        popup?.[0].hide();

        return true;
      }

      const onKeyDownResult = component?.ref?.onKeyDown(props.event);
      // modalToggle.value = component?.ref?.modalToggle;

      return onKeyDownResult;
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};

const ConditionCommand = Command.configure({
  suggestion: {
    render: renderItems,
  },
});

// export const modalToggle = ref(false);
export default ConditionCommand;