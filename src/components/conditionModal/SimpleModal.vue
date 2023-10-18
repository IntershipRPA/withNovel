<template>
  <div class="modal">
    <div class="modal-wrapper" @click="closeModal">
    </div>
    <div class="modal-content" @click.stop="stopPropagation">
      <!-- X 버튼 -->
      <button type="button" @click.stop="closeModal"
        class="close-btn bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
        <span class="sr-only">Close menu</span>
        <!-- Heroicon name: outline/x -->
        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <!-- 본문 -->
      <ConditionContent v-if="isCondition" :editor="editor" />
      <ActionContent v-if="isAction" :editor="editor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, Ref, computed, defineEmits, ref } from "vue";
import { Editor, Range } from '@tiptap/core';
import ConditionContent from './condition/ConditionContent.vue'
import ActionContent from './action/ActionContent.vue'
import { useModalStore } from '../../stores/modal';

// 모달 설정
const modalStore = useModalStore(); // 스토어 인스턴스 생성

const isCondition = computed(() => modalStore.isCondition);
const isAction = computed(() => modalStore.isAction);

const closeModal = () => {
  modalStore.closeModal(); // 모달 닫기
};

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
  // isCondition: {
  //   type: Boolean,
  // }
})

// const emit = defineEmits(['close']);

// const closeModal = () => {
//   emit('close');
// };

const konwhowOBJ = useStorage<any[]>('konwhowOBJ', []); // 레시피 데이터 객채로 저장
const konwhowArr = useStorage<string[]>('konwhowArr', []); //레시피 저장 배열(상태관리? 배열 초기화 막아줌) / 빈배열을 인자로 가지고 있어 타입<string[]>을 지정해 줘야함
const changeToConditionNode = () => {
  const editor = props.editor;
  const modalContent = localStorage.getItem('modal__content');
  editor
  .chain()
    .focus()
    .insertContentAt({ from: editor.state.selection.$from.before(1) , to: editor.state.selection.$from.after(1) },`"${whelkMsg}"의 "${tagMsg}"를 ${temp.value} ${unit.value} ${range.value} ${modalContent}`)
    .setConditionRule()
    .run();

  let konwhow = `"${whelkMsg}"의 "${tagMsg}"를 ${temp.value} ${unit.value} ${range.value} ${modalContent}`;
//  console.log(JSON.stringify(konwhow));
 
  konwhowArr.value.push(konwhow);
  localStorage.setItem('konwhowArr', JSON.stringify(konwhowArr.value)); // 로컬에 저장
//  console.log(konwhowArr.value);

  //객체로 저장
  let whel = whelkMsg;
  let tag = tagMsg;
  let tempValue = temp.value;
  let unitValue = unit.value;
  let rangeValue = range.value;
  let modalText = modalContent;
  let obj = {whel, tag, tempValue, unitValue, rangeValue, modalText};
//  console.log(JSON.stringify(obj));
  konwhowOBJ.value.push(obj); //배열에 추가
  localStorage.setItem('konwhowOBJ', JSON.stringify(konwhowOBJ.value)); //로컬에 저장
  // 데이터 가져오기
  let gatData = localStorage.getItem('konwhowOBJ')

  let gatData2;
  if(gatData !== null){
    gatData2 = JSON.parse(gatData);
  }
  console.log(`확인1 : ${JSON.stringify(gatData2[1])}`); //전체 가져올 때
  console.log(`확인2 : ${gatData2[1].whel}`); //값 하나만 가져올 때 JSON.stringify()쓰면 JSON문자열로 됨 "whel"
  console.log(`확인3 : ${gatData2[1].tag}`);
  console.log(`확인4 : ${gatData2[1].tempValue}`);
 
/*
  localStorage는 무조건 문자열로 저장
  JSON 데이터를 문자열로 변환하거나, 특수문자를 포함한 문자열을 안전하게 다루기 위해 이스케이프 처리
*/
  // const data = localStorage.getItem("konwhowArr");
  // if(data !== null){
  //   console.log(data.replace(/\\/g, '').replace(/"/g, ''));
  // }


  localStorage.removeItem('konwhow');
  useStorage('konwhow', konwhow);//레시피
};

const stopPropagation = (event) => {
  event.stopPropagation();
};
</script>

<style scoped>
.modal {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
}

.modal-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  height: 100%;
  width: 100%;
}

.modal-content {
  z-index: 1;
  position: relative;
  width: 820px;
  height: 280px;
  background-color: white;
  border-radius: 10px;
  /* background: rgba(255, 255, 255, 0.3); */
  backdrop-filter: blur(240px);
}

.close-btn {
  position: absolute;
  right: 0px;
  top: 0px;
}
</style>