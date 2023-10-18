<template>
  <div class="modal-family text-lg">
    <!-- <p>This is Acition-modal-content</p> -->
    <div class='flex items-center' v-for="(condition, index) in conditions" :key="index">
      <span class='flex items-center rounded-lg shadow-md bg-zinc-100 hover:bg-zinc-200 z-10 h-10 px-8 mb-2 mt-2 '>
        {{ condition }}
      </span>
      <span :class="isChecked ? 'bg-red-500' : 'bg-blue-500'" @click='handleClick'
      class='cursor-pointer rounded-r-lg shadow-md bg-gray-400 hover:bg-gray-500 -z-4 h-10 px-6 pl-7 my-2 text-sm text-white -ml-4 flex items-center'>
        {{ index }}
      </span>
    </div>
  </div>
  <ConfirmBtn @click.stop="handleConfirm" />
</template>

<script setup lang="ts">
import { PropType, computed, defineEmits, ref } from "vue";
import MiniEditor from '../minimalEditor/MiniEditor.vue';
import ThirdModalChild from './ThirdModalChild.vue';
import ConfirmBtn from '../ConfirmBtn.vue';
import { Editor, Range } from '@tiptap/core';
import { useModalStore } from '../../../stores/modal';

const isChecked = ref(false);

const handleClick = () => {
  isChecked.value = !isChecked.value;
}

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
})

// 조건 가져오기
const storedData = localStorage.getItem('konwhowArr')
const conditions = JSON.parse(storedData);

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
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: auto;
  margin-top: 60px;
  margin-bottom: 70px;
  width: 742px;
  min-height: 150px;
  max-height: 330px;
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