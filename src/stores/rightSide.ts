import { defineStore } from 'pinia';
import { Recipe, Condition, Action } from '../lib/recipeData';

export const useRightSideStore = defineStore('rightSide', {
  state: () => ({
    isRightSideOpen: false,
    aiData: {}, // recipe으로 저장하기 전 aiData의 recipeID는 항상 0으로 설정
  }),  
  actions: {
    openRightSide() {
      this.isRightSideOpen = true;
    },
    closeRightSide() {
      this.isRightSideOpen = false;
      this.aiData = {};
    },
    setAiData(data: Recipe){
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