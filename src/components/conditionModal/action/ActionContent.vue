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
        <div v-for="(andArr, index) in conditions.filter(item => item.group === 1)" :key="index">
          <span class='inline-block rounded-l-lg shadow-md -z-4 h-10 px-1 pr-5 my-2 -mr-4 items-center bg-gray-400'>
            <!-- 셀렉 박스 -->
            <select :id="`andOr-${index}`" :name="`andOr-${index}`"
              class="cursor-pointer h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-800 sm:text-sm"
              v-model="andArr.andOr" @change="handleSelectedValueChange(andArr)">
              <option selected disabled>-</option>
              <option>AND</option>
              <option>OR</option>
            </select>
          </span>
          <!-- 조건 내용 -->
          <span class='inline-block items-center rounded-lg shadow-md bg-zinc-100 z-10 py-1 px-8 mb-2 mt-2'>
            {{ andArr.text }}
          </span>
        </div>
      </div>
      <!-- OR 조건-->
      <div v-if="conditions.some(item => item.group === 2)" class="rounded-lg p-5 border-2 border-rose-600">
        <span>OR 조건</span>
        <div v-for="(orArr, index) in conditions.filter(item => item.group === 2)" :key="index">
          <span class='inline-block rounded-l-lg shadow-md -z-4 h-10 px-1 pr-5 my-2 -mr-4 items-center bg-gray-400'>
            <!-- 셀렉 박스 -->
            <select :id="`andOr-${index}`" :name="`andOr-${index}`"
              class="cursor-pointer h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-800 sm:text-sm"
              v-model="orArr.andOr" @change="handleSelectedValueChange(orArr)">
              <option selected disabled>-</option>
              <option>AND</option>
              <option>OR</option>
            </select>
          </span>
          <!-- 조건 내용 -->
          <span class='inline-block items-center rounded-lg shadow-md bg-zinc-100 z-10 py-1 px-8 mb-2 mt-2'>
            {{ orArr.text }}
          </span>
        </div>
      </div>
      <!-- 초기 조건 목록 -->
      <div class="waitingCondition">
        <div class='flex items-center -ml-12' v-for="(condition, index) in conditions.filter(item => item.group === 3)"
          :key="index">
          <span class='rounded-l-lg shadow-md -z-4 h-10 px-1 pr-5 my-2 -mr-4 flex items-center bg-gray-400'>
            <!-- 셀렉 박스 -->
            <select :id="`andOr-${index}`" :name="`andOr-${index}`"
              class="cursor-pointer h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-800 sm:text-sm"
              v-model="condition.andOr" @change="handleSelectedValueChange(condition)">
              <option selected disabled>조건선택</option>
              <option>AND</option>
              <option>OR</option>
            </select>
          </span>
          <!-- <span :class="condition.isChecked ? 'bg-sky-550' : 'bg-gray-500'" -->
          <!-- 체크 박스 -->
          <!-- <span class='rounded-l-lg shadow-md -z-4 h-10 px-3 pr-7 my-2 -mr-4 flex items-center bg-gray-300'>
          <input type="checkbox" class="cursor-pointer focus:outline-none w-6 h-6 rounded-lg"
            v-model="condition.isChecked" />
        </span> -->
          <!-- 조건 내용 -->
          <span class='flex items-center rounded-lg shadow-md bg-zinc-100 z-10 py-1 px-8 mb-2 mt-2 '>
            {{ condition.text }}
          </span>
        </div>
      </div>
    </div>
    <div class='bg-zinc-100 mt-5 flex items-center'>
      <span>
        조건 불일치 알람 발생 :
      </span>
      <MiniEditor class='inline-block min-w-min max-w-xl' />
    </div>
  </div>
  <ConfirmBtn @click.stop="handleConfirm" />
</template>

<script setup lang="ts">
import { PropType, computed, defineEmits, onUpdated, ref } from "vue";
import MiniEditor from '../minimalEditor/MiniEditor.vue';
import ThirdModalChild from './ThirdModalChild.vue';
import ConfirmBtn from '../ConfirmBtn.vue';
import { Editor, Range } from '@tiptap/core';
import { useModalStore } from '../../../stores/modal';

onUpdated(() => {
  // console.log("선택완료", selectedAndOr.value)
});


const conditions = ref<Condition[]>([]);

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

interface AndOrGroup {
  isAND: boolean,
  isOR: boolean,
}

// 조건 가져오기
const storedData = localStorage.getItem('konwhowArr')
const storedDataArr = JSON.parse(storedData);
conditions.value = storedDataArr.map(item => ({ text: item, isChecked: false, andOr: '조건선택', group: 3 }));

// 선택된 값이 변경될 때 처리
const handleSelectedValueChange = (condition) => {
  // console.log("변경됨", condition)
  if (condition.andOr === 'AND') {
    // console.log("Selected AND")
    condition.group = 1;
  }

  if (condition.andOr === 'OR') {
    // console.log("Selected OR")
    condition.group = 2;
  }
};


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
  max-height: 680px;
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