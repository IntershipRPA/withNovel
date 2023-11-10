<template>
  <!-- @click는 클릭 이벤트가 발생시 editor객체가 존재 할 경우만
       chanin() 메서드 실행
       class="className"은 동적으로 클래스를 설정하기 위한 바인딩
       -> className 변수에 저장된 클래스 이름을 해당 요소의 클래스로 설정-->
    <div>
      <button>레시피추가</button>
      <textarea placeholder="레시피 입력"></textarea>
    </div> 
  <div @click="editor?.chain().focus().run()" :class="className">
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

import { defaultEditorContent2 } from "../lib/default-content2";
import { defaultEditorProps } from "../lib/props";
import { getPrevText } from "../lib/editor";
import { defaultExtensions } from "../components/extensions";
import BubbleMenu from "../components/BubbleMenu/index.vue";
import SimpleModal from "../components/Modal/SimpleModal.vue";
import { modalToggle } from "./extensions/condition/conditionExtension"

import { useModalStore } from './../stores/modal';
import { AlarmCheck } from 'lucide-vue-next';
import { View } from 'lucide-vue-next';

// 모달 설정
const modalStore = useModalStore(); // 스토어 인스턴스 생성

const isModalOpen = computed(() => modalStore.isModalOpen);

//레시피 추가 모달창
const click = () => {
  console.log("레시피 추가");
  modalStore.openModal();
};



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
      "relative min-h-[500px] w-full mx-auto max-w-screen-lg border-stone-200 bg-white p-12 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-12 sm:shadow-lg",
  },

  // 에디터기본 값으로, JSON 형식으로 저장
  defaultValue: {
    type: Object as PropType<JSONContent>,
 
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

    // 커서가 있는 줄을 찾기
    const lineStart = selection.$from.before(1); // 현재 블록(줄) 시작 위치
    const lineEnd = selection.$from.after(1);   // 현재 블록(줄) 종료 위치

      // 해당 범위에 있는 텍스트를 가져옴
      let lineText = '';
      e.editor.state.doc.nodesBetween(lineStart, lineEnd, node => {
        if (node.isText) {
          lineText += node.text
        }
        return true;
      })

    let index = lineStart + 1;
      // 태그    Winding Temp   Press   Status
      let windingtempstr = lineText.match("Winding Temp");
      let windingtempPosition = lineText.indexOf("Winding Temp");

      let pressstr = lineText.match("Press");
      let pressPosition = lineText.indexOf("Press");

      let statusstr = lineText.match("Status");
      let statusPosition = lineText.indexOf("Status");
      // 설비 Comp Motor receivertank  aftercooler  aircompressor
      let compMotorStr = lineText.match("Comp Motor");
      let compMotorPosition = lineText.indexOf("Comp Motor");

      let receivertankStr = lineText.match("Receiver Tank");
      let receivertankPosition = lineText.indexOf("Receiver Tank");

      let aftercoolerStr = lineText.match("After Cooler");
      let aftercoolerPosition = lineText.indexOf("After Cooler");

      let aircompressorStr = lineText.match("Air Compressor");
      let aircompressorPosition = lineText.indexOf("Air Compressor");
      

      //범위
      let rangStr = lineText.match("이상");
      let rangPosition = lineText.indexOf("이상");

      let rangStr2 = lineText.match("이하");
      let rangPosition2 = lineText.indexOf("이하");

      let rangStr3 = lineText.match("초과");
      let rangPosition3 = lineText.indexOf("초과");

      let rangStr4 = lineText.match("미만");
      let rangPosition4 = lineText.indexOf("미만");

      //단위
      let unit = lineText.match("℃");
      let unitPosition = lineText.indexOf("℃");

      let unit2 = lineText.match("도");
      let unitPosition2 = lineText.indexOf("도");

      let unit3 = lineText.match("bar");
      let unitPosition3 = lineText.indexOf("bar");

      //특정 단어 마크업(처음에 한번만 되고 두번째 부터는 적용안됨)
      const {anchor} = e.editor.state.selection;  // 커서의 현재 위치를 가져옴   이거 하니 드래그 된거 해제 됨

//  범위 마크업 - 단어 입력하고 스페이스누르면 글자가 하나 더생겨서 코드 약간 바꿈(한글만 그런듯)
      if(rangStr !== null){
        e.editor
        .chain()
        .focus()
        .setTextSelection({ from: index + rangPosition, to: index + rangPosition + rangStr[0].length })
        .setMark("rangeMark", { class: 'tag', range: "이상" }) // "이상"을 입력하고 rangeMark를 설정합니다.
        .setTextSelection({from: index + rangPosition + rangStr[0].length, to: lineEnd}) // 마크업 끝난 곳
        .unsetMark("rangeMark")
        .setTextSelection({ from: anchor, to: anchor })
        .run();
      }else if(rangStr2 !== null){
        e.editor
        .chain()
        .focus()
        .setTextSelection({ from: index + rangPosition2, to: index + rangPosition2 + rangStr2[0].length })
        .setMark("rangeMark", { class: 'tag', range: "아하" }) // "이상"을 입력하고 rangeMark를 설정합니다.
        .setTextSelection({from: index + rangPosition2 + rangStr2[0].length, to: lineEnd}) // 마크업 끝난 곳
        .unsetMark("rangeMark")
        .setTextSelection({ from: anchor, to: anchor })
        .run();
      }else if(rangStr3 !== null){
        e.editor
        .chain()
        .focus()
        .setTextSelection({ from: index + rangPosition3, to: index + rangPosition3 + rangStr3[0].length })
        .setMark("rangeMark", { class: 'tag', range: "초과" }) // "이상"을 입력하고 rangeMark를 설정합니다.
        .setTextSelection({from: index + rangPosition3 + rangStr3[0].length, to: lineEnd}) // 마크업 끝난 곳
        .unsetMark("rangeMark")
        .setTextSelection({ from: anchor, to: anchor })
        .run();
      }else if(rangStr4 !== null){
        e.editor
        .chain()
        .focus()
        .setTextSelection({ from: index + rangPosition4, to: index + rangPosition4 + rangStr4[0].length })
        .setMark("rangeMark", { class: 'tag', range: "미만" }) // "이상"을 입력하고 rangeMark를 설정합니다.
        .setTextSelection({from: index + rangPosition4 + rangStr4[0].length, to: lineEnd}) // 마크업 끝난 곳
        .unsetMark("rangeMark")
        .setTextSelection({ from: anchor, to: anchor })
        .run();
      }

//단위 마크업
      if(unit !== null){
        e.editor
          .chain()
          .focus()
          .setUnit({unit: "℃"})
          .setTextSelection({ from: index + unitPosition, to: index + unitPosition + unit[0].length })
          .setMark("unitMark", { class: 'tag' })
          .setTextSelection({from: index + unitPosition + unit[0].length, to: lineEnd}) // 마크업 끝난 곳
          .unsetMark("unitMark") 
          .setTextSelection({ from: anchor, to: anchor }) 
          .unsetUnit()
          .run();
      }else if(unit2 !== null){
        e.editor
        .chain()
        .focus()
        .setTextSelection({ from: index + unitPosition2, to: index + unitPosition2 + unit2[0].length })
        .setMark("unitMark", { class: 'tag', range: "도" }) // "이상"을 입력하고 rangeMark를 설정합니다.
        .setTextSelection({from: index + unitPosition2 + unit2[0].length, to: lineEnd}) // 마크업 끝난 곳
        .unsetMark("unitMark")
        .setTextSelection({ from: anchor, to: anchor })
        .run();
      }else if(unit3 !== null){
        e.editor
        .chain()
        .focus()
        .setTextSelection({ from: index + unitPosition3, to: index + unitPosition3 + unit3[0].length })
        .setMark("unitMark", { class: 'tag', range: "bar" }) // "이상"을 입력하고 rangeMark를 설정합니다.
        .setTextSelection({from: index + unitPosition3 + unit3[0].length, to: lineEnd}) // 마크업 끝난 곳
        .unsetMark("unitMark")
        .setTextSelection({ from: anchor, to: anchor })
        .run();
      }
      

// 태그, 설비 마크업
      if(windingtempstr !== null){
        e.editor
          .chain()
          .focus()
          .setTag({tag: "Winding Temp"})
          .setTextSelection({ from: index + windingtempPosition, to: index + windingtempPosition + windingtempstr[0].length })
          .setMark("tagMark", { class: 'tag' })
          .setTextSelection({from: index + windingtempPosition + windingtempstr[0].length, to: lineEnd}) // 마크업 끝난 곳
          .unsetMark("tagMark") 
          .setTextSelection({ from: anchor, to: anchor }) 
          .unsetTag()
          .run();
      }else if(pressstr !== null){
        e.editor
          .chain()
          .focus()
          .setTag({tag: "Press"})
          .setTextSelection({ from: index + pressPosition, to: index + pressPosition + pressstr[0].length })
          .setMark("tagMark", { class: 'tag' })
          .setTextSelection({from: index + pressPosition + pressstr[0].length, to: lineEnd}) // 마크업 끝난 곳
          .unsetMark("tagMark") 
          .setTextSelection({ from: anchor, to: anchor }) 
          .unsetTag()
          .run();
      }else if(statusstr !== null){
        e.editor
          .chain()
          .focus()
          .setTag({tag: "Status"})
          .setTextSelection({ from: index + statusPosition, to: index + statusPosition + statusstr[0].length })
          .setMark("tagMark", { class: 'tag' })
          .setTextSelection({from: index + statusPosition + statusstr[0].length, to: lineEnd}) // 마크업 끝난 곳
          .unsetMark("tagMark") 
          .setTextSelection({ from: anchor, to: anchor }) 
          .unsetTag()
          .run();
      }else if(compMotorStr !== null){
        e.editor
          .chain()
          .focus()
          .setFacility({facility: "Comp Motor"})
          .setTextSelection({ from: index + compMotorPosition, to: index + compMotorPosition + compMotorStr[0].length })
          .setMark("facilityMark", { class: 'tag' })
          .setTextSelection({from: index + compMotorPosition + compMotorStr[0].length, to: lineEnd}) // 마크업 끝난 곳
          .unsetMark("facilityMark") 
          .setTextSelection({ from: anchor, to: anchor }) 
          .unsetFacility()
          .run();
      }else if(receivertankStr !== null){
        console.log("dddd");
        e.editor
          .chain()
          .focus()
          .setFacility({facility: "Receiver Tank"})
          .setTextSelection({ from: index + receivertankPosition, to: index + receivertankPosition + receivertankStr[0].length })
          .setMark("facilityMark", { class: 'tag' })
          .setTextSelection({from: index + receivertankPosition + receivertankStr[0].length, to: lineEnd}) // 마크업 끝난 곳
          .unsetMark("facilityMark") 
          .setTextSelection({ from: anchor, to: anchor }) 
          .unsetFacility()
          .run();
      }else if(aftercoolerStr !== null){
        e.editor
          .chain()
          .focus()
          .setFacility({facility: "After Cooler"})
          .setTextSelection({ from: index + aftercoolerPosition, to: index + aftercoolerPosition + aftercoolerStr[0].length })
          .setMark("facilityMark", { class: 'tag' })
          .setTextSelection({from: index + aftercoolerPosition + aftercoolerStr[0].length, to: lineEnd}) // 마크업 끝난 곳
          .unsetMark("facilityMark") 
          .setTextSelection({ from: anchor, to: anchor })
          .unsetFacility()
          .run();
      }else if(aircompressorStr !== null){
        e.editor
          .chain()
          .focus()
          .setFacility({facility: "After Cooler"})
          .setTextSelection({ from: index + aircompressorPosition, to: index + aircompressorPosition + aircompressorStr[0].length })
          .setMark("facilityMark", { class: 'tag' })
          .setTextSelection({from: index + aircompressorPosition + aircompressorStr[0].length, to: lineEnd}) // 마크업 끝난 곳
          .unsetMark("facilityMark") 
          .setTextSelection({ from: anchor, to: anchor })
          .unsetFacility()
          .run();
      }







































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
  autofocus: "end",
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




</script>

<style scoped>
  textarea {
      width: 60%;
      height: 6.25em;
      border: none;
      resize: none;
    }
</style>