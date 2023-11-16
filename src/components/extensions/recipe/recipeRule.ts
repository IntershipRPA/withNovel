import {
  Node,
  mergeAttributes
} from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import RecipeNodeVue from '../../nodeVue/recipe/RecipeNode.vue'

export interface RecipeRuleOptions {
  // HTMLAttributes: Record<string, any>;
  settingAttrs: {
    // count: number;
    recipeName: string,
    action: string,
    andCondition: string,
    orCondition: string,
    alarmMsg: string,
    alarmMsgTo: string,
    auto: boolean,
    activated: boolean,
  };
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    recipeRule: {
      setRecipeRule: (attrs: RecipeRuleOptions["settingAttrs"]) => ReturnType;
      toggleRecipe: () => ReturnType;
      unsetRecipe: () => ReturnType;
    };
  }
}

export const RecipeRule = Node.create<RecipeRuleOptions>({
  name: 'recipeRule',
  group: 'block',
  // content: 'text*',
  // content: 'block+',
  // marks: '_',
  // defining: true,
  // draggable: false,
  // draggable: true,
  // atom: true,
  // content: 'inline*',
  content: 'block*',

  addOptions() {
    return {
      // HTMLAttributes: {},
      settingAttrs: {
        // count: 0,
        // recipeName: '',
        // action: '',
        // andCondition: [],
        // orCondition: [],
        // alarmMsg: '',
        // alarmMsgTo: '',
        // auto: false,
        // activated: false,
      }
    }
  },

  addAttributes() {
    return {
      // count: {
      //   default: 0,
      // },
      recipeName: {
        default: this.options.settingAttrs.recipeName,
      },
      action: {
        default: this.options.settingAttrs.action,
      },
      andCondition: {
        default: this.options.settingAttrs.andCondition,
      },
      orCondition: {
        default: this.options.settingAttrs.orCondition,
      },
      alarmMsg: {
        default: this.options.settingAttrs.alarmMsg,
      },
      alarmMsgTo: {
        default: this.options.settingAttrs.alarmMsgTo,
      },
      auto: {
        default: this.options.settingAttrs.auto,
      },
      activated: {
        default: this.options.settingAttrs.activated,
      },

    }
  },

  parseHTML() {
    return [
      { tag: 'recipe-node' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['recipe-node', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(RecipeNodeVue)
  },

  addCommands() {
    return {

      setRecipeRule: (attrs) => ({ chain }: { chain: any }) => {
        //  console.log("attrs", attrs) 
        // or조건과 and조건의 string -> array
        function stringToArray(str, delimiter = '$') {
         
          if (typeof str === 'string' && str.length > 0) {
            // console.log("str : ", str)
            return str.split(delimiter);
          } else {
            // console.log('Invalid string', str);
            return [];
          }
          
        }

        const andConditions = stringToArray(attrs.andCondition);
        const orConditions = stringToArray(attrs.orCondition);

        // 추가할 배열
        const elementsToAdd = [];

        // and조건 추가
        if (andConditions.length > 0) {
          const andArrs = [
            { type: "hardBreak" },
            {
              type: 'text',
              text: '필수 충족 조건'
            },
          ];
          andArrs.push(...andConditions.flatMap((item) => [
            { type: "hardBreak" },
            {
              type: 'text',
              text: `▶ ${item}`
            }
          ]));
          elementsToAdd.push(...andArrs);
        }

        // or조건 추가
        if (orConditions.length > 0) {
          const orArrs = [
            // { type: "hardBreak" },
            { type: "hardBreak" },
            {
              type: 'text',
              text: '선택 조건'
            },
          ];

          orArrs.push(...orConditions.flatMap((item: string) =>
            [
              { type: "hardBreak" },
              {
                type: 'text',
                text: `▷ ${item}`
              },
            ]
          ))

          elementsToAdd.push(...orArrs);
        }

        return (
          chain()
            .toggleWrap(this.name, attrs)
            .insertContent(
              {
                type: 'heading',
                attrs: { level: 2 },
                content: [
                  {
                    type: 'text',
                    text: attrs.recipeName,
                  },
                ],
              })
            .insertContent(
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: `${attrs.action} 액션을 실행하기 위해 아래 조건들이 충족되어야 한다.`,
                  },
                ],
              })
            .insertContent(
              {
                type: 'paragraph',
                content: elementsToAdd,
              })
            .insertContent(
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: `조건 불일치시 알람 메세지로는 "${attrs.alarmMsg}"으로 설정하여`,
                  },
                  {
                    type: 'hardBreak'
                  },
                  {
                    type: 'text',
                    text: `담당자 ${attrs.alarmMsgTo}에게 알람을 전달한다.`,
                  },
                ],
              })
        );
      },

      toggleRecipe: () => ({ commands }) => {
        
        return commands.toggleWrap(this.name)
      },
      // 레시피 삭제
      unsetRecipe: ({ text, editor }: { text: string, editor: any }) => ({ chain }) => {
        return (
          chain()
            .focus()
            .deleteNode("recipeRule")
            .insertContentAt({
              from: editor.state.selection.$from.before(1),
              to: editor.state.selection.$from.before(1)
            }, text)
            .run()
        );
      },

    }
  },
});
