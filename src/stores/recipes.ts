import { defineStore } from 'pinia';
import { Recipe, Condition, Action } from '../lib/recipeData';

export const useRecipeStore = defineStore('recipes', {
  state: () => ({    
    jsonContent: {},
  }),  
  actions: {
    // setRecipe(recipe : Recipe) {
    //   this.isModalOpen = true;
    // },
    // getRecipe(recipeID : number): Recipe {
      
    //   return recipe
    // },
  },
});