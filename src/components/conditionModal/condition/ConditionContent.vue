<template>
    <div class="modal-family text-lg">
      <div class="first p-2.5 content-center">
        <p>{{ whelkMsg }}</p>
      </div>
      <div class="second p-2.5 content-center">
        <p>{{ tagMsg }}</p>
      </div>
      <ThirdModalChild class='third p-2.5 content-center' @tempSelected="updateTempValue" @unitSelected='updateUnitValue'
        @rangeSelected='updateRangeValue' />
      <MiniEditor class='p-2.5 content-center ' />
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

// 설비와 태그 불러오기
const whelkMsg = localStorage.getItem('whelk')
const tagMsg = localStorage.getItem('tag')

// 인풋에 입력한 값 불러오기
const temp = ref<number | null>(null); // 온도
const unit = ref<string>("℃"); // 단위
const range = ref<string>("이상"); // 범위
const updateTempValue = (value: number) => {
  temp.value = value;
};
const updateUnitValue = (value: string) => {
  unit.value = value;
};
const updateRangeValue = (value: string) => {
  range.value = value;
};

const props = defineProps({
  whelkMsg: { type: String, default: "test whelkMsg" },
  tagMsg: { type: String, default: "test tagMsg" },
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
  // range: {
  //   type: Object as PropType<Range>,
  //   required: true,
  // },
})


// 모달 설정
const modalStore = useModalStore(); // 스토어 인스턴스 생성

const closeModal = () => {
  modalStore.closeModal(); // 모달 닫기
};

const handleConfirm = () => {
  closeModal();
  changeToConditionNode(); //conditionRule 노드변경 함수
};

const changeToConditionNode = () => {
  const editor = props.editor;
  const modalContent = localStorage.getItem('modal__content');
  const selection = editor.state.selection;
  // 커서가 있는 줄을 찾기
  const lineStart = selection.$from.before(1) // 현재 블록(줄) 시작 위치
  const lineEnd = selection.$from.after(1)   // 현재 블록(줄) 종료 위치
  console.log("here@@@###!!!", lineStart, lineEnd);

  editor
    .chain()
    .focus()
    // .deleteRange({ from: 0, to: 12 }) // 수정해야함
    // .insertContent(`${temp.value}${unit.value} ${range.value} ${modalContent} `)
    // .setConditionRule({
    //   attrs: {
    //     whelk: whelkMsg,
    //     tag: tagMsg,
    //     temp: temp.value,
    //     unit: unit.value,
    //     range: range.value,
    //     memo: modalContent,
    //   }
    // })

    .deleteRange({ from: lineStart, to: lineEnd })
    // .insertContent(
    //   {
    //     type: "conditionRule",
    //     attrs: {
    //       whelk: whelkMsg,
    //       tag: tagMsg,
    //       temp: temp.value,
    //       unit: unit.value,
    //       range: range.value,
    //       memo: modalContent,
    //     },
    //     content: [{
    //       type: "text",
    //       text: `${whelkMsg} ${tagMsg} ${temp.value}${unit.value} ${range.value} ${modalContent} `,
    //     }],
    //   },
    // )
    .setConditionRule()

    .insertContent(`${whelkMsg} ${tagMsg} ${temp.value}${unit.value} ${range.value} ${modalContent} `)
    .run();
};

// const stopPropagation = (event) => {
//   event.stopPropagation();
// };




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