<template>
  <div class="modal-family text-lg flex flex-col">
    <div class='mb-5 content-center bg-amber-100 flex items-center rounded-lg shadow-md h-10 px-8'>
      <span class="p-2.5">설비 Air Compressor</span>
      <span class="p-2.5">태그 Status</span>
      <span class="p-2.5">INIT: 일 때</span>
    </div>
    <div>
      <div class='flex items-center -ml-12' v-for="(condition, index) in conditions" :key="index">
        <span class='rounded-l-lg shadow-md -z-4 h-10 px-1 pr-5 my-2 -mr-4 flex items-center bg-gray-400'>
          <!-- {{ condition.andOr }} -->
          <select :id="`andOr-${index}`" :name="`andOr-${index}`"
            class="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-800 sm:text-sm">
            <option selected disabled>-</option>
            <option>AND</option>
            <option>OR</option>
          </select>
        </span>
        <!-- <span :class="condition.isChecked ? 'bg-sky-550' : 'bg-gray-500'" -->
        <span class='rounded-l-lg shadow-md -z-4 h-10 px-3 pr-7 my-2 -mr-4 flex items-center bg-gray-300'>
          <input type="checkbox" class="cursor-pointer focus:outline-none w-6 h-6 rounded-lg"
            v-model="condition.isChecked" />
        </span>
        <span class='flex items-center rounded-lg shadow-md bg-zinc-100 z-10 h-10 px-8 mb-2 mt-2 max-w-lg'>
          {{ condition.text }}
        </span>
      </div>
    </div>
    <div class='bg-zinc-100 mt-5 flex items-center'>
      <span>
        조건불일치 알람 :
      </span>
      <MiniEditor class='inline-block min-w-min max-w-xl'/>
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

// onUpdated(() => {
//   console.log("클릭", conditions.value)
// });


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
}

// 조건 가져오기
const storedData = localStorage.getItem('konwhowArr')
const storedDataArr = JSON.parse(storedData);
conditions.value = storedDataArr.map(item => ({ text: item, isChecked: false, andOr: 'none' }));

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
  width: 742px;
  min-height: 150px;
  max-height: 380px;
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