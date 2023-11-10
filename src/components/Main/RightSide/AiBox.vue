<template>
  <div class="flex-col mx-auto max-w-screen-lg py-12 pl-12 pr-4 min-w-[534px] sm:rounded-lg sm:border sm:shadow-lg">
    <div class='text-xl mb-2'>
      AI 응답 요청 결과
    </div>

    <div class="h-[500px] overflow-y-auto pr-4">
      <ConAct v-for="(group, index) in filteredConActs" :key="index" :groupKey="group.groupNum" :conditions='group.conditions'
        :actions='group.actions' :aiData='aiData' @updateData='updateData' class="mb-2"/>
      <div
        class="border-4 border-amber-100 hover:border-amber-200 text-center py-4 rounded-lg flex justify-center cursor-pointer text-gray-500 ">
        <PackagePlus class="mr-2" />Or 조건, 액션 추가
      </div>
    </div>

    <div class="flex items-stretch">
      <button type="button"
        class='border-stone-200 bg-white mt-4 mx-auto p-4 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-8 sm:shadow-lg text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800'>
        레시피 저장
      </button>
    </div>
    <!-- <TestBard /> -->
  </div>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue';
import TestBard from "./TestBard.vue";
import ConAct from './ConAct.vue';
import { Recipe, Condition, Action } from '../../../lib/recipeData';
import { FilePlus, PackagePlus } from "lucide-vue-next";



const props = defineProps({
  aiData: {
    type: Object as () => Recipe,
    required: true,
  },
})
// console.log("props.aiData", props.aiData)
// 부모로부터 받아온 props를 통해 conditions와 actions배열 생성

const conditions = ref<Condition[]>([...props.aiData.conditions]);
const actions = ref<Action[]>([...props.aiData.actions]);

// conditions.value.push(...props.aiData.conditions)
// actions.value.push(...props.aiData.actions)

const computedConditions = computed(() => {
  return [...props.aiData.conditions];
});

conditions.value = [...computedConditions.value]

console.log("부모에게 받아온 aiData", props.aiData)

// group화를 위해 계산
const maxGroup = computed(() => Math.max(...actions.value.map((item: Action) => item.andGroup), ...conditions.value.map((item: Condition) => item.andGroup)));
console.log("maxGroup", maxGroup.value)
const groupNums = Array.from({ length: maxGroup.value }, (_, index) => index + 1);

// const conActGroups = ref([]);

const filteredConActs = computed(() => {
  // console.log("filteredConActs() 계산 groupNums:", groupNums);
  return groupNums.map(groupNum => {
    console.log("groupNum", groupNum, typeof(groupNum))
    return {
      groupNum,
      actions: [...actions.value.filter((item: Action) => item.andGroup === groupNum)],
      conditions: [...conditions.value.filter((item: Condition) => item.andGroup === groupNum)],
    };
  });
});

// conActGroups.value = filteredConActs.value;

// console.log(conActGroups.value);

// 자식컴포넌트로부터 데이터가 업데이트 되면
const emits = defineEmits();

const updateData = (aiData : Recipe) => {
  emits("update-data", aiData)
}

</script>

<style scoped></style>