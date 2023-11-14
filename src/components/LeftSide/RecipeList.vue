<template>
  <div class="min-w-[210px] flex flex-col items-stretch">
    <div class="mb-4 pb-4 border-b-2 border-b-gray-200">
      레시피 리스트
    </div>
    <RecipeElement v-for="(recipe, index) in recipeLists" :key='index' :recipeKey='recipe.recipeID' 
    :class="{ 'selected': selectedRecipe === index }" @click="handleClickRecipe(index)" />
  </div>
</template>

<script setup lang='ts'>
import { ref, watchEffect } from 'vue';
import RecipeElement from './RecipeElement.vue';
import { Recipe } from '../../lib/recipeData';
import { useServiceStore } from '../../stores/serviceToggle';
import { useAiDocumentStore } from '../../stores/aiDocument';
import { useRecipeStore } from '../../stores/recipes';

const serviceToggle = useServiceStore(); // 스토어 인스턴스 생성
const aiDocumentStore = useAiDocumentStore(); // 스토어 인스턴스 생성
const recipeStore = useRecipeStore(); // 스토어 인스턴스 생성

const recipeLists = ref<Recipe[]>([]);

recipeLists.value = (JSON.parse(localStorage.getItem("recipes")) || []) as Recipe[];

// 레시피 추가와 같은 업데이트가 되면 실행
watchEffect(() => {
  // console.log("레시피 리스트 업데이트")
  recipeLists.value = (JSON.parse(localStorage.getItem("recipes")) || []) as Recipe[];
});

// 선택 레시피의 배경색 상태를 ref로 관리
const selectedRecipe = ref<number | null>(null);

const handleClickRecipe = (index : number) => {
  // console.log("handleClickRecipe()호출")
  // console.log(recipeLists.value[index])
  // console.log(recipeLists.value[index].recipeType)

  // 선택된 레시피의 배경색을 바꾸기 위해 인덱스로 조회
  if (selectedRecipe.value === index) {
    selectedRecipe.value = null; // 이미 선택된 경우 다시 클릭하면 선택 취소
  } else {
    selectedRecipe.value = index; // 새로운 요소를 선택하면 해당 인덱스의 요소를 선택
  }


  const recipeType = recipeLists.value[index].recipeType;
  const recipeContent = recipeLists.value[index].content;
  showRecipe(recipeType, recipeContent);
}

const showRecipe = (recipeType : string, recipeContent) => {
  serviceToggle.service = recipeType; // 토글상태 지정
  
  // aiService로 저장된 레시피라면
  if(recipeType === "aiService"){
    // 에디터 컨텐트 삭제
    localStorage.removeItem('aiService__content');

    // 에디터에 텍스트 출력
    // console.log("hereeee", recipeContent?.text)
    recipeStore.jsonContent = recipeContent?.text;

    // 스토어에 aiData 저장
    // console.log(recipeContent?.aiDocument)
    aiDocumentStore.setAiData(recipeContent?.aiDocument);
    // aiDocument 열기
    aiDocumentStore.openAiDocument();
    // console.log("도큐멘트열기")
  }

  if(recipeType === "formService"){
    // formService 화면처리하기위한 셋팅을 아래에 작성
  }

}
</script>

<style scoped>
.selected {
  background-color: rgb(229 231 235); /* 선택된 상태의 배경색 */
}
</style>