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
      <div class="modal-family text-lg">
        <div class="first p-2.5 content-center">
          <p>{{ whelkMsg }}의</p>
        </div>
        <div class="second p-2.5 content-center">
          <p>{{ tagMsg }}를</p>
          <!-- <p>선택 태그</p> -->
        </div>
        <ThirdModalChild class='third p-2.5 content-center'
        @tempSelected="updateTempValue" 
        @unitSelected='updateUnitValue'
        @rangeSelected='updateRangeValue'/>
        <MiniEditor class='p-2.5 content-center ' />
      </div>
      <ConfirmBtn @click.stop="handleConfirm" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, defineEmits, ref } from "vue";
import MiniEditor from './minimalEditor/MiniEditor.vue';
import ThirdModalChild from './ThirdModalChild.vue';
import ConfirmBtn from './ConfirmBtn.vue';
import { Editor } from '@tiptap/core';

// 설비와 태그 불러오기
const whelkMsg = localStorage.getItem('whelk');
const tagMsg = localStorage.getItem('tag');

// 인풋에 입력한 값 불러오기
const temp = ref<number | null>(null); // 온도
const unit = ref<string>("℃"); // 단위
const range = ref<string>("이상"); // 범위
const updateTempValue = (value : number) => {
  temp.value = value;
};
const updateUnitValue= (value : string) => {
  unit.value = value;
};
const updateRangeValue= (value : string) => {
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

const emit = defineEmits(['close']);

const handleConfirm = () => {
  closeModal();
  changeToConditionNode(); //conditionRule 노드변경 함수
};

const closeModal = () => {
  emit('close');
};

const changeToConditionNode = () => {
  const editor = props.editor;
  const selection = editor.state.selection;
  // const range = props.range;
  const modalContent = localStorage.getItem('modal__content');
  editor
    .chain()
    .focus()
    // .deleteRange({ from: 0, to: 12 }) // 수정해야함
    .toggleNode("conditionRule", "conditionRule")
    .setHighlight({ color: '#aac5e4' })
    .deleteRange({ from: selection.$from.before(1), to: selection.$from.after(1) })
    .insertContent(`${whelkMsg}의 ${tagMsg}를 ${temp.value} ${unit.value} ${range.value} ${modalContent} ←조건_설정_완료`)
    .unsetHighlight()
    .run();

    console.log(`${whelkMsg} ${tagMsg} ${temp.value} ${unit.value} ${range.value} ${modalContent} ←조건_설정_완료`);
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

.confirm-btn {
  position: absolute;
  right: 50px;
  bottom: 20px;
}

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