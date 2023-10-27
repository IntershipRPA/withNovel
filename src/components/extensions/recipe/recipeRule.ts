import {
  Node,
  mergeAttributes
} from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import RecipeNodeVue from '../../node/recipe/RecipeNode.vue'

export interface RecipeRuleOptions {
  // HTMLAttributes: Record<string, any>;
  settingAttrs: {
    count: number;
    // recipeName: string,
    // action: string,
    // andCondition: string,
    // orCondition: string,
    // alarmMsg: string,
    // alarmMsgTo: string,
    // auto: boolean,
    // activated: boolean,
  };
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    recipeRule: {
      setRecipeRule: (attrs) => ReturnType;
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
  content: 'inline*',
  // content: 'block*',

  addOptions() {
    return {
      // HTMLAttributes: {},
      settingAttrs: {
        count: 0,
        // name: '',
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
      count: {
        default: 0,
      },
      // recipeName: {
      //   default: null,
      //   parseHTML: element => element.getAttribute('recipeName'),
      //   renderHTML: attributes => {
      //     if (!attributes.recipeName) {
      //       return {}
      //     }
      //     else {
      //       this.options.settingAttrs.recipeName = attributes.recipeName;
      //     }
      //     return {
      //       'recipeName': attributes.recipeName,
      //     }
      //   },
      // },
      // action: {
      //   default: null,
      //   parseHTML: element => element.getAttribute('action'),
      //   renderHTML: attributes => {
      //     if (!attributes.action) {
      //       return {}
      //     }
      //     else {
      //       this.options.settingAttrs.action = attributes.action;
      //     }
      //     return {
      //       'action': attributes.action,
      //     }
      //   },
      // },
      // andCondition: {
      //   default: null,
      //   parseHTML: element => element.getAttribute('andCondition'),
      //   renderHTML: attributes => {
      //     if (!attributes.andCondition) {
      //       this.options.settingAttrs.andCondition = [];
      //       return {}
      //     }
      //     else {
      //       this.options.settingAttrs.andCondition = attributes.andCondition;
      //       // console.log("AND옵션셋팅", this.options.settingAttrs.andCondition)
      //     }
      //     return {
      //       'andCondition': attributes.andCondition,
      //     }
      //   },
      // },
      // orCondition: {
      //   default: null,
      //   parseHTML: element => element.getAttribute('orCondition'),
      //   renderHTML: attributes => {
      //     if (!attributes.orCondition) {
      //       this.options.settingAttrs.orCondition = [];
      //       return {}
      //     }
      //     else {
      //       this.options.settingAttrs.orCondition = attributes.orCondition;
      //       // console.log("OR옵션셋팅", this.options.settingAttrs.orCondition)
      //     }
      //     return {
      //       'orCondition': attributes.orCondition,
      //     }
      //   },
      // },
      // alarmMsg: {
      //   default: null,
      //   parseHTML: element => element.getAttribute('alarmMsg'),
      //   renderHTML: attributes => {
      //     if (!attributes.alarmMsg) {
      //       return {}
      //     }
      //     else {
      //       this.options.settingAttrs.alarmMsg = attributes.alarmMsg;
      //     }
      //     return {
      //       'alarmMsg': attributes.alarmMsg,
      //     }
      //   },
      // },
      // alarmMsgTo: {
      //   default: null,
      //   parseHTML: element => element.getAttribute('alarmMsgTo'),
      //   renderHTML: attributes => {
      //     if (!attributes.alarmMsgTo) {
      //       return {}
      //     }
      //     else {
      //       this.options.settingAttrs.alarmMsgTo = attributes.alarmMsgTo;
      //     }
      //     return {
      //       'alarmMsgTo': attributes.alarmMsgTo,
      //     }
      //   },
      // },
      // auto: {
      //   default: null,
      //   parseHTML: element => element.getAttribute('auto'),
      //   renderHTML: attributes => {
      //     if (!attributes.auto) {
      //       return {}
      //     }
      //     else {
      //       this.options.settingAttrs.auto = attributes.auto;
      //     }
      //     return {
      //       'auto': attributes.auto,
      //     }
      //   },
      // },
      // activated: {
      //   default: null,
      //   parseHTML: element => element.getAttribute('activated'),
      //   renderHTML: attributes => {
      //     if (!attributes.activated) {
      //       return {}
      //     }
      //     else {
      //       this.options.settingAttrs.activated = attributes.activated;
      //     }
      //     return {
      //       'activated': attributes.activated,
      //     }
      //   },
      // },

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

  // renderHTML({ HTMLAttributes }) {
  //   // console.trace();
  //   // Vue 컴포넌트를 HTML로 렌더링
  //   // const vueComponent = Vue.extend(ElementChecked); // VueComponentName은 실제 컴포넌트 이름으로 대체
  //   // const componentHTML = new vueComponent().$mount().$el.outerHTML;

  //   // or조건과 and조건의 string -> array
  //   function stringToArray(str, delimiter = '$') {
  //     if (typeof str === 'string') {
  //       return str.split(delimiter);
  //     } else {
  //       // console.log('Invalid string', str);
  //       return [];
  //     }
  //   }
  //   // console.log("앤드조건",this.options.settingAttrs.andCondition)
  //   // console.log("올조건",this.options.settingAttrs.orCondition)
  //   // console.log("hehehehehe")

  //   const andConditions = stringToArray(this.options.settingAttrs.andCondition);
  //   const orConditions = stringToArray(this.options.settingAttrs.orCondition);

  //   // console.log("AND",andConditions)
  //   // console.log("OR",orConditions)




  //   // 레시피 내용 배열
  //   const customArray = [
  //     // 0번째
  //     'div',
  //     // 1번째
  //     {
  //       class: `select-text rounded-lg shadow-md bg-green-100 hover:bg-green-200 z-20 px-8 mb-2 mt-2 py-5 items-center `,
  //       // contenteditable: "true"
  //     },
  //     // 2번째 - 레시피 이름
  //     [
  //       'div', { class: 'recipe-name mb-10 text-2xl text-left font-semibold' }, `${this.options.settingAttrs.recipeName}`
  //     ],
  //     // 3번째 - 액션
  //     [
  //       'div', { class: 'action  mb-4' }, `${this.options.settingAttrs.action} 액션을 실행하기 위해 아래 조건들이 충족되어야 한다.`
  //     ],
  //     // >> 이 사이에 AND조건과 OR조건이 들어간다. <<
  //     [
  //       'div', { class: 'alarm-msg  mt-10' }, `조건 불일치시 알람 메세지로는 "${this.options.settingAttrs.alarmMsg}"으로 설정하여`
  //     ],
  //     [
  //       'div', { class: 'alarm-msg-to ' }, `${this.options.settingAttrs.alarmMsgTo} 담당자에게 알람을 전달한다.`
  //     ],
  //   ];

  //   // 클래스 이름에 따라 위치 찾기
  //   function findIndexAndCondition(arr: any[], targetString: string): number {
  //     const index = arr.findIndex((element) => {
  //       if (Array.isArray(element) && element[1] && element[1].class) {
  //         return element[1].class.includes(targetString);
  //       }
  //       return false;
  //     });

  //     return index;
  //   }

  //   // 추가할 배열
  //   const elementsToAdd = [];

  //   // and조건 추가
  //   if (andConditions.length > 0) {
  //     const andArrs = [
  //       [
  //         'div', { class: 'ml-8' }, 'AND조건'
  //       ],
  //     ];

  //     andArrs.push(...andConditions.map((item: string) => {
  //       return (
  //         [
  //           'div', { class: 'and-condition ml-20' }, 
  //           ['span', { class: '-ml-6' }, '▶ '],
  //           ['span', { class: '' }, `${item}`]
  //         ])
  //     }))

  //     elementsToAdd.push(...andArrs);
  //   }

  //   // or조건 추가
  //   if (orConditions.length > 0) {
  //     const orArrs = [
  //       [
  //         'div', { class: 'ml-8' }, 'OR조건'
  //       ],
  //     ];

  //     orArrs.push(...orConditions.map((item: string) => {
  //       return (
  //         [
  //           'div',
  //           { class: 'or-condition ml-20' },
  //           ['span', { class: '-ml-6' }, '▷ '],
  //           ['span', { class: '' }, `${item}`]
  //         ])
  //     }))

  //     elementsToAdd.push(...orArrs);
  //   }



  //   // 추가할 배열을 삽입하고 customArray 변경하기
  //   const index = findIndexAndCondition(customArray, 'alarm-msg');
  //   if (index !== -1) {
  //     customArray.splice(index, 0, ...elementsToAdd);
  //   } else {
  //     console.error("customArray 안에 요소 찾을 수 없음")
  //   }


  //   return [
  //     'recipe',
  //     { class: 'block ' },

  //     // ['p', {
  //     //   class: `inline-block rounded-lg shadow-md bg-green-100 hover:bg-green-200 z-20 h-10 px-8 mb-2 mt-2 flex items-center `,
  //     //   // contenteditable: "false"
  //     // }, 0],

  //     ['div', {
  //       class: 'block flex items-end'
  //     },
  //       // // customArray의 내용

  //       // ['div', {
  //       //   class: `rounded-lg shadow-md bg-green-100 hover:bg-green-200 z-20 px-8 mb-2 mt-2 py-5 items-center `,
  //       //   // contenteditable: "false"
  //       // }, [
  //       //     'div', { class: 'recipe-name mb-5 text-2xl text-left font-semibold' }, `${this.options.settingAttrs.recipeName}`
  //       //   ],
  //       //   [
  //       //     'div', { class: 'action  mb-2' }, `${this.options.settingAttrs.action} 액션을 실행하기 위해 아래 조건들이 충족되어야 한다.`
  //       //   ],
  //       //   [
  //       //     // 'div', { class: 'and-condition ml-10' }, this.options.settingAttrs.andCondition
  //       //     'div', { class: 'and-condition ml-10' }, 'testtest'
  //       //   ],
  //       //   [
  //       //     'div', { class: 'ml-10' }, '또는,'
  //       //   ],
  //       //   [
  //       //     // 'div', { class: 'or-condition ml-20' }, this.options.settingAttrs.orCondition
  //       //     'div', { class: 'or-condition ml-20' }, 'testtest'
  //       //   ],
  //       //   [
  //       //     'div', { class: 'alarm-msg  mt-2' }, `조건 불일치시 알람 메세지로는 "${this.options.settingAttrs.alarmMsg}"으로 설정하여`
  //       //   ],
  //       //   [
  //       //     'div', { class: 'alarm-msg-to ' }, `${this.options.settingAttrs.alarmMsgTo} 담당자에게 알람을 전달한다.`
  //       //   ],
  //       // ],
  //       customArray,
  //       ['span',
  //         {
  //           class: `recipe-tail cursor-pointer rounded-r-lg shadow-md bg-green-400 hover:bg-green-500 z-10 h-10 px-6 pl-7 my-2 text-sm text-white -ml-4 flex items-center min-w-max`,
  //           contenteditable: "false"
  //         },
  //         // mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
  //         '레시피',
  //       ],
  //     ],

  //     ['div',
  //       {
  //         class: 'block flex mt-4 '
  //       },
  //       ['span',
  //         {
  //           class: `recipe-btn-activated cursor-pointer rounded-lg shadow-md bg-gray-400 hover:bg-gray-500 z-10 h-10 px-6 pl-7 my-2 text-sm text-white flex items-center min-w-max`,
  //           contenteditable: "false",
  //         },
  //         // mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
  //         `활성화 ${String(this.options.settingAttrs.activated)}`,
  //       ],
  //       ['span',
  //         {
  //           class: `recipe-btn-auto cursor-pointer rounded-lg shadow-md bg-gray-400 hover:bg-gray-500 z-10 h-10 px-6 pl-7 my-2 text-sm text-white ml-4 flex items-center min-w-max`,
  //           contenteditable: "false",
  //         },
  //         // mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
  //         `자동화 ${String(this.options.settingAttrs.auto)}`,
  //       ],
  //       ['span',
  //         {
  //           class: `recipe-btn-run cursor-pointer rounded-lg shadow-md bg-red-400 hover:bg-red-500 z-10 h-10 px-6 pl-7 my-2 text-sm text-white ml-4 flex items-center min-w-max`,
  //           contenteditable: "false"
  //         },
  //         // mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
  //         '수동으로 레시피 실행',
  //       ],
  //     ]
  //   ]
  // },

  addCommands() {
    return {
      setRecipeRule: (attrs) => ({ commands }: { commands: any; }) => {
        return commands.setNode(this.name, attrs);
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
