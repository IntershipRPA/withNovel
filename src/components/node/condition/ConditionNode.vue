<template>
  <NodeViewWrapper>
    <div class="block flex items-end">
      <div class="inline-block rounded-lg shadow-md bg-zinc-100 hover:bg-zinc-200 z-20 py-1 px-8 mb-2 mt-2 flex items-center">
        <!-- 텍스트 들어가는 컨텐츠 -->
        <NodeViewContent class="nodeTextContent" />
      </div>
      <span class="condition-btn-setting condition-tail cursor-pointer rounded-r-lg shadow-md bg-gray-400 hover:bg-gray-500 z-10 h-10 px-4 pl-7 my-2 text-sm text-white -ml-4 flex items-center min-w-max"
        @click="handleClickBtnSetting"
      >
        조건
        <Menu class="w-5 h-5 ml-2" />
      </span>
    </div>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { PropType, ref, computed } from 'vue';
import { nodeViewProps, NodeViewWrapper, NodeViewContent } from '@tiptap/vue-3';
import { Editor } from '@tiptap/core';
import { useModalStore } from './../../../stores/modal';
import { Settings, Settings2, Cog, PenLine, Menu } from 'lucide-vue-next';



const props = defineProps({
  ...nodeViewProps,
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
});

// 모달 설정
const modalStore = useModalStore(); // 스토어 인스턴스 생성
const openModal = () => {
  modalStore.openModal(); // 모달 열기
};

// 버튼 클릭
const handleClickBtnSetting = () => {
  modalStore.isCondition = true;
  openModal();
};

</script>



<style lang="scss">

// .nodeTextContent {
//   // margin: 2.5rem 1rem 1rem;
//   // padding: 0.5rem;
//   // border: 2px dashed #0D0D0D20;
//   // border-radius: 0.5rem;
// }


</style>
