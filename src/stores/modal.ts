import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
  state: () => ({
    isModalOpen: false,
    isCondition: false,
    isAction: false,
  }),
  actions: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.isCondition = false;
      this.isAction = false;
    },
  },
});