import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
  state: () => ({
    isModalOpen: false,
    isCondition: false,
    isAction: false,
    isRecipe: false,
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
    },
  },
});