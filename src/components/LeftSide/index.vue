<template>
  <div class="px-2" :class="recipeListToggle ? 'bg-gray-300 border-stone-200 sm:rounded sm:border sm:shadow-lg min-w-[238px] mr-2' : ''">
    <div class="flex items-center pt-2">
      <button type="button" v-if='recipeListToggle' @click='handleClickToggle'
        class="flex items-center bg-white p-2 pr-8 mr-2 border-stone-200 sm:rounded sm:border text-sm font-semibold text-blue-800 hover:text-white hover:bg-blue-800">
        <FilePlus2 class='mr-2' :size="24" :stroke-width="1.5" />새 레시피 추가
      </button>
      <ExpandBtn v-model="recipeListToggle" />
    </div>
    <RecipeList v-if='recipeListToggle' class="mt-8" @updateRecipeIndex='updateRecipeIndex' :selectedRecipeIndex='selectedRecipeIndex'/>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { FilePlus2 } from 'lucide-vue-next';

import RecipeList from './RecipeList.vue'
import ExpandBtn from './ExpandBtn.vue';

const recipeListToggle = ref(true);

const handleClickToggle = () => {
  // console.log("레시피 추가");
  localStorage.removeItem('novel__content');
  localStorage.removeItem('aiService__content');
  window.location.reload();
}

const selectedRecipeIndex = ref()

const updateRecipeIndex = (value) => {
  selectedRecipeIndex.value = value;
  // console.log("selectedRecipeIndex.value", selectedRecipeIndex.value)
}
</script>

<style scoped></style>