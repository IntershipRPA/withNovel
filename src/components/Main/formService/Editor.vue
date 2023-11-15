<template>
  <!-- @click는 클릭 이벤트가 발생시 editor객체가 존재 할 경우만
       chanin() 메서드 실행
       class="className"은 동적으로 클래스를 설정하기 위한 바인딩
       -> className 변수에 저장된 클래스 이름을 해당 요소의 클래스로 설정-->
  <div ref="childDiv" @click="editor?.chain().focus().run()" :class="className">
    <BubbleMenu v-if="editor" :editor="editor" />
    <!-- 조건부 렌더링
        editor 객체가 존재하는 경우에만 해당 컴포넌트 렌더링 -->
    <!-- <EditorContent @click='handleEditorContentClick' :editor="editor" /> -->
    <EditorContent :editor="editor" />
    <!-- 현재의 editor 객체를 전달 -->
    <!-- 모달 -->
    <SimpleModal v-if="isModalOpen" :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { watchEffect, type PropType, ref, watch, onUpdated, onMounted, nextTick, computed } from "vue";
import { useEditor, EditorContent, JSONContent, Extension } from "@tiptap/vue-3";
import { EditorProps } from "@tiptap/pm/view";
import { Editor as EditorClass } from "@tiptap/core";
import { useStorage, useDebounceFn } from "@vueuse/core";
import { useCompletion } from "ai/vue";

import { defaultEditorContent2 } from "../../../lib/default-content2";
import { defaultEditorProps } from "../../../lib/props";
import { getPrevText } from "../../../lib/editor";
import { defaultExtensions } from "../../extensions/formExtensions";
import BubbleMenu from "../../BubbleMenu/index.vue";
import SimpleModal from "../../Modal/SimpleModal.vue";
import { modalToggle } from "../extensions/condition/conditionExtension"

// 모달 설정
// const showModal = modalToggle;
// const closeModal = () => {
//   showModal.value = false;
// };
// const isCondition = ref(false);

import { useModalStore } from '../../../stores/modal';
import { AlarmCheck } from 'lucide-vue-next';
import { View } from 'lucide-vue-next';

// 모달 설정
const modalStore = useModalStore(); // 스토어 인스턴스 생성

const isModalOpen = computed(() => modalStore.isModalOpen);
// const isCondition = computed(() => modalStore.isCondition);

// const openModal = () => {
//   modalStore.openModal(); // 모달 열기
// };

// const closeModal = () => {
//   modalStore.closeModal(); // 모달 닫기
// };




const props = defineProps({

  // 완성(자동완성) API의 엔드포인트 URL
  completionApi: {
    type: String,
    default: "/api/generate",
  },

  // 편집기의 CSS 클래스 이름
  className: {
    type: String,
    default:
      "relative min-h-[500px] min-w-[700px] w-full mx-auto max-w-screen-lg border-stone-200 bg-white p-12 px-8 sm:mb-[calc(5vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg",
  },

  // 에디터기본 값으로, JSON 형식으로 저장
  defaultValue: {
    type: Object as PropType<JSONContent>,
    // default: {
    //   type: "doc",
    //   content: [
    //     {
    //       type: "heading",
    //       attrs: { level: 2 },
    //       content: [{ type: "text", text: "Novel을 소개합니다" }],
    //     },]
    // }
    default: () => {
      return defaultEditorContent2;
    },
  },

  // Tiptap 편집기에 추가할 확장 기능
  extensions: {
    type: Array as PropType<Extension[]>,
    default: [],
  },

  // Tiptap 편집기에 적용할 속성들
  editorProps: {
    type: Object as PropType<EditorProps>,
    default: {},
  },

  // 편집기가 업데이트될 때마다 호출되는 콜백 함수
  onUpdate: {
    type: Function as PropType<(editor?: EditorClass) => void | Promise<void>>,
    default: () => { },
  },

  // 편집기가 업데이트될 때마다 호출되지만 정의된 디바운스 기간 이후에만 호출되는 콜백 함수입니다.
  onDebouncedUpdate: {
    type: Function as PropType<(editor?: EditorClass) => void | Promise<void>>,
    default: () => { },
  },

  // onDebouncedUpdate 콜백을 디바운스하는 기간(밀리초)입니다.
  debounceDuration: {
    type: Number,
    default: 150,
  },

  // 로컬 스토리지에서 사용할 key값
  storageKey: {
    type: String,
    default: "novel__content",
  },
});

// Window.localStorage에 데이터를 저장
// defaultValue : 에디터기본 값으로, JSON 형식으로 저장
const content = useStorage(props.storageKey, props.defaultValue);

/* useDebounceFn hook을 사용하여 에디터의 업데이트를 디바운스
   디바운싱은 주어진 시간 동안 발생하는 여러 이벤트를 하나로 그룹화하는 기술
   ex)사용자가 입력 필드에 빠르게 문자를 입력할 때, 
      각 문자 입력마다 이벤트 핸들러가 실행되지 않고 일정 시간 동안 대기한 후 
      마지막 이벤트만 처리하도록 할 수 있습니다.
*/
/*
  에디터가 업데이트될 때마다 해당 내용을 JSON으로 변환하고, 
  부모 컴포넌트에 알리는 역할을 합니다. 
  하지만 모든 업데이트에 대해 즉시 알리는 것이 아니라, 
  지정된 딜레이(props.debounceDuration) 후에 한번만 알립니다.
*/
const debouncedUpdate = useDebounceFn(({ editor }) => {
  const json = editor.getJSON();
  content.value = json;
  // onDebouncedUpdate : 편집기가 업데이트될 때마다 호출되지만 정의된 디바운스 기간 이후에만 호출되는 콜백 함수입니다.
  props.onDebouncedUpdate(editor);
}, props.debounceDuration); // debounceDuration : onDebouncedUpdate 콜백을 디바운스하는 기간

// 초기화: useEditor hook를 사용하여 Tiptap 에디터를 생성하고 초기화
const editor = useEditor({ // useEditor : 전체 편집기와 관련된 메소드 및 상태 정보를 제공하는 Hook
  // extensions : Tiptap 편집기에 추가할 확장 기능
  extensions: [...defaultExtensions, ...props.extensions],
  // defaultExtensions : components/extensions/index.ts에 있는 배열?

  // Tiptap 편집기에 적용할 속성들
  editorProps: {
    ...defaultEditorProps,
    ...props.editorProps,
  },
  // onUpdate : 편집기가 업데이트될 때마다 호출되는 콜백 함수
  onUpdate: (e) => {
    const selection = e.editor.state.selection;

    // getPrevText 함수는 주어진 범위 내의 텍스트를 반환
    const lastTwo = getPrevText(e.editor, {
      chars: 4, // 범위 설정
    });

    // // if()문 안하면 함수가 계속 실행되 빈 값이 저장됨
    // if (lastTwo === " /조건" && !isLoading.value) {
    //   // 설비, 태그 조건 바꿀 때 해당 목록 가져오기
    //   // 기존 값 삭제
    //   localStorage.removeItem('change');
    //   // 커서가 있는 줄을 찾기
    //   const lineStart = selection.$from.before(1) // 현재 블록(줄) 시작 위치
    //   const lineEnd = selection.$from.after(1)   // 현재 블록(줄) 종료 위치

    //   // 해당 범위에 있는 텍스트를 가져옴
    //   let lineText = '';
    //   e.editor.state.doc.nodesBetween(lineStart, lineEnd, node => {
    //     if (node.isText) {
    //       lineText += node.text
    //     }
    //     return true;
    //   })

    //   let changText = lineText.split(' '); // 공백 단위 쪼개기
    //   let str = changText.pop(); // '/조건' 제거

    //   let changText2 = changText[0] + " " + changText[1];
    //   let changText3 = '';
    //   if (changText.length == 4) {
    //     changText3 = changText[2] + " " + changText[3];
    //   } else {
    //     changText3 = changText[2];
    //   }
    //   // 한글 제거
    //   let change = [changText2.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "").replace(/["']/g, ""), changText3.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "").replace(/["']/g, "")];

    //   // 로컬에 저장
    //   useStorage('change', change);
    // }




    // 사용자가 문서 끝에 "++"를 입력하면 완성 API를 실행
    if (lastTwo === "++" && !isLoading.value) {
      e.editor.commands.deleteRange({
        from: selection.from - 2,
        to: selection.from,
      });
      complete(
        // getPrevText 함수는 주어진 범위 내의 텍스트를 반환
        getPrevText(e.editor, {
          chars: 5000,
        })
      );
    } else {
      props.onUpdate(e.editor);
      debouncedUpdate(e);
    }
  },
  autofocus: "start",
});

/*
  useCompletion hook을 사용하여 텍스트 완성 기능을 설정
  - complete: 주어진 프롬프트에 대한 완성을 요청하는 함수
  - completion: 현재 완성된 텍스트
  - isLoading: 완성 요청이 진행 중인지 여부를 나타내는 불리언 값
  - stop: 현재 진행 중인 완성 요청을 중단하는 함수
*/
// AI가 생성한 완료 텍스트가 에디터에 삽입된 후 그 부분을 자동으로 선택하도록 하는 역할
// OpenAI의 useCompletion 훅
const { complete, completion, isLoading, stop } = useCompletion({
  id: "novel-vue",  //이 훅의 인스턴스를 식별하는 데 사용되는 문자열
  api: props.completionApi, // 완성 요청을 보낼 API의 엔드포인트 URL, 여기서는 부모 컴포넌트로부터 전달받은 props를 사용
  /* 
    onFinish
    완성 요청이 성공적으로 마무리됐을 때 호출되는 콜백 함수
    이 함수에서는 에디터의 선택 영역을 변경하여 새로운 완성된 텍스트가 삽입될 위치를 지정
  */
  onFinish: (_prompt, completion) => {
    editor.value?.commands.setTextSelection({
      from: editor.value.state.selection.from - completion.length,
      to: editor.value.state.selection.from,
    });
  },
  onError: (err) => {
    console.error(err);
  },
});


/* 
  watch 함수를 사용하여 completion.value의 변경을 감시
  함수는 첫 번째 인자로 주어진 값이 변경될 때마다 두 번째 인자로 주어진 콜백 함수를 호출 
  여기서 첫 번째 인자는 completion.value = 완성된 텍스트
*/
watch(
  () => completion.value,
  (newCompletion, oldCompletion) => {
    /*
      새로 완성된 텍스트(newCompletion)와 이전에 완성된 텍스트(oldCompletion)를 비교 
      이 둘 사이의 차이점(diff)을 계산 
      이 차이점은 새로 추가된 부분으로, 
      이전 완성 텍스트 길이부터 시작하는 부분
    */
    const diff = newCompletion?.slice(oldCompletion?.length);

    if (diff) {
      // 새로 완성된 텍스트를 로컬 스토리지에 저장
      useStorage('newText', diff);
      // 차이점이 있다면, 에디터에 그 내용을 삽입
      editor.value?.commands.insertContent(diff);

    }

  }
);






/* 
  'Escape' 키나 'Command+Z' 조합을 눌렀을 때 자동 완성 기능을 중지하고, 
   만약 'Escape' 키가 눌렸다면 자동 완성으로 채워진 부분을 삭제한 후 
   "++" 문자열을 다시 입력하는 역할
*/
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape" || (e.metaKey && e.key === "z")) {
    stop();
    if (e.key === "Escape") {
      // 에디터의 현재 선택 영역에서 완성된 내용의 길이만큼 뒤로 이동한 위치부터 현재 선택 영역까지의 범위를 삭제
      editor.value?.commands.deleteRange({
        from: editor.value.state.selection.from - completion.value.length,
        to: editor.value.state.selection.from,
      });
    }
    editor.value?.commands.insertContent("++"); //에디터에 "++" 문자열을 삽입
  }
};

// 사용자가 마우스를 클릭했을 때 자동 완성 기능을 일시 중지하고, 사용자에게 계속할 것인지 물어보는 역할
const mousedownHandler = (e: MouseEvent) => {
  //이벤트의 기본 동작과 이벤트의 전파를 중지
  e.preventDefault();
  e.stopPropagation();
  stop();
  if (window.confirm("AI writing paused. Continue?")) {
    complete(editor.value?.getText() || "");
  }
};

// 자동 완성 요청의 진행 상황에 따라 키보드와 마우스 이벤트 핸들러를 동적으로 추가하거나 제거하는 역할
watch(
  () => isLoading.value, // isLoading.value : 자동 완성 요청이 진행 중인지 여부를 나타내는 불리언 값
  (isLoading) => {
    if (isLoading) {
      document.addEventListener("keydown", onKeyDown);
      window.addEventListener("mousedown", mousedownHandler);
    } else {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    }
  }
);


// 마운트 시 로컬 저장소에서 편집기 콘텐츠를 로드합니다.
const hydrated = ref(false); // 에디터에 내용이 성공적으로 설정되었는지를 나타내는 플래그
const checkHydrated = ref(false); // 에디터 내용이 렌더링 된 이후(두번째 마운트)를 감지하는 값
// 인자로 주어진 함수 내에서 사용된 반응성 값을 감시하고, 그 값이 변경될 때마다 해당 함수를 다시 실행
// 주어진 컨텐츠로 에디터를 초기화하는 역할
watchEffect(() => {
  // !hydrated.value 에디터에 내용이 설정되지 않았다
  if (editor.value && content.value && !hydrated.value) {
    editor.value.commands.setContent(content.value);
    hydrated.value = true;
  } else if (editor.value && content.value && hydrated.value) {
    checkHydrated.value = true;
  }
})



// // 꼬리표 클릭이벤트
// const conditionTailElement = ref<Element[]>([]);
// const actionTailElement = ref<Element[]>([]);
// const recipeTailElement = ref<Element[]>([]);

// const recipeBtnActivated = ref<Element[]>([]);
// const recipeBtnAuto = ref<Element[]>([]);
// const recipeBtnRun = ref<Element[]>([]);

// // 초기 렌더링에 두번째 마운트 이후를 감지 + 업데이트에 따른 함수 실행
// watchEffect(() => {
//   if (checkHydrated.value === true) {
//     const conElements = document.querySelectorAll('.condition-btn-setting') as Element[];
//     const actElements = document.querySelectorAll('.action-btn-setting') as Element[];
//     const recElements = document.querySelectorAll('.recipe-btn-setting') as Element[];

//     const recBtnActElements = document.querySelectorAll('.recipe-btn-activated') as Element[];
//     const recBtnAutoElements = document.querySelectorAll('.recipe-btn-auto') as Element[];
//     const recBtnRunElements = document.querySelectorAll('.recipe-btn-run') as Element[];

//     conditionTailElement.value = conElements;
//     actionTailElement.value = actElements;
//     recipeTailElement.value = recElements;

//     recipeBtnActivated.value = recBtnActElements;
//     recipeBtnAuto.value = recBtnAutoElements;
//     recipeBtnRun.value = recBtnRunElements;


//     // 조건
//     if (conditionTailElement.value.length !== 0) {
//       // console.log("elements detected");
//       conditionTailElement.value.forEach((element: Element) => {
//         element.addEventListener("click", handleClickConditionTail); // 클릭 이벤트 핸들러 연결
//       });
//     }

//     // 액션
//     if (actionTailElement.value.length !== 0) {
//       actionTailElement.value.forEach((element: Element) => {
//         element.addEventListener("click", handleClickActionTail);
//       });
//     }

//     // 레시피
//     if (recipeTailElement.value.length !== 0) {
//       recipeTailElement.value.forEach((element: Element) => {
//         // // 이전에 연결된 이벤트 리스너를 제거하고 추가
//         // element.removeEventListener("click", handleClickRecipeTail);
//         element.addEventListener("click", handleClickRecipeTail);
//       });
//     }

//     // 레시피 활성화 버튼
//     if (recipeBtnActivated.value.length !== 0) {
//       recipeBtnActivated.value.forEach((element: Element) => {
//         element.addEventListener("click", handleClickRecBtnAct);
//       });
//     }

//     // 레시피 자동화 버튼
//     if (recipeBtnAuto.value.length !== 0) {
//       recipeBtnAuto.value.forEach((element: Element) => {
//         element.addEventListener("click", handleClickRecBtnAuto);
//       });
//     }

//     // 레시피 실행 버튼
//     if (recipeBtnRun.value.length !== 0) {
//       recipeBtnRun.value.forEach((element: Element) => {
//         element.addEventListener("click", handleClickRecBtnRun);
//       });
//     }

//   }
// })

// // 업데이트 감지
// onUpdated(() => {
//   if (checkHydrated.value === true) {
//     const conElements = document.querySelectorAll('.condition-btn-setting') as Element[];
//     const actElements = document.querySelectorAll('.action-btn-setting') as Element[];
//     const recElements = document.querySelectorAll('.recipe-btn-setting') as Element[];

//     const recBtnActElements = document.querySelectorAll('.recipe-btn-activated') as Element[];
//     const recBtnAutoElements = document.querySelectorAll('.recipe-btn-auto') as Element[];
//     const recBtnRunElements = document.querySelectorAll('.recipe-btn-run') as Element[];

//     conditionTailElement.value = conElements;
//     actionTailElement.value = actElements;
//     recipeTailElement.value = recElements;

//     recipeBtnActivated.value = recBtnActElements;
//     recipeBtnAuto.value = recBtnAutoElements;
//     recipeBtnRun.value = recBtnRunElements;
//   }
// })

// // 조건 꼬리표 클릭
// function handleClickConditionTail(event) {
// //   //클릭한 곳 데이터 가져오기

//   // localStorage.setItem('memo', JSON.parse(JSON.stringify(getNovelContentFromClick().attrs.memo)));
//   // localStorage.setItem('temp', JSON.parse(JSON.stringify(getNovelContentFromClick().attrs.temp)));
//   // localStorage.setItem('range', JSON.parse(JSON.stringify(getNovelContentFromClick().attrs.range)));
//   // localStorage.setItem('unit', JSON.parse(JSON.stringify(getNovelContentFromClick().attrs.unit)));

//   modalStore.isCondition = true;
//   openModal();
// }



// // 액션 꼬리표 클릭
// function handleClickActionTail(event) {
//   // localStorage.setItem('memo', JSON.parse(JSON.stringify(getNovelContentFromClick().attrs.memo)));
//   // localStorage.setItem('temp', JSON.parse(JSON.stringify(getNovelContentFromClick().attrs.temp)));
//   // localStorage.setItem('range', JSON.parse(JSON.stringify(getNovelContentFromClick().attrs.range)));
//   // localStorage.setItem('unit', JSON.parse(JSON.stringify(getNovelContentFromClick().attrs.unit)));
//   modalStore.isAction = true;
//   openModal();
// }

// // 레시피 꼬리표 클릭
// function handleClickRecipeTail(event) {
//   // console.log(getNovelContentFromClick())
//   modalStore.isRecipe = true;
//   openModal();
// }

// // 레시피 활성화 버튼 클릭
// function handleClickRecBtnAct (event) {
//   console.log("활성화 클릭", getNovelContentFromClick()?.attrs?.activated)
//   const getAttrs = getNovelContentFromClick()?.attrs;
//   getAttrs.activated = !getNovelContentFromClick()?.attrs?.activated;

//   // editor?.value?.commands.setRecipeRule(getAttrs)
// };

// // 레시피 자동화 버튼 클릭
// function handleClickRecBtnAuto (event) {
//   console.log("자동화 클릭", getNovelContentFromClick()?.attrs?.auto)
//   const getAttrs = getNovelContentFromClick()?.attrs;
//   getAttrs.auto = !getNovelContentFromClick()?.attrs?.auto;

// };

// // 레시피 수동으로 실행 버튼 클릭
// function handleClickRecBtnRun (event) {
//   console.log("실행 클릭")
//   alert("레시피 조건 불일치로 담당자에게 알람을 발생시켰습니다.")
// };




// // local Storage에 "novel__content" 키로 저장된 값을 가져오는 함수
// const getNovelContentFromClick = () => {
//   // // click 이벤트의 e 객체를 통해 클릭한 요소에 대한 정보에 접근할 수 있습니다.
//   // const clickedElement = e.target;
//   // console.log(clickedElement);
//   // const offset = calculateOffset(e, targetElement);
//   // const position = editor.value?.view.posAtDOM(clickedElement, 0);

//   const location = editor.value?.state.selection.$anchor; // 커서 위치 정보 가져오기
//   // const node = position?.node; // 해당 위치의 노드 가져오기
//   const locationNum = location?.path[1];
//   // console.log("포지션", locationNum);
//   const contentObj = content?.value?.content[locationNum];

//   // console.log(contentObj.attrs);

//   // console.log("노드",node);

//   return contentObj;
// }


</script>

<style scoped></style>