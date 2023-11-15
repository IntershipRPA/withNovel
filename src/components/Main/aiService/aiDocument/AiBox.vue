<template>
  <div class="flex-col -mt-11 mx-auto ml-2 max-w-screen-lg py-8 pl-12 pr-4 min-w-[534px] bg-white sm:rounded-lg sm:border sm:shadow-lg">
    <div class='text-xl mb-2'>
      AI 응답 요청 결과
    </div>

    <div class="h-[500px] overflow-y-auto pr-4">
      <ActionElement :action='action' @updateAction='updateAction' />
      <ConAct v-for="(group, index) in filteredConActs" :key="index" :groupKey="group.groupNum"
        :conditions='group.conditions' :aiData='aiData' @updateData='updateData' class="mb-2" />
      <!-- <ConAct v-for="(group, index) in filteredConActs" :key="index" :groupKey="group.groupNum"
        :conditions='group.conditions' :actions='group.actions' :aiData='aiData' @updateData='updateData' class="mb-2" /> -->
      <div @click='handleClickAddGroup'
        class="border-4 border-gray-200 hover:border-gray-300 text-center py-4 rounded-lg flex justify-center cursor-pointer text-gray-500 ">
        <PackagePlus class="mr-2" />Or 조건 추가
      </div>
    </div>

    <div class="flex items-stretch">
      <button type="button" @click='handleClickSaveRecipe'
        class='border-stone-200 bg-white mt-4 mx-auto p-4 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-8 sm:shadow-lg text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800'>
        레시피 저장
      </button>
    </div>
    <AlarmWindow v-if='isAlertVisible' :msg='alertMessage' />
  </div>
</template>

<script setup lang='ts'>
import { ref, computed, watch, toRef, toRefs } from 'vue';
import { FilePlus, PackagePlus } from "lucide-vue-next";

import ConAct from './ConAct.vue';
import ActionElement from './ActionElement.vue'
import { Recipe, AiData, Condition, Action } from '../../../lib/recipeData';
import { useAiDocumentStore } from '../../../../stores/aiDocument';
import AlarmWindow from './AlarmWindow.vue';
import { useRecipeStore } from '../../../../stores/recipes'; 

const recipeStore = useRecipeStore(); // 스토어 인스턴스 생성

const isAlertVisible = ref(false);
const alertMessage = ref('');

const props = defineProps({
  aiData: {
    type: Object as () => AiData,
    required: true,
  },
})

// 참조 객체 사용
// const conditions = toRef(props.aiData, 'conditions');
// const actions = toRef(props.aiData, 'actions');
const { conditions, action } = toRefs(props.aiData);
const aiData = ref(props.aiData)

// watch([props.aiData], ([newAiData], [oldAiData]) => {
//   console.log('AiData 변경:', oldAiData, '->', newAiData);
//   // aiData.conditions.splice(0, aiData.value.conditions.length, ...newAiData.conditions);
// });

// watch(() => props.aiData, (newAiData, oldAiData) => {
//   console.log('AiData 변경:', oldAiData, '->', newAiData);
//   aiData.value = { ...newAiData };
// }, { deep: true });

// watch(() => props.aiData, (newAiData, oldAiData) => {
//   console.log('AiData 변경:', oldAiData, '->', newAiData);
//   // 디버깅을 위한 추가 로그
//   console.log('conditions 변경:', oldAiData.conditions, '->', newAiData.conditions);
//   console.log('actions 변경:', oldAiData.actions, '->', newAiData.actions);
//   // ...
//   aiData.value = { ...newAiData };
// }, { deep: true });

// 초기 값 설정
// let maxGroup = computed(() => Math.max(...actions.value.map((item: Action) => item.andGroup), ...conditions.value.map((item: Condition) => item.andGroup)));
let maxGroup = computed(() => Math.max(...conditions.value.map((item: Condition) => item.andGroup)));
let groupNums = Array.from({ length: maxGroup.value }, (_, index) => index + 1);

watch([() => props.aiData.conditions], ([newConditions], [oldConditions]) => {
  // console.log('Conditions 변경:', oldConditions, '->', newConditions);
  // console.log('Actions 변경:', oldActions, '->', newActions);

  // maxGroup = computed(() => Math.max(...actions.value.map((item: Action) => item.andGroup), ...conditions.value.map((item: Condition) => item.andGroup)));
  maxGroup = computed(() => Math.max(...conditions.value.map((item: Condition) => item.andGroup)));
  groupNums = Array.from({ length: maxGroup.value }, (_, index) => index + 1);
});

const filteredConActs = computed(() => {
  // console.log("filteredConActs() 계산 groupNums:", groupNums);
  // console.log("filteredConActs() 계산 actions:", actions);
  // console.log("filteredConActs() 계산 conditions:", conditions);
  return groupNums.map(groupNum => {
    // console.log("groupNum", groupNum, typeof (groupNum))
    return {
      groupNum,
      // actions: [...actions.value.filter((item: Action) => item.andGroup === groupNum)],
      conditions: [...conditions.value.filter((item: Condition) => item.andGroup === groupNum)],
    };
  });
});

const handleClickAddGroup = () => {
  // console.log("addGroup클릭")
  addGroup();
}
// 그룹 추가
const addGroup = () => {
  if (props.aiData) {
    const maxConditionID: number = computed(() => Math.max(...conditions.value.map((item: Condition) => item.conditionID))).value;
    // const maxActionID: number = computed(() => Math.max(...actions.value.map((item: Action) => item.actionID))).value;

    const newCondition: Condition = {
      conditionID: maxConditionID + 1, // 가장 마지막 조건 ID 받아와야함
      andGroup: maxGroup.value + 1,
      fac: '',
      tag: '',
      value: '',
      unit: '',
      range: '',
      memo: '',
    }

    aiData.value.conditions.push(newCondition);
    // aiData.value.actions.push(newAction); 

    // 데이터 업데이트를 부모에게 전달
    emits("update-data", aiData.value)
  } else {
    console.warn("aiData is undefined");
  }
}

const handleClickSaveRecipe = () => {
  // console.log("handleClickSaveRecipe() 클릭")
  saveRecipe();
  alertSaved();
}

// 레시피 저장
const saveRecipe = () => {
  // console.log("레시피 저장 객체:", aiData.value)
  const json = JSON.parse(localStorage.getItem("aiService__content"));

  const getRecipes = (JSON.parse(localStorage.getItem("recipes")) || []) as Recipe[];

  // recipeID 계산하기
  const newRecipeID = getRecipes.length + 1;

  const recipeData = {
    "recipeID": newRecipeID,
    "recipeType": "aiService",
    "content": {
      "text": json,
      "aiDocument": aiData.value
    }
  }

  getRecipes.push(recipeData)
  localStorage.setItem("recipes", JSON.stringify(getRecipes));

  recipeStore.forceReloadLeftSideComponent() // LeftSide화면 강제 리로드
}

// 레시피가 저장되었습니다. 알람
const alertSaved = () => {
  // console.log("alertSaved호출")
  alertMessage.value = '레시피가 저장되었습니다.';
  isAlertVisible.value = true;

  setTimeout(() => {
    isAlertVisible.value = false;
  }, 5000);
}

// 자식컴포넌트로부터 데이터가 업데이트 되면
const emits = defineEmits();

const updateAction = (updatedAction: Action) => {
  // console.log("updateAction호출")
  if (aiData && aiData.value) {
    // console.log(updatedAction)
    aiData.value.action = updatedAction
    emits("update-data", aiData.value)
  } else {
    console.warn("aiData is undefined");
  }
}

const updateData = (aiData: AiData) => {
  emits("update-data", aiData)
}

</script>

<style scoped></style>