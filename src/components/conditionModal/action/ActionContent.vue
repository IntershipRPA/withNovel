<template>
    <div class="modal-family text-lg">
      <p>This is Acition-modal-content</p>
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

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
})

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
  console.log("here@@@###!!!", lineStart, lineEnd);

  editor
    .chain()
    .focus()

    .deleteRange({ from: lineStart, to: lineEnd })
    .setActionRule()

    // .insertContent(`${whelkMsg} ${tagMsg} ${temp.value}${unit.value} ${range.value} ${modalContent} `)
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
  width: 742px;
  height: 150px;
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