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
  // console.log('query:', query); // 검색어 출력
  try {
    // API 인증 키 (API Key) 설정
    const apiKey = '2VUsy8DXgU7UltYDHQ+drH9T6gf4M5cWgEzh67DXRJwjfzWrQFnEGl6To3ODDZzLbXf+Pm/Z7awxIaIlRALQAQ==';
    const apiEndpoint = 'http://api.odcloud.kr/api/15072603/v1/uddi:c470f155-2d53-4feb-87cd-ff010c6a315d';

    // axios
    const response = await axios.get(apiEndpoint, {
      params: {
        serviceKey: apiKey,
        page: 1,
        perPage: 85
      },
    });

    // 데이터를 가져왔으면 배열에 추가합니다.
    const dynamicData = response.data.data.map((item: any) => {
      // console.log(typeof item.기인물명상세코드.toString());
      return {
        title: item.기인물명상세,
        description: item.기인물명,
        searchTerms: [item.기인물명상세코드.toString()],
        icon: Cog,
        command: ({ editor, range }: CommandProps) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .toggleNode("paragraph", "paragraph")
            .setHighlight({ color: '#ffc5e4' })
            .insertContent(`${item.기인물명상세}`)
            .unsetHighlight()
            .run();
        },
      };
    });

    // query에 따른 필터링 작업을 수행합니다.
    const filteredData = dynamicData.filter((item) => {
      if (typeof query === "string" && query.length > 0) {
        const search = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          (item.searchTerms &&
            item.searchTerms.some((term: string) => term.includes(search)))
        );
      }
      return true;
    });

    return filteredData;
  } catch (error) {
    console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
    return [];
  }
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
