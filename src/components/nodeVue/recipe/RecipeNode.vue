<template>
  <NodeViewWrapper>
    <div class="block flex items-end">
      <div class="relative rounded-lg shadow-md bg-green-100 hover:bg-green-200 z-20 px-8 mb-2 mt-2 py-5 items-center">
        <div class="sample-label right-10 bg-teal-700" contenteditable="false">
          <span class='pr-3' @click='handleClickBtnJSON'>
            JSON
            <Download class='h-3 w-3 inline-block' />
          </span>
          <span class="pl-2 border-l-2 border-solid border-white" @click='handleClickBtnText'>
            Text
            <Download class='h-3 w-3 inline-block' />
          </span>
        </div>

        <!-- <div class="testClick">
          <button @click="increase">
            This button has been clicked {{ node.attrs.count }} times.
          </button>
        </div> -->

        <!-- 텍스트 들어가는 컨텐츠 -->
        <NodeViewContent class="nodeTextContent" as="div" />
      </div>
      <span
        class="recipe-btn-setting recipe-tail cursor-pointer rounded-r-lg shadow-md bg-green-400 hover:bg-green-500 z-10 h-10 px-4 pl-7 my-2 text-sm text-white -ml-4 flex items-center min-w-max"
        @click='handleClickBtnSetting'>
        레시피
        <Menu class="w-5 h-5 ml-2" />
      </span>
    </div>
    <div>
      <div class='block flex -mt-4 pl-6'>
        <button contenteditable="false"
          class="recipe-btn-activated cursor-pointer rounded-lg shadow-md z-10 h-10 px-4 py-6 pt-8 text-sm text-white flex items-center min-w-max"
          :class="isActivated ? 'bg-green-400 hover:bg-green-500' : 'bg-gray-400 hover:bg-gray-500'">
          <ElementChecked v-model='isActivated' :checked-string='"레시피 활성ㅤ"' :un-checked-string='"레시피 비활성"'
            @update:modelValue="handleUpdateActivated" />
        </button>
        <button contenteditable="false"
          class="recipe-btn-auto cursor-pointer rounded-lg shadow-md z-10 h-10 px-4 py-6 pt-8 text-sm text-white ml-4 flex items-center min-w-max"
          :disabled='!isActivated ? true : false'
          :class="isAuto ? 'bg-green-400 hover:bg-green-500' : 'bg-gray-400 hover:bg-gray-500'">
          <ElementChecked v-model='isAuto' :checked-string='"ㅤ자동 ㅤ"' :un-checked-string='"자동 꺼짐"'
            @update:modelValue="handleUpdateAuto" />
        </button>
        <button contenteditable="false" class="recipe-btn-run rounded-lg shadow-md z-10 h-10 px-4 py-6 pt-8 text-sm text-white ml-4 flex items-center min-w-max
          bg-gray-300 disabled:cursor-not-allowed enabled:bg-red-400 enabled:hover:bg-red-500"
          :disabled='!isActivated || isAuto ? true : false' @click='handleClickBtnRun'>
          수동으로 실행하기
        </button>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { PropType, ref, onMounted } from 'vue';
import { nodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3';
import { Editor } from '@tiptap/core';
import { useModalStore } from '../../../stores/modal';
import ElementChecked from './ElementChecked.vue';
import { Download, Settings, Settings2, Cog, PenLine, Menu } from 'lucide-vue-next';
import { MapResult } from '@tiptap/pm/transform';
import { useStorage } from "@vueuse/core";
const props = defineProps({
  ...nodeViewProps,
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
})

// const increase = () => {
//   props.updateAttributes({
//     count: props.node.attrs.count + 1,
//     // count: 10,
//   });
//   console.log("btn클릭")
// }


// 모달 설정
const modalStore = useModalStore(); // 스토어 인스턴스 생성
const openModal = () => {
  modalStore.openModal(); // 모달 열기
}

// 다운로드 txt 파일
const downloadTextFile = (textContent: string) => {
  // console.log("Downloading text file실행")
  const blob = new Blob([textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'myTextFile.txt';
  a.click();

  URL.revokeObjectURL(url);
};

// JSON 컨텐츠 만들기
const getJSONFromRecipe = () => {
  const docs = props.editor.getJSON()?.content;
  const locationNum = props.editor.state.selection.$anchor?.path[1]; // 커서 위치 정보 가져오기
  // console.log(docs[locationNum])

  const result = JSON.stringify(docs[locationNum], null, 2);

  return result;
}


// Text 컨텐츠 만들기
let recipeData = [];
const getTextFromRecipe = () => {

  const arr = props.node.content.content.map(item => item.content.content);
  const textArr = arr.map(innerArray => {
    return innerArray.map(element => {
      return element.text;
    })
  })

  const result = textArr.map(row => {
    let rowString = '';

    for (let item of row) {
      if (item === undefined) {
        rowString += '\n';
      } else {
        rowString += item + ' ';
      }
    }
    
    return rowString.trim();
  }).join('\n');
  // recipeData.push(result);
  // useStorage("recipe",recipeData);


  return result;
}
// console.log("result : ", getTextFromRecipe()); //레시피 전체내용 출력됨
//  recipeData.push(getTextFromRecipe());
// console.log(recipeData)
//  localStorage.setItem("recipe",recipeData);
//  useStorage("recipe", recipeData);

 
//  console.log(recipeData)
   



// 조건 일치시 실행할 액션
const runAction = () => {
  alert("레시피 조건 불일치로 담당자에게 알람을 발생시켰습니다.")
}

// 자동화를 위한 n초간격 함수를 저장하는 변수
let intervalId;

// 10초 간격으로 알람을 발생시키는 함수
const startAlarm = () => {
  if (!props.node.attrs.auto) {
    // 바로 알람 발생
    setTimeout(() => {
      runAction(); // 1초 딜레이 후 알람 발생
      setAlarmInterval(10000);
    }, 1000); // 1초 딜레이 설정runAction();
  }
};

// 알람을 중지하는 함수
const stopAlarm = () => {
  clearInterval(intervalId);
};

const setAlarmInterval = (sec: number) => {
  clearInterval(intervalId); // 이전 타이머 중지
  intervalId = setInterval(() => {
    if (props.node.attrs.auto) {
      runAction();
    }
  }, sec); // 10초 간격
};

// 컴포넌트가 처음 렌더링될 때 실행  
onMounted(() => {
  setAlarmInterval(10000);
});


// 세팅 버튼 클릭
const handleClickBtnSetting = () => {
  modalStore.isRecipe = true;
  modalStore.nodeViewProps = props; //노드의 attrs를 저장하기위해

  openModal();
}

const isActivated = ref(props.node.attrs.activated);
const isAuto = ref(props.node.attrs.auto);

// 활성화 버튼 클릭
const handleUpdateActivated = (value: boolean) => {
  if (value === false) {
    // 비활성화 상태면
    isAuto.value = value;
    props.updateAttributes({
      auto: isAuto.value,
    });
  }
  isActivated.value = value;
  props.updateAttributes({
    activated: isActivated.value,
  });
}

// 자동화 버튼 클릭
const handleUpdateAuto = (value: boolean) => {
  props.updateAttributes({
    auto: value,
  });

  if (value === true) {
    startAlarm();
  } else {
    stopAlarm();
  }
}

// 수동으로 실행 버튼 클릭
const handleClickBtnRun = () => {
  // console.log("실행 클릭")
  runAction();
}

// JSON 다운로드 버튼 클릭
const handleClickBtnJSON = () => {
  // console.log("JSON clicked")
  getJSONFromRecipe();

  downloadTextFile(getJSONFromRecipe());
}

// Text 다운로드 버튼 클릭
const handleClickBtnText = () => {
  // console.log("Text clicked")
  downloadTextFile(getTextFromRecipe());
}

</script>



<style lang="scss">
// .recipe {
//   background: #a2fa94;
//   border: 3px solid #0D0D0D;
//   border-radius: 0.5rem;
//   margin: 1rem 0;
//   position: relative;
// }

.sample-label {
  // margin-left: 1rem;
  // background-color: #0D0D0D;
  font-size: 0.6rem;
  letter-spacing: 1px;
  // font-weight: bold;
  text-transform: uppercase;
  color: #fff;
  position: absolute;
  top: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 0 0 0.5rem 0.5rem;
  cursor: pointer;
}

// .testClick {
//   margin-top: 1.5rem;
//   padding: 1rem;
// }

.nodeTextContent {
  // margin: 2.5rem 1rem 1rem;
  // padding: 0.5rem;
  // border: 2px dashed #0D0D0D20;
  // border-radius: 0.5rem;
}
</style>
