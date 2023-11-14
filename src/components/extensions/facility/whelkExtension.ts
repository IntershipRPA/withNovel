import { Editor, Range, Extension } from "@tiptap/core";
import { VueRenderer } from "@tiptap/vue-3";
import tippy from "tippy.js";
import Suggestion from "@tiptap/suggestion";
import {
  Cog,
} from "lucide-vue-next";
import WhelkCommandList from "./whelkCommandList.vue";
import axios from "axios";
import { PluginKey } from '@tiptap/pm/state'

const Command = Extension.create({
  name: "whelk-command",
  addOptions() {
    return {
      suggestion: {
        pluginKey: new PluginKey('whelk-command'),
        char: "@",
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

interface CommandProps {
  editor: Editor;
  range: Range;
}

export interface SuggestionItem {
  title: string;
  description: string;
  icon: any;
}

const getSuggestionItems = async ({ query }: { query: string }) => {
  return [
    {
      title: "Comp Motor",
      description: "콤프레샤",
      searchTerms: ["콤프","모터", "컴프레서", "압축기", "콤프레샤"],
      icon: Cog,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .setFacility({facility: "Comp Motor"})
          .insertContent("Comp Motor")
          .unsetFacility()
          .run();
      },
    },
    {
      title: "Receiver Tank",
      searchTerms: ["리시버", "탱크", "압축공기"],
      description: "리시버 탱크",
      icon: Cog,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .setFacility({facility: "Receiver Tank"})
          .insertContent("Receiver Tank")
          .unsetFacility()
          .run();
      },
    },
    {
      title: "After Cooler",
      searchTerms: ["애프터","쿨러","냉각"],
      description: "후방냉각기",
      icon: Cog,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .setFacility({facility: "After Cooler"})
          .insertContent("After Cooler")
          .unsetFacility()
          .run();
      },
    },
    {
      title: "Air Compressor",
      searchTerms: ["에어","콤프레샤","공기"],
      description: "에어컴프레서",
      icon: Cog,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .setFacility({facility: "Air Compressor"})
          .insertContent("Air Compressor")
          .unsetFacility()
          .run();
      },
    },
    {
      title: "Oil Separator",
      searchTerms: ["오일","세퍼레이터", "기름"],
      description: "유수 분리기",
      icon: Cog,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .setFacility({facility: "Oil Separator"})
          .insertContent("Oil Separator")
          .unsetFacility()
          .run();
      },
    },
  ].filter((item) => {
    if (typeof query === "string" && query.length > 0) {
      const search = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(search) ||
        (item.searchTerms &&
          item.searchTerms.some((term: string) => term.includes(search)))
      );
    }
    return true;
  });
};

const renderItems = () => {
  let component: VueRenderer | null = null;
  let popup: any | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new VueRenderer(WhelkCommandList, {
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
        placement: "bottom-start",
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

      return component?.ref?.onKeyDown(props.event);
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};

const WhelkCommand = Command.configure({
  suggestion: {
    items: getSuggestionItems,
    render: renderItems,
  },
});

export default WhelkCommand;
