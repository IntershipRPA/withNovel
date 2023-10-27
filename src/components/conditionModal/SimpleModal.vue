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
      <RecipeContent v-if="isRecipe" :editor="editor" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, Ref, computed, ref } from "vue";
import { Editor, Range } from '@tiptap/core';
import ConditionContent from './condition/ConditionContent.vue'
import ActionContent from './action/ActionContent.vue'
import RecipeContent from './recipe/RecipeContent.vue'
import { useModalStore } from '../../stores/modal';

// 모달 설정
const modalStore = useModalStore(); // 스토어 인스턴스 생성

const isCondition = computed(() => modalStore.isCondition);
const isAction = computed(() => modalStore.isAction);
const isRecipe = computed(() => modalStore.isRecipe);

const closeModal = () => {
  // 로컬스토리지 키 삭제
  localStorage.removeItem('modal__condition');
  localStorage.removeItem('modal__action');
  localStorage.removeItem('recipe_name');
  localStorage.removeItem('recipe_alarmMsg');
  localStorage.removeItem('recipe_alarmMsgTo');

  modalStore.closeModal(); // 모달 닫기
};

const props = defineProps({
  editor: {
    type: Object as PropType<Editor>,
    required: true,
  },
})

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
  z-index: 100;
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
  min-width: 820px;
  max-width: 1080px;
  min-height: 280px;
  max-height: 630px;
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