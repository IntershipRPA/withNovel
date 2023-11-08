<template>
  <div class="w-full flex justify-center">
    <button type="button" :class="className" @click='handleOnClick'>AI 요청</button>
  </div>
</template>

<script setup lang='ts'>
import { ref } from "vue";
import { Editor } from '../../../index';
import { requestAi } from "./requestAiBtn"
import { Recipe, Condition, Action } from '../../lib/recipeData'
import { useRightSideStore } from '../../stores/rightSide';

const rightSideStore = useRightSideStore(); // 스토어 인스턴스 생성

const props = defineProps({
  className: {
    type: String,
    default:
      "border-stone-200 bg-white p-4 px-8 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:px-8 sm:shadow-lg text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800",
  },
})

const handleOnClick = async () => {
  console.log("AI요청 버튼 클릭");

  //이전 aiData가 있으면 삭제
  rightSideStore.closeRightSide();


  try {
    const aiData: Recipe = await requestAi()
    console.log("AiData: ", aiData)

    // 스토어에 aiData 저장
    rightSideStore.setAiData(aiData);
    // rightSide 열기
    rightSideStore.openRightSide();
  } catch (error) {
    console.log("ai요청 실패")
  }
};




</script>
