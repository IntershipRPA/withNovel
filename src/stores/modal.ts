import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
  state: () => ({
    isModalOpen: false,
    isCondition: false,
    isAction: false,
    isRecipe: false,
    nodeViewProps: {}, // 노드타입으로 생성된 뷰템플릿에서 가져올 노드속성(현재 레시피모달에서만 사용)
  }),  
  actions: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.isCondition = false;
      this.isAction = false;
      this.isRecipe = false;
      this.isRecipeModal = false;
    },
  },
});