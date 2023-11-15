import { defineStore } from 'pinia';
import { Recipe, Condition, Action } from '../lib/recipeData';

export const useRecipeStore = defineStore('recipes', {
  state: () => ({
    reloadMainComponent: false,
    reloadLeftSideComponent: false,
    jsonContent: {},
  }),  
  actions: {
    forceReloadMainComponent() {
      this.reloadMainComponent = !this.reloadMainComponent; // 상태 변경
    },
    forceReloadLeftSideComponent() {
      this.reloadLeftSideComponent = !this.reloadLeftSideComponent; // 상태 변경
    },
  },
});