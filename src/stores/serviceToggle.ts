import { defineStore } from 'pinia';

export const useServiceStore = defineStore('serviceToggle', {
  state: () => ({    
    service: "formService",
  }),  
  actions: {
    setAiService() {
      this.service = "aiService"
    },
    setFormService() {
      this.service = "formService"
    },
  },
});