import StarterKit from "@tiptap/starter-kit";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TiptapUnderline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Markdown } from "tiptap-markdown";
import Highlight from "@tiptap/extension-highlight";
import { InputRule, Mark, markInputRule } from "@tiptap/core";
import SlashCommand from "./slashExtension";
import WhelkCommand from "./facility/whelkExtension";
import TagCommand from "./tag/tagExtension";
import ConditionCommand from "./condition/conditionExtension";
import { ConditionRule } from './condition/conditionRule';
import ActionCommand from "./action/actionExtension";
import { ActionRule } from './action/actionRule';
import RecipeCommand from './recipe/recipeExtension';
import { RecipeRule } from './recipe/recipeRule';
import { FacilityMark } from './facility/facilityMark';
import { TagMark } from './tag/tagMark';
import { RangeMark } from './mark/rangeMark';
import { UnitMark } from './mark/unitMark';
import { MarkCondition } from './markCondition/markCondition';

export const defaultExtensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: "list-disc list-outside leading-3 -mt-2",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal list-outside leading-3 -mt-2",
      },
    },
    listItem: {
      HTMLAttributes: {
        class: "leading-normal -mb-2",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: "border-l-4 border-stone-700",
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class:
          "rounded-sm bg-stone-100 p-5 font-mono font-medium text-stone-800",
      },
    },
    code: {
      HTMLAttributes: {
        class:
          "rounded bg-stone-200 px-1.5 py-1 font-mono font-medium text-stone-900",
        spellcheck: "false",
      },
    },
    horizontalRule: false,
    dropcursor: {
      color: "#DBEAFE",
      width: 4,
    },
    gapcursor: false,
    // heading: false,
  }),
  // patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
  HorizontalRule.extend({
    addInputRules() {
      return [
        new InputRule({
          find: /^(?:---|—-|___\s|\*\*\*\s)$/,
          handler: ({ state, range }) => {
            const attributes = {};

            const { tr } = state;
            const start = range.from;
            let end = range.to;

            tr.insert(start - 1, this.type.create(attributes)).delete(
              tr.mapping.map(start),
              tr.mapping.map(end)
            );
          },
        }),
      ];
    },
  }).configure({
    HTMLAttributes: {
      class: "mt-4 mb-6 border-t border-stone-300",
    },
  }),
  TiptapLink.configure({
    HTMLAttributes: {
      class:
        "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
    },
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return `Heading ${node.attrs.level}`;
      }
      return "설비기기는 '@'를 누르고, 태그 입력은 '$'을 눌러 작성하세요. 조건은 '/조건', 액션은 '/액션', 레시피는 '/레시피' 입력 후 엔터를 눌러 작성하세요.";
    },
    includeChildren: true,
  }),
  TiptapUnderline,
  TextStyle,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: "not-prose pl-2",
    },
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: "flex items-start my-4",
    },
    nested: true,
  }),
  Markdown.configure({
    html: false,
    transformCopiedText: true,
  }),
  SlashCommand,
  WhelkCommand,
  TagCommand,
  ConditionCommand,
    /**
  * addInputRules에 의한 규칙 생성
  */
  // ConditionRule.extend({
  //   addInputRules() {
  //     return [
  //       new InputRule({
  //         find: /^(?:~~|~,)$/,
  //         handler: ({ state, range }) => {
  //           // 입력 규칙이 일치할 때 실행될 동작 정의
  //           const { tr } = state;
  //           const start = range.from;
  //           let end = range.to;
  //           tr.delete(
  //             tr.mapping.map(start),
  //             tr.mapping.map(end)
  //           );
  //           // 패턴과 일치하는 텍스트를 삭제
  //           tr.replaceWith(start, end, []);
  //           // modalToggle.value = true;
  //           return null; // 규칙 처리 완료
  //         },
  //       }),
  //     ];
  //   },
  // }).configure({
  //   HTMLAttributes: {
  //     class: "mt-4 mb-6 border-t border-stone-300",
  //   },
  // }),
  ConditionRule,
  ActionCommand,
  ActionRule,
  RecipeCommand,
  RecipeRule,
  MarkCondition,
  FacilityMark,
  TagMark,
  RangeMark,
  UnitMark,
];