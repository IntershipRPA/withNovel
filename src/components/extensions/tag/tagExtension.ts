import { Editor, Range, Extension } from "@tiptap/core";
import { VueRenderer } from "@tiptap/vue-3";
import tippy from "tippy.js";
import Suggestion from "@tiptap/suggestion";
import { Cog } from "lucide-vue-next";
import TagCommandList from "./tagCommandList.vue";
import axios from "axios";
import { PluginKey } from '@tiptap/pm/state'
import { useStorage } from "@vueuse/core";

const Command = Extension.create({
  name: "tag-command",
  addOptions() {
    return {
      suggestion: {
        pluginKey: new PluginKey('tag-command'),
        char: "$",
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
      title: "Winding Temp",
      searchTerms: ["온도", "윈딩", "권선온도계"],
      description: "권선온도계",
      icon: Cog,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .setTag({ tag: `Winding Temp`})
          .insertContent(`Winding Temp`)
          .unsetTag()
          .run();
      },
    },
    {
      title: "Press",
      searchTerms: ["가공", "압축", "프레스", "압력"],
      description: "압력",
      icon: Cog,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .setTag({tag: `Press`})
          .insertContent(`Press`)
          .unsetTag()
          .run();
      },
    },
    {
      title: "Status",
      searchTerms: ["값", "상태"],
      description: "상태",
      icon: Cog,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .setTag({tag: `Status`})
          .insertContent(`Status`)
          .unsetTag()
          .run();
      },
    },
    {
      title: "Air",
      searchTerms: ["에어", "공기"],
      description: "공기",
      icon: Cog,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .setTag({tag: `Air`})
          .insertContent(`Air`)
          .unsetTag()
          .run();
      },
    },
    {
      title: "Current Check",
      searchTerms: ["커런트", "현재상태"],
      description: "현재상태",
      icon: Cog,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .setTag({tag: `Current Check`})
          .insertContent(`Current Check`)
          .unsetTag()
          .run();
      },
    },    
    {
      title: "Operate",
      searchTerms: ["오퍼레이션", "운전"],
      description: "운전",
      icon: Cog,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .setTag({tag: `Operate`})
          .insertContent(`Operate`)
          .unsetTag()
          .run();
      },
    },
    {
      title: "Rotate",
      searchTerms: ["로테이트", "회전"],
      description: "회전",
      icon: Cog,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .setTag({tag: `Rotate`})
          .insertContent(`Rotate`)
          .unsetTag()
          .run();
      },
    },
    {
      title: "Binding",
      searchTerms: ["조임", "바인딩"],
      description: "바인딩",
      icon: Cog,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .setTag({tag: `Binding`})
          .insertContent(`Binding`)
          .unsetTag()
          .run();
      },
    },
    {
      title: "Control Valve",
      searchTerms: ["벨브", "컨트롤벨브"],
      description: "컨트롤벨브",
      icon: Cog,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .setTag({tag: `Control Valve`})
          .insertContent(`Control Valve`)
          .unsetTag()
          .run();
      },
    },
    {
      title: "PT-31",
      searchTerms: ["PT-31"],
      description: "PT-31",
      icon: Cog,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .setTag({tag: `PT-31`})
          .insertContent(`PT-31`)
          .unsetTag()
          .run();
      },
    },
    {
      title: "MCCB",
      searchTerms: ["MCCB"],
      description: "MCCB",
      icon: Cog,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .setTag({tag: `MCCB`})
          .insertContent(`MCCB`)
          .unsetTag()
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
      component = new VueRenderer(TagCommandList, {
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

const TagCommand = Command.configure({
  suggestion: {
    items: getSuggestionItems,
    render: renderItems,
  },
});

export default TagCommand;
