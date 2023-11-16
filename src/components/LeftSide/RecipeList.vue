<template>
  <div :key="componentKey" class="min-w-[210px] flex flex-col items-stretch">
    <div class="mb-2 pb-1 pl-1 border-b border-b-gray-400 text-xs font-semibold text-gray-600">
      레시피 리스트
    </div>
    <RecipeElement v-for="(recipe, index) in recipeLists" :key='index' :recipeKey='recipe.recipeID' :recipeName='recipe.recipeName'
      :class="{ 'selected': selectedRecipe === index }" @click="handleClickRecipe(index)"
      @discardRecipeKey='discardRecipeKey' />
  </div>
</template>

<script setup lang='ts'>
import { ref, watch, watchEffect } from 'vue';
import RecipeElement from './RecipeElement.vue';
import { Recipe } from '../../lib/recipeData';
import { useServiceStore } from '../../stores/serviceToggle';
import { useAiDocumentStore } from '../../stores/aiDocument';
import { useRecipeStore } from '../../stores/recipes';

const props = defineProps({
  selectedRecipeIndex: {
    type: Number,
  }
})

const emits = defineEmits();

const serviceToggle = useServiceStore(); // 스토어 인스턴스 생성
const aiDocumentStore = useAiDocumentStore(); // 스토어 인스턴스 생성
const recipeStore = useRecipeStore(); // 스토어 인스턴스 생성

const recipeLists = ref<Recipe[]>([]);

recipeLists.value = (JSON.parse(localStorage.getItem("recipes")) || []) as Recipe[];
// console.log("RecipeList.vue 렌더링")
// 레시피 추가와 같은 업데이트가 되면 실행
// watchEffect(() => {
//   // console.log("레시피 리스트 업데이트")
//   recipeLists.value = (JSON.parse(localStorage.getItem("recipes")) || []) as Recipe[];
// });
// key를 이용한 리로드
const componentKey = ref(0);
watch(
  () => recipeStore.reloadLeftSideComponent,
  () => {
    // 상태가 변경되었을 때 컴포넌트의 key 값을 변경하여 강제로 리로드
    componentKey.value += 1;
    // console.log(componentKey.value);
    recipeLists.value = (JSON.parse(localStorage.getItem("recipes")) || []) as Recipe[];
  }
);

// 선택 레시피의 배경색 상태를 ref로 관리
const selectedRecipe = ref<number | null | undefined>(props.selectedRecipeIndex || null);

const handleClickRecipe = (index: number) => {
  // console.log("handleClickRecipe()호출")
  // console.log(recipeLists.value[index])
  // console.log(recipeLists.value[index].recipeType)

  // 선택된 레시피의 배경색을 바꾸기 위해 인덱스로 조회
  if (selectedRecipe.value === index) {
    // selectedRecipe.value = null; // 이미 선택된 경우 다시 클릭하면 선택 취소
  } else {
    selectedRecipe.value = index; // 새로운 요소를 선택하면 해당 인덱스의 요소를 선택
    emits("update-recipeIndex", index)
  }


  const recipeType = recipeLists.value[index].recipeType;
  const recipeContent = recipeLists.value[index].content;
  showRecipe(recipeType, recipeContent);
  // console.log(recipeContent)
}

const showRecipe = (recipeType: string, recipeContent) => {
  serviceToggle.service = recipeType; // 토글상태 지정

  // aiService로 저장된 레시피라면
  if (recipeType === "aiService") {
    // 에디터 컨텐트 삭제
    localStorage.removeItem('aiService__content');

    // 에디터에 텍스트 출력
    recipeStore.jsonContent = recipeContent?.text;

    // 스토어에 aiData 저장
    // console.log(recipeContent?.aiDocument)
    aiDocumentStore.setAiData(recipeContent?.aiDocument);

    // aiDocument 열기
    aiDocumentStore.openAiDocument();
  }

  // formService 해당 레시피 화면처리
  if (recipeType === "formService") {
    localStorage.removeItem('novel__content');
    // 에디터에 텍스트 출력
    recipeStore.jsonContent = recipeContent?.text;
    // console.log(recipeStore.jsonContent)
    
    // 스토어에 formData 저장
    aiDocumentStore.setFormData(recipeContent?.formDocument);
    aiDocumentStore.openFormDocument();
  }

  recipeStore.forceReloadMainComponent() // Main화면 강제 리로드
}

// 레시피 삭제
const discardRecipeKey = (keyValue) => {
  // console.log(recipeLists.value.findIndex((item) => item.recipeID === keyValue))
  // recipeLists.value.find((item)=>item.recipeID)

  // 삭제할 인덱스 찾기
  const indexToRemove = recipeLists.value.findIndex((item) => item.recipeID === keyValue)

  if (indexToRemove !== -1) {
    recipeLists.value.splice(indexToRemove, 1);

    // 삭제 후 빈 자리를 채우기 위해 id 재조정
    for (let i = indexToRemove; i < recipeLists.value.length; i++) {
      recipeLists.value[i].recipeID = i + 1;
    }

    // 레시피 리스트 로컬스토리지에 업데이트
    localStorage.removeItem('recipes');
    localStorage.setItem('recipes', JSON.stringify(recipeLists.value));
  }
}

</script>

<style scoped>
.selected {
  /* background-color: rgb(229 231 235); */
  /* background-color: rgb(209 213 219); */
  /* background-color: rgb(156 163 175); */
  background-color: white;
  /* 선택된 상태의 배경색 */
}
</style>