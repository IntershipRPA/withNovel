<template>
  <div class="px-4 "
  :class="recipeListToggle ? 'border-stone-200 sm:rounded-lg sm:border sm:shadow-lg' : ''">
    <div class="flex items-center">
      <button type="button" v-if='recipeListToggle' class="p-2 pr-10 border-stone-200 bg-white sm:rounded-lg sm:border ">
        +새 레시피 추가</button>
        <ExpandBtn v-model="recipeListToggle" />
      </div>
    <RecipeList v-if='recipeListToggle' class="mt-8"/>
  </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { PlusSquare } from 'lucide-vue-next';

import RecipeList from './RecipeList.vue'
import ExpandBtn from './ExpandBtn.vue';

const recipeListToggle = ref(true);

// const handleClickToggle = () => {
//   recipeListToggle.value = !recipeListToggle.value;
// }
</script>

<style scoped>


</style>