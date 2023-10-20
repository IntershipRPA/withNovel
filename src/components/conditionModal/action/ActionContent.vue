<template>
  <div class="modal-family text-lg flex flex-col">
    <div class='mb-5 content-center bg-amber-100 flex items-center rounded-lg shadow-md h-10 px-8'>
      <span class="p-2.5">설비 Air Compressor</span>
      <span class="p-2.5">태그 Status</span>
      <span class="p-2.5">INIT: 일 때</span>
    </div>
    <div>
      <!-- AND 조건-->
      <div v-if="conditions.some(item => item.group === 1)" class="rounded-lg p-5 border-2 border-teal-400 mb-3">
        <span>AND 조건</span>
        <ElementCondition v-for="(condition, index) in conditions.filter(item => item.group === 1)" :key="index"
          :condition='condition' :num="index" />
      </div>
      <!-- OR 조건-->
      <div v-if="conditions.some(item => item.group === 2)" class="rounded-lg p-5 border-2 border-rose-600">
        <span>OR 조건</span>
        <ElementCondition v-for="(condition, index) in conditions.filter(item => item.group === 2)" :key="index"
          :condition='condition' :num="index" />
      </div>
      <!-- 초기 조건 목록 -->
      <div class="waitingCondition">
        <ElementCondition v-for="(condition, index) in conditions.filter(item => item.group === 3)" :key="index"
          :condition='condition' :num="index" />
      </div>
    </div>
    <div class='bg-zinc-100 mt-5 flex items-center'>
      <span>
        조건 불일치 알람 발생 :
      </span>
      <MiniEditor class='inline-block min-w-min max-w-xl' :placeholder="'알람 내용을 작성하세요 …'" :storageKey="'modal__action'" />
    </div>
  </div>
  <ConfirmBtn @click.stop="handleConfirm" />
</template>

<script setup lang="ts">
import { PropType, computed, onUpdated, ref } from "vue";
import MiniEditor from '../minimalEditor/MiniEditor.vue';
import ThirdModalChild from './ThirdModalChild.vue';
import ConfirmBtn from '../ConfirmBtn.vue';
import { Editor, Range } from '@tiptap/core';
import { useModalStore } from '../../../stores/modal';
import ElementCondition from './ElementCondition.vue';

// onUpdated(() => {
//   // console.log("선택완료", selectedAndOr.value)
// });


const conditions = ref<Condition[]>([]);

// 조건 가져오기
const storedData = localStorage.getItem('konwhowArr')
const storedDataArr = JSON.parse(storedData);
conditions.value = storedDataArr.map(item => ({ text: item, isChecked: false, andOr: '조건선택', group: 3 }));


const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
})

interface Condition {
  text: string,
  isChecked: boolean,
  andOr: string,
  group: number,
}

// interface AndOrGroup {
//   isAND: boolean,
//   isOR: boolean,
// }

// // 조건 가져오기
// const storedData = localStorage.getItem('konwhowArr')
// const storedDataArr = JSON.parse(storedData);
// conditions.value = storedDataArr.map(item => ({ text: item, isChecked: false, andOr: '조건선택', group: 3 }));

// // 선택된 값이 변경될 때 처리
// const handleSelectedValueChange = (condition) => {
//   // console.log("변경됨", condition)
//   if (condition.andOr === 'AND') {
//     // console.log("Selected AND")
//     condition.group = 1;
//   }

//   if (condition.andOr === 'OR') {
//     // console.log("Selected OR")
//     condition.group = 2;
//   }
// };


// 모달 설정
const modalStore = useModalStore(); // 스토어 인스턴스 생성

const closeModal = () => {
  modalStore.closeModal(); // 모달 닫기
};

const handleConfirm = () => {
  closeModal();
  changeToActionNode(); //actionRule 노드변경 함수
};

const changeToActionNode = () => {
  const editor = props.editor;
  // const modalContent = localStorage.getItem('modal__content');
  const selection = editor.state.selection;
  // 커서가 있는 줄을 찾기
  const lineStart = selection.$from.before(1) // 현재 블록(줄) 시작 위치
  const lineEnd = selection.$from.after(1)   // 현재 블록(줄) 종료 위치
  // console.log("here@@@###!!!", lineStart, lineEnd);

  editor
    .chain()
    .focus()

    // .deleteRange({ from: lineStart, to: lineEnd })
    .setActionRule()

    .insertContent(`액션 지정 완료`)
    .run();
};
</script>

<style scoped>
.modal-family {
  /* justify-content: center; */
  align-items: center;
  /* flex-wrap: wrap; */
  margin: auto;
  margin-top: 60px;
  margin-bottom: 70px;
  min-width: 1080px;
  min-height: 150px;
  max-height: 480px;
  overflow-y: auto;
  /* background-color: aquamarine; */
}

.first {
  background-color: #ffc5e4;
}

.second {
  background-color: #bedcff;
}

.third {
  /* background-color: rgb(145, 150, 255); */
}
</style>