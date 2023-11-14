import { defineStore } from 'pinia';
import { AiData, Condition, Action } from '../lib/recipeData';

export const useAiDocumentStore = defineStore('rightSide', {
  state: () => ({
    isAiDocumentOpen: false,
    aiData: {}, // recipe으로 저장하기 전 aiData의 recipeID는 항상 0으로 설정
  }),  
  actions: {
    openAiDocument() {
      this.isAiDocumentOpen = true;
    },
    closeAiDocument() {
      this.isAiDocumentOpen = false;
      this.aiData = {};
    },
    setAiData(data: AiData){
      this.aiData = data;
    },
    getAiData() {
      if(this.aiData && Object.keys(this.aiData).length > 0){
        return this.aiData
      }else {
        console.log("Ai요청을 먼저해주세요")
        return undefined;
      }
    },
    discardAiData(){
      this.aiData = {};
    }
  },
});