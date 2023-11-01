import { Editor, Range, Extension } from "@tiptap/core";
import { VueRenderer } from "@tiptap/vue-3";
import tippy from "tippy.js";
import Suggestion from "@tiptap/suggestion";
import SlashExtension2 from "./test.vue";
import { PluginKey } from 'prosemirror-state';
import { Cog } from "lucide-vue-next";
import axios from 'axios';
import { useStorage } from "@vueuse/core";

const Command = Extension.create({
  
  addOptions() {
    return {
      suggestion: {
        pluginKey: new PluginKey("2-command"),
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
    ];
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
//단일 매개변수로 객체를 받으며, 해당 객체에는 query라는 문자열 타입의 프로퍼티
const getSuggestionItems = async ({ query }: { query: string }) => {
  try{
    const apiKey = '2VUsy8DXgU7UltYDHQ+drH9T6gf4M5cWgEzh67DXRJwjfzWrQFnEGl6To3ODDZzLbXf+Pm/Z7awxIaIlRALQAQ==';
    const apiUrl = 'http://api.odcloud.kr/api/15072603/v1/uddi:c470f155-2d53-4feb-87cd-ff010c6a315d'
  
    const response = await axios.get(apiUrl,{
      params:{
        serviceKey: apiKey,
        page: 1,
        perPage: 10
      }
    });
    console.log(`데이터 : ${JSON.stringify(response)}`);
    //로컬, 세션에 저장할 배열
    let titleList : String[] = [];
    let searchTermsList : String[] = [];
    let objList: any[] = [];
    const getData = response.data.data.map((item: any) => {

      let detail = item.기인물명상세;
      let code = item.기인물명상세코드.toString();
      let obj = {code,detail};
      titleList.push(detail);
      searchTermsList.push(code);
      objList.push(obj);

      return{
        title: item.기인물명상세,
        description: item.기인물명,
        searchTerms: [item.기인물명상세코드.toString()],
        icon: Cog,
        // -- Test start
        command: ({ editor, range }: CommandProps) => {
          editor
            .chain() //작업 시작
            .focus() //초점을 다시 편집기로 가져오므로 사용자는 계속해서 입력할 수 있음
            .deleteRange(range) // range에 해당하는 텍스트나 노드 삭제
            .toggleNode("paragraph", "paragraph") // paragraph타입의 노드 존제하면 해당 노드 제거, 없으면 추가
            .insertContent(`${item.기인물명상세}`) // 데이터 추가
            .run(); // 이전에 연결된 모든 작업 실행
          // -- Test end
        },
      };
    });
    // localStorage, sessionStorage은 js문법
    //localstorage에 저장
    useStorage('title', titleList);
//    localStorage.setItem('title', JSON.stringify(titleList));
    useStorage('searchTerms', searchTermsList);
    useStorage('obj', objList);
    
    
    //localstorage값 가져오기
    //TypeScript에서는 기본적으로 변수의 타입에 null 또는 undefined를 허용하지 않아 if()문으로 null확인
    // console.log(`localstorage값 : ${localStorage.getItem("title")}`);
    let titleData = localStorage.getItem("title");
    let titleData2;
    if(titleData !== null){
      titleData2 = JSON.parse(titleData); // JSON.parse(titleData) JavaScript 객체 반환
    }
    console.log(`title 확인 : ${titleData2[2]}`);
    for(let i = 0; i < titleData2.length; i++){
      console.log(titleData2[i]);
    }

    let objData = localStorage.getItem("obj");
    let objData2;
    if(objData !== null){
      objData2 = JSON.parse(objData);
    }
    console.log(`확인1 : ${JSON.stringify(objData2[1])}`);
    console.log(`확인2 : ${JSON.stringify(objData2[1].code)}`);
    console.log(`확인3 : ${JSON.stringify(objData2[1].detail)}`);
    
    const data = objData2.map((item: any) =>{
      console.log(item);
      console.log(item.code);
    });
   
    
    //Session에 저장
    sessionStorage.setItem('title', JSON.stringify(titleList));
    sessionStorage.setItem('searchTerms', JSON.stringify(searchTermsList));
    sessionStorage.setItem('obj', JSON.stringify(objList));

    //sessionStorage값 가져오기
    console.log(`sessionStorage값 : ${sessionStorage.getItem("title")}`);

    // query에 대한 필터링
    /*
      TypeScript는 명시적인 타입 어노테이션을 통해 변수 또는 매개변수의 타입을 지정하는 것을 권장
      콜백 함수에 대한 매개변수 item의 타입을 명시적으로 지정
    */
    const filteredData = getData.filter((item: { title: string; description: string; searchTerms: string[]; }) => {
      //query 변수의 타입이 문자열인지 확인
      if (typeof query === "string" && query.length > 0) {
        const search = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search) ||
          (item.searchTerms && item.searchTerms.some((term: string) => term.includes(search)))
        );
      }
      return true;
    });
    return filteredData;
  }catch(error){
    console.log(`error : ${error}`);
  }
};

const renderItems = () => {
  let component: VueRenderer | null = null;
  let popup: any | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new VueRenderer(SlashExtension2, {
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

const SlashCommand2 = Command.configure({
  suggestion: {
    items: getSuggestionItems, // items 고정
    render: renderItems,
  },
});










export default SlashCommand2;
