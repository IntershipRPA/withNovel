<template>
  <NodeViewWrapper>
    <div class="block flex items-end">
      <div class="rounded-lg shadow-md bg-green-100 hover:bg-green-200 z-20 px-8 mb-2 mt-2 py-5 items-center">
        <!-- <span class="label">Vue Component</span>

        <div class="testClick">
          <button @click="increase">
            This button has been clicked {{ node.attrs.count }} times.
          </button>
        </div> -->

        <!-- 텍스트 들어가는 컨텐츠 -->
        <NodeViewContent class="nodeTextContent" />
      </div>
      <span
        contenteditable="false"
        class="recipe-btn-setting recipe-tail cursor-pointer rounded-r-lg shadow-md bg-green-400 hover:bg-green-500 z-10 h-10 px-6 pl-7 my-2 text-sm text-white -ml-4 flex items-center min-w-max"
        @click='handleClickBtnSetting'>
        레시피
      </span>
    </div>
    <div>
      <div class='block flex -mt-4 pl-6'>
        <button
          contenteditable="false"
          class="recipe-btn-activated cursor-pointer rounded-lg shadow-md z-10 h-10 px-6 pl-7 py-6 pt-8 text-sm text-white flex items-center min-w-max"
          :class="isActivated ? 'bg-green-400 hover:bg-green-500' : 'bg-gray-400 hover:bg-gray-500'">
          <ElementChecked v-model='isActivated' :checked-string='"레시피 활성ㅤ"' :un-checked-string='"레시피 비활성"'
            @update:modelValue="handleUpdateActivated" />
        </button>
        <button
          contenteditable="false"
          class="recipe-btn-auto cursor-pointer rounded-lg shadow-md z-10 h-10 px-6 pl-7 py-6 pt-8 text-sm text-white ml-4 flex items-center min-w-max"
          :disabled='!isActivated ? true : false'
          :class="isAuto ? 'bg-green-400 hover:bg-green-500' : 'bg-gray-400 hover:bg-gray-500'">
          <ElementChecked v-model='isAuto' :checked-string='"ㅤ자동 ㅤ"' :un-checked-string='"자동 꺼짐"'
            @update:modelValue="handleUpdateAuto" />
        </button>
        <button
          contenteditable="false"
          class="recipe-btn-run rounded-lg shadow-md z-10 h-10 px-6 pl-7 py-6 pt-8 text-sm text-white ml-4 flex items-center min-w-max
          bg-gray-300 disabled:cursor-not-allowed enabled:bg-red-400 enabled:hover:bg-red-500"
          :disabled='!isActivated || isAuto ? true : false'
          @click='handleClickBtnRun'>
          수동으로 실행하기
        </button>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { nodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3';
import { Editor } from '@tiptap/core';
import { useModalStore } from '../../../stores/modal';
import ElementChecked from './ElementChecked.vue';

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

// 세팅 버튼 클릭
const handleClickBtnSetting = () => {
  modalStore.isRecipe = true;
  openModal();
}

const isActivated = ref(props.node.attrs.activated);
const isAuto = ref(props.node.attrs.auto);

// 활성화 버튼 클릭
const handleUpdateActivated = (value: boolean) => {
  if (value === false){
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
}

// 수동으로 실행 버튼 클릭
const handleClickBtnRun = () => {
  console.log("실행 클릭")
  alert("레시피 조건 불일치로 담당자에게 알람을 발생시켰습니다.")
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

// .label {
//   margin-left: 1rem;
//   background-color: #0D0D0D;
//   font-size: 0.6rem;
//   letter-spacing: 1px;
//   font-weight: bold;
//   text-transform: uppercase;
//   color: #fff;
//   position: absolute;
//   top: 0;
//   padding: 0.25rem 0.75rem;
//   border-radius: 0 0 0.5rem 0.5rem;
// }

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
