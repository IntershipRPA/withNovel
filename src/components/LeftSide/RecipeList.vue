<template>
  <div :key="componentKey" class="min-w-[210px] flex flex-col items-stretch">
    <div class="mb-2 pb-1 pl-1 border-b border-b-gray-400 text-xs font-semibold text-gray-600">
      레시피 리스트
    </div>
    <RecipeElement v-for="(recipe, index) in recipeLists" :key='index' :recipeKey='recipe.recipeID'
      :recipeName='recipe.recipeName' :class="{ 'selected': selectedRecipe === index }" @click="handleClickRecipe(index)"
      @discardRecipeKey='discardRecipeKey' />
    <AlarmWindow v-if='isAlertVisible' :msg='alertMessage' />
  </div>
</template>

<script setup lang='ts'>
import { onUpdated, ref, watch, watchEffect } from 'vue';
import RecipeElement from './RecipeElement.vue';
import { Recipe } from '../../lib/recipeData';
import { useServiceStore } from '../../stores/serviceToggle';
import { useAiDocumentStore } from '../../stores/aiDocument';
import { useRecipeStore } from '../../stores/recipes';
import AlarmWindow from '../Alert/AlarmWindow.vue';

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
const isAlertVisible = ref(false)
const alertMessage = ref('')

recipeLists.value = (JSON.parse(localStorage.getItem("recipes")) || []) as Recipe[];

// key를 이용한 화면 리로드
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

onUpdated(() => {
  // 선택된 레시피의 인덱스를 props값에서 받아오기
  selectedRecipe.value = props.selectedRecipeIndex;
})

const handleClickRecipe = (index: number) => {
  // console.log("handleClickRecipe()호출")
  // console.log(recipeLists.value[index])
  // console.log(recipeLists.value[index].recipeID)

  // 선택된 레시피의 배경색을 바꾸기 위해 인덱스로 조회
  if (selectedRecipe.value === index) {
    // selectedRecipe.value = null; // 이미 선택된 경우 다시 클릭하면 선택 취소
  } else {
    selectedRecipe.value = index; // 새로운 요소를 선택하면 해당 인덱스의 요소를 선택
    emits("update-recipeIndex", index)
  }

  // 레시피 키를 화면에 띄워진 레시피 상태키에 저장하기
  recipeStore.currentRecipeID = recipeLists.value[index].recipeID;

  const recipeType = recipeLists.value[index].recipeType;
  const recipeContent = recipeLists.value[index].content;
  showRecipe(recipeType, recipeContent); // 선택 레시피 열기
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

  // formService로 저장된 레시피라면
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

    // 현재 화면의 레시피 키 상태 값이 삭제할 레시피 키 값과 같다면 화면 비우기
    if (recipeStore.currentRecipeID === keyValue) {
      // console.log("클릭키,현재창키", recipeStore.currentRecipeID, keyValue)
      localStorage.removeItem('novel__content');
      localStorage.removeItem('aiService__content');
      recipeStore.jsonContent = {} //컨텐츠 비우기
      aiDocumentStore.isAiDocumentOpen = false; //ai도큐먼트 닫기
      aiDocumentStore.discardAiData(); // 데이터 비우기
      emits("update-recipeIndex", null)
      recipeStore.forceReloadMainComponent();
    }

    // 삭제 알람 발생
    alertDeleted()
  }
}

// 레시피가 삭제되었습니다. 알람
const alertDeleted = () => {
  alertMessage.value = '레시피가 삭제되었습니다.';
  isAlertVisible.value = true;

  setTimeout(() => {
    isAlertVisible.value = false;
  }, 2000);
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